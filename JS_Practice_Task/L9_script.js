// THEME
const themeSwitch = document.getElementById("themeSwitch");
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    }
});

// TYPING ANIMATION
const typingText = document.getElementById("typingText");
const roles = [
    "CSE Student",
    "AI & ML Enthusiast",
    "Cybersecurity Learner",
    "Full Stack Developer"
];
let index = 0;
let charIndex = 0;

function typeEffect() {
    if (charIndex < roles[index].length) {
        typingText.textContent += roles[index].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 80);
    } else {
        setTimeout(() => {
            typingText.textContent = "";
            charIndex = 0;
            index = (index + 1) % roles.length;
            typeEffect();
        }, 1200);
    }
}
typeEffect();

// NAVIGATION
const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

navBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        navBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const target = btn.dataset.target;

        sections.forEach(sec => {
            sec.classList.remove("show");
            if (sec.id === target) sec.classList.add("show");
        });
    });
});

// CONTACT FORM VALIDATION
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const msgInput = document.getElementById("msgInput");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const msgError = document.getElementById("msgError");
const successMsg = document.getElementById("successMsg");

document.getElementById("submitBtn").addEventListener("click", () => {

    let valid = true;
    successMsg.textContent = "";

    // Name
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Name cannot be empty.";
        valid = false;
    } else nameError.textContent = "";

    // Email
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(emailInput.value.trim())) {
        emailError.textContent = "Enter a valid email.";
        valid = false;
    } else emailError.textContent = "";

    // Message
    if (msgInput.value.trim().length < 10) {
        msgError.textContent = "Message must be at least 10 characters.";
        valid = false;
    } else msgError.textContent = "";

    if (valid) {
        successMsg.textContent = "Message sent successfully!";
    }
});
