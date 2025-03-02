/*
  Warnings:

  - You are about to drop the column `password_changed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_changed",
ADD COLUMN     "modified" TEXT DEFAULT '1735669800';
