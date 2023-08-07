// Containers & Elements
const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");
const answersContainer = document.getElementById("answers-container");
const lastScoreContainer = document.getElementById("last-score-container");

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const roundScoreElement = document.getElementById("round-score");
const lastScoreElement = document.getElementById("last-score");
const spinnerElement = document.querySelector(".loader");
const btnTryAgain = document.getElementById("btn-try-again");

// Conditions
let currentQuestion = 0;
let lastScore = 0;
let roundScore = 0;
let questions = [];

// Functions
async function fetchQuestions() {
  const APIUrl = "https://opentdb.com/api.php?amount=10&type=multiple";

  try {
    const res = await fetch(APIUrl);
    const data = await res.json();
    questions = data.results;
    removeSpinner();
    renderQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function renderSpinner() {
  spinnerElement.classList.remove("loader-hidden");
}

function removeSpinner() {
  spinnerElement.classList.add("loader-hidden");
}

function renderQuestion() {
  if (currentQuestion >= questions.length) {
    renderResult();
  } else {
    const formattedQuestion = removeCharacters(
      questions[currentQuestion].question
    );
    questionElement.textContent = `${
      currentQuestion + 1
    }. ${formattedQuestion}`;
    choicesElement.innerHTML = "";

    const choices = [
      ...questions[currentQuestion].incorrect_answers,
      questions[currentQuestion].correct_answer,
    ];

    shuffleArray(choices);
    renderChoices(choices);
  }
}

function renderChoices(choices) {
  choices.forEach((choice) => {
    const choiceButton = document.createElement("button");
    choiceButton.textContent = choice;
    const isCorrect = choice === questions[currentQuestion].correct_answer;

    choiceButton.addEventListener("click", () =>
      checkAnswer(isCorrect, questions[currentQuestion], choice)
    );
    choicesElement.appendChild(choiceButton);
  });
}

function checkAnswer(isCorrect, question, answer) {
  if (isCorrect) {
    roundScore += 10;
  }
  currentQuestion++;

  saveQuestion(question, answer);
  renderQuestion();
}

function saveQuestion(question, answer) {
  const questionObj = {
    question,
    answer: removeCharacters(answer),
  };

  const questionObj_serialized = JSON.stringify(questionObj);

  localStorage.setItem(`question${currentQuestion}`, questionObj_serialized);
}

function renderResult() {
  // DOM
  questionContainer.style.display = "none";
  resultContainer.style.display = "block";
  roundScoreElement.textContent = roundScore + "/100";
  btnTryAgain.style.display = "block";
  lastScoreContainer.style.display = "none";

  let answers = [];

  // Getting answers from Local Storage
  for (let i = 1; i <= questions.length; i++) {
    answers.push(JSON.parse(localStorage.getItem(`question${i}`)));
  }

  renderAnswers(answers);

  // Setting lastScore to Local Storage
  localStorage.setItem("lastScore", roundScore);
}

function renderAnswers(answers) {
  answers.forEach((answer, i) => {
    answerElement = document.createElement("div");
    answerElement.id = "answer";

    // Conditional Rendering by Correctness
    if (answer.answer === answer.question.correct_answer) {
      const html = `
      <span>
        <b>${i + 1}.</b> ${removeCharacters(answer.question.question)}
      </span>
      <span> <b id="correct-answer"> ✅ ${answer.answer} </b> 
      </span>
      `;
      answerElement.innerHTML = html;
    }

    if (answer.answer !== answer.question.correct_answer) {
      const html = `
      <span>
        <b>${i + 1}.</b> ${removeCharacters(answer.question.question)}
      </span>
    <span>
     <b id="wrong-answer"> ❌ ${
       answer.answer
     } </b>   / <b id="correct-answer"> ✅ ${answer.question.correct_answer} 
        </b>  
    </span>
      `;

      answerElement.innerHTML = html;
    }

    answersContainer.appendChild(answerElement);
  });
}

function renderLastScore() {
  lastScoreElement.textContent = lastScore;
}

function init() {
  renderSpinner();

  // Reset Conditions
  currentQuestion = 0;
  roundScore = 0;
  questions = [];

  // Getting Last Score
  lastScore = localStorage.getItem("lastScore")
    ? parseInt(localStorage.getItem("lastScore"))
    : "";

  // Clear Previous Answers
  answersContainer.innerHTML = "";

  renderLastScore();
  fetchQuestions();

  // Reset DOM
  btnTryAgain.style.display = "none";
  questionContainer.style.display = "block";
  resultContainer.style.display = "none";
  lastScoreContainer.style.display = "block";
}

// Helper Functions
function removeCharacters(question) {
  return question
    .replace(/(&quot\;)/g, '"')
    .replace(/(&rsquo\;)/g, '"')
    .replace(/(&#039\;)/g, "'")
    .replace(/(&amp\;)/g, '"');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Event Listeners

btnTryAgain.addEventListener("click", init);

// DOM Content Loaded - JavaScript
document.addEventListener("DOMContentLoaded", function () {
  lastScore = localStorage.getItem("lastScore")
    ? parseInt(localStorage.getItem("lastScore"))
    : "";
  renderLastScore();
  fetchQuestions();
});

// Alternative Way: jQuery

// $(document).ready(() => {
//   lastScore = localStorage.getItem("lastScore")
//     ? parseInt(localStorage.getItem("lastScore"))
//     : 0;
//   renderLastScore();
//   fetchQuestions();
// });
