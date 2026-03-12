export type Trip = {
  id: number;
  date: string;
  visitNumber: number;
  companions: string;
  favoriteRun: string;
  notes: string;
};

export type Resort = {
  id: number;
  name: string;
  state: string;
  lat: number;
  lng: number;
  passType: string;
  verticalDrop: number;
  numRuns: number;
  acreage: number;
  summitElevation: number;
  trips: Trip[];
};
