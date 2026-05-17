-- Past results: date & location are no longer required
ALTER TABLE `past_result_records` MODIFY COLUMN `date` DATETIME(3) NULL;
ALTER TABLE `past_result_records` MODIFY COLUMN `location` VARCHAR(191) NULL;

-- Switch ordering index from date to createdAt since date is now optional
DROP INDEX `past_result_records_date_idx` ON `past_result_records`;
CREATE INDEX `past_result_records_createdAt_idx` ON `past_result_records`(`createdAt`);
