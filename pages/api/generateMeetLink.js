import { google } from 'googleapis';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { className, startTime, endTime, instructorEmail, studentEmail, timeZone } = req.body;

    try {
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const event = {
        summary: className,
        description: 'Join the Google Meet for your class',
        start: {
          dateTime: startTime, 
          timeZone: timeZone || 'America/Toronto',
        },
        end: {
          dateTime: endTime,
          timeZone: timeZone || 'America/Toronto',
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        attendees: [
          { email: studentEmail },
          { email: instructorEmail },
        ],
        guestsCanInviteOthers: true, 
        guestsCanSeeOtherGuests: true,
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      });

      const meetLink = response.data.hangoutLink;

      res.status(200).json({ meetLink });
    } catch (error) {
      console.error('Error creating Google Meet link:', error);
      res.status(500).json({ error: 'Failed to create Google Meet link' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
