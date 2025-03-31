import { ToolFunctionName } from '../../types';

export const phoneNumberTool = {
  type: 'function',
  name: ToolFunctionName.PhoneNumber,
  description:
    'Zawsze korzystaj z tego narzędzia jeśli wykryjesz numer telefonu. To narzędzie konwertuje numery telefonów na odpowiadające im słowne reprezentacje w języku polskim. Jego głównym celem jest zwiększenie poprawności powtarzania i rozumienia numerów. Narzędzie obsługuje różne formaty numerów i przekształca je na formę słowną',
  parameters: {
    type: 'object',
    properties: {
      phone_number: {
        type: 'string',
        description: 'Numer telefonu.',
      },
    },
  },
};
