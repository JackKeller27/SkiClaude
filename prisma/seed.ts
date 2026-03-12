import { config } from "dotenv";
config({ path: ".env" });

import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

const resorts = [
  // Vermont
  { name: "Stowe",              state: "VT", lat: 44.5303, lng: -72.7814, passType: "EPIC",        verticalDrop: 2160, numRuns: 116, acreage: 485,  summitElevation: 4395 },
  { name: "Killington",         state: "VT", lat: 43.6045, lng: -72.8201, passType: "EPIC",        verticalDrop: 3050, numRuns: 155, acreage: 1509, summitElevation: 4241 },
  { name: "Sugarbush",          state: "VT", lat: 44.1373, lng: -72.9117, passType: "IKON",        verticalDrop: 2600, numRuns: 111, acreage: 578,  summitElevation: 4083 },
  { name: "Mad River Glen",     state: "VT", lat: 44.1901, lng: -72.9284, passType: "INDEPENDENT", verticalDrop: 2037, numRuns: 53,  acreage: 115,  summitElevation: 3637 },
  { name: "Stratton",           state: "VT", lat: 43.1123, lng: -72.9079, passType: "IKON",        verticalDrop: 2003, numRuns: 99,  acreage: 670,  summitElevation: 3875 },
  { name: "Mount Snow",         state: "VT", lat: 42.9601, lng: -72.9223, passType: "EPIC",        verticalDrop: 1700, numRuns: 80,  acreage: 588,  summitElevation: 3600 },
  { name: "Okemo",              state: "VT", lat: 43.4012, lng: -72.7201, passType: "EPIC",        verticalDrop: 2200, numRuns: 121, acreage: 667,  summitElevation: 3344 },
  { name: "Smugglers' Notch",   state: "VT", lat: 44.5601, lng: -72.7934, passType: "INDEPENDENT", verticalDrop: 2610, numRuns: 78,  acreage: 311,  summitElevation: 3640 },
  { name: "Jay Peak",           state: "VT", lat: 44.9262, lng: -72.5223, passType: "IKON",        verticalDrop: 2153, numRuns: 78,  acreage: 385,  summitElevation: 3968 },
  // New Hampshire
  { name: "Loon Mountain",      state: "NH", lat: 44.0348, lng: -71.6223, passType: "EPIC",        verticalDrop: 2100, numRuns: 61,  acreage: 370,  summitElevation: 3050 },
  { name: "Cannon Mountain",    state: "NH", lat: 44.1562, lng: -71.6978, passType: "INDEPENDENT", verticalDrop: 2180, numRuns: 72,  acreage: 285,  summitElevation: 4080 },
  { name: "Waterville Valley",  state: "NH", lat: 43.9689, lng: -71.5145, passType: "INDEPENDENT", verticalDrop: 2020, numRuns: 52,  acreage: 255,  summitElevation: 4004 },
  { name: "Bretton Woods",      state: "NH", lat: 44.2584, lng: -71.4423, passType: "INDEPENDENT", verticalDrop: 1500, numRuns: 102, acreage: 434,  summitElevation: 3100 },
  { name: "Sunapee",            state: "NH", lat: 43.3262, lng: -72.0784, passType: "EPIC",        verticalDrop: 1510, numRuns: 66,  acreage: 233,  summitElevation: 2743 },
  // Maine
  { name: "Sunday River",       state: "ME", lat: 44.4712, lng: -70.8556, passType: "IKON",        verticalDrop: 2340, numRuns: 135, acreage: 870,  summitElevation: 3168 },
  { name: "Sugarloaf",          state: "ME", lat: 45.0312, lng: -70.3134, passType: "IKON",        verticalDrop: 2820, numRuns: 162, acreage: 1240, summitElevation: 4237 },
  { name: "Saddleback",         state: "ME", lat: 44.8734, lng: -70.5201, passType: "INDEPENDENT", verticalDrop: 1830, numRuns: 66,  acreage: 165,  summitElevation: 4120 },
  // New York
  { name: "Hunter Mountain",    state: "NY", lat: 42.1801, lng: -74.2223, passType: "IKON",        verticalDrop: 1600, numRuns: 67,  acreage: 240,  summitElevation: 3200 },
  { name: "Whiteface",          state: "NY", lat: 44.3662, lng: -73.9012, passType: "INDEPENDENT", verticalDrop: 3430, numRuns: 90,  acreage: 288,  summitElevation: 4867 },
  { name: "Gore Mountain",      state: "NY", lat: 43.6734, lng: -74.0056, passType: "INDEPENDENT", verticalDrop: 2537, numRuns: 109, acreage: 441,  summitElevation: 3600 },
  { name: "Belleayre",          state: "NY", lat: 42.1423, lng: -74.4934, passType: "INDEPENDENT", verticalDrop: 1404, numRuns: 50,  acreage: 175,  summitElevation: 3375 },
  { name: "Windham Mountain",   state: "NY", lat: 42.2923, lng: -74.2578, passType: "IKON",        verticalDrop: 1600, numRuns: 54,  acreage: 285,  summitElevation: 3100 },
  // Massachusetts
  { name: "Ski Butternut",      state: "MA", lat: 42.1612, lng: -73.3634, passType: "INDEPENDENT", verticalDrop: 1000, numRuns: 22,  acreage: 110,  summitElevation: 1800 },
  { name: "Jiminy Peak",        state: "MA", lat: 42.5712, lng: -73.2923, passType: "INDEPENDENT", verticalDrop: 1150, numRuns: 45,  acreage: 167,  summitElevation: 2380 },
  { name: "Wachusett Mountain", state: "MA", lat: 42.4962, lng: -71.8934, passType: "INDEPENDENT", verticalDrop: 1000, numRuns: 27,  acreage: 215,  summitElevation: 2006 },
  // Connecticut
  { name: "Mount Southington",  state: "CT", lat: 41.5823, lng: -72.8734, passType: "INDEPENDENT", verticalDrop: 425,  numRuns: 14,  acreage: 40,   summitElevation: 1066 },
  { name: "Mohawk Mountain",    state: "CT", lat: 41.8734, lng: -73.1334, passType: "INDEPENDENT", verticalDrop: 650,  numRuns: 26,  acreage: 110,  summitElevation: 1600 },
  // Pennsylvania
  { name: "Shawnee Mountain",   state: "PA", lat: 40.9823, lng: -75.0634, passType: "INDEPENDENT", verticalDrop: 700,  numRuns: 23,  acreage: 125,  summitElevation: 1350 },
  { name: "Blue Mountain",      state: "PA", lat: 40.6834, lng: -75.8212, passType: "INDEPENDENT", verticalDrop: 1082, numRuns: 40,  acreage: 162,  summitElevation: 1082 },
  { name: "Camelback",          state: "PA", lat: 41.0634, lng: -75.3212, passType: "IKON",        verticalDrop: 800,  numRuns: 34,  acreage: 168,  summitElevation: 2133 },
];

async function main() {
  console.log("Seeding resorts...");
  // Clear and re-seed to pick up new fields
  await prisma.resort.deleteMany();
  await prisma.resort.createMany({ data: resorts });
  console.log(`Seeded ${resorts.length} resorts.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
