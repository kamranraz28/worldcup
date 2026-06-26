# Toffee FIFA World Cup 2026 — Event Management & Customer Verification Platform
## Complete Software Blueprint

---

## 1. Complete Software Architecture

### 1.1 Architectural Style
**Domain-Driven Design (DDD) layered architecture with hexagonal (ports & adapters) influences.**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Inertia.js + React.js SPA   │   Laravel Blade (Admin)     │
│  Tailwind CSS / Framer Motion│   REST API (Third-party)    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / JSON / Inertia Protocol
┌────────────────────────▼────────────────────────────────────┐
│                    Application Layer                         │
│  Controllers ──► Form Requests ──► DTOs                     │
│  Middleware (Auth, RBAC, Throttle, Verify)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ Dependency Injection
┌────────────────────────▼────────────────────────────────────┐
│                    Service Layer (Domain Services)           │
│  EventService │ VerificationService │ TicketService         │
│  CampaignService │ NotificationService │ ReportService      │
│  PaymentService │ QRService │ CustomerService              │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Repository Layer (Persistence)            │
│  Eloquent Repositories │ Cache Repositories                │
│  Unit of Work │ Specification Pattern                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Infrastructure Layer                      │
│  MySQL │ Redis │ RabbitMQ/SQS │ MinIO/S3 │ Firebase        │
│  Mail (SMTP/SES) │ SMS (Twilio/Infobip) │ OCR Service      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Key Design Principles
- **SOLID** — every class has single responsibility
- **DRY** — shared logic extracted to services/traits
- **CQRS** — read models separated from write models for complex queries
- **Event Sourcing** — critical domain actions emit events
- **Fail-fast validation** — validate at the boundary (Form Requests)
- **Idempotency** — all payment/verification operations idempotent

### 1.3 Technology Stack Detailed

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Backend Framework | Laravel 10 | Mature ecosystem, queue system, built-in auth |
| PHP Version | 8.2 | Union types, readonly properties, performance |
| Frontend | React 18 + Inertia.js | SPA-like experience without API overhead |
| Styling | Tailwind CSS 3 | Utility-first, rapid prototyping |
| Animation | Framer Motion | Production-ready motion library |
| State Management | Zustand (lightweight) | Simpler than Redux, sufficient for this scope |
| Database | MySQL 8 | InnoDB, JSON columns, CTEs |
| Cache / Session | Redis 7 | High-performance, pub/sub for real-time |
| Queue | RabbitMQ (or SQS) | Reliable async processing |
| File Storage | S3-compatible (MinIO dev / AWS S3 prod) | Scalable, CDN-ready |
| Search (optional) | MeiliSearch (or Elasticsearch for scale) | Typo-tolerant, fast |
| CI/CD | GitHub Actions | Free, tightly integrated |
| Containerization | Docker + Docker Compose | Dev/Prod parity |
| Monitoring | Laravel Telescope (dev), Sentry (prod) | Observability |

---

## 2. Folder Structure

