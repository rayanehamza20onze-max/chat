/**
 * ============================================================================
 * PROJET : LA RÉVOLUTION CHATGPT
 * AUTEURS : Rayane, Selim & Antoine
 * DESCRIPTION : Script de gestion de l'interface interactive (Modales & Quiz)
 * ============================================================================
 */

/**
 * 1. GESTION DES FENÊTRES MODALES
 */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = "hidden";
        
        if (modalId === 'quiz-modal') {
            setTimeout(() => {
                resetQuiz();
            }, 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = "auto";
        
        const iframes = modal.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const src = iframe.src;
            iframe.src = '';
            setTimeout(() => { iframe.src = src; }, 100);
        });
    }
}

// Fermeture au clic sur le X
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
});

// Fermeture en cliquant en dehors de la modale
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

/**
 * 2. SYSTÈME DE QUIZ (QCM)
 */

const quizData = [
    { 
        q: "En quelle année la société OpenAI a-t-elle été fondée ?", 
        a: ["2012", "2015", "2022"], 
        c: 1 
    },
    { 
        q: "ChatGPT est basé sur l'architecture 'Transformer'. Qu'est-ce que c'est ?", 
        a: ["Un robot de film", "Un modèle mathématique de traitement du langage", "Un type de processeur"], 
        c: 1 
    },
    { 
        q: "En combien de temps ChatGPT a atteint 100 millions d'utilisateurs ?", 
        a: ["2 mois", "6 mois", "1 an"], 
        c: 0 
    },
    { 
        q: "Quel est le rôle du 'Prompt Engineering' ?", 
        a: ["Réparer les serveurs", "L'art de rédiger des instructions précises pour l'IA", "Coder l'algorithme de base"], 
        c: 1 
    },
    { 
        q: "Qu'est-ce qu'un 'Token' dans le fonctionnement de ChatGPT ?", 
        a: ["Une pièce de monnaie", "Une unité de texte (morceau de mot)", "Un mot de passe"], 
        c: 1 
    },
    { 
        q: "Quelle entreprise a investi 10 milliards de dollars dans OpenAI ?", 
        a: ["Google", "Apple", "Microsoft"], 
        c: 2 
    },
    { 
        q: "ChatGPT est-il capable de réfléchir et de comprendre le sens de ses phrases ?", 
        a: ["Oui, il a une conscience", "Non, il prédit statistiquement le mot suivant", "Seulement quand il est connecté à Internet"], 
        c: 1 
    },
    { 
        q: "Quel est le principal problème éthique lié aux données d'entraînement ?", 
        a: ["La consommation d'eau", "Les biais (préjugés) sexistes ou racistes", "Le prix de l'abonnement"], 
        c: 1 
    },
    { 
        q: "Quelle est la principale différence entre ChatGPT et Google ?", 
        a: ["Google est plus rapide", "ChatGPT génère une réponse unique au lieu d'une liste de liens", "Il n'y a aucune différence"], 
        c: 1 
    }
];

let currentStep = 0;
let finalScore = 0;

