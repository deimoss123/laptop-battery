import { Elysia, t } from 'elysia';
import './bot';
import { addEntry, createDataFileIfNotExist, getAllData } from './storage';
import { BatStatus } from './types';

const app = new Elysia();

await createDataFileIfNotExist();

function parseAcpiString(text: string): BatStatus | null {
  // stupid regex that chatgpt generated
  const regexPattern = /(\d+)%|(\w+),/g;

  let matches;
  let percentage = null;
  let chargingStatus = null;

  while ((matches = regexPattern.exec(text)) !== null) {
    if (matches[1]) {
      percentage = matches[1];
    } else if (matches[2]) {
      chargingStatus = matches[2];
    }
  }

  if (!chargingStatus || percentage == null) {
    return null;
  }

  return {
    percentage: +percentage,
    isCharging: chargingStatus === 'Charging' || chargingStatus === 'Full',
  };
}

app.post(
  '/thinkpad/send-acpi',
  async req => {
    const { text, token } = req.body;
    if (token !== process.env.API_TOKEN) {
      req.set.status = 401;
      return 'Nepareizs tokens';
    }

    const res = parseAcpiString(text);

    if (!res) {
      req.set.status = 400;
      return 'Neizdevās parsot Acpi stringu';
    }

    try {
      await addEntry(res);
      return 'Veiksmīgi!';
    } catch (e) {
      console.log(e);
      req.set.status = 400;
      return 'Neizdevās saglabāt baterijas datus';
    }
  },
  {
    body: t.Object({ text: t.String(), token: t.String() }),
  }
);

app.get('/thinkpad/baterija', async req => {
  const res = await getAllData();
  return res;
});

app.listen(process.env.PORT || 3000);

console.log(`API klausās ${app.server?.hostname}:${app.server?.port}`);
