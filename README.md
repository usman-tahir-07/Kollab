# Kollab 🚀

<div align="center">

### Connect • Collaborate • Grow

A modern peer-to-peer student networking and collaboration platform built for university ecosystems.

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

# 📌 Overview

Kollab is a data-driven mobile application that enables students to:

- Create professional skill-based profiles
- Discover talented peers
- Recruit collaborators for projects
- Build campus networking communities
- Connect through realtime collaboration feeds

The platform combines the professional feel of **LinkedIn** with the collaborative nature of a **freelance recruitment board**.

Designed with a modern **Glassmorphism UI**, Kollab delivers a polished and premium mobile experience.


---

# ✨ Features

## 🔐 Authentication System

- Secure Login & Signup using Supabase Auth
- Persistent authentication sessions
- JWT-based authentication handling
- Automatic profile creation after registration

---

## 🔍 Discovery Hub

- Search students by name or skill
- Filter users by technical categories
- Availability badges for collaboration status
- Beautiful glassmorphism profile cards
- Realtime profile fetching

---

## 👤 Skill Detail Profiles

- Full profile view with bio and skills
- Profile images and availability indicators
- Ratings and collaboration visibility

### 📞 Contact Integrations

- Phone Calling
- Email Launching
- WhatsApp Deep Linking

### ⚡ Engineering Highlight

Phone numbers are automatically sanitized and transformed into international format (`+92`) using regex-based preprocessing for reliable WhatsApp integration.

---

## 🤝 Collaboration Feed

A realtime project recruitment board where students can:

- Post collaboration requirements
- Recruit teammates with specific skills
- View dynamic realtime feeds
- Delete their own posts

### Example Post

```txt
Need a Backend Developer for Final Year Project.

Tech Stack:
Node.js + PostgreSQL

Looking for frontend/mobile collaborators.
```

### ⚡ Powered By

Supabase Realtime Channels for instant synchronization without manual refresh.

---

## 📊 Analytics Dashboard

Interactive visualizations powered by `react-native-chart-kit`.

### Includes

- Most popular skill categories
- Most requested skills
- Community analytics
- User distribution charts

---

## 🛠️ Profile Management

Complete CRUD functionality including:

- Edit profile
- Update bio
- Change availability
- Upload profile picture
- Delete account

### ⚡ Engineering Highlight

Images are converted into Base64 buffers before upload, enabling seamless storage handling and bypassing Android filesystem limitations.

---

# 🎨 UI/UX Design

Kollab follows a **Light Modern Glassmorphism** design language featuring:

- Frosted glass cards
- Soft shadows
- Rounded modern components
- Smooth animations
- Blue/Purple accent themes
- Minimal clean layouts

The goal was to create a visually premium experience while maintaining simplicity and usability.

---

# 🏗️ System Architecture

## 📱 App Flow

```text
Splash Screen
      ↓
Authentication
      ↓
Bottom Tab Navigation
   ├── Discovery Hub
   ├── Collaboration Feed
   ├── Analytics Dashboard
   └── Profile Management
```

### Additional Screens

- Skill Detail View
- Edit Profile
- Post Creation

---

# ⚡ Tech Stack

## Frontend

- React Native (Expo SDK 54)
- React Navigation v7
- NativeWind v2
- Tailwind CSS v3
- React Native Paper
- React Native Chart Kit

---

## Backend & Cloud

- Supabase Authentication
- PostgreSQL Database
- Supabase Storage
- Supabase Realtime WebSockets

---

## UI & Styling

- Glassmorphism Design System
- Expo Vector Icons (Ionicons)

---

# 🗄️ Database Schema

## `profiles`

| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | References `auth.users.id` |
| `full_name` | `text` | Student full name |
| `email` | `text` | User email |
| `profile_image` | `text` | Public image URL |
| `bio` | `text` | User biography |
| `phone` | `text` | Contact number |
| `skill_category` | `text` | Main skill domain |
| `skills` | `text[]` | Technical skills |
| `availability` | `text` | Collaboration status |
| `rating` | `float` | User rating |

---

## `collaboration_posts`

| Field | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `profiles.id` |
| `title` | `text` | Project title |
| `description` | `text` | Project details |
| `required_skill` | `text` | Required skill |
| `created_at` | `timestamp` | Post creation timestamp |

---

# 📦 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/KollabApp.git
cd KollabApp
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 4️⃣ Start Development Server

```bash
npx expo start
```

---

# 🔥 Realtime Features

Kollab leverages Supabase Realtime to provide:

- Instant collaboration feed updates
- Live profile synchronization
- Dynamic UI refreshes
- Realtime networking experience

---

# 🚀 Future Improvements

- AI-powered teammate recommendations
- Skill endorsement system
- In-app messaging
- Project bookmarking
- Push notifications
- Team management system
- University verification system

---

# 🤝 Contributing

Contributions are welcome!

Feel free to fork the repository, open issues, and submit pull requests.

---

# 💡 Project Vision

Kollab aims to bridge the gap between talented students and collaborative opportunities by creating a digital ecosystem where students can:

- Network
- Recruit
- Learn
- Collaborate
- Build together

---

# 👨‍💻 Developed By

## Usman Tahir

BS Computer Science 3rd year Student 

---
