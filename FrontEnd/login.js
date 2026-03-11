// ============================================================
// PAGE DE CONNEXION - Script spécifique
// ============================================================

// On cible le formulaire pour pouvoir le manipuler ensuite :
const FORMULAIRE = document.querySelector("form");

// --- INTELLIGENCE Du BOUTON SE CONNECTER --- 
        // On surveille le formulaire, et si quelqu'un le soumet (clique ou entrée), exécute la fonction qui suit :
        FORMULAIRE.addEventListener("submit", async function (event) {              // AJOUT DU MOT "async"
            // TRÈS IMPORTANT : On empêche la page de se recharger (action="#") :
            event.preventDefault();
            
            // On cible le boite html "email" et ".value" récupère sa "propriété" :
            const EMAIL_SAISI = document.getElementById("email").value;
            // Idem pour password :
            const PASSWORD_SAISI = document.getElementById("password").value;

            console.log("Email :", EMAIL_SAISI);
            console.log("Mot de passe :", PASSWORD_SAISI);

            // On lance la requête vers le serveur et ouvre un groupe d'options (avec {}) pour configurer l'envoi :
            const REPONSE_SERVEUR_LOGIN = await fetch('http://localhost:5678/api/users/login', {
                // On précise qu'on utilise la méthode POST pour ENVOYER les données :
                // (contrairement à GET qui est le "reglage" par defaut de la cde fetch)
                method: "POST",
                // On dit au serveur qu'on lui envoie des données au format JSON :
                headers: { "Content-Type": "application/json" },//(headers c'est comme l'ENVELOPE des données)                
                body: JSON.stringify({ // (body est la LETTRE) "stringify" est un traducteur. Il prend l'objet JavaScript
                // et le transforme en une longue chaîne de texte (format JSON)                    
                    email: EMAIL_SAISI,
                    password: PASSWORD_SAISI
                })
            }); // Fermeture du fetch

            // On transforme la réponse brute en objet JSON utilisable :
            const REPONSE_UTILISATEUR = await REPONSE_SERVEUR_LOGIN.json();
            console.log(REPONSE_UTILISATEUR);

            // On crée une variable pour viser la balise "message-erreur" vide :
            const MESSAGE_ERREUR = document.getElementById("message-erreur");

            if (REPONSE_UTILISATEUR.token) {// On check si l'utilisateur a saisi l'email et mdp valide
            // procédure pour connexion :
            // On range le token dans l' "armoire" du navigateur pour s'en servir plus tard :
            window.localStorage.setItem("token", REPONSE_UTILISATEUR.token);
            // (window.localStorage : L' armoire)
            // (.setItem("token", ...) : pose d'étiquette "token" sur l'étagère)
            // (REPONSE_UTILISATEUR.token : C'est la valeur qu'on range dedans)
            // On redirige l'utilisateur vers la page d'accueil :
            window.location.href = "index.html";//C'est la barre d'adresse du navigateur.
            } else {
            // On écrit le message d'erreur dans la balise prévue :
            MESSAGE_ERREUR.innerText = "Erreur dans l’identifiant ou le mot de passe";
            }

        });// Fin de l'addEventListener