```
worldcup2026/
├── app/
│   ├── Console/
│   │   ├── Commands/
│   │   │   ├── VerifyPendingCustomers.php
│   │   │   ├── ReleaseExpiredTickets.php
│   │   │   ├── SendEventReminders.php
│   │   │   └── GenerateDailyReports.php
│   │   └── Kernel.php
│   ├── Events/
│   │   ├── CustomerVerified.php
│   │   ├── TicketPurchased.php
│   │   ├── EventCreated.php
│   │   ├── CheckedIn.php
│   │   └── CampaignActivated.php
│   ├── Exceptions/
│   │   ├── VerificationFailedException.php
│   │   ├── InsufficientTicketsException.php
│   │   └── DuplicateRegistrationException.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── EventController.php
│   │   │   │   ├── TicketController.php
│   │   │   │   ├── VerificationController.php
│   │   │   │   └── CampaignController.php
│   │   │   ├── Web/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── EventController.php
│   │   │   │   ├── CustomerController.php
│   │   │   │   ├── VerificationController.php
│   │   │   │   ├── ReportController.php
│   │   │   │   └── CampaignController.php
│   │   │   └── Admin/
│   │   │       ├── UserController.php
│   │   │       ├── RoleController.php
│   │   │       ├── SystemConfigController.php
│   │   │       └── AuditLogController.php
│   │   ├── Middleware/
│   │   │   ├── VerifyCustomerVerified.php
│   │   │   ├── CheckEventCapacity.php
│   │   │   ├── LogApiRequests.php
│   │   │   └── ThrottleVerification.php
│   │   ├── Requests/
│   │   │   ├── StoreEventRequest.php
│   │   │   ├── UpdateEventRequest.php
│   │   │   ├── SubmitVerificationRequest.php
│   │   │   ├── PurchaseTicketRequest.php
│   │   │   └── RegisterCustomerRequest.php
│   │   └── Resources/
│   │       ├── EventResource.php
│   │       ├── TicketResource.php
│   │       ├── CustomerResource.php
│   │       └── CampaignResource.php
│   ├── Jobs/
│   │   ├── ProcessVerificationDocument.php
│   │   ├── SendVerificationEmail.php
│   │   ├── GenerateTicketPDF.php
│   │   ├── SyncEventToCache.php
│   │   ├── ProcessBulkVerification.php
│   │   └── ExportReportJob.php
│   ├── Listeners/
│   │   ├── SendVerificationNotification.php
│   │   ├── UpdateTicketInventory.php
│   │   ├── LogVerificationAudit.php
│   │   ├── InvalidateEventCache.php
│   │   └── NotifyAdminsOnFlaggedVerification.php
│   ├── Mail/
│   │   ├── CustomerVerifiedMail.php
│   │   ├── TicketConfirmationMail.php
│   │   ├── EventReminderMail.php
│   │   └── CampaignInviteMail.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Role.php
│   │   ├── Permission.php
│   │   ├── Event.php
│   │   ├── Ticket.php
│   │   ├── Customer.php
│   │   ├── CustomerVerification.php
│   │   ├── Campaign.php
│   │   ├── CampaignParticipant.php
│   │   ├── CheckIn.php
│   │   ├── Notification.php
│   │   ├── Report.php
│   │   ├── AuditLog.php
│   │   └── SystemConfig.php
│   ├── Notifications/
│   │   ├── VerificationApproved.php
│   │   ├── VerificationRejected.php
│   │   ├── TicketAssigned.php
│   │   └── EventReminder.php
│   ├── Observers/
│   │   ├── EventObserver.php
│   │   ├── TicketObserver.php
│   │   └── CustomerObserver.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   ├── RepositoryServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   └── HorizonServiceProvider.php
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   ├── EventRepositoryInterface.php
│   │   │   ├── TicketRepositoryInterface.php
│   │   │   ├── CustomerRepositoryInterface.php
│   │   │   ├── CampaignRepositoryInterface.php
│   │   │   ├── VerificationRepositoryInterface.php
│   │   │   └── ReportRepositoryInterface.php
│   │   ├── Eloquent/
│   │   │   ├── EventRepository.php
│   │   │   ├── TicketRepository.php
│   │   │   ├── CustomerRepository.php
│   │   │   ├── CampaignRepository.php
│   │   │   ├── VerificationRepository.php
│   │   │   └── ReportRepository.php
│   │   └── Criteria/
│   │       ├── VerifiedCustomersCriteria.php
│   │       ├── UpcomingEventsCriteria.php
│   │       └── HighValueCampaignsCriteria.php
│   ├── Services/
│   │   ├── EventService.php
│   │   ├── TicketService.php
│   │   ├── VerificationService.php
│   │   ├── CampaignService.php
│   │   ├── NotificationService.php
│   │   ├── QRService.php
│   │   ├── ReportService.php
│   │   ├── AuditService.php
│   │   ├── FileStorageService.php
│   │   └── CustomerService.php
│   ├── Traits/
│   │   ├── ApiResponse.php
│   │   ├── Filterable.php
│   │   ├── HasUuid.php
│   │   ├── LogsActivity.php
│   │   └── Cacheable.php
│   └── ValueObjects/
│       ├── Address.php
│       ├── Money.php
│       ├── VerificationStatus.php
│       └── TicketType.php
├── bootstrap/
├── config/
│   ├── verification.php
│   ├── events.php
│   ├── campaigns.php
│   ├── queue.php
│   └── services.php
├── database/
│   ├── factories/
│   ├── migrations/
│   │   ├── 0001_create_users_table.php
│   │   ├── 0002_create_roles_permissions_tables.php
│   │   ├── 0003_create_events_table.php
│   │   ├── 0004_create_customers_table.php
│   │   ├── 0005_create_customer_verifications_table.php
│   │   ├── 0006_create_tickets_table.php
│   │   ├── 0007_create_campaigns_table.php
│   │   ├── 0008_create_campaign_participants_table.php
│   │   ├── 0009_create_check_ins_table.php
│   │   ├── 0010_create_notifications_table.php
│   │   ├── 0011_create_reports_table.php
│   │   ├── 0012_create_audit_logs_table.php
│   │   └── 0013_create_system_configs_table.php
│   └── seeders/
│       ├── RolePermissionSeeder.php
│       ├── AdminUserSeeder.php
│       └── SampleEventSeeder.php
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── UI/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── Stepper.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── FileUpload.jsx
│   │   │   ├── Forms/
│   │   │   │   ├── EventForm.jsx
│   │   │   │   ├── VerificationForm.jsx
│   │   │   │   └── CampaignForm.jsx
│   │   │   ├── Charts/
│   │   │   │   ├── EventChart.jsx
│   │   │   │   └── VerificationChart.jsx
│   │   │   └── Layout/
│   │   │       ├── AppLayout.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       └── PublicLayout.jsx
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Create.jsx
│   │   │   │   ├── Show.jsx
│   │   │   │   └── Edit.jsx
│   │   │   ├── Tickets/
│   │   │   │   ├── Index.jsx
│   │   │   │   └── Show.jsx
│   │   │   ├── Customers/
│   │   │   │   ├── Index.jsx
│   │   │   │   └── Show.jsx
│   │   │   ├── Verifications/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Pending.jsx
│   │   │   │   └── Review.jsx
│   │   │   ├── Campaigns/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Create.jsx
│   │   │   │   └── Show.jsx
│   │   │   ├── Reports/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Events.jsx
│   │   │   │   └── Verifications.jsx
│   │   │   ├── Admin/
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── Roles.jsx
│   │   │   │   └── Settings.jsx
│   │   │   └── Errors/
│   │   │       ├── NotFound.jsx
│   │   │       └── Forbidden.jsx
│   │   ├── Hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePermission.js
│   │   │   └── useDebounce.js
│   │   ├── Store/
│   │   │   ├── authStore.js
│   │   │   ├── eventStore.js
│   │   │   └── notificationStore.js
│   │   ├── Utils/
│   │   │   ├── formatDate.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   └── app.jsx
│   ├── views/
│   │   └── app.blade.php
│   └── lang/
│       └── en/
├── routes/
│   ├── web.php
│   ├── api.php
│   ├── admin.php
│   └── channels.php
├── storage/
│   ├── app/
│   │   └── verification-docs/
│   ├── exports/
│   └── logs/
├── tests/
│   ├── Unit/
│   │   ├── Services/
│   │   │   ├── EventServiceTest.php
│   │   │   ├── VerificationServiceTest.php
│   │   │   └── TicketServiceTest.php
│   │   ├── Repositories/
│   │   └── ValueObjects/
│   ├── Feature/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── EventControllerTest.php
│   │   │   │   ├── VerificationControllerTest.php
│   │   │   │   └── TicketControllerTest.php
│   │   └── Api/
│   ├── Browser/  (Laravel Dusk)
│   └── TestCase.php
├── docs/
├── docker/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── package.json
```

---

## 3. Module List

| # | Module | Description | Priority |
|---|--------|-------------|----------|
| 1 | **Authentication & Authorization** | Login, Register, MFA, RBAC, Session Management | P0 |
| 2 | **User Management** | CRUD users, profile, account settings | P0 |
| 3 | **Role & Permission Management** | Dynamic roles, granular permissions, CRUD | P0 |
| 4 | **Customer Management** | CRUD customers, search, segmentation | P0 |
| 5 | **Customer Verification** | Document upload, OCR processing, manual review, 3 status flow | P0 |
| 6 | **Event Management** | CRUD events, capacity, scheduling, venue, geo-location | P0 |
| 7 | **Ticket Management** | Allocation, reservation, release, QR generation, PDF | P0 |
| 8 | **Check-In System** | QR scanning, real-time validation, capacity enforcement | P0 |
| 9 | **Campaign Management** | Loyalty/engagement campaigns across World Cup period | P1 |
| 10 | **Notification Engine** | Email, SMS, In-app, Push — template-driven | P1 |
| 11 | **Dashboard & Analytics** | KPI cards, trend charts, exportable reports | P1 |
| 12 | **Report Module** | Predefined + custom report builder, CSV/XLSX/PDF export | P1 |
| 13 | **Audit Trail** | Immutable log of all domain actions | P1 |
| 14 | **System Configuration** | Configurable settings via admin panel | P1 |
| 15 | **API Gateway** | Rate-limited, documented, versioned public API | P1 |
| 16 | **Mass Communication** | Bulk email/SMS for campaign blasts | P2 |
| 17 | **Reward / Loyalty** | Points, badges, tier levels tied to participation | P2 |
| 18 | **Feedback & Survey** | Post-event NPS, satisfaction surveys | P2 |
| 19 | **Live Streaming Integration** | Embed YouTube/Twitch for virtual events | P2 |
| 20 | **Export / Import** | Bulk CSV/XLSX import/export for customers, tickets | P2 |

---

## 4. Database Design

### 4.1 Tables

#### `users`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, INDEX | Public identifier |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| phone | VARCHAR(20) | UNIQUE, NULLABLE | |
| email_verified_at | TIMESTAMP | NULLABLE | |
| password | VARCHAR(255) | NOT NULL | Bcrypt |
| two_factor_secret | TEXT | NULLABLE | |
| two_factor_recovery_codes | TEXT | NULLABLE | |
| role_id | BIGINT UNSIGNED | FK -> roles.id | |
| is_active | TINYINT(1) | DEFAULT 1 | |
| last_login_at | TIMESTAMP | NULLABLE | |
| last_login_ip | VARCHAR(45) | NULLABLE | |
| remember_token | VARCHAR(100) | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

