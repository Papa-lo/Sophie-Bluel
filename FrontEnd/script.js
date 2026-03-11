// ============================================================
// RÉCUPÉRATION DES DONNÉES (BACKEND)
// ============================================================

// On va chercher les données "works" sur le serveur
const RETOUR_SERVEUR_WORKS = await fetch('http://localhost:5678/api/works');
// On transforme la réponse en format utilisable (JSON)
const LISTE_PROJETS = await RETOUR_SERVEUR_WORKS.json();
// On vérifie dans la console qu'on a bien reçu les données
console.log(LISTE_PROJETS);

// On va chercher les catégories sur le serveur
const RETOUR_SERVEUR_CATEGORIES = await fetch('http://localhost:5678/api/categories');
const LISTE_CATEGORIES = await RETOUR_SERVEUR_CATEGORIES.json();
// On vérifie ce qu'on a reçu
console.log(LISTE_CATEGORIES);

// ============================================================
// AFFICHAGE DE LA GALERIE
// ============================================================

// On cible la balise HTML qui a la classe "gallery" pour pouvoir la manipuler :
const BALISE_GALERIE = document.querySelector(".gallery");

// La fonction pour générer les images dynamiquement :
function AFFICHER_GALERIE(LISTE_A_AFFICHER) {

    // on vide la galerie (pour enlever les images fixes du HTML)
    BALISE_GALERIE.innerHTML = "";

    // on boucle sur chaque projet reçu en argument :
    for (const PROJET of LISTE_A_AFFICHER) {
        // on crée la balise <figure>
        const BALISE_FIGURE = document.createElement("figure");

        // on crée l'image :
        const BALISE_IMG = document.createElement("img");
        BALISE_IMG.src = PROJET.imageUrl;

        // on crée la legende :
        const BALISE_FIGCAPTION = document.createElement("figcaption");
        BALISE_FIGCAPTION.innerText = PROJET.title;

        // on assemble (on met l'image et la légende DANS la figure) :
        BALISE_FIGURE.appendChild(BALISE_IMG);
        BALISE_FIGURE.appendChild(BALISE_FIGCAPTION);

        // on colle dans la galerie :
        BALISE_GALERIE.appendChild(BALISE_FIGURE);
    }
}

// On affiche la galerie une première fois au chargement :
AFFICHER_GALERIE(LISTE_PROJETS);

// ============================================================
// GESTION ADMIN / VISITEUR
// ============================================================

// On regarde dans l'armoire si on a un token :
const TOKEN_STOCKE = window.localStorage.getItem("token");

if (TOKEN_STOCKE) { // Si on a trouvé un token dans l'armoire...
    console.log("Admin connecté !"); // ...on le signale dans la console

    // ICI ON APPELLE LA FONCTION SPECIFIQUE AFFICHAGE ADMIN :
    MODE_ADMIN_ACTIVE(); // On lance la fonction d'affichage Admin

} else {// SINON, ON EST EN MODE VISITEUR, ON AFFICHE LES FILTRES
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
}

// ============================================================
// FONCTION SPECIFIQUE AFFICHAGE ADMIN
// ============================================================

function MODE_ADMIN_ACTIVE() {
    // Ici on mettra le code pour la bande noire et le bouton modifier
    // --- CRÉATION DE LA BANDE NOIRE DU HAUT ---
    // On crée la balise qui va être la bande noire :
    const BANDE_NOIRE_ADMIN = document.createElement("div");
    // On ajoute une "class" pour le style :
    BANDE_NOIRE_ADMIN.classList.add("admin-bar");
    // On mets le texte dedans
    BANDE_NOIRE_ADMIN.innerText = "Mode édition";
    // On la colle tout en haut de la page (dans le body) :
    document.body.prepend(BANDE_NOIRE_ADMIN);
    console.log("Bande noire créée !");
    console.log("Fonction Admin activée");
}

// --- CRÉATION DU BOUTON "MODIFIER" ---
// Création du bouton :
const BOUTON_MODIFIER = document.createElement("button");
// On ajoute le texte "Modifier" avec un petit stylo devant :
BOUTON_MODIFIER.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;
BOUTON_MODIFIER.classList.add("modif-button"); // On ajoute la class

// On vise le h2 "Mes Projets" :
const TITRE_PROJETS = document.querySelector("#portfolio h2");

// On insère le bouton juste après le titre :
TITRE_PROJETS.after(BOUTON_MODIFIER);
