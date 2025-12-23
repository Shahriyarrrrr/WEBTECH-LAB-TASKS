document.addEventListener('DOMContentLoaded', function () 
{
  const form = document.querySelector('form');
  const first = document.getElementById('first');
  const last = document.getElementById('last');
  const addr1 = document.getElementById('addr1');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const zip = document.getElementById('zip');
  const country = document.getElementById('country');
  const email = document.getElementById('email');
  const donationRadios = Array.from(document.querySelectorAll('input[name="donation"]'));
  const otherAmtInput = document.getElementById('otheramt');
  const recurringCheckbox = document.getElementById('recurring');
  const creditLine = document.querySelector('.credit-line');
  const monthlyInput = creditLine ? creditLine.querySelector('input[aria-label="monthly amount"]') : null;
  const monthsInput  = creditLine ? creditLine.querySelector('input[aria-label="for months"]') : null;
  const donationTypeRadios = Array.from(document.querySelectorAll('input[name="donation_type"]'));
  const ackToInput = document.getElementById('ack-to');
  const honorName = document.getElementById('honor-name');
  const honorAddr = document.getElementById('honor-addr');
  const comments = document.getElementById('comments');

  function getRow(el) 
  {
    return el ? el.closest('.form-row') : null;
  }
  const otherAmtRow = getRow(otherAmtInput);
  if (otherAmtRow) otherAmtRow.style.display = 'none';

  const creditRow = creditLine ? creditLine.closest('.form-row') : null;
  if (creditRow) creditRow.style.display = 'none';
  const ackToRow = getRow(ackToInput);
  const honorNameRow = getRow(honorName);
  const honorAddrRow = getRow(honorAddr);
  if (ackToRow) ackToRow.style.display = 'none';
  if (honorNameRow) honorNameRow.style.display = 'none';
  if (honorAddrRow) honorAddrRow.style.display = 'none';
  if (state && state.options.length > 1) state.selectedIndex = 1;
  if (country && country.options.length > 1) country.selectedIndex = 1;
  const COMMENT_LIMIT = 250;
  if (comments) {
    const counter = document.createElement('div');
    counter.style.fontSize = '12px';
    counter.style.color = '#444';
    counter.style.marginTop = '6px';
    counter.textContent = `0 / ${COMMENT_LIMIT} characters`;
    comments.parentNode.appendChild(counter);

    comments.addEventListener('input', () => 
    {
      const len = comments.value.length;
      if (len > COMMENT_LIMIT) {
        comments.value = comments.value.slice(0, COMMENT_LIMIT);
      }
      counter.textContent = `${comments.value.length} / ${COMMENT_LIMIT} characters`;
    });
  }
  const totalDisplay = document.createElement('div');
  totalDisplay.style.marginTop = '8px';
  totalDisplay.style.fontWeight = '700';
  if (creditRow) creditRow.appendChild(totalDisplay);
  
  donationRadios.forEach(r => 
    {
    r.addEventListener('change', () => {
      if (r.value === 'other' && r.checked) 
    {
        if (otherAmtRow) otherAmtRow.style.display = '';
    } 
    else 
    {
        
        const otherChecked = donationRadios.some(x => x.checked && x.value === 'other');
        if (!otherChecked && otherAmtRow) 
        {
          otherAmtRow.style.display = 'none';
          otherAmtInput.value = '';
        }
    }
      
      updateRecurringTotal();
    });
  });

  
  if (recurringCheckbox) 
    {
    recurringCheckbox.addEventListener('change', () => 
        {
      if (recurringCheckbox.checked) 
        {
        if (creditRow) creditRow.style.display = '';
        } 
    else 
    {
        if (creditRow) creditRow.style.display = 'none';
        if (monthlyInput) monthlyInput.value = '';
        if (monthsInput) monthsInput.value = '';
        totalDisplay.textContent = '';
    }
      updateRecurringTotal();
    });
  }

  donationTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const anyChecked = donationTypeRadios.some(r => r.checked);
      if (anyChecked) 
    {
        if (ackToRow) ackToRow.style.display = '';
        if (honorNameRow) honorNameRow.style.display = '';
        if (honorAddrRow) honorAddrRow.style.display = '';
      
    } 
    else 
    {
        if (ackToRow) ackToRow.style.display = 'none';
        if (honorNameRow) honorNameRow.style.display = 'none';
        if (honorAddrRow) honorAddrRow.style.display = 'none';
    }
    });
  });

  
  if (monthlyInput) monthlyInput.addEventListener('input', updateRecurringTotal);
  if (monthsInput) monthsInput.addEventListener('input', updateRecurringTotal);
  donationRadios.forEach(r => r.addEventListener('change', updateRecurringTotal));
  if (otherAmtInput) otherAmtInput.addEventListener('input', updateRecurringTotal);
  function parseNumber(val) 
  {
    if (!val) return NaN;
    const cleaned = String(val).replace(/[^\d.]/g, '');
    return cleaned === '' ? NaN : parseFloat(cleaned);
  }

  function getSelectedDonationValue() 
  {
    const sel = donationRadios.find(r => r.checked);
    if (!sel) return NaN;
    if (sel.value === 'other') {
      return parseNumber(otherAmtInput ? otherAmtInput.value : '');
    }
    return parseNumber(sel.value);
  }

  function updateRecurringTotal() {
    if (!recurringCheckbox || !recurringCheckbox.checked) {
      totalDisplay.textContent = '';
      return;
    }

    let monthly = parseNumber(monthlyInput ? monthlyInput.value : '');
    if (isNaN(monthly)) {
      monthly = getSelectedDonationValue();
    }
    const months = parseNumber(monthsInput ? monthsInput.value : '');
    if (isNaN(monthly) || isNaN(months) || months <= 0) 
    {
      totalDisplay.textContent = '';
      return;
    }
    const total = monthly * months;
    totalDisplay.textContent = `Recurring total: $${total.toFixed(2)} (${months} × $${monthly.toFixed(2)})`;
  }

  form.addEventListener('reset', function (ev) {
    const confirmed = confirm('Are you sure you want to reset the form? This will clear all inputs.');
    if (!confirmed) ev.preventDefault();
    else {

      setTimeout(() => {
        if (otherAmtRow) otherAmtRow.style.display = 'none';
        if (creditRow) creditRow.style.display = 'none';
        if (ackToRow) ackToRow.style.display = 'none';
        if (honorNameRow) honorNameRow.style.display = 'none';
        if (honorAddrRow) honorAddrRow.style.display = 'none';
        totalDisplay.textContent = '';
        if (comments) comments.value = '';
      }, 10);
    }
  }, false);


  form.addEventListener('submit', function (ev) {
  
    ev.preventDefault();
    const errors = [];


    if (!first.value.trim()) errors.push('First Name is required.');
    if (!last.value.trim()) errors.push('Last Name is required.');
    if (!addr1.value.trim()) errors.push('Address 1 is required.');
    if (!city.value) errors.push('City is required.');
    if (!state.value) errors.push('State/Division is required.');
    if (!zip.value.trim()) errors.push('Zip Code is required.');
    if (!country.value) errors.push('Country is required.');


    const selectedDonation = donationRadios.find(r => r.checked);
    if (!selectedDonation) {
      errors.push('Please select a donation amount.');
    } else if (selectedDonation.value === 'none') {
      errors.push('Please choose a donation amount other than "None".');
    } else if (selectedDonation.value === 'other') {
      const otherVal = parseNumber(otherAmtInput ? otherAmtInput.value : '');
      if (isNaN(otherVal) || otherVal <= 0) errors.push('Please enter a valid "Other Amount".');
    }


    if (!email.value.trim()) {
      errors.push('Email is required.');
    } else {
     
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) errors.push('Please enter a valid email address.');
    }

 
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    if (password || confirmPassword) {
   
      if (!password || !confirmPassword) {
        errors.push('Both password and confirm password fields are required.');
      } else if (password.value !== confirmPassword.value) {
        errors.push('Password and Confirm Password do not match.');
      } else if (password.value.length < 6) {
        errors.push('Password must be at least 6 characters long.');
      }
    }


    if (recurringCheckbox && recurringCheckbox.checked) {
     
      let monthly = parseNumber(monthlyInput ? monthlyInput.value : '');
      const months = parseNumber(monthsInput ? monthsInput.value : '');
      if (isNaN(monthly)) {
        monthly = getSelectedDonationValue();
      }
      if (isNaN(monthly) || monthly <= 0) {
        errors.push('Please provide a valid monthly amount (or select a donation amount) for recurring donations.');
      }
      if (isNaN(months) || months <= 0) errors.push('Please provide a valid number of months for recurring donations.');
    }

  
    if (errors.length) {
      alert('Please fix the following before continuing:\n\n' + errors.slice(0, 10).join('\n'));
  
      if (errors[0].toLowerCase().includes('first name')) first.focus();
      else if (errors[0].toLowerCase().includes('last name')) last.focus();
      else if (errors[0].toLowerCase().includes('address 1')) addr1.focus();
      else if (errors[0].toLowerCase().includes('email')) email.focus();
      return;
    }

    const ok = confirm('Validation passed. Submit the form?');
    if (ok) {
    
      alert('Form submitted (demo).');
      form.reset();
      if (otherAmtRow) otherAmtRow.style.display = 'none';
      if (creditRow) creditRow.style.display = 'none';
      if (ackToRow) ackToRow.style.display = 'none';
      if (honorNameRow) honorNameRow.style.display = 'none';
      if (honorAddrRow) honorAddrRow.style.display = 'none';
      totalDisplay.textContent = '';
    }
  });


  donationTypeRadios.forEach(radio => {
    if (radio.checked) {
      const ev = new Event('change');
      radio.dispatchEvent(ev);
    }
  });

}); 

