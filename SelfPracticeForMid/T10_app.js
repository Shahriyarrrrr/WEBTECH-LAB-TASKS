const ITEMS = [
  'Aardvark Explorer','Azure Morning Journal','Banyan Coffee Beans','Cascade Bicycle Co','Cedarwood Notebook',
  'Dahlia Photography Kit','Echo Travel Mug','Evergreen Plant Care Set','Falcon Running Shoes','Fjord Wool Scarf',
  'Gemstone Necklace','Harbor Canvas Backpack','Horizon Lamp','Ivy Wall Planter','Juniper Tea Collection',
  'Kite Surfboard Pro','Lumen Desk Organizer','Maple Cutting Board','Nebula Bluetooth Speaker','Nimbus Raincoat',
  'Oakfield Leather Wallet','Olive Oil Artisan','Pine & Patchouli Candle','Quartz Desktop Clock','Quill Fountain Pen',
  'Ravenwood Sunglasses','Riverstone Yoga Mat','Saffron Spice Box','Sage Linen Towels','Sierra Hiking Socks',
  'Talon Multi-tool','Thyme Herb Kit','Urbane Coffee Table','Vega Gaming Mouse','Violet Silk Pillowcase',
  'Wanderstone Journal','Willow Picnic Set','Xeno Wireless Charger','Yarrow Balm','Yellowbrick Gameboard',
  'Zephyr Hoodie','Zen Garden Kit','Nimbus Travel Pillow','Cobalt Chef Knife','Aurora Photo Printer',
  'Boreal Hiking Hat','Citrine Stud Earrings','Driftwood Serving Tray','Elmwood Cutting Board','Fable Storybook'
]

const pre = ITEMS.map((t,i)=>({orig:t,lower:t.toLowerCase(),idx:i}))

const grid = document.getElementById('grid')
const input = document.getElementById('searchInput')
const clearBtn = document.getElementById('clearBtn')
const countEl = document.getElementById('count')
const fuzzyToggle = document.getElementById('fuzzyToggle')
const modeLabel = document.getElementById('modeLabel')
const suggestions = document.getElementById('suggestions')
const tpl = document.getElementById('itemTpl')
const noResults = document.getElementById('noResults')
const themeWheel = document.getElementById('themeWheel')
const wheelRing = document.getElementById('wheelRing')
const themeWheelBtn = document.getElementById('themeWheelBtn')
const wheelClose = document.getElementById('wheelClose')
const wheelAccent = document.getElementById('wheelAccent')
const accentPicker = document.getElementById('accentPicker')

const THEME_KEY='premium_search_theme_v1'
const ACC_KEY='premium_search_accent_v1'
const MODE_KEY='premium_search_mode_v1'

let timer = 0
let activeSuggestion = -1
let currentMatches = pre.slice()
let lastQuery = ''
let fuzzyMode = (document.documentElement.dataset.searchMode || 'fuzzy') === 'fuzzy'

fuzzyToggle.checked = fuzzyMode
modeLabel.textContent = fuzzyMode ? 'Fuzzy' : 'Exact'

function save(key,val){ try{ localStorage.setItem(key,val) }catch(e){} }
function read(key){ try{ return localStorage.getItem(key) }catch(e){ return null } }

accentPicker.value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2563eb'
wheelAccent.value = accentPicker.value

accentPicker.addEventListener('input', e=>{
  document.documentElement.style.setProperty('--accent', e.target.value)
  save(ACC_KEY, e.target.value)
  wheelAccent.value = e.target.value
  accentPicker.style.background = e.target.value
})

wheelAccent.addEventListener('input', e=>{
  document.documentElement.style.setProperty('--accent', e.target.value)
  save(ACC_KEY, e.target.value)
  accentPicker.value = e.target.value
  accentPicker.style.background = e.target.value
})

const THEMES = [
  'apple-light','apple-dark','mac-vibrant','frosted-glass','minimal-white',
  'material-blue','material-pastel','material-amoled','material-accent','material-highcontrast',
  'neon-purple','neon-blue','carbon-dark','gradient-pulse','holographic',
  'enterprise-azure','enterprise-slate','enterprise-pearl','enterprise-gold','enterprise-midnight'
]

function renderWheel(){
  wheelRing.innerHTML = ''
  const r = 120
  const cx = 140, cy = 140
  THEMES.forEach((t,i)=>{
    const angle = (i / THEMES.length) * Math.PI * 2 - Math.PI/2
    const x = cx + Math.cos(angle) * r - 33
    const y = cy + Math.sin(angle) * r - 33
    const sw = document.createElement('button')
    sw.className = 'theme-swatch'
    sw.style.left = `${x}px`
    sw.style.top = `${y}px`
    sw.dataset.theme = t
    const themeColor = getThemeAccent(t)
    sw.style.background = themeColor
    sw.innerHTML = ''
    sw.addEventListener('click', ()=>{
      applyTheme(t)
      save(THEME_KEY, t)
      closeWheel()
    })
    wheelRing.appendChild(sw)
  })
}

