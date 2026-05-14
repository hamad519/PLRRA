-- AlterTable
ALTER TABLE `competitions` ADD COLUMN `galleryMedia` JSON NULL;

-- CreateTable
CREATE TABLE `national_gallery_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `mainImageBase64` LONGTEXT NOT NULL,
    `galleryMedia` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `national_gallery_events_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
