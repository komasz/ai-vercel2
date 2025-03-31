import styled from '@emotion/styled';

export const FormContainer = styled.div`
  margin: 0 auto;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

export const FormRowWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const FormField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  width: 49%;
`;

export const FormFieldData = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 4px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const FormSelect = styled.select`
  width: 28%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const SubmitButton = styled.button`
  padding: 10px 16px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