function getThemeAccent(theme){
  const map = {
    'apple-light':'#0a84ff','apple-dark':'#0a84ff','mac-vibrant':'#0066ff','frosted-glass':'#3b82f6','minimal-white':'#2563eb',
    'material-blue':'#1976d2','material-pastel':'#6d28d9','material-amoled':'#3ddc84','material-accent':'#ff7043','material-highcontrast':'#ffb300',
    'neon-purple':'#8b5cf6','neon-blue':'#00c2ff','carbon-dark':'#00bcd4','gradient-pulse':'#f43f5e','holographic':'#a78bfa',
    'enterprise-azure':'#0ea5a4','enterprise-slate':'#0ea5a4','enterprise-pearl':'#d97706','enterprise-gold':'#b7791f','enterprise-midnight':'#2563eb'
  }
  return map[theme] || '#2563eb'
}

function applyTheme(theme){
  document.documentElement.dataset.theme = theme
  const accentSaved = read(ACC_KEY)
  if(!accentSaved) document.documentElement.style.setProperty('--accent', getThemeAccent(theme))
  save(THEME_KEY, theme)
}

function closeWheel(){
  themeWheel.classList.add('hidden')
}
function openWheel(){
  themeWheel.classList.remove('hidden')
}

themeWheelBtn.addEventListener('click', ()=>{
  renderWheel()
  openWheel()
})
wheelClose.addEventListener('click', closeWheel)
themeWheel.addEventListener('click', e=>{ if(e.target===themeWheel) closeWheel() })

const savedTheme = read(THEME_KEY)
if(savedTheme) applyTheme(savedTheme)
const savedAccent = read(ACC_KEY)
if(savedAccent) document.documentElement.style.setProperty('--accent', savedAccent)

function debounce(fn,wait){
  return function(...args){
    clearTimeout(timer)
    timer = setTimeout(()=>fn.apply(this,args), wait)
  }
}

function highlightExact(text, q){
  if(!q) return escapeHtml(text)
  const re = new RegExp('('+escapeRegex(q)+')','ig')
  return escapeHtml(text).replace(re, '<mark>$1</mark>')
}

function highlightFuzzy(text, q){
  if(!q) return escapeHtml(text)
  const l = text.toLowerCase()
  const ql = q.toLowerCase()
  let res = ''
  let qi = 0
  for(let i=0;i<text.length;i++){
    const ch = text[i]
    if(qi < ql.length && ch.toLowerCase() === ql[qi]){
      res += '<mark>' + escapeHtml(ch) + '</mark>'
      qi++
    } else {
      res += escapeHtml(ch)
    }
  }
  return res
}

function fuzzyScore(text, q){
  const t = text.toLowerCase()
  const s = q.toLowerCase()
  let score=0
  let pos=0
  for(let i=0;i<s.length;i++){
    const idx = t.indexOf(s[i], pos)
    if(idx === -1) return -1
    score += (s.length - i) * (100 - idx)
    pos = idx + 1
  }
  return score
}

function search(query){
  lastQuery = query
  const q = query.trim()
  if(!q){
    currentMatches = pre.slice()
    renderItems(currentMatches, q)
    renderCount()
    suggestions.innerHTML = ''
    noResults.classList.add('hidden')
    return
  }
  const results = []
  const ql = q.toLowerCase()
  if(fuzzyMode){
    for(const item of pre){
      const sc = fuzzyScore(item.orig, q)
      if(sc >= 0) results.push({item,score:sc})
    }
    results.sort((a,b)=>b.score - a.score)
    currentMatches = results.map(r=>r.item)
  } else {
    for(const item of pre){
      if(item.lower.indexOf(ql) !== -1) currentMatches.push ? null : null
    }
    // exact mode simple filter
    currentMatches = pre.filter(p=>p.lower.indexOf(ql) !== -1)
  }
  renderItems(currentMatches, q)
  renderCount()
  renderSuggestions(currentMatches,q)
}

function renderItems(matches, q){
  grid.innerHTML = ''
  const frag = document.createDocumentFragment()
  if(!matches.length){
    noResults.classList.remove('hidden')
    return
  } else {
    noResults.classList.add('hidden')
  }
  const useFuzzy = fuzzyMode
  for(const m of matches){
    const clone = tpl.content.cloneNode(true)
    const li = clone.querySelector('li')
    const name = clone.querySelector('.name')
    name.innerHTML = useFuzzy ? highlightFuzzy(m.orig, q) : highlightExact(m.orig, q)
    li.addEventListener('click', e=>{
      ripple(e, li)
    })
    frag.appendChild(clone)
  }
  grid.appendChild(frag)
}

