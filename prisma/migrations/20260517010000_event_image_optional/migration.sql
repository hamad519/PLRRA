-- Make event main image optional
ALTER TABLE `events` MODIFY COLUMN `mainImageBase64` LONGTEXT NULL;
