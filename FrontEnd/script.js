// ╔══════════════════════════════════════════════════════════════╗
// ║            1. RÉCUPÉRATION DES DONNÉES (BACKEND)             ║
// ╚══════════════════════════════════════════════════════════════╝
const RETOUR_SERVEUR_WORKS = await fetch('http://localhost:5678/api/works');// Recup données "works" sur le serveur
const LISTE_PROJETS = await RETOUR_SERVEUR_WORKS.json();// Transformation en format utilisable (JSON)
console.log(LISTE_PROJETS);// Vérification console de reception des données

const RETOUR_SERVEUR_CATEGORIES = await fetch('http://localhost:5678/api/categories');// Recup données "catégories" sur le serveur
const LISTE_CATEGORIES = await RETOUR_SERVEUR_CATEGORIES.json();// Transformation en format utilisable (JSON)
console.log(LISTE_CATEGORIES);// Vérification console de reception des données

// ╔══════════════════════════════════════════════════════════════╗
// ║                        2. GALERIE                            ║
// ╚══════════════════════════════════════════════════════════════╝
/* ╔══════════════════════════════╗
// ║        CIBLAGE GALERIE       ║
// ╚══════════════════════════════╝*/
const CONTENEUR_GALERIE_DU_HTML = document.querySelector(".gallery");// Ciblage balise HTML avec class "gallery" pour pouvoir la manipuler

/* ╔══════════════════════════════╗
// ║     CONSTRUCTION GALERIE     ║
// ╚══════════════════════════════╝*/
function GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_ALIAS) {

    CONTENEUR_GALERIE_DU_HTML.innerHTML = "";// On vide la galerie (pour enlever les images fixes du HTML)

    for (const PROJET of LISTE_PROJETS_ALIAS) {// Boucle sur chaque projet reçu en argument        
        const CARTE_PROJET = document.createElement("figure");// =========== CREATION CARTE ===========
        const CARTE_PROJET_IMG = document.createElement("img");// Création <img>
        CARTE_PROJET_IMG.src = PROJET.imageUrl;
        const CARTE_PROJET_LEGENDE = document.createElement("figcaption");// Création Texte
        CARTE_PROJET_LEGENDE.innerText = PROJET.title;
        // =========== ASSEMBLAGE CARTE ===========
        CARTE_PROJET.appendChild(CARTE_PROJET_IMG);// Image dans carte
        CARTE_PROJET.appendChild(CARTE_PROJET_LEGENDE);// Legende dans carte
        CONTENEUR_GALERIE_DU_HTML.appendChild(CARTE_PROJET);// Carte dans galerie
    }
}
/* ╔══════════════════════════════╗
// ║      AFFICHAGE GALERIE       ║
// ╚══════════════════════════════╝*/
GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);// Affichage galerie une 1ère fois au chargement


// ╔══════════════════════════════════════════════════════════════╗
// ║                  3. GESTION ADMIN / VISITEUR                 ║
// ╚══════════════════════════════════════════════════════════════╝
/* ╔══════════════════════════════╗
// ║      VERIFICATION TOKEN      ║
// ╚══════════════════════════════╝*/
const TOKEN_OK = window.localStorage.getItem("token");// Verif si token dans l'ARMOIRE

