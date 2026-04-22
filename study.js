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

// ============================================
// PDF DOWNLOAD FUNCTIONS
// ============================================

// Download Hadith Terminology Glossary
function downloadTerminologyGlossary() {
  const content = `
    <h1>Hadith Terminology Glossary</h1>
    <p><strong>Complete glossary of hadith terms with definitions and examples</strong></p>

    <h2>Essential Hadith Terms</h2>

    <h3>Isnad (إسناد) - Chain of Narration</h3>
    <p>The chain of narrators through which a hadith is transmitted back to the Prophet ﷺ or a Companion.</p>

    <h3>Sanad (السند) - Support</h3>
    <p>All the narrators in the chain of transmission before the text of the hadith.</p>

    <h3>Matn (المتن) - Text</h3>
    <p>The actual statement or narrative of the hadith, separate from the chain.</p>

    <h3>Rawi (الراوي) - Narrator</h3>
    <p>An individual who transmits and reports hadith.</p>

    <h3>Adalah (العدالة) - Trustworthiness</h3>
    <p>A narrator's credibility and reliability based on their piety and honesty.</p>

    <h3>Dabt (الضبط) - Precision</h3>
    <p>A narrator's accuracy and careful preservation of the hadith text.</p>

    <h3>Sahih (صحيح) - Sound/Authentic</h3>
    <p>A hadith that meets all conditions for authenticity with unbroken chains and no defects.</p>

    <h3>Hasan (حسن) - Good/Fair</h3>
    <p>A hadith slightly below sahih but still reliable enough for practice.</p>

    <h3>Da'if (ضعيف) - Weak</h3>
    <p>A hadith that does not meet the conditions for sahih or hasan.</p>

    <h3>Maudu' (موضوع) - Fabricated/False</h3>
    <p>A hadith not actually spoken or done by the Prophet ﷺ.</p>

    <h3>Mursal (مرسل) - Disconnected</h3>
    <p>A hadith where the Successor directly attributes a statement to the Prophet without mentioning the Companion.</p>

    <h3>Mudallus (مدلس) - Hidden/Ambiguous</h3>
    <p>When a narrator reports from someone he did not hear from directly, using ambiguous words to hide this.</p>

    <h3>Mutawatir (متواتر) - Continuous/Uninterrupted</h3>
    <p>A hadith reported by so many narrators that fabrication is impossible.</p>

    <h3>Ahad (آحاد) - Singular/Single Chain</h3>
    <p>A hadith reported by few narrators not reaching the level of tawatur.</p>

    <h3>Mashhur (مشهور) - Famous/Well-Known</h3>
    <p>A hadith reported by three or more narrators but not reaching tawatur level.</p>

    <h3>'Ilal (العلل) - Hidden Defects</h3>
    <p>Non-obvious weaknesses in a hadith that are discovered through careful analysis by experts.</p>

    <h3>Shadh (الشذوذ) - Singularity</h3>
    <p>A reliable narrator reports something contradicting more reliable narrators.</p>

    <h3>Munkar (المنكر) - Disapproved/Objectionable</h3>
    <p>A weak hadith that contradicts more authentic evidence.</p>
  `;

  generateAndDownloadPDF(content, 'Hadith-Terminology-Glossary.pdf');
}

