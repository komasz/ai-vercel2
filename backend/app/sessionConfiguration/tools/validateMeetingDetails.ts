import { ToolFunctionName } from '../../types';

export const validateMeetingDetailsTool = {
  type: 'function',
  name: ToolFunctionName.ValidateMeetingDetails,
  description:
    'Weryfikuje dane podane przez użytkownika przed finalnym potwierdzeniem rezerwacji. Nigdy nie uzupełniaj danych samemu przykładowymi danymi. Zawsze zapytaj użytkownika, czy dane są poprawne i czy chce kontynuować proces rezerwacji. Nigdy nie zakładaj poprawności danych bez potwierdzenia użytkownika. Nowe dane podane przez usera są wazniejsze niz te w konwersacji i to je bierz pod uwage w pierwszej kolejnosci przy poprawkach',
  parameters: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        description: 'Imię klienta',
      },
      lastName: {
        type: 'string',
        description: 'Nazwisko klienta',
      },
      meetingDate: {
        type: 'string',
        description: 'Data i godzina spotkania (format ISO)',
      },
      typZabiegu: {
        type: 'string',
        description: 'Rodzaj zabiegu depilacji',
      },
      phone: {
        type: 'string',
        description:
          'Numer telefonu klienta. Musi składać się **dokładnie** z 9 cyfr, bez spacji ani znaków specjalnych.',
        pattern: '^\\d{9}$',
      },
      email: {
        type: 'string',
        description:
          'Adres email klienta. Musi być w poprawnym formacie (np. użytkownik@domena.com). AI zawsze powtarza email użytkownikowi i pyta o potwierdzenie poprawności. Nie poprawiaj literówek i nie zmieniaj znaków. Jeśli masz problem z zapisaniem nazwiska poproś uytkownika o przeliterowanie. Nigdy nie zakładaj, że adres e-mail użytkownika zawiera jego nazwisko. Zawsze pytaj o poprawny adres e-mail, nawet jeśli wydaje się nie pasować do nazwiska.',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
      isDataCorrect: {
        type: 'boolean',
        description:
          'Flaga potwierdzająca poprawność danych przez użytkownika. Musi być ustawiona na true, aby przejść do kolejnego kroku.',
        default: false,
      },
    },
    required: [
      'firstName',
      'lastName',
      'meetingDate',
      'typZabiegu',
      'phone',
      'email',
    ],
  },
};
