const form = document.getElementById('signupForm')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const submitBtn = document.getElementById('submitBtn')
const usernameHint = document.getElementById('usernameHint')
const emailHint = document.getElementById('emailHint')
const pwBar = document.getElementById('pwBar')
const pwText = document.getElementById('pwText')
const pwRules = Array.from(document.querySelectorAll('#pwRules li'))
const emailSuggestions = document.getElementById('emailSuggestions')
const usernameSuggestions = document.getElementById('usernameSuggestions')
const result = document.getElementById('result')
const pwToggle = document.getElementById('pwToggle')
const capsWarn = document.getElementById('capsWarn')
const breachWarn = document.getElementById('breachWarn')
const suggestUserBtn = document.getElementById('suggestUserBtn')
const themeToggle = document.getElementById('themeToggle')
const themeLabel = document.getElementById('themeLabel')

const commonDomains = ['gmail.com','outlook.com','yahoo.com','hotmail.com','icloud.com','protonmail.com','gmx.com','edu.bd','ac.bd','bd']
const regional = ['bd','in','uk','us','au','ca','de','fr','jp']
const takenUsernames = ['admin','root','user','test','john','jane','simoon','mrkarabasan']

let usernameTimer = null
let lastChecked = ''
let usernameAvailable = false
let breachAbort = null
let usernameInputTimer = null

const SETTINGS_KEY = 'rtfv2_settings'
const settings = loadSettings()

function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY)
    if(raw) return JSON.parse(raw)
  }catch(e){}
  return {theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}
}

function saveSettings(){
  try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) }catch(e){}
}

function applyTheme(){
  if(settings.theme === 'dark'){
    document.documentElement.classList.add('dark')
    themeToggle.checked = true
    themeLabel.textContent = 'Dark'
  } else {
    document.documentElement.classList.remove('dark')
    themeToggle.checked = false
    themeLabel.textContent = 'Light'
  }
}

applyTheme()

themeToggle.addEventListener('change', ()=>{
  settings.theme = themeToggle.checked ? 'dark' : 'light'
  saveSettings()
  applyTheme()
})

function sanitizeInput(v){
  return v.replace(/\s{2,}/g,' ').replace(/^\s+|\s+$/g,'')
}

function validateUsernamePattern(v){
  return /^[a-zA-Z0-9._-]{3,20}$/.test(v)
}

function setInputState(el, ok){
  el.classList.remove('input-valid','input-invalid')
  if(ok){
    el.classList.add('input-valid')
  } else {
    el.classList.add('input-invalid')
  }
}

function fakeCheckUsernameAvailability(name){
  return new Promise(res=>{
    setTimeout(()=>{
      const lower = name.toLowerCase()
      if(takenUsernames.includes(lower)) res({available:false})
      else if(Math.random() < 0.12) res({available:false})
      else res({available:true})
    }, 700 + Math.floor(Math.random()*700))
  })
}

async function checkUsername(name){
  if(!validateUsernamePattern(name)){
    usernameHint.textContent = "3–20 chars; letters, numbers, ., _, - only"
    usernameHint.className = 'hint error'
    setInputState(username, false)
    usernameAvailable = false
    return false
  }
  usernameHint.textContent = "Checking availability..."
  usernameHint.className = 'hint'
  lastChecked = name
  const res = await fakeCheckUsernameAvailability(name)
  if(lastChecked !== name) return false
  if(res.available){
    usernameHint.textContent = "Username available"
    usernameHint.className = 'hint ok'
    setInputState(username, true)
    usernameAvailable = true
    return true
  } else {
    usernameHint.textContent = "Username taken"
    usernameHint.className = 'hint error'
    setInputState(username, false)
    usernameAvailable = false
    return false
  }
}

function refreshUsername(){
  const v = sanitizeInput(username.value)
  username.value = v
  if(usernameTimer) clearTimeout(usernameTimer)
  usernameTimer = setTimeout(()=>{ checkUsername(v).then(()=>refreshFormState()) },300)
}

function validateEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function refreshEmail(){
  const v = sanitizeInput(email.value)
  email.value = v
  const ok = validateEmail(v)
  emailHint.textContent = ok ? "Looks good" : "Enter a valid email"
  emailHint.className = ok ? 'hint ok' : 'hint error'
  setInputState(email, ok)
  refreshEmailSuggestions(v)
  return ok
}

