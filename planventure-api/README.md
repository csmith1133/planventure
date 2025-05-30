# 🌎 Planventure API

> Create and manage your perfect travel itineraries with ease!

## Overview

Planventure API is your travel companion for creating and managing travel plans, featuring:
- 🔐 Secure user authentication
- 🗺️ Comprehensive trip management
- 📍 Location-based information
- 📅 Day-by-day activity planning
- ⚡ Real-time itinerary updates

## Technologies

- Python 3.10+
- Flask Framework
- SQLAlchemy ORM
- JWT Authentication
- SQLite/PostgreSQL
- CORS Support

## 🏗️ Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # 🪟 On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
# Create .env file with:
JWT_SECRET_KEY=your-generated-32-byte-hex-key
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///planventure.db
```

4. Initialize database:
```bash
python scripts/init_db.py
```

5. Launch server:
```bash
flask run
```

## 🔌 API Endpoints

### Authentication

#### POST /auth/register
Create your travel account:
```json
{
  "email": "wanderlust@example.com",
  "password": "SecurePass123"
}
```

#### POST /auth/login
Start your journey:
```json
{
  "email": "wanderlust@example.com",
  "password": "SecurePass123"
}
```

#### POST /auth/refresh
Keep your adventure going with a fresh token.

### Trips

#### POST /api/trips
Plan your next adventure:
```json
{
  "destination": "Paris, France",
  "start_date": "2024-01-01",
  "end_date": "2024-01-07",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

#### GET /api/trips
View all your planned adventures

#### GET /api/trips/{id}
Dive into trip details

#### PUT /api/trips/{id}
Update your travel plans

#### DELETE /api/trips/{id}
Cancel a planned trip

## 🔒 Authentication

Include your travel pass (token) in requests:
```
Authorization: Bearer <access_token>
```

## 🛠️ Development

- 🧪 Run tests: `pytest`
- ✨ Format code: `black .`
- 🔍 Lint code: `flake8`

## Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch
3. 💾 Commit your changes
4. 🚀 Push to the branch
5. 🎯 Open a Pull Request