-- Events: add fromDate / toDate, keep date as nullable legacy column
ALTER TABLE `events` ADD COLUMN `fromDate` DATETIME(3) NULL;
ALTER TABLE `events` ADD COLUMN `toDate` DATETIME(3) NULL;
UPDATE `events` SET `fromDate` = `date`, `toDate` = `date` WHERE `fromDate` IS NULL;
ALTER TABLE `events` MODIFY COLUMN `fromDate` DATETIME(3) NOT NULL;
ALTER TABLE `events` MODIFY COLUMN `toDate` DATETIME(3) NOT NULL;
ALTER TABLE `events` MODIFY COLUMN `date` DATETIME(3) NULL;
DROP INDEX `events_date_idx` ON `events`;
CREATE INDEX `events_fromDate_idx` ON `events`(`fromDate`);

-- SiteSettings: constitution PDF
ALTER TABLE `site_settings` ADD COLUMN `constitutionPdfBase64` LONGTEXT NULL;
