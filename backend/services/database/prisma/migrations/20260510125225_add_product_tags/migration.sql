-- DropIndex
DROP INDEX "Order_promoCodeId_idx";

-- CreateTable
CREATE TABLE "product_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "productId" TEXT,
    "path" TEXT,
    "durationMs" INTEGER,
    "payload" JSONB,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AnalyticsEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProductTagToProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductTagToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "product_tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductTagToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reviews_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews" ("id", "productId", "reviewTitle", "rewiew", "stars", "userId", "userName") SELECT "id", "productId", "reviewTitle", "rewiew", "stars", "userId", "userName" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
CREATE UNIQUE INDEX "Reviews_userId_productId_key" ON "Reviews"("userId", "productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "product_tags_name_key" ON "product_tags"("name");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_name_idx" ON "AnalyticsEvent"("name");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductTagToProducts_AB_unique" ON "_ProductTagToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductTagToProducts_B_index" ON "_ProductTagToProducts"("B");
