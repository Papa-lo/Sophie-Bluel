// ============================================================
// RÉCUPÉRATION DES DONNÉES (BACKEND)
// ============================================================

const RETOUR_SERVEUR_WORKS = await fetch('http://localhost:5678/api/works');// Recup données "works" sur le serveur
const LISTE_PROJETS = await RETOUR_SERVEUR_WORKS.json();// Transformation en format utilisable (JSON)
console.log(LISTE_PROJETS);// Vérification console de reception des données

const RETOUR_SERVEUR_CATEGORIES = await fetch('http://localhost:5678/api/categories');// Recup données "catégories" sur le serveur
const LISTE_CATEGORIES = await RETOUR_SERVEUR_CATEGORIES.json();// Transformation en format utilisable (JSON)
console.log(LISTE_CATEGORIES);// Vérification console de reception des données

// ============================================================
// AFFICHAGE DE LA GALERIE
// ============================================================

const CONTENEUR_GALERIE_DU_HTML = document.querySelector(".gallery");// Ciblage balise HTML avec class "gallery" pour pouvoir la manipuler

function GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_ALIAS) {// Fonction générer images dynamiquement

    CONTENEUR_GALERIE_DU_HTML.innerHTML = "";// On vide la galerie (pour enlever les images fixes du HTML)
    
    for (const PROJET of LISTE_PROJETS_ALIAS) {// Boucle sur chaque projet reçu en argument
        
        const CARTE_PROJET = document.createElement("figure");// Création balise <figure>

        const CARTE_PROJET_IMG = document.createElement("img");// Création balise <img>
        CARTE_PROJET_IMG.src = PROJET.imageUrl;// Image associée

        const CARTE_PROJET_LEGENDE = document.createElement("figcaption");// Création legende
        CARTE_PROJET_LEGENDE.innerText = PROJET.title;// Texte associée

        CARTE_PROJET.appendChild(CARTE_PROJET_IMG);// Assemblage : image dans figure
        CARTE_PROJET.appendChild(CARTE_PROJET_LEGENDE);// Assemblage legende dans figure

        CONTENEUR_GALERIE_DU_HTML.appendChild(CARTE_PROJET);// Assemblage figure dans galerie
    }
}

GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);// Affichage galerie une 1ère fois au chargement

// ============================================================
// GESTION ADMIN / VISITEUR
// ============================================================
// ARMOIRE : localStorage de windows ???
const TOKEN_OK = window.localStorage.getItem("token");// Verif si token dans l'ARMOIRE

if (TOKEN_OK) { // Si on a trouvé un token dans l'armoire...
    console.log("Admin connecté !"); // ...on le signale dans la console

    MODE_ADMIN_ACTIVE(); // Appel fonction d'affichage Admin (PLUS BAS DANS LES LIGNES)

} else {// Sinon, on est en mode visiteur (donc affiche les filtres)
    const CONTENEUR_DES_FILTRES = document.createElement("div");// Création balise <div> "conteneur des BOUTONS"
    CONTENEUR_GALERIE_DU_HTML.before(CONTENEUR_DES_FILTRES);// "before" sur la galerie insère le "conteneur de BOUTONS" avant la galerie

    const BOUTON_FILTRE_TOUS = document.createElement("button");// Création bouton "Tous"
    BOUTON_FILTRE_TOUS.innerText = "Tous"; // Texte du bouton
    CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_TOUS);// Assemblage bouton dans "conteneur de BOUTONS"

    BOUTON_FILTRE_TOUS.addEventListener("click", function () {// --------- INTELLIGENCE DE BOUTON_FILTRE_TOUS ---------
        GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);
        console.log("c'est bon");
    });

    for (const CATEGORIE of LISTE_CATEGORIES) {// Boucle sur catégorie pour création autres boutons
        const BOUTON_FILTRE_CATEGORIE = document.createElement("button");// Création bouton
        BOUTON_FILTRE_CATEGORIE.innerText = CATEGORIE.name; // Texte du bouton
        
        CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_CATEGORIE);// Assemblage bouton dans "conteneur de BOUTONS"

        BOUTON_FILTRE_CATEGORIE.addEventListener("click", function () {// --------- INTELLIGENCE DES BOUTONS CATÉGORIES ---------
            const LISTE_PROJETS_FILTRES = LISTE_PROJETS.filter(function (PROJET) {// Filtrage projets qui ont même ID que catégorie bouton (voir doc1)
                return PROJET.categoryId === CATEGORIE.id;
            });
  
            GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_FILTRES);// Appel fonction d'affichage avec la liste filtrée            
        });
    }
}