if (TOKEN_OK) { // Si on a trouvé un token dans l'armoire...
    console.log("Admin connecté !"); // ...on le signale dans la console

    MODE_ADMIN_ACTIVE(); // Appel fonction d'affichage Admin (PLUS BAS DANS LES LIGNES)

} else {// ======== Mode visiteur ========
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

// ╔══════════════════════════════════════════════════════════════╗
// ║               4. FONCTION MODE ADMIN ACTIVE                  ║
// ╚══════════════════════════════════════════════════════════════╝
function MODE_ADMIN_ACTIVE() {// Fonction d'affichage pour le mode Administrateur
    
    /* ╔══════════════════════════════╗
    // ║      CIBLAGE LIEN LOGIN      ║
    // ╚══════════════════════════════╝*/
    const LIEN_LOGIN = document.querySelector("nav li:nth-child(3) a");
    
    LIEN_LOGIN.innerText = "logout"; // Change le texte en "logout"
    LIEN_LOGIN.addEventListener("click", function (event) { /** ┌──────────────────────────────┐*/
                                                            /** │       CLICK LIEN LOGIN       │*/
                                                            /** └──────────────────────────────┘*/
        event.preventDefault(); // On empêche la navigation vers la page login.html
        window.localStorage.removeItem("token"); // On efface le token de l'armoire
        window.location.href = "index.html"; // On recharge la page d'accueil ======== (retour visiteur) ========
    });

    /* ╔══════════════════════════════╗
    // ║    CREATION BANDEAU ADMIN    ║
    // ╚══════════════════════════════╝*/
    const BANDEAU_MODE_EDITION = document.createElement("div");// CREATION <div>
    BANDEAU_MODE_EDITION.classList.add("admin-bar");// CLASS
    BANDEAU_MODE_EDITION.innerText = "Mode édition";// Texte
    // ======== ASSEMBLAGE BANDEAU DANS BODY ========
    document.body.prepend(BANDEAU_MODE_EDITION);//Insertion tout en haut de body

        /* ╔══════════════════════════════╗
        // ║ CIBLAGE TITRE "MES PROJETS"  ║
        // ╚══════════════════════════════╝*/
    const TITRE_PROJETS_DU_HTML = document.querySelector("#portfolio h2");

    const TITRE_CONTENEUR = document.createElement("div");// =========== CREATION CONTENEUR TITRE & BOUTON ===========
    TITRE_CONTENEUR.classList.add("titre-projets-container");// Ajout class
    // =========== ASSEMBLAGE AVANT TITRE "MES PROJETS" ===========
    TITRE_PROJETS_DU_HTML.before(TITRE_CONTENEUR);//Insertion juste avant le h2
    // =========== ASSEMBLAGE TITRE "MES PROJETS" DANS CONTENEUR TITRES & BOUTON ===========
    TITRE_CONTENEUR.appendChild(TITRE_PROJETS_DU_HTML);// On met le h2 dans le conteneur

    const BOUTON_OUVRIR_MODALE = document.createElement("button");// =========== CREATION DU BOUTON MODIFIER ===========
    BOUTON_OUVRIR_MODALE.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;//Ajout stylo et texte
    BOUTON_OUVRIR_MODALE.classList.add("modif-button"); // CLASS
    // ======== ASSEMBLAGE BOUTON DANS CONTENEUR TITRE & BOUTON
    TITRE_CONTENEUR.appendChild(BOUTON_OUVRIR_MODALE);
    
    BOUTON_OUVRIR_MODALE.addEventListener("click", function () {/** ┌──────────────────────────────┐*/
                                                                /** │    CLICK BOUTON MODIFIER     │*/
                                                                /** └──────────────────────────────┘*/
        OUVRIR_MODALE();
    })
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                  5. FONCTION OUVRIR MODALE                   ║
// ╚══════════════════════════════════════════════════════════════╝
function OUVRIR_MODALE() {
    /* ╔═══════════════════════════════╗
    // ║        CREATION FOND          ║
    // ╚═══════════════════════════════╝*/
    const CONTENEUR_FOND_MODALE = document.createElement("div");
    CONTENEUR_FOND_MODALE.classList.add("modal-overlay");//CLASS
    /* ╔═══════════════════════════════╗
    // ║CREATION BOITE BLANCHE (MODALE)║
    // ╚═══════════════════════════════╝*/
    const BOITE_MODALE = document.createElement("div");
    BOITE_MODALE.classList.add("modal-box");//CLASS
    /* ╔═══════╗
    // ║CONTENU║
    // ╚═══════╝*/
    const BOUTON_FLECHE_RETOUR = document.createElement("span");// Création <span>
    BOUTON_FLECHE_RETOUR.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';// Icône flèche gauche
    BOUTON_FLECHE_RETOUR.classList.add("modal-arrow");// CLASS
    const TITRE_BOITE_MODALE = document.createElement("h3");// Titre
    TITRE_BOITE_MODALE.innerText = "Galerie photo";// Texte
    const BOUTON_FERMER_MODALE = document.createElement("span");// ======== BOUTON FERMER ========
    BOUTON_FERMER_MODALE.innerText = "x";//Texte
    BOUTON_FERMER_MODALE.classList.add("modal-close");// CLASS

    const CONTENEUR_GALERIE_MODALE = document.createElement("div");// ======== CREATION GALERIE DES CARTES ========
    CONTENEUR_GALERIE_MODALE.classList.add("modal-gallery");// CLASS
    for (const PROJET of LISTE_PROJETS) {// On boucle sur tous les projets

        const CARTE_PROJET_MODALE = document.createElement("div");// ======== CREATION CARTE ========
        CARTE_PROJET_MODALE.classList.add("modal-image-container");// CLASS
        const CARTE_PROJET_MODALE_IMG = document.createElement("img");// Création <img>
        CARTE_PROJET_MODALE_IMG.src = PROJET.imageUrl;

        const ICONE_POUBELLE = document.createElement("i");// ======== CREATION ICONE POUBELLE ========
        ICONE_POUBELLE.classList.add("fa-solid", "fa-trash-can");// CLASS
        ICONE_POUBELLE.classList.add("icone-suppr");// CLASS
        /** ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
        ICONE_POUBELLE.addEventListener("click", async function () {/** ┌──────────────────────────────┐*/
                                                                    /** │    CLICK BOUTON POUBELLE     │*/
                                                                    /** └──────────────────────────────┘*/                                                                    
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + PROJET.id, {// Envoi demande de suppression à l'API
                method: "DELETE",
                headers: { Authorization: "Bearer " + TOKEN_OK }// Identification obligatoire avec token
            });
            if (REPONSE_SUPPRESSION.status === 204) {// Vérif si ça a marché (Code 204 = suppression OK)
                CARTE_PROJET_MODALE.remove();                
                const INDEX_PROJET = LISTE_PROJETS.findIndex(projet => projet.id === PROJET.id);// On trouve l'index du projet dans la liste pour le retirer
                LISTE_PROJETS.splice(INDEX_PROJET, 1); // On le coupe de la liste

                GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);//  --- RAFRAICHISSEMENT GALERIE AVEC LISTE A JOUR ---
            }
        });
        /** ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
        // =========== ASSEMBLAGE IMAGE DANS CARTE ===========
        CARTE_PROJET_MODALE.appendChild(CARTE_PROJET_MODALE_IMG);
        // =========== ASSEMBLAGE POUBELLE DANS CARTE ===========
        CARTE_PROJET_MODALE.appendChild(ICONE_POUBELLE);
        // =========== ASSEMBLAGE CARTE DANS GRILLE ===========
        CONTENEUR_GALERIE_MODALE.appendChild(CARTE_PROJET_MODALE);
    }


    // test
    const LIGNE_GRISE = document.createElement("div");
    LIGNE_GRISE.classList.add("lignegrise");
    BOITE_MODALE.appendChild(LIGNE_GRISE);





    // =========== ASSEMBLAGE BOITE BLANCHE ===========
    BOITE_MODALE.appendChild(BOUTON_FLECHE_RETOUR);// --- ASSEMBLAGE ---Met la croix, la fleche retour et le titre DANS la grande boîte blanche
    BOITE_MODALE.appendChild(BOUTON_FERMER_MODALE);// Met la fleche de retour
    BOITE_MODALE.appendChild(TITRE_BOITE_MODALE);// Met le titre
    BOITE_MODALE.appendChild(CONTENEUR_GALERIE_MODALE);// Met la GRILLE
    CONTENEUR_FOND_MODALE.appendChild(BOITE_MODALE);// MET LA BOITE BLANCHE "DANS" LE FOND
    document.body.appendChild(CONTENEUR_FOND_MODALE);// ======== MET LE FOND DANS LE BODY ========

    BOUTON_FERMER_MODALE.addEventListener("click", function () {/** ┌──────────────────────────────┐*/
                                                                /** │      CLICK BOUTON CROIX      │*/
                                                                /** └──────────────────────────────┘*/
        CONTENEUR_FOND_MODALE.remove();// Suppression fond (et donc la modale) du body
    });

    CONTENEUR_FOND_MODALE.addEventListener("click", function (event) {  /** ┌──────────────────────────────┐*/
                                                                        /** │         CLICK A COTE         │*/
                                                                        /** └──────────────────────────────┘*/
        if (event.target === CONTENEUR_FOND_MODALE) {// Si on clique bien sur le fond (et pas sur la boîte blanche)
            CONTENEUR_FOND_MODALE.remove();// Suppression fond
        }
    });
   
    /* ╔═══════════════════════════════╗
    // ║    BOUTON AJOUTER UNE PHOTO   ║
    // ╚═══════════════════════════════╝*/
    const BOUTON_AJOUTER_PHOTO = document.createElement("button");// ======== CREATION BOUTON "AJOUTER UNE PHOTO" ========
    BOUTON_AJOUTER_PHOTO.innerText = "Ajouter une photo";// Texte
    BOUTON_AJOUTER_PHOTO.classList.add("btn-ajout-photo"); // CLASS
    // ======== ASSEMBLAGE BOUTON DANS BOITE BLANCHE ========
    BOITE_MODALE.appendChild(BOUTON_AJOUTER_PHOTO);

    /* ╔═══════════════════════════════╗
    // ║    CREATION VUE FORMULAIRE    ║
    // ╚═══════════════════════════════╝*/
    const CONTENEUR_FORMULAIRE_MODALE = document.createElement("div");// Création <div>
    CONTENEUR_FORMULAIRE_MODALE.classList.add("vue-formulaire");// CLASS
    CONTENEUR_FORMULAIRE_MODALE.style.display = "none"; // ======== STYLE : CACHé ! ========
    BOUTON_FLECHE_RETOUR.style.display = "none"; // ======== STYLE FLECHE : CACHé ! ========
    // Contenu "statique" (ne bouge pas). Juste besoin de l'afficher. Pas besoin de variable.Plus rapide d'écrire le HTML d'un coup comme ça !
        CONTENEUR_FORMULAIRE_MODALE.innerHTML = `
        <div class="champ-image">
            <img src="./assets/icons/picture-svgrepo-com 1.png" class="icone-placeholder" alt="Icône image">
            <input type="file" id="image-input" accept="image/*" required>
            <label for="image-input">+ Ajouter photo</label>
            <img id="preview-image" src="" alt="" style="display:none; max-width:100px;">
            <h6>jpg, png : 4mo max</h6>
        </div>

        <label for="title-input">Titre</label> <!-- CORRECTION : for="title-input" -->
        <input type="text" id="title-input" required>
        <label for="category-input">Catégorie</label> <!-- CORRECTION : for="category-input" -->
        <select id="category-input"></select>
        <button id="btn-valider">Valider</button>
    `;
    // ======== ASSEMBLAGE FORMULAIRE DANS BOITE BLANCHE ========
    BOITE_MODALE.appendChild(CONTENEUR_FORMULAIRE_MODALE);


    // ╔══════════════════════════════════════════════════════════════╗
    // ║                  6. GESTION APERCU IMAGE                     ║
    // ╚══════════════════════════════════════════════════════════════╝
    /* ╔═══════════════════════════════╗
    // ║         CIBLAGE INPUT         ║
    // ╚═══════════════════════════════╝*/
    const INPUT_SELECTION_IMAGE = document.getElementById("image-input");// CIBLAGE choisie par l'utilisateur
    const APERCU_IMAGE = document.getElementById("preview-image");// CIBLAGE future image
    const ICONE_PAR_DEFAUT = document.querySelector(".icone-placeholder");// CIBLAGE Icone paysage
    const BOUTON_LABEL_CHOISIR_PHOTO = document.querySelector("label[for='image-input']");// CIBLAGE Bouton AJOUTER PHOTO

    /* ╔═══════════════════════════════╗
    // ║   EVENEMENT CHANGEMENT IMAGE  ║
    // ╚═══════════════════════════════╝*/
    INPUT_SELECTION_IMAGE.addEventListener("change", function (event) {  /** ┌──────────────────────────────┐*/
                                                                         /** │  SELECTION IMAGE par USER    │*/
                                                                         /** └──────────────────────────────┘*/
        const IMAGE_CHOISIE_PAR_USER = event.target.files[0];// Recuperation fichier sélectionné ??????????????????????????????????????????????????????????????
        if (IMAGE_CHOISIE_PAR_USER) {// Si un fichier est détecté
            const LECTEUR_DE_FICHIER = new FileReader();// Outil pour lire le fichier
            LECTEUR_DE_FICHIER.onload = function(e) {// Quand la lecture est finie...

                ICONE_PAR_DEFAUT.style.display = "none"; // On cache l'icône paysage
                BOUTON_LABEL_CHOISIR_PHOTO.style.display = "none"; // On cache le bouton "Ajouter photo"
                APERCU_IMAGE.style.width = "100%"; // L'image prend toute la largeur
                APERCU_IMAGE.style.height = "100%"; // L'image prend toute la hauteur
                APERCU_IMAGE.style.objectFit = "contain"; // L'image remplit sans être déformée
                APERCU_IMAGE.style.maxWidth = "none";

                APERCU_IMAGE.src = e.target.result; // On charge l'aperçu
                APERCU_IMAGE.style.display = "block"; // On l'affiche
            };
            LECTEUR_DE_FICHIER.readAsDataURL(IMAGE_CHOISIE_PAR_USER);// On lance la lecture du fichier
        }
    });// ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

    /* ╔══════════════════════════════╗
    // ║   BOUTONS NAVIGATION MODALE  ║
    // ╚══════════════════════════════╝*/
    document.getElementById("btn-valider").addEventListener("click", ENVOYER_NOUVEAU_PROJET);/** ┌──────────────────────────────┐*/
                                                                                             /** │    CLICK BOUTON VALIDER      │*/
                                                                                             /** └──────────────────────────────┘*/

    BOUTON_AJOUTER_PHOTO.addEventListener("click", function () {/** ┌──────────────────────────────┐*/
                                                                /** │   CLICK "AJOUTER PHOTO"      │*/
                                                                /** └──────────────────────────────┘*/
        TITRE_BOITE_MODALE.innerText = "Ajout photo";
        CONTENEUR_GALERIE_MODALE.style.display = "none"; // On cache la galerie
        BOUTON_AJOUTER_PHOTO.style.display = "none"; // On cache le bouton ajouter
        CONTENEUR_FORMULAIRE_MODALE.style.display = ""; // On affiche le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "block"; // On affiche la fleche de retour

        const MENU_CHOIX_CATEGORIE = document.getElementById("category-input");// --- REMPLISSAGE DU MENU DÉROULANT ---
        MENU_CHOIX_CATEGORIE.innerHTML = ""; // On vide avant de remplir
        for (const CATEGORIE_MENU of LISTE_CATEGORIES) {
            const CHOIX_MENU = document.createElement("option");
            CHOIX_MENU.value = CATEGORIE_MENU.id; // L'ID est envoyé à l'API
            CHOIX_MENU.innerText = CATEGORIE_MENU.name;
            MENU_CHOIX_CATEGORIE.appendChild(CHOIX_MENU);
        }
    });

    BOUTON_FLECHE_RETOUR.addEventListener("click", function () {/** ┌──────────────────────────────┐*/
                                                                /** │     CLICK FLECHE RETOUR      │*/
                                                                /** └──────────────────────────────┘*/
        TITRE_BOITE_MODALE.innerText = "Galerie photo";
        CONTENEUR_GALERIE_MODALE.style.display = ""; // On laisse le CSS s'occupper de l'affichage
        BOUTON_AJOUTER_PHOTO.style.display = "block"; // On affiche le bouton ajouter
        CONTENEUR_FORMULAIRE_MODALE.style.display = "none"; // On cache le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "none"; // On cache la fleche de retour
        INPUT_SELECTION_IMAGE.value = "";// Vide l'image choisie
        APERCU_IMAGE.style.display = "none";// Cache son apperçu
        ICONE_PAR_DEFAUT.style.display = "block";// Réafficher l'aperçu
        BOUTON_LABEL_CHOISIR_PHOTO.style.display = "inline-block";// Réafficher le bouton
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║             7. FONCTION ENVOYER NOUVEAU PROJET               ║
// ╚══════════════════════════════════════════════════════════════╝
async function ENVOYER_NOUVEAU_PROJET() {
    
    const CHAMP_IMAGE = document.getElementById("image-input");// Récupération des valeurs du formulaire
    const CHAMP_TITRE = document.getElementById("title-input");
    const CHAMP_CATEGORIE = document.getElementById("category-input");

    if (!CHAMP_IMAGE.files[0] || !CHAMP_TITRE.value) {// Tout est rempli ? Si PAS de fichier sélectionné OU Si PAS de texte dans le titre
        alert("Veuillez remplir tous les champs");
        return;// Alors on arrête LA FONCTION immédiatement
    }
    
    const ENVELOPPE_FORM_DATA = new FormData();// Préparation données pour l'API (FormData est obligatoire pour les fichiers)
    // //FormData c'est un conteneur spécial :
    // (capable de contenir à la fois du texte ET des fichiers lourds)
    ENVELOPPE_FORM_DATA.append("image", CHAMP_IMAGE.files[0]);
    ENVELOPPE_FORM_DATA.append("title", CHAMP_TITRE.value);
    ENVELOPPE_FORM_DATA.append("category", CHAMP_CATEGORIE.value);

    const RETOUR_SERVEUR_AJOUT = await fetch("http://localhost:5678/api/works", {// Envoi à l'API : On envoie les données et on attend la réponse (await)
        method: "POST",
        headers: {// Configuration de l'en-tête de la requête
            // "Authorization" : Preuve qu'on est admin (Token requis)
            // "Bearer" : Type d'authentification standard
            "Authorization": "Bearer " + TOKEN_OK
            // PAS de Content-Type ici ! Le navigateur le met tout seul avec FormData
        },
        body: ENVELOPPE_FORM_DATA// Corps de la requête : notre enveloppe avec image, titre, catégorie
    });

    if (RETOUR_SERVEUR_AJOUT.status === 201) {
        console.log("Projet ajouté avec succès !");

        // ======== LOGIQUE POUR RAFRAICHIR LA GALERIE ========
        const NOUVEAU_PROJET_CREE = await RETOUR_SERVEUR_AJOUT.json();// Récupération des infos du projet créé
        LISTE_PROJETS.push(NOUVEAU_PROJET_CREE); // On ajoute le projet à la liste principale (mémoire)
        GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS); // --- RAFRAICHISSEMENT GALERIE AVEC LISTE A JOUR ---

        // ======== MISE À JOUR DE LA MODALE ========   
        const NOUVELLE_CARTE_MODALE = document.createElement("figure");// Création nouvelle carte pour la modale (comme dans la boucle)
        NOUVELLE_CARTE_MODALE.classList.add("modal-image-container");
        const NOUVELLE_IMAGE_MODALE = document.createElement("img");
        NOUVELLE_IMAGE_MODALE.src = NOUVEAU_PROJET_CREE.imageUrl;
        const NOUVELLE_POUBELLE = document.createElement("i");// Création nouvelle poubelle pour la modale
        NOUVELLE_POUBELLE.classList.add("fa-solid", "fa-trash-can", "icone-suppr");
        
        NOUVELLE_POUBELLE.addEventListener("click", async function () { /** ┌──────────────────────────────┐*/
                                                                        /** │   CLICK NOUVELLE POUBELLE    │*/
                                                                        /** └──────────────────────────────┘*/
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + NOUVEAU_PROJET_CREE.id, {// Demande de suppression à l'API
                method: "DELETE",
                headers: { Authorization: "Bearer " + TOKEN_OK }
            });

            if (REPONSE_SUPPRESSION.status === 204) {// Si ça a marché, on retire l'image de l'écran
                NOUVELLE_CARTE_MODALE.remove(); // Auto-suppression de la carte
            }
        });
        // ======== ASSEMBLAGE NOUVELLE CARTE ========
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_IMAGE_MODALE);// Assemblage nouvelle carte
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_POUBELLE);
        
        document.querySelector(".modal-gallery").appendChild(NOUVELLE_CARTE_MODALE);// ON LA COLLE DANS LA GALERIE DE LA MODALE (EN UTILISANT LA CLASSE CSS POUR LA RETROUVER)

    } else {
        console.log("Erreur lors de l'ajout");
    }
}
