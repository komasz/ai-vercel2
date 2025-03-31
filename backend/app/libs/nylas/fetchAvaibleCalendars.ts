import 'dotenv/config';
import { nylas } from './nylasClient';

async function fetchFiveAvailableCalendars() {
  try {
    const calendars = await nylas.calendars.list({
      identifier: process.env.NYLAS_GRANT_ID as string,
      limit: 5,
    });

    console.log('Available Calendars:', calendars);
  } catch (error) {
    console.error('Error fetching calendars:', error);
  }
}

fetchFiveAvailableCalendars();
