const chatBox = document.getElementById('chatBox')
const textInput = document.getElementById('textInput')
const sendBtn = document.getElementById('sendBtn')
const clearBtn = document.getElementById('clearBtn')
const exportBtn = document.getElementById('exportBtn')
const agentSelect = document.getElementById('agentSelect')
const fileInput = document.getElementById('fileInput')
const attachBtn = document.getElementById('attachBtn')
const voiceBtn = document.getElementById('voiceBtn')
const themeToggle = document.getElementById('themeToggle')
const ttsToggle = document.getElementById('ttsToggle')
const soundToggle = document.getElementById('soundToggle')
const typingToggle = document.getElementById('typingToggle')

const STORAGE_KEY = 'ai_chat_plus_v1'

let history = []
let isTyping = false
let recognition = null
let usingVoice = false
let typingTimer = null

const agents = {
  assistant: {
    name: 'Assistant',
    rules: [
      {k: /help|support|issue|problem/i, r: ['I can help with that. Describe the issue.']},
      {k: /price|cost|fee/i, r: ['Which product are you asking about?']},
      {k: /hello|hi|hey/i, r: ['Hello! How can I help today?','Hi there!']},
      {k: /thank(s| you)/i, r: ['You are welcome!','Glad to help.']},
      {k: /bye|goodbye|see you/i, r: ['Goodbye!','Take care.']},
      {k: /\btime\b/i, r: ['I cannot read system time but you can check your device.']},
      {k: /weather/i, r: ['I cannot fetch live weather here, but I can help with general info.']}
    ],
    personality: 'neutral'
  },
  helper: {
    name: 'Helper',
    rules: [
      {k: /error|bug|fail/i, r: ['Try restarting the app first.']},
      {k: /install|setup/i, r: ['Follow these steps: 1) Download 2) Install 3) Run.']},
      {k: /hello/i, r: ['Hey! Need a hand?']},
      {k: /.*/i, r: ['Tell me more.']}
    ],
    personality: 'practical'
  },
  friendly: {
    name: 'Friendly Bot',
    rules: [
      {k: /hello|hi/i, r: ['Hello friend!','Hey buddy!']},
      {k: /how are you/i, r: ['I am a bot but thanks for asking!']},
      {k: /joke/i, r: ['Why did the developer go broke? Because he used up all his cache.']},
      {k: /.*/i, r: ['Nice! Tell me more :)']}
    ],
    personality: 'friendly'
  },
  professor: {
    name: 'Professor',
    rules: [
      {k: /explain|explanation|what is/i, r: ['Let me explain: ' ,'In short: ']},
      {k: /theorem|proof/i, r: ['A formal proof requires several steps.']},
      {k: /.*/i, r: ['Consider the following perspective...']}
    ],
    personality: 'formal'
  }
}

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) history = JSON.parse(raw)
  }catch(e){}
}
function save(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(history)) }catch(e){}
}
function render(){
  chatBox.innerHTML = ''
  history.forEach(m=>{
    const el = document.createElement('div')
    el.className = 'msg ' + (m.role === 'user' ? 'user' : 'bot')
    const meta = document.createElement('div')
    meta.className = 'meta'
    meta.textContent = m.role === 'user' ? 'You' : (m.agent || 'Bot')
    const bubble = document.createElement('div')
    bubble.className = 'bubble'
    bubble.textContent = m.text
    el.appendChild(meta)
    el.appendChild(bubble)
    if(m.attachments && m.attachments.length){
      const att = document.createElement('div')
      att.className = 'attachments'
      m.attachments.forEach(a=>{
        if(a.type && a.type.startsWith('image/')){
          const im = document.createElement('img')
          im.src = a.data
          att.appendChild(im)
        } else {
          const link = document.createElement('a')
          link.href = a.data
          link.textContent = a.name || 'file'
          link.download = a.name || ''
          att.appendChild(link)
        }
      })
      el.appendChild(att)
    }
    chatBox.appendChild(el)
  })
  chatBox.scrollTop = chatBox.scrollHeight
}

function playSound(frequency=440,duration=0.08){
  if(!soundToggle.checked) return
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = frequency
    o.connect(g)
    g.connect(ctx.destination)
    g.gain.value = 0.0001
    const now = ctx.currentTime
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.01)
    o.start(now)
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    o.stop(now + duration + 0.02)
    setTimeout(()=>{ try{ ctx.close() }catch(e){} }, 500)
  }catch(e){}
}

function sendUserMessage(text, attachments){
  const msg = {role:'user', text, time:Date.now(), attachments: attachments || []}
  history.push(msg)
  save()
  render()
  playSound(880,0.06)
  respondTo(text, attachments)
}

