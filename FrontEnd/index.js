// RECUPERATION DONNEES SERVEUR BACKEND
const RETOUR_SERVEUR_WORKS = await fetch('http://localhost:5678/api/works');// Recup données "works" sur le serveur
export const LISTE_PROJETS = await RETOUR_SERVEUR_WORKS.json();// Transformation en format utilisable (JSON)
const RETOUR_SERVEUR_CATEGORIES = await fetch('http://localhost:5678/api/categories');// Recup données "catégories" sur le serveur
export const LISTE_CATEGORIES = await RETOUR_SERVEUR_CATEGORIES.json();// Transformation en format utilisable (JSON)
// ===============================================================================================================================




// _____________GALERIE_____________

const CONTENEUR_GALERIE_DU_HTML = document.querySelector(".gallery");// Ciblage balise HTML class "gallery" pour pouvoir la manipuler

// CONSTRUCTION
export function GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_ALIAS) {
    CONTENEUR_GALERIE_DU_HTML.innerHTML = "";// On vide la galerie (pour enlever les images fixes du HTML)
    for (const PROJET of LISTE_PROJETS_ALIAS) {// Boucle sur chaque projet reçu en argument
        // CREATION CARTE
        const CARTE_PROJET = document.createElement("figure");
        const CARTE_PROJET_IMG = document.createElement("img");
        CARTE_PROJET_IMG.src = PROJET.imageUrl;
        const CARTE_PROJET_LEGENDE = document.createElement("figcaption");
        CARTE_PROJET_LEGENDE.innerText = PROJET.title;
        // ASSEMBLAGE CARTE
        CARTE_PROJET.appendChild(CARTE_PROJET_IMG);// Image dans carte
        CARTE_PROJET.appendChild(CARTE_PROJET_LEGENDE);// Legende dans carte
        CONTENEUR_GALERIE_DU_HTML.appendChild(CARTE_PROJET);// Carte dans galerie
    }
}
// AFFICHAGE
GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);// Affichage galerie une 1ère fois au chargement






// ╔══════════════════════════════════════════════════════════════╗
// ║                  3. GESTION ADMIN / VISITEUR                 ║
// ╚══════════════════════════════════════════════════════════════╝
/* ╔══════════════════════════════╗
// ║      VERIFICATION TOKEN      ║
// ╚══════════════════════════════╝*/
export const TOKEN_OK = window.localStorage.getItem("token");// Verif si token dans l'ARMOIRE

if (!TOKEN_OK) {


    /* ╔══════════════════════════════╗
    // ║      CONTENEUR FILTRES       ║
    // ╚══════════════════════════════╝*/
        const CONTENEUR_DES_FILTRES = document.createElement("div");// =========== CREATION CONTENEUR DES FILTRES ===========
        CONTENEUR_DES_FILTRES.classList.add("conteneur-filtres");// CLASS
        CONTENEUR_GALERIE_DU_HTML.before(CONTENEUR_DES_FILTRES);// Insertion "before" galerie

        const BOUTON_FILTRE_TOUS = document.createElement("button");// =========== Création bouton TOUS ===========
        BOUTON_FILTRE_TOUS.classList.add("btn-filtre");// CLASS
        BOUTON_FILTRE_TOUS.innerText = "Tous"; // Texte
        // =========== ASSEMBLAGE BOUTON DANS CONTENEUR DES FILTRES ===========
        CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_TOUS);
        
        BOUTON_FILTRE_TOUS.addEventListener("click", function () {/** ┌──────────────────────────────┐*/
            GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);           /** │      CLICK BOUTON TOUS       │*/
            console.log("c'est bon");                             /** └──────────────────────────────┘*/
        });

        for (const CATEGORIE of LISTE_CATEGORIES) {// Boucle sur catégorie pour création autres boutons
        const BOUTON_FILTRE_CATEGORIE = document.createElement("button");// =========== CREATION AUTRES BOUTONS ===========
            BOUTON_FILTRE_CATEGORIE.classList.add("btn-filtre");// CLASS
            BOUTON_FILTRE_CATEGORIE.innerText = CATEGORIE.name; // Texte
            // ======== ASSEMBLAGE AUTRES BOUTONS DANS CONTENEUR DES FILTRES ========
            CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_CATEGORIE);

            BOUTON_FILTRE_CATEGORIE.addEventListener("click", function () {             /** ┌──────────────────────────────┐*/
                const LISTE_PROJETS_FILTRES = LISTE_PROJETS.filter(function (PROJET) {  /** │     CLICK AUTRES BOUTONS     │*/
                                                                                        /** └──────────────────────────────┘*/
                    return PROJET.categoryId === CATEGORIE.id;// Filtrage projets qui ont même ID que catégorie bouton (voir doc1)
                });


                /* ╔══════════════════════════════╗
                // ║      AFFICHAGE FILTRé        ║
                // ╚══════════════════════════════╝*/
                GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_FILTRES);// Appel fonction d'affichage avec la liste filtrée            
            });
        }
}