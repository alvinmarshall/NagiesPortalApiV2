import {MigrationInterface, QueryRunner} from "typeorm";

export class addToken1624747350610 implements MigrationInterface {
    name = 'addToken1624747350610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `token` (`id` int NOT NULL AUTO_INCREMENT, `is_revoked` tinyint NOT NULL DEFAULT 0, `user_ref` varchar(255) NOT NULL, `role` enum ('admin', 'teacher', 'parent') NOT NULL, `expires` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `message` CHANGE `M_Read` `M_Read` int NOT NULL");
        await queryRunner.query("ALTER TABLE `student` CHANGE `Age` `Age` int NOT NULL");
        await queryRunner.query("ALTER TABLE `teachers` CHANGE `Age` `Age` int NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `teachers` CHANGE `Age` `Age` int(5) NOT NULL");
        await queryRunner.query("ALTER TABLE `student` CHANGE `Age` `Age` int(5) NOT NULL");
        await queryRunner.query("ALTER TABLE `message` CHANGE `M_Read` `M_Read` int(2) NOT NULL");
        await queryRunner.query("DROP TABLE `token`");
    }

}
