import * as line from '@line/bot-sdk';
import dotenv from 'dotenv';
dotenv.config();

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