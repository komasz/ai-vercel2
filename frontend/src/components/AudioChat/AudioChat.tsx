import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { socket } from '../../services/socket';
import { makeAutoObservable } from 'mobx';
import {
  AudioChatIconButton,
  AudioChatRuningIcon,
  StopAudioIconButton,
  ChatRuningWrapper,
} from './AudioChat.styled';
import { playStartListeningSound, playStopListeningSound, areSoundsAvailable } from '../../utils/soundEffects';

class AudioQueueManager {
  audioQueue: string[] = [];
  isPlaying = false;
  pitchFactor = 0.5;
  onPlayingStateChange: ((isPlaying: boolean) => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPitchFactor(factor: number) {
    this.pitchFactor = factor;
  }

  setOnPlayingStateChange(callback: (isPlaying: boolean) => void) {
    this.onPlayingStateChange = callback;
  }

  addAudioToQueue(audioData: string) {
    const wasEmpty = this.audioQueue.length === 0 && !this.isPlaying;
    this.audioQueue.push(audioData);

    if (wasEmpty) {
      this.playNext();
      if (this.onPlayingStateChange) {
        this.onPlayingStateChange(true);
      }
    }
  }

  async playNext() {
    if (this.isPlaying || this.audioQueue.length === 0) return;

    this.isPlaying = true;
    const audioData = this.audioQueue.shift() as string;
    await this.playAudio(audioData);

    this.isPlaying = false;

    if (this.audioQueue.length > 0) {
      this.playNext();
    } else if (this.onPlayingStateChange) {
      this.onPlayingStateChange(false);
    }
  }

  playAudio(audioBuffer: string): Promise<void> {
    return new Promise(resolve => {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const binaryString = atob(audioBuffer);
      const len = binaryString.length;
      const int16Array = new Int16Array(len / 2);

      for (let i = 0; i < len; i += 2) {
        int16Array[i / 2] =
          binaryString.charCodeAt(i) | (binaryString.charCodeAt(i + 1) << 8);
      }

      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 0x7fff;
      }

      const audioBufferObj = audioContext.createBuffer(
        1,
        float32Array.length,
        audioContext.sampleRate,
      );
      audioBufferObj.copyToChannel(float32Array, 0);

      const source = audioContext.createBufferSource();
      source.buffer = audioBufferObj;
      source.playbackRate.value = this.pitchFactor;

      source.connect(audioContext.destination);
      source.onended = () => resolve();
      source.start(0);
    });
  }

  stopAudio() {
    const wasPlaying = this.isPlaying || this.audioQueue.length > 0;
    this.isPlaying = false;
    this.audioQueue = [];

    if (wasPlaying && this.onPlayingStateChange) {
      this.onPlayingStateChange(false);
    }
  }
}

interface AudioChatProps {
  voiceEnabled: boolean;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
}

let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let processor: ScriptProcessorNode | null = null;
let analyzerNode: AnalyserNode | null = null;

