const audio=document.getElementById('audio')
const playBtn=document.getElementById('play')
const pauseBtn=document.getElementById('pause')
const stopBtn=document.getElementById('stop')
const prevBtn=document.getElementById('prev')
const nextBtn=document.getElementById('next')
const seek=document.getElementById('seek')
const currentTimeEl=document.getElementById('currentTime')
const durationEl=document.getElementById('duration')
const volume=document.getElementById('volume')
const speed=document.getElementById('speed')
const trackTitle=document.getElementById('trackTitle')
const waveCanvas=document.getElementById('waveCanvas')
const freqCanvas=document.getElementById('freqCanvas')
const playlistEl=document.getElementById('playlist')
const filePicker=document.getElementById('filePicker')
const importFiles=document.getElementById('importFiles')
const downloadBtn=document.getElementById('download')
const shareBtn=document.getElementById('share')
const setA=document.getElementById('setA')
const setB=document.getElementById('setB')
const toggleAB=document.getElementById('toggleAB')
const themeToggle=document.getElementById('themeToggle')
const sortBtn=document.getElementById('sortBtn')
const clearPlaylist=document.getElementById('clearPlaylist')

let ctx=null
let analyser=null
let sourceNode=null
let rafId=null
let tracks=[]
let currentIndex=-1
let loopA=null
let loopB=null
let abLoop=false
const STORAGE_KEY='adv_audio_player_v1'
let darkMode=localStorage.getItem('adv_dark')==='1'

function applyTheme(){
  if(darkMode) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
  themeToggle.checked=darkMode
}
applyTheme()

themeToggle.addEventListener('change',()=>{
  darkMode=themeToggle.checked
  localStorage.setItem('adv_dark',darkMode?'1':'0')
  applyTheme()
})

function initAudioContext(){
  if(ctx) return
  ctx=new (window.AudioContext||window.webkitAudioContext)()
  analyser=ctx.createAnalyser()
  analyser.fftSize=2048
  sourceNode=ctx.createMediaElementSource(audio)
  sourceNode.connect(analyser)
  analyser.connect(ctx.destination)
  draw()
}

audio.addEventListener('loadedmetadata',()=>{
  durationEl.textContent=formatTime(audio.duration)
  seek.value=0
})

audio.addEventListener('timeupdate',()=>{
  currentTimeEl.textContent=formatTime(audio.currentTime)
  if(audio.duration) seek.value=(audio.currentTime/audio.duration)*100
  if(abLoop && loopA!=null && loopB!=null && audio.currentTime>=loopB) audio.currentTime=loopA
})

playBtn.addEventListener('click',async()=>{
  initAudioContext()
  if(ctx.state==='suspended') await ctx.resume()
  audio.play()
})

pauseBtn.addEventListener('click',()=>audio.pause())
stopBtn.addEventListener('click',()=>{ audio.pause(); audio.currentTime=0 })
prevBtn.addEventListener('click',()=>{
  if(!tracks.length) return
  currentIndex=(currentIndex-1+tracks.length)%tracks.length
  loadTrack(currentIndex)
  audio.play()
})
nextBtn.addEventListener('click',()=>{
  if(!tracks.length) return
  currentIndex=(currentIndex+1)%tracks.length
  loadTrack(currentIndex)
  audio.play()
})

seek.addEventListener('input',()=>{
  if(audio.duration) audio.currentTime=(seek.value/100)*audio.duration
})

volume.addEventListener('input',()=>audio.volume=volume.value)
speed.addEventListener('change',()=>audio.playbackRate=parseFloat(speed.value))

function formatTime(t){
  if(!t||isNaN(t)) return '0:00'
  const m=Math.floor(t/60)
  const s=Math.floor(t%60).toString().padStart(2,'0')
  return `${m}:${s}`
}

importFiles.addEventListener('click',()=>filePicker.click())
filePicker.addEventListener('change',()=>addTracksFromFiles(filePicker.files))

function addTracksFromFiles(files){
  const arr=[...files]
  arr.forEach(f=>{
    const url=URL.createObjectURL(f)
    const id='t'+Math.random().toString(36).slice(2)
    tracks.push({id,name:f.name,url,blob:f})
  })
  if(currentIndex===-1 && tracks.length){
    currentIndex=0
    loadTrack(0)
  }
  renderPlaylist()
  saveState()
}

function loadTrack(i){
  if(!tracks[i]) return
  const t=tracks[i]
  currentIndex=i
  audio.src=t.url
  trackTitle.textContent=t.name
  highlightActive()
  initAudioContext()
}

function highlightActive(){
  [...playlistEl.children].forEach(li=>li.classList.remove('active'))
  const node=playlistEl.querySelector(`[data-id="${tracks[currentIndex]?.id}"]`)
  if(node) node.classList.add('active')
}

function renderPlaylist(){
  playlistEl.innerHTML=''
  tracks.forEach((t,i)=>{
    const li=document.createElement('li')
    li.dataset.id=t.id
    li.draggable=true
    li.innerHTML=`<span>${t.name}</span>`
    const act=document.createElement('div')
    act.className='pl-actions'
    const p=document.createElement('button')
    p.textContent='Play'
    p.onclick=()=>{ loadTrack(i); audio.play() }
    const r=document.createElement('button')
    r.textContent='X'
    r.onclick=()=>removeTrack(i)
    act.append(p,r)
    li.append(act)
    li.ondragstart=e=>e.dataTransfer.setData('id',t.id)
    li.ondragover=e=>e.preventDefault()
    li.ondrop=e=>{
      e.preventDefault()
      reorder(e.dataTransfer.getData('id'),t.id)
    }
    playlistEl.append(li)
  })
  highlightActive()
}

