// Import Firebase SDK from CDN
const firebaseConfig = {
  apiKey: "AIzaSyAbdohB61du6uE627zE7suf7kRk9eIw60U",
  authDomain: "zonera-e4b13.firebaseapp.com",
  projectId: "zonera-e4b13",
  storageBucket: "zonera-e4b13.firebasestorage.app",
  messagingSenderId: "176063306389",
  appId: "1:176063306389:web:b4dfadc3f89b502eed999c"
};

let db = null;

// Initialize Firebase when SDK loads (with retry)
function initializeFirebase() {
  if (typeof firebase !== 'undefined' && !db) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
    } catch (error) {
      console.warn("Firebase initialization error:", error);
      // Retry after 1 second
      setTimeout(initializeFirebase, 1000);
    }
  } else if (!db) {
    setTimeout(initializeFirebase, 500);
  }
}

// Start initialization
initializeFirebase();

// ============================================
// ADMIN FUNCTIONALITY
// ============================================

let adminLoggedIn = false;
const ADMIN_PASSWORD = "mradminlogged";

// Open admin login modal
document.getElementById("adminCircle")?.addEventListener("click", () => {
  if (!adminLoggedIn) {
    document.getElementById("adminLoginModal").classList.remove("hidden");
  } else {
    document.getElementById("adminPanel").classList.remove("hidden");
  }
});

// Close admin login modal
function closeAdminModal() {
  document.getElementById("adminLoginModal").classList.add("hidden");
  document.getElementById("adminError").textContent = "";
}

// Admin login
async function loginAdmin() {
  const password = document.getElementById("adminPassword").value;
  const errorElement = document.getElementById("adminError");

  if (password === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    document.getElementById("adminLoginModal").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    document.getElementById("adminPassword").value = "";
    loadArticles();
  } else {
    errorElement.textContent = "❌ Invalid password";
    document.getElementById("adminPassword").value = "";
  }
}

// Logout admin
function logoutAdmin() {
  adminLoggedIn = false;
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("adminLoginModal").classList.add("hidden");
}

