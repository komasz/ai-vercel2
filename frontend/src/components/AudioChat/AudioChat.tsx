import React, { useCallback, useEffect, useMemo } from 'react';
import { socket } from '../../services/socket';
import { makeAutoObservable } from 'mobx';
import {
  AudioChatIconButton,
  AudioChatRuningIcon,
  StopAudioIconButton,
  ChatRuningWrapper,
} from './AudioChat.styled';

class AudioQueueManager {
  audioQueue: string[] = [];
  isPlaying = false;
  pitchFactor = 0.5;

  constructor() {
    makeAutoObservable(this);
  }

  setPitchFactor(factor: number) {
    this.pitchFactor = factor;
  }

  addAudioToQueue(audioData: string) {
    this.audioQueue.push(audioData);
    this.playNext();
  }

  async playNext() {
    if (this.isPlaying || this.audioQueue.length === 0) return;

    this.isPlaying = true;
    const audioData = this.audioQueue.shift() as string;
    await this.playAudio(audioData);

    this.isPlaying = false;
    this.playNext();
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
    this.isPlaying = false;
    this.audioQueue = [];
  }
}

interface AudioChatProps {
  voiceEnabled: boolean;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
}

let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;

const AudioChat: React.FC<AudioChatProps> = ({
  voiceEnabled,
  onVoiceStart,
  onVoiceStop,
}) => {
  const audioQueueManager = useMemo(() => new AudioQueueManager(), []);

  const handleStartVoiceChat = useCallback(async () => {
    onVoiceStart();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
        },
      });
      mediaStream = stream;

      audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

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
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [onVoiceStart]);

  const handleStopVoiceChat = useCallback(() => {
    onVoiceStop();
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }, [onVoiceStop]);

  useEffect(() => {
    function handleAudioResponse(data: any) {
      if (data.delta) {
        audioQueueManager.addAudioToQueue(data.delta);
      }
    }
    if (voiceEnabled) {
      socket.on('audioResponse', handleAudioResponse);
    }
    return () => {
      socket.off('audioResponse', handleAudioResponse);
    };
  }, [voiceEnabled, audioQueueManager]);

  useEffect(() => {
    function handleSpeechStarted() {
      audioQueueManager.stopAudio();
    }
    socket.on('speechStarted', handleSpeechStarted);
    return () => {
      socket.off('speechStarted', handleSpeechStarted);
    };
  }, [audioQueueManager]);

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