#### `roles`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| name | VARCHAR(50) | UNIQUE, NOT NULL | slug format |
| display_name | VARCHAR(100) | NOT NULL | Human readable |
| description | TEXT | NULLABLE | |
| guard_name | VARCHAR(40) | DEFAULT 'web' | |
| is_system | TINYINT(1) | DEFAULT 0 | System-protected |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `permissions`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | `module.action` |
| display_name | VARCHAR(100) | NOT NULL | |
| group | VARCHAR(50) | NOT NULL, INDEX | Module grouping |
| guard_name | VARCHAR(40) | DEFAULT 'web' | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `role_has_permissions` (pivot)
| Column | Type | Constraints |
|--------|------|-------------|
| permission_id | BIGINT UNSIGNED | FK, PK (composite) |
| role_id | BIGINT UNSIGNED | FK, PK (composite) |

#### `model_has_roles` (pivot — for direct user->role)
| Column | Type | Constraints |
|--------|------|-------------|
| role_id | BIGINT UNSIGNED | FK |
| model_type | VARCHAR(255) | |
| model_id | BIGINT UNSIGNED | |

#### `events`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE | Public-facing ID |
| title | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly |
| description | TEXT | NULLABLE | Rich text (sanitized HTML) |
| event_type | ENUM('physical','virtual','hybrid') | NOT NULL | |
| venue_name | VARCHAR(255) | NULLABLE | |
| venue_address | TEXT | NULLABLE | |
| venue_lat | DECIMAL(10,7) | NULLABLE | |
| venue_lng | DECIMAL(10,7) | NULLABLE | |
| max_capacity | INT UNSIGNED | NOT NULL | |
| ticket_price | DECIMAL(10,2) | DEFAULT 0.00 | nullable if free |
| start_date | DATETIME | NOT NULL | |
| end_date | DATETIME | NOT NULL | |
| registration_deadline | DATETIME | NOT NULL | |
| banner_image | VARCHAR(255) | NULLABLE | S3 path |
| status | ENUM('draft','published','cancelled','completed') | DEFAULT 'draft' | |
| requires_verification | TINYINT(1) | DEFAULT 1 | |
| metadata | JSON | NULLABLE | Flexible fields |
| created_by | BIGINT UNSIGNED | FK -> users.id | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

#### `event_sessions` (sub-sessions within an event)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| event_id | BIGINT UNSIGNED | FK -> events.id | |
| title | VARCHAR(255) | NOT NULL | |
| start_time | DATETIME | NOT NULL | |
| end_time | DATETIME | NOT NULL | |
| capacity | INT UNSIGNED | NULLABLE | Per-session cap |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `customers`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE | |
| user_id | BIGINT UNSIGNED | FK -> users.id, UNIQUE, NULLABLE | Linked account |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL, INDEX | |
| phone | VARCHAR(20) | NOT NULL, INDEX | |
| date_of_birth | DATE | NULLABLE | |
| nationality | CHAR(3) | NULLABLE | ISO 3166-1 alpha-3 |
| document_type | ENUM('passport','national_id','drivers_license') | NULLABLE | |
| document_number | VARCHAR(50) | NULLABLE, INDEX | |
| metadata | JSON | NULLABLE | Extra KYC fields |
| is_verified | TINYINT(1) | DEFAULT 0 | Shortcut flag |
| verified_at | TIMESTAMP | NULLABLE | |
| last_participated_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |
| deleted_at | TIMESTAMP | NULLABLE | |

#### `customer_verifications`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| customer_id | BIGINT UNSIGNED | FK -> customers.id | |
| uuid | CHAR(36) | UNIQUE | |
| verification_type | ENUM('identity','address','age','ticket_eligibility') | NOT NULL | |
| status | ENUM('pending','in_review','verified','rejected','flagged') | DEFAULT 'pending' | |
| document_front | VARCHAR(255) | NULLABLE | S3 path |
| document_back | VARCHAR(255) | NULLABLE | S3 path |
| selfie_image | VARCHAR(255) | NULLABLE | S3 path |
| ocr_data | JSON | NULLABLE | Extracted text from OCR |
| confidence_score | DECIMAL(5,2) | NULLABLE | OCR confidence |
| reviewed_by | BIGINT UNSIGNED | FK -> users.id, NULLABLE | |
| reviewed_at | TIMESTAMP | NULLABLE | |
| rejection_reason | VARCHAR(500) | NULLABLE | |
| verification_metadata | JSON | NULLABLE | Audit trail of checks |
| expires_at | TIMESTAMP | NULLABLE | Re-verification needed |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `tickets`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE | QR code payload |
| event_id | BIGINT UNSIGNED | FK -> events.id | |
| event_session_id | BIGINT UNSIGNED | FK, NULLABLE | |
| customer_id | BIGINT UNSIGNED | FK -> customers.id | |
| user_id | BIGINT UNSIGNED | FK -> users.id, NULLABLE | Staff-issued |
| ticket_type | ENUM('general','vip','vvip','comp','staff') | NOT NULL | |
| price | DECIMAL(10,2) | DEFAULT 0.00 | |
| currency | CHAR(3) | DEFAULT 'BDT' | |
| status | ENUM('reserved','confirmed','cancelled','redeemed','expired') | DEFAULT 'reserved' | |
| qr_code | TEXT | NOT NULL | Encoded payload |
| qr_code_path | VARCHAR(255) | NULLABLE | PDF/PNG path |
| checked_in_at | TIMESTAMP | NULLABLE | |
| checked_in_by | BIGINT UNSIGNED | FK, NULLABLE | |
| reserved_until | DATETIME | NULLABLE | Auto-release timer |
| metadata | JSON | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `check_ins`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| ticket_id | BIGINT UNSIGNED | FK -> tickets.id | |
| event_id | BIGINT UNSIGNED | FK -> events.id | |
| customer_id | BIGINT UNSIGNED | FK -> customers.id | |
| scanned_by | BIGINT UNSIGNED | FK -> users.id | Staff who scanned |
| scan_method | ENUM('qr','manual','nfc') | DEFAULT 'qr' | |
| device_id | VARCHAR(100) | NULLABLE | Device identifier |
| ip_address | VARCHAR(45) | NULLABLE | |
| location_data | JSON | NULLABLE | GPS at scan time |
| is_valid | TINYINT(1) | DEFAULT 1 | |
| validation_message | VARCHAR(255) | NULLABLE | |
| scanned_at | TIMESTAMP | | |
| created_at | TIMESTAMP | | |