// Switch admin tabs
function switchTab(tabName) {
  document.querySelectorAll(".admin-tab-content").forEach(tab => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(tabName + "Tab").classList.add("active");
  event.target.classList.add("active");

  if (tabName === "view") {
    loadArticles();
  }
}

// Publish article
async function publishArticle(event) {
  event.preventDefault();

  const title = document.getElementById("articleTitle").value;
  const content = document.getElementById("articleContent").value;
  const author = document.getElementById("articleAuthor").value;
  const imageFile = document.getElementById("articleImage").files[0];
  const messageElement = document.getElementById("publishMessage");

  if (!title || !content || !author || !imageFile) {
    messageElement.textContent = "❌ Please fill all fields";
    messageElement.className = "message error";
    return;
  }

  // Convert image to base64
  const reader = new FileReader();
  reader.onload = async (e) => {
    const imageData = e.target.result;

    const article = {
      title,
      content,
      author,
      image: imageData,
      date: new Date().toLocaleDateString(),
      createdAt: new Date()
    };

    try {
      // Save to Firestore
      await db.collection("articles").add(article);
      messageElement.textContent = "✓ Article published successfully!";
      messageElement.className = "message success";

      // Reset form
      document.getElementById("articleTitle").value = "";
      document.getElementById("articleContent").value = "";
      document.getElementById("articleAuthor").value = "";
      document.getElementById("articleImage").value = "";

      // Refresh home articles
      displayHomeArticles();

      setTimeout(() => {
        messageElement.textContent = "";
      }, 3000);
    } catch (error) {
      messageElement.textContent = "❌ Error publishing article";
      messageElement.className = "message error";
      console.error("Error publishing article:", error);
    }
  };

  reader.readAsDataURL(imageFile);
}

// Load articles
async function loadArticles() {
  try {
    const querySnapshot = await db.collection("articles")
      .orderBy("createdAt", "desc")
      .get();
    const articles = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const articlesList = document.getElementById("articlesList");
    articlesList.innerHTML = "";

    if (articles.length === 0) {
      articlesList.innerHTML = "<p style='color: rgba(212, 165, 116, 0.6); text-align: center;'>No articles published yet.</p>";
      return;
    }

    articles.forEach((article) => {
      const articleCard = document.createElement("div");
      articleCard.className = "article-card";
      articleCard.innerHTML = `
        <img src="${article.image}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
        <h3>${article.title}</h3>
        <p>${article.content.substring(0, 100)}...</p>
        <div class="article-meta">
          <div>
            <div style="color: var(--accent-gold);">By ${article.author}</div>
            <div>${article.date}</div>
          </div>
          <button class="delete-btn" onclick="deleteArticle('${article.id}')">Delete</button>
        </div>
      `;
      articlesList.appendChild(articleCard);
    });
  } catch (error) {
    console.error("Error loading articles:", error);
    const articlesList = document.getElementById("articlesList");
    articlesList.innerHTML = "<p style='color: red; text-align: center;'>Error loading articles</p>";
  }
}

// Delete article
async function deleteArticle(docId) {
  if (confirm("Are you sure you want to delete this article?")) {
    try {
      await db.collection("articles").doc(docId).delete();
      loadArticles();
      displayHomeArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error deleting article");
    }
  }
}

// Display articles on home page (latest 3 only)
async function displayHomeArticles() {
  try {
    const querySnapshot = await db.collection("articles")
      .orderBy("createdAt", "desc")
      .get();
    const articles = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const articlesList = document.getElementById("homeArticlesList");
    if (!articlesList) return;

    articlesList.innerHTML = "";

    // Show only latest 3
    const latestArticles = articles.slice(0, 3);

    if (latestArticles.length === 0) {
      articlesList.innerHTML = "<p class='home-articles-empty'>No articles published yet. Check back soon!</p>";
      return;
    }

    latestArticles.forEach((article) => {
      const articleCard = document.createElement("div");
      articleCard.className = "home-article-card";
      articleCard.onclick = () => openArticleReader(article);

      articleCard.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="home-article-image">
        <div class="home-article-content">
          <h3>${article.title}</h3>
          <p>${article.content}</p>
          <div class="home-article-meta">
            <div>
              <div class="home-article-author">By ${article.author}</div>
              <div>${article.date}</div>
            </div>
          </div>
        </div>
      `;
      articlesList.appendChild(articleCard);
    });
  } catch (error) {
    console.error("Error displaying home articles:", error);
  }
}

// Open article reader modal
function openArticleReader(article) {
  const modal = document.getElementById("articleReaderModal");
  const content = document.getElementById("articleReaderContent");

  content.innerHTML = `
    <img src="${article.image}" alt="${article.title}">
    <h2>${article.title}</h2>
    <div class="reader-meta">
      <div><span class="reader-author">By ${article.author}</span></div>
      <div>${article.date}</div>
    </div>
    <div class="reader-body">${article.content}</div>
  `;

  modal.classList.remove("hidden");
}

// Close article reader modal
function closeArticleReader() {
  document.getElementById("articleReaderModal").classList.add("hidden");
}

// Open more articles modal
async function openMoreArticles() {
  try {
    const querySnapshot = await db.collection("articles")
      .orderBy("createdAt", "desc")
      .get();
    const articles = [];

    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    displayAllArticles(articles);
    document.getElementById("allArticlesModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error opening more articles:", error);
    alert("Error loading articles");
  }
}

// Display all articles in modal
function displayAllArticles(articles) {
  const allArticlesList = document.getElementById("allArticlesList");
  allArticlesList.innerHTML = "";

  if (articles.length === 0) {
    allArticlesList.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #999;'>No articles yet</p>";
    return;
  }

  articles.forEach((article) => {
    const item = document.createElement("div");
    item.className = "all-article-item";
    item.onclick = () => {
      openArticleReader(article);
      closeMoreArticles();
    };

    item.innerHTML = `
      <img src="${article.image}" alt="${article.title}">
      <div class="all-article-item-content">
        <h4>${article.title}</h4>
        <div class="date">${article.date}</div>
      </div>
    `;
    allArticlesList.appendChild(item);
  });
}

// Close more articles modal
function closeMoreArticles() {
  document.getElementById("allArticlesModal").classList.add("hidden");
}

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  const readerModal = document.getElementById("articleReaderModal");
  const allModal = document.getElementById("allArticlesModal");
  if (e.target === readerModal) {
    closeArticleReader();
  }
  if (e.target === allModal) {
    closeMoreArticles();
  }
});

// Load articles on page load
document.addEventListener("DOMContentLoaded", () => {
  displayHomeArticles();
});

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  const loginModal = document.getElementById("adminLoginModal");
  if (e.target === loginModal) {
    closeAdminModal();
  }
});

// Allow Enter key to login
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !document.getElementById("adminLoginModal").classList.contains("hidden")) {
    loginAdmin();
  }
});

// Expose functions to global scope for HTML onclick handlers
window.closeAdminModal = closeAdminModal;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
window.switchTab = switchTab;
window.publishArticle = publishArticle;
window.loadArticles = loadArticles;
window.deleteArticle = deleteArticle;
window.openMoreArticles = openMoreArticles;
window.closeMoreArticles = closeMoreArticles;
window.closeArticleReader = closeArticleReader;
window.openArticleReader = openArticleReader;
window.loadHadith = loadHadith;
window.clearSearchResults = clearSearchResults;
window.loadResultHadith = loadResultHadith;
window.resetSearch = resetSearch;

// ============================================
// HADITH FUNCTIONALITY
// ============================================

async function getHadith(collection, id) {
  try {
    // Try .min.json first (minified version)
    let response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection}/${id}.min.json`);

    // Fallback to .json if .min.json fails
    if (!response.ok) {
      response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection}/${id}.json`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching hadith:", error);
    return null;
  }
}

// Helper function to determine if input is a number
function isNumericSearch(input) {
  return /^\d+$/.test(input.trim());
}

// Clear search results
function clearSearchResults() {
  document.getElementById("searchResults").classList.add("hidden");
  document.getElementById("resultsList").innerHTML = "";
}

// Reset search - clear everything and go back to initial state
function resetSearch() {
  document.getElementById("hadithId").value = "";
  document.getElementById("hadithCard").style.display = "block";
  document.getElementById("hadithCard").innerHTML = `
    <div class="card-content">
      <p class="empty-state">
        <span class="empty-emoji">✨</span>
        Enter a hadith number or keyword to discover
      </p>
    </div>
  `;
  clearSearchResults();
}

// Display a single hadith
function displayHadith(hadithData, collection) {
  const card = document.getElementById("hadithCard");
  const englishHadith = hadithData.english;
  const arabicHadith = hadithData.arabic;

  const arabicText = arabicHadith?.text || "Arabic text not available";
  const collectionNames = {
    "eng-bukhari": "Sahih al-Bukhari",
    "eng-muslim": "Sahih Muslim",
    "eng-abudawud": "Sunan Abu Dawud",
    "eng-tirmidhi": "Sunan at-Tirmidhi",
    "eng-nasai": "Sunan an-Nasa'i",
    "eng-ibnmajah": "Sunan Ibn Majah"
  };
  const collectionName = collectionNames[collection] || collection;

  card.innerHTML = `
    <div class="card-content hadith-content">
      <div class="hadith-actions">
        <span class="hadith-number">Hadith #${englishHadith.hadithnumber}</span>
        <button class="hadith-close-btn" onclick="resetSearch()">✕</button>
      </div>

      <div class="hadith-arabic">
        ${arabicText}
      </div>

      <div class="hadith-english">
        <p>${englishHadith.text}</p>
      </div>

      <div class="hadith-meta">
        <span>📖 ${collectionName}</span>
        <span>🔍 ID: ${englishHadith.hadithnumber}</span>
      </div>
    </div>
  `;
}

// Search hadiths by keyword
async function searchHadithByKeyword(keyword) {
  const card = document.getElementById("hadithCard");
  const spinner = document.getElementById("loadingSpinner");
  const collection = document.getElementById("collectionSelect").value;
  const arabicCollection = collection.replace("eng-", "ara-");

  spinner.classList.remove("hidden");
  card.innerHTML = `
    <div class="card-content">
      <p class="empty-state">
        <span class="empty-emoji">🔍</span>
        Searching for "${keyword}"...
      </p>
    </div>
  `;

  try {
    // Fetch all hadiths from the collection (this uses a single file with all hadiths)
    const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection}.min.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch collection");
    }

    const collectionData = await response.json();
    const allHadiths = collectionData.hadiths || [];

    // Search by text (case-insensitive)
    const keyword_lower = keyword.toLowerCase();
    const matches = allHadiths.filter(h =>
      h.text && h.text.toLowerCase().includes(keyword_lower)
    ).slice(0, 10); // Limit to 10 results

    spinner.classList.add("hidden");

    if (matches.length === 0) {
      card.innerHTML = '<div class="card-content"><p class="error-state">❌ No hadiths found matching your search</p></div>';
      return;
    }

    if (matches.length === 1) {
      // If only one match, display it directly
      const arabicData = await getHadith(arabicCollection, matches[0].hadithnumber);
      const arabicHadith = arabicData?.hadiths?.find(h => h.hadithnumber === matches[0].hadithnumber);
      displayHadith({ english: matches[0], arabic: arabicHadith }, collection);
    } else {
      // If multiple matches, show results list
      card.innerHTML = '<div class="card-content"><p class="empty-state">Found ' + matches.length + ' matching hadiths</p></div>';
      displaySearchResults(matches, collection);
    }
  } catch (error) {
    console.error("Error searching hadiths:", error);
    spinner.classList.add("hidden");
    card.innerHTML = '<div class="card-content"><p class="error-state">❌ Error searching hadiths</p></div>';
  }
}

// Display search results
async function displaySearchResults(results, collection) {
  const resultsDiv = document.getElementById("searchResults");
  const resultsList = document.getElementById("resultsList");
  const hadithCard = document.getElementById("hadithCard");
  const arabicCollection = collection.replace("eng-", "ara-");

  // Hide the hadith card when showing search results
  hadithCard.style.display = "none";

  resultsList.innerHTML = results.map(hadith => `
    <div class="result-item" onclick="loadResultHadith(${hadith.hadithnumber}, '${collection}')">
      <div class="result-number">Hadith #${hadith.hadithnumber}</div>
      <div class="result-text">${hadith.text.substring(0, 150)}...</div>
    </div>
  `).join("");

  resultsDiv.classList.remove("hidden");
}

// Load a hadith from search results
async function loadResultHadith(hadithNumber, collection) {
  const hadithCard = document.getElementById("hadithCard");
  hadithCard.style.display = "block";

  const arabicCollection = collection.replace("eng-", "ara-");
  const englishData = await getHadith(collection, hadithNumber);
  const arabicData = await getHadith(arabicCollection, hadithNumber);

  if (englishData?.hadiths) {
    const englishHadith = englishData.hadiths.find(h => h.hadithnumber === hadithNumber);
    const arabicHadith = arabicData?.hadiths?.find(h => h.hadithnumber === hadithNumber);
    displayHadith({ english: englishHadith, arabic: arabicHadith }, collection);
    clearSearchResults();
  }
}

// Main load hadith function - handles both number and keyword search
async function loadHadith() {
  const input = document.getElementById("hadithId").value.trim();
  const card = document.getElementById("hadithCard");
  const spinner = document.getElementById("loadingSpinner");
  const collection = document.getElementById("collectionSelect").value;

  if (!input) {
    card.innerHTML = '<div class="card-content"><p class="error-state">❌ Please enter a hadith number or keyword</p></div>';
    return;
  }

  clearSearchResults();

  if (isNumericSearch(input)) {
    // Numeric search
    const id = parseInt(input);
    const card = document.getElementById("hadithCard");
    card.style.display = "block";

    spinner.classList.remove("hidden");
    card.innerHTML = `
      <div class="card-content">
        <p class="empty-state">
          <span class="empty-emoji">⏳</span>
          Loading hadith...
        </p>
      </div>
    `;

    const arabicCollection = collection.replace("eng-", "ara-");
    const englishData = await getHadith(collection, id);
    const arabicData = await getHadith(arabicCollection, id);

    spinner.classList.add("hidden");

    if (!englishData || !englishData.hadiths) {
      card.innerHTML = '<div class="card-content"><p class="error-state">⚠️ Hadith not found or API error</p></div>';
      return;
    }

    const englishHadith = englishData.hadiths.find(h => h.hadithnumber === id);
    const arabicHadith = arabicData?.hadiths?.find(h => h.hadithnumber === id);

    if (!englishHadith || !englishHadith.text) {
      card.innerHTML = '<div class="card-content"><p class="error-state">❌ Hadith not found</p></div>';
      return;
    }

    displayHadith({ english: englishHadith, arabic: arabicHadith }, collection);
  } else {
    // Keyword search
    await searchHadithByKeyword(input);
  }
}
