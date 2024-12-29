/*
  Warnings:

  - You are about to drop the `GastoFijo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `CategoryGasto` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CategoryIngreso` table. All the data in the column will be lost.
  - You are about to drop the column `cant_cuotas` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `cant_cuotas` on the `Presupuesto` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GastoFijo";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoryGasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_CategoryGasto" ("id", "name") SELECT "id", "name" FROM "CategoryGasto";
DROP TABLE "CategoryGasto";
ALTER TABLE "new_CategoryGasto" RENAME TO "CategoryGasto";
CREATE TABLE "new_CategoryIngreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_CategoryIngreso" ("id", "name") SELECT "id", "name" FROM "CategoryIngreso";
DROP TABLE "CategoryIngreso";
ALTER TABLE "new_CategoryIngreso" RENAME TO "CategoryIngreso";
CREATE TABLE "new_Gasto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL,
    "description" TEXT,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "Gasto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Gasto_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryGasto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Gasto" ("category_id", "fecha", "id", "monto", "user_id") SELECT "category_id", "fecha", "id", "monto", "user_id" FROM "Gasto";
DROP TABLE "Gasto";
ALTER TABLE "new_Gasto" RENAME TO "Gasto";
CREATE TABLE "new_Ingreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monto" REAL NOT NULL,
    "description" TEXT,
    "fecha" DATETIME NOT NULL,
    "category_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Ingreso_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryIngreso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ingreso_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ingreso" ("category_id", "description", "fecha", "id", "monto", "user_id") SELECT "category_id", "description", "fecha", "id", "monto", "user_id" FROM "Ingreso";
DROP TABLE "Ingreso";
ALTER TABLE "new_Ingreso" RENAME TO "Ingreso";
CREATE TABLE "new_Presupuesto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "montoTotal" REAL NOT NULL,
    "fecha_objetivo" DATETIME NOT NULL,
    "total_acumulado" REAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Presupuesto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Presupuesto" ("descripcion", "fecha_objetivo", "id", "montoTotal", "total_acumulado", "user_id") SELECT "descripcion", "fecha_objetivo", "id", "montoTotal", "total_acumulado", "user_id" FROM "Presupuesto";
DROP TABLE "Presupuesto";
ALTER TABLE "new_Presupuesto" RENAME TO "Presupuesto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
