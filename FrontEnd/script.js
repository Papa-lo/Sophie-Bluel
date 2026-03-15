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
// ║                  2. AFFICHAGE DE LA GALERIE                  ║
// ╚══════════════════════════════════════════════════════════════╝
const CONTENEUR_GALERIE_DU_HTML = document.querySelector(".gallery");// Ciblage balise HTML avec class "gallery" pour pouvoir la manipuler

function GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS_ALIAS) {// --- FONCTION GÉNÉRER IMAGES DYNAMIQUEMENT ---

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

// ╔══════════════════════════════════════════════════════════════╗
// ║                  3. GESTION ADMIN / VISITEUR                 ║
// ╚══════════════════════════════════════════════════════════════╝
const TOKEN_OK = window.localStorage.getItem("token");// Verif si token dans l'ARMOIRE (: localStorage de windows ???)

if (TOKEN_OK) { // Si on a trouvé un token dans l'armoire...
    console.log("Admin connecté !"); // ...on le signale dans la console

    MODE_ADMIN_ACTIVE(); // Appel fonction d'affichage Admin (PLUS BAS DANS LES LIGNES)

} else {// Sinon, on est en mode visiteur (donc affiche les filtres)
    const CONTENEUR_DES_FILTRES = document.createElement("div");// Création balise <div> "conteneur des BOUTONS de filtres"
    CONTENEUR_GALERIE_DU_HTML.before(CONTENEUR_DES_FILTRES);// "before" sur la galerie insère le "conteneur de BOUTONS de filtres" avant la galerie

    const BOUTON_FILTRE_TOUS = document.createElement("button");// Création bouton filtre "Tous"
    BOUTON_FILTRE_TOUS.innerText = "Tous"; // Texte du bouton
    CONTENEUR_DES_FILTRES.appendChild(BOUTON_FILTRE_TOUS);// Assemblage bouton dans "conteneur de BOUTONS"

    BOUTON_FILTRE_TOUS.addEventListener("click", function () {// --------- INTELLIGENCE BOUTON_FILTRE_TOUS ---------
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

// ╔══════════════════════════════════════════════════════════════╗
// ║               4. FONCTION MODE ADMIN ACTIVE                  ║
// ╚══════════════════════════════════════════════════════════════╝
function MODE_ADMIN_ACTIVE() {// Fonction d'affichage pour le mode Administrateur
    const LIEN_LOGIN = document.querySelector("nav li:nth-child(3) a"); // On cible le 3ème <li> qui contient le lien login
    LIEN_LOGIN.innerText = "logout"; // On change le texte en "logout"
    LIEN_LOGIN.addEventListener("click", function (event) {
        event.preventDefault(); // On empêche la navigation vers la page login.html
        window.localStorage.removeItem("token"); // On efface le token de l'armoire
        window.location.href = "index.html"; // On recharge la page d'accueil (retour visiteur)
    });
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

    BOUTON_OUVRIR_MODALE.addEventListener("click", function () {//Ecoute du click --- OUVERTURE DE LA MODALE ---
        OUVRIR_MODALE();
    })
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                  5. FONCTION OUVRIR MODALE                   ║
// ╚══════════════════════════════════════════════════════════════╝
function OUVRIR_MODALE() {

    const CONTENEUR_FOND_MODALE = document.createElement("div");// --- CRÉATION DU FOND (OVERLAY) ---
    CONTENEUR_FOND_MODALE.classList.add("modal-overlay");//class pour style

    const BOITE_MODALE = document.createElement("div");// --- CRÉATION BOÎTE BLANCHE ---
    BOITE_MODALE.classList.add("modal-box");//class pour style

    // --- CRÉATION DU CONTENU ---
    const BOUTON_FLECHE_RETOUR = document.createElement("span"); // Création flèche retour
    BOUTON_FLECHE_RETOUR.innerHTML = '<i class="fa-solid fa-arrow-left"></i>'; // Icône flèche gauche
    BOUTON_FLECHE_RETOUR.classList.add("modal-arrow"); // Classe CSS pour position
    const TITRE_BOITE_MODALE = document.createElement("h3");// Titre
    TITRE_BOITE_MODALE.innerText = "Galerie photo";// Texte titre
    const BOUTON_FERMER_MODALE = document.createElement("span");// Bouton fermer
    BOUTON_FERMER_MODALE.innerText = "x";// Texte bouton titre
    BOUTON_FERMER_MODALE.classList.add("modal-close");// Classe CSS

    const CONTENEUR_GALERIE_MODALE = document.createElement("div");// CONTENEUR des CARTES
    CONTENEUR_GALERIE_MODALE.classList.add("modal-gallery"); // Classe pour le CSS
    for (const PROJET of LISTE_PROJETS) {// On boucle sur tous les projets

        const CARTE_PROJET_MODALE = document.createElement("div");// Création boite (carte) pour l'image et la poubelle
        CARTE_PROJET_MODALE.classList.add("modal-image-container");//class pour style

        const CARTE_PROJET_MODALE_IMG = document.createElement("img");// On crée l'image
        CARTE_PROJET_MODALE_IMG.src = PROJET.imageUrl; // L'URL de l'image

        const ICONE_POUBELLE = document.createElement("i");// On crée l'icône poubelle
        ICONE_POUBELLE.classList.add("fa-solid", "fa-trash-can"); // Classes Font Awesome
        ICONE_POUBELLE.classList.add("icone-suppr"); // Classe pour le CSS

        ICONE_POUBELLE.addEventListener("click", async function () {// --- SUPPRESSION --- INTELLIGENCE BOUTON POUBELLE

            console.log("Clic poubelle sur le projet ID :", PROJET.id);// Vérif si on capte le clic et l'ID du projet
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + PROJET.id, {// Envoi demande de suppression à l'API
                method: "DELETE",
                headers: { Authorization: "Bearer " + TOKEN_OK }// Identification obligatoire avec token
            });
            if (REPONSE_SUPPRESSION.status === 204) {// Vérif si ça a marché (Code 204 = suppression OK)
                CARTE_PROJET_MODALE.remove();
                console.log("Projet supprimé de l'API !");
                
                const INDEX_PROJET = LISTE_PROJETS.findIndex(projet => projet.id === PROJET.id);// On trouve l'index du projet dans la liste pour le retirer
                LISTE_PROJETS.splice(INDEX_PROJET, 1); // On le coupe de la liste

                GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);//  --- RAFRAICHISSEMENT GALERIE AVEC LISTE A JOUR ---
            }
        });

        CARTE_PROJET_MODALE.appendChild(CARTE_PROJET_MODALE_IMG);// Assemblage : Image dans boite (carte)
        CARTE_PROJET_MODALE.appendChild(ICONE_POUBELLE);// Assemblage : poubelle dans boite (carte)

        CONTENEUR_GALERIE_MODALE.appendChild(CARTE_PROJET_MODALE);// Assemblage : boite (carte) dans grille
    }

    BOITE_MODALE.appendChild(BOUTON_FLECHE_RETOUR);// --- ASSEMBLAGE ---Met la croix, la fleche retour et le titre DANS la grande boîte blanche
    BOITE_MODALE.appendChild(BOUTON_FERMER_MODALE);
    BOITE_MODALE.appendChild(TITRE_BOITE_MODALE);
    BOITE_MODALE.appendChild(CONTENEUR_GALERIE_MODALE);// On ajoute la grille DANS la boîte (après le titre)
    CONTENEUR_FOND_MODALE.appendChild(BOITE_MODALE);// On met la grande boîte blanche DANS le fond
    document.body.appendChild(CONTENEUR_FOND_MODALE);// On met le fond DANS le body

    BOUTON_FERMER_MODALE.addEventListener("click", function () {// --- FERMETURE MODALE --- INTELLIGENCE CROIX
        CONTENEUR_FOND_MODALE.remove();// Suppression fond (et donc la modale) du body
    });

    CONTENEUR_FOND_MODALE.addEventListener("click", function (event) {// --- EN CLIQUANT À CÔTÉ ---
        if (event.target === CONTENEUR_FOND_MODALE) {// Si on clique bien sur le fond (et pas sur la boîte blanche)
            CONTENEUR_FOND_MODALE.remove();// Suppression fond
        }
    });

    //===================================================================================
    //tentative de réparation des conneries de Z (dans la fonction OUVRIR_MODALE)!!!!!!!!
    //===================================================================================
    
    const BOUTON_AJOUTER_PHOTO = document.createElement("button");// --- AJOUT DU BOUTON "AJOUTER UNE PHOTO" ---
    BOUTON_AJOUTER_PHOTO.innerText = "Ajouter une photo";
    BOUTON_AJOUTER_PHOTO.classList.add("btn-ajout-photo"); // Classe CSS à styliser plus tard
    BOITE_MODALE.appendChild(BOUTON_AJOUTER_PHOTO);

    
    const CONTENEUR_FORMULAIRE_MODALE = document.createElement("div");// --- CRÉATION VUE FORMULAIRE (Cachée par défaut) ---
    CONTENEUR_FORMULAIRE_MODALE.classList.add("vue-formulaire");
    CONTENEUR_FORMULAIRE_MODALE.style.display = "none"; // Caché au début
    BOUTON_FLECHE_RETOUR.style.display = "none"; // Cachée par défaut (car on est sur la galerie)

    
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
    BOITE_MODALE.appendChild(CONTENEUR_FORMULAIRE_MODALE);// Assemblage on met le formulaire dans la grande boite blanche

    document.getElementById("btn-valider").addEventListener("click", ENVOYER_NOUVEAU_PROJET);// --- INTELLIGENCE DU BOUTON VALIDER (Ajouté une seule fois) ---

    BOUTON_AJOUTER_PHOTO.addEventListener("click", function () {// --- INTELLIGENCE DE BASCULE (Galerie <-> Formulaire) ---
        CONTENEUR_GALERIE_MODALE.style.display = "none"; // On cache la galerie
        BOUTON_AJOUTER_PHOTO.style.display = "none"; // On cache le bouton ajouter
        CONTENEUR_FORMULAIRE_MODALE.style.display = "block"; // On affiche le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "block"; // On affiche la fleche de retour

        // On remplit le select des catégories dynamiquement
        const MENU_CHOIX_CATEGORIE = document.getElementById("category-input");// --- REMPLISSAGE DU MENU DÉROULANT ---
        MENU_CHOIX_CATEGORIE.innerHTML = ""; // On vide avant de remplir
        for (const CATEGORIE_MENU of LISTE_CATEGORIES) {
            const CHOIX_MENU = document.createElement("option");
            CHOIX_MENU.value = CATEGORIE_MENU.id; // L'ID est envoyé à l'API
            CHOIX_MENU.innerText = CATEGORIE_MENU.name;
            MENU_CHOIX_CATEGORIE.appendChild(CHOIX_MENU);
        }
    });

    BOUTON_FLECHE_RETOUR.addEventListener("click", function () {// --- INTELLIGENCE DE BASCULE (Formulaire <-> Galerie) ---
        CONTENEUR_GALERIE_MODALE.style.display = ""; // On laisse le CSS s'occupper de l'affichage
        BOUTON_AJOUTER_PHOTO.style.display = "block"; // On affiche le bouton ajouter
        CONTENEUR_FORMULAIRE_MODALE.style.display = "none"; // On cache le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "none"; // On cache la fleche de retour
    });

}

// ╔══════════════════════════════════════════════════════════════╗
// ║             6. FONCTION ENVOYER NOUVEAU PROJET               ║
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

        // --- LOGIQUE POUR RAFRAICHIR LA GALERIE (Etape 8.2) ---
        const NOUVEAU_PROJET_CREE = await RETOUR_SERVEUR_AJOUT.json();// Récupération des infos du projet créé
        LISTE_PROJETS.push(NOUVEAU_PROJET_CREE); // On ajoute le projet à la liste principale (mémoire)

        GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS); // --- RAFRAICHISSEMENT GALERIE AVEC LISTE A JOUR ---

        // --- MISE À JOUR DE LA MODALE ---
        
        const NOUVELLE_CARTE_MODALE = document.createElement("figure");// Création nouvelle carte pour la modale (comme dans la boucle)
        NOUVELLE_CARTE_MODALE.classList.add("modal-image-container");
        const NOUVELLE_IMAGE_MODALE = document.createElement("img");
        NOUVELLE_IMAGE_MODALE.src = NOUVEAU_PROJET_CREE.imageUrl;
        const NOUVELLE_POUBELLE = document.createElement("i");// Création nouvelle poubelle pour la modale
        NOUVELLE_POUBELLE.classList.add("fa-solid", "fa-trash-can", "icone-suppr");
        
        NOUVELLE_POUBELLE.addEventListener("click", async function () {// ---  INTELLIGENCE NOUVELLE POUBELLE ---
            console.log("Clic détecté sur nouvelle poubelle !");
            console.log("ID du projet à supprimer :", NOUVEAU_PROJET_CREE.id);
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + NOUVEAU_PROJET_CREE.id, {// Demande de suppression à l'API
                method: "DELETE",
                headers: { Authorization: "Bearer " + TOKEN_OK }
            });

            if (REPONSE_SUPPRESSION.status === 204) {// Si ça a marché, on retire l'image de l'écran
                NOUVELLE_CARTE_MODALE.remove(); // Auto-suppression de la carte
            }
        });

        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_IMAGE_MODALE);// Assemblage nouvelle carte
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_POUBELLE);
        
        document.querySelector(".modal-gallery").appendChild(NOUVELLE_CARTE_MODALE);// ON LA COLLE DANS LA GALERIE DE LA MODALE (EN UTILISANT LA CLASSE CSS POUR LA RETROUVER)

    } else {
        console.log("Erreur lors de l'ajout");
    }
}