function runQuiz() {
    const questionContainer = document.getElementById("question");
    const optionsContainer = document.getElementById("options-container");
    const scoreDisplay = document.getElementById("score-display");

    if (!questionContainer || !optionsContainer) {
        console.error("❌ Quiz containers not found!");
        return;
    }

    // Si le quiz est terminé
    if (currentStep >= quizData.length) {
        displayQuizResults(questionContainer, optionsContainer, scoreDisplay);
        return;
    }

    // Affiche la question actuelle
    const currentData = quizData[currentStep];
    questionContainer.innerHTML = `Question ${currentStep + 1}/${quizData.length}<br>${currentData.q}`;
    
    // Réinitialise les options
    optionsContainer.innerHTML = "";
    optionsContainer.style.display = "grid";
    optionsContainer.style.gridTemplateColumns = "1fr 1fr";
    optionsContainer.style.gap = "20px";

    // Crée les boutons de réponse
    currentData.a.forEach((optionText, index) => {
        const btn = document.createElement("button");
        btn.innerHTML = optionText;
        btn.className = "quiz-btn";
        
        btn.onclick = function() {
            // Désactive les boutons
            document.querySelectorAll('.quiz-btn').forEach(b => {
                b.classList.add('answered');
                b.style.pointerEvents = 'none';
            });
            
            const isCorrect = index === currentData.c;
            
            // Affiche la réponse
            if (isCorrect) {
                btn.classList.add('correct');
                finalScore++;
            } else {
                btn.classList.add('incorrect');
                
                // Affiche la bonne réponse
                document.querySelectorAll('.quiz-btn').forEach((b, i) => {
                    if (i === currentData.c) {
                        b.classList.add('correct');
                    }
                });
            }
            
            // Met à jour le score
            scoreDisplay.innerHTML = `Score: <strong>${finalScore}/${quizData.length}</strong>`;
            
            // Passe à la question suivante
            setTimeout(() => {
                currentStep++;
                runQuiz();
            }, 2000);
        };
        
        optionsContainer.appendChild(btn);
    });

    // Affiche le score
    scoreDisplay.innerHTML = `Score: <strong>${finalScore}/${quizData.length}</strong>`;
}

function displayQuizResults(questionContainer, optionsContainer, scoreDisplay) {
    questionContainer.innerHTML = "🎯 Quiz Terminé !";
    optionsContainer.innerHTML = "";
    
    let message = '';
    const percentage = (finalScore / quizData.length) * 100;
    
    if (percentage === 100) {
        message = "🎉 Parfait ! Vous maîtrisez ChatGPT et l'IA !";
    } else if (percentage >= 80) {
        message = "😊 Très bien ! Excellente compréhension.";
    } else if (percentage >= 60) {
        message = "📚 Pas mal ! Continuez vos recherches.";
    } else if (percentage >= 40) {
        message = "💪 À revoir ! Relisez le contenu.";
    } else {
        message = "🚀 C'est un début ! Explorez ChatGPT.";
    }
    
    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = `
        text-align: center;
        padding: 2rem;
        background: rgba(16, 163, 127, 0.15);
        border-left: 5px solid #10a37f;
        border-radius: 15px;
        margin-bottom: 2rem;
    `;
    resultDiv.innerHTML = `
        <h3 style="color: #10a37f; margin-bottom: 1rem; font-size: 1.5em;">${message}</h3>
        <p style="color: #94949e; margin-bottom: 1rem;">Score : <strong style="color: #10a37f; font-size: 1.3em;">${finalScore} / ${quizData.length}</strong></p>
        <p style="color: #94949e;">Résultat : <strong style="color: #10a37f;">${Math.round(percentage)}%</strong></p>
    `;
    optionsContainer.appendChild(resultDiv);
    
    const restartBtn = document.createElement('button');
    restartBtn.innerHTML = '🔄 Recommencer le Quiz';
    restartBtn.className = 'quiz-btn';
    restartBtn.style.cssText = `
        margin-top: 2rem;
        width: 100%;
        max-width: 500px;
        display: block;
        margin-left: auto;
        margin-right: auto;
        background: #10a37f !important;
        color: #000 !important;
        border-color: #10a37f !important;
    `;
    restartBtn.onmouseover = function() {
        this.style.transform = 'scale(1.02)';
    };
    restartBtn.onmouseout = function() {
        this.style.transform = 'scale(1)';
    };
    restartBtn.onclick = () => {
        resetQuiz();
    };
    optionsContainer.appendChild(restartBtn);
}

function resetQuiz() {
    currentStep = 0;
    finalScore = 0;
    runQuiz();
}

// Lancer le quiz au chargement
window.addEventListener('DOMContentLoaded', function() {
    const questionContainer = document.getElementById("question");
    if (questionContainer) {
        runQuiz();
    }
});
