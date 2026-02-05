# 🏏 Auction Application

A premium, full-stack real-time auction platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. Designed for managing player auctions with high-end aesthetics and live bidding capabilities.

## 🚀 Key Features

- **Real-Time Bidding**: Powered by Socket.io for instant bid updates and timers.
- **Admin Control Center**:
  - Separate `admins` collection for elevated security.
  - Approve/Reject players and teams.
  - Bulk upload players via Excel (`.xlsx`).
  - Live auction manager (Sold/Unsold controls).
- **Captain Dashboard**:
  - Register teams and manage budgets.
  - Bid on players in real-time.
- **Premium UI**: Sleek dark-mode aesthetic with "Glassmorphism" and gold accents.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite, Axios, Socket.io-client.
- **Backend**: Node.js, Express.js, Socket.io, JWT Authentication.
- **Database**: MongoDB (Mongoose).
- **Other**: Multer (File Uploads), Nodemailer (Email Approvals), XLSX (Excel Parsing).

## 📁 Project Structure

```text
auction/
├── backend/            # Express server & Socket handlers
│   ├── models/         # Mongoose schemas (User, Admin, Player, Team)
│   ├── routes/         # API Endpoints
│   └── socket/         # Real-time auction logic
└── frontend/           # React application
    ├── src/pages/      # Dashboard and Arena views
    └── src/config.js   # API configuration
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account.

### 2. Backend Setup
1. Navigate to directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file (see `.env.example`):
   ```text
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ```
4. Start server: `npm run dev`

### 3. Frontend Setup
1. Navigate to directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```text
   VITE_API_URL=http://localhost:5000
   ```
4. Start development server: `npm run dev`

## 🛡️ Security Note
All sensitive environment variables are hidden using `.gitignore`. Use the provided `.env.example` files as templates for deployment.

## 📄 License
MIT