function levenshtein(a,b){
  const al=a.length, bl=b.length
  if(al===0) return bl
  if(bl===0) return al
  const row = Array(bl+1).fill(0)
  for(let i=0;i<=bl;i++) row[i]=i
  for(let i=1;i<=al;i++){
    let prev=i
    for(let j=1;j<=bl;j++){
      const temp=row[j]
      const cost=a[i-1]===b[j-1]?0:1
      row[j]=Math.min(row[j]+1, prev+1, row[j-1]+cost)
      prev=temp
    }
  }
  return row[bl]
}

function refreshEmailSuggestions(val){
  emailSuggestions.innerHTML = ''
  if(!val.includes('@')){ emailSuggestions.classList.add('hidden'); return }
  const parts = val.split('@')
  const local = parts[0]
  const domainPart = parts[1] || ''
  const candidates = [...commonDomains, ...regional.map(r=>'example.'+r)]
  const matches = candidates
    .map(d=>({d,score:levenshtein(domainPart.toLowerCase(), d.toLowerCase())}))
    .sort((a,b)=>a.score-b.score)
    .slice(0,6)
    .map(x=>x.d)
  if(matches.length === 0){ emailSuggestions.classList.add('hidden'); return }
  matches.forEach(d=>{
    const li = document.createElement('li')
    li.textContent = local + '@' + d
    li.tabIndex = 0
    li.addEventListener('click', ()=>{
      email.value = li.textContent
      emailSuggestions.classList.add('hidden')
      refreshEmail()
      refreshFormState()
      email.focus()
    })
    li.addEventListener('keydown',e=>{
      if(e.key==='Enter'){ e.preventDefault(); li.click() }
    })
    emailSuggestions.appendChild(li)
  })
  emailSuggestions.classList.remove('hidden')
}

function estimateEntropy(p){
  let pool=0
  if(/[a-z]/.test(p)) pool+=26
  if(/[A-Z]/.test(p)) pool+=26
  if(/[0-9]/.test(p)) pool+=10
  if(/[^A-Za-z0-9]/.test(p)) pool+=32
  if(pool===0) return 0
  return Math.round(p.length * Math.log2(pool))
}

function evaluatePassword(p){
  const rules={
    length: p.length>=8,
    lower: /[a-z]/.test(p),
    upper: /[A-Z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^A-Za-z0-9]/.test(p)
  }
  const score=Object.values(rules).filter(Boolean).length
  const pct=Math.round((score/5)*100)
  const entropy=estimateEntropy(p)
  let text="Very weak"
  if(pct>=80) text="Strong"
  else if(pct>=60) text="Good"
  else if(pct>=40) text="Weak"
  else text="Very weak"
  return {rules,score,pct,text,entropy}
}

function refreshPassword(){
  const p=password.value
  const ev=evaluatePassword(p)
  pwBar.style.width=ev.pct+'%'
  pwText.textContent=ev.text+" · entropy "+ev.entropy+" bits"
  pwText.style.color = ev.pct>=80?'var(--success)':ev.pct>=60?'#f59e0b':'var(--danger)'
  pwRules.forEach(li=>{
    const rule=li.dataset.rule
    li.classList.remove('ok','fail')
    if(ev.rules[rule]) li.classList.add('ok') 
    else li.classList.add('fail')
  })
  setInputState(password, ev.score>=3)
  runBreachCheck(p)
  return ev.score>=3
}

async function runBreachCheck(pwd){
  breachWarn.classList.add('hidden')
  if(!pwd || pwd.length<6) return
  if(breachAbort) breachAbort.abort()
  breachAbort=new AbortController()
  const signal=breachAbort.signal
  const encoder=new TextEncoder()
  const hashBuffer=await crypto.subtle.digest('SHA-1', encoder.encode(pwd))
  const hashArray=Array.from(new Uint8Array(hashBuffer))
  const hashHex=hashArray.map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase()
  const prefix=hashHex.slice(0,5)
  const suffix=hashHex.slice(5)
  try{
    const r=await fetch('https://api.pwnedpasswords.com/range/'+prefix,{signal})
    if(!r.ok) return
    const lines=(await r.text()).split('\n')
    for(const line of lines){
      const [s,count]=line.split(':')
      if(s.trim()===suffix){
        breachWarn.textContent=`This password has appeared ${count.trim()} times in breaches. Choose a different password.`
        breachWarn.classList.remove('hidden')
        setInputState(password,false)
        return
      }
    }
  }catch(e){}
}

