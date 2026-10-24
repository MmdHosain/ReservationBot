# Telegram Salon Management Bot

## Overview
This project is a Telegram bot built with Node.js, TypeScript, and the Telegraf library. It is designed to help salon owners and service providers easily manage their services, automate appointment booking, and monitor daily schedules directly from Telegram.

## Features

### 1. Interactive Onboarding
When a new user interacts with the bot for the first time, they are smoothly guided through setting up their salon:
- **Service Name**: Define the name of the service (e.g., Haircut, Hair Coloring).
- **Duration**: Select the estimated duration of the service (30, 45, 60, or 90 minutes).
- **Working Days**: Pick the days of the week they are available to perform the service.

### 2. Management Dashboard
Once onboarded, the `/start` command opens the Management Panel. The dashboard includes:
- **Today's Appointments**: A summary of scheduled bookings for the day.
- **Revenue Estimation**: Automatically calculates daily estimated revenue based on appointments.
- **Service Management**: View current active services.

### 3. User & Data Management
- **Automatic Registration**: Users are saved to the database immediately upon starting the bot.
- **Account Deletion**: Users can easily delete their account and wipe all associated data (services, appointments) by sending the `/delete` command.

### 4. Database Integration
- The bot securely connects to a **PostgreSQL** database.
- Automatic table initialization on startup (`users` and `services` tables).

---

## Prerequisites
To run this project, you will need:
- **Docker** and **Docker Compose** (Recommended)
- *OR* **Node.js** (v16+) and **PostgreSQL** for manual local execution.

## Run with Docker (Recommended)

The easiest way to run the bot and the database is using Docker. It isolates the environment and guarantees consistency.

1. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your specific details:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   ADMIN_PASSWORD=admin123
   PROVIDER_TOKEN=WALLET-XXXXX
   
   # Database settings (will be used to configure the postgres container)
   DB_USER=postgres
   DB_PASS=your_db_password
   DB_NAME=my_telegram_bot
   ```

2. **Start the application**:
   Run the following command at the root of the project:
   ```bash
   docker-compose up -d --build
   ```
   *This will pull the PostgreSQL image, build the Node.js app, start both containers, and automatically link them. The bot will automatically ensure tables exist on startup.*

3. **View Logs**:
   ```bash
   docker-compose logs -f app
   ```

## Manual Local Installation & Setup

1. **Install dependencies**:
   Since we refactored the project to use a modern and reliable execution engine (`tsx`), you must install the updated dependencies first:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Make sure your `.env` contains local database credentials.
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. **Prepare the Database**:
   Make sure that the PostgreSQL server is running and that a database matching `DB_NAME` exists.

4. **Run the bot**:
   ```bash
   npm run start
   ```
   For hot-reloading during development, use:
   ```bash
   npm run dev
   ```

## Deployment (Git Hooks)

You can automatically deploy and run your bot using a git `post-receive` hook. This method exists as `hooks/post-receive` in this repository. 
When pushing to your live server's bare Git repository, this script will checkout the code, install dependencies, and automatically start (or restart) the bot via `pm2`.

To set it up on your server:
1. Initialize a bare repository on your server: `git init --bare /root/DEV/reservation-bot.git`
2. Copy the `hooks/post-receive` file to `/root/DEV/reservation-bot.git/hooks/post-receive`
3. Make it executable: `chmod +x /root/DEV/reservation-bot.git/hooks/post-receive`
4. Add the server as a remote on your local machine and push to it.
