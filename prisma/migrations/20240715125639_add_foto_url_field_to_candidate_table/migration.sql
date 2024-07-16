/*
  Warnings:

  - Added the required column `foto_url` to the `candidatos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidatos` ADD COLUMN `foto_url` VARCHAR(191) NOT NULL;
