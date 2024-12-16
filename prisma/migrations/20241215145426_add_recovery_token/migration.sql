/*
  Warnings:

  - You are about to drop the `Ahorro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `Gasto` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Ahorro";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CategoryGasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CategoryIngreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GastoFijo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "fecha_inicial" DATETIME NOT NULL,
    "cant_meses" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "GastoFijo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GastoFijo_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryGasto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "category_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Ingreso_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryIngreso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ingreso_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presupuesto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "montoTotal" REAL NOT NULL,
    "cant_cuotas" INTEGER NOT NULL DEFAULT 1,
    "fecha_objetivo" DATETIME NOT NULL,
    "total_acumulado" REAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Presupuesto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ahorro_Presupuesto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL,
    "presupuesto_id" INTEGER NOT NULL,
    CONSTRAINT "Ahorro_Presupuesto_presupuesto_id_fkey" FOREIGN KEY ("presupuesto_id") REFERENCES "Presupuesto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "cant_cuotas" INTEGER NOT NULL DEFAULT 1,
    "fecha" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "Gasto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Gasto_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryGasto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Gasto" ("cant_cuotas", "category_id", "fecha", "id", "monto", "user_id") SELECT "cant_cuotas", "category_id", "fecha", "id", "monto", "user_id" FROM "Gasto";
DROP TABLE "Gasto";
ALTER TABLE "new_Gasto" RENAME TO "Gasto";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "saldo" REAL NOT NULL DEFAULT 0,
    "recoveryToken" TEXT,
    "recoveryTokenExpiresAt" DATETIME
);
INSERT INTO "new_User" ("id", "mail", "name") SELECT "id", "mail", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