function refreshFormState(){
  const uPatternOk = validateUsernamePattern(username.value)
  const uOk = uPatternOk && usernameAvailable
  const em = validateEmail(email.value)
  const pw = evaluatePassword(password.value).score>=3 && breachWarn.classList.contains('hidden')
  const ok = uOk && em && pw
  submitBtn.disabled = !ok
  if(ok){
    submitBtn.animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:300})
  }
  return ok
}

username.addEventListener('input', ()=> refreshUsername())
email.addEventListener('input', ()=>{ refreshEmail(); refreshFormState() })
password.addEventListener('input', ()=>{ refreshPassword(); refreshFormState() })

email.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown' && !emailSuggestions.classList.contains('hidden')){
    e.preventDefault()
    const first=emailSuggestions.querySelector('li')
    if(first) first.focus()
  }
})

document.addEventListener('click',e=>{
  if(!e.target.closest('.email-wrapper')) emailSuggestions.classList.add('hidden')
  if(!e.target.closest('.field')) usernameSuggestions.classList.add('hidden')
})

password.addEventListener('keydown',e=>{
  if(e.getModifierState('CapsLock')) capsWarn.classList.remove('hidden')
  else capsWarn.classList.add('hidden')
})

password.addEventListener('keyup',e=>{
  if(e.getModifierState('CapsLock')) capsWarn.classList.remove('hidden')
  else capsWarn.classList.add('hidden')
})

pwToggle.addEventListener('click', ()=>{
  if(password.type==='password'){ password.type='text'; pwToggle.textContent='Hide' }
  else { password.type='password'; pwToggle.textContent='Show' }
})

suggestUserBtn.addEventListener('click', ()=>{
  const list = generateUsernameSuggestions()
  showUsernameSuggestions(list)
})

function generateUsernameSuggestions(){
  const local =(email.value.split('@')[0]||'').replace(/[^a-zA-Z0-9._-]/g,'').slice(0,12)
  const base = username.value.trim() || local || 'user'
  const arr = []
  if(base && !takenUsernames.includes(base.toLowerCase())) arr.push(base)
  for(let i=0;i<6;i++){
    const n=Math.floor(Math.random()*9999)
    const v=(base+(i===0?'':n)).slice(0,20)
    if(!arr.includes(v)) arr.push(v)
  }
  return arr
}

function showUsernameSuggestions(arr){
  usernameSuggestions.innerHTML=''
  arr.forEach(a=>{
    const li=document.createElement('li')
    li.textContent=a
    li.tabIndex=0
    li.addEventListener('click', ()=>{
      username.value=a
      usernameSuggestions.classList.add('hidden')
      refreshUsername()
      refreshFormState()
      username.focus()
    })
    usernameSuggestions.appendChild(li)
  })
  usernameSuggestions.classList.remove('hidden')
}

form.addEventListener('submit',e=>{
  e.preventDefault()
  if(!refreshFormState()) return
  result.textContent=`Account created for ${username.value} (${email.value})`
  result.classList.remove('hidden')
  form.reset()
  pwBar.style.width='0%'
  pwText.textContent=''
  pwRules.forEach(li=>li.classList.remove('ok','fail'))
  usernameAvailable=false
  submitBtn.disabled=true
})

email.addEventListener('paste',()=> setTimeout(()=>{ email.value = sanitizeInput(email.value); refreshEmail(); refreshFormState() },10))
username.addEventListener('paste',()=> setTimeout(()=>{ username.value = sanitizeInput(username.value); refreshUsername(); refreshFormState() },10))
password.addEventListener('paste',()=> setTimeout(()=>{ password.value = password.value.replace(/\s/g,''); refreshPassword(); refreshFormState() },10))

refreshEmail()
refreshPassword()
refreshFormState()
