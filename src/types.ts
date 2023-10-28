export type BatStatus = {
  percentage: number;
  isCharging: boolean;
};

export type BatStatusEntry = BatStatus & { timestamp: number };

export type DataFileType = {
  entries: BatStatusEntry[];
};
