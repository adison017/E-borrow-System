import * as line from '@line/bot-sdk';
import dotenv from 'dotenv';
dotenv.config();


// Check for required LINE credentials
if (!process.env.token || !process.env.secretcode) {
  console.error('ERROR: LINE channel access token or secret is missing. Please set "token" and "secretcode" in your .env file.');
  process.exit(1);
}

const client = new line.Client({
  channelAccessToken: process.env.token,
  channelSecret: process.env.secretcode,
});

export async function sendLineNotify(lineId, message) {
  if (!lineId) return;
  try {
    await client.pushMessage(lineId, message);
  } catch (err) {
    console.error('Error sending LINE message:', err);
  }
}