/*
  Warnings:

  - You are about to drop the column `recoveryToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `recoveryTokenExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PasswordRecoveryToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "PasswordRecoveryToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "saldo" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("id", "mail", "name", "password", "saldo") SELECT "id", "mail", "name", "password", "saldo" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
