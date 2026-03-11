import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

const resorts = [
  { name: "Stowe", state: "VT", lat: 44.5303, lng: -72.7814 },
  { name: "Killington", state: "VT", lat: 43.6045, lng: -72.8201 },
  { name: "Sugarbush", state: "VT", lat: 44.1373, lng: -72.9117 },
  { name: "Mad River Glen", state: "VT", lat: 44.1901, lng: -72.9284 },
  { name: "Stratton", state: "VT", lat: 43.1123, lng: -72.9079 },
  { name: "Mount Snow", state: "VT", lat: 42.9601, lng: -72.9223 },
  { name: "Okemo", state: "VT", lat: 43.4012, lng: -72.7201 },
  { name: "Smugglers' Notch", state: "VT", lat: 44.5601, lng: -72.7934 },
  { name: "Jay Peak", state: "VT", lat: 44.9262, lng: -72.5223 },
  { name: "Loon Mountain", state: "NH", lat: 44.0348, lng: -71.6223 },
  { name: "Cannon Mountain", state: "NH", lat: 44.1562, lng: -71.6978 },
  { name: "Waterville Valley", state: "NH", lat: 43.9689, lng: -71.5145 },
  { name: "Bretton Woods", state: "NH", lat: 44.2584, lng: -71.4423 },
  { name: "Sunapee", state: "NH", lat: 43.3262, lng: -72.0784 },
  { name: "Sunday River", state: "ME", lat: 44.4712, lng: -70.8556 },
  { name: "Sugarloaf", state: "ME", lat: 45.0312, lng: -70.3134 },
  { name: "Saddleback", state: "ME", lat: 44.8734, lng: -70.5201 },
  { name: "Hunter Mountain", state: "NY", lat: 42.1801, lng: -74.2223 },
  { name: "Whiteface", state: "NY", lat: 44.3662, lng: -73.9012 },
  { name: "Gore Mountain", state: "NY", lat: 43.6734, lng: -74.0056 },
  { name: "Belleayre", state: "NY", lat: 42.1423, lng: -74.4934 },
  { name: "Windham Mountain", state: "NY", lat: 42.2923, lng: -74.2578 },
  { name: "Ski Butternut", state: "MA", lat: 42.1612, lng: -73.3634 },
  { name: "Jiminy Peak", state: "MA", lat: 42.5712, lng: -73.2923 },
  { name: "Wachusett Mountain", state: "MA", lat: 42.4962, lng: -71.8934 },
  { name: "Mount Southington", state: "CT", lat: 41.5823, lng: -72.8734 },
  { name: "Mohawk Mountain", state: "CT", lat: 41.8734, lng: -73.1334 },
  { name: "Shawnee Mountain", state: "PA", lat: 40.9823, lng: -75.0634 },
  { name: "Blue Mountain", state: "PA", lat: 40.6834, lng: -75.8212 },
  { name: "Camelback", state: "PA", lat: 41.0634, lng: -75.3212 },
];

async function main() {
  console.log("Seeding resorts...");
  for (const resort of resorts) {
    await prisma.resort.upsert({
      where: { id: resorts.indexOf(resort) + 1 },
      update: resort,
      create: resort,
    });
  }
  console.log(`Seeded ${resorts.length} resorts.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
