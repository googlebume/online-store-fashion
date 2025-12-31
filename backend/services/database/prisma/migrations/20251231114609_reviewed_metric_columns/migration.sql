/*
  Warnings:

  - You are about to drop the column `maxStarsMark` on the `ProducsAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `minStarsMark` on the `ProducsAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `ordersCount` on the `ProducsAnalytics` table. All the data in the column will be lost.
  - Added the required column `clicks` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxRating` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minRating` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orders` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviews` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `views` to the `ProducsAnalytics` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProducsAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "orders" INTEGER NOT NULL,
    "reviews" INTEGER NOT NULL,
    "maxRating" REAL NOT NULL,
    "minRating" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProducsAnalytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProducsAnalytics" ("id", "productId") SELECT "id", "productId" FROM "ProducsAnalytics";
DROP TABLE "ProducsAnalytics";
ALTER TABLE "new_ProducsAnalytics" RENAME TO "ProducsAnalytics";
CREATE UNIQUE INDEX "ProducsAnalytics_productId_key" ON "ProducsAnalytics"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