function renderCount(){
  countEl.textContent = `${currentMatches.length} / ${ITEMS.length}`
}

function renderSuggestions(matches,q){
  suggestions.innerHTML = ''
  if(!matches.length) return
  const frag = document.createDocumentFragment()
  const max = Math.min(6, matches.length)
  for(let i=0;i<max;i++){
    const li = document.createElement('li')
    li.tabIndex = 0
    li.role = 'option'
    li.dataset.idx = i
    li.innerHTML = (fuzzyMode ? highlightFuzzy(matches[i].orig, q) : highlightExact(matches[i].orig, q))
    li.addEventListener('click', ()=>{ chooseSuggestion(i) })
    frag.appendChild(li)
  }
  suggestions.appendChild(frag)
  activeSuggestion = -1
}

function chooseSuggestion(i){
  if(!currentMatches[i]) return
  input.value = currentMatches[i].orig
  search(input.value)
  suggestions.innerHTML = ''
}

const debouncedSearch = debounce((e)=> {
  const v = e.target.value
  search(v)
}, 160)

input.addEventListener('input', debouncedSearch)

clearBtn.addEventListener('click', ()=>{
  input.value = ''
  search('')
  input.focus()
})

input.addEventListener('keydown', e=>{
  const list = suggestions.children
  if(e.key === 'ArrowDown'){
    e.preventDefault()
    if(!list.length) return
    activeSuggestion = Math.min(list.length - 1, activeSuggestion + 1)
    updateSuggestionFocus()
  } else if(e.key === 'ArrowUp'){
    e.preventDefault()
    if(!list.length) return
    activeSuggestion = Math.max(0, activeSuggestion - 1)
    updateSuggestionFocus()
  } else if(e.key === 'Enter'){
    if(activeSuggestion >= 0 && suggestions.children[activeSuggestion]) {
      suggestions.children[activeSuggestion].click()
      e.preventDefault()
    }
  } else if(e.key === 'Escape'){
    suggestions.innerHTML = ''
  }
})

function updateSuggestionFocus(){
  Array.from(suggestions.children).forEach((li, idx)=>{
    li.setAttribute('aria-selected', idx === activeSuggestion ? 'true' : 'false')
    if(idx === activeSuggestion) li.scrollIntoView({block:'nearest'})
  })
}

fuzzyToggle.addEventListener('change', e=>{
  fuzzyMode = e.target.checked
  modeLabel.textContent = fuzzyMode ? 'Fuzzy' : 'Exact'
  save(MODE_KEY, fuzzyMode ? 'fuzzy' : 'exact')
  search(input.value)
})

function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') }
function escapeHtml(s){ return (s+'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;') }

function ripple(e, el){
  const r = document.createElement('span')
  r.className = 'ripple'
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 1.4
  r.style.width = r.style.height = size + 'px'
  r.style.left = (e.clientX - rect.left - size/2) + 'px'
  r.style.top = (e.clientY - rect.top - size/2) + 'px'
  el.appendChild(r)
  setTimeout(()=> r.remove(), 700)
}

/* basic ripple style injection */
const style = document.createElement('style')
style.innerHTML = `
.card { position:relative; overflow:hidden }
.ripple { position:absolute; border-radius:50%; transform:scale(0); opacity:.2; background:var(--accent); animation: rippleAnim 700ms linear; pointer-events:none }
@keyframes rippleAnim { to{transform:scale(1);opacity:0} }`
document.head.appendChild(style)

/* startup */
renderItems(pre.slice(), '')
renderCount()

/* keyboard nav for suggestions via mouseover */
suggestions.addEventListener('mousemove', e=>{
  const li = e.target.closest('li')
  if(!li) return
  const idx = Array.from(suggestions.children).indexOf(li)
  activeSuggestion = idx
  updateSuggestionFocus()
})

/* load saved mode */
const savedMode = read(MODE_KEY)
if(savedMode) {
  fuzzyMode = savedMode === 'fuzzy'
  fuzzyToggle.checked = fuzzyMode
  modeLabel.textContent = fuzzyMode ? 'Fuzzy' : 'Exact'
}

/* accessibility: announce no results */
const obs = new MutationObserver(()=>{ if(noResults.classList.contains('hidden')) return; noResults.setAttribute('aria-hidden','false') })
obs.observe(noResults, { attributes:true, childList:true, subtree:true })

/* focus behavior */
input.addEventListener('focus', ()=> {
  if(input.value) search(input.value)
})

/* persist accent pickers initial color */
accentPicker.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent')
wheelAccent.style.background = accentPicker.style.background
