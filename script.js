function showSection(id) {
      document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
      document.getElementById(id).classList.add("active");
      if (id === "panier") afficherPanier();
      mettreAJourCompteur();
    }

    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    function ajouterPanier(nom, prix) {
      let existant = panier.find(p => p.nom === nom);
      if (existant) {
        existant.quantite += 1;
      } else {
        panier.push({ nom, prix, quantite: 1 });
      }
      localStorage.setItem("panier", JSON.stringify(panier));
      mettreAJourCompteur();
      
    }

    function getImageUrl(nom) {
      if (nom.includes("Classique")) return "https://via.placeholder.com/80x60?text=Classique";
      if (nom.includes("Street")) return "https://via.placeholder.com/80x60?text=Street";
      if (nom.includes("Vintage")) return "https://via.placeholder.com/80x60?text=Vintage";
      if (nom.includes("Pull")) return "https://via.placeholder.com/80x60?text=Pull";
      if (nom.includes("T-Shirt")) return "https://via.placeholder.com/80x60?text=T-Shirt";
      return "https://via.placeholder.com/80x60?text=Produit";
    }

    function afficherPanier() {
      const container = document.getElementById("contenuPanier");
      const actions = document.getElementById("panier-actions");

      if (panier.length === 0) {
        container.innerHTML = "<p>Votre panier est vide.</p>";
        actions.innerHTML = '';
        return;
      }

      let total = 0;
      let html = panier.map((item, index) => {
        total += item.prix * item.quantite;
        return `
          <div class="item">
            <img src="${getImageUrl(item.nom)}" alt="${item.nom}">
            <div>
      ${item.nom}<br>
      <button onclick="changerQuantite(${index}, -1)">-</button>
      <span style='margin: 0 5px;'>${item.quantite}</span>
      <button onclick="changerQuantite(${index}, 1)">+</button>
    </div>
            <div>CHF ${(item.prix * item.quantite).toFixed(2)}</div>
            <button onclick="supprimerItem(${index})">&times;</button>
          </div>
        `;
      }).join('');
      html += `<div class="total">Total : CHF ${total.toFixed(2)}</div>`;
      container.innerHTML = html;

      actions.innerHTML = `
        <button onclick="alert('Paiement simulé ! Merci.')" style="padding: 15px 30px; font-weight: bold; border-radius: 30px; font-size: 0.9em; letter-spacing: 1px; background:black; color:white; border:none;">
          PROCÉDER AU PAIEMENT
        </button>
        <div style="margin-top: 10px;">
          <a href="#" onclick="showSection('produits')" style="text-decoration: none; color: black;">Retourner au magasinage</a>
        </div>
      `;
    }

    function supprimerItem(index) {
      panier.splice(index, 1);
      localStorage.setItem("panier", JSON.stringify(panier));
      afficherPanier();
      mettreAJourCompteur();
    }

    function fermerRecherche() {
      document.getElementById("searchOverlay").classList.remove("active");
      document.getElementById("searchInput").value = "";
    }

    document.querySelector(".fa-search").addEventListener("click", () => {
      document.getElementById("searchOverlay").classList.add("active");
      document.getElementById("searchInput").focus();
      afficherProduitsRecherche("");
    });

    document.getElementById("searchInput").addEventListener("input", function () {
      afficherProduitsRecherche(this.value.toLowerCase());
    });

    function afficherProduitsRecherche(terme) {
      const container = document.getElementById("resultatsRecherche");
      const produits = [
        { nom: "Casquette Classique", prix: 19.90, img: "https://via.placeholder.com/200x150?text=Classique" },
        { nom: "Casquette Street", prix: 24.90, img: "https://via.placeholder.com/200x150?text=Street" },
        { nom: "Casquette Vintage", prix: 21.90, img: "https://via.placeholder.com/200x150?text=Vintage" },
        { nom: "Pull Noir", prix: 39.90, img: "https://via.placeholder.com/200x150?text=Pull+Noir" },
        { nom: "T-Shirt Blanc", prix: 16.90, img: "https://via.placeholder.com/200x150?text=T-Shirt+Blanc" }
      ];

      const filtres = produits.filter(p => p.nom.toLowerCase().includes(terme));

      if (filtres.length === 0) {
        container.innerHTML = "<p>Aucun produit trouvé.</p>";
        return;
      }
      container.innerHTML = filtres.map(p => `
        <div class="product">
          <img src="${p.img}" alt="${p.nom}">
          <h3>${p.nom}</h3>
          <p>CHF ${p.prix.toFixed(2)}</p>
          <button onclick="ajouterPanier('${p.nom}', ${p.prix})">Ajouter au panier</button>
        </div>
      `).join('');
    }
  
function mettreAJourCompteur() {
  let total = panier.reduce((sum, item) => sum + item.quantite, 0);
  document.getElementById("cart-count").innerText = total;
}
mettreAJourCompteur();


function changerQuantite(index, delta) {
  panier[index].quantite += delta;
  if (panier[index].quantite <= 0) {
    panier.splice(index, 1);
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
  mettreAJourCompteur();
}


function simulerPaiement() {
  document.getElementById('confirmationPaiement').style.display = 'block';
  setTimeout(() => {
    showSection('accueil');
    document.getElementById('confirmationPaiement').style.display = 'none';
  }, 3000);
  return false;
}


document.getElementById("chat-widget").addEventListener("click", () => {
  const box = document.getElementById("chat-box");
  box.style.display = box.style.display === "none" ? "block" : "none";
});
function envoyerMessage() {
  const msg = document.getElementById("chatMessage").value;
  if (msg.trim() === "") return;
  document.getElementById("chatResponse").innerText = "Merci ! Nous vous répondrons bientôt.";
  document.getElementById("chatMessage").value = "";
}


function trierProduits() {
  const select = document.getElementById("tri").value;
  const toutesSections = document.querySelectorAll("#produits h3 + .products");
  toutesSections.forEach(section => {
    const items = Array.from(section.children);
    let sorted = [...items];
    if (select === "prix-asc") {
      sorted.sort((a, b) => parseFloat(a.querySelector("p").innerText.replace('CHF ', '')) - parseFloat(b.querySelector("p").innerText.replace('CHF ', '')));
    } else if (select === "prix-desc") {
      sorted.sort((a, b) => parseFloat(b.querySelector("p").innerText.replace('CHF ', '')) - parseFloat(a.querySelector("p").innerText.replace('CHF ', '')));
    } else if (select === "nom") {
      sorted.sort((a, b) => a.querySelector("h3").innerText.localeCompare(b.querySelector("h3").innerText));
    }
    sorted.forEach(el => section.appendChild(el));
  });
}