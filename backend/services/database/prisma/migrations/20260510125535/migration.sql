/*
  Warnings:

  - You are about to drop the `_ProductTagToProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProductTagToProducts";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "product_tags";
PRAGMA foreign_keys=on;
