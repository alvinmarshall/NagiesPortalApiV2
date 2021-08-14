import { MigrationInterface, QueryRunner } from 'typeorm';

export class report1628951945074 implements MigrationInterface {
    name = 'report1628951945074';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Students_No`');
        await queryRunner.query('ALTER TABLE `report` ADD `Students_No` varchar(255) NOT NULL');
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Students_Name`');
        await queryRunner.query('ALTER TABLE `report` ADD `Students_Name` varchar(255) NOT NULL');
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Teachers_Email`');
        await queryRunner.query('ALTER TABLE `report` ADD `Teachers_Email` varchar(255) NOT NULL');
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Report_File`');
        await queryRunner.query('ALTER TABLE `report` ADD `Report_File` varchar(255) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Report_File`');
        await queryRunner.query('ALTER TABLE `report` ADD `Report_File` varchar(50) COLLATE "utf8mb4_unicode_ci" NOT NULL');
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Teachers_Email`');
        await queryRunner.query('ALTER TABLE `report` ADD `Teachers_Email` varchar(70) COLLATE "utf8mb4_unicode_ci" NOT NULL');
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Students_Name`');
        await queryRunner.query('ALTER TABLE `report` ADD `Students_Name` varchar(70) COLLATE "utf8mb4_unicode_ci" NOT NULL');
        await queryRunner.query('ALTER TABLE `report` DROP COLUMN `Students_No`');
        await queryRunner.query('ALTER TABLE `report` ADD `Students_No` varchar(11) COLLATE "utf8mb4_unicode_ci" NOT NULL');
    }

}
