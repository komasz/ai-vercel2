import { nylas } from './nylasClient';

export async function checkDepilationAvailability(
  meetingDate: string,
  duration: number = 60,
): Promise<{ available: boolean; conflicts?: any[] }> {
  const startDate = new Date(meetingDate);
  if (isNaN(startDate.getTime())) {
    throw new Error('Niepoprawny format daty spotkania');
  }
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

  try {
    const events = await nylas.events.list({
      identifier: process.env.NYLAS_GRANT_ID as string,
      queryParams: {
        calendarId: process.env.NYLAS_CALENDAR_ID || 'primary',
        start: Math.floor(startDate.getTime() / 1000).toString(),
        end: Math.floor(endDate.getTime() / 1000).toString(),
      },
    });

    if (events.data && Array.isArray(events.data) && events.data.length > 0) {
      return { available: false, conflicts: events.data };
    } else {
      return { available: true };
    }
  } catch (error: any) {
    console.error('Błąd podczas pobierania wydarzeń z Nylas:', error);
    throw error;
  }
}