// ============================================================
// FONCTION SPECIFIQUE AFFICHAGE ADMIN
// ============================================================

function MODE_ADMIN_ACTIVE() {// --- CRÉATION BANDE NOIRE DU HAUT ---
    const LIEN_LOGIN = document.querySelector("nav li:nth-child(3) a"); // On cible le 3ème <li> qui contient le lien login
    const BANDEAU_MODE_EDITION = document.createElement("div");//Création balise pour bande noire
    BANDEAU_MODE_EDITION.classList.add("admin-bar");//Ajout class pour style
    BANDEAU_MODE_EDITION.innerText = "Mode édition";//Ajout texte dedans
    document.body.prepend(BANDEAU_MODE_EDITION);//Insertion tout en haut de body
    console.log("Bande noire créée !");
    console.log("Fonction Admin activée");
        
    const BOUTON_OUVRIR_MODALE = document.createElement("button");// --- CRÉATION DU BOUTON "MODIFIER" ---
    BOUTON_OUVRIR_MODALE.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;//Ajout stylo et texte
    BOUTON_OUVRIR_MODALE.classList.add("modif-button"); //Ajoute la class
    const TITRE_PROJETS_DU_HTML = document.querySelector("#portfolio h2");//Ciblage h2 "Mes Projets"
    TITRE_PROJETS_DU_HTML.after(BOUTON_OUVRIR_MODALE);//Insertion juste après ce h2

    // --- OUVERTURE DE LA MODALE ---
    BOUTON_OUVRIR_MODALE.addEventListener("click", function() {//Ecoute du click
        OUVRIR_MODALE();
    })
}

// ============================================================
// GESTION DE LA MODALE
// ============================================================

