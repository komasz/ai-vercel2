import { Socket } from 'socket.io';
import { nylas } from './nylasClient';
import { checkDepilationAvailability } from './checkDepilationAvailability';

export async function handleBookMeeting(
  parsedArgs: any,
  message: any,
  socket: Socket,
) {
  console.log(
    'Handling bookMeeting for:',
    parsedArgs.firstName,
    parsedArgs.lastName,
  );
  try {
    const { firstName, lastName, meetingDate, typZabiegu, phone, email } =
      parsedArgs;
    const startDate = new Date(meetingDate);
    if (isNaN(startDate.getTime())) {
      console.error('Invalid meetingDate format');
      const outputError = {
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: message.call_id,
          output: JSON.stringify({
            success: 'false',
            error: 'Invalid meetingDate format',
          }),
        },
      };
      return outputError;
    }
    const durationMinutes = 60;
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    const eventTitle = `Depilacja: ${typZabiegu} - ${firstName} ${lastName}`;
    const eventDescription = `Klient: ${firstName} ${lastName}\nEmail: ${email}\nTelefon: ${phone}`;

    const grantId = process.env.NYLAS_GRANT_ID || '';

    const availabilityResult = await checkDepilationAvailability(
      meetingDate,
      durationMinutes,
    );
    if (!availabilityResult.available) {
      const outputError = {
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: message.call_id,
          output: JSON.stringify({
            success: 'false',
            error: `Niestety podany termin jest juz zajęty: ${availabilityResult.conflicts}`,
          }),
        },
      };
      return outputError;
    }

    const event = await nylas.events.create({
      identifier: grantId,
      queryParams: {
        calendarId: 'primary',
      },
      requestBody: {
        title: eventTitle,
        description: eventDescription,
        when: {
          startTime: Math.floor(startDate.getTime() / 1000),
          endTime: Math.floor(endDate.getTime() / 1000),
        },
        // participants: [{
        //   email: email,
        //   name: `${firstName} ${lastName}`,
        //   status: 'noreply'
        // }]
      },
    });

    console.log('Booking successful:', event);
    const outputSuccess = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: message.call_id,
        output: JSON.stringify({
          success: 'true',
          bookingConfirmed: event.data.status,
        }),
      },
    };
    return outputSuccess;
  } catch (error: any) {
    console.error('Error booking meeting:', error);
    const outputError = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: message.call_id,
        output: JSON.stringify({
          success: 'false',
          error: 'Error booking meeting',
        }),
      },
    };
    return outputError;
  }
}
