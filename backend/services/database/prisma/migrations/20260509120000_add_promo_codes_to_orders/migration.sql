CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" REAL NOT NULL,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isInfinite" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "minProductPrice" REAL,
    "maxProductPrice" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PromoCodeProductType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "promoCodeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "PromoCodeProductType_promoCodeId_fkey"
      FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");
CREATE UNIQUE INDEX "PromoCodeProductType_promoCodeId_type_key" ON "PromoCodeProductType"("promoCodeId", "type");

ALTER TABLE "Order" ADD COLUMN "promoCodeId" TEXT REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Order" ADD COLUMN "subtotal" REAL NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "promoDiscountTotal" REAL NOT NULL DEFAULT 0;

ALTER TABLE "OrderItem" ADD COLUMN "originalPrice" REAL NOT NULL DEFAULT 0;
ALTER TABLE "OrderItem" ADD COLUMN "discountAmount" REAL NOT NULL DEFAULT 0;

CREATE INDEX "Order_promoCodeId_idx" ON "Order"("promoCodeId");