function removeTrack(i){
  const t=tracks[i]
  if(t.blob) URL.revokeObjectURL(t.url)
  tracks.splice(i,1)
  if(i===currentIndex){
    audio.pause()
    audio.src=''
    trackTitle.textContent='No Track'
    currentIndex=-1
  }
  if(tracks.length && currentIndex===-1){
    currentIndex=0
    loadTrack(0)
  }
  renderPlaylist()
  saveState()
}

function reorder(a,b){
  const ia=tracks.findIndex(x=>x.id===a)
  const ib=tracks.findIndex(x=>x.id===b)
  if(ia<0||ib<0) return
  const [x]=tracks.splice(ia,1)
  tracks.splice(ib,0,x)
  renderPlaylist()
  saveState()
}

sortBtn.addEventListener('click',()=>{
  tracks.sort((a,b)=>a.name.localeCompare(b.name))
  renderPlaylist()
  saveState()
})

clearPlaylist.addEventListener('click',()=>{
  tracks.forEach(t=>t.blob && URL.revokeObjectURL(t.url))
  tracks=[]
  currentIndex=-1
  audio.pause()
  audio.src=''
  trackTitle.textContent='No Track'
  renderPlaylist()
  saveState()
})

downloadBtn.addEventListener('click',async()=>{
  const t=tracks[currentIndex]
  if(!t) return
  if(t.blob){
    const a=document.createElement('a')
    a.href=t.url
    a.download=t.name
    document.body.append(a)
    a.click()
    a.remove()
  }else{
    const res=await fetch(t.url)
    const blob=await res.blob()
    const a=document.createElement('a')
    a.href=URL.createObjectURL(blob)
    a.download=t.name
    document.body.append(a)
    a.click()
    a.remove()
  }
})

shareBtn.addEventListener('click',async()=>{
  const t=tracks[currentIndex]
  if(!t) return
  if(navigator.canShare && t.blob){
    try{
      const file=new File([t.blob],t.name,{type:t.blob.type})
      await navigator.share({files:[file],title:t.name})
      return
    }catch(e){}
  }
  if(navigator.share){
    try{
      await navigator.share({url:t.url,title:t.name})
    }catch(e){}
  }
})

setA.addEventListener('click',()=>{
  loopA=audio.currentTime
  setA.textContent='A: '+formatTime(loopA)
})
setB.addEventListener('click',()=>{
  loopB=audio.currentTime
  setB.textContent='B: '+formatTime(loopB)
})
toggleAB.addEventListener('click',()=>{
  abLoop=!abLoop
  toggleAB.textContent=abLoop?'A-B On':'A-B Off'
})

document.addEventListener('visibilitychange',()=>{
  if(document.hidden && ctx && ctx.state==='running') ctx.suspend()
})

function saveState(){
  const arr=tracks.map(t=>({id:t.id,name:t.name,url:t.url}))
  localStorage.setItem(STORAGE_KEY,JSON.stringify(arr))
}

function loadState(){
  const raw=localStorage.getItem(STORAGE_KEY)
  if(!raw) return
  try{
    const arr=JSON.parse(raw)
    arr.forEach(a=>{
      tracks.push({id:a.id,name:a.name,url:a.url,blob:null})
    })
    if(tracks.length){
      currentIndex=0
      loadTrack(0)
    }
    renderPlaylist()
  }catch(e){}
}
loadState()

function draw(){
  const w=waveCanvas.width=waveCanvas.clientWidth
  const h=waveCanvas.height=waveCanvas.clientHeight
  const fw=freqCanvas.width=freqCanvas.clientWidth
  const fh=freqCanvas.height=freqCanvas.clientHeight
  const ctxw=waveCanvas.getContext('2d')
  const ctxf=freqCanvas.getContext('2d')
  analyser.fftSize=2048
  const buffer=new Uint8Array(analyser.fftSize)
  const freq=new Uint8Array(analyser.frequencyBinCount)
  function loop(){
    analyser.getByteTimeDomainData(buffer)
    analyser.getByteFrequencyData(freq)
    ctxw.fillStyle=darkMode?'#02101b':'#ffffff'
    ctxw.fillRect(0,0,w,h)
    ctxw.lineWidth=2
    ctxw.strokeStyle=darkMode?'#06b6d4':'#2563eb'
    ctxw.beginPath()
    const slice=w/buffer.length
    let x=0
    for(let i=0;i<buffer.length;i++){
      const v=buffer[i]/128.0
      const y=v*h/2
      if(i===0) ctxw.moveTo(x,y)
      else ctxw.lineTo(x,y)
      x+=slice
    }
    ctxw.stroke()
    ctxf.fillStyle='#000'
    ctxf.fillRect(0,0,fw,fh)
    let bx=0
    const bw=(fw/freq.length)*3
    for(let i=0;i<freq.length;i+=3){
      const val=freq[i]
      const bh=(val/255)*fh
      ctxf.fillStyle=darkMode?`rgb(${val},80,200)`: `rgb(${val},60,150)`
      ctxf.fillRect(bx,fh-bh,bw,bh)
      bx+=bw+1
    }
    rafId=requestAnimationFrame(loop)
  }
  if(rafId) cancelAnimationFrame(rafId)
  rafId=requestAnimationFrame(loop)
}
