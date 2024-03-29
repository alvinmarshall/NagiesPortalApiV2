export enum AuthType {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
}

export enum ReadStatus {
  UN_READ = 'Unread',
  READ = 'Read'
}

export enum MessageStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
  DELETED = 'deleted'
}

export enum FileType {
  CIRCULAR = 'circular',
  BILL = 'bill',
  RECEIPT = 'receipt',
  ASSIGNMENT = 'assignment',
  REPORT = 'report',
  VIDEO = 'video'
}

export enum UploadDirectory {
  ASSIGNMENT = 'students/assignment',
  REPORT = 'students/Reports',
  CIRCULAR = 'students/Circular',
  VIDEO = 'students/Video',
  TIMETABLE = 'students/Timetable',
  BILL = 'students/Bill',
  RECEIPT = 'students/Receipt',
  TEACHER = 'teacher/uploads',
}

export enum FirebaseTopic {
  PARENT = 'parent',
  TEACHER = 'teachers',
  GLOBAL = 'global'
}

export enum ReplyStatus {
  NOT_REPLIED = 'notreplied',
  REPLIED = 'replied'
}

export enum PaymentType {
  CASH = 'cash',
  CHEQUE = 'cheque'
}

export enum MessageType {
  COMPLAINT = 'complaint',
  MESSAGE = 'message'
}

export enum AccountStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive'
}

export enum AcademicStatus {
  PASS = 'pass',
  FAIL = 'fail',
  AWAITING = 'resultawaiting',
  IN_ACTIVE = 'inactive'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum AttendanceStatus {
  PRESENT = 'P',
  ABSENT = 'A'
}

export enum AttendanceType {
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum RecipientType {
  TEACHER = 'teacher',
  PARENT = 'parent',
}


export enum StaffRemarks {
  PAID_LEAVE = 'PAID LEAVE',
  UN_PAID_LEAVE = 'UNPAID LEAVE'
}


export enum RecordSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum StaffType {
  TEACHING = 'teaching',
  NON_TEACHING = 'nonteaching'
}

export enum MaritalStatus {
  MARRIED = 'Married',
  NOT_MARRIED = 'Unmarried',
}

export const QUEUE_PROCESS_ID = {
  staffRegistered: 'staffRegistered',
};

export const QUEUE_PROCESSOR = {
  NOTIFICATION: 'notification_queue',
};

export const PROVIDERS = {
  HUBTEL_SERVICE: 'HUBTEL_SERVICE',
};


export enum ParentType {
  FATHER = 'father',
  MOTHER = 'mother',
  GUARDIAN = 'guardian'
}

export const RESOURCE_DEFINITION = {
  ROLES_KEY: 'roles',
};

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  BILLING = 'BILLING',
  PRIMARY = 'PRIMARY',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
}