// Study Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  initializeStudyPage();
  setupHamburgerMenu();
});

// Initialize Study Page
function initializeStudyPage() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const studySections = document.querySelectorAll('.study-section');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const sectionName = this.getAttribute('data-section');
      const sectionElement = document.getElementById(sectionName + '-section');

      // Update active states
      sidebarLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      studySections.forEach(section => section.classList.remove('active'));

      // Show selected section or show fallback
      if (sectionElement) {
        sectionElement.classList.add('active');
      } else {
        // Fallback for overview
        document.getElementById('overview-section').classList.add('active');
      }

      // Scroll to top of content
      const studyContent = document.querySelector('.study-content');
      if (studyContent) {
        studyContent.scrollTop = 0;
      }
    });
  });

  // Set Overview as default active section
  document.getElementById('overview-section').classList.add('active');
}

// Close Study Modal
function closeStudyModal() {
  const studyModal = document.getElementById('studyModal');
  if (studyModal) {
    studyModal.style.display = 'none';
  }
  // Optionally redirect or hide
  window.history.back();
}

// Open Study Page (called from index.html)
function openStudyPage() {
  const studyModal = document.getElementById('studyModal');
  if (studyModal) {
    studyModal.style.display = 'flex';
  }
}

// Hamburger Menu Toggle
function setupHamburgerMenu() {
  const hamburger = document.getElementById('hamburgerMenu');
  const navbarNav = document.getElementById('navbarNav');

  if (hamburger && navbarNav) {
    hamburger.addEventListener('click', function() {
      navbarNav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navbarNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbarNav.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navbarNav.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);

      if (!isClickInsideNav && !isClickOnHamburger && navbarNav.classList.contains('active')) {
        navbarNav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }
}

// Export functions for external calls
window.closeStudyModal = closeStudyModal;
window.openStudyPage = openStudyPage;

// When study.html loads directly
if (document.getElementById('studyModal')) {
  document.getElementById('studyModal').style.display = 'flex';
}
