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
    // --- CRÉATION DE LA BANDE NOIRE DU HAUT ---
    const BANDE_NOIRE_ADMIN = document.createElement("div");//Création balise pour bande noire
    BANDE_NOIRE_ADMIN.classList.add("admin-bar");//Ajout class pour style
    BANDE_NOIRE_ADMIN.innerText = "Mode édition";//Ajout texte dedans
    document.body.prepend(BANDE_NOIRE_ADMIN);//Insertion tout en haut de body
    console.log("Bande noire créée !");
    console.log("Fonction Admin activée");

    // --- CRÉATION DU BOUTON "MODIFIER" ---    
    const BOUTON_MODIFIER = document.createElement("button");// Création du bouton
    BOUTON_MODIFIER.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;//Ajout stylo et texte
    BOUTON_MODIFIER.classList.add("modif-button"); //Ajoute la class
    const TITRE_PROJETS = document.querySelector("#portfolio h2");//Ciblage h2 "Mes Projets"
    TITRE_PROJETS.after(BOUTON_MODIFIER);//Insertion juste après ce h2

    // --- OUVERTURE DE LA MODALE ---
    BOUTON_MODIFIER.addEventListener("click", function() {//Ecoute du click
        OUVRIR_MODALE();
    })
}

// ============================================================
// GESTION DE LA MODALE
// ============================================================

    

function OUVRIR_MODALE() {
    // --- 1. CRÉATION DU FOND (OVERLAY) ---
    const FOND_MODALE = document.createElement("div");
    FOND_MODALE.classList.add("modal-overlay");//class pour style
    // --- 2. CRÉATION DE LA BOÎTE BLANCHE ---
    const BOITE_MODALE = document.createElement("div");
    BOITE_MODALE.classList.add("modal-box");//class pour style
    // --- 3. CRÉATION DU CONTENU ---
    const BOUTON_FERMER = document.createElement("span");//bouton fermer
    BOUTON_FERMER.innerText = "x";
    BOUTON_FERMER.classList.add("modal-close");
    // --- TITRE ---
    const TITRE_MODALE = document.createElement("h3");
    TITRE_MODALE.innerText = "Galerie photo";

    // On crée le conteneur pour les images :
    const GRILLE_MODALE = document.createElement("div");
    GRILLE_MODALE.classList.add("modal-gallery"); // Classe pour le CSS
        // On boucle sur tous les projets :
    for (const PROJET of LISTE_PROJETS) {
        
        // On crée une BOÎTE pour l'image et la poubelle
        const BOITE_IMAGE = document.createElement("div");
        BOITE_IMAGE.classList.add("modal-image-container"); // Pour le CSS

        // On crée une image
        const IMAGE_MODALE = document.createElement("img");
        IMAGE_MODALE.src = PROJET.imageUrl; // L'URL de l'image

        // 3. On crée l'icône poubelle
        const ICONE_POUBELLE = document.createElement("i");
        ICONE_POUBELLE.classList.add("fa-solid", "fa-trash-can"); // Classes Font Awesome
        ICONE_POUBELLE.classList.add("icone-suppr"); // Classe pour le CSS

        
        // --- SUPPRESSION ---

        // ICONE_POUBELLE.addEventListener("click", async function() {
        //     // On vérifie si on capte bien le clic et l'ID du projet
        //     console.log("Clic poubelle sur le projet ID :", PROJET.id);

        //     // 1. On envoie la demande de suppression à l'API
        //     const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + PROJET.id, {
        //         method: "DELETE",
        //         // 2. On s'identifie avec le token (obligatoire)
        //         headers: { Authorization: "Bearer " + TOKEN_STOCKE }
        //     });
        //     // 3. On vérifie si ça a marché (Code 204 = suppression OK)
        //     if (REPONSE_SUPPRESSION.status === 204) {
        //         console.log("Projet supprimé de l'API !");
        //     }
        // });

        // 4. On assemble : Image et Poubelle DANS la Boîte
        BOITE_IMAGE.appendChild(IMAGE_MODALE);
        BOITE_IMAGE.appendChild(ICONE_POUBELLE);
        
        // On colle la boite DANS la grille
        GRILLE_MODALE.appendChild(BOITE_IMAGE);
    }
    // --- 4. ASSEMBLAGE ---Met la croix et le titre DANS la boîte
    BOITE_MODALE.appendChild(BOUTON_FERMER);
    BOITE_MODALE.appendChild(TITRE_MODALE);
    // On ajoute la grille DANS la boîte (après le titre)
    BOITE_MODALE.appendChild(GRILLE_MODALE);
    // On met la boîte DANS le fond
    FOND_MODALE.appendChild(BOITE_MODALE);
    // On met le fond DANS le body
    document.body.appendChild(FOND_MODALE);

        // --- 5. FERMETURE DE LA MODALE ---
    // On écoute le clic sur la croix pour fermer
    BOUTON_FERMER.addEventListener("click", function() {
        // On retire le fond (et donc la modale) du body
        FOND_MODALE.remove();
    });

        // --- 6. FERMETURE EN CLIQUANT À CÔTÉ ---
    // On écoute le clic sur le fond gris
    FOND_MODALE.addEventListener("click", function(event) {
        // Si on clique bien sur le fond (et pas sur la boîte blanche)
        if (event.target === FOND_MODALE) {
            // On retire le fond
            FOND_MODALE.remove();
        }
    });

    //===================================================================================
    //tentative de réparation des conneries de Z (dans la fonction OUVRIR_MODALE)!!!!!!!!
    //===================================================================================
        // --- AJOUT DU BOUTON "AJOUTER UNE PHOTO" ---
    const BOUTON_AJOUTER = document.createElement("button");
    BOUTON_AJOUTER.innerText = "Ajouter une photo";
    BOUTON_AJOUTER.classList.add("btn-ajout-photo"); // Classe CSS à styliser plus tard
    BOITE_MODALE.appendChild(BOUTON_AJOUTER);

    // --- CRÉATION DE LA VUE FORMULAIRE (Cachée par défaut) ---
    const VUE_FORMULAIRE = document.createElement("div");
    VUE_FORMULAIRE.classList.add("vue-formulaire");
    VUE_FORMULAIRE.style.display = "none"; // Caché au début

    // Contenu du formulaire (simplifié pour l'instant)
    VUE_FORMULAIRE.innerHTML = `
        <div class="champ-image">
            <input type="file" id="image-input" accept="image/*" required>
            <label for="image-input">+ Ajouter photo</label>
            <img id="preview-image" src="" alt="" style="display:none; max-width:100px;">
        </div>
        <label for="title">Titre</label>
        <input type="text" id="title-input" required>
        <label for="category">Catégorie</label>
        <select id="category-input"></select>
        <button id="btn-valider">Valider</button>
    `;
    BOITE_MODALE.appendChild(VUE_FORMULAIRE);

    // --- ÉCOUTEUR DU BOUTON VALIDER (Ajouté une seule fois) ---
    document.getElementById("btn-valider").addEventListener("click", ENVOYER_NOUVEAU_PROJET);

    // --- LOGIQUE DE BASCULE (Galerie <-> Formulaire) ---
    BOUTON_AJOUTER.addEventListener("click", function() {
        GRILLE_MODALE.style.display = "none"; // On cache la galerie
        BOUTON_AJOUTER.style.display = "none"; // On cache le bouton ajouter
        VUE_FORMULAIRE.style.display = "block"; // On affiche le formulaire
        
        // On remplit le select des catégories dynamiquement
        const SELECT_CATEGORIE = document.getElementById("category-input");
        SELECT_CATEGORIE.innerHTML = ""; // On vide avant de remplir
        for (const CAT of LISTE_CATEGORIES) {
            const OPTION = document.createElement("option");
            OPTION.value = CAT.id; // L'ID est important pour l'API
            OPTION.innerText = CAT.name;
            SELECT_CATEGORIE.appendChild(OPTION);
        }
    });
}

