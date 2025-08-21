/*
  Warnings:

  - Added the required column `userId` to the `data` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "data_locale_id_fkey" FOREIGN KEY ("locale_id") REFERENCES "locale" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "data_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_data" ("created_at", "description", "id", "locale_id", "region_id", "updated_at") SELECT "created_at", "description", "id", "locale_id", "region_id", "updated_at" FROM "data";
DROP TABLE "data";
ALTER TABLE "new_data" RENAME TO "data";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
