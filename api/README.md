# 🏆 Tournament Manager — Backend API

A RESTful API built with **Spring Boot 3** and **PostgreSQL**, powering the Tournament Manager application. Handles authentication, team management, tournament lifecycle, match scheduling, notifications, and member administration.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Authentication & Security](#authentication--security)
- [Database](#database)
- [Testing](#testing)
- [Code Quality](#code-quality)

---

## Tech Stack

| Category            | Technology                                                              |
| ------------------- | ----------------------------------------------------------------------- |
| **Framework**       | [Spring Boot 3.3](https://spring.io/projects/spring-boot)              |
| **Language**        | Java 21                                                                 |
| **Build Tool**      | [Maven](https://maven.apache.org/) (with Maven Wrapper)                |
| **Database**        | [PostgreSQL](https://www.postgresql.org/) (via Docker)                  |
| **ORM**             | Spring Data JPA / Hibernate                                             |
| **Security**        | Spring Security + [Auth0 java-jwt](https://github.com/auth0/java-jwt)  |
| **Validation**      | Jakarta Bean Validation (spring-boot-starter-validation)                |
| **Testing**         | JUnit 5 + [Mockito](https://site.mockito.org/) + Spring Security Test  |
| **Code Coverage**   | [JaCoCo](https://www.jacoco.org/)                                       |
| **Containerization**| [Docker Compose](https://docs.docker.com/compose/)                      |

---

## Prerequisites

- **Java** 21+
- **Docker** (for the PostgreSQL container)
- **Maven** 3.9+ (or use the included `mvnw` wrapper)

---

## Getting Started

```bash
# 1. Navigate to the api directory
cd api

# 2. Start the PostgreSQL database
docker compose up -d

# 3. Run the application
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```

The API will be available at **`http://localhost:3000`**.

> **Note:** On first launch, Hibernate will automatically create the database schema (`ddl-auto=create`) and seed it with data from `src/main/resources/insert.sql`.

---

## Project Structure

```
src/main/java/be/vinci/ipl/cae/demo/
├── configuration/           # Spring configuration classes
│   ├── BcryptConfiguration     # Password encoder bean
│   ├── JwtAuthenticationFilter # JWT token filter for request authentication
│   └── SecurityConfiguration   # Security filter chain & endpoint rules
├── controllers/             # REST controllers (HTTP layer)
│   ├── AuthController          # Login & registration
│   ├── TournamentController    # Tournament CRUD & lifecycle
│   ├── MatchController         # Match results & confirmations
│   ├── TeamController          # Team CRUD
│   ├── MemberController        # Member management (promote, ban, etc.)
│   ├── JoinRequestController   # Team join request handling
│   ├── NotificationController  # User notifications
│   ├── UnavailabilityController# User unavailability periods
│   ├── ProfileImageController  # Profile picture management
│   └── SpecialtyController     # Member specialties
├── services/                # Business logic layer
│   ├── TournamentService       # Tournament operations & state transitions
│   ├── MatchService            # Match scheduling & result management
│   ├── TeamService             # Team lifecycle
│   ├── MemberService           # Member operations
│   ├── JoinRequestService      # Join request workflow
│   ├── NotificationService     # Notification creation & retrieval
│   ├── UnavailabilityService   # Availability management
│   ├── ProfileImageService     # Avatar management
│   └── SpecialtyService        # Specialty lookups
├── repositories/            # Spring Data JPA repositories
├── models/
│   ├── entities/            # JPA entities (domain model)
│   │   ├── Tournament, Match, MatchLineup, MatchResultConfirmation
│   │   ├── Team, Member, JoinRequest
│   │   ├── Notification, Unavailability, Specialty, ProfileImage
│   │   └── Enums: TournamentStatus, MatchStatus, RequestStatus, NotificationType
│   └── dtos/                # Data Transfer Objects
│       ├── TournamentSummaryDto, TournamentDetailsDto, NewTournament
│       ├── MatchSummaryDto, MatchTeamDto
│       ├── TeamDetailsDto, TeamSummaryDto, NewTeam
│       ├── ProfileDto, MemberSummaryDto, UserSummaryDto
│       └── NotificationDto, SpecialtyDto, etc.
├── specifications/          # JPA Specifications for dynamic queries
│   ├── CommonSpecifications    # Shared query predicates
│   ├── TournamentSpecifications
│   ├── TeamSpecifications
│   └── MemberSpecifications
├── exceptions/              # Custom exception classes & global handler
│   └── GlobalExceptionHandler  # Centralized @ControllerAdvice for error responses
└── utils/
    └── BracketGenerator        # Tournament bracket/match generation algorithm

src/main/resources/
├── application.properties   # Spring Boot configuration
└── insert.sql               # Database seed data
```

---

## Architecture

The application follows a **layered architecture** pattern:

```
┌─────────────┐
│ Controllers │  ← HTTP request handling, input validation
├─────────────┤
│  Services   │  ← Business logic, domain orchestration
├─────────────┤
│Repositories │  ← Data access (Spring Data JPA)
├─────────────┤
│  Entities   │  ← Rich domain model with business logic
└─────────────┘
```

### Key Design Decisions

- **Rich Domain Model** — Entities encapsulate business logic and state management (e.g., `Tournament` handles its own status transitions)
- **DTO Layer** — Dedicated DTOs for API input/output, mapped via service-level `Mapper` classes
- **JPA Specifications** — Dynamic query building for complex filters (tournaments by status, members by role, teams by search)
- **Global Exception Handling** — A `GlobalExceptionHandler` (`@ControllerAdvice`) maps domain exceptions to appropriate HTTP responses
- **Bracket Generation** — A dedicated `BracketGenerator` utility handles tournament match scheduling

---

## API Endpoints

### Authentication
| Method | Endpoint           | Description              | Auth |
| ------ | ------------------ | ------------------------ | ---- |
| POST   | `/auths/login`     | User login (returns JWT) | No   |
| POST   | `/auths/register`  | User registration        | No   |

### Tournaments
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| GET    | `/tournaments`                  | List tournaments (with filters)      | No    |
| POST   | `/tournaments`                  | Create a tournament                  | Admin |
| GET    | `/tournaments/{id}`             | Get tournament details               | No    |
| PATCH  | `/tournaments/{id}`             | Update a tournament                  | Admin |
| DELETE | `/tournaments/{id}`             | Delete a tournament                  | Admin |
| POST   | `/tournaments/{id}/register`    | Register team for tournament         | Auth  |
| POST   | `/tournaments/{id}/matches`     | Generate tournament bracket          | Admin |

### Matches
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| GET    | `/matches`                      | List matches (with filters)          | Auth  |
| POST   | `/matches/{id}/results`         | Submit match results                 | Auth  |
| POST   | `/matches/{id}/confirm`         | Confirm match results                | Auth  |
| POST   | `/matches/{id}/forfeit`         | Declare forfeit                      | Auth  |

### Teams
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| GET    | `/teams`                        | List teams (with search)             | No    |
| POST   | `/teams`                        | Create a team                        | Auth  |
| GET    | `/teams/{id}`                   | Get team details                     | Auth  |
| PATCH  | `/teams/{id}`                   | Update team                          | Auth  |

### Members
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| GET    | `/members`                      | List members (with filters)          | Admin |
| GET    | `/members/{id}`                 | Get member profile                   | Auth  |
| PATCH  | `/members/{id}`                 | Update member profile                | Auth  |
| DELETE | `/members/{id}`                 | Ban/delete a member                  | Admin |

### Join Requests
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| POST   | `/join-requests`                | Create a join request                | Auth  |
| PATCH  | `/join-requests/{id}`           | Accept/reject a join request         | Auth  |

### Notifications
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| GET    | `/notifications`                | Get user notifications               | Auth  |
| PATCH  | `/notifications/{id}`           | Mark notification as read            | Auth  |

### Other
| Method | Endpoint                        | Description                          | Auth  |
| ------ | ------------------------------- | ------------------------------------ | ----- |
| GET    | `/specialties`                  | List available specialties           | No    |
| GET    | `/profile-images`               | List available profile pictures      | No    |
| GET/POST/DELETE | `/unavailabilities`    | Manage user unavailabilities         | Auth  |

---

## Authentication & Security

- **JWT-based authentication** — Tokens are issued on login/register and validated via `JwtAuthenticationFilter`
- **BCrypt password hashing** — Configured through `BcryptConfiguration`
- **Role-based access** — Endpoints are protected based on authentication status and admin role
- **Spring Security** — Filter chain configured in `SecurityConfiguration`

---

## Database

### Docker Compose

PostgreSQL is provided via Docker Compose:

```yaml
services:
  db:
    image: postgres:latest
    container_name: postgres_container
    environment:
      POSTGRES_DB: cae_db
      POSTGRES_USER: cae_user
      POSTGRES_PASSWORD: cae
    ports:
      - "5433:5432"
```

```bash
# Start the database
docker compose up -d

# Stop the database
docker compose down
```

### Connection Details

| Property | Value                                    |
| -------- | ---------------------------------------- |
| Host     | `localhost`                              |
| Port     | `5433`                                   |
| Database | `cae_db`                                 |
| Username | `cae_user`                               |
| Password | `cae`                                    |
| JDBC URL | `jdbc:postgresql://localhost:5433/cae_db` |

### Schema Management

Hibernate automatically manages the schema (`ddl-auto=create`). Seed data is loaded from `insert.sql` at startup.

---

## Testing

### Unit Tests

Service-level unit tests with **JUnit 5** and **Mockito**:

```bash
# Run all tests
./mvnw test              # Linux / macOS
mvnw.cmd test            # Windows
```

Test coverage includes:
- `TournamentServiceTest`
- `MatchServiceTest`
- `TeamServiceTest`
- `MemberServiceTest`
- `JoinRequestServiceTest`
- `NotificationServiceTest`

### HTTP Test Files

Manual API testing via IntelliJ HTTP client files in `src/test/`:

| File                        | Covers                              |
| --------------------------- | ----------------------------------- |
| `auths.http`                | Login & registration flows          |
| `tournaments.http`          | Tournament CRUD & registration      |
| `teams.http`                | Team operations                     |
| `members.http`              | Member management                   |
| `join-requests.http`        | Join request creation               |
| `manage-join-requests.http` | Accept/reject join requests         |
| `designate-manager.http`    | Manager designation flows           |
| `notifications.http`        | Notification operations             |

---

## Code Quality

| Tool            | Config File              | Purpose                                              |
| --------------- | ------------------------ | ---------------------------------------------------- |
| **Checkstyle**  | `google_checks.xml`      | Google Java Style Guide enforcement                  |
| **PMD**         | `quickstart.xml` ruleset | Static analysis for bugs & code smells               |
| **CPD**         | PMD plugin               | Copy-paste detection (min 40 tokens)                 |
| **JaCoCo**      | Maven plugin             | Code coverage reporting                              |
| **Formatter**   | `eclipse_formatter.xml`  | Consistent code formatting                           |
| **Lombok**      | Dependency               | Boilerplate reduction (`@Getter`, `@Setter`, etc.)   |

All quality checks run automatically during `mvn test`. The build will **fail** on:
- Checkstyle violations (> 10 allowed)
- PMD violations (0 allowed)
- CPD duplications (0 allowed)

> **Tip:** Use the `no-build-failure` Maven profile to run checks without failing the build:
> ```bash
> ./mvnw test -Pno-build-failure
> ```

---

## License

This project is part of a school curriculum (CAE — Vinci IPL). All rights reserved.
