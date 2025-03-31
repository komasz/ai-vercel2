import React, { useEffect, useState } from 'react';

import {
  CommonTopic,
  CommonTopicContainer,
  CommonTopicList,
  Container,
} from './WelcomeComponent.styled';

interface WelcomeComponentProps {
  onCommonTopicClick: (topic: string) => void;
}

export const WelcomeComponent = ({
  onCommonTopicClick,
}: WelcomeComponentProps) => {
  const topics = [
    'Dlaczego trzeba golić włosy przed depilacją laserową?',
    'Co się stanie, jeśli nie zgolę włosów przed zabiegiem?',
    'Czemu nie można usuwać włosów woskiem przed laserem?',
    'Chciałbym umówić się na depilacje nóg',
  ];

  const [randomTopics, setRandomTopics] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...topics].sort(() => 0.5 - Math.random());
    setRandomTopics(shuffled.slice(0, 3));
  }, []);
  return (
    <Container>
      <h2>Jak mogę Ci pomóc?</h2>
      <CommonTopicContainer>
        <CommonTopicList>
          {randomTopics.map((topic, index) => (
            <li key={index}>
              <CommonTopic onClick={() => onCommonTopicClick(topic)}>
                {topic}
              </CommonTopic>
            </li>
          ))}
        </CommonTopicList>
      </CommonTopicContainer>
    </Container>
  );
};
