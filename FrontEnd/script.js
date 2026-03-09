// ============================================================
// PARTIE GALERIE
// ============================================================

// On va chercher les données "works" sur le serveur
const RETOUR_SERVEUR_WORKS = await fetch('http://localhost:5678/api/works');
// On transforme la réponse en format utilisable (JSON)
const LISTE_PROJETS = await RETOUR_SERVEUR_WORKS.json();
// On vérifie dans la console qu'on a bien reçu les données
console.log(LISTE_PROJETS);

// on vise la balise galerie :
const BALISE_GALERIE = document.querySelector(".gallery");

// La fonction pour afficher les images
function AFFICHER_GALERIE(LISTE_A_AFFICHER) {

    // on vide la galerie (pour enlever les images fixes du HTML)
    BALISE_GALERIE.innerHTML = "";

    // on boucle sur chaque projet :
    for (const PROJET of LISTE_A_AFFICHER) {
        // on crée la balise <figure>
        const BALISE_FIGURE = document.createElement("figure");

        // on crée l'image :
        const BALISE_IMG = document.createElement("img");
        BALISE_IMG.src = PROJET.imageUrl;

        // on crée la legende :
        const BALISE_FIGCAPTION = document.createElement("figcaption");
        BALISE_FIGCAPTION.innerText = PROJET.title;

        // on assemble le tout :
        BALISE_FIGURE.appendChild(BALISE_IMG);
        BALISE_FIGURE.appendChild(BALISE_FIGCAPTION);

        // on colle dans la galerie :
        BALISE_GALERIE.appendChild(BALISE_FIGURE);
    }
}

// On affiche la galerie une première fois au chargement :
AFFICHER_GALERIE(LISTE_PROJETS);

// ============================================================
// PARTIE FILTRES
// ============================================================

// On récupère les catégories depuis le Backend
const RETOUR_SERVEUR_CATEGORIES = await fetch('http://localhost:5678/api/categories');
const LISTE_CATEGORIES = await RETOUR_SERVEUR_CATEGORIES.json();
// On vérifie ce qu'on a reçu
console.log(LISTE_CATEGORIES);

// On crée une nouvelle balise <div> qui va contenir nos boutons
const BALISE_DES_FILTRES = document.createElement("div");
// On utilise la méthode "before" sur la galerie.
// Cela insère notre nouvelle div JUSTE AVANT la galerie dans le code HTML.
// C'est comme couper la file : la div se place devant la galerie.
BALISE_GALERIE.before(BALISE_DES_FILTRES);

// On crée le bouton "Tous" :
const BOUTON_TOUS = document.createElement("button");
BOUTON_TOUS.innerText = "Tous"; // Le texte du bouton

// On colle ce bouton DANS le conteneur de filtres qu'on vient de créer
BALISE_DES_FILTRES.appendChild(BOUTON_TOUS);

// --- INTELLIGENCE DU BOUTON TOUS ---
BOUTON_TOUS.addEventListener("click", function () {
    AFFICHER_GALERIE(LISTE_PROJETS);
    console.log("c'est bon");
});

// On boucle sur chaque catégorie pour créer les autres boutons
for (const CATEGORIE of LISTE_CATEGORIES) {
    const BOUTON_CATEGORIE = document.createElement("button");
    BOUTON_CATEGORIE.innerText = CATEGORIE.name; // Le texte du bouton (ex: "Objets")
    
    // On colle le bouton dans le conteneur
    BALISE_DES_FILTRES.appendChild(BOUTON_CATEGORIE);


        // --- INTELLIGENCE DES BOUTONS CATÉGORIES ---
        BOUTON_CATEGORIE.addEventListener("click", function () {
        // 1. On filtre la liste complète
        // On garde seulement les projets qui ont le même ID que la catégorie du bouton
        const PROJETS_FILTRES = LISTE_PROJETS.filter(function (PROJET) {
            return PROJET.categoryId === CATEGORIE.id;
        });

        // 2. On appelle la fonction d'affichage avec la liste filtrée
        AFFICHER_GALERIE(PROJETS_FILTRES);
        
    });

}