#### `campaigns`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE | |
| title | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | UNIQUE | |
| description | TEXT | NULLABLE | |
| campaign_type | ENUM('loyalty','referral','engagement','contest','promotion') | NOT NULL | |
| start_date | DATETIME | NOT NULL | |
| end_date | DATETIME | NOT NULL | |
| reward_type | ENUM('points','ticket','merchandise','coupon','cashback') | NULLABLE | |
| reward_value | DECIMAL(10,2) | NULLABLE | |
| total_budget | DECIMAL(12,2) | NULLABLE | |
| total_participants | INT UNSIGNED | DEFAULT 0 | Counter cache |
| max_participants | INT UNSIGNED | NULLABLE | Cap |
| rules | JSON | NULLABLE | Eligibility rules |
| status | ENUM('draft','active','paused','completed','cancelled') | DEFAULT 'draft' | |
| created_by | BIGINT UNSIGNED | FK | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |
| deleted_at | TIMESTAMP | NULLABLE | |

#### `campaign_participants`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| campaign_id | BIGINT UNSIGNED | FK -> campaigns.id | |
| customer_id | BIGINT UNSIGNED | FK -> customers.id | |
| points_earned | INT UNSIGNED | DEFAULT 0 | |
| rewards_claimed | JSON | NULLABLE | |
| status | ENUM('active','completed','disqualified') | DEFAULT 'active' | |
| joined_at | TIMESTAMP | | |
| completed_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |
| UNIQUE(campaign_id, customer_id) | | | |

#### `notifications`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| type | VARCHAR(100) | NOT NULL | Notification class |
| notifiable_type | VARCHAR(255) | | |
| notifiable_id | BIGINT UNSIGNED | | |
| channel | ENUM('mail','sms','database','push') | NOT NULL | |
| subject | VARCHAR(255) | NULLABLE | |
| body | TEXT | NOT NULL | |
| data | JSON | NULLABLE | |
| read_at | TIMESTAMP | NULLABLE | |
| sent_at | TIMESTAMP | NULLABLE | |
| failed_at | TIMESTAMP | NULLABLE | |
| error_message | TEXT | NULLABLE | |
| created_at | TIMESTAMP | | |

#### `reports`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| uuid | CHAR(36) | UNIQUE | |
| name | VARCHAR(255) | NOT NULL | |
| type | ENUM('events','verifications','tickets','campaigns','customers','custom') | NOT NULL | |
| parameters | JSON | NULLABLE | Filter params used |
| file_path | VARCHAR(255) | NULLABLE | Generated file path |
| file_type | ENUM('csv','xlsx','pdf') | NULLABLE | |
| status | ENUM('pending','processing','completed','failed') | DEFAULT 'pending' | |
| generated_by | BIGINT UNSIGNED | FK -> users.id | |
| generated_at | TIMESTAMP | NULLABLE | |
| metadata | JSON | NULLABLE | Row counts, etc. |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

#### `audit_logs`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| user_id | BIGINT UNSIGNED | FK, NULLABLE | |
| uuid | CHAR(36) | UNIQUE | |
| action | VARCHAR(100) | NOT NULL, INDEX | `customer.verified` |
| model_type | VARCHAR(255) | NULLABLE | |
| model_id | BIGINT UNSIGNED | NULLABLE | |
| old_values | JSON | NULLABLE | |
| new_values | JSON | NULLABLE | |
| ip_address | VARCHAR(45) | NULLABLE | |
| user_agent | TEXT | NULLABLE | |
| tags | JSON | NULLABLE | |
| created_at | TIMESTAMP | INDEX | |

#### `system_configs`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK | |
| key | VARCHAR(255) | UNIQUE, NOT NULL | Dot notation |
| value | TEXT | NOT NULL | |
| type | ENUM('string','integer','boolean','json') | DEFAULT 'string' | |
| description | TEXT | NULLABLE | |
| is_public | TINYINT(1) | DEFAULT 0 | Exposed via API |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

---

## 5. ER Diagram (Text)

```
┌─────────────┐       ┌──────────────────────┐
│    roles    │──1:N──│     users            │
└──────┬──────┘       └──────────────────────┘
       │                      │
  N:M──┤                      │ 1:1
       │               ┌──────┴──────────┐
┌──────┴──────┐        │   customers      │
│ permissions │        └──────┬───────────┘
└──────┬──────┘               │
       │ N:M                  │ 1:N
       │               ┌──────┴────────────────┐
       │               │ customer_verifications │
       │               └───────────────────────┘
       │
       │               ┌───────────┐
       │        1:N───│  events   │────1:N───┐
       │               └─────┬─────┘          │
       │                     │                │
       │               1:N   │           ┌────┴────────┐
       │              ┌──────┴──────┐    │ event_      │
       │              │   tickets   │──1:N sessions    │
       │              └──────┬──────┘    └─────────────┘
       │                     │
       │               1:1   │
       │              ┌──────┴──────┐
       │              │  check_ins  │
       │              └─────────────┘
       │
       │               ┌────────────┐
       │        1:N───│  campaigns │────1:N──┐
       │               └──────┬─────┘         │
       │                      │               │
       │                1:N   │          ┌────┴──────────────┐
       │              ┌───────┴───────┐  │ campaign_         │
       │              │  campaign_    │──1 participants     │
       │              │  participants │  └───────────────────┘
       │              └───────────────┘
       │
       │               ┌──────────────┐
       │               │  audit_logs  │
       │               └──────────────┘
       │
       │               ┌──────────────┐
       │               │  reports     │
       │               └──────────────┘
       │
       │               ┌──────────────┐
       │               │  system_     │
       │               │  configs     │
       │               └──────────────┘
```

---

## 6. Table Relationships

| # | Parent | Child | Type | Foreign Key | Notes |
|---|--------|-------|------|-------------|-------|
| 1 | roles | users | 1:N | users.role_id | One role per user (simplified RBAC) |
| 2 | roles | role_has_permissions | N:M | role_id | Many-to-many via pivot |
| 3 | permissions | role_has_permissions | N:M | permission_id | |
| 4 | users | customers | 1:1 | customers.user_id | Optional user account |
| 5 | customers | customer_verifications | 1:N | customer_verifications.customer_id | |
| 6 | customers | tickets | 1:N | tickets.customer_id | |
| 7 | events | tickets | 1:N | tickets.event_id | |
| 8 | events | event_sessions | 1:N | event_sessions.event_id | |
| 9 | event_sessions | tickets | 1:N | tickets.event_session_id | Optional |
| 10 | tickets | check_ins | 1:1 | check_ins.ticket_id | |
| 11 | users | check_ins | 1:N | check_ins.scanned_by | Staff |
| 12 | events | check_ins | 1:N | check_ins.event_id | Denormalized for fast query |
| 13 | campaigns | campaign_participants | 1:N | campaign_participants.campaign_id | |
| 14 | customers | campaign_participants | 1:N | campaign_participants.customer_id | |
| 15 | users | reports | 1:N | reports.generated_by | |
| 16 | users | audit_logs | 1:N | audit_logs.user_id | Nullable for system actions |
| 17 | users | events | 1:N | events.created_by | |

---

## 7. User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **Super Admin** | Full system access, configuration, all CRUD | System-wide |
| **Admin** | Manage events, customers, verifications, reports | Administrative |
| **Verification Officer** | Review/reject/approve verification documents | Verification module |
| **Event Manager** | Create/manage events, view tickets, check-in ops | Events |
| **Check-in Staff** | Scan QR codes at venue, view assigned event | Limited |
| **Support Agent** | View customers, tickets, assist with issues | Read-mostly |
| **Customer** | Register, verify, purchase tickets, join campaigns | Self-service |
| **API Client** | Programmatic access via API keys | Configurable scopes |

