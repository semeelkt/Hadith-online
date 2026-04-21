# Hadith Online - Admin System Setup

## Features Added

✨ **Admin Circle Button** - Click the gear icon (⚙️) in the navbar to access admin panel

🔐 **Admin Login** - Login with password: `mradminlogged`

📝 **Publish Articles** - Create and publish articles with images

🗄️ **Database** - SQLite database for persistent storage

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
npm start
```

Server will run on `http://localhost:3000`

### 3. Using the Admin Panel

1. **Click the ⚙️ icon** in the top-right corner of the navbar
2. **Enter password**: `mradminlogged`
3. **Choose an action**:
   - **Publish Article**: Fill in title, content, author, and upload an image
   - **View Articles**: See all published articles with options to delete

## Frontend Storage

The app also uses browser localStorage as a fallback, so articles persist even without a backend server.

## API Endpoints (Backend)

- `POST /api/articles` - Create new article
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get specific article
- `DELETE /api/articles/:id` - Delete article

## File Structure

```
├── index.html          # Main HTML with admin modal & panel
├── script.js           # JavaScript with admin & hadith functionality
├── style.css           # Styling including admin panel
├── server.js           # Express backend server
├── package.json        # Dependencies
└── hadith.db          # SQLite database (auto-created)
```

## Features

✓ Admin login with password protection
✓ Publish articles with images
✓ View all published articles
✓ Delete articles
✓ Image storage with base64 encoding
✓ Date tracking for each article
✓ Responsive design
