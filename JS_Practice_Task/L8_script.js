// Elements
const userType = document.getElementById("userType");
const rollField = document.getElementById("rollField");
const deptField = document.getElementById("deptField");
const submitBtn = document.getElementById("submitBtn");
const msg = document.getElementById("msg");
const themeSwitch = document.getElementById("themeSwitch");
const themeLabel = document.getElementById("themeLabel");

// Handle user type selection
userType.addEventListener("change", () => {
    rollField.classList.add("hidden");
    deptField.classList.add("hidden");
    rollField.classList.remove("show");
    deptField.classList.remove("show");
    submitBtn.classList.add("hidden");

    if (userType.value === "student") {
        rollField.classList.remove("hidden");
        setTimeout(() => rollField.classList.add("show"), 20);
    } else if (userType.value === "teacher") {
        deptField.classList.remove("hidden");
        setTimeout(() => deptField.classList.add("show"), 20);
    }

    submitBtn.classList.remove("hidden");
});

// Submit button
submitBtn.addEventListener("click", () => {

    msg.style.color = "var(--text)";

    if (userType.value === "student") {
        const roll = document.getElementById("roll").value.trim();
        if (!roll) {
            msg.textContent = "Please enter your roll number!";
            msg.style.color = "red";
            return;
        }
        msg.textContent = "Student Registered Successfully!";
    }

    else if (userType.value === "teacher") {
        const dept = document.getElementById("dept").value.trim();
        if (!dept) {
            msg.textContent = "Please enter your department!";
            msg.style.color = "red";
            return;
        }
        msg.textContent = "Teacher Registered Successfully!";
    }
});

// THEME HANDLING
const body = document.body;

// Load theme from storage
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    themeSwitch.checked = true;
    themeLabel.textContent = "Dark Mode";
}

// Toggle theme
themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        body.classList.add("dark");
        themeLabel.textContent = "Dark Mode";
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark");
        themeLabel.textContent = "Light Mode";
        localStorage.setItem("theme", "light");
    }
});
