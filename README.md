# Dynamic Graphical Password Authentication System

A secure, modern, dynamic graphical password authentication web application. Instead of traditional text passwords, users authenticate by selecting a sequence of 5 secret images in order through multi-stage randomized challenge grids with card-shuffle transitions.

![Technology Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20%7C%20React%20%7C%20Tailwind%20CSS-indigo)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌟 Key Features

1. **User Registration**:
   - Register account with unique username availability checking.
   - Interactive 36-image library picker across 6 categories (*Nature, Animals, Tech, Food, Objects, Architecture*).
   - Assigns visual ordered sequence badges (`1`, `2`, `3`, `4`, `5`).

2. **Dynamic Multi-Stage Login**:
   - Support for 3×3 (9 tiles) or 4×4 (16 tiles) challenge grids.
   - **Shuffled Challenge Engine**: Each round displays 1 target image from the user's secret sequence and $(N-1)$ randomly selected decoy images.
   - **Card Shuffle Animations**: Smooth layout animations powered by Framer Motion.
   - **Immediate Authentication Feedback**:
     - *Correct Tap*: Reshuffles decoys, advances step indicator, and displays next challenge.
     - *Incorrect Tap*: Triggers red shake animation and invalidates authentication session immediately.
     - *Final Step Complete*: Triggers victory confetti and security token.

3. **Admin Portal**:
   - Inspect registered users and sequence preview thumbnails.
   - Manage image repository (add custom image URLs/categories or delete items).

---

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti, Vite
- **Backend**: Java 17/23, Spring Boot 3.4.2 (Spring Web, Spring Data JPA)
- **Database**: Dual setup supporting MySQL & embedded H2 Database

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+
- **Java JDK**: 17 or higher

### 1. Run Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
*Backend API runs on: `http://localhost:8080`*

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev -- --port 5173
```
*Frontend Web App runs on: `http://localhost:5173`*

---

## 📸 Screenshots & Architecture

```
+-------------------------------------------------------------------+
|                  Dynamic Graphical Auth System                    |
|  [Login Challenge]          [Register]            [Admin Portal]  |
+-------------------------------------------------------------------+
|  User: alice                 Step 2 of 5          Grid: 3 x 3     |
|                                                                   |
|  +------------------+  +------------------+  +-----------------+  |
|  |   [Image Tile]   |  |   [Image Tile]   |  |  [Image Tile]   |  |
|  +------------------+  +------------------+  +-----------------+  |
|  +------------------+  +------------------+  +-----------------+  |
|  |   [Target Image] |  |   [Image Tile]   |  |  [Image Tile]   |  |
|  +------------------+  +------------------+  +-----------------+  |
+-------------------------------------------------------------------+
```

---

## 📄 License
MIT License