function OUVRIR_MODALE() {

    // --- CRÉATION DU FOND (OVERLAY) ---
    const CONTENEUR_FOND_MODALE = document.createElement("div");
    CONTENEUR_FOND_MODALE.classList.add("modal-overlay");//class pour style
    // --- CRÉATION DE LA BOÎTE BLANCHE ---
    const BOITE_MODALE = document.createElement("div");
    BOITE_MODALE.classList.add("modal-box");//class pour style
    // --- CRÉATION DU CONTENU ---
    const BOUTON_FLECHE_RETOUR = document.createElement("span"); // Création flèche retour
    BOUTON_FLECHE_RETOUR.innerHTML = '<i class="fa-solid fa-arrow-left"></i>'; // Icône flèche gauche
    BOUTON_FLECHE_RETOUR.classList.add("modal-arrow"); // Classe CSS pour position
    const TITRE_BOITE_MODALE = document.createElement("h3");// Titre
    TITRE_BOITE_MODALE.innerText = "Galerie photo";
    const BOUTON_FERMER_MODALE = document.createElement("span");// Bouton fermer
    BOUTON_FERMER_MODALE.innerText = "x";
    BOUTON_FERMER_MODALE.classList.add("modal-close");    
    const CONTENEUR_GALERIE_MODALE = document.createElement("div");// CONTENEUR IMAGES
    CONTENEUR_GALERIE_MODALE.classList.add("modal-gallery"); // Classe pour le CSS

    for (const PROJET of LISTE_PROJETS) {// On boucle sur tous les projets
        
        const CARTE_PROJET_MODALE = document.createElement("div");// Création boite pour l'image et la poubelle
        CARTE_PROJET_MODALE.classList.add("modal-image-container");//class pour style

        const CARTE_PROJET_MODALE_IMG = document.createElement("img");// On crée l'image
        CARTE_PROJET_MODALE_IMG.src = PROJET.imageUrl; // L'URL de l'image
        
        const ICONE_POUBELLE = document.createElement("i");// On crée l'icône poubelle
        ICONE_POUBELLE.classList.add("fa-solid", "fa-trash-can"); // Classes Font Awesome
        ICONE_POUBELLE.classList.add("icone-suppr"); // Classe pour le CSS

        // --- SUPPRESSION ---

        ICONE_POUBELLE.addEventListener("click", async function() {
            // On vérifie si on capte bien le clic et l'ID du projet
            console.log("Clic poubelle sur le projet ID :", PROJET.id);

            // 1. On envoie la demande de suppression à l'API
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + PROJET.id, {
                method: "DELETE",
                // 2. On s'identifie avec le token (obligatoire)
                headers: { Authorization: "Bearer " + TOKEN_OK }
            });
            // 3. On vérifie si ça a marché (Code 204 = suppression OK)
            if (REPONSE_SUPPRESSION.status === 204) {
                console.log("Projet supprimé de l'API !");
            }
        });

        CARTE_PROJET_MODALE.appendChild(CARTE_PROJET_MODALE_IMG);// Assemblage : Image dans boite
        CARTE_PROJET_MODALE.appendChild(ICONE_POUBELLE);// Assemblage : poubelle dans boite
        
        CONTENEUR_GALERIE_MODALE.appendChild(CARTE_PROJET_MODALE);// Assemblage : boite dans grille
    }
    
    // --- 4. ASSEMBLAGE ---Met la croix, la fleche retour et le titre DANS la boîte
    BOITE_MODALE.appendChild(BOUTON_FLECHE_RETOUR);
    BOITE_MODALE.appendChild(BOUTON_FERMER_MODALE);
    BOITE_MODALE.appendChild(TITRE_BOITE_MODALE);
    // On ajoute la grille DANS la boîte (après le titre)
    BOITE_MODALE.appendChild(CONTENEUR_GALERIE_MODALE);
    // On met la boîte DANS le fond
    CONTENEUR_FOND_MODALE.appendChild(BOITE_MODALE);
    // On met le fond DANS le body
    document.body.appendChild(CONTENEUR_FOND_MODALE);

        // --- 5. FERMETURE DE LA MODALE ---
    // On écoute le clic sur la croix pour fermer
    BOUTON_FERMER_MODALE.addEventListener("click", function() {
        // On retire le fond (et donc la modale) du body
        CONTENEUR_FOND_MODALE.remove();
    });

        // --- 6. FERMETURE EN CLIQUANT À CÔTÉ ---
    // On écoute le clic sur le fond gris
    CONTENEUR_FOND_MODALE.addEventListener("click", function(event) {
        // Si on clique bien sur le fond (et pas sur la boîte blanche)
        if (event.target === CONTENEUR_FOND_MODALE) {
            // On retire le fond
            CONTENEUR_FOND_MODALE.remove();
        }
    });

    //===================================================================================
    //tentative de réparation des conneries de Z (dans la fonction OUVRIR_MODALE)!!!!!!!!
    //===================================================================================
        // --- AJOUT DU BOUTON "AJOUTER UNE PHOTO" ---
    const BOUTON_AJOUTER_PHOTO = document.createElement("button");
    BOUTON_AJOUTER_PHOTO.innerText = "Ajouter une photo";
    BOUTON_AJOUTER_PHOTO.classList.add("btn-ajout-photo"); // Classe CSS à styliser plus tard
    BOITE_MODALE.appendChild(BOUTON_AJOUTER_PHOTO);

    // --- CRÉATION DE LA VUE FORMULAIRE (Cachée par défaut) ---
    const CONTENEUR_FORMULAIRE_MODALE = document.createElement("div");
    CONTENEUR_FORMULAIRE_MODALE.classList.add("vue-formulaire");
    CONTENEUR_FORMULAIRE_MODALE.style.display = "none"; // Caché au début
    BOUTON_FLECHE_RETOUR.style.display = "none"; // Cachée par défaut (car on est sur la galerie)

    // Contenu du formulaire
    // C'est du contenu "statique" (il ne bouge pas). On a juste besoin de l'afficher.
    // Pas besoin de variable.
    // C'est donc beaucoup plus rapide d'écrire le HTML d'un coup comme ça
    CONTENEUR_FORMULAIRE_MODALE.innerHTML = `
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
    BOITE_MODALE.appendChild(CONTENEUR_FORMULAIRE_MODALE);

    // --- ÉCOUTEUR DU BOUTON VALIDER (Ajouté une seule fois) ---
    document.getElementById("btn-valider").addEventListener("click", ENVOYER_NOUVEAU_PROJET);

    // --- LOGIQUE DE BASCULE (Galerie <-> Formulaire) ---
    BOUTON_AJOUTER_PHOTO.addEventListener("click", function() {
        CONTENEUR_GALERIE_MODALE.style.display = "none"; // On cache la galerie
        BOUTON_AJOUTER_PHOTO.style.display = "none"; // On cache le bouton ajouter
        CONTENEUR_FORMULAIRE_MODALE.style.display = "block"; // On affiche le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "block"; // On affiche la fleche de retour
        
        // On remplit le select des catégories dynamiquement
        const MENU_CHOIX_CATEGORIE = document.getElementById("category-input");
        MENU_CHOIX_CATEGORIE.innerHTML = ""; // On vide avant de remplir
        for (const CATEGORIE_MENU of LISTE_CATEGORIES) {
            const CHOIX_MENU = document.createElement("option");
            CHOIX_MENU.value = CATEGORIE_MENU.id; // L'ID est important pour l'API
            CHOIX_MENU.innerText = CATEGORIE_MENU.name;
            MENU_CHOIX_CATEGORIE.appendChild(CHOIX_MENU);
        }
    });

    BOUTON_FLECHE_RETOUR.addEventListener("click", function() {
        CONTENEUR_GALERIE_MODALE.style.display = ""; // On laisse le CSS s'occupper de l'affichage
        BOUTON_AJOUTER_PHOTO.style.display = "block"; // On affiche le bouton ajouter
        CONTENEUR_FORMULAIRE_MODALE.style.display = "none"; // On cache le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "none"; // On cache la fleche de retour
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
    const CHAMP_IMAGE = document.getElementById("image-input");
    const CHAMP_TITRE = document.getElementById("title-input");
    const CHAMP_CATEGORIE = document.getElementById("category-input");

    // Vérification simple : est-ce que tout est rempli ?
    //Si PAS de fichier sélectionné OU Si PAS de texte dans le titre
    if (!CHAMP_IMAGE.files[0] || !CHAMP_TITRE.value) {
        alert("Veuillez remplir tous les champs");
        return;// Alors on arrête LA FONCTION immédiatement
    }

    // 2. Préparer les données pour l'API (FormData est obligatoire pour les fichiers)
    const ENVELOPPE_FORM_DATA = new FormData();// FormData c'est un conteneur spécial :
    // (capable de contenir à la fois du texte ET des fichiers lourds)
    ENVELOPPE_FORM_DATA.append("image", CHAMP_IMAGE.files[0]);
    ENVELOPPE_FORM_DATA.append("title", CHAMP_TITRE.value);
    ENVELOPPE_FORM_DATA.append("category", CHAMP_CATEGORIE.value);

    // 3. Envoyer à l'API
    // On envoie les données et on attend la réponse (await)
    const RETOUR_SERVEUR_AJOUT = await fetch("http://localhost:5678/api/works", {
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
        // --- LOGIQUE POUR RAFRAICHIR LA GALERIE (Etape 8.2) ---
        const NOUVEAU_PROJET_CREE = await RETOUR_SERVEUR_AJOUT.json();// Récupération des infos du projet créé
        LISTE_PROJETS.push(NOUVEAU_PROJET_CREE); // On ajoute le projet à la liste principale (mémoire)
        
        GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS); // On rafraichit la galerie principale avec la liste à jour
        
            // --- MISE À JOUR DE LA MODALE ---
            // 1. On crée la nouvelle carte pour la modale (comme dans la boucle)
        const NOUVELLE_CARTE_MODALE = document.createElement("figure");
        NOUVELLE_CARTE_MODALE.classList.add("modal-image-container");
    
        const NOUVELLE_IMAGE_MODALE = document.createElement("img");
        NOUVELLE_IMAGE_MODALE.src = NOUVEAU_PROJET_CREE.imageUrl;
        
        const NOUVELLE_POUBELLE = document.createElement("i");
        NOUVELLE_POUBELLE.classList.add("fa-solid", "fa-trash-can", "icone-suppr");
        
        // 2. On assemble la carte
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_IMAGE_MODALE);
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_POUBELLE);
        
        // 3. On la colle dans la galerie de la modale (en utilisant la classe CSS pour la retrouver)
        document.querySelector(".modal-gallery").appendChild(NOUVELLE_CARTE_MODALE);

    } else {
        console.log("Erreur lors de l'ajout");
    }
}
