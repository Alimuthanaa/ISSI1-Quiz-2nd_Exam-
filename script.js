// Define the necessary variables for the quiz
let questions = []; // Will hold the loaded questions
let currentQuestionIndex = 0; // To keep track of the current question
let score = 0; // To calculate the user's score

// Function to load questions from the JSON file
async function loadQuiz() {
    try {
        const response = await fetch("questions.json"); // Fetch the questions
        if (!response.ok) {
            throw new Error("Failed to load questions."); // Handle fetch errors
        }
        questions = await response.json(); // Parse the JSON data

        // Shuffle questions randomly
        questions = questions.sort(() => Math.random() - 0.5);

        displayQuestion(); // Display the first question
    } catch (error) {
        console.error(error);
        document.getElementById("quiz-container").innerHTML = `<p>Error loading quiz data.</p>`;
    }
}

// Function to display the current question
function displayQuestion() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // Clear the previous question

    if (currentQuestionIndex >= questions.length) {
        endQuiz(); // End the quiz if there are no more questions
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-block");

    questionDiv.innerHTML = `
        <h3>${currentQuestionIndex + 1}. ${question.question}</h3>
        ${question.options
            .map(
                (option, i) => `
            <label>
                <input type="checkbox" name="option" value="${i}">
                ${option.text}
            </label><br>
        `
            )
            .join("")}
        <div id="feedback" style="margin-top: 10px; font-weight: bold;"></div>
        <div id="summary" style="margin-top: 5px; font-size: 1.1em; color: gray;"></div>
        <button id="submit-answer">Submit Answer</button>
        <button id="next-question" disabled>Next Question</button>
    `;

    quizContainer.appendChild(questionDiv);

    // Add event listeners for buttons
    document
        .getElementById("submit-answer")
        .addEventListener("click", () => checkAnswer(question));
    document
        .getElementById("next-question")
        .addEventListener("click", loadNextQuestion);
}

// Function to check the user's answers
function checkAnswer(question) {
    const selectedOptions = Array.from(
        document.querySelectorAll('input[name="option"]:checked')
    ).map((input) => parseInt(input.value));

    const correctAnswers = question.options
        .map((option, i) => (option.correct ? i : null))
        .filter((i) => i !== null);

    const feedbackDiv = document.getElementById("feedback");
    const summaryDiv = document.getElementById("summary");

    // Reset feedback and summary
    feedbackDiv.className = "";
    summaryDiv.className = "";

    // If no options selected, display a warning
    if (selectedOptions.length === 0) {
        feedbackDiv.textContent = "Please select at least one option!";
        feedbackDiv.classList.add("warning");
        summaryDiv.textContent = ""; // Clear the summary
        return;
    }

    // Count correct and incorrect selections
    const correctCount = selectedOptions.filter((option) =>
        correctAnswers.includes(option)
    ).length;
    const incorrectCount = selectedOptions.length - correctCount;

    // Calculate points
    const totalCorrect = correctAnswers.length;
    const points = correctCount * 0.25 - incorrectCount * 0.25;
    score += points;

    // Determine feedback color and text
    if (correctCount === totalCorrect && incorrectCount === 0) {
        feedbackDiv.classList.add("correct");
        feedbackDiv.textContent = `Perfect! You selected all ${totalCorrect} correct answers.`;
    } else if (correctCount === 0 && incorrectCount > 0) {
        feedbackDiv.classList.add("incorrect");
        feedbackDiv.textContent = `Incorrect. You selected ${incorrectCount} wrong answers.`;
    } else {
        feedbackDiv.classList.add("partial");
        feedbackDiv.textContent = `You selected ${correctCount} correct answer(s) out of ${totalCorrect}. Wrong selections: ${incorrectCount}.`;
    }

    // Add summary area with concise feedback
    summaryDiv.textContent = `Score: ${score.toFixed(2)} points (${correctCount}/${totalCorrect} correct answers).`;

    // Highlight checkboxes
    document.querySelectorAll('input[name="option"]').forEach((checkbox, i) => {
        const label = checkbox.parentElement;
        if (correctAnswers.includes(i)) {
            // Correct answers: green background
            label.style.color = "#2e7d32"; /* Softer green */
            checkbox.style.outline = "2px solid #81c784";
        } else if (selectedOptions.includes(i)) {
            // Incorrect answers selected by user: red background
            label.style.color = "#c62828"; /* Softer red */
            checkbox.style.outline = "2px solid #e57373";
        }
    });

    // Disable the submit button and enable the next button
    document.getElementById("submit-answer").disabled = true;
    document.getElementById("next-question").disabled = false;
}

// Function to load the next question
function loadNextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Function to end the quiz and display the final score
function endQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your final score: ${score.toFixed(2)} points</p>
        <p>Thanks for playing!</p>
    `;
}

// Initialize the quiz
loadQuiz();