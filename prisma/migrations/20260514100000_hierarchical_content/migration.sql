-- Wipe existing achievements (structure is changing significantly)
DELETE FROM `achievements`;

-- AlterTable: Achievement — drop subtitle, rename details to bullets
ALTER TABLE `achievements` DROP COLUMN `subtitle`;
ALTER TABLE `achievements` CHANGE COLUMN `details` `bullets` JSON NOT NULL;
ALTER TABLE `achievements` MODIFY COLUMN `year` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable: SiteSettings — add aims JSON field
ALTER TABLE `site_settings` ADD COLUMN `aims` JSON NULL;

-- CreateTable: HistorySection
CREATE TABLE `history_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` VARCHAR(191) NOT NULL DEFAULT '',
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `intro` TEXT NOT NULL,
    `iconName` VARCHAR(191) NOT NULL DEFAULT '',
    `bullets` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `history_sections_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