---

## 8. Permission Matrix

### Permission Naming Convention: `module.action`

| Module | Actions |
|--------|---------|
| **users** | view, create, edit, delete, impersonate |
| **roles** | view, create, edit, delete |
| **events** | view, create, edit, delete, publish, cancel |
| **tickets** | view, create, edit, delete, redeem, transfer |
| **customers** | view, create, edit, delete, export, import |
| **verifications** | view, review, approve, reject, flag, re-request |
| **campaigns** | view, create, edit, delete, activate, pause |
| **checkins** | scan, view, override |
| **reports** | view, generate, export, delete |
| **notifications** | send, view, configure, templates |
| **audit** | view, export |
| **configs** | view, edit |

### Role ↔ Permission Mapping

| Permission ↓ | Super Admin | Admin | Verif. Officer | Event Mgr | Check-in | Support | Customer | API |
|--------------|:-----------:|:-----:|:--------------:|:---------:|:--------:|:-------:|:--------:|:---:|
| *.view | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | own | scope |
| *.create | ✓ | ✓ | - | ✓ | - | - | own | scope |
| *.edit | ✓ | ✓ | - | ✓ | - | - | own | scope |
| *.delete | ✓ | ✓ | - | ✓ | - | - | - | scope |
| users.* | ✓ | - | - | - | - | - | - | - |
| roles.* | ✓ | - | - | - | - | - | - | - |
| verifications.review | ✓ | ✓ | ✓ | - | - | - | - | - |
| verifications.approve | ✓ | ✓ | ✓ | - | - | - | - | - |
| checkins.scan | ✓ | ✓ | - | ✓ | ✓ | - | - | ✓ |
| configs.* | ✓ | - | - | - | - | - | - | - |
| audit.* | ✓ | ✓ | - | - | - | - | - | - |
| reports.* | ✓ | ✓ | - | ✓ | - | - | - | - |

> **Row-Level Security:** Customers can only view/edit their own profile, tickets, and verifications.

---

## 9. Route Structure

### 9.1 Web Routes (`routes/web.php`) — Inertia Pages

```
GET   /                                   -> Home (public)
GET   /dashboard                          -> Dashboard (auth)

# Events
GET   /events                             -> Events.Index
GET   /events/create                      -> Events.Create
GET   /events/{event}                     -> Events.Show
GET   /events/{event}/edit                -> Events.Edit
POST  /events                             -> Events.Store
PUT   /events/{event}                     -> Events.Update
DELETE/events/{event}                     -> Events.Destroy
POST  /events/{event}/publish             -> Events.Publish
POST  /events/{event}/cancel              -> Events.Cancel

# Tickets
GET   /events/{event}/tickets             -> Tickets.Index
GET   /tickets/{ticket}                   -> Tickets.Show
POST  /events/{event}/tickets             -> Tickets.Purchase
POST  /tickets/{ticket}/cancel            -> Tickets.Cancel

# Customers
GET   /customers                          -> Customers.Index
GET   /customers/{customer}               -> Customers.Show
POST  /customers                          -> Customers.Store
PUT   /customers/{customer}               -> Customers.Update

# Verifications
GET   /verifications                      -> Verifications.Index
GET   /verifications/pending              -> Verifications.Pending
GET   /verifications/{verification}       -> Verifications.Show
POST  /verifications/{verification}/review-> Verifications.Review
POST  /verifications/{verification}/approve-> Verifications.Approve
POST  /verifications/{verification}/reject -> Verifications.Reject
POST  /customer/verification              -> Verifications.Submit (customer)

# Campaigns
GET   /campaigns                          -> Campaigns.Index
GET   /campaigns/create                   -> Campaigns.Create
GET   /campaigns/{campaign}               -> Campaigns.Show
POST  /campaigns                          -> Campaigns.Store
PUT   /campaigns/{campaign}               -> Campaigns.Update
POST  /campaigns/{campaign}/join          -> Campaigns.Join

# Check-In
POST  /check-in/scan                      -> CheckIn.Scan

# Reports
GET   /reports                            -> Reports.Index
GET   /reports/events                     -> Reports.Events
GET   /reports/verifications              -> Reports.Verifications
POST  /reports/generate                   -> Reports.Generate
GET   /reports/{report}/download          -> Reports.Download

# Notifications
GET   /notifications                      -> Notifications.Index
POST  /notifications/{id}/read            -> Notifications.MarkRead

# Admin
GET   /admin/users                        -> Admin.Users
GET   /admin/roles                        -> Admin.Roles
GET   /admin/settings                     -> Admin.Settings
PUT   /admin/settings                     -> Admin.UpdateSettings
```

### 9.2 API Routes (`routes/api.php`) — JSON

```
# Auth
POST  /api/auth/login                     -> Auth.Login
POST  /api/auth/register                  -> Auth.Register
POST  /api/auth/logout                    -> Auth.Logout
POST  /api/auth/refresh                   -> Auth.Refresh
GET   /api/auth/me                        -> Auth.Me

# Events
GET   /api/v1/events                      -> EventController.index
GET   /api/v1/events/{event}              -> EventController.show
POST  /api/v1/events                      -> EventController.store

# Tickets
POST  /api/v1/events/{event}/tickets      -> TicketController.purchase
GET   /api/v1/tickets                      -> TicketController.index
GET   /api/v1/tickets/{ticket}            -> TicketController.show

# Verifications
POST  /api/v1/verifications               -> VerificationController.submit
GET   /api/v1/verifications/status        -> VerificationController.status

# Check-In
POST  /api/v1/check-in                    -> CheckInController.scan

# Campaigns
GET   /api/v1/campaigns                   -> CampaignController.index
POST  /api/v1/campaigns/{campaign}/join   -> CampaignController.join

# Customer
GET   /api/v1/customer/tickets            -> CustomerController.tickets
GET   /api/v1/customer/events             -> CustomerController.events
```

### 9.3 Admin Routes (`routes/admin.php`) — Admin prefix

```
GET   /admin/dashboard                    -> DashboardController
GET   /admin/audit-logs                   -> AuditLogController.index
GET   /admin/audit-logs/export            -> AuditLogController.export
```

### 9.4 Broadcast Channels (`routes/channels.php`)

```
App\Models\User.{id}        -> Private notification channel
App.Models.Customer.{id}    -> Customer notification channel
```

---

## 10. Service Layer

All business logic lives in service classes. Controllers are thin — they delegate to services.

### 10.1 Service Classes & Responsibilities