const AudioChat: React.FC<AudioChatProps> = ({
  voiceEnabled,
  onVoiceStart,
  onVoiceStop,
}) => {
  const audioQueueManager = useMemo(() => new AudioQueueManager(), []);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [micPaused, setMicPaused] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);

  // Reference for audio detection state
  const volumeBufferRef = useRef<number[]>(Array(50).fill(0));
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionEnabledRef = useRef<boolean>(false);
  
  // Track when we last received audio from the AI
  const lastAiAudioTimeRef = useRef<number>(0);
  
  // Audio detection settings
  const silenceDetectionThreshold = 15; 
  const bufferLength = 50; 
  const silenceCountThreshold = 45; 
  
  // Check if sounds are available when component mounts
  useEffect(() => {
    setSoundsLoaded(areSoundsAvailable());
  }, []);

  const pauseMicrophone = useCallback(() => {
    if (mediaStream && !micPaused) {
      mediaStream.getTracks().forEach(track => {
        track.enabled = false;
      });
      setMicPaused(true);
      console.log('Microphone paused');
      
      try {
        playStartListeningSound();
      } catch (error) {
        console.error('Failed to play start listening sound:', error);
      }
    }
  }, [micPaused]);

  const resumeMicrophone = useCallback(() => {
    if (mediaStream && micPaused) {
      mediaStream.getTracks().forEach(track => {
        track.enabled = true;
      });
      setMicPaused(false);
      console.log('Microphone resumed');
      
      try {
        playStopListeningSound();
      } catch (error) {
        console.error('Failed to play stop listening sound:', error);
      }
    }
  }, [micPaused]);

  // Analyze audio data to detect silence - FIXED
  const analyzeAudio = useCallback(() => {
    if (!analyzerNode || !detectionEnabledRef.current) return;
    
    // Skip analysis if AI is speaking
    if (aiSpeaking) return;
    
    const dataArray = new Uint8Array(analyzerNode.frequencyBinCount);
    analyzerNode.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    
    // Update buffer
    const newBuffer = [average, ...volumeBufferRef.current.slice(0, -1)];
    volumeBufferRef.current = newBuffer;
    
    // Count samples below threshold
    const silenceCount = newBuffer.filter(vol => vol < silenceDetectionThreshold).length;
    
    // Determine if currently silent based on buffer
    const isSilent = silenceCount >= silenceCountThreshold;
    
    if (isSilent && userSpeaking) {
      // User was speaking but now is silent
      console.log('User stopped speaking, silence detected');
      setUserSpeaking(false);
      
      // Only pause microphone if AI is not already speaking
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (!aiSpeaking && !micPaused) {
          console.log('Pausing microphone after silence detection');
          pauseMicrophone();
        }
      }, 700);
    } else if (!isSilent && !userSpeaking && !aiSpeaking) {
      // User was silent but now is speaking, and AI is not speaking
      console.log('User started speaking');
      setUserSpeaking(true);
      
      // Cancel any pending silence detection
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }
    
    // Schedule next analysis
    requestAnimationFrame(analyzeAudio);
  }, [pauseMicrophone, userSpeaking, aiSpeaking, micPaused]);

  // AI speaking state handler - FIXED
  useEffect(() => {
    audioQueueManager.setOnPlayingStateChange((isPlaying) => {
      console.log(`AI speaking state changed to: ${isPlaying}`);
      setAiSpeaking(isPlaying);
      
      if (isPlaying) {
        // AI started speaking, always pause microphone
        pauseMicrophone();
        
        // Reset userSpeaking state when AI starts speaking
        setUserSpeaking(false);
        
        // Update the last AI audio time
        lastAiAudioTimeRef.current = Date.now();
      } else {
        // AI stopped speaking
        // Wait a short delay before resuming to ensure we don't get cut off
        setTimeout(() => {
          // Always resume if still paused, regardless of userSpeaking state
          if (micPaused) {
            console.log('AI stopped speaking, resuming microphone');
            resumeMicrophone();
          }
        }, 300);
      }
    });
  }, [audioQueueManager, pauseMicrophone, resumeMicrophone, micPaused]);

  // Handle audio response from OpenAI API - FIXED with more aggressive resumption
  useEffect(() => {
    function handleAudioResponse(data: any) {
      // Update the last AI audio time whenever we receive audio
      lastAiAudioTimeRef.current = Date.now();
      
      if (data.delta) {
        audioQueueManager.addAudioToQueue(data.delta);
      }
    }
    
    // Periodically check if we should resume microphone after AI stops talking
    const checkInterval = setInterval(() => {
      const timeSinceLastAudio = Date.now() - lastAiAudioTimeRef.current;
      
      // More aggressive check - if it's been more than 800ms since receiving audio and we're still paused
      if (lastAiAudioTimeRef.current > 0 && timeSinceLastAudio > 800 && micPaused && !aiSpeaking) {
        console.log('No AI audio for 800ms, resuming microphone');
        resumeMicrophone();
        // Reset user speaking state to ensure we start fresh
        setUserSpeaking(false);
      }
    }, 400); // Check more frequently
    
    if (voiceEnabled) {
      socket.on('audioResponse', handleAudioResponse);
    }
    
    return () => {
      socket.off('audioResponse', handleAudioResponse);
      clearInterval(checkInterval);
    };
  }, [voiceEnabled, audioQueueManager, micPaused, resumeMicrophone, aiSpeaking]);

  // Log state changes for debugging
  useEffect(() => {
    console.log(`State update - aiSpeaking: ${aiSpeaking}, micPaused: ${micPaused}, userSpeaking: ${userSpeaking}`);
  }, [aiSpeaking, micPaused, userSpeaking]);

  const handleStartVoiceChat = useCallback(async () => {
    try {
      playStartListeningSound();
    } catch (error) {
      console.error('Failed to play start sound:', error);
    }

    onVoiceStart();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStream = stream;

      audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      
      // Setup analyzer for speech detection
      analyzerNode = audioContext.createAnalyser();
      analyzerNode.fftSize = 256;
      analyzerNode.smoothingTimeConstant = 0.8;
      source.connect(analyzerNode);
      
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = event => {
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);

        const int16Array = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16Array[i] = Math.min(1, Math.max(-1, inputData[i])) * 0x7fff;
        }

        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(int16Array.buffer)),
        );
        socket.emit('audioInput', base64String);
      };
      
      // Start audio analysis
      detectionEnabledRef.current = true;
      requestAnimationFrame(analyzeAudio);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [onVoiceStart, analyzeAudio]);

  const handleStopVoiceChat = useCallback(() => {
    try {
      playStopListeningSound();
    } catch (error) {
      console.error('Failed to play stop sound:', error);
    }

    // Stop audio analysis
    detectionEnabledRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    onVoiceStop();
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    if (analyzerNode) {
      analyzerNode = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    if (processor) {
      processor = null;
    }
    setMicPaused(false);
    setUserSpeaking(false);
  }, [onVoiceStop]);

  if (!voiceEnabled) {
    return (
      <AudioChatIconButton
        onClick={handleStartVoiceChat}
        src="/audio-chat-icon.svg"
        alt="Audio Chat"
      />
    );
  } else {
    return (
      <ChatRuningWrapper>
        <StopAudioIconButton
          onClick={handleStopVoiceChat}
          src="/arrow-back-icon.svg"
          alt="Stop Audio Chat"
        />
        <AudioChatRuningIcon
          onClick={handleStopVoiceChat}
          src="/audio-chat-icon-run.svg"
          alt="Chat runing"
        />
      </ChatRuningWrapper>
    );
  }
};

export default AudioChat;
