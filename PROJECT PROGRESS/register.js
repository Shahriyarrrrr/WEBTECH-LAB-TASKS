const form = document.getElementById("registerForm")
const msg = document.getElementById("msg")

form.addEventListener("submit", () => {
  msg.textContent = "Processing registration..."
  msg.style.color = "#38bdf8"
})


form.addEventListener("submit", e => {
  e.preventDefault()

  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const password = passInput.value.trim()
  const role = roleInput.value
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (name === "" || email === "" || password === "" || role === "") {
    showToast("All fields are required", "error")
    return
  }

  if (name.length < 3) {
    showToast("Name must be at least 3 characters", "error")
    return
  }

  if (!pattern.test(email)) {
    showToast("Invalid email address", "error")
    return
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error")
    return
  }

  showToast("Registration successful", "success")

  setTimeout(() => {
    window.location.href = "login.html"
  }, 1500)
})
