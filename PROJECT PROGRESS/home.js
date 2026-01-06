const form = document.getElementById("alertForm")
const email = document.getElementById("email")
const msg = document.getElementById("msg")

form.addEventListener("submit", e => {
  e.preventDefault()

  const value = email.value.trim()
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (value === "") {
    msg.textContent = "Email is required"
    msg.style.color = "#dc2626"
    return
  }

  if (!pattern.test(value)) {
    msg.textContent = "Enter a valid email address"
    msg.style.color = "#dc2626"
    return
  }

  msg.textContent = "Subscribed successfully for emergency alerts"
  msg.style.color = "#16a34a"
  email.value = ""
})
