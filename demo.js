
let currentUser = null;

let users = JSON.parse(localStorage.getItem("examUsers")) || [];

function showPage(pageId) {
    if (pageId === "dashboardPage" ||
        pageId === "instructionsPage" ||
        pageId === "examPage" ||
        pageId === "resultPage") {

        if (!currentUser) {
            alert("Please sign in first!");
            pageId = "loginPage";
        }
    }

    document.querySelectorAll(".card").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");
}

// SIGN UP
function signup() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid email address!");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters!");
        return;
    }

    const exists = users.find(user => user.email === email);

    if (exists) {
        alert("Account already exists!");
        return;
    }

    users.push({ name, email, password });

    localStorage.setItem("examUsers", JSON.stringify(users));

    alert("Registration successful! Please sign in.");

    document.getElementById("signupName").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";

    showPage("loginPage");
}

// SIGN IN
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    currentUser = user;

    document.getElementById("studentWelcome").textContent =
        "Welcome, " + user.name;

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    showPage("dashboardPage");
}

// LOGOUT
function logout() {
    currentUser = null;
    clearInterval(timerInterval);
    showPage("homePage");
}

// EXAM QUESTIONS
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Text Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["Python", "CSS", "Java", "C++"],
        answer: 1
    },
    {
        question: "Which language makes websites interactive?",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        answer: 2
    },
    {
        question: "Which tag creates a paragraph?",
        options: ["<h1>", "<p>", "<div>", "<br>"],
        answer: 1
    },
    {
        question: "Which symbol is used for ID in CSS?",
        options: [".", "#", "*", "&"],
        answer: 1
    },
    {
        question: "Which tag creates a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: 1
    },
    {
        question: "Which is a JavaScript output method?",
        options: ["print()", "console.log()", "display()", "output()"],
        answer: 1
    },
    {
        question: "Which language is used for databases?",
        options: ["HTML", "CSS", "SQL", "XML"],
        answer: 2
    },
    {
        question: "Which keyword declares a variable?",
        options: ["var", "int", "define", "number"],
        answer: 0
    },
    {
        question: "Which tag is used to insert an image?",
        options: ["<image>", "<img>", "<pic>", "<src>"],
        answer: 1
    }
];

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);
let timeLeft = 30 * 60;
let timerInterval;

function beginExam() {
    currentQuestion = 0;
    answers = new Array(questions.length).fill(null);
    timeLeft = 30 * 60;

    document.getElementById("time").textContent = "30:00";
    document.getElementById("welcome").textContent =
        "Student: " + currentUser.name;

    showPage("examPage");
    showQuestion();
    startTimer();
}

function showQuestion() {
    const q = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("question").textContent = q.question;

    document.getElementById("progressBar").style.width =
        ((currentQuestion + 1) / questions.length * 100) + "%";

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.checked = answers[currentQuestion] === index;

        radio.addEventListener("change", () => {
            answers[currentQuestion] = index;
            createQuestionList();
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));

        optionsDiv.appendChild(label);
    });

    createQuestionList();
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function createQuestionList() {
    const list = document.getElementById("questionList");
    list.innerHTML = "";

    questions.forEach((q, index) => {
        const button = document.createElement("button");
        button.textContent = index + 1;

        if (answers[index] !== null) {
            button.classList.add("answered");
        }

        if (index === currentQuestion) {
            button.classList.add("active");
        }

        button.onclick = () => {
            currentQuestion = index;
            showQuestion();
        };

        list.appendChild(button);
    });
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById("time").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function submitExam() {
    const unanswered = answers.filter(a => a === null).length;

    if (unanswered > 0 && timeLeft > 0) {
        if (!confirm(
            `You have ${unanswered} unanswered questions. Submit exam?`
        )) {
            return;
        }
    }

    clearInterval(timerInterval);

    let score = 0;

    questions.forEach((q, index) => {
        if (answers[index] === q.answer) {
            score++;
        }
    });

    const percentage = (score / questions.length) * 100;

    document.getElementById("resultName").textContent =
        "Student: " + currentUser.name;

    document.getElementById("score").textContent =
        `Your Score: ${score}/${questions.length}`;

    document.getElementById("percentage").textContent =
        `Percentage: ${percentage}%`;

    document.getElementById("message").textContent =
        percentage >= 50
        ? "Congratulations! You Passed!"
        : "Better luck next time! Keep Practicing.";

    showPage("resultPage");
}
