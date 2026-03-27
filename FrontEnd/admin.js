import { LISTE_PROJETS, LISTE_CATEGORIES, TOKEN_OK, GENERER_ET_AFFICHER_GALERIE } from "./index.js";

if (TOKEN_OK) {//Si on a trouvé un token dans localstorage :
    ACTIVER_MODE_ADMIN();//Appel fonction d'affichage Admin (PLUS BAS DANS LES LIGNES)
}



// _____________ACTIVER_MODE_ADMIN_____________
function ACTIVER_MODE_ADMIN() {// Fonction d'affichage pour le mode Administrateur

    //CREATION BANDEAU ADMIN
    const BANDEAU_MODE_EDITION = document.createElement("div");
    BANDEAU_MODE_EDITION.classList.add("admin-bar");
    BANDEAU_MODE_EDITION.innerText = "Mode édition";
    //ASSEMBLAGE
    document.body.prepend(BANDEAU_MODE_EDITION);//Insertion tout en haut de body

    //CREATION CONTENEUR TITRE & BOUTON MODIFIER
    const TITRE_PROJETS_DU_HTML = document.querySelector("#portfolio h2");//CIBLAGE titre "Mes Projets" 
    const CONTENEUR_TITRE_ET_BOUTON_MODIFIER = document.createElement("div");
    CONTENEUR_TITRE_ET_BOUTON_MODIFIER.classList.add("titre-projets-container");
    TITRE_PROJETS_DU_HTML.before(CONTENEUR_TITRE_ET_BOUTON_MODIFIER);//ASSEMBLAGE AVANT titre "Mes Projets"
    CONTENEUR_TITRE_ET_BOUTON_MODIFIER.appendChild(TITRE_PROJETS_DU_HTML);//DEPLACEMENT titre "Mes Projets" dans CONTENEUR TITRES & BOUTON MODIFIER
    //CREATION DU BOUTON MODIFIER
    const BOUTON_OUVRIR_MODALE = document.createElement("button");
    BOUTON_OUVRIR_MODALE.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;//Ajout stylo et texte
    BOUTON_OUVRIR_MODALE.classList.add("modif-button");
    //ASSEMBLAGE bouton dans CONTENEUR TITRE & BOUTON MODIFIER
    CONTENEUR_TITRE_ET_BOUTON_MODIFIER.appendChild(BOUTON_OUVRIR_MODALE);

    //DECONNEXION
    const LIEN_LOGIN = document.querySelector("nav li:nth-child(3) a");
    LIEN_LOGIN.innerText = "logout";
    LIEN_LOGIN.addEventListener("click", function (event) {//CLICK LOGOUT
        event.preventDefault();//Empeche la navigation vers la page login.html
        window.localStorage.removeItem("token");//Efface le token
        window.location.href = "index.html";//Redirection (retour visiteur)
    });
    
    BOUTON_OUVRIR_MODALE.addEventListener("click", function () {//CLICK BOUTON MODIFIER
        OUVRIR_MODALE();
    })
}



