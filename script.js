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

  if (!id) {
    card.innerHTML = "<p>Please enter a valid number</p>";
    return;
  }

  card.innerHTML = "<p>Loading...</p>";

  const data = await getHadith("eng-bukhari", id);

  if (!data || !data.hadiths) {
    card.innerHTML = "<p>Hadith not found or API error</p>";
    return;
  }

  // Find the hadith in the array by hadithnumber
  const hadith = data.hadiths.find(h => h.hadithnumber === parseInt(id));

  if (!hadith || !hadith.text) {
    card.innerHTML = "<p>Hadith not found</p>";
    return;
  }

  card.innerHTML = `
    <div class="hadith-content">
      <div class="english">${hadith.text}</div>
      <hr>
      <small><b>Hadith #${hadith.hadithnumber}</b></small>
    </div>
  `;
}