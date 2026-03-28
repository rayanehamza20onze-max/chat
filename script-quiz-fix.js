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

    quizStarted = true;

    // Affiche la question actuelle
    const currentData = quizData[currentStep];
    questionContainer.innerText = `Question ${currentStep + 1}/${quizData.length}: ${currentData.q}`;
    
    // Réinitialise les options
    optionsContainer.innerHTML = "";
    optionsContainer.style.display = "grid";
    optionsContainer.style.gridTemplateColumns = "1fr 1fr";
    optionsContainer.style.gap = "15px";
    optionsContainer.style.width = "100%";

    // Crée les boutons de réponse
    currentData.a.forEach((optionText, index) => {
        const btn = document.createElement("button");
        btn.innerText = optionText;
        btn.className = "quiz-btn";
        
        btn.addEventListener('mouseover', function() {
            if (!this.dataset.answered) {
                this.style.background = "var(--primary)";
                this.style.color = "#000";
            }
        });
        
        btn.addEventListener('mouseout', function() {
            if (!this.dataset.answered) {
                this.style.background = "transparent";
                this.style.color = "var(--text-main)";
            }
        });
        
        btn.onclick = () => {
            // Marque les boutons comme répondus
            document.querySelectorAll('.quiz-btn').forEach(b => {
                b.dataset.answered = "true";
                b.style.pointerEvents = "none";
            });
            
            const isCorrect = index === currentData.c;
            
            if (isCorrect) {
                btn.classList.add('correct');
                btn.style.background = "var(--success)";
                btn.style.borderColor = "var(--success)";
                btn.style.color = "white";
                finalScore++;
            } else {
                btn.classList.add('incorrect');
                btn.style.background = "var(--danger)";
                btn.style.borderColor = "var(--danger)";
                btn.style.color = "white";
                
                // Affiche la bonne réponse
                document.querySelectorAll('.quiz-btn').forEach((b, i) => {
                    if (i === currentData.c) {
                        b.style.background = "var(--success)";
                        b.style.borderColor = "var(--success)";
                        b.style.color = "white";
                    }
                });
            }
            
            // Met à jour le score
            scoreDisplay.innerHTML = `Score: <strong>${finalScore}/${quizData.length}</strong>`;
            
            // Passe à la question suivante après 2 secondes
            setTimeout(() => {
                currentStep++;
                runQuiz();
            }, 2000);
        };
        
        optionsContainer.appendChild(btn);
    });

    // Affiche le score initial
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
        message = "😊 Très bien ! Vous avez une excellente compréhension.";
    } else if (percentage >= 60) {
        message = "📚 Pas mal ! Continuez vos recherches sur l'IA.";
    } else if (percentage >= 40) {
        message = "💪 À revoir ! Relisez le contenu et réessayez.";
    } else {
        message = "🚀 C'est un début ! Explorez plus sur ChatGPT.";
    }
    
    const resultDiv = document.createElement('div');
    resultDiv.style.textAlign = 'center';
    resultDiv.style.padding = '2rem';
    resultDiv.style.background = 'rgba(16, 163, 127, 0.15)';
    resultDiv.style.borderRadius = '15px';
    resultDiv.style.borderLeft = '5px solid var(--primary)';
    resultDiv.style.marginBottom = '2rem';
    resultDiv.innerHTML = `
        <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.5em;">${message}</h3>
        <p style="color: var(--text-muted); margin-bottom: 1rem;">Score : <strong style="color: var(--primary); font-size: 1.3em;">${finalScore} / ${quizData.length}</strong></p>
        <p style="color: var(--text-muted);">Résultat : <strong style="color: var(--primary);">${Math.round(percentage)}%</strong></p>
    `;
    optionsContainer.appendChild(resultDiv);
    
    const restartBtn = document.createElement('button');
    restartBtn.innerHTML = '🔄 Recommencer le Quiz';
    restartBtn.className = 'quiz-btn';
    restartBtn.style.marginTop = '1.5rem';
    restartBtn.style.padding = '1rem 2rem';
    restartBtn.style.fontSize = '1.1em';
    restartBtn.style.width = '100%';
    restartBtn.style.maxWidth = '400px';
    restartBtn.style.display = 'block';
    restartBtn.style.margin = '2rem auto 0';
    restartBtn.style.background = 'var(--primary)';
    restartBtn.style.color = '#000';
    restartBtn.style.cursor = 'pointer';
    restartBtn.onclick = () => {
        resetQuiz();
    };
    optionsContainer.appendChild(restartBtn);
}

function resetQuiz() {
    currentStep = 0;
    finalScore = 0;
    quizStarted = false;
    runQuiz();
}
