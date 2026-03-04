// On va chercher les données sur le serveur
const REPONSE_SERVEUR = await fetch('http://localhost:5678/api/works');
// On transforme la réponse en format utilisable (JSON)
const LISTE_PROJETS = await REPONSE_SERVEUR.json();
// On vérifie dans la console qu'on a bien reçu les données
console.log(LISTE_PROJETS);

// on vise la balise galerie :
const BALISE_GALERIE = document.querySelector(".gallery");
// on la vide (pour enlever les images fixes du HTML)
BALISE_GALERIE.innerHTML = "";

// on boucle sur chaque projet :
for (const PROJET of LISTE_PROJETS) {
    // on crée la balise <figure>
    const BALISE_FIGURE = document.createElement("figure");

    // on crée l'image :
    const BALISE_IMG = document.createElement("img");
    BALISE_IMG.src = PROJET.imageUrl; // L'URL de l'image

    // on crée la legende :
    const BALISE_FIGCAPTION = document.createElement("figcaption");
    BALISE_FIGCAPTION.innerText = PROJET.title; // Le titre du travail

    // on assemble le tout :
    BALISE_FIGURE.appendChild(BALISE_IMG);
    BALISE_FIGURE.appendChild(BALISE_FIGCAPTION);

    // on colle dans la galerie :
    BALISE_GALERIE.appendChild(BALISE_FIGURE);
}
