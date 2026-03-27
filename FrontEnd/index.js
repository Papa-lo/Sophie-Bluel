// RECUPERATION DONNEES SERVEUR BACKEND
const RETOUR_SERVEUR_WORKS = await fetch('http://localhost:5678/api/works');// Recup données "works" sur le serveur
export const LISTE_PROJETS = await RETOUR_SERVEUR_WORKS.json();// Transformation en format utilisable (JSON)
const RETOUR_SERVEUR_CATEGORIES = await fetch('http://localhost:5678/api/categories');// Recup données "catégories" sur le serveur
export const LISTE_CATEGORIES = await RETOUR_SERVEUR_CATEGORIES.json();// Transformation en format utilisable (JSON)
// ===============================================================================================================================




// _____________AFFICHAGE_GALERIE_____________
// CIBLAGE
const CONTENEUR_GALERIE_DU_HTML = document.querySelector(".gallery");
// CREATION
export function GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_ALIAS) {
    CONTENEUR_GALERIE_DU_HTML.innerHTML = "";// Vide la galerie
    for (const PROJET of LISTE_PROJETS_ALIAS) {// Boucle sur chaque projet reçu en argument
        // CREATION CARTES
        const CARTE_PROJET = document.createElement("figure");
        const CARTE_PROJET_IMG = document.createElement("img");
        CARTE_PROJET_IMG.src = PROJET.imageUrl;
        const CARTE_PROJET_LEGENDE = document.createElement("figcaption");
        CARTE_PROJET_LEGENDE.innerText = PROJET.title;
        // ASSEMBLAGE
        CARTE_PROJET.appendChild(CARTE_PROJET_IMG);// Image dans carte
        CARTE_PROJET.appendChild(CARTE_PROJET_LEGENDE);// Legende dans carte
        CONTENEUR_GALERIE_DU_HTML.appendChild(CARTE_PROJET);// Carte dans galerie
    }
}
// AFFICHAGE INITIAL AU CHARGEMENT DE LA PAGE
GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);// Affichage galerie une 1ère fois au chargement





// _____________FILTRES_____________
export const TOKEN_OK = window.localStorage.getItem("token");// Verif si token dans localstorage

if (!TOKEN_OK) {//Si non connecté : AFFICHAGE DES FILTRES :

        const CONTENEUR_DES_FILTRES = document.createElement("div");//CREATION CONTENEUR DES FILTRES
        CONTENEUR_DES_FILTRES.classList.add("conteneur-filtres");
        CONTENEUR_GALERIE_DU_HTML.before(CONTENEUR_DES_FILTRES);// Insertion "before" galerie

        //BOUTON TOUS
        const BOUTON_FILTRE_TOUS = document.createElement("button");
        BOUTON_FILTRE_TOUS.classList.add("btn-filtre");
        BOUTON_FILTRE_TOUS.innerText = "Tous";
        CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_TOUS);
        
        BOUTON_FILTRE_TOUS.addEventListener("click", function () {//CLICK
            GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);
        });

        //BOUTONS CATEGORIES
        for (const CATEGORIE of LISTE_CATEGORIES) {
        const BOUTON_FILTRE_CATEGORIE = document.createElement("button");
            BOUTON_FILTRE_CATEGORIE.classList.add("btn-filtre");
            BOUTON_FILTRE_CATEGORIE.innerText = CATEGORIE.name;
            CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_CATEGORIE);

            BOUTON_FILTRE_CATEGORIE.addEventListener("click", function () {//CLICK
                const LISTE_PROJETS_FILTRES = LISTE_PROJETS.filter(function (PROJET) {
                    return PROJET.categoryId === CATEGORIE.id;
                });

                //AFFICHAGE FILTRé
                GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_FILTRES);// Appel fonction d'affichage avec la liste filtrée            
            });
        }
}