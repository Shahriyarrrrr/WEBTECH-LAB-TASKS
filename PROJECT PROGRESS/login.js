const form = document.getElementById("loginForm")
const email = document.getElementById("email")
const password = document.getElementById("password")
const msg = document.getElementById("msg")
const toast = document.getElementById("toast")

function showToast(message, type) {
  toast.textContent = message
  toast.className = `toast show ${type}`
  setTimeout(() => {
    toast.className = "toast"
  }, 3000)
}

form.addEventListener("submit", e => {
  e.preventDefault()

  const emailValue = email.value.trim()
  const passValue = password.value.trim()
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (emailValue === "" || passValue === "") {
    showToast("All fields are required", "error")
    return
  }

  if (!pattern.test(emailValue)) {
    showToast("Invalid email address", "error")
    return
  }

  if (passValue.length < 6) {
    showToast("Password must be at least 6 characters", "error")
    return
  }

  showToast("Login successful", "success")

  setTimeout(() => {
    window.location.href = "index.html"
  }, 1500)
})
