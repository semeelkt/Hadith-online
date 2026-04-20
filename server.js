const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

const HADITH_API_BASE = 'https://hadithapi.pages.dev/api';
const COLLECTIONS = ['bukhari', 'muslim', 'abudawud', 'ibnmajah', 'tirmidhi'];

// ===== API Routes =====

// Get hadiths from a specific collection with pagination
app.get('/api/hadiths/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate collection
        if (!COLLECTIONS.includes(collection)) {
            return res.status(400).json({
                error: `Invalid collection. Valid collections: ${COLLECTIONS.join(', ')}`
            });
        }

        // Validate pagination params
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

        const url = `${HADITH_API_BASE}/${collection}?page=${pageNum}&limit=${limitNum}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching hadiths:', error);
        res.status(500).json({ error: 'Failed to fetch hadiths' });
    }
});

// Get a specific hadith by ID
app.get('/api/hadiths/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;

        // Validate collection
        if (!COLLECTIONS.includes(collection)) {
            return res.status(400).json({
                error: `Invalid collection. Valid collections: ${COLLECTIONS.join(', ')}`
            });
        }

        const url = `${HADITH_API_BASE}/${collection}/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching hadith:', error);
        res.status(500).json({ error: 'Failed to fetch hadith' });
    }
});

// Search hadiths
app.get('/api/search', async (req, res) => {
    try {
        const { q, collection, page = 1, limit = 10, narrator, bookName, chapterName, exclude, exact } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query (q) is required' });
        }

        // Build query string
        const params = new URLSearchParams({
            q,
            page: Math.max(1, parseInt(page) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit) || 10))
        });

        if (collection) params.append('collection', collection);
        if (narrator) params.append('narrator', narrator);
        if (bookName) params.append('bookName', bookName);
        if (chapterName) params.append('chapterName', chapterName);
        if (exclude) params.append('exclude', exclude);
        if (exact === 'true') params.append('exact', 'true');

        const url = `${HADITH_API_BASE}/search?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error searching hadiths:', error);
        res.status(500).json({ error: 'Failed to search hadiths' });
    }
});

// Get all collections info
app.get('/api/collections', async (req, res) => {
    res.json({
        collections: COLLECTIONS,
        baseUrl: HADITH_API_BASE
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Hadith API server is running' });
});

// Serve index.html for root (SPA)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Hadith Library server running on http://localhost:${PORT}`);
    console.log(`📚 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
});
