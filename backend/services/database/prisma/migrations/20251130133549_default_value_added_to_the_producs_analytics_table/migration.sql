/*
  Warnings:

  - You are about to drop the column `url` on the `ProducsAnalytics` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProducsAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "maxStarsMark" INTEGER NOT NULL DEFAULT 0,
    "minStarsMark" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProducsAnalytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProducsAnalytics" ("id", "maxStarsMark", "minStarsMark", "ordersCount", "productId") SELECT "id", "maxStarsMark", "minStarsMark", "ordersCount", "productId" FROM "ProducsAnalytics";
DROP TABLE "ProducsAnalytics";
ALTER TABLE "new_ProducsAnalytics" RENAME TO "ProducsAnalytics";
CREATE UNIQUE INDEX "ProducsAnalytics_productId_key" ON "ProducsAnalytics"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
