// ============================================
// ARTICLES PAGE FUNCTIONALITY
// ============================================

// Global variables
let allArticles = [];
let filteredArticles = [];
let currentPage = 1;
const articlesPerPage = 8;
let activeCategory = 'all';
let selectedTags = [];

// Category color mapping
const categoryColors = {
  'Aqeedah': '#059669',
  'Hadith': '#2563eb',
  'Fiqh': '#7c3aed',
  'Seerah': '#c84b31',
  'Taskyiah': '#f59e0b',
  'Family & Society': '#d4a574',
  'Islamic History': '#6366f1',
  'Modern Issues': '#ec4899'
};

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  setupHamburgerMenu();
  loadAllArticles();
});

// Setup hamburger menu
function setupHamburgerMenu() {
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const navbarNav = document.getElementById("navbarNav");

  if (hamburgerMenu && navbarNav) {
    hamburgerMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburgerMenu.classList.toggle("active");
      navbarNav.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        hamburgerMenu.classList.remove("active");
        navbarNav.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar")) {
        hamburgerMenu.classList.remove("active");
        navbarNav.classList.remove("active");
      }
    });
  }
}

// Load all articles from Firestore
async function loadAllArticles() {
  if (!db) {
    setTimeout(loadAllArticles, 500);
    return;
  }

  try {
    const querySnapshot = await db.collection("articles")
      .orderBy("createdAt", "desc")
      .get();

    allArticles = [];
    querySnapshot.forEach((doc) => {
      allArticles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Initialize counts and tags
    updateCategoryCounts();
    displayPopularTags();
    filterAndPaginate();
  } catch (error) {
    console.error("Error loading articles:", error);
  }
}

// Update category counts
function updateCategoryCounts() {
  const categories = [
    'Aqeedah', 'Hadith', 'Fiqh', 'Seerah', 'Taskyiah',
    'Family & Society', 'Islamic History', 'Modern Issues'
  ];

  categories.forEach(category => {
    const count = allArticles.filter(a => a.category === category).length;
    const countElement = document.querySelector(
      `.category-item[onclick*="'${category}'"] .category-count`
    );
    if (countElement) {
      countElement.textContent = count;
    }
  });
}

// Display popular tags
function displayPopularTags() {
  const tagsMap = new Map();

  // Count all tags
  allArticles.forEach(article => {
    const tags = article.tags || [];
    tags.forEach(tag => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
    });
  });

  // Sort by count and get top 15
  const popularTags = Array.from(tagsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const tagsContainer = document.getElementById('populartags-container');
  tagsContainer.innerHTML = '';

  popularTags.forEach(([tag, count]) => {
    const tagElement = document.createElement('div');
    tagElement.className = 'tag-item';
    tagElement.onclick = () => toggleTagFilter(tag);
    tagElement.innerHTML = `
      <span class="tag-name">${tag}</span>
      <span class="tag-count">${count}</span>
    `;
    tagsContainer.appendChild(tagElement);
  });
}

// Toggle tag filter
function toggleTagFilter(tag) {
  const index = selectedTags.indexOf(tag);
  if (index > -1) {
    selectedTags.splice(index, 1);
  } else {
    selectedTags.push(tag);
  }

  // Update tag item active state
  document.querySelectorAll('.tag-item').forEach(item => {
    const tagName = item.querySelector('.tag-name').textContent;
    if (selectedTags.includes(tagName)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  currentPage = 1;
  filterAndPaginate();
}

// Filter by category
function filterByCategory(category) {
  activeCategory = category;
  selectedTags = []; // Reset tags when changing category
  currentPage = 1;

  // Update active state
  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.closest('.category-item').classList.add('active');

  // Reset tag active states
  document.querySelectorAll('.tag-item').forEach(item => {
    item.classList.remove('active');
  });

  filterAndPaginate();
}

// Filter and paginate
function filterAndPaginate() {
  const searchQuery = document.getElementById('articlesSearchInput').value.toLowerCase();
  const sortOption = document.getElementById('sortSelect').value;

  // Start with all articles
  filteredArticles = [...allArticles];

  // Apply category filter
  if (activeCategory !== 'all') {
    filteredArticles = filteredArticles.filter(a => a.category === activeCategory);
  }

  // Apply search filter
  if (searchQuery) {
    filteredArticles = filteredArticles.filter(a =>
      a.title.toLowerCase().includes(searchQuery) ||
      a.author.toLowerCase().includes(searchQuery) ||
      a.content.toLowerCase().includes(searchQuery)
    );
  }

  // Apply tag filters (AND logic - must have ALL selected tags)
  if (selectedTags.length > 0) {
    filteredArticles = filteredArticles.filter(a => {
      const articleTags = a.tags || [];
      return selectedTags.every(tag => articleTags.includes(tag));
    });
  }

  // Apply sorting
  if (sortOption === 'latest') {
    filteredArticles.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()));
  } else if (sortOption === 'oldest') {
    filteredArticles.sort((a, b) => new Date(a.createdAt.toDate()) - new Date(b.createdAt.toDate()));
  } else if (sortOption === 'a-z') {
    filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
  }

  currentPage = 1;
  displayArticles();
}

// Display articles for current page
function displayArticles() {
  const articlesGrid = document.getElementById('articlesGrid');
  const emptyState = document.getElementById('emptyState');
  const paginationContainer = document.getElementById('paginationContainer');

  if (filteredArticles.length === 0) {
    articlesGrid.innerHTML = '';
    emptyState.style.display = 'flex';
    paginationContainer.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const pageArticles = filteredArticles.slice(startIndex, endIndex);

  // Display articles
  articlesGrid.innerHTML = '';
  pageArticles.forEach(article => {
    const articleCard = createArticleCard(article);
    articlesGrid.appendChild(articleCard);
  });

  // Display pagination if more than one page
  if (totalPages > 1) {
    displayPagination(totalPages);
    paginationContainer.style.display = 'flex';
  } else {
    paginationContainer.style.display = 'none';
  }
}

// Create article card element
function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'articles-card';
  card.onclick = () => openArticleReader(article);

  const categoryColor = categoryColors[article.category] || '#d4a574';
  const tagsHTML = (article.tags || [])
    .slice(0, 2)
    .map(tag => `<span class="article-tag">${tag}</span>`)
    .join('');

  card.innerHTML = `
    <div class="article-card-image">
      <img src="${article.image}" alt="${article.title}">
      <span class="article-category-badge" style="background-color: ${categoryColor}">
        ${article.category || 'General'}
      </span>
    </div>
    <div class="article-card-content">
      <h3>${article.title}</h3>
      <p>${article.content.substring(0, 150)}...</p>
      <div class="article-card-meta">
        <div class="article-meta-left">
          <img src="https://ui-avatars.com/api/?name=${article.author}" alt="${article.author}" class="author-avatar">
          <div class="author-info">
            <div class="author-name">By ${article.author}</div>
            <div class="author-date">${article.date}</div>
          </div>
        </div>
      </div>
      ${tagsHTML ? `<div class="article-tags">${tagsHTML}</div>` : ''}
    </div>
  `;

  return card;
}

// Display pagination controls
function displayPagination(totalPages) {
  const paginationNumbers = document.getElementById('paginationNumbers');
  paginationNumbers.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.className = 'pagination-number';
    button.textContent = i;
    if (i === currentPage) {
      button.classList.add('active');
    }
    button.onclick = () => goToPage(i);
    paginationNumbers.appendChild(button);
  }
}

// Go to specific page
function goToPage(page) {
  currentPage = page;
  displayArticles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Next page
function nextPage() {
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

// Previous page
function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

// Open article reader modal
function openArticleReader(article) {
  const modal = document.getElementById("articleReaderModal");
  const content = document.getElementById("articleReaderContent");

  const tagsHTML = (article.tags || [])
    .map(tag => `<span class="reader-tag">${tag}</span>`)
    .join('');

  const categoryColor = categoryColors[article.category] || '#d4a574';

  content.innerHTML = `
    <img src="${article.image}" alt="${article.title}">
    <span class="reader-category-badge" style="background-color: ${categoryColor}">
      ${article.category || 'General'}
    </span>
    <h2>${article.title}</h2>
    <div class="reader-meta">
      <div class="reader-author-info">
        <img src="https://ui-avatars.com/api/?name=${article.author}" alt="${article.author}" class="reader-author-avatar">
        <div>
          <div class="reader-author">By ${article.author}</div>
          <div class="reader-date">${article.date}</div>
        </div>
      </div>
    </div>
    ${tagsHTML ? `<div class="reader-tags">${tagsHTML}</div>` : ''}
    <div class="reader-body">${article.content}</div>
  `;

  modal.classList.remove("hidden");
}

// Close article reader modal
function closeArticleReader() {
  document.getElementById("articleReaderModal").classList.add("hidden");
}

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  const readerModal = document.getElementById("articleReaderModal");
  if (e.target === readerModal) {
    closeArticleReader();
  }
});

// Expose functions to global scope
window.filterByCategory = filterByCategory;
window.toggleTagFilter = toggleTagFilter;
window.filterAndPaginate = filterAndPaginate;
window.goToPage = goToPage;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.openArticleReader = openArticleReader;
window.closeArticleReader = closeArticleReader;
