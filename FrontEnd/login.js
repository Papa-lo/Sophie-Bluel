// =================
// SCRIPT PAGE LOGIN
// =================

//Ciblage élément formulaire
const FORMULAIRE_POUR_REQUETE_LOGIN = document.querySelector("form");
const MESSAGE_ERREUR = document.getElementById("message-erreur");

// _____GESTION DE LA SOUMISSION_____
FORMULAIRE_POUR_REQUETE_LOGIN.addEventListener("submit", async function (event) {// Quand CLICK sur "se connecter"
    event.preventDefault();// Empeche le rechargement par défaut du navigateur
            
    //Récupération saisies utilisateur
    const EMAIL_SAISI = document.getElementById("email").value;
    const PASSWORD_SAISI = document.getElementById("password").value;

    try {
        //Envoi des identifiants au serveur (Méthode POST)
        const EXECUTION_REQUETE_LOGIN = await fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },                
            body: JSON.stringify({ // Stringify = traducteur.                  
                email: EMAIL_SAISI,
                password: PASSWORD_SAISI
            })
        });

        //Récupération réponse brut & transformation en objet JSON utilisable :
        const CONTENU_REPONSE_SERVEUR = await EXECUTION_REQUETE_LOGIN.json();

        //Logique de connexion (TOKEN)    
        if (CONTENU_REPONSE_SERVEUR.token) {// Check si token OK
            window.localStorage.setItem("token", CONTENU_REPONSE_SERVEUR.token);
            window.location.href = "index.html";// Redirection.
        } else {
            MESSAGE_ERREUR.innerText = "Erreur dans l’identifiant ou le mot de passe";
        }

    } catch (error) {
        MESSAGE_ERREUR.innerText = "Le service est momentanément indisponible.";
    }

});




