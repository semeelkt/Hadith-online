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
      date: new Date().toLocaleDateString()
    };

    try {
      // Try to save to backend
      const response = await fetch("http://localhost:3000/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article)
      });

      if (response.ok) {
        messageElement.textContent = "✓ Article published successfully!";
        messageElement.className = "message success";
      } else {
        throw new Error("Backend error");
      }
    } catch (error) {
      // Fallback to localStorage if backend is not running
      const articles = JSON.parse(localStorage.getItem("articles") || "[]");
      articles.push(article);
      localStorage.setItem("articles", JSON.stringify(articles));
      messageElement.textContent = "✓ Article saved locally (backend not running)";
      messageElement.className = "message success";
    }

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
  };

  reader.readAsDataURL(imageFile);
}

// Load articles
function loadArticles() {
  fetch("http://localhost:3000/api/articles")
    .then(res => res.json())
    .then(articles => {
      const articlesList = document.getElementById("articlesList");
      articlesList.innerHTML = "";

      if (articles.length === 0) {
        articlesList.innerHTML = "<p style='color: rgba(212, 165, 116, 0.6); text-align: center;'>No articles published yet.</p>";
        return;
      }

      articles.forEach((article, index) => {
        const articleCard = document.createElement("div");
        articleCard.className = "article-card";
        articleCard.innerHTML = `
          <img src="data:image/jpeg;base64,${article.image}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
          <h3>${article.title}</h3>
          <p>${article.content.substring(0, 100)}...</p>
          <div class="article-meta">
            <div>
              <div style="color: var(--accent-gold);">By ${article.author}</div>
              <div>${article.date}</div>
            </div>
            <button class="delete-btn" onclick="deleteArticle(${article.id})">Delete</button>
          </div>
        `;
        articlesList.appendChild(articleCard);
      });
    })
    .catch(error => {
      // Fallback to localStorage
      const articles = JSON.parse(localStorage.getItem("articles") || "[]");
      const articlesList = document.getElementById("articlesList");
      articlesList.innerHTML = "";

      if (articles.length === 0) {
        articlesList.innerHTML = "<p style='color: rgba(212, 165, 116, 0.6); text-align: center;'>No articles published yet.</p>";
        return;
      }

      articles.forEach((article, index) => {
        const articleCard = document.createElement("div");
        articleCard.className = "article-card";
        articleCard.innerHTML = `
          <img src="${article.image}" alt="${article.title}">
          <h3>${article.title}</h3>
          <p>${article.content.substring(0, 100)}...</p>
          <div class="article-meta">
            <div>
              <div style="color: var(--accent-gold);">By ${article.author}</div>
              <div>${article.date}</div>
            </div>
            <button class="delete-btn" onclick="deleteArticle(${index})">Delete</button>
          </div>
        `;
        articlesList.appendChild(articleCard);
      });
    });
}

// Delete article
function deleteArticle(index) {
  if (confirm("Are you sure you want to delete this article?")) {
    // Try to delete from backend
    fetch(`http://localhost:3000/api/articles/${index}`, {
      method: "DELETE"
    })
      .then(() => {
        loadArticles();
        displayHomeArticles();
      })
      .catch(() => {
        // Fallback to localStorage
        const articles = JSON.parse(localStorage.getItem("articles") || "[]");
        articles.splice(index, 1);
        localStorage.setItem("articles", JSON.stringify(articles));
        loadArticles();
        displayHomeArticles();
      });
  }
}

// Display articles on home page (latest 3 only)
function displayHomeArticles() {
  fetch("http://localhost:3000/api/articles")
    .then(res => res.json())
    .then(articles => {
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

        // Handle both data:image and base64 formats
        let imageSrc = article.image;
        if (!imageSrc.startsWith("data:")) {
          imageSrc = `data:image/jpeg;base64,${imageSrc}`;
        }

        articleCard.innerHTML = `
          <img src="${imageSrc}" alt="${article.title}" class="home-article-image">
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
    })
    .catch(() => {
      // Fallback to localStorage
      const articles = JSON.parse(localStorage.getItem("articles") || "[]");
      const articlesList = document.getElementById("homeArticlesList");

      if (!articlesList) return;

      articlesList.innerHTML = "";

      const latestArticles = articles.slice(0, 3);

      if (latestArticles.length === 0) {
        articlesList.innerHTML = "<p class='home-articles-empty'>No articles published yet. Check back soon!</p>";
        return;
      }

      latestArticles.forEach((article, index) => {
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
    });
}

// Open article reader modal
function openArticleReader(article) {
  const modal = document.getElementById("articleReaderModal");
  const content = document.getElementById("articleReaderContent");

  let imageSrc = article.image;
  if (!imageSrc.startsWith("data:")) {
    imageSrc = `data:image/jpeg;base64,${imageSrc}`;
  }

  content.innerHTML = `
    <img src="${imageSrc}" alt="${article.title}">
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
function openMoreArticles() {
  fetch("http://localhost:3000/api/articles")
    .then(res => res.json())
    .then(articles => {
      displayAllArticles(articles);
      document.getElementById("allArticlesModal").classList.remove("hidden");
    })
    .catch(() => {
      const articles = JSON.parse(localStorage.getItem("articles") || "[]");
      displayAllArticles(articles);
      document.getElementById("allArticlesModal").classList.remove("hidden");
    });
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

    let imageSrc = article.image;
    if (!imageSrc.startsWith("data:")) {
      imageSrc = `data:image/jpeg;base64,${imageSrc}`;
    }

    item.innerHTML = `
      <img src="${imageSrc}" alt="${article.title}">
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

async function loadHadith() {
  const id = document.getElementById("hadithId").value;
  const card = document.getElementById("hadithCard");
  const spinner = document.getElementById("loadingSpinner");

  if (!id) {
    card.innerHTML = '<div class="card-content"><p class="error-state">❌ Please enter a valid hadith number</p></div>';
    return;
  }

  spinner.classList.remove("hidden");
  card.innerHTML = `
    <div class="card-content">
      <p class="empty-state">
        <span class="empty-emoji">⏳</span>
        Loading hadith...
      </p>
    </div>
  `;

  // Fetch both English and Arabic versions
  const englishData = await getHadith("eng-bukhari", id);
  const arabicData = await getHadith("ara-bukhari", id);

  spinner.classList.add("hidden");

  if (!englishData || !englishData.hadiths) {
    card.innerHTML = '<div class="card-content"><p class="error-state">⚠️ Hadith not found or API error</p></div>';
    return;
  }

  // Find the hadith in the arrays by hadithnumber
  const englishHadith = englishData.hadiths.find(h => h.hadithnumber === parseInt(id));
  const arabicHadith = arabicData?.hadiths?.find(h => h.hadithnumber === parseInt(id));

  if (!englishHadith || !englishHadith.text) {
    card.innerHTML = '<div class="card-content"><p class="error-state">❌ Hadith not found</p></div>';
    return;
  }

  const arabicText = arabicHadith?.text || "Arabic text not available";

  card.innerHTML = `
    <div class="card-content hadith-content">
      <span class="hadith-number">Hadith #${englishHadith.hadithnumber}</span>

      <div class="hadith-arabic">
        ${arabicText}
      </div>

      <div class="hadith-english">
        <p>${englishHadith.text}</p>
      </div>

      <div class="hadith-meta">
        <span>📖 Sahih al-Bukhari</span>
        <span>🔍 ID: ${englishHadith.hadithnumber}</span>
      </div>
    </div>
  `;
}