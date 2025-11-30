/*
  Warnings:

  - Added the required column `productId` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ProducsAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordersCount" INTEGER NOT NULL,
    "maxStarsMark" INTEGER NOT NULL,
    "minStarsMark" INTEGER NOT NULL,
    CONSTRAINT "ProducsAnalytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "reviewTitle" TEXT NOT NULL,
    "rewiew" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reviews_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews" ("id", "reviewTitle", "rewiew", "stars", "userId", "userName") SELECT "id", "reviewTitle", "rewiew", "stars", "userId", "userName" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProducsAnalytics_productId_key" ON "ProducsAnalytics"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProducsAnalytics_url_key" ON "ProducsAnalytics"("url");
