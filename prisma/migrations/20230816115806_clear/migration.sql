/*
  Warnings:

  - You are about to drop the column `CreatorId` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `notes` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_CreatorId_fkey`;

-- AlterTable
ALTER TABLE `notes` DROP COLUMN `CreatorId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `creatorId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
