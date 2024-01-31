/*
  Warnings:

  - You are about to drop the column `termsAccepted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "termsAccepted",
ADD COLUMN     "acceptTerms" BOOLEAN DEFAULT true;
