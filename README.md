# Collaborative Note-Taking Application

This is the backend of the Collaborative Note-Taking Application, built with NestJS and PostgreSQL, and using Prisma as the ORM. The backend manages user authentication, note creation, note sharing, and real-time collaboration features using WebSockets.

## Project Structure

├── dist/                           # Compiled output
├── logs/                           # Log files (e.g., request and application logs)
│   ├── application-2024-09-15.log
│   └── application-2024-09-16.log
├── node_modules/                   # Node.js modules
├── prisma/
│   ├── migrations/                 # Prisma migrations for database schema
│   └── schema.prisma               # Prisma schema definition
├── src/
│   ├── auth/                       # Authentication module
│   ├── common/                     # Common files and decorators
│   ├── database/                   # Database module and Prisma integration
│   ├── interceptors/               # HTTP request logging interceptors
│   ├── logger/                     # Logging service using Winston
│   ├── messages/                   # Custom response and error messages
│   ├── notes/                      # Notes module (CRUD operations for notes)
│   ├── users/                      # Users module
│   ├── utils/                      # Utility functions (e.g., token generation, hashing)
│   ├── app.controller.ts           # Main application controller
│   ├── app.module.ts               # Application root module
│   ├── app.service.ts              # Application service
│   └── main.ts                     # Application entry point
├── test/                           # Test files
├── .env                            # Environment variables
├── .env.development                # Development environment variables
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Dockerfile for backend service
├── nest-cli.json                   # NestJS CLI configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Project dependencies and scripts
└── README.md                       # Project documentation


## Features

### User Authentication:

- JWT-based authentication using Passport.js.
- Routes for sign-up, sign-in, and user profile retrieval.

### Note Management:

- Create, edit, delete, and share notes.
- Only the owner can delete a note, even if it has been shared.
- Users can see notes shared with them, but they cannot delete them.

### Real-time Collaboration:

- WebSocket-based real-time editing of shared notes.
- Any changes to shared notes are broadcasted in real-time to other collaborators.

### Request Logging:

- HTTP request logs captured using Winston and stored in the `logs/` folder.

## Getting Started

### Prerequisites

- **Node.js** (version 18.x or higher)
- **PostgreSQL** (version 13 or higher)
- **Docker** (for containerization)

### Environment Setup

The application requires a `.env` or `.env.development` file containing the following variables:

```plaintext
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

Running the Application
The application is containerized using Docker. You can run the backend using the docker-compose.yml provided in the project root.

Steps:

1. Build and start the containers:
```bash
docker-compose up --build
Running Prisma Migrations:
```

2. Once the application is up, run the following command to apply the database migrations:
```bash
docker-compose exec app npx prisma migrate deploy
```
3. Access the Application:
The backend API will be available at ```http://localhost:3000/api/v1```.
The real-time WebSocket server will be available at ```http://localhost:3000```.

4.Access PostgreSQL Admin Interface:
The application includes pgAdmin for database management.
Access pgAdmin at ```http://localhost:5050``` (default credentials: ```admin@admin.com``` / ```pgadmin4```).

## Testing the API
You can use Postman or curl to interact with the API endpoints. The API follows RESTful principles and has routes for:

POST /auth/local/signup — User registration
POST /auth/local/signin — User login
GET /auth/local/profile — Fetch user profile
POST /notes — Create a note
GET /notes — Get all notes (including shared ones)
PATCH /notes/:id — Update a note
DELETE /notes/:id — Delete a note

## Logging
All incoming HTTP requests and application-level logs are captured using **Winston** and stored in the ```logs/``` folder. Logs are rotated daily to keep the files manageable.

Example log path: ```logs/application-YYYY-MM-DD.log```

## Swagger Documentation
API documentation is generated using Swagger and is accessible at ```http://localhost:3000/api/v1/docs``` (in development mode).

# Development
For development, use the following commands:

**Start the application:
**
```bash
npm run dev
Lint the project:
```

```bash
npm run lint
Run tests:
```

```bash
npm run test
```
## Deployment
For production, the application is Dockerized and can be easily deployed using container orchestration tools like Kubernetes or AWS ECS. Make sure to update your .env for production use and ensure the correct database credentials and JWT secrets are in place.

# Technologies Used
**NestJS** — A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
**PostgreSQL** — An open-source relational database system.
**Prisma** — ORM for seamless database migrations and queries.
**WebSocket** — For real-time communication in shared note editing.
**Docker** — Containerization of the application.
**Winston** — Logging library to capture and store logs.
**License**
This project is licensed under the **MIT License**.



