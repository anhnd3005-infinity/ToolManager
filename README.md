# ToolManager - Portfolio App Management System

A web-based tool to manage product portfolio, replacing Excel/Google Sheets for app management.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Ant Design
- **Backend**: Node.js + Express + Sequelize + SQLite

## Prerequisites

- Node.js 17+ 
- npm

## Installation

1. Clone the repository:
```bash
git clone git@github.com:anhnd3005-infinity/ToolManager.git
cd ToolManager
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Development

### Start Development Server

From the root directory:
```bash
npm start
```

This will:
- Start the backend server on `http://localhost:3000`
- Serve the frontend (built from `client/dist`)

### Development Mode (Separate)

To run client and server separately:

```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client (with hot reload)
cd client
npm run dev
```

## Building for Production

### Build Client

```bash
cd client
npm install  # Ensure dependencies are installed
npm run build
```

The built files will be in `client/dist/`

### Important Notes for CI/CD

Before running `npm run build`, ensure dependencies are installed:
```bash
cd client
npm install  # or npm ci for CI/CD
npm run build
```

## Project Structure

```
ToolManager/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── services/# API services
│   │   └── types/   # TypeScript types
│   └── dist/        # Built files (served by server)
├── server/          # Express backend
│   ├── src/
│   │   ├── models/  # Database models
│   │   ├── routes/  # API routes
│   │   └── config/  # Configuration
│   └── database.sqlite  # SQLite database
└── package.json     # Root package.json
```

## Features

- ✅ Portfolio App Management (CRUD)
- ✅ Advanced Filtering & Search
- ✅ Reference App Tracking
- ✅ Performance Metrics (Retention, Volume)
- ✅ Audit Logging
- ✅ Full-screen Responsive UI

## License

ISC

