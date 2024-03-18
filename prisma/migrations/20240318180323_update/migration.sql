-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_saleProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "saleProduct_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "saleProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_saleProduct" ("created_at", "id", "productId", "quantity", "saleId", "updated_at") SELECT "created_at", "id", "productId", "quantity", "saleId", "updated_at" FROM "saleProduct";
DROP TABLE "saleProduct";
ALTER TABLE "new_saleProduct" RENAME TO "saleProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
