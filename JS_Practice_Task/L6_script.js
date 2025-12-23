let is24Hour = false;

const clockDisplay = document.getElementById("clockDisplay");
const dateDisplay = document.getElementById("dateDisplay");
const toggleBtn = document.getElementById("toggleFormat");

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Date display
    const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
    dateDisplay.innerText = now.toLocaleDateString("en-US", options);

    // Format
    let suffix = "";
    if (!is24Hour) {
        suffix = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
    }

    // Leading zeros
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    // Add pulse animation to seconds
    clockDisplay.innerHTML = `${hours}:${minutes}:<span class="pulse">${seconds}</span> ${!is24Hour ? suffix : ""}`;
}

setInterval(updateClock, 1000);
updateClock();

// Toggle format
toggleBtn.addEventListener("click", () => {
    is24Hour = !is24Hour;
    toggleBtn.innerText = is24Hour ? "Switch to 12-hour" : "Switch to 24-hour";
    updateClock();
});
