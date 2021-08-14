import { MigrationInterface, QueryRunner } from 'typeorm';

export class receipt1628953634118 implements MigrationInterface {
    name = 'receipt1628953634118';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `receipt` CHANGE `Date` `Date` datetime NULL DEFAULT CURRENT_TIMESTAMP');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `receipt` CHANGE `Date` `Date` datetime NULL');
    }

}