| Service | Key Methods | Notes |
|---------|-------------|-------|
| `EventService` | create(), update(), publish(), cancel(), getUpcoming(), getCapacityStatus() | Handles all event lifecycle |
| `TicketService` | purchase(), reserve(), confirm(), cancel(), releaseExpired(), generateQR() | Idempotent ticket operations |
| `VerificationService` | submit(), review(), approve(), reject(), flag(), checkStatus(), autoVerify() | Plugable verification strategy |
| `CampaignService` | create(), activate(), pause(), join(), calculateRewards(), processCompletion() | State machine for campaigns |
| `CustomerService` | register(), updateProfile(), mergeDuplicates(), getVerificationStatus() | |
| `NotificationService` | send(), sendBulk(), sendTemplate(), getChannels(), trackDelivery() | Multi-channel orchestration |
| `QRService` | generate(), decode(), validate(), generatePDF() | QR lifecycle |
| `ReportService` | generate(), schedule(), export(), getPredefinedQueries() | Async report generation |
| `AuditService` | log(), getHistory(), exportLogs(), purgeOld() | Immutable logging |
| `FileStorageService` | upload(), delete(), getUrl(), getTemporaryUrl() | S3 abstraction |
| `CheckInService` | scan(), validate(), processEntry(), handleDuplicate() | Real-time validation |

### 10.2 Service Layer Rules
- Services depend on **Repository Interfaces**, not Eloquent directly
- Services emit **Events** for cross-cutting concerns
- Services are **testable** — inject mocks
- Services return **DTOs/Value Objects**, not models (for API responses)
- No HTTP concerns in services (no Request, no redirect)

---

## 11. Repository Layer

### 11.1 Repository Pattern

Each aggregate root has a repository interface and an Eloquent implementation.

```
Interface: EventRepositoryInterface
├── find(string $uuid): Event
├── findAll(array $criteria): Collection
├── paginate(array $criteria, int $perPage): LengthAwarePaginator
├── create(array $data): Event
├── update(Event $event, array $data): Event
├── delete(Event $event): bool
├── findUpcoming(): Collection
├── findBySlug(string $slug): ?Event
└── countByStatus(string $status): int
```

### 11.2 Criteria Pattern

Reusable query fragments applied to repositories:

- `VerifiedCustomersCriteria` — filters customers with `is_verified = true`
- `UpcomingEventsCriteria` — `start_date > now()`
- `PendingVerificationsCriteria` — `status = 'pending'`
- `ActiveCampaignsCriteria` — `status = 'active' AND end_date > now()`

### 11.3 Caching Strategy

- Read-heavy queries (events list, campaigns) cached in Redis
- Cache keys follow: `{model}:{criteria_hash}:{page}`
- Cache TTL based on data volatility (events: 10 min, configs: 1 hour)
- Cache invalidation via model observers + event listeners

---

## 12. Event & Queue Architecture

### 12.1 Domain Events

| Event | Emitted By | Listeners |
|-------|-----------|-----------|
| `CustomerVerified` | VerificationService | SendVerificationNotification, LogVerificationAudit, UpdateCustomerStatus |
| `TicketPurchased` | TicketService | SendTicketConfirmation, GenerateTicketPDF, UpdateEventCapacity |
| `EventCreated` | EventService | SyncEventToCache, SendEventNotification (to subscribers) |
| `CheckedIn` | CheckInService | LogAudit, SendWelcomeNotification, UpdateTicketStatus |
| `CampaignActivated` | CampaignService | NotifyEligibleCustomers, SyncCampaignToCache |
| `VerificationFlagged` | VerificationService | NotifyAdminsOnFlaggedVerification, LogAudit |

### 12.2 Queue Jobs

| Job | Queue | Description | Retry |
|-----|-------|-------------|-------|
| `ProcessVerificationDocument` | `high` | OCR processing, document validation | 3 |
| `SendVerificationEmail` | `email` | Deliver verification status | 3 |
| `GenerateTicketPDF` | `default` | Create downloadable ticket | 2 |
| `SyncEventToCache` | `cache` | Update Redis cache | 2 |
| `ExportReportJob` | `long-running` | Generate large report files | 1 |
| `ProcessBulkVerification` | `high` | Batch verification processing | 2 |
| `SendEventReminder` | `default` | 24hr/1hr before event | 3 |
| `ReleaseExpiredTickets` | `scheduler` | Cron, releases reserved tickets | 1 |

### 12.3 Queue Topology

```
                  ┌──────────────┐
                  │  Laravel     │
                  │  Scheduler   │
                  └──────┬───────┘
                         │ dispatches
                  ┌──────▼───────┐
                  │  Commands    │
                  └──────┬───────┘
                         │
┌────────────────────────┼────────────────────────┐
│                        │                         │
┌─────────▼──────┐ ┌────▼────────┐ ┌─────────────▼──┐
│ Queue: high     │ │ Queue:      │ │ Queue:          │
│ (5 workers)    │ │ default     │ │ long-running    │
│ OCR, Verification│ │ (3 workers)│ │ (1 worker)      │
└─────────┬──────┘ └────┬────────┘ │ Reports, Exports│
          │              │          └─────────────┬──┘
          │              │                        │
          └──────────────┼────────────────────────┘
                         │
                  ┌──────▼───────┐
                  │   RabbitMQ   │
                  │   (or SQS)   │
                  └──────────────┘
```

### 12.4 Failed Job Handling
- All jobs pushed to `failed_jobs` table
- Laravel Horizon for monitoring (dev: Telescope)
- Dead-letter queue for poison messages
- Automatic retry with exponential backoff

---

## 13. Notification System

### 13.1 Architecture

```
                     ┌───────────────────┐
                     │ NotificationService │
                     └────────┬──────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
  ┌──────▼──────┐    ┌───────▼───────┐    ┌───────▼───────┐
  │  MailChannel │    │   SMSChannel  │    │   DBChannel   │
  │ (SES/SMTP)   │    │(Twilio/Infobip)│   │ (in-app)      │
  └──────────────┘    └───────────────┘    └───────────────┘
                                              │
                                       ┌──────▼──────┐
                                       │   Pusher/    │
                                       │   WebSocket  │
                                       └─────────────┘
```

### 13.2 Notification Types

| Type | Channel | Trigger | Template |
|------|---------|---------|----------|
| Verification Approved | Email + DB | VerificationService.approve() | `emails/verification-approved.blade.php` |
| Verification Rejected | Email + DB | VerificationService.reject() | `emails/verification-rejected.blade.php` |
| Ticket Confirmation | Email + SMS + DB | TicketService.confirm() | `emails/ticket-confirmed.blade.php` |
| Event Reminder | Email + SMS | Schedule (24hr before) | `emails/event-reminder.blade.php` |
| Campaign Invite | Email | CampaignService.activate() | `emails/campaign-invite.blade.php` |
| Check-in Success | SMS + DB | CheckInService.scan() | `sms/checkin-success.txt` |

### 13.3 Template Management
- Blade templates stored in `resources/views/emails/` and `resources/views/sms/`
- Database-driven templates for admin-editable content (future)
- All templates have plain-text fallback

### 13.4 Delivery Tracking
- `notifications` table tracks send status per channel
- Bounce/complaint handling via SNS webhook (SES) or Twilio status callbacks
- Retry logic: 3 attempts with exponential backoff

---

## 14. Report Modules

### 14.1 Predefined Reports

