import path from 'node:path';
import { BatStatus, DataFileType } from './types';

const pathToFile = path.join(__dirname, '../data.json');

const ENTRY_COUNT = process.env.ENTRY_COUNT || 10;

export async function createDataFileIfNotExist() {
  const dataFile = Bun.file(pathToFile);
  if (!(await dataFile.exists())) {
    const defaultData: DataFileType = { entries: [] };
    await Bun.write(dataFile, JSON.stringify(defaultData));
  }
}

export async function getLatestEntry() {
  await createDataFileIfNotExist();
  const dataFile = Bun.file(pathToFile);

  const { entries } = (await dataFile.json()) as DataFileType;

  return entries.length ? entries[0] : null;
}

export async function getAllData() {
  await createDataFileIfNotExist();
  const dataFile = Bun.file(pathToFile);

  const data = (await dataFile.json()) as DataFileType;

  return data;
}

export async function addEntry(batStatus: BatStatus) {
  await createDataFileIfNotExist();
  const dataFile = Bun.file(pathToFile);

  const data = (await dataFile.json()) as DataFileType;
  const timestamp = Date.now();

  data.entries.unshift({ ...batStatus, timestamp });
  if (data.entries.length > +ENTRY_COUNT) {
    data.entries.splice(+ENTRY_COUNT - data.entries.length);
  }
  await Bun.write(dataFile, JSON.stringify(data, null, 2));
}
