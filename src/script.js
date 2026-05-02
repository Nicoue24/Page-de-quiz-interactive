/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Quiz Data
const questions = [
  {
    question: "Quelle entreprise a développé le langage de programmation Java ?",
    options: ["Microsoft", "Oracle (ex-Sun Microsystems)", "Google", "Apple"],
    answer: 1
  },
  {
    question: "Que signifie 'HTTP' ?",
    options: [
      "HyperText Transfer Protocol",
      "Hyperlink Text Transfer Process",
      "High Tech Transfer Protocol",
      "HyperText Technical Process"
    ],
    answer: 0
  },
  {
    question: "En quelle année le premier iPhone est-il sorti ?",
    options: ["2005", "2007", "2009", "2010"],
    answer: 1
  },
  {
    question: "Lequel de ces langages est principalement utilisé pour le style d'une page web ?",
    options: ["Python", "JavaScript", "SQL", "CSS"],
    answer: 3
  },
  {
    question: "Quel est le composant 'cerveau' d'un ordinateur ?",
    options: ["RAM", "Disque Dur", "CPU (Processeur)", "GPU (Carte Graphique)"],
    answer: 2
  },
  {
    question: "Quelle balise HTML est utilisée pour créer un lien hypertexte ?",
    options: ["<link>", "<a>", "<href>", "<button>"],
    answer: 1
  },
  {
    question: "Qui est le fondateur de Linux ?",
    options: ["Bill Gates", "Steve Jobs", "Linus Torvalds", "Mark Zuckerberg"],
    answer: 2
  },
  {
    question: "Quel protocole est utilisé pour envoyer des e-mails ?",
    options: ["FTP", "HTTP", "SMTP", "SSH"],
    answer: 2
  },
  {
    question: "Quelle extension de fichier est typiquement utilisée pour JavaScript ?",
    options: [".java", ".script", ".js", ".jsx"],
    answer: 2
  },
  {
    question: "Comment appelle-t-on une erreur dans un programme informatique ?",
    options: ["Un Virus", "Un Bug", "Une Failure", "Un Crash"],
    answer: 1
  }
];

// State Management
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let shuffledQuestions = [];
let timeLeft = 30;
let timerId = null;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const quizContainer = document.getElementById('quiz-container');
const questionView = document.getElementById('question-view');
const resultView = document.getElementById('result-view');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const progressDisplay = document.getElementById('progress-bar');
const counterDisplay = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const totalQuestionsDisplay = document.getElementById('total-questions-display');
const resultMessage = document.getElementById('result-message');
const feedbackBadge = document.getElementById('feedback-badge');
const resultIcon = document.getElementById('result-icon');
const restartBtn = document.getElementById('restart-btn');

/**
 * Timer Logic
 */
function startTimer() {
  clearInterval(timerId);
  timeLeft = 30;
  timerDisplay.classList.remove('hidden');
  timerDisplay.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
  
  timerId = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
    
    if (timeLeft <= 5) {
      timerDisplay.classList.add('animate-pulse', 'text-red-600');
    } else {
      timerDisplay.classList.remove('animate-pulse', 'text-red-600');
    }

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleNext(); // Auto-skip on timeout
    }
  }, 1000);
}

/**
 * Initialize the Quiz
 */
function initQuiz() {
  // Bonus: Shuffle questions
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  
  resultView.classList.add('hidden');
  questionView.classList.remove('hidden');
  
  loadQuestion();
}

/**
 * Load a single question into the view
 */
function loadQuestion() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  selectedOptionIndex = null;
  nextBtn.disabled = true;
  nextBtn.textContent = (currentQuestionIndex === shuffledQuestions.length - 1) ? "Terminer" : "Suivant";

  // Update UI Text
  questionText.textContent = currentQuestion.question;
  counterDisplay.textContent = `Question ${currentQuestionIndex + 1} / ${shuffledQuestions.length}`;
  
  // Progress bar
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  progressDisplay.style.width = `${progress}%`;

  // Clear and Create Options
  optionsContainer.innerHTML = '';
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'w-full text-left p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-4 group opacity-0 translate-y-4';
    button.style.animation = `fadeInSlide 0.3s ease forwards ${index * 0.1}s`;
    button.innerHTML = `
      <span class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-200 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white font-bold transition-all">
        ${String.fromCharCode(65 + index)}
      </span>
      <span class="flex-grow font-medium">${option}</span>
    `;
    
    button.onclick = () => selectOption(index, button);
    optionsContainer.appendChild(button);
  });

  startTimer();
}

/**
 * Handle option selection
 */
function selectOption(index, buttonElement) {
  selectedOptionIndex = index;
  nextBtn.disabled = false;

  // Visual feedback for selection
  const allButtons = optionsContainer.querySelectorAll('button');
  allButtons.forEach(btn => {
    btn.classList.remove('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-200');
    btn.querySelector('span:first-child').classList.remove('bg-emerald-500', 'text-white', 'border-emerald-500');
  });

  buttonElement.classList.add('border-emerald-500', 'bg-emerald-50', 'ring-2', 'ring-emerald-200');
  buttonElement.querySelector('span:first-child').classList.add('bg-emerald-500', 'text-white', 'border-emerald-500');
}

/**
 * Handle "Next" button click
 */
function handleNext() {
  clearInterval(timerId);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  
  // Check answer (only if something was selected)
  if (selectedOptionIndex !== null && selectedOptionIndex === currentQuestion.answer) {
    score++;
  }

  // Animation exit
  questionView.style.opacity = '0';
  questionView.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    currentQuestionIndex++;
    questionView.style.opacity = '1';
    questionView.style.transform = 'translateY(0)';

    if (currentQuestionIndex < shuffledQuestions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 300);
}

/**
 * Display final results
 */
function showResults() {
  questionView.classList.add('hidden');
  resultView.classList.remove('hidden');

  scoreDisplay.textContent = score;
  totalQuestionsDisplay.textContent = shuffledQuestions.length;

  const percentage = (score / shuffledQuestions.length) * 100;
  
  let feedback = "";
  let colorClass = "";
  let badgeColor = "";
  let icon = "";

  if (percentage >= 80) {
    feedback = "Excellent ! Vous êtes un véritable expert.";
    colorClass = "bg-emerald-500";
    badgeColor = "bg-emerald-100 text-emerald-700";
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`;
  } else if (percentage >= 50) {
    feedback = "Pas mal ! Vous avez de bonnes bases.";
    colorClass = "bg-orange-500";
    badgeColor = "bg-orange-100 text-orange-700";
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`;
  } else {
    feedback = "Vous pouvez faire mieux ! Continuez d'apprendre.";
    colorClass = "bg-red-500";
    badgeColor = "bg-red-100 text-red-700";
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 12-2 2-2-2"></path><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="m4.93 4.93 2.83 2.83"></path><path d="m16.24 16.24 2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76 2.83-2.83"></path></svg>`;
  }

  resultMessage.textContent = feedback;
  resultIcon.innerHTML = icon;
  resultIcon.className = `w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl text-white text-4xl shadow-lg border-4 border-white/20 ${colorClass}`;
  feedbackBadge.textContent = percentage >= 80 ? "Bon" : percentage >= 50 ? "Moyen" : "Mauvais";
  feedbackBadge.className = `inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 ${badgeColor}`;
}

// Event Listeners
nextBtn.addEventListener('click', handleNext);
restartBtn.addEventListener('click', initQuiz);

// Entry Point
document.addEventListener('DOMContentLoaded', initQuiz);
