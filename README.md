
# Text-to-Speech (TTS) Conversion Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.17.1-green)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.8-9cf)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack web application for converting text to speech with user authentication, daily conversion quotas, and audio file management.

![App Screenshot](![app](https://github.com/user-attachments/assets/35891a6c-6654-4637-a9b8-3fd81d85cef7)

## Table of Contents

* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Configuration](#configuration)
* [Deployment](#-deployment)
* [Database Schema](#-database-schema)
* [API Documentation](#-api-documentation)
* [Security](#-security-best-practices)
* [Contributing](#-contributing)
* [License](#-license)
* [Contact](#-contact)

## ✨ Features

* **Secure JWT Authentication** with Supabase Auth
* **Daily Conversion Quota** (30 conversions/user/day)
* **Multi-language Support** (15+ languages/voices)
* **Audio File Management** with Supabase Storage
* **Automatic File Cleanup** (30-day retention)
* **Responsive UI** with Dark/Light mode
* **Audio Player Controls** (Speed, Download, Progress)

## 🛠 Tech Stack

| Category           | Technologies                     |
| ------------------ | -------------------------------- |
| **Frontend** | React 18, Tailwind CSS, Axios    |
| **Backend**  | Node.js, Express.js, Supabase JS |
| **APIs**     | VoiceRSS TTS API                 |
| **Database** | Supabase PostgreSQL              |
| **Storage**  | Supabase Storage                 |
| **Infra**    | Render, GitHub                   |

## 🚀 Getting Started

### Prerequisites

* Node.js ≥18.x
* npm ≥9.x
* Supabase account
* VoiceRSS API key

### Installation

```bash
# Clone repository
git clone https://github.com/rohith1921/tts-platform.git
cd tts-platform

# Backend setup
cd backend && npm install
cp .env.example .env  # Update with your credentials

# Frontend setup
cd ../frontend && npm install
cp .env.example .env  # Update with your credentials
```

## Configuration

### Backend (.env):

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_service_role_key
VOICERSS_API_KEY=your_voicerss_key
PORT=5000
```

### Frontend (.env):

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:5000
```

## 🌐 Deployment

### Render Setup

| Service  | Settings                         |
| -------- | -------------------------------- |
| Backend  | Node.js, npm start, PORT=5000    |
| Frontend | Static Site, npm run build, dist |

### Supabase Configuration

* Enable Email Authentication
* Add Render URLs to:
  * **Site URL** (Authentication → Settings)
  * **Redirect URLs**
  * **CORS Origins** (Storage → Settings)

## 📦 Database Schema

```sql
CREATE TABLE user_quotas (
  user_id UUID REFERENCES auth.users NOT NULL,
  conversions_today INT DEFAULT 0,
  last_reset_date TIMESTAMPTZ
);

CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  text TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📚 API Documentation

| Endpoint             | Method | Description                 |
| -------------------- | ------ | --------------------------- |
| /api/text-to-speech  | POST   | Convert text to audio       |
| /api/audio-files     | GET    | List user's audio files     |
| /api/audio-files/:id | DELETE | Delete audio file           |
| /api/user-quota      | GET    | Get conversion quota status |

## 🔒 Security Best Practices

* Enable RLS on Supabase tables
* Rotate Supabase keys quarterly
* Use HTTPS in production
* Implement rate limiting
* Regular dependency updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit changes & push
4. Open Pull Request

## 📄 License

MIT License - See LICENSE for details.

## 📧 Contact

**Rohith Kumar Paswan**  
- Email: [rohithkumarpaswan1921@gmail.com](mailto:rohithkumarpaswan1921@gmail.com)  
- GitHub: [https://github.com/rohith1921/tts-platform](https://github.com/rohith1921/tts-platform)

```

```
