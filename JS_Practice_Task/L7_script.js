// ---- ELEMENTS ----
const text = document.getElementById("sampleText");

// Controls
const bgPicker = document.getElementById("bgPicker");
const fontSlider = document.getElementById("fontSlider");
const fontFamily = document.getElementById("fontFamily");

const upperBtn = document.getElementById("upperBtn");
const lowerBtn = document.getElementById("lowerBtn");
const capBtn = document.getElementById("capBtn");

const alignBtns = document.querySelectorAll(".align-btn");

const paddingSlider = document.getElementById("paddingSlider");
const marginSlider = document.getElementById("marginSlider");

const borderWidth = document.getElementById("borderWidth");
const borderColor = document.getElementById("borderColor");
const borderStyle = document.getElementById("borderStyle");

const radiusSlider = document.getElementById("radiusSlider");
const shadowToggle = document.getElementById("shadowToggle");

// Save & Load
const saveBtn = document.getElementById("saveStyle");
const loadBtn = document.getElementById("loadStyle");
const resetBtn = document.getElementById("resetBtn");

// Swatches
const swatches = document.querySelectorAll(".swatch");

// CSS Output
const cssOutput = document.getElementById("cssOutput");


// ---- LIVE UPDATERS ----

// Background color picker
bgPicker.addEventListener("input", () => {
    text.style.backgroundColor = bgPicker.value;
    updateCSS();
});

// Swatch click
swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
        const color = swatch.dataset.color;
        text.style.backgroundColor = color;
        bgPicker.value = color;
        updateCSS();
    });
});

// Font size
fontSlider.addEventListener("input", () => {
    text.style.fontSize = fontSlider.value + "px";
    updateCSS();
});

// Font family
fontFamily.addEventListener("change", () => {
    text.style.fontFamily = fontFamily.value;
    updateCSS();
});

// Text transform: uppercase
upperBtn.addEventListener("click", () => {
    text.style.textTransform = "uppercase";
    updateCSS();
});

// lowercase
lowerBtn.addEventListener("click", () => {
    text.style.textTransform = "lowercase";
    updateCSS();
});

// Capitalize each word
capBtn.addEventListener("click", () => {
    text.style.textTransform = "capitalize";
    updateCSS();
});

// Alignment buttons
alignBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        alignBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        const align = btn.dataset.align;
        text.style.textAlign = align;
        updateCSS();
    });
});

// Padding
paddingSlider.addEventListener("input", () => {
    text.style.padding = paddingSlider.value + "px";
    updateCSS();
});

// Margin
marginSlider.addEventListener("input", () => {
    text.style.margin = marginSlider.value + "px";
    updateCSS();
});

// Border width
borderWidth.addEventListener("input", () => {
    text.style.borderWidth = borderWidth.value + "px";
    updateCSS();
});

// Border color
borderColor.addEventListener("input", () => {
    text.style.borderColor = borderColor.value;
    updateCSS();
});

// Border style
borderStyle.addEventListener("change", () => {
    text.style.borderStyle = borderStyle.value;
    updateCSS();
});

// Radius
radiusSlider.addEventListener("input", () => {
    text.style.borderRadius = radiusSlider.value + "px";
    updateCSS();
});

// Shadow toggle
shadowToggle.addEventListener("change", () => {
    if (shadowToggle.checked) {
        text.style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
    } else {
        text.style.boxShadow = "none";
    }
    updateCSS();
});


// ---- SAVE / LOAD SYSTEM ----

// Save style to localStorage
saveBtn.addEventListener("click", () => {
    localStorage.setItem("savedStyle", text.getAttribute("style"));
    alert("Style saved successfully!");
});

// Load saved style
loadBtn.addEventListener("click", () => {
    const saved = localStorage.getItem("savedStyle");
    if (saved) {
        text.setAttribute("style", saved);
        alert("Style loaded!");
        updateCSS();
    } else {
        alert("No saved style found.");
    }
});

// Reset everything
resetBtn.addEventListener("click", () => {
    text.removeAttribute("style");

    // Reset controls
    bgPicker.value = "#ffffff";
    fontSlider.value = 18;
    fontFamily.value = "Inter";
    paddingSlider.value = 18;
    marginSlider.value = 0;
    borderWidth.value = 0;
    radiusSlider.value = 12;
    shadowToggle.checked = false;

    alignBtns.forEach(b => b.classList.remove("active"));

    updateCSS();
});


// ---- CSS EXPORT ----
function updateCSS() {
    const styles = window.getComputedStyle(text);
    const css = `
background-color: ${styles.backgroundColor};
font-size: ${styles.fontSize};
font-family: ${styles.fontFamily};
text-align: ${styles.textAlign};
padding: ${styles.padding};
margin: ${styles.margin};
border: ${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor};
border-radius: ${styles.borderRadius};
box-shadow: ${styles.boxShadow};
text-transform: ${styles.textTransform};
`;

    cssOutput.textContent = css.trim();
}

// Initialize preview on load
updateCSS();
