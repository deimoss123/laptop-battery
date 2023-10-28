import { ActivityType, Client, Events } from 'discord.js';
import { getLatestEntry } from './storage';
import { BatStatusEntry } from './types';

const emojis = {
  chargingIndicator: '⚡',
};

function presenceString(
  { isCharging, percentage }: BatStatusEntry,
  isSleeping: boolean
) {
  if (isSleeping) {
    return `🛌 čuč | Baterija: ${percentage}% (?)`;
  } else if (isCharging) {
    return `${emojis.chargingIndicator} Baterija: ${percentage}% (lādējas)`;
  } else {
    return `Baterija: ${percentage}%`;
  }
}

const SLEEP_TIMEOUT_SECONDS = process.env.SLEEP_TIMEOUT_SECONDS || 300;

async function setBotStatus(client: Client<true>) {
  const batRes = await getLatestEntry();

  if (!batRes) {
    console.log('Failed to get battery percentage');
    return;
  }

  const isSleeping =
    Date.now() - batRes.timestamp > +SLEEP_TIMEOUT_SECONDS * 1000;

  const str = presenceString(batRes, isSleeping);

  console.log('set presence:', str);
  console.log('isSleeping:', isSleeping);

  // šito jādara lai nespamotu statusa maiņu katru minūti, jo diskordam tas nepatīk
  // statusu iestāda, tikai ja tas atšķiras no iepriekšējā
  const newStatus = isSleeping ? 'idle' : 'online';
  if (client.user.presence.status !== newStatus) {
    client.user.setStatus(newStatus);
  }

  client.user.setPresence({
    activities: [
      {
        state: str,
        type: ActivityType.Custom,
        name: '-',
      },
    ],
  });
}

const client = new Client({ intents: [] });

const INTERVAL_SECONDS = 60;

client.once(Events.ClientReady, c => {
  console.log(`Ielogojies ${c.user.tag}`);
  setBotStatus(c);
  setInterval(() => setBotStatus(c), INTERVAL_SECONDS * 1000);
});

client.login(process.env.BOT_TOKEN);