// _____________OUVRIR MODALE_____________
function OUVRIR_MODALE() {
    //CREATION FOND
    const FOND_CONTENEUR_MODALE = document.createElement("div");
    FOND_CONTENEUR_MODALE.classList.add("modal-overlay");

    //CREATION MODALE
    const FENETRE_MODALE = document.createElement("div");
    FENETRE_MODALE.classList.add("modal-box");

    //CREATION CONTENU
    const BOUTON_FLECHE_RETOUR = document.createElement("span");//FLECHE
    BOUTON_FLECHE_RETOUR.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    BOUTON_FLECHE_RETOUR.classList.add("modal-arrow");
    const TITRE_FENETRE_MODALE = document.createElement("h3");
    TITRE_FENETRE_MODALE.innerText = "Galerie photo";
    const BOUTON_FERMER_MODALE = document.createElement("span");//BOUTON FERMER
    BOUTON_FERMER_MODALE.innerText = "x";
    BOUTON_FERMER_MODALE.classList.add("modal-close");

    //CREATION GALERIE DES CARTES
    const CONTENEUR_GALERIE_MODALE = document.createElement("div");
    CONTENEUR_GALERIE_MODALE.classList.add("modal-gallery");

    for (const PROJET_DE_LA_LISTE of LISTE_PROJETS) {//On boucle sur tous les projets        
        //CREATION CARTES
        const CARTE_PROJET_MODALE = document.createElement("div");
        CARTE_PROJET_MODALE.classList.add("modal-image-container");
        const IMAGE_CARTE = document.createElement("img");
        IMAGE_CARTE.src = PROJET_DE_LA_LISTE.imageUrl;
        //CREATION ICONE POUBELLE
        const ICONE_POUBELLE = document.createElement("i");
        ICONE_POUBELLE.classList.add("fa-solid", "fa-trash-can", "icone-suppr");
        //ASSEMBLAGE GALERIE DES CARTES
        CARTE_PROJET_MODALE.appendChild(IMAGE_CARTE);
        CARTE_PROJET_MODALE.appendChild(ICONE_POUBELLE);
        CONTENEUR_GALERIE_MODALE.appendChild(CARTE_PROJET_MODALE);
        
        //ACTION : SUPPRESSION
        ICONE_POUBELLE.addEventListener("click", async function () {//CLICK BOUTON POUBELLE                                                                   
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + PROJET_DE_LA_LISTE.id, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + TOKEN_OK }
            });

            if (REPONSE_SUPPRESSION.status === 204) {
                CARTE_PROJET_MODALE.remove();                                
                const INDEX_PROJET = LISTE_PROJETS.findIndex(PROJET_SCANNE => PROJET_SCANNE.id === PROJET_DE_LA_LISTE.id);
                LISTE_PROJETS.splice(INDEX_PROJET, 1);

                GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);//RAFRAICHISSEMENT GALERIE AVEC LISTE A JOUR
            }
        });
    }

    //CREATION LIGNE GRISE
    const LIGNE_GRISE = document.createElement("div");
    LIGNE_GRISE.classList.add("lignegrise");

    //CREATION BOUTON AJOUTER UNE PHOTO
    const BOUTON_AJOUTER_PHOTO = document.createElement("button");
    BOUTON_AJOUTER_PHOTO.innerText = "Ajouter une photo";
    BOUTON_AJOUTER_PHOTO.classList.add("btn-ajout-photo");

    //CREATION FORMULAIRE AJOUT
    const FORMULAIRE_AJOUT = document.createElement("div");
    FORMULAIRE_AJOUT.classList.add("vue-formulaire");
    FORMULAIRE_AJOUT.style.display = "none";
    BOUTON_FLECHE_RETOUR.style.display = "none";
    FORMULAIRE_AJOUT.innerHTML = 
    `<div class="champ-image">
        <img src="./assets/icons/picture-svgrepo-com 1.png" class="icone-placeholder" alt="Icône image">
        <input type="file" id="image-input" accept="image/*" required>
        <label for="image-input">+ Ajouter photo</label>
        <img id="preview-image" src="" alt="" style="display:none; max-width:100px;">
        <h6>jpg, png : 4mo max</h6>
    </div>
    <label for="title-input">Titre</label>
    <input type="text" id="title-input" required>
    <label for="category-input">Catégorie</label>
    <select id="category-input"></select>
    <button id="btn-valider">Valider</button>`;
    
    //ASSEMBLAGE MODALE
    FENETRE_MODALE.appendChild(BOUTON_FLECHE_RETOUR);
    FENETRE_MODALE.appendChild(BOUTON_FERMER_MODALE);
    FENETRE_MODALE.appendChild(TITRE_FENETRE_MODALE);
    FENETRE_MODALE.appendChild(CONTENEUR_GALERIE_MODALE);
    FENETRE_MODALE.appendChild(LIGNE_GRISE);
    FENETRE_MODALE.appendChild(BOUTON_AJOUTER_PHOTO);
    FENETRE_MODALE.appendChild(FORMULAIRE_AJOUT);
    FOND_CONTENEUR_MODALE.appendChild(FENETRE_MODALE);
    document.body.appendChild(FOND_CONTENEUR_MODALE);

    BOUTON_FERMER_MODALE.addEventListener("click", function () {//CLICK CROIX
        FOND_CONTENEUR_MODALE.remove();//Suppression fond (et donc modale) du body
    });

    FOND_CONTENEUR_MODALE.addEventListener("click", function (event) {//CLICK A COTE
        if (event.target === FOND_CONTENEUR_MODALE) {
            FOND_CONTENEUR_MODALE.remove();
        }
    });
   

    //GESTION APERCU IMAGE
    //CIBLAGE
    const CHAMP_SELECTION_IMAGE = document.getElementById("image-input");//Image choisie par l'utilisateur
    const APERCU_IMAGE = document.getElementById("preview-image");//Aperçu image
    const ICONE_PAR_DEFAUT = document.querySelector(".icone-placeholder");//Icone paysage
    const BOUTON_CHOISIR_PHOTO = document.querySelector("label[for='image-input']");//Bouton AJOUTER PHOTO
    const INFO_FORMAT = document.querySelector("h6");

    //ACTION : APERCU IMAGE
    CHAMP_SELECTION_IMAGE.addEventListener("change", function (EVENT_CHOIX) {//L'utilisateur selectionne une image

        const IMAGE_CHOISIE_PAR_USER = EVENT_CHOIX.target.files[0];//Recuperation fichier sélectionné

        if (IMAGE_CHOISIE_PAR_USER) {//Si un fichier est détecté
            const LECTEUR_DE_FICHIER = new FileReader();//Outil pour lecture de fichier

            LECTEUR_DE_FICHIER.onload = function(EVENT_LECTURE) {//Quand le fichier sera lu
                INFO_FORMAT.style.display = "none";
                ICONE_PAR_DEFAUT.style.display = "none";
                BOUTON_CHOISIR_PHOTO.style.display = "none";
                APERCU_IMAGE.style.width = "100%";
                APERCU_IMAGE.style.height = "100%";
                APERCU_IMAGE.style.objectFit = "contain";//Remplit sans être déformée
                APERCU_IMAGE.style.maxWidth = "none";
                APERCU_IMAGE.src = EVENT_LECTURE.target.result;//Charge l'aperçu
                APERCU_IMAGE.style.display = "block";//Affiche l'aperçu
            };
            LECTEUR_DE_FICHIER.readAsDataURL(IMAGE_CHOISIE_PAR_USER);//Lis le fichier
        }
    });

    //ACTION : BOUTON VALIDER
    document.getElementById("btn-valider").addEventListener("click", ENVOYER_NOUVEAU_PROJET);//CLICK BOUTON VALIDER


    //ACTION : OUVRIR FORMULAIRE
    BOUTON_AJOUTER_PHOTO.addEventListener("click", function () {//CLICK BOUTON "AJOUTER PHOTO"
        //Bascule vers le formulaire
        TITRE_FENETRE_MODALE.innerText = "Ajout photo";
        CONTENEUR_GALERIE_MODALE.style.display = "none";
        BOUTON_AJOUTER_PHOTO.style.display = "none";
        FORMULAIRE_AJOUT.style.display = "";//Affiche le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "block";

        const MENU_CHOIX_CATEGORIE = document.getElementById("category-input");//Remplissage du menu Catégorie
        MENU_CHOIX_CATEGORIE.innerHTML = "";//On vide avant de remplir
        for (const CATEGORIE_MENU of LISTE_CATEGORIES) {
            const OPTION_CATEGORIE = document.createElement("option");
            OPTION_CATEGORIE.value = CATEGORIE_MENU.id;//L'ID sera envoyé à l'API + tard
            OPTION_CATEGORIE.innerText = CATEGORIE_MENU.name;//Texte visible par l'utilisateur
            MENU_CHOIX_CATEGORIE.appendChild(OPTION_CATEGORIE);
        }
    });

    //ACTION : RETOUR GALLERIE MODALE
    BOUTON_FLECHE_RETOUR.addEventListener("click", function () {
        TITRE_FENETRE_MODALE.innerText = "Galerie photo";
        CONTENEUR_GALERIE_MODALE.style.display = ""; // On laisse le CSS s'occupper de l'affichage
        BOUTON_AJOUTER_PHOTO.style.display = "block"; // On affiche le bouton ajouter
        FORMULAIRE_AJOUT.style.display = "none"; // On cache le formulaire
        BOUTON_FLECHE_RETOUR.style.display = "none"; // On cache la fleche de retour
        CHAMP_SELECTION_IMAGE.value = "";// Vide l'image choisie
        APERCU_IMAGE.style.display = "none";// Cache son apperçu
        ICONE_PAR_DEFAUT.style.display = "block";// Réafficher l'aperçu
        BOUTON_CHOISIR_PHOTO.style.display = "inline-block";// Réafficher le bouton
    });
}


