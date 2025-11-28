# School AI WebModule

## Run locally

1. Start PostgreSQL (Docker):
```bash
docker run -d --name schooldb -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=schooldb -p 5432:5432 postgres:16
```
2. Configure `src/main/resources/application.properties` if needed.
3. Start the app:
```bash
./gradlew bootRun -x test
```

## Swagger UI

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Use Authorize button with: `Bearer <JWT>`.

## Auth

### Login
POST `/api/auth/login`
```json
{
  "schoolName": "My School",
  "username": "teacher@example.com",
  "password": "pass",
  "role": "TEACHER"
}
```
Response includes `token`.

## Registration

### Student
POST `/api/students/register`
```json
{
  "schoolName": "My School",
  "fullName": "John Doe",
  "className": "10-A",
  "password": "pass",
  "medium": "English",
  "email": "john@example.com"
}
```

### Teacher
POST `/api/teacher/register`
```json
{
  "schoolId": 1,
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "pass",
  "subjectId": 2
}
```

## Student Progress

- GET `/api/students/{studentId}/progress`
- GET `/api/students/{studentId}/subjects`
- GET `/api/students/{studentId}/assignments`
- GET `/api/students/{studentId}/performance`
- GET `/api/students/{studentId}/videos`

## Teacher

- POST `/api/teacher/assignments`
```json
{
  "subjectId": 2,
  "teacherId": 5,
  "title": "Algebra HW",
  "dueDate": "2025-10-20",
  "description": "Solve problems 1-10"
}
```
- POST `/api/teacher/topics`
```json
{
  "subjectId": 2,
  "teacherId": 5,
  "className": "10-A",
  "date": "2025-10-12",
  "title": "Quadratic Equations"
}
```

## AI

- POST `/api/ai/ask`
```json
{
  "studentId": 10,
  "question": "Explain photosynthesis",
  "teacherId": 5,
  "subjectId": 3
}
```
- POST `/api/ai/videos`
```json
{
  "subjectId": 3,
  "studentId": 10,
  "topicContext": "Newton's Laws overview",
  "title": "Newton's Laws"
}
```
- POST `/api/ai/assignments/submit` (multipart)
  - field: `file` (image)

## Broadcast (Principal/Manager)

POST `/api/broadcast`
```json
{
  "schoolId": 1,
  "message": "Exam on Friday",
  "type": "INFO",
  "toStudents": true,
  "toTeachers": true
}
```

## Security

Roles enforced via JWT:
- `/api/students/**` -> STUDENT
- `/api/teacher/**` -> TEACHER | PRINCIPAL | MANAGER
- `/api/broadcast/**` -> PRINCIPAL | MANAGER
- `/api/ai/**` -> STUDENT | TEACHER | PRINCIPAL | MANAGER


