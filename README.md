# 📖 Premium Hadith Library

A modern, responsive web application displaying hadiths from the hadithapi.com API with a beautiful premium UI.

## ✨ Features

- **🎨 Premium Design**: Clean, modern interface with elegant typography and spacing
- **🌙 Dark/Light Theme**: Toggle between dark and light modes with persistent preference storage
- **🔍 Advanced Search**: Real-time search across hadith text, narrator, and book names
- **📚 Book Filtering**: Filter hadiths by specific Islamic books
- **📄 Pagination**: Navigate through results with customizable items per page (10, 20, 50)
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **⚡ Fast Performance**: Optimized API calls and efficient DOM rendering
- **♿ Accessible**: Semantic HTML and keyboard-friendly controls

## 🚀 Getting Started

### Requirements
- Modern web browser (no build tools needed!)
- Internet connection (for API calls and Google Fonts)

### Installation

1. Clone or download this repository
2. No installation needed! Just open `index.html` in your browser

```bash
cd Hadith-online
# Open index.html directly - it works in any modern browser
```

## 📁 Project Structure

```
Hadith-online/
├── index.html       # Main HTML structure
├── styles.css       # All styling and theme variables
├── app.js           # Application logic and API integration
└── README.md        # This file
```

## 🎯 How to Use

1. **Search**: Type in the search box to find hadiths by text, narrator, or book name
2. **Filter by Book**: Use the dropdown in the sidebar to filter hadiths by book
3. **Toggle Theme**: Click the moon/sun icon in the header to switch themes
4. **Navigate**: Use Previous/Next buttons to navigate through pages
5. **Adjust Results**: Change items per page using the dropdown in the footer

## 🛠️ Technical Details

### Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: CSS Custom Properties for dynamic theming
- **API**: hadithapi.com
- **Fonts**: Google Fonts (Poppins, Playfair Display)

### Key Files

#### `index.html`
- Semantic HTML structure
- Header with search and theme toggle
- Sidebar with filters
- Main content area for hadith cards
- Pagination controls

#### `styles.css`
- CSS Variables for theme management
- Responsive grid layouts
- Premium animations and transitions
- Mobile-first responsive design
- Dark/Light theme support

#### `app.js`
- API data fetching and caching
- Search and filter logic
- Pagination system
- Theme management with LocalStorage
- Error handling and loading states

## 🎨 Customization

### Change Theme Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #8B5CF6;      /* Change accent color */
    --primary-light: #A78BFA;
    --primary-dark: #6D28D9;
}
```

### Adjust Pagination
In `app.js`, modify the default:
```javascript
state.itemsPerPage = 10;  // Change default items per page
```

### Update Fonts
Change the Google Fonts import in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONTS" rel="stylesheet">
```

## 🐛 Troubleshooting

### Hadiths not loading?
- Check browser console (F12) for errors
- Ensure you have internet connection
- Try refreshing the page
- Verify the API key is valid

### Theme not persisting?
- Ensure LocalStorage is enabled in browser
- Clear browser cache and try again

### Search not working?
- Make sure hadiths are fully loaded
- Try clearing filters and searching again

## 📊 Performance Tips

- Hadiths are loaded once and cached in memory
- Search uses debouncing to avoid excessive filtering
- Pagination limits DOM rendering to current page only
- CSS animations use GPU acceleration

## 🌐 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 API Information

**Base URL**: https://hadithapi.com/api/hadiths

**API Key**: Included in the source code

**Response Format**:
```json
{
    "hadiths": [
        {
            "text": "Hadith text...",
            "book": "Sahih Bukhari",
            "narrator": "Abu Huraira",
            "hadithNumber": "1"
        }
    ]
}
```

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📄 License

Free to use and modify for personal and commercial projects.

## 🙏 Credits

- Hadith data: [hadithapi.com](https://hadithapi.com)
- Icons: Unicode/Emoji
- Fonts: Google Fonts

---

Made with ❤️ for Islamic knowledge sharing