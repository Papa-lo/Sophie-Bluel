// ============================================================
// PAGE DE CONNEXION - Script spécifique
// ============================================================

// On cible le formulaire pour pouvoir le manipuler ensuite :
const FORMULAIRE = document.querySelector("form");

// --- INTELLIGENCE Du BOUTON SE CONNECTER --- 
        // On surveille le formulaire, et si quelqu'un le soumet (clique ou entrée), exécute la fonction suivante :
        FORMULAIRE.addEventListener("submit", async function (event) {              // AJOUT DU MOT "async"
            // TRÈS IMPORTANT : On empêche la page de se recharger (action="#") :
            event.preventDefault();
            
            // On cible le boite html "email" et ".value" récupère sa "propriété" :
            const EMAIL_SAISI = document.getElementById("email").value;
            // Idem pour password :
            const PASSWORD_SAISI = document.getElementById("password").value;

            console.log("Email :", EMAIL_SAISI);
            console.log("Mot de passe :", PASSWORD_SAISI);

            const REPONSE_SERVEUR_LOGIN = await fetch('http://localhost:5678/api/users/login', {
                // On précise qu'on utilise la méthode POST pour ENVOYER les données :
                method: "POST",
                // On dit au serveur qu'on lui envoie des données au format JSON :
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ // AJOUT : Le corps du message (ce qu'on envoie)
                    email: EMAIL_SAISI,
                    password: PASSWORD_SAISI
                })
            }); // AJOUT : Fermeture du fetch

        });




