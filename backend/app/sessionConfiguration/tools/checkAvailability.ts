import { ToolFunctionName } from '../../types';

export const checkAvailabilityTool = {
  type: 'function',
  name: ToolFunctionName.CheckAvailability,
  description:
    'Sprawdza dostępność terminów zabiegów. Używaj tej funkcji, gdy użytkownik pyta o wolne terminy. Jeśli użytkownik jest w trakcie potwierdzania rezerwacji, nie używaj tej funkcji.',
  parameters: {
    type: 'object',
    properties: {
      meetingDate: {
        type: 'string',
        description: 'Proponowany termin wizyty (format ISO)',
      },
      duration: {
        type: 'number',
        description: 'Czas trwania zabiegu w minutach. Domyślnie 60 minut.',
        default: 60,
      },
      check: {
        type: 'boolean',
        description:
          'Flaga potwierdzająca zapytanie o dostępność terminu. Musi być ustawiona na true.',
        default: true,
      },
    },
    required: ['meetingDate', 'check'],
  },
};