// _____________ENVOYER NOUVEAU PROJET_____________
async function ENVOYER_NOUVEAU_PROJET() {
    
    const CHAMP_IMAGE = document.getElementById("image-input");// Récupération des valeurs du formulaire
    const CHAMP_TITRE = document.getElementById("title-input");
    const CHAMP_CATEGORIE = document.getElementById("category-input");

    if (!CHAMP_IMAGE.files[0] || !CHAMP_TITRE.value) {//Tout est rempli ? Si PAS de fichier sélectionné OU Si PAS de texte dans le titre
        alert("Veuillez remplir tous les champs");
        return;//Alors on arrête LA FONCTION immédiatement
    }
    
    //Préparation données pour l'API
    const ENVELOPPE_FORM_DATA = new FormData();//FormData : conteneur pouvant contenir du texte et des fichiers lourds
    ENVELOPPE_FORM_DATA.append("image", CHAMP_IMAGE.files[0]);
    ENVELOPPE_FORM_DATA.append("title", CHAMP_TITRE.value);
    ENVELOPPE_FORM_DATA.append("category", CHAMP_CATEGORIE.value);

    const RESULTAT_REQUETE_AJOUT = await fetch("http://localhost:5678/api/works", {//Envoi à l'API : envoie données attente réponse (await)
        method: "POST",
        headers: {
            "Authorization": "Bearer " + TOKEN_OK
            // PAS de Content-Type ici ! Le navigateur gère seul avec FormData
        },
        body: ENVELOPPE_FORM_DATA//Données formulaire
    });

    if (RESULTAT_REQUETE_AJOUT.status === 201) {

        //MISE A JOUR GALERIE AVEC LISTE A JOUR
        const NOUVEAU_PROJET_CREE = await RESULTAT_REQUETE_AJOUT.json();// Récupération des infos du projet créé
        LISTE_PROJETS.push(NOUVEAU_PROJET_CREE); //Ajoute le projet à la liste principale (mémoire)
        GENERER_ET_AFFICHER_GALERIE(LISTE_PROJETS);//Rafraichissement affichage galerie

        //MISE À JOUR AFFICHAGE MODALE
        const NOUVELLE_CARTE_MODALE = document.createElement("figure");
        NOUVELLE_CARTE_MODALE.classList.add("modal-image-container");
        const NOUVELLE_IMAGE_MODALE = document.createElement("img");
        NOUVELLE_IMAGE_MODALE.src = NOUVEAU_PROJET_CREE.imageUrl;

        const NOUVELLE_POUBELLE = document.createElement("i");
        NOUVELLE_POUBELLE.classList.add("fa-solid", "fa-trash-can", "icone-suppr");

        //ACTION : SUPPRIMER UN PROJET
        NOUVELLE_POUBELLE.addEventListener("click", async function () {//CLICK NOUVELLE POUBELLE
            const REPONSE_SUPPRESSION = await fetch("http://localhost:5678/api/works/" + NOUVEAU_PROJET_CREE.id, {// Demande de suppression à l'API
                method: "DELETE",
                headers: { Authorization: "Bearer " + TOKEN_OK }
            });

            if (REPONSE_SUPPRESSION.status === 204) {// Si ça a marché, on retire l'image de l'écran
                NOUVELLE_CARTE_MODALE.remove(); // Auto-suppression de la carte
            }
        });

        //ASSEMBLAGE NOUVELLE CARTE
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_IMAGE_MODALE);
        NOUVELLE_CARTE_MODALE.appendChild(NOUVELLE_POUBELLE);
        document.querySelector(".modal-gallery").appendChild(NOUVELLE_CARTE_MODALE);//AFFICHAGE DANS GALERIE MODALE (EN UTILISANT LA CLASSE CSS POUR LA RETROUVER)

        alert("Projet ajouté avec succès !");

        //FERMETURE AUTO MODALE
        const FOND_MODALE = document.querySelector(".modal-overlay"); 
        if (FOND_MODALE) {
            FOND_MODALE.remove(); 
        }

    } else {
        console.log("Erreur lors de l'ajout");
    }
}