function respondTo(text, attachments){
  const agentKey = agentSelect.value
  const agent = agents[agentKey]
  const combined = (text || '') + ' ' + (attachments ? attachments.map(a=>a.name).join(' ') : '')
  const match = agent.rules.find(r => combined.match(r.k))
  const candidate = match ? match.r[Math.floor(Math.random()*match.r.length)] : "I don't have an answer for that."
  if(typingToggle.checked){
    showTyping(agent.name)
    const delay = 400 + Math.min(2000, candidate.length * 20)
    setTimeout(()=> typeMessage(candidate, agent.name), delay)
  } else {
    typeMessage(candidate, agent.name)
  }
}

function showTyping(agentName){
  if(isTyping) return
  isTyping = true
  const el = document.createElement('div')
  el.className = 'msg bot'
  const meta = document.createElement('div')
  meta.className = 'meta'
  meta.textContent = agentName
  const bubble = document.createElement('div')
  bubble.className = 'bubble typing'
  bubble.textContent = 'Typing...'
  el.appendChild(meta)
  el.appendChild(bubble)
  chatBox.appendChild(el)
  chatBox.scrollTop = chatBox.scrollHeight
}

function removeTyping(){
  const nodes = Array.from(chatBox.querySelectorAll('.typing'))
  nodes.forEach(n=>{
    const p = n.parentElement
    if(p) p.remove()
  })
  isTyping = false
}

function typeMessage(text, agentName){
  removeTyping()
  const el = document.createElement('div')
  el.className = 'msg bot'
  const meta = document.createElement('div')
  meta.className = 'meta'
  meta.textContent = agentName
  const bubble = document.createElement('div')
  bubble.className = 'bubble'
  el.appendChild(meta)
  el.appendChild(bubble)
  chatBox.appendChild(el)
  chatBox.scrollTop = chatBox.scrollHeight
  let i = 0
  const speed = 18
  const t = setInterval(()=>{
    bubble.textContent += text[i] || ''
    i++
    chatBox.scrollTop = chatBox.scrollHeight
    if(i >= text.length){
      clearInterval(t)
      const msg = {role:'bot', agent:agentName, text, time:Date.now()}
      history.push(msg)
      save()
      playSound(440,0.06)
      if(ttsToggle.checked) speakText(text)
    }
  }, speed)
}

function speakText(text){
  try{
    const s = new SpeechSynthesisUtterance(text)
    speechSynthesis.cancel()
    s.rate = 1
    window.speechSynthesis.speak(s)
  }catch(e){}
}

sendBtn.addEventListener('click', ()=>{
  const text = textInput.value.trim()
  if(!text && !fileInput.files.length) return
  const files = Array.from(fileInput.files)
  if(files.length){
    const attachments = []
    let loaded = 0
    files.forEach(f=>{
      const r = new FileReader()
      r.onload = e=>{
        attachments.push({name:f.name,type:f.type,data:e.target.result})
        loaded++
        if(loaded === files.length){
          fileInput.value = ''
          sendUserMessage(text || '(file)', attachments)
          textInput.value = ''
        }
      }
      r.readAsDataURL(f)
    })
  } else {
    sendUserMessage(text)
    textInput.value = ''
  }
})

textInput.addEventListener('keydown', e=>{
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault()
    sendBtn.click()
  }
})

clearBtn.addEventListener('click', ()=>{
  history = []
  save()
  render()
  playSound(220,0.08)
})

exportBtn.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(history, null, 2)], {type:'application/json'})
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `chat-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
})

attachBtn.addEventListener('click', ()=> fileInput.click())
fileInput.addEventListener('change', ()=>{})

voiceBtn.addEventListener('click', ()=>{
  if(usingVoice){
    stopRecognition()
    return
  }
  startRecognition()
})

function startRecognition(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if(!SpeechRecognition) return alert('Speech recognition not supported in this browser.')
  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  recognition.onresult = e=>{
    let interim = ''
    let final = ''
    for(let i=0;i<e.results.length;i++){
      const res = e.results[i]
      if(res.isFinal) final += res[0].transcript
      else interim += res[0].transcript
    }
    textInput.value = (final + ' ' + interim).trim()
  }
  recognition.onerror = e=>{
    recognition.stop()
    usingVoice = false
    voiceBtn.classList.remove('active')
  }
  recognition.onend = ()=>{
    usingVoice = false
    voiceBtn.classList.remove('active')
  }
  recognition.start()
  usingVoice = true
  voiceBtn.classList.add('active')
}

function stopRecognition(){
  if(!recognition) return
  recognition.stop()
  usingVoice = false
  voiceBtn.classList.remove('active')
}

themeToggle.addEventListener('change', ()=>{
  if(themeToggle.checked) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark')
})

window.addEventListener('load', ()=>{
  load()
  render()
})

window.addEventListener('beforeunload', ()=> save())