//================================================================================================
// Suite de la tentative de reparation des conneries de Z (en dehors de la fonction OUVRIR_MODALE)
//================================================================================================
// ============================================================
// FONCTION D'ENVOI DU NOUVEAU PROJET
// ============================================================
async function ENVOYER_NOUVEAU_PROJET() {
    // 1. Récupérer les valeurs du formulaire
    const INPUT_IMAGE = document.getElementById("image-input");
    const INPUT_TITRE = document.getElementById("title-input");
    const INPUT_CATEGORIE = document.getElementById("category-input");

    // Vérification simple : est-ce que tout est rempli ?
    if (!INPUT_IMAGE.files[0] || !INPUT_TITRE.value) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    // 2. Préparer les données pour l'API (FormData est obligatoire pour les fichiers)
    const FORM_DATA = new FormData();
    FORM_DATA.append("image", INPUT_IMAGE.files[0]);
    FORM_DATA.append("title", INPUT_TITRE.value);
    FORM_DATA.append("category", INPUT_CATEGORIE.value);

    // 3. Envoyer à l'API
    const REPONSE = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + TOKEN_STOCKE
            // PAS de Content-Type ici ! Le navigateur le met tout seul avec FormData
        },
        body: FORM_DATA
    });

    if (REPONSE.status === 201) {
        console.log("Projet ajouté avec succès !");
        // AJOUTER ICI LA LOGIQUE POUR RAFRAICHIR LA GALERIE (Etape 8.2)
    } else {
        console.log("Erreur lors de l'ajout");
    }
}
