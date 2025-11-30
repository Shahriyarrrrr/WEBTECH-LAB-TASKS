const THEME_KEY='user_theme_v1'
const ACCENT_KEY='user_accent_v1'
const toggle=document.getElementById('themeToggle')
const accentInput=document.getElementById('accentInput')
const accentSample=document.getElementById('accentSample')
const currentThemeLabel=document.getElementById('currentTheme')

function readLocal(k){ try{ return localStorage.getItem(k) }catch(e){ return null } }
function writeLocal(k,v){ try{ localStorage.setItem(k,v) }catch(e){} }

function applyThemeClass(t){
  if(t==='dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
  currentThemeLabel.textContent = t
}

function applyAccent(c){
  if(!c) return
  document.documentElement.style.setProperty('--accent', c)
  accentSample.style.background = c
  accentInput.value = c
}

function enableSmoothTransition(){
  document.documentElement.classList.add('theme-transition')
  clearTimeout(document.documentElement._themeTimer)
  document.documentElement._themeTimer = setTimeout(()=>document.documentElement.classList.remove('theme-transition'),400)
}

document.addEventListener('DOMContentLoaded',()=>{
  const savedTheme = readLocal(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const savedAccent = readLocal(ACCENT_KEY) || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2563eb'
  applyThemeClass(savedTheme)
  applyAccent(savedAccent)
  toggle.checked = savedTheme === 'dark'
  toggle.addEventListener('change',()=>{
    const newTheme = toggle.checked ? 'dark' : 'light'
    enableSmoothTransition()
    applyThemeClass(newTheme)
    writeLocal(THEME_KEY,newTheme)
  })
  accentInput.addEventListener('input',()=>{
    const c = accentInput.value
    enableSmoothTransition()
    applyAccent(c)
    writeLocal(ACCENT_KEY,c)
  })
})