// Download Study Guide to Mustalah al-Hadith
function downloadMustalahGuide() {
  const content = `
    <h1>Study Guide to Mustalah al-Hadith</h1>
    <p><strong>Comprehensive study guide organized by topic for hadith terminology</strong></p>

    <h2>Introduction to Mustalah al-Hadith</h2>
    <p>Mustalah al-Hadith (terminology of hadith) is the science that deals with the terms and classifications used to describe hadith, their narrators, and their authenticity.</p>

    <h2>Section 1: Classifications by Authenticity</h2>

    <h3>Sahih (Authentic)</h3>
    <ul>
      <li>Complete chain of narrators with no missing links</li>
      <li>All narrators are trustworthy and precise</li>
      <li>No logical contradictions with other authentic sources</li>
      <li>Free from hidden defects</li>
    </ul>

    <h3>Hasan (Good)</h3>
    <ul>
      <li>Complete chain of transmission</li>
      <li>Narrators are generally trustworthy with minor weaknesses</li>
      <li>Can be used as evidence in Islamic law</li>
    </ul>

    <h3>Da'if (Weak)</h3>
    <ul>
      <li>Does not meet conditions for sahih or hasan</li>
      <li>May have broken chains or unreliable narrators</li>
      <li>Not suitable for Islamic rulings without corroboration</li>
    </ul>

    <h2>Section 2: Classifications by Transmission</h2>

    <h3>Mutawatir (Continuous)</h3>
    <p>Transmitted by so many narrators at every stage that falsehood is impossible</p>

    <h3>Ahad (Single Path)</h3>
    <p>Not reaching the level of tawatur, transmitted through limited chains</p>

    <h2>Section 3: Narrator Evaluation Terms</h2>

    <h3>Adil (Just)</h3>
    <p>A narrator known for piety, honesty, and Islamic conduct</p>

    <h3>Dabit (Precise)</h3>
    <p>A narrator known for careful and accurate transmission of hadith</p>

    <h3>Thiqah (Reliable)</h3>
    <p>An adil (just) and dabit (precise) narrator</p>

    <h3>Majhul (Unknown)</h3>
    <p>A narrator whose reliability is not established</p>

    <h2>Section 4: Types of Hadith by Source</h2>

    <h3>Marfu' (Elevated to the Prophet)</h3>
    <p>Directly attributed to the Prophet ﷺ through chain of narrators</p>

    <h3>Mawquf (Stopped at a Companion)</h3>
    <p>Attributed to a Companion of the Prophet ﷺ, not to the Prophet</p>

    <h3>Maqtu' (Stopped at a Successor)</h3>
    <p>Attributed to the generation of Successors (Tabi'in)</p>

    <h2>Study Tips</h2>
    <ul>
      <li>Start with learning the four main categories of authenticity (Sahih, Hasan, Da'if, Maudu')</li>
      <li>Study narrator evaluation terms as they are foundational</li>
      <li>Understand the difference between types of defects</li>
      <li>Practice identifying hadith by their characteristics</li>
    </ul>
  `;

  generateAndDownloadPDF(content, 'Study-Guide-Mustalah-al-Hadith.pdf');
}

// Download Narrator Evaluation Chart
function downloadNarratorChart() {
  const content = `
    <h1>Narrator Evaluation Chart</h1>
    <p><strong>Quick reference chart for evaluating hadith narrators</strong></p>

    <h2>Narrator Evaluation Criteria</h2>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 10px;">Criteria</th>
        <th style="border: 1px solid #ddd; padding: 10px;">Definition</th>
        <th style="border: 1px solid #ddd; padding: 10px;">Importance</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Adalah (Justice)</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">Piety, honesty, and adherence to Islamic conduct</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Critical - ensures narrator won't intentionally lie</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Dabit (Precision)</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">Accurate memory and careful transmission</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Critical - ensures accurate reporting</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Contiguity</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">Narrator actually heard from the previous person</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Critical - ensures chain is connected</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Consistency</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">Narrator's reports match other reliable sources</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Important - identifies contradictions</td>
      </tr>
    </table>

    <h2>Narrator Classification Levels</h2>

    <h3 style="color: #059669;">✓ Reliable Narrators (Thiqa)</h3>
    <ul>
      <li>Both just and precise</li>
      <li>Hadith accepted without question</li>
      <li>Examples: Abu Bakr, 'Umar, 'Aisha</li>
    </ul>

    <h3 style="color: #d97706;">~ Fair Narrators (Saduq)</h3>
    <ul>
      <li>Generally trustworthy with minor weaknesses</li>
      <li>Hadith accepted with caution</li>
      <li>May contain slight errors</li>
    </ul>

    <h3 style="color: #dc2626;">✗ Weak Narrators</h3>
    <ul>
      <li>Known for inaccuracy or unreliability</li>
      <li>Hadith considered weak</li>
      <li>Requires corroboration from stronger sources</li>
    </ul>

    <h3 style="color: #9333ea;">✗✗ Rejected Narrators</h3>
    <ul>
      <li>Known liars or extreme dababers (forgetfulness)</li>
      <li>Hadith rejected outright</li>
      <li>No Islamic rulings based on their reports</li>
    </ul>

    <h2>Quick Reference: Red Flags in Narrators</h2>
    <ul>
      <li>Known to mix authentic and weak hadith</li>
      <li>Severe forgetfulness or memory issues</li>
      <li>Contradicted by multiple reliable narrators</li>
      <li>Criticized by multiple hadith scholars</li>
      <li>Known for fabrication or lying</li>
      <li>Transmitting hadith outside their field of expertise</li>
    </ul>
  `;

  generateAndDownloadPDF(content, 'Narrator-Evaluation-Chart.pdf');
}

