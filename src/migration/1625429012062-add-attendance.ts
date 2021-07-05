import {MigrationInterface, QueryRunner} from "typeorm";

export class addAttendance1625429012062 implements MigrationInterface {
    name = 'addAttendance1625429012062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `attendance` (`id` int NOT NULL AUTO_INCREMENT, `reporter_id` varchar(255) NOT NULL, `level` varchar(255) NOT NULL, `year` varchar(255) NOT NULL, `semester_id` int NOT NULL, `attendance_type` enum ('teacher', 'student') NOT NULL, `reference_no` varchar(255) NOT NULL, `status` enum ('P', 'A') NOT NULL DEFAULT 'A', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modifiedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `attendance`");
    }

}
