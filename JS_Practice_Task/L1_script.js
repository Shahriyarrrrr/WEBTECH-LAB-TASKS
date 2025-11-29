const form = document.getElementById('registrationForm');
const fullname = document.getElementById('fullname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const phone = document.getElementById('phone');

const nameHelp = document.getElementById('nameHelp');
const emailHelp = document.getElementById('emailHelp');
const passwordHelp = document.getElementById('passwordHelp');
const confirmHelp = document.getElementById('confirmHelp');
const phoneHelp = document.getElementById('phoneHelp');

const pwBar = document.getElementById('pwBar');
const statusMessage = document.getElementById('statusMessage');
const submitBtn = document.getElementById('submitBtn');

const togglePassword = document.getElementById('togglePassword');
const toggleConfirm = document.getElementById('toggleConfirm');

function setError(el, helpEl, message){
  el.classList.remove('input-valid');
  el.classList.add('input-invalid');
  helpEl.classList.add('error');
  helpEl.classList.remove('success');
  helpEl.textContent = message;
}

function setSuccess(el, helpEl, message){
  el.classList.remove('input-invalid');
  el.classList.add('input-valid');
  helpEl.classList.remove('error');
  helpEl.classList.add('success');
  helpEl.textContent = message || '';
}

function clearState(el, helpEl){
  el.classList.remove('input-invalid','input-valid');
  helpEl.classList.remove('error','success');
  helpEl.textContent = '';
}

function trimAll(){
  fullname.value = fullname.value.trim();
  email.value = email.value.trim();
  password.value = password.value.trim();
  confirmPassword.value = confirmPassword.value.trim();
  phone.value = phone.value.trim();
}

/* Validation utilities */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(value){
  return emailRegex.test(value);
}

function passwordScore(pw){
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score; // 0..5
}

function updatePwMeter(){
  const pw = password.value;
  const score = passwordScore(pw);
  const percentage = (score / 5) * 100;
  pwBar.style.width = percentage + '%';

  if (score <= 1) {
    pwBar.style.filter = 'saturate(0.6) contrast(0.9)';
  } else if (score <= 3) {
    pwBar.style.filter = 'saturate(0.95)';
  } else {
    pwBar.style.filter = 'saturate(1.2)';
  }
}

/* phone validation: allow 11 digits typical for BD; adjust if needed */
function validatePhone(v){
  return /^\d{11}$/.test(v);
}

/* Live validation handlers */
fullname.addEventListener('input', () => {
  const v = fullname.value.trim();
  if (!v) {
    setError(fullname, nameHelp, 'Full name is required.');
  } else {
    setSuccess(fullname, nameHelp, '');
  }
});

email.addEventListener('input', () => {
  const v = email.value.trim();
  if (!v) {
    setError(email, emailHelp, 'Email is required.');
  } else if (!validateEmail(v)) {
    setError(email, emailHelp, 'Enter a valid email (example: you@example.com).');
  } else {
    setSuccess(email, emailHelp, '');
  }
});

password.addEventListener('input', () => {
  updatePwMeter();
  const v = password.value;
  if (v.length < 6) {
    setError(password, passwordHelp, 'Password must be at least 6 characters.');
  } else {
    setSuccess(password, passwordHelp, '');
  }

  // if confirm has content, re-check match
  if (confirmPassword.value.length) {
    if (v !== confirmPassword.value) {
      setError(confirmPassword, confirmHelp, 'Passwords do not match.');
    } else {
      setSuccess(confirmPassword, confirmHelp, 'Passwords match.');
    }
  }
});

confirmPassword.addEventListener('input', () => {
  if (confirmPassword.value !== password.value) {
    setError(confirmPassword, confirmHelp, 'Passwords do not match.');
  } else {
    setSuccess(confirmPassword, confirmHelp, 'Passwords match.');
  }
});

/* prevent paste into confirm password to encourage manual retype (lab suggestion) */
confirmPassword.addEventListener('paste', (e) => e.preventDefault());

phone.addEventListener('input', () => {
  const v = phone.value.trim();
  // auto-strip non-digit characters as user types
  phone.value = v.replace(/\D/g,'');
  if (!phone.value) {
    setError(phone, phoneHelp, 'Phone number is required.');
  } else if (!validatePhone(phone.value)) {
    setError(phone, phoneHelp, 'Phone must be 11 digits (numbers only).');
  } else {
    setSuccess(phone, phoneHelp, '');
  }
});

/* toggles */
togglePassword.addEventListener('click', () => {
  const t = password;
  t.type = (t.type === 'password') ? 'text' : 'password';
  togglePassword.textContent = (t.type === 'password') ? 'Show' : 'Hide';
});
toggleConfirm.addEventListener('click', () => {
  const t = confirmPassword;
  t.type = (t.type === 'password') ? 'text' : 'password';
  toggleConfirm.textContent = (t.type === 'password') ? 'Show' : 'Hide';
});

/* final form submit */
form.addEventListener('submit', function(e){
  e.preventDefault();
  trimAll();
  clearState(fullname, nameHelp);
  clearState(email, emailHelp);
  clearState(password, passwordHelp);
  clearState(confirmPassword, confirmHelp);
  clearState(phone, phoneHelp);
  statusMessage.textContent = '';
  statusMessage.className = 'status';

  let valid = true;

  if (!fullname.value) {
    setError(fullname, nameHelp, 'Full name is required.');
    valid = false;
  }

  if (!email.value || !validateEmail(email.value)) {
    setError(email, emailHelp, 'Valid email required.');
    valid = false;
  }

  if (password.value.length < 6) {
    setError(password, passwordHelp, 'Password must be at least 6 characters.');
    valid = false;
  }

  if (password.value !== confirmPassword.value) {
    setError(confirmPassword, confirmHelp, 'Passwords do not match.');
    valid = false;
  }

  if (!phone.value || !validatePhone(phone.value)) {
    setError(phone, phoneHelp, 'Phone must be 11 digits (numbers only).');
    valid = false;
  }

  // additional stronger checks (example: warn if weak password)
  const score = passwordScore(password.value);
  if (score <= 1) {
    setError(password, passwordHelp, 'Password is too weak. Add uppercase, numbers, or symbols.');
    valid = false;
  }

  if (!valid) {
    statusMessage.textContent = 'Please fix the highlighted errors above.';
    statusMessage.style.color = 'var(--error)';
    return;
  }

  // Simulate a short loading state then success feedback
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';

    // success
    statusMessage.innerHTML = '<span class="success">Registration Successful!</span>';
    statusMessage.style.color = 'var(--success)';

    // reset form visual state but keep success message
    form.reset();
    pwBar.style.width = '0%';
    [fullname,email,password,confirmPassword,phone].forEach(inp => inp.classList.remove('input-valid'));
    // optional: focus on fullname for new entry
    fullname.focus();
  }, 900);
});
