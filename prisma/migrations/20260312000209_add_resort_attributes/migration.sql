-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resort" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "passType" TEXT NOT NULL DEFAULT 'INDEPENDENT',
    "verticalDrop" INTEGER NOT NULL DEFAULT 0,
    "numRuns" INTEGER NOT NULL DEFAULT 0,
    "acreage" INTEGER NOT NULL DEFAULT 0,
    "summitElevation" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Resort" ("createdAt", "id", "lat", "lng", "name", "state") SELECT "createdAt", "id", "lat", "lng", "name", "state" FROM "Resort";
DROP TABLE "Resort";
ALTER TABLE "new_Resort" RENAME TO "Resort";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
