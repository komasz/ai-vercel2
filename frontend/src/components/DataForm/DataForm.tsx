import React, { useState } from 'react';
import { socket } from '../../services/socket';
import {
  FormContainer,
  FormRowWrapper,
  FormField,
  FormFieldData,
  FormLabel,
  FormInput,
  FormSelect,
  SubmitButton,
} from './DataForm.styled';

interface DataFormProps {
  initialData?: {
    firstName?: string;
    lastName?: string;
    typZabiegu?: string;
    phone?: string;
    email?: string;
    meetingDate?: string;
  };
}

const DataForm: React.FC<DataFormProps> = ({ initialData = {} }) => {
  const initialDay = initialData.meetingDate
    ? parseInt(initialData.meetingDate.split('-')[2], 10).toString()
    : '';
  const initialMonth = initialData.meetingDate
    ? parseInt(initialData.meetingDate.split('-')[1], 10).toString()
    : '';
  const initialYear = initialData.meetingDate
    ? initialData.meetingDate.split('-')[0]
    : '';
  const initialHour = initialData.meetingDate
    ? initialData.meetingDate.split('T')[1].slice(0, 5)
    : '';

  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    typZabiegu: initialData.typZabiegu || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    day: initialDay,
    month: initialMonth,
    year: initialYear,
    hour: initialHour,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.day && formData.month && formData.year && formData.hour) {
      const day = formData.day.padStart(2, '0');
      const month = formData.month.padStart(2, '0');

      let hourFormatted = formData.hour;
      if (formData.hour.length === 5) {
        hourFormatted = `${formData.hour}:00`;
      }
      const meetingDate = `${formData.year}-${month}-${day}T${hourFormatted}`;

      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        typZabiegu: formData.typZabiegu,
        phone: formData.phone,
        email: formData.email,
        meetingDate: meetingDate,
      };

      console.log('Submitted Data:', submissionData);
      socket.emit('confirmData', submissionData);
    } else {
      console.log('Proszę wprowadzić kompletną datę i godzinę.');
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear + i).toString(),
  );

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormRowWrapper>
          <FormField>
            <FormLabel htmlFor="firstName">Imię:</FormLabel>
            <FormInput
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="lastName">Nazwisko:</FormLabel>
            <FormInput
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormField>
        </FormRowWrapper>
        <FormRowWrapper>
          <FormField>
            <FormLabel htmlFor="phone">Telefon:</FormLabel>
            <FormInput
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="email">Email:</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
        </FormRowWrapper>
        <FormRowWrapper>
          <FormField>
            <FormLabel htmlFor="typZabiegu">Typ Zabiegu:</FormLabel>
            <FormInput
              type="text"
              id="typZabiegu"
              name="typZabiegu"
              value={formData.typZabiegu}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="hour">Godzina:</FormLabel>
            <FormInput
              type="text"
              id="hour"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder="HH:mm lub HH:mm:ss"
            />
          </FormField>
        </FormRowWrapper>
        <FormRowWrapper>
          <FormFieldData>
            <FormLabel>Termin:</FormLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              <FormSelect
                name="day"
                value={formData.day}
                onChange={handleChange}
              >
                <option value="">Dzień</option>
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </FormSelect>
              <FormSelect
                name="month"
                value={formData.month}
                onChange={handleChange}
              >
                <option value="">Miesiąc</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </FormSelect>
              <FormSelect
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Rok</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </FormSelect>
            </div>
          </FormFieldData>

          <SubmitButton type="submit">Zarezerwuj</SubmitButton>
        </FormRowWrapper>
      </form>
    </FormContainer>
  );
};

export default DataForm;
