// ===== State Management =====
const state = {
    allHadiths: [],
    filteredHadiths: [],
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: '',
    selectedBook: '',
    books: [],
};

const API_BASE_URL = '/api/hadiths';
const COLLECTIONS = ['bukhari', 'muslim', 'abudawud', 'ibnmajah', 'tirmidhi'];

// ===== DOM Elements =====
const searchInput = document.getElementById('searchInput');
const bookFilter = document.getElementById('bookFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const hadithsContainer = document.getElementById('hadithsContainer');
const resultsCountEl = document.getElementById('resultsCount');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const themeToggle = document.getElementById('themeToggle');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');

// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark-mode' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    applyTheme(newTheme);
});

// ===== API Integration =====
async function fetchHadiths() {
    try {
        showLoadingState();

        // Fetch hadiths from all collections via backend
        const allHadiths = [];

        for (const collection of COLLECTIONS) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/${collection}?page=1&limit=100`
                );

                if (!response.ok) {
                    console.warn(`Error fetching from ${collection}: ${response.status}`);
                    continue;
                }

                const data = await response.json();

                if (data.results && Array.isArray(data.results)) {
                    allHadiths.push(...data.results);
                }
            } catch (error) {
                console.warn(`Error fetching from ${collection}:`, error);
            }
        }

        if (allHadiths.length === 0) {
            throw new Error('No hadiths found. Please check your internet connection.');
        }

        state.allHadiths = allHadiths;
        state.filteredHadiths = [...state.allHadiths];

        // Extract unique books
        const uniqueBooks = [...new Set(allHadiths.map(h => h.book || 'Unknown'))].sort();
        state.books = uniqueBooks;

        // Populate book filter
        bookFilter.innerHTML = '<option value="">All Books</option>';
        state.books.forEach(book => {
            const option = document.createElement('option');
            option.value = book;
            option.textContent = book;
            bookFilter.appendChild(option);
        });

        console.log(`✅ Loaded ${allHadiths.length} hadiths from backend`);
        hideLoadingState();
        updateDisplay();
    } catch (error) {
        console.error('Error fetching hadiths:', error);
        showErrorState(error.message);
    }
}

// ===== Search and Filter Logic =====
function filterAndSearch() {
    state.currentPage = 1;

    // Apply filters
    state.filteredHadiths = state.allHadiths.filter(hadith => {
        const searchMatch =
            state.searchTerm === '' ||
            (hadith.hadith_english && hadith.hadith_english.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
            (hadith.text && hadith.text.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
            (hadith.header && hadith.header.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
            (hadith.book && hadith.book.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
            (hadith.bookName && hadith.bookName.toLowerCase().includes(state.searchTerm.toLowerCase()));

        const bookMatch = state.selectedBook === '' || hadith.book === state.selectedBook;

        return searchMatch && bookMatch;
    });

    updateDisplay();
}

// Debounced search input
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    state.searchTerm = e.target.value.trim();
    searchTimeout = setTimeout(() => {
        filterAndSearch();
    }, 300);
});

bookFilter.addEventListener('change', (e) => {
    state.selectedBook = e.target.value;
    filterAndSearch();
});

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    bookFilter.value = '';
    state.searchTerm = '';
    state.selectedBook = '';
    filterAndSearch();
});

// ===== Pagination Logic =====
function getPaginatedHadiths() {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.filteredHadiths.slice(startIndex, endIndex);
}

function getTotalPages() {
    return Math.ceil(state.filteredHadiths.length / state.itemsPerPage);
}

prevBtn.addEventListener('click', () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        updateDisplay();
        scrollToTop();
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = getTotalPages();
    if (state.currentPage < totalPages) {
        state.currentPage++;
        updateDisplay();
        scrollToTop();
    }
});

itemsPerPageSelect.addEventListener('change', (e) => {
    state.itemsPerPage = parseInt(e.target.value);
    state.currentPage = 1;
    updateDisplay();
});

// ===== Rendering =====
function renderHadiths() {
    const paginatedHadiths = getPaginatedHadiths();

    if (paginatedHadiths.length === 0) {
        hadithsContainer.innerHTML = `
            <div class="no-results">
                <p>No hadiths found matching your search.</p>
            </div>
        `;
        return;
    }

    hadithsContainer.innerHTML = paginatedHadiths.map(hadith => `
        <div class="hadith-card">
            <div class="hadith-header">
                <div class="hadith-meta">
                    ${hadith.book ? `<span class="meta-item"><span class="meta-label">📚 Collection:</span> ${escape(hadith.book)}</span>` : ''}
                    ${hadith.refno ? `<span class="meta-item"><span class="meta-label">🔢 Reference:</span> ${escape(hadith.refno)}</span>` : ''}
                </div>
            </div>
            <div class="hadith-text">
                "${escape(hadith.hadith_english || hadith.text || 'No text available')}"
            </div>
            ${hadith.header ? `<div class="hadith-chain"><strong>Narrator:</strong> ${escape(hadith.header)}</div>` : ''}
            ${hadith.bookName ? `<div class="hadith-chain"><strong>Book:</strong> ${escape(hadith.bookName)}</div>` : ''}
            ${hadith.chapterName ? `<div class="hadith-chain"><strong>Chapter:</strong> ${escape(hadith.chapterName)}</div>` : ''}
        </div>
    `).join('');
}

function updateDisplay() {
    renderHadiths();
    updatePagination();
    updateResultsCount();
}

function updatePagination() {
    const totalPages = getTotalPages();
    currentPageEl.textContent = state.currentPage;
    totalPagesEl.textContent = totalPages;

    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;
}

function updateResultsCount() {
    resultsCountEl.textContent = `${state.filteredHadiths.length} ${state.filteredHadiths.length === 1 ? 'hadith' : 'hadiths'}`;
}

// ===== UI State Management =====
function showLoadingState() {
    loadingState.style.display = 'flex';
    errorState.style.display = 'none';
    hadithsContainer.style.display = 'none';
}

function hideLoadingState() {
    loadingState.style.display = 'none';
}

function showErrorState(message) {
    errorMessage.textContent = message;
    errorState.style.display = 'block';
    hadithsContainer.style.display = 'none';
    loadingState.style.display = 'none';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Initialization =====
function initializeApp() {
    initTheme();
    fetchHadiths();
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