| Report | Description | Filters |
|--------|-------------|---------|
| **Event Summary** | Per-event attendance, capacity %, revenue | date range, event type, status |
| **Verification Funnel** | Pending → Reviewed → Approved/Rejected rates | date range, document type |
| **Ticket Sales** | Tickets sold by type, revenue, cancellation % | date range, event |
| **Customer Demographics** | Age, nationality, verification status | date range |
| **Campaign Performance** | Participation rate, conversion, rewards distributed | campaign, date range |
| **Check-in Rate** | % of ticket holders who attended | event, date range |
| **Daily Active Users** | Platform activity trends | date range |

### 14.2 Architecture

```
Controller
    │
    ▼
ReportService
    │
    ├─► generate() ──► dispatch(ExportReportJob) ──► queue
    │                      │
    │                      ▼
    │                  Query Builder / DB::raw / Eloquent
    │                      │
    │                      ▼
    │                  Laravel Excel / Browsershot (PDF)
    │                      │
    │                      ▼
    │                  Storage (S3) ──► downloadable link
    │
    └─► getPredefinedQueries() ──► array of SQL snippets
```

### 14.3 Export Formats
- CSV — for data-heavy exports (unlimited rows)
- XLSX — for formatted spreadsheets (Laravel Excel)
- PDF — for presentation-ready reports (Laravel DomPDF / Browsershot)

---

## 15. API Integration Strategy

### 15.1 External Integrations

| Service | Purpose | Integration Method | Rate Limit |
|---------|---------|-------------------|------------|
| **OCR Service** (Google Vision / Tesseract) | Document text extraction | HTTP API (async) | 100 req/min |
| **SMS Gateway** (Twilio / Infobip) | OTP, notifications | REST API + Callback | 20 msg/sec |
| **Email Service** (AWS SES / Mailgun) | Transactional emails | SMTP / API | 50/sec |
| **Cloud Storage** (AWS S3 / MinIO) | Document images, QR PDFs | SDK (presigned URLs) | N/A |
| **Payment Gateway** (Stripe / JazzCash) | Ticket payments | Webhook + SDK | Per gateway |
| **Geocoding** (Google Maps) | Venue coordinates | HTTP API | 50 req/sec |
| **SMS OTP Provider** | Phone verification | REST API | 10 req/sec |

### 15.2 Internal API (RESTful)

| Version | Purpose | Auth | Base URL |
|---------|---------|------|----------|
| v1 | Customer-facing mobile/web | Bearer Token (Sanctum) | `/api/v1/` |
| v2 (future) | Public 3rd-party | API Key + HMAC | `/api/v2/` |

### 15.3 API Design Principles
- **Versioned** via URL prefix (`/api/v1/`)
- **Rate-limited** per user/IP: 60/min for auth, 300/min for general
- **Paginated** responses with cursor-based pagination for lists
- **Consistent envelope**: `{ "data": ..., "meta": { ... }, "errors": [] }`
- **JSON:API** spec compliance for complex queries (sparse fields, includes)
- **Idempotency keys** for payment and ticket operations
- **Webhook signatures** for all incoming external callbacks

### 15.4 Webhook Architecture

```
Third-party ──► POST /api/webhooks/{provider} ──► WebhookController
                                                       │
                                                       ▼
                                                  Verify Signature
                                                       │
                                                       ▼
                                                  Dispatch Job
                                                       │
                                                       ▼
                                                  Process Event
```

---

## 16. Security Architecture

### 16.1 Authentication
- **Laravel Breeze** with Inertia scaffolding
- **Laravel Sanctum** for SPA and API token auth
- **Multi-factor authentication** (TOTP) for admin roles
- **Session timeout** — 15 min idle for admins, 2 hr for customers
- **Password policy**: min 8 chars, mixed case, number, special char
- **Account lockout** after 5 failed attempts (15 min cooldown)

### 16.2 Authorization
- **Role-Based Access Control (RBAC)** via custom `RolePermissionService`
- **Permission gates** defined in `AuthServiceProvider`
- **Blade directives** (`@can`, `@cannot`) and Inertia permission checks
- **Form Request authorization** — `authorize()` method on every request
- **Row-level ownership** — scopes enforce user/customer can only access own data

### 16.3 Data Protection
- **Encryption at rest**: AES-256 for PII columns (document numbers)
- **Encryption in transit**: TLS 1.3 required for all HTTP/s
- **Database**: Encrypted RDS volumes, network isolation
- **Sensitive data masking**: Logs never contain full document numbers
- **GDPR ready**: Customer data export and deletion endpoints

### 16.4 API Security
- Rate limiting: 60 req/min for auth routes, 300/min for data routes
- CORS: Whitelist only known origins
- Payload validation: Strict typing, max size limits on uploads (10MB)
- SQL injection prevention: Parameterized queries via Eloquent
- XSS prevention: Blade escaping, Content-Security-Policy headers
- CSRF: Laravel's built-in CSRF protection + SPA cookie-based

### 16.5 File Upload Security
- Validate file type (MIME + magic bytes)
- Scan for malware (ClamAV integration)
- Store outside web root, serve via signed S3 URLs only
- Max file size: 10MB per document, 5 files per verification

### 16.6 Audit & Compliance
- **Immutable audit log** — all `create`, `update`, `delete` actions logged
- **Admin action logging** — every admin action with IP + user agent
- **Verification audit trail** — who reviewed, when, decision, reason
- **Retention policy**: audit logs kept 3 years, verification docs 1 year

---

## 17. Development Roadmap

### Phase 0: Foundation (Weeks 1-2)
- [ ] Install Laravel 10 + Breeze + Inertia + React
- [ ] Set up Docker environment (PHP 8.2, MySQL, Redis, MinIO)
- [ ] Configure GitHub repository + CI pipeline
- [ ] Set up Laravel Horizon, Telescope, Debugbar
- [ ] Create database migrations for all tables
- [ ] Implement base model traits (HasUuid, Filterable, Cacheable)
- [ ] Implement authentication (Breeze + Sanctum MFA)
- [ ] Implement RBAC (roles, permissions, seeders)

### Phase 1: Core Domain (Weeks 3-4)
- [ ] Repository pattern (interfaces + Eloquent implementations)
- [ ] Event management CRUD (full lifecycle)
- [ ] Customer registration + management
- [ ] Verification system (submit, OCR pipeline, review workflow)
- [ ] Ticket management (al location, QR generation, confirmation)
- [ ] Notification service (mail + database channels)

### Phase 2: Events & Check-in (Weeks 5-6)
- [ ] Event frontend pages (React + Inertia)
- [ ] Check-in system with QR scanning
- [ ] Ticket purchase/reservation flow
- [ ] Check-in staff mobile-responsive flow
- [ ] Dashboard with KPI widgets

### Phase 3: Campaigns & Engagement (Weeks 7-8)
- [ ] Campaign CRUD + lifecycle management
- [ ] Campaign participation flow
- [ ] Reward tracking
- [ ] SMS notification channel
- [ ] Push notification channel (Firebase)

### Phase 4: Reports & Analytics (Weeks 9-10)
- [ ] Predefined report generation (CSV, XLSX, PDF)
- [ ] Report scheduling
- [ ] Advanced analytics dashboard (charts with Framer Motion)
- [ ] Export/Import module

