# 🔄 CampusCycle

### Campus Resource Sharing & Exchange Platform

**REUSE • SHARE • SAVE • SUSTAIN**

> A university-exclusive resource sharing and exchange platform designed around the way students acquire, use, reuse, exchange, rent, borrow, lend, and donate academic and personal resources.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [ER Diagram](#er-diagram)
- [Database Schemas](#database-schemas)
- [API Routes](#api-routes)
- [Workflows](#workflows)
- [Setup & Installation](#setup--installation)
- [Build Plan & Progress](#build-plan--progress)

---

## 📖 Project Overview

### The Problem

University students regularly acquire academic and personal resources such as textbooks, laboratory equipment, calculators, project components, electronics, and hostel essentials. Many of these resources are needed only for a particular course, semester, project, or short period of time.

The current exchange process is often fragmented across WhatsApp groups, personal contacts, hostel networks, word of mouth, notice boards, and general-purpose marketplaces. These channels can make discovery, timing, coordination, and trust difficult.

### The Solution

CampusCycle connects student supply with student demand, including situations where a required resource is not currently available. The platform is not simply another second-hand marketplace — it's a campus resource ecosystem that tries to make "I HAVE" and "I NEED" visible to each other, even when the match doesn't exist at the same moment.

### Core Concept

```
SUPPLY → DEMAND → DISCOVERY → MATCHING → EXCHANGE/RENTAL → RATING & HISTORY → ANALYTICS
```

**Five Broad Ideas:**
1. **Supply** — Students can make resources available through selling, renting, lending, or donating
2. **Demand** — Students can search, request, follow, or wishlist resources they need
3. **Discovery** — Domains, categories, tags, search, and recommendations help users find relevant resources
4. **Matching** — The system connects new listings with students who have expressed interest
5. **Trust & Impact** — Verification, ratings, transaction history, reporting, human moderation, support tickets, and analytics

---

## ✨ Key Features

### Core Features (MVP)

| Feature | Description |
|---------|-------------|
| 🔐 University Verification | Student registration using college/university email |
| 👤 Student Profiles | Profiles with listings, transactions, ratings, and reputation |
| 📦 Resource Listings | Sell, Rent, Lend, Donate listing types |
| 🔍 Search & Discovery | Keywords, tags, categories, domains, and filters |
| 🏷️ Tag System | Flexible tags for discovery and matching |
| 📋 Resource Requests | Students can declare unmet demand |
| 🔔 Notifications | Match alerts, messages, rental reminders |
| 💬 In-App Messaging | Buyer-seller, borrower-lender communication |
| 📅 Reservations | Temporary item reservation system |
| ⭐ Ratings & Reputation | Two-way rating after completed exchanges |
| 🚨 Reporting & Moderation | Human-first moderation workflow |
| 🎫 Support Tickets | Structured channel for broader disputes |
| 📊 Admin Dashboard | Moderator tools for managing platform |

### Advanced Features (Phase 2)

- Wishlist with notifications
- Automatic tag association
- Supply-demand matching
- Resource ecosystems
- Campus pickup workflows
- Demand/supply analytics
- Sustainability dashboard

### Future Features

- Personalized recommendation engine
- ML-based demand prediction
- AI-assisted moderation pre-screening
- Mobile application
- Inter-college exchange

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT + bcrypt |
| **Real-time** | Socket.io |
| **File Storage** | Cloudinary |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMPUSCYCLE SYSTEM ARCHITECTURE               │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   Student    │
    │   Admin/Mod  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   Frontend   │  React + Vite + Tailwind
    │   (Client)   │  Port: 3000
    └──────┬───────┘
           │ HTTP/WebSocket
           ▼
    ┌──────────────┐
    │   Backend    │  Node.js + Express
    │   (API)      │  Port: 5000
    └──────┬───────┘
           │
    ┌──────┼──────────────────────────────┐
    │      │                              │
    ▼      ▼                              ▼
┌──────┐ ┌──────────┐              ┌───────────┐
│  DB  │ │  Cloud   │              │ Socket.io │
│Mongo │ │  inary   │              │  Server   │
└──────┘ └──────────┘              └───────────┘
```

### System Layers

| Layer | Purpose | Components |
|-------|---------|------------|
| **Supply** | Resources students have available | Sell, rent, lend, donate listings |
| **Demand** | Resources students currently want | Search, requests, follow tags, wishlist |
| **Discovery** | Helps users find relevant resources | Domains, categories, tags, filters, recommendations |
| **Matching** | Connects demand with supply | Tag matches, request matches, notifications |
| **Exchange & Trust** | Supports and records exchanges | Chat, reservation, pickup, ratings, reports, moderation |
| **Safety & Support** | Handles issues and disputes | Reports, human moderation, support tickets, audit history |

---

## 🗄️ ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIP DIAGRAM                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────────┐         ┌─────────────┐
│    USER     │         │     LISTING     │         │   DOMAIN    │
├─────────────┤         ├─────────────────┤         ├─────────────┤
│ _id (PK)    │◄────┐   │ _id (PK)        │    ┌───►│ _id (PK)    │
│ name        │     │   │ owner (FK)      │────┘    │ name        │
│ email       │     │   │ title           │         │ slug        │
│ password    │     │   │ description     │         │ icon        │
│ avatar      │     │   │ photos[]        │         │ categories[]│
│ bio         │     │   │ type            │         └─────────────┘
│ phone       │     │   │ price           │
│ verified    │     │   │ rentPrice       │
│ role        │     │   │ rentDuration    │
│ reputation  │     │   │ deposit         │
│ isActive    │     │   │ condition       │
└──────┬──────┘     │   │ availability    │
       │            │   │ domain (FK)     │
       │            │   │ category        │
       │            │   │ tags[]          │
       │            │   │ status          │
       │            │   │ location        │
       │            │   │ views           │
       │            │   │ reservedBy (FK) │──┐
       │            │   │ reservedUntil   │  │
       │            │   └─────────────────┘  │
       │            │                        │
       │            │   ┌─────────────────┐  │
       │            │   │  RESERVATION    │  │
       │            │   ├─────────────────┤  │
       │            ├───│ user (FK)       │◄─┘
       │            │   │ listing (FK)    │
       │            │   │ expiresAt       │
       │            │   │ status          │
       │            │   └─────────────────┘
       │            │
       │            │   ┌─────────────────┐
       │            │   │    RATING       │
       │            │   ├─────────────────┤
       │            ├───│ from (FK)       │
       │            ├───│ to (FK)         │
       │            │   │ listing (FK)    │
       │            │   │ score           │
       │            │   │ comment         │
       │            │   │ type            │
       │            │   └─────────────────┘
       │            │
       │            │   ┌─────────────────┐
       │            │   │    REPORT       │
       │            │   ├─────────────────┤
       │            ├───│ reporter (FK)   │
       │            │   │ type            │
       │            │   │ targetId        │
       │            │   │ reason          │
       │            │   │ explanation     │
       │            │   │ context         │
       │            │   │ status          │
       │            │   │ moderator (FK)  │
       │            │   │ history[]       │
       │            │   └─────────────────┘
       │            │
       │            │   ┌─────────────────┐
       │            │   │   REQUEST       │
       │            │   ├─────────────────┤
       │            ├───│ requester (FK)  │
       │            │   │ title           │
       │            │   │ type            │
       │            │   │ requiredDate    │
       │            │   │ duration        │
       │            │   │ tags[]          │
       │            │   │ status          │
       │            │   │ matchedListing  │
       │            │   └─────────────────┘
       │            │
       │            │   ┌─────────────────┐
       │            │   │  CONVERSATION   │
       │            │   ├─────────────────┤
       │            ├───│ participants[]  │
       │            │   │ listing (FK)    │
       │            │   │ lastMessage     │
       │            │   │ lastMessageAt   │
       │            │   └────────┬────────┘
       │            │            │
       │            │            ▼
       │            │   ┌─────────────────┐
       │            │   │    MESSAGE      │
       │            │   ├─────────────────┤
       │            │   │ conversation(FK)│
       │            │   │ sender (FK)     │
       │            ├───│ content         │
       │            │   │ read            │
       │            │   │ reported        │
       │            │   └─────────────────┘
       │            │
       │            │   ┌─────────────────┐
       │            │   │     TAG         │
       │            │   ├─────────────────┤
       │            ├───│ followers[]     │
       │            │   │ name            │
       │            │   │ slug            │
       │            │   │ count           │
       │            │   └─────────────────┘
       │            │
       │            │   ┌─────────────────┐
       │            │   │   NOTIFICATION  │
       │            │   ├─────────────────┤
       │            └───│ user (FK)       │
       │                │ type            │
       │                │ title           │
       │                │ message         │
       │                │ link            │
       │                │ read            │
       │                └─────────────────┘
       │
       │            ┌─────────────────┐
       │            │     TICKET      │
       │            ├─────────────────┤
       └────────────│ user (FK)       │
                    │ category        │
                    │ description     │
                    │ attachments[]   │
                    │ status          │
                    │ assignedTo (FK) │
                    │ messages[]      │
                    │ resolution      │
                    └─────────────────┘
```

---

## 📊 Database Schemas

### User
```javascript
{
  name:           String (required),
  email:          String (required, unique, university domain),
  password:       String (hashed, required),
  avatar:         String (URL),
  bio:            String,
  phone:          String,
  verified:       Boolean (default: false),
  role:           Enum ['student', 'moderator', 'admin'],
  reputation: {
    rating:           Number,
    totalRatings:      Number,
    completedExchanges: Number,
    listings:          Number
  },
  followedTags:   [ObjectId ref Tag],
  wishlist:       [ObjectId ref Listing],
  isActive:       Boolean,
  suspendedUntil: Date,
  createdAt:      Date
}
```

### Listing
```javascript
{
  owner:          ObjectId ref User (required),
  title:          String (required),
  description:    String (required),
  photos:         [String],
  type:           Enum ['sell', 'rent', 'lend', 'donate'],
  price:          Number,
  rentPrice:      Number,
  rentDuration:   String,
  deposit:        Number,
  condition:      Enum ['new', 'like_new', 'good', 'fair', 'poor'],
  availability:   String,
  domain:         ObjectId ref Domain,
  category:       String,
  subcategory:    String,
  tags:           [String],
  status:         Enum ['available', 'reserved', 'sold', 'rented', 'borrowed', 'donated', 'unavailable'],
  location:       String,
  views:          Number,
  reservedBy:     ObjectId ref User,
  reservedUntil:  Date,
  createdAt:      Date,
  updatedAt:      Date
}
```

### Request
```javascript
{
  requester:      ObjectId ref User (required),
  title:          String (required),
  description:    String,
  type:           Enum ['buy', 'rent', 'borrow'],
  requiredDate:   Date,
  duration:       String,
  domain:         ObjectId ref Domain,
  category:       String,
  tags:           [String],
  status:         Enum ['active', 'matched', 'fulfilled', 'expired', 'cancelled'],
  matchedListing: ObjectId ref Listing,
  createdAt:      Date
}
```

### Report
```javascript
{
  reporter:       ObjectId ref User (required),
  type:           Enum ['listing', 'message', 'user'],
  targetId:       ObjectId (required),
  reason:         Enum ['harassment', 'threatening', 'scam', 'prohibited', 'spam', 'inappropriate', 'other'],
  explanation:    String,
  context:        Object,
  status:         Enum ['pending', 'under_review', 'resolved', 'dismissed'],
  moderator:      ObjectId ref User,
  decision:       String,
  action:         Enum ['dismiss', 'warn', 'remove_content', 'restrict', 'temp_suspend', 'perm_suspend'],
  history:        [{ moderator, action, decision, reason, timestamp }],
  createdAt:      Date
}
```

---

## 🌐 API Routes

### Authentication
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Users
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/users/:id` | Get user profile | Public |
| PUT | `/api/users/profile` | Update profile | Protected |
| GET | `/api/users/:id/listings` | Get user's listings | Public |
| GET | `/api/users/:id/ratings` | Get user's ratings | Public |

### Listings
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/listings` | Get all listings | Public |
| GET | `/api/listings/:id` | Get single listing | Public |
| POST | `/api/listings` | Create listing | Protected |
| PUT | `/api/listings/:id` | Update listing | Protected |
| DELETE | `/api/listings/:id` | Delete listing | Protected |
| PUT | `/api/listings/:id/status` | Update status | Protected |
| GET | `/api/listings/search` | Search listings | Public |

### Domains
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/domains` | Get all domains | Public |
| GET | `/api/domains/:slug` | Get domain details | Public |

### Tags
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/tags` | Get popular tags | Public |
| GET | `/api/tags/:slug` | Get tag listings | Public |
| POST | `/api/tags/:id/follow` | Follow/unfollow tag | Protected |

### Requests
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/requests` | Get all requests | Public |
| POST | `/api/requests` | Create request | Protected |
| PUT | `/api/requests/:id` | Update request | Protected |
| DELETE | `/api/requests/:id` | Cancel request | Protected |

### Messages
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/conversations` | Get conversations | Protected |
| POST | `/api/conversations` | Start conversation | Protected |
| GET | `/api/conversations/unread-count` | Get unread message count | Protected |
| GET | `/api/conversations/:id/messages` | Get messages | Protected |
| POST | `/api/conversations/:id/messages` | Send message | Protected |
| PUT | `/api/conversations/:id/read` | Mark conversation read | Protected |

### Reports
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/api/reports` | Create report | Protected |
| GET | `/api/reports` | Get reports queue | Moderator |
| PUT | `/api/reports/:id` | Update report | Moderator |

### Tickets
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/api/tickets` | Create ticket | Protected |
| GET | `/api/tickets` | Get user's tickets | Protected |
| PUT | `/api/tickets/:id` | Update ticket | Moderator |

---

## 🔄 Workflows

### Workflow A: Search & Follow Tag
```
┌──────────────────────────────────────────────────────────────────┐
│                    SEARCH & FOLLOW TAG WORKFLOW                   │
└──────────────────────────────────────────────────────────────────┘

  Student searches #coat
         │
         ▼
  ┌─────────────┐
  │   Results?  │
  └──────┬──────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    ▼         ▼
  View      Follow #coat
  Listings      │
    │           ▼
    │     Store demand
    │           │
    │     (Wait for supply)
    │           │
    │           ▼
    │     New listing appears
    │           │
    │           ▼
    │     ┌─────────────┐
    │     │   Match     │
    │     │  Detected   │
    │     └──────┬──────┘
    │            │
    │            ▼
    │     Send Notification
    │            │
    └─────┬──────┘
          │
          ▼
    Student opens listing
```

### Workflow B: Create Resource Request
```
┌──────────────────────────────────────────────────────────────────┐
│                   CREATE REQUEST WORKFLOW                         │
└──────────────────────────────────────────────────────────────────┘

  Student needs resource
         │
         ▼
  Create Request
  • Item details
  • Type (buy/rent/borrow)
  • Required date
  • Duration
         │
         ▼
  Request stored as Active
         │
         ▼
  ┌─────────────────┐
  │ New listing     │
  │ matches?        │
  └────────┬────────┘
           │
      ┌────┴────┐
      │         │
     YES       NO
      │         │
      ▼         ▼
  Notification  Continue
  Sent          Monitoring
      │
      ▼
  Student views
  & connects
```

### Workflow C: Complete Exchange
```
┌──────────────────────────────────────────────────────────────────┐
│                   COMPLETE EXCHANGE WORKFLOW                      │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
  │ Browse  │────►│  Open   │────►│  Check  │────►│  Chat   │
  │/Search  │     │ Listing │     │ Details │     │ Seller  │
  └─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                        │
                                                        ▼
  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
  │ Complete│◄────│  Meet   │◄────│  Meet at │◄────│Negotiate│
  │Exchange │     │  Owner  │     │ Pickup  │     │Confirm  │
  └────┬────┘     └─────────┘     └─────────┘     └─────────┘
       │
       ▼
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │ Update  │────►│  Rate   │────►│  Save   │
  │ Status  │     │  Each   │     │ History │
  │         │     │ Other   │     │         │
  └─────────┘     └─────────┘     └─────────┘
```

### Workflow D: Report & Moderation
```
┌──────────────────────────────────────────────────────────────────┐
│                 REPORT & MODERATION WORKFLOW                      │
└──────────────────────────────────────────────────────────────────┘

  User sees problematic content
         │
         ▼
  Click Report
         │
         ▼
  Select Reason
  • Harassment/Abuse
  • Threatening behavior
  • Scam/Fraud
  • Prohibited content
  • Spam
  • Inappropriate
  • Other
         │
         ▼
  Optional: Add explanation
         │
         ▼
  ┌─────────────────────┐
  │ Message report?     │
  │ Include context     │
  │ (surrounding msgs)  │
  └──────────┬──────────┘
             │
             ▼
  Report Created → Status: Pending
             │
             ▼
  Moderator Assigned
             │
             ▼
  Status: Under Review
             │
             ▼
  ┌─────────────────────┐
  │ Review Context &    │
  │ Content             │
  └──────────┬──────────┘
             │
      ┌──────┴──────┐
      │             │
  Dismiss      Take Action
      │             │
      ▼             ▼
  Status:     ┌─────────────┐
  Dismissed   │  Actions:   │
              │  • Warn     │
              │  • Remove   │
              │  • Restrict │
              │  • Suspend  │
              └──────┬──────┘
                     │
                     ▼
              Status: Resolved
                     │
                     ▼
              Record in History
                     │
                     ▼
              Notify User
```

### Workflow E: Support Ticket
```
┌──────────────────────────────────────────────────────────────────┐
│                   SUPPORT TICKET WORKFLOW                         │
└──────────────────────────────────────────────────────────────────┘

  User has broader issue
  (transaction dispute, account
  problem, appeal, harassment)
         │
         ▼
  Create Ticket
  • Select category
  • Describe problem
  • Attach evidence
         │
         ▼
  Status: Open
         │
         ▼
  Assigned to Moderator
         │
         ▼
  Status: In Review
         │
    ┌────┴────┐
    │         │
  Need      Investigating
  Info           │
    │            │
    ▼            ▼
  Status:    ┌──────────┐
  Waiting    │ Decision │
  for User   └────┬─────┘
    │             │
    └──────┬──────┘
           │
           ▼
  Status: Resolved
           │
           ▼
  Record Resolution
           │
           ▼
  Status: Closed
```

### Workflow F: Lab Coat Scenario (End-to-End)
```
┌──────────────────────────────────────────────────────────────────┐
│              COMPLETE LAB COAT SCENARIO                           │
└──────────────────────────────────────────────────────────────────┘

 1. Student searches #coat
            │
 2. System searches #labcoat, #laboratory
            │
 3. No listing available
            │
 4. Student follows #coat OR creates request
            │
 5. System stores demand
            │
 6. (3 days later...)
            │
 7. Another student lists Lab Coat for rent
            │
 8. Tags auto-associated: #labcoat, #laboratory
            │
 9. Matching system detects relevance
            │
10. Notification sent to student
            │
11. Student opens listing
            │
12. Chats with owner
            │
13. Reserves the coat
            │
14. Meets at campus pickup location
            │
15. Completes rental
            │
16. Return confirmed by both parties
            │
17. Both rate the exchange
            │
18. Transaction saved to history
            │
19. (If abuse reported → Report workflow)
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+) and npm
- MongoDB running locally on the default port `27017` (e.g. the `MongoDB` Windows service, or `mongod`)

### Backend Setup
```bash
cd backend
npm install        # install dependencies
# create .env (see Environment Variables below)
npm run seed       # seed the 5 domains / 17 categories (safe to re-run)
npm start          # starts the API on http://localhost:5000
```
During development you can use `npm run dev` (nodemon auto-restart) instead of `npm start`.
The API is healthy when `GET http://localhost:5000/api/health` returns HTTP 200.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```
Opens the app at `http://127.0.0.1:3000`. The Vite dev server proxies `/api/*` to
`http://localhost:5000`, so the frontend needs no extra configuration.

### Seed Database
```bash
cd backend
npm run seed
```
Clears and recreates only the `domains` collection — users, listings, requests and
reservations are never touched.

### Environment Variables (.env)
Create `backend/.env` (gitignored — never commit it):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campuscycle
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
UNIVERSITY_EMAIL_DOMAIN=@your-university.edu
```
Optional (image uploads): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
Registration only accepts university email addresses matching `UNIVERSITY_EMAIL_DOMAIN`.

---

## 📊 Build Plan & Progress

### ✅ Setup Phase - COMPLETED
- [x] Project structure created
- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] All Mongoose models created
- [x] Auth system (backend)
- [x] Base frontend (Navbar, AuthContext, utils)
- [x] Environment configuration
- [x] Build plan document
- [x] Test server & database connection

### 🔄 Phase 1: Foundation (Week 1) - IN PROGRESS
- [x] Registration page (university email validation)
- [x] Login page
- [x] Protected route middleware (frontend)
- [x] Auth context & API interceptor
- [x] User profile page (view/edit)
- [x] Create listing form
- [x] Listing detail page
- [x] Listing browse/grid page
- [x] Edit/delete listings
- [ ] Image upload (Cloudinary)
- [x] Domain/category seed data

### ⏳ Phase 2: Core Features (Week 2) - PENDING
- [ ] Search bar with keyword search
- [ ] Filter by domain, category, type, price, condition
- [ ] Tag-based search
- [ ] Tag system (create, follow, browse)
- [ ] Resource request creation
- [ ] Request browsing page
- [ ] Basic matching logic
- [ ] Reservation system
- [ ] Status management
- [ ] Wishlist functionality
- [ ] Follow tag notifications

### ⏳ Phase 3: Communication & Safety (Week 3) - PENDING
- [x] Conversation list
- [x] Real-time chat (Socket.io)
- [ ] Message reporting
- [ ] Post-exchange rating system
- [ ] Report listing/message/user
- [ ] Moderator queue
- [ ] Admin/moderator dashboard
- [ ] Notification system
- [ ] Support ticket system
- [ ] Final testing & bug fixes

---

## 📁 Project Structure

```
CampusCycle/
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Domain.js
│   │   ├── Tag.js
│   │   ├── Request.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   ├── Reservation.js
│   │   ├── Rating.js
│   │   ├── Report.js
│   │   ├── Ticket.js
│   │   └── Notification.js
│   ├── routes/
│   │   └── auth.js
│   ├── seeds/
│   │   └── domains.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   ├── common/
│   │   │   ├── listings/
│   │   │   ├── auth/
│   │   │   ├── search/
│   │   │   ├── profile/
│   │   │   ├── messaging/
│   │   │   ├── modals/
│   │   │   └── dashboard/
│   │   ├── pages/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── build-plan.txt
└── README.md
```

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Student** | Create listings, buy/rent/borrow/donate, message, rate, report |
| **Moderator** | Review reports, warn/restrict users, manage content |
| **Admin** | Full access, manage users/moderators, system settings |

---

## 🏷️ Domain Structure

| Domain | Categories |
|--------|------------|
| 📚 **Academics** | Books, Calculators, Lab Equipment, Drawing Materials |
| 🔌 **Projects & Electronics** | Arduino, Raspberry Pi, Sensors, Components, Tools |
| 🏠 **Hostel & Campus Life** | Furniture, Electronics, Room Essentials |
| ⚽ **Sports & Fitness** | Cycles, Sports Equipment, Fitness |
| 📦 **Other Resources** | Stationery, Notes & Study Material |

---

## 📜 License

This project is for educational purposes.

---

**Built with ❤️ for the campus community**
