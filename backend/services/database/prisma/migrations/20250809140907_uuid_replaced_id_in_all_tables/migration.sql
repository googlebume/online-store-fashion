/*
  Warnings:

  - The primary key for the `Attributes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Basket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderedProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attributes" (
    "productsId" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "brand" TEXT,
    "material" TEXT,
    "countryOfOrigin" TEXT,
    "weight" REAL,
    CONSTRAINT "Attributes_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attributes" ("brand", "category", "color", "countryOfOrigin", "material", "productsId", "size", "type", "weight") SELECT "brand", "category", "color", "countryOfOrigin", "material", "productsId", "size", "type", "weight" FROM "Attributes";
DROP TABLE "Attributes";
ALTER TABLE "new_Attributes" RENAME TO "Attributes";
CREATE TABLE "new_Basket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "issuePoint" TEXT NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "promoСode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Basket" ("city", "createdAt", "deliveryMethod", "email", "firstName", "id", "issuePoint", "lastName", "phone", "promoСode", "region", "updatedAt") SELECT "city", "createdAt", "deliveryMethod", "email", "firstName", "id", "issuePoint", "lastName", "phone", "promoСode", "region", "updatedAt" FROM "Basket";
DROP TABLE "Basket";
ALTER TABLE "new_Basket" RENAME TO "Basket";
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "orderCode", "userEmail", "userName") SELECT "createdAt", "id", "orderCode", "userEmail", "userName" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("orderCode");
CREATE TABLE "new_OrderedProducts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "basketId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderedProducts_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "Basket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderedProducts" ("basketId", "createdAt", "id", "price", "productName", "quantity", "totalPrice") SELECT "basketId", "createdAt", "id", "price", "productName", "quantity", "totalPrice" FROM "OrderedProducts";
DROP TABLE "OrderedProducts";
ALTER TABLE "new_OrderedProducts" RENAME TO "OrderedProducts";
CREATE INDEX "OrderedProducts_basketId_idx" ON "OrderedProducts"("basketId");
CREATE TABLE "new_Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Products" ("brand", "description", "discount", "id", "image", "name", "price") SELECT "brand", "description", "discount", "id", "image", "name", "price" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_name_key" ON "Products"("name");
CREATE TABLE "new_Reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "reviewTitle" TEXT NOT NULL,
    "rewiew" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reviews_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews" ("id", "reviewTitle", "rewiew", "stars", "userId", "userName") SELECT "id", "reviewTitle", "rewiew", "stars", "userId", "userName" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