### Phase 5: Admin & Ops (Weeks 11-12)
- [ ] Admin panel (users, roles, system config)
- [ ] Audit log viewer
- [ ] Queue monitoring (Horizon)
- [ ] Log management
- [ ] Performance optimization (caching, query optimization)
- [ ] Load testing (K6)

### Phase 6: Integration & Hardening (Weeks 13-14)
- [ ] API documentation (Scribe/Swagger)
- [ ] Webhook integrations (payment, SMS, OCR)
- [ ] Penetration testing
- [ ] Security audit
- [ ] Documentation handover
- [ ] Production deployment rehearsal

---

## 18. Testing Strategy

### 18.1 Test Pyramid

```
         ╱╲
        ╱  ╲          E2E / Browser Tests (Dusk)
       ╱    ╲         ───────── 5%
      ╱────────╲
     ╱          ╲     Feature / Integration Tests
    ╱            ╲    ───────── 35%
   ╱──────────────╲
  ╱                ╲  Unit Tests
 ╱                  ╲ ───────── 60%
╱────────────────────╲
```

### 18.2 Unit Tests
- **Services**: Mock repositories, test business logic in isolation
- **Value Objects**: Test creation, equality, validation
- **Traits**: Test each trait separately
- **Commands**: Test command handler logic

### 18.3 Feature Tests
- **HTTP Controllers**: Full request → response cycle
- **API Endpoints**: Status codes, payload structure, auth
- **Middleware**: Auth, RBAC, throttle functionality
- **Form Requests**: Validation rules with both valid/invalid data
- **Jobs**: Dispatch and assert side effects

### 18.4 Browser Tests (Laravel Dusk)
- **Critical user journeys**:
  - Customer registration → verification → ticket purchase
  - Admin creates event → publishes → customer registers
  - Check-in staff scans QR → entry granted
- **Responsive testing**: Mobile, tablet, desktop viewports

### 18.5 Testing Tools
| Tool | Purpose |
|------|---------|
| PHPUnit | Unit & Feature tests |
| Laravel Dusk | Browser automation |
| Mockery | Mocking repositories/services |
| Faker | Fake data generation |
| RefreshDatabase | Test isolation |
| Pest PHP (optional) | More expressive test syntax |

### 18.6 CI Pipeline (GitHub Actions)

```
Push / PR
    │
    ▼
┌─────────────────────────┐
│ 1. Composer install     │
│ 2. NPM install + build  │
│ 3. PHP CS Fixer (lint)  │
│ 4. PHPStan (level 6)    │
│ 5. Unit tests           │
│ 6. Feature tests        │
│ 7. Dusk tests (on PR)   │
└─────────────────────────┘
```

### 18.7 Quality Gates
- Code coverage ≥ 80%
- Zero high-severity issues in PHPStan
- No failing tests
- All migrations pass cleanly

---

## 19. Deployment Strategy

### 19.1 Environments

| Environment | Purpose | URL | Scale |
|-------------|---------|-----|-------|
| **Local** | Developer workstations | `worldcup.test` | Docker |
| **Development** | Integration testing | `dev.worldcup.toffee.com` | 1 app + 1 db |
| **Staging** | UAT, load testing | `staging.worldcup.toffee.com` | 2 app + replica db |
| **Production** | Live | `worldcup.toffee.com` | Auto-scaled, HA |

### 19.2 Infrastructure (AWS)

```
                          ┌──────────────────────────┐
                          │   Route 53 (DNS)          │
                          │   CloudFront (CDN)        │
                          │   WAF (Web ACL)           │
                          └──────────┬───────────────┘
                                     │
                          ┌──────────▼───────────────┐
                          │   Application Load        │
                          │   Balancer (ALB)          │
                          └──────────┬───────────────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               │                     │                     │
        ┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
        │  ECS Fargate │      │  ECS Fargate │      │  ECS Fargate │
        │  App Task #1 │      │  App Task #2 │      │  App Task #N │
        │  (PHP-FPM)   │      │  (PHP-FPM)   │      │  (PHP-FPM)   │
        └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
               │                     │                     │
               └─────────────────────┼─────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
             ┌──────▼─────┐  ┌──────▼──────┐  ┌──────▼──────┐
             │  RDS for    │  │  ElastiCache │  │  RabbitMQ   │
             │  MySQL 8    │  │  Redis       │  │  or Amazon  │
             │  (Multi-AZ) │  │  (Cluster)   │  │  MQ / SQS   │
             └────────────┘  └─────────────┘  └─────────────┘
```

### 19.3 CI/CD Pipeline

```
Git Push (main)
    │
    ▼
GitHub Actions
    │
    ├─► Run tests + lint + static analysis
    │
    ├─► Build Docker image (Multi-stage: 178MB)
    │       ├─► Composer install --no-dev
    │       ├─► NPM build (production)
    │       └─► php artisan optimize
    │
    ├─► Push image to ECR
    │
    ├─► Deploy to Staging (ECS rolling update)
    │       └─► Run migrations
    │       └─► Smoke tests
    │
    └─► Deploy to Production (ECS blue/green)
            └─► Run migrations (maintenance mode)
            └─► Health checks (30s grace period)
            └─► Swap target groups (zero downtime)
```

### 19.4 Production Runbook

| Operation | Command / Action |
|-----------|-----------------|
| **Deploy** | GitHub Actions → ECS blue/green |
| **Rollback** | Promote previous task definition in ECS |
| **Migrate DB** | `php artisan migrate --force` (in deployment) |
| **Cache clear** | `php artisan optimize:clear` (part of deploy) |
| **Queue worker** | ECS scheduled tasks with Horizon |
| **Scale up** | ALB target group + ECS service auto-scaling (CPU > 70%) |
| **Backup DB** | Automated daily RDS snapshots (7 day retention) |
| **Logs** | CloudWatch Logs + Sentry for errors |
| **Alerting** | CloudWatch alarms + PagerDuty (5xx rates, latency) |

### 19.5 Monitoring & Alerting

| Metric | Tool | Alert Threshold |
|--------|------|----------------|
| 5xx rate | CloudWatch / Sentry | > 1% in 5 min |
| P95 latency | CloudWatch | > 500ms |
| Queue backlog | Horizon / CloudWatch | > 1000 messages |
| DB CPU | RDS Enhanced Monitoring | > 80% |
| Redis memory | ElastiCache | > 80% used |
| Disk space | ECS | > 85% |
| Failed jobs | Horizon | Any failure |
| Verification SLA | Custom metric | Pending > 24 hours |

---

## Appendix: Key Architectural Decisions (ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Inertia.js over full SPA | Faster initial load, simpler auth, no CORS issues |
| ADR-002 | Repository pattern | Testability, swapable persistence, domain isolation |
| ADR-003 | RabbitMQ over database queue | Reliability, delayed retries, dead-letter queues |
| ADR-004 | UUID public IDs | Security through obscurity, future sharding |
| ADR-005 | JSON columns for metadata | Schema flexibility without migrations |
| ADR-006 | ECS Fargate over EC2 | No server management, auto-scaling, cost efficiency |
| ADR-007 | Sanctum over Passport | Simpler, SPA-optimized, sufficient for scope |

---

*This blueprint is the single source of truth. All implementation must conform to this architecture. Deviations require CTO approval and an updated ADR.*