// Download Hadith Sciences Quick Reference
function downloadHadithSciences() {
  const content = `
    <h1>Hadith Sciences Quick Reference Guide</h1>
    <p><strong>Quick reference guide covering all major hadith sciences</strong></p>

    <h2>The Five Major Hadith Sciences</h2>

    <h3>1. Ilm al-Isnad (Science of Chains)</h3>
    <p><strong>Focus:</strong> Study and analysis of the chain of narrators</p>
    <p><strong>Purpose:</strong> Determine if the chain is complete and unbroken</p>
    <p><strong>Key Questions:</strong></p>
    <ul>
      <li>Are all narrators contemporary?</li>
      <li>Did each narrator actually hear from the previous one?</li>
      <li>Is the chain unbroken from the Prophet to compilation?</li>
    </ul>

    <h3>2. Ilm al-Rijal (Science of Narrators)</h3>
    <p><strong>Focus:</strong> Biographical study and evaluation of hadith narrators</p>
    <p><strong>Purpose:</strong> Determine the reliability of narrators</p>
    <p><strong>Key Questions:</strong></p>
    <ul>
      <li>Is the narrator known for piety and honesty?</li>
      <li>What is the narrator's reputation among scholars?</li>
      <li>Are they known for precise transmission?</li>
    </ul>

    <h3>3. Ilm al-Jarh wa Ta'dil (Science of Criticism and Accreditation)</h3>
    <p><strong>Focus:</strong> Praising reliable narrators and criticizing unreliable ones</p>
    <p><strong>Purpose:</strong> Establish the credibility status of narrators</p>
    <p><strong>Jarh (Criticism):</strong> Pointing out weaknesses, dishonesty, or unreliability</p>
    <p><strong>Ta'dil (Accreditation):</strong> Confirming trustworthiness and reliability</p>

    <h3>4. Ilm al-'Ilal (Science of Hidden Defects)</h3>
    <p><strong>Focus:</strong> Identification of subtle weaknesses not obvious at first glance</p>
    <p><strong>Purpose:</strong> Reject seemingly-sound hadith that have hidden problems</p>
    <p><strong>Examples of Defects:</strong></p>
    <ul>
      <li>Broken chain (incomplete transmission)</li>
      <li>Narrator didn't actually meet their teacher</li>
      <li>Singular weak narration contradicting stronger sources</li>
    </ul>

    <h3>5. Ilm al-Mustalah (Science of Terminology)</h3>
    <p><strong>Focus:</strong> Understanding terms and classifications of hadith</p>
    <p><strong>Purpose:</strong> Enable precise communication about hadith quality</p>
    <p><strong>Key Terms:</strong> Sahih, Hasan, Da'if, Maudu', Mursal, etc.</p>

    <h2>The Authentication Process</h2>
    <ol>
      <li><strong>Examine the Chain:</strong> Check if all narrators are connected and contemporary</li>
      <li><strong>Evaluate Narrators:</strong> Assess the reliability of each person in the chain</li>
      <li><strong>Check for Defects:</strong> Look for hidden problems despite apparent soundness</li>
      <li><strong>Compare Reports:</strong> Check consistency with other authentic sources</li>
      <li><strong>Make Decision:</strong> Classify as Sahih, Hasan, Da'if, or Maudu'</li>
    </ol>

    <h2>Quick Classification Guide</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background: #059669; color: white;">
        <th style="border: 1px solid #ddd; padding: 10px;">Category</th>
        <th style="border: 1px solid #ddd; padding: 10px;">Reliability</th>
        <th style="border: 1px solid #ddd; padding: 10px;">Usable For</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Sahih</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">Highest</td>
        <td style="border: 1px solid #ddd; padding: 10px;">All Islamic matters</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Hasan</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">High</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Islamic rulings</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Da'if</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">Low</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Virtues of deeds only (with support)</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;"><strong>Maudu'</strong></td>
        <td style="border: 1px solid #ddd; padding: 10px;">None</td>
        <td style="border: 1px solid #ddd; padding: 10px;">Reject entirely</td>
      </tr>
    </table>

    <h2>Key Resources for Study</h2>
    <ul>
      <li>Muqaddimah Ibn as-Salah - Foundational work on hadith sciences</li>
      <li>Nukhbat al-Fikar - Quick introduction by Ibn Hajar</li>
      <li>Taqrib al-Tahdhib - Biographical dictionary of narrators</li>
      <li>Tahdhib al-Tahdhib - Comprehensive narrator biographies</li>
    </ul>
  `;

  generateAndDownloadPDF(content, 'Hadith-Sciences-Quick-Reference.pdf');
}

// Helper function to generate and download PDF
function generateAndDownloadPDF(htmlContent, filename) {
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';

  const options = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(options).from(element).save();
}

// Export functions for external calls
window.closeStudyModal = closeStudyModal;
window.openStudyPage = openStudyPage;
window.downloadTerminologyGlossary = downloadTerminologyGlossary;
window.downloadMustalahGuide = downloadMustalahGuide;
window.downloadNarratorChart = downloadNarratorChart;
window.downloadHadithSciences = downloadHadithSciences;

// When study.html loads directly
if (document.getElementById('studyModal')) {
  document.getElementById('studyModal').style.display = 'flex';
}

