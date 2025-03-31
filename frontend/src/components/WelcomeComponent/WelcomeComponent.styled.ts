import styled from '@emotion/styled';

import { theme } from '../../styles/theme';

export const Container = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CommonTopicContainer = styled.div`
  margin-top: 20px;
  text-align: center;

  span {
    font-size: 14px;
    font-weight: 400;
  }
`;
export const CommonTopicList = styled.ul`
  margin-top: 15px;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 0;
  align-items: center;

  @media (min-width: 768px) {
    margin-top: 5px;
    flex-wrap: nowrap;
  }
`;
export const CommonTopic = styled.button`
  padding: 5px;
  margin-right: 5px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.black};
  border: 1px solid ${theme.colors.greyBorder};
`;
