# CampusCycle — Java Spring Boot Backend

Java clone of the original CampusCycle MERN backend (`../backend`, Node.js/Express/MongoDB).
It exposes the **same REST API surface** so the existing React/Vite frontend (`../frontend`)
works unchanged against it on port `5000`.

> **Deferred feature:** owner ↔ buyer/renter **messaging/chat is not implemented** (see
> [Known limitations](#12-known-limitations--deferred-features)).

---

## 1. Project overview and scope

CampusCycle is a university-exclusive resource-sharing platform (buy, sell, rent, lend, donate
between students). This project contains:

| Directory | Purpose |
|---|---|
| `backend/` | Original Node.js/Express/MongoDB backend (**reference — do not modify**) |
| `backend-java/` | This project — Spring Boot backend with API parity to the Node version |
| `frontend/` | Existing React + Vite SPA, shared by both backends (unmodified) |

**Scope:** auth/users/domains, listings, tags, resource requests, reservations, and
notifications — matching the original API's endpoints, response envelopes (`_id` keys,
`{listings, totalPages, currentPage, total}`, `{message}` errors) and enum value casing.

**Out of scope:** messaging/chat (deferred), image upload (frontend shows "coming soon"),
real-time WebSockets.

## 2. Architecture and request flow

```
Browser ──> React SPA (Vite dev server, :3000)
                │  axios baseURL = "/api"
                ▼
         Vite dev proxy  (vite.config.js: "/api" → http://localhost:5000)
                ▼
         Spring Boot app (:5000)
                │
                ├─ Spring Security filter chain
                │    ├─ JWT filter: parses "Authorization: Bearer <token>",
                │    │   sets the current user (401 on invalid/missing token)
                │    └─ URL rules: public GETs / auth / register / login are open;
                │        everything else requires authentication
                ├─ Controllers (REST, Bean Validation on request bodies)
                ├─ Services (business rules, ownership checks, notifications)
                └─ Spring Data JPA / Hibernate ──> MySQL 8 (database `campuscycle`)
```

- **Schema management:** `spring.jpa.hibernate.ddl-auto=update` (dev-grade; Hibernate
  creates/alters tables automatically).
- **Seed data:** on startup a seeder creates 5 domains and 15 categories
  (`DomainSeeder`), mirroring the original Mongo seed data.
- **Errors:** `GlobalExceptionHandler` returns `{"message": ...}`. Validation failures
  return `message` as a JSON **array** of field errors (Mongoose parity); non-validation
  errors return a single string, e.g. `{"message":"Listing not found"}`.

## 3. Technology stack

| Layer | Choice |
|---|---|
| Framework | Spring Boot **3.5.16** (Maven) |
| Language / build | Java **17** target (`<java.version>17`; compiled with `--release 17` on newer JDKs) |
| starters | `web`, `data-jpa`, `security`, `validation` |
| Database | MySQL 8 via `mysql-connector-j` |
| Auth | JJWT **0.12.7** (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`), HS256 |
| Passwords | `BCryptPasswordEncoder` strength **10** |
| Frontend (sibling) | React + Vite 6, axios, react-router-dom, tailwindcss, lucide-react |

No Lombok is used; all entities/DTOs are plain Java records/classes.

## 4. Prerequisites

- **JDK 17 or newer** (`java -version`). Built and tested with a JDK 24 toolchain compiling
  to `--release 17`.
- **Apache Maven 3.8+** (`mvn -v`). No Maven wrapper is included.
- **MySQL 8.x** running locally (default `root` on `localhost:3306`).
- **Node.js 18+** and npm (only for the frontend dev server).

## 5. MySQL database creation and configuration

```sql
CREATE DATABASE campuscycle;
```

Notes:
- The default JDBC URL already contains `createDatabaseIfNotExist=true`, so MySQL will
  create `campuscycle` on first start if it doesn't exist.
- Table schema is created/updated automatically by Hibernate (`ddl-auto=update`).
- Credentials are read from `src/main/resources/application.properties` or overridden via
  environment variables (next section). Use a dedicated local MySQL user in real setups,
  e.g.:

```sql
CREATE USER 'campuscycle'@'localhost' IDENTIFIED BY '<your-mysql-password>';
GRANT ALL PRIVILEGES ON campuscycle.* TO 'campuscycle'@'localhost';
FLUSH PRIVILEGES;
```

## 6. Configuration and environment variables

All keys live in `src/main/resources/application.properties`.

> The working copy of `application.properties` is **gitignored** because it holds local
> secrets. A sanitized template is committed as **`application.properties.example`** —
> copy it to `application.properties` on a fresh checkout and fill in local values.

| Key | Purpose | Safe example / notes |
|---|---|---|
| `server.port` | HTTP port | `5000` |
| `spring.datasource.url` | JDBC URL | `jdbc:mysql://localhost:3306/campuscycle?...` |
| `spring.datasource.username` | DB user | `<your-mysql-user>` (e.g. `root` locally) |
| `spring.datasource.password` | DB password | `<your-mysql-password>` — **supply locally, never commit real values** |
| `spring.jpa.hibernate.ddl-auto` | Schema mode | `update` (dev) |
| `app.jwt.secret` | HS256 signing key | `<generate-a-long-random-secret>` — see below |
| `app.jwt.expiration-ms` | Token lifetime | `604800000` (7 days) |
| `app.university.email-domain` | Allowed e-mail domain | `@anurag.edu.in` |
| `logging.level.com.campuscycle` | Log verbosity | `INFO` |

**Recommended: supply secrets via environment variables** (Spring relaxed binding maps them
onto the same keys — no properties edits needed):

```powershell
# PowerShell example — run before starting the app
$env:SPRING_DATASOURCE_USERNAME = "root"
$env:SPRING_DATASOURCE_PASSWORD = "<your-mysql-password>"
$env:APP_JWT_SECRET             = "<generate-a-long-random-secret>"
```

```bash
# Linux/macOS example
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD='<your-mysql-password>'
export APP_JWT_SECRET='<generate-a-long-random-secret>'
```

Generate a JWT secret locally, e.g. `openssl rand -base64 64` (or any random 64+ character
string). Never reuse a committed secret in a shared environment.

## 7. Build, start, and health check

All commands run from `backend-java/`:

```powershell
# Build (packaged jar → target/)
mvn clean package

# Run — option A: packaged jar (recommended)
java -jar target\backend-java-1.0.0.jar

# Run — option B: direct from sources
mvn spring-boot:run
```

Health check (public, no token):

```powershell
curl http://localhost:5000/api/health
# → {"message":"CampusCycle API is running","status":"ok"}
```

Stop the app with `Ctrl+C`. Only one backend may hold port 5000 at a time —
**stop the original Node backend before starting this one.**

## 8. Frontend startup and Vite proxy

```powershell
cd ..\frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open **http://127.0.0.1:3000**.

`frontend/vite.config.js` proxies API calls:

```js
server: { proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } } }
```

The frontend sends all axios requests with `baseURL: '/api'`, so no frontend configuration
is needed when switching backends. (Use `--host 127.0.0.1` so the dev server binds IPv4 —
some browsers resolve `localhost` to IPv6 first and hang.)

## 9. Authentication flow

1. **Register** — `POST /api/auth/register` with `{name, email, password}` (min 6 chars).
   - E-mail **must** end with `@anurag.edu.in` (configurable via
     `app.university.email-domain`); otherwise `400 {"message":"Please use your university
     email address"}`.
   - Duplicate e-mail → `400 {"message":"User already exists"}`.
   - Passwords are hashed with **BCrypt (strength 10)**; plaintext is never stored.
2. **Login** — `POST /api/auth/login` → `{"token": "<jwt>", "user": {...}}`.
   Wrong credentials → `401 {"message":"Invalid email or password"}`.
3. **Token** — JWT **HS256**, valid **7 days** (`app.jwt.expiration-ms`), subject = user id.
   Send it on every protected request:
   `Authorization: Bearer <token>`.
4. **Current user** — `GET /api/auth/me` returns the full user document (frontend stores
   the token in `localStorage` under `token` and re-validates on page load; on `401` it
   redirects to `/login`).
5. **Public vs. protected** — health, register/login, and documented public GETs
   (listings, requests, domains, tags, public profiles, listing reservations) need no
   token; everything else requires a valid one (`401` otherwise).

## 10. API endpoint reference

Base URL: `http://localhost:5000/api`. All bodies are JSON.
**Auth** = `Bearer` token required. Enums are lowercase strings.

### Health

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | public | `{"message":"CampusCycle API is running","status":"ok"}` |

### Auth — `/auth`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | public | Body `{name, email, password}` → `201 {token, user}` |
| POST | `/auth/login` | public | Body `{email, password}` → `{token, user}` |
| GET | `/auth/me` | yes | Full user document (`_id`, `followedTags`, `wishlist`, `reputation`, …) |

### Users — `/users`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/users/profile` | yes | Same shape as `/auth/me` |
| PUT | `/users/profile` | yes | Body `{name?, bio?, phone?}` → updated user |
| PUT | `/users/avatar` | yes | Body `{avatar}` → updated user |
| GET | `/users/me/wishlist` | yes | `ListingResponse[]` |
| GET | `/users/me/wishlist/count` | yes | `{count}` |
| GET | `/users/me/following` | yes | Followed `TagResponse[]` |
| GET | `/users/me/history` | yes | User's sold/rented/borrowed/donated listings |
| GET | `/users/me/listings` | yes | User's `ListingResponse[]` (newest first) |
| GET | `/users/{id}` | public | Public profile (`_id`, name, avatar, bio, verified, …) |
| GET | `/users/{id}/listings` | public | That user's listings |
| POST | `/users/wishlist/{listingId}` | yes | Toggle → `{wishlist: [ids], added: bool}` |

### Domains — `/domains`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/domains` | public | All domains incl. nested `categories[].items[]` (seeded) |
| GET | `/domains/{slug}` | public | e.g. `/domains/academics` → `404` if unknown |

### Listings — `/listings`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/listings` | public | Query: `search, type, domain, category, condition, minPrice, maxPrice, location, status` (default `available`), `page` (1), `limit` (12), `sort` (default `-createdAt`) → `{listings, totalPages, currentPage, total}` |
| POST | `/listings` | yes | `CreateListingRequest` (below) → `201` listing |
| GET | `/listings/my` | yes | Current user's listings (any status) |
| GET | `/listings/{id}` | public | Single listing; **increments `views`** |
| PUT | `/listings/{id}` | yes (owner) | `UpdateListingRequest` (same fields, all optional) |
| DELETE | `/listings/{id}` | yes (owner) | `{"message":"Listing removed"}` |
| PUT | `/listings/{id}/status` | yes (owner) | Body `{status}` → updated listing |
| GET | `/listings/domain/{domainId}` | public | Available listings in a domain |

`CreateListingRequest`: `title` (req, ≤200), `description` (req, ≤2000), `type`
(`sell|rent|lend|donate`, req), `condition` (`new|like_new|good|fair|poor`), `price`,
`rentPrice`, `rentDuration`, `deposit`, `domain` (id), `category`, `subcategory`,
`tags[]`, `location`, `photos[]`.

`status` values: `available, reserved, sold, rented, borrowed, donated, unavailable`.

### Tags — `/tags`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/tags` | public | Popular tags `TagResponse[]` |
| GET | `/tags/search/{query}` | public | Prefix/name search (max 10) |
| GET | `/tags/{slug}` | public | `{tag, listings}` — listings with that tag |
| POST | `/tags/{id}/follow` | yes | Toggle follow → `{followed, followersCount}` |
| POST | `/tags` | yes | Body `{name}` → `201` tag |

### Requests — `/requests`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/requests` | public | Query: `search, type, domain, category, status` (default `active`), `page`, `limit`, `sort` → `{requests, totalPages, currentPage, total}` |
| POST | `/requests` | yes | `CreateRequestRequest` → `201` request |
| GET | `/requests/my` | yes | Current user's requests |
| GET | `/requests/{id}` | public | Single request |
| PUT | `/requests/{id}` | yes (owner) | `UpdateRequestRequest` |
| DELETE | `/requests/{id}` | yes (owner) | `{"message":"Request removed"}` |
| PUT | `/requests/{id}/fulfill` | yes (owner) | Body `{listingId?}` → request with `status: fulfilled` |

`CreateRequestRequest`: `title` (req, ≤200), `description` (≤2000), `type`
(`buy|rent|borrow`, req), `requiredDate`, `duration`, `domain`, `category`, `tags[]`.
`status` values: `active, matched, fulfilled, expired, cancelled`.

### Reservations — `/reservations`

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/reservations` | yes | Body `{listingId, duration}` (days) → `201` reservation; sets listing `reserved` and notifies the owner. Errors: `400` "Listing is not available" / "Cannot reserve your own listing" / "You already have an active reservation" |
| GET | `/reservations/my` | yes | Current user's reservations |
| GET | `/reservations/listing/{listingId}` | public | Reservations for a listing |
| PUT | `/reservations/{id}/cancel` | yes | Cancels; listing returns to `available` |
| PUT | `/reservations/{id}/complete` | yes | Completes; listing → sold/rented/…; notifies parties |

`status` values: `active, expired, completed`.

### Notifications — `/notifications`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/notifications` | yes | Query `page` (1), `limit` (20) → `{notifications, total, unread, totalPages}` |
| GET | `/notifications/unread-count` | yes | `{count}` |
| PUT | `/notifications/read-all` | yes | `{"message":"All notifications marked as read"}` |
| PUT | `/notifications/{id}/read` | yes | `{"message":"Notification marked as read"}` |
| DELETE | `/notifications/{id}` | yes | `{"message":"Notification deleted"}` |

Notification `type` values seen in the app: `reservation`, `tag_match`, `transaction`
(and `message` handled by the frontend for a future messaging feature).

**ID convention:** every resource exposes its primary key as `_id` (numeric), matching the
frontend expectations written for MongoDB ObjectIds.

## 11. Running the regression suites

The suites are standalone PowerShell scripts that call the **running** backend at
`http://localhost:5000/api`. Start the backend (section 7) first.

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\admin\AppData\Local\Temp\opencode\phase1-tests.ps1"
powershell -ExecutionPolicy Bypass -File "C:\Users\admin\AppData\Local\Temp\opencode\phase2-tests.ps1"
powershell -ExecutionPolicy Bypass -File "C:\Users\admin\AppData\Local\Temp\opencode\phase3-tests.ps1"
```

| Suite | Coverage | Result (last run) |
|---|---|---|
| Phase 1 | Auth, users, domains | 52 passed / 0 failed |
| Phase 2 | Listings, tags | 114 passed / 0 failed |
| Phase 3 | Requests, reservations, notifications | 128 passed / 0 failed |

Notes: the suites create their own uniquely-stamped users/listings and clean up after
themselves; MySQL must be reachable through the backend. A browser-level suite
(Playwright, 41 checks) was run during integration testing as a one-off script.

## 12. Known limitations and deferred features

- **Messaging/chat between listing owners and buyers/renters is deferred and is not
  currently available.** The original project contains unused `Conversation`/`Message`
  Mongo models and an unused `socket.io` dependency; no messaging endpoints, sockets, or
  UI page were ever implemented there either. The frontend's 💬 links (`/messages`) lead
  to an unrouted URL (blank content area) in both the original and this clone.
- **Image upload** is not implemented — the create-listing form shows "Image upload
  coming soon" and `photos` accepts URLs only.
- **`/forgot-password`** is a frontend link with no corresponding backend endpoint
  (same as the original).
- **Tag follow button on the listing-detail page** passes the tag *name* where an id is
  expected; it fails against both the original and this backend (pre-existing frontend
  quirk). Following works from other contexts.
- **`ddl-auto=update`** is suitable for development only; production deployments should
  use explicit migrations (Flyway/Liquibase).
- **Configuration secrets:** treat `application.properties` values as local development
  defaults; override via environment variables (section 6) and never reuse them
  elsewhere.
- **No admin/moderator UI**; role fields exist but are unused by the frontend.
- **Port 5000 conflict:** the Node backend and this app share the port — run only one.
