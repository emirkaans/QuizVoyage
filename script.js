// Containers & Elements
const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const roundScoreElement = document.getElementById("round-score");
const lastScoreElement = document.getElementById("last-score");
const spinnerElement = document.querySelector(".loader");

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
    renderSpinner();
    renderQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function renderSpinner() {
  spinnerElement.classList.add("loader-hidden");
  spinnerElement.addEventListener("transitionend", () => {
    document.body.removeChild("loader");
  });
}

function renderQuestion() {
  if (currentQuestion < questions.length) {
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
  } else {
    renderResult();
  }
}

function renderChoices(choices) {
  choices.forEach((choice) => {
    const choiceButton = document.createElement("button");
    choiceButton.textContent = choice;
    const isCorrect = choice === questions[currentQuestion].correct_answer;

    choiceButton.addEventListener("click", () =>
      checkAnswer(isCorrect, questions[currentQuestion].question, choice)
    );
    choicesElement.appendChild(choiceButton);
  });
}

function checkAnswer(isCorrect, question, answer) {
  if (isCorrect) {
    roundScore += 10;
  }
  localStorage.setItem("lastScore", roundScore);
  currentQuestion++;

  saveQuestion(question, answer);
  renderQuestion();
}

function saveQuestion(question, answer) {
  const questionObj = {
    question,
    answer,
  };

  const questionObj_serialized = JSON.stringify(questionObj);

  localStorage.setItem(`question${currentQuestion}`, questionObj_serialized);
}

function renderResult() {
  questionContainer.style.display = "none";
  resultContainer.style.display = "block";
  roundScoreElement.textContent = roundScore + "/100";
}

function renderLastScore() {
  lastScoreElement.textContent = lastScore;
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
