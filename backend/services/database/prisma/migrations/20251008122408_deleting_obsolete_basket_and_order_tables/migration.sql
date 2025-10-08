/*
  Warnings:

  - You are about to drop the `Basket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderedProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Basket";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrderedProducts";
PRAGMA foreign_keys=on;
