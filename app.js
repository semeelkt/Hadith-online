const hadithList = [
  "Actions are judged by intentions, and everyone will be rewarded according to what they intended. — Sahih al-Bukhari 1",
  "The best among you are those who have the best manners and character. — Sahih al-Bukhari 3559",
  "None of you truly believes until he loves for his brother what he loves for himself. — Sahih al-Bukhari 13",
  "Whoever believes in Allah and the Last Day should speak good or remain silent. — Sahih al-Bukhari 6018"
];

const hadithElement = document.getElementById("hadith");
const nextButton = document.getElementById("next-hadith");

function showRandomHadith() {
  const randomIndex = Math.floor(Math.random() * hadithList.length);
  hadithElement.textContent = hadithList[randomIndex];
}

nextButton.addEventListener("click", showRandomHadith);
showRandomHadith();
