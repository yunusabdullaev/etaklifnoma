# Taklifnoma Service

Scalable backend API for an online invitation generator platform.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **ORM:** Sequelize 6
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit

## Features

- 🎯 **Event Types** — wedding, birthday, jubilee, graduation
- 🎨 **Templates** — linked to events with customizable field schemas (JSONB)
- 💌 **Invitations** — create with name, date, location, message + custom fields
- 🔗 **Unique Slugs** — auto-generated 10-char alphanumeric links (nanoid)
- 👁 **Public View** — `/invite/:slug` endpoint with view counting
- ✅ **Validation** — express-validator on all inputs
- 🛡 **Error Handling** — global middleware for Sequelize + custom errors

## Project Structure

```
src/
├── config/
│   ├── app.js           # App-wide constants
│   └── database.js      # Sequelize DB config
├── controllers/
│   ├── eventTypeController.js
│   ├── templateController.js
│   └── invitationController.js
├── database/
│   ├── migrations/      # Schema migrations
│   └── seeders/         # Sample data
├── middleware/
│   ├── errorHandler.js  # Global error handler
│   └── validate.js      # Validation bridge
├── models/
│   ├── index.js         # Auto-loader
│   ├── EventType.js
│   ├── Template.js
│   └── Invitation.js
├── routes/
│   ├── index.js         # Root router
│   ├── eventTypeRoutes.js
│   ├── templateRoutes.js
│   └── invitationRoutes.js
├── utils/
│   ├── ApiResponse.js   # Standardized responses
│   ├── AppError.js      # Custom error class
│   └── catchAsync.js    # Async error wrapper
├── validators/
│   └── index.js         # All validation rules
└── server.js            # Entry point
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 3. Start PostgreSQL
brew services start postgresql@16

# 4. Create database
createdb taklifnoma

# 5. Start server (auto-syncs tables)
npm run dev

# 6. Seed sample data
npm run db:seed
```

## API Endpoints

### Health Check
```
GET /health
```

### Event Types
```
GET    /api/event-types          # List all
GET    /api/event-types/:id      # Get by ID (includes templates)
POST   /api/event-types          # Create
PUT    /api/event-types/:id      # Update
DELETE /api/event-types/:id      # Delete
```

### Templates
```
GET    /api/templates             # List (paginated, filterable)
GET    /api/templates/:id         # Get by ID
POST   /api/templates             # Create
PUT    /api/templates/:id         # Update
DELETE /api/templates/:id         # Delete
```

**Query params:** `?eventTypeId=...&isPremium=true&page=1&limit=20`

### Invitations
```
GET    /api/invitations           # List (paginated, filterable)
GET    /api/invitations/:id       # Get by ID
POST   /api/invitations           # Create (returns public URL)
PUT    /api/invitations/:id       # Update
DELETE /api/invitations/:id       # Delete
```

### Public View
```
GET    /invite/:slug              # View invitation (increments view count)
```

## Example: Create Invitation

```bash
curl -X POST http://localhost:3000/api/invitations \
  -H "Content-Type: application/json" \
  -d '{
    "eventTypeId": "<uuid>",
    "templateId": "<uuid>",
    "hostName": "Abdullayev Yunus",
    "guestName": "Hurmatli mehmon",
    "eventDate": "2026-06-15",
    "eventTime": "18:00",
    "location": "Navruz to'\''yxonasi, Toshkent",
    "message": "Sizni taklif qilamiz!",
    "customFields": { "brideName": "Nilufar", "groomName": "Jamshid" }
  }'
```

**Response includes:**
```json
{
  "success": true,
  "data": {
    "slug": "u4x9w1thed",
    "publicUrl": "http://localhost:3000/invite/u4x9w1thed",
    ...
  }
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (nodemon) |
| `npm start` | Start production server |
| `npm run db:seed` | Seed sample data |
| `npm run db:seed:undo` | Remove seeded data |
| `npm run db:migrate` | Run migrations |
| `npm run db:reset` | Reset DB (undo + migrate + seed) |
