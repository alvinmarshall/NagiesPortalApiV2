# NAGIE'S SCHOOL REST API

This REST API was built using Node-Express
## Installation
first install dependencies
```bash
npm i --save
```

## REST EndPoints
You must login to obtain a token
#### UserType
```bash
parent,teacher
```
### User Login
endpoint: http://examplehost.com/api/users/{userType}
##### method: POST
```json
{
    "username": "example@me.com",
    "password": "pwd"
}
```
### Login Response
```json    
{
    "message": "Login Successful",
    "uuid": 1,
    "token": "Bearer VBXzEiLCJsZXZlbCI6IkNyZWNoZSIsInJvbGUi",
    "imageUrl": "./user/uploads/...",
    "role": "example role",
    "status": 200
}
```
# Student's Routes
### Send complaint to class teacher
endpoint: http://examplehost.com/api/students/complaints
#### method: POST
```json
{
  "teacherName":"Lorem ipsum",
  "message": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod "
}
```
```json
{
    "message": "message sent",
    "status": 200,
    "id": 0
}
```
### Get Student Assignment
#### Assignment_Format
```bash
pdf,image
```
endpoint: http://examplehost.com/api/students/assignment_{Assignment_Format}
#### method: GET
```json
{
    "status": 200,
    "count": 1,
    "Assignment": [
        {
            "studentName": "example name",
            "teacherEmail": "example email",
            "fileUrl": "./students/uploads/...",
            "format": "Assignment_Format",
            "date": "2019-07-18T00:00:00.000Z"
        } 
    ]
}
```
### Get Student Report
#### Report_Format
```bash
pdf,image
```
endpoint: http://examplehost.com/api/students/report_{Report_Format}
#### method: GET
```json
{
    "status": 200,
    "count": 1,
    "report": [
        {
            "studentName": "name",
            "teacherEmail": "teacher email",
            "fileUrl": "./students/uploads/...",
            "format": "Report_Format",
            "date": "2019-07-18T00:00:00.000Z"
        }
    ]
}
```

### Get Messages
endpoint: http://examplehost.com/api/students/messages
#### method: GET
```json
{
    "status": 200,
    "count": 1,
    "messages": [
        {
            "sender": "sender",
            "level": "level",
            "content": "testing from nodejs",
            "status": 0,
            "date": "2019-08-25T21:41:29.000Z"
        } 
    ]
}
```

### Class Teachers
endpoint: http://examplehost.com/api/students/teachers
##### method: GET
```json
{
    "status": 200,
    "count": 1,
    "studentTeachers": [
        {
            "uid": "uid",
            "teacherName": "name",
            "gender": "gender",
            "contact": "00000000",
            "imageUrl": "./teachers/uploads/..."
        }
    ]
}
```
### Parent Profile
endpoint: http://examplehost.com/api/users/parent
##### method: GET
```json
{
    "status": 200,
    "studentProfile": {
        "studentNo": "refNo",
        "studentName": "student name",
        "gender": "gender",
        "dob": "2017-08-16T00:00:00.000Z",
        "admissionDate": "2019-01-16T00:00:00.000Z",
        "section": "201x/201x",
        "faculty": "faculty name",
        "level": "level",
        "semester": "semester",
        "index": "index number",
        "guardian": "guardian name",
        "contact": "00000000",
        "imageUrl": "./students/uploads/..."
    }
}
```



# Teacher's Routes
### Parent Complaint Message
endpoint: http://examplehost.com/api/teachers/complaints
##### method: GET
```json
{
    "status": 200,
    "count": 1,
    "Complaints": [
        {
            "studentNo": "refNo",
            "studentName": "student name",
            "level": "level",
            "guardianName": "guardian name",
            "guardianContact": "00000000",
            "teacherName": "teacher name",
            "message": "complaint",
            "date": "2019-08-14T00:00:00.000Z"
        }
    ]
}
```

### Upload Student Assignment
#### Upload_Format
```bash
pdf,image
```
endpoint: http://examplehost.com/api/teachers/assignment_{Upload_Format}
#### method: POST
```bash
Content-Disposition: form-data; name="file"; filename="/C:/filename
```
```json
{
    "status": 200,
    "data": {
        "id": 0,
        "fileUrl": "./students/uploads/...",
        "format": "Upload_Format"
    }
}
```
### Upload Student Report
#### Upload_Format
```bash
pdf,image
```
endpoint: http://examplehost.com/api/teachers/report_{Upload_Format}
#### method: POST
```bash
------WebKitFormBoundary7MA4YWxkTrZu0gW--,
Content-Disposition: form-data; name="studentNo" 0
------WebKitFormBoundary7MA4YWxkTrZu0gW--
Content-Disposition: form-data; name="studentName" student name
------WebKitFormBoundary7MA4YWxkTrZu0gW--
Content-Disposition: form-data; name="file"; filename="/C:/filename
```
```json
{
    "status": 200,
    "data": {
        "id": 0,
        "fileUrl": "./students/uploads/...",
        "format": "Upload_Format"
    }
}
```

### Send message to parent
endpoint: http://examplehost.com/api/teachers/send_message
#### method: POST
```json
{
  "message": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod "
}
```
```json
{
    "message": "message sent",
    "status": 200,
    "id": 0
}
```
### Class Students
endpoint: http://examplehost.com/api/teachers/class_student
##### method: GET
```json
{
    "status": 200,
    "count": 1,
    "classStudent": [
        {
            "studentNo": "refNo",
            "studentName": "student name",
            "gender": "gender",
            "indexNo": "level",
            "imageUrl": "./students/uploads/..."
        }
    ]
}
```
### Teacher Profile
endpoint: http://examplehost.com/api/users/profile
##### method: GET
```json
{
    "status": 200,
    "teacherProfile": {
        "uid": 0,
        "ref": "refNo",
        "name": "name",
        "dob": "2019-05-16T00:00:00.000Z",
        "gender": "gender",
        "contact": "00000000",
        "admissionDate": "2019-05-10T00:00:00.000Z",
        "facultyName": "faculty name",
        "level": "level",
        "username": "username",
        "imageUrl": "./teachers/uploads/..."
    }
}
```
### Circular
endpoint: http://examplehost.com/api/students/circular
##### method: GET
```json
{
    "status": 200,
    "count": 1,
    "Circular": [
        {
            "id": 0,
            "cid": "cid",
            "fileUrl": "./circular/uploads/...",
            "date": "2019-08-16T00:00:00.000Z"
        }
    ]
}
```
### Billing
endpoint: http://examplehost.com/api/students/billing
##### method: GET
```json
{
    "status": 200,
    "count": 1,
    "Billing": [
        {
            "id": 0,
            "refNo": "refNo",
            "studentName": "name",
            "sender": "sender",
            "fileUrl": "./billing/uploads/...",
            "date": "2019-08-16T00:00:00.000Z"
        }
    ]
}
```
### Announcement
```bash
model_type
students,teachers
```
endpoint: http://examplehost.com/api/{model_type}/announcement
##### method: GET
```json
{
    "status": 200,
    "count": 1,
    "messages": [
        {
            "sender": "sender",
            "level": "level",
            "content": "announcement",
            "status": 0,
            "date": "2019-08-14T00:00:00.000Z"
        }
    ]
}
```
