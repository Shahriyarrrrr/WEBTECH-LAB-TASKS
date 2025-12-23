const imgFiles = document.getElementById('imgFiles')
const addFromUrl = document.getElementById('addFromUrl')
const imgList = document.getElementById('imgList')
const imageWrapper = document.getElementById('imageWrapper')
const inner = document.getElementById('inner')
const mainImage = document.getElementById('mainImage')
const markerLayer = document.getElementById('markerLayer')
const jsonPreview = document.getElementById('jsonPreview')
const markerList = document.getElementById('markerList')
const shapeSelect = document.getElementById('shapeSelect')
const colorSelect = document.getElementById('colorSelect')
const exportBtn = document.getElementById('exportBtn')
const importFile = document.getElementById('importFile')
const pasteBtn = document.getElementById('pasteBtn')
const editor = document.getElementById('editor')
const editLabel = document.getElementById('editLabel')
const editColor = document.getElementById('editColor')
const editShape = document.getElementById('editShape')
const saveMarkerBtn = document.getElementById('saveMarker')
const deleteMarkerBtn = document.getElementById('deleteMarker')
const closeEditor = document.getElementById('closeEditor')
const undoBtn = document.getElementById('undoBtn')
const redoBtn = document.getElementById('redoBtn')
const zoomIn = document.getElementById('zoomIn')
const zoomOut = document.getElementById('zoomOut')
const fitBtn = document.getElementById('fitBtn')

let images = []
let activeImageId = null
let markers = []
let nextId = 1
let actionStack = []
let redoStack = []
let scale = 1
let panX = 0
let panY = 0
let isPanning = false
let panStart = {x:0,y:0}
let innerStart = {x:0,y:0}
let dragState = null
let tooltipEl = null

function addImageFromFile(file){
  const reader = new FileReader()
  reader.onload = e=>{
    const id = 'img_' + Date.now() + '_' + Math.floor(Math.random()*1000)
    images.push({id, name: file.name, dataUrl: e.target.result})
    renderImageList()
    setActiveImage(id)
    pushAction({type:'add_image', imageId:id})
    saveStatePreview()
  }
  reader.readAsDataURL(file)
}

function addImageFromUrlPrompt(){
  const url = prompt('Paste image URL')
  if(!url) return
  const id = 'img_' + Date.now() + '_' + Math.floor(Math.random()*1000)
  images.push({id, name: url.split('/').pop() || id, dataUrl: url})
  renderImageList()
  setActiveImage(id)
  pushAction({type:'add_image', imageId:id})
  saveStatePreview()
}

imgFiles.addEventListener('change', e=>{
  const files = Array.from(e.target.files)
  files.forEach(f=> addImageFromFile(f))
  imgFiles.value = ''
})

addFromUrl.addEventListener('click', ()=> addImageFromUrlPrompt())

function renderImageList(){
  imgList.innerHTML = ''
  images.forEach(img=>{
    const div = document.createElement('div')
    div.className = 'img-item' + (img.id===activeImageId ? ' active' : '')
    div.dataset.id = img.id
    const thumb = document.createElement('img')
    thumb.className = 'img-thumb'
    thumb.src = img.dataUrl
    const span = document.createElement('div')
    span.textContent = img.name
    div.appendChild(thumb)
    div.appendChild(span)
    div.addEventListener('click', ()=> setActiveImage(img.id))
    imgList.appendChild(div)
  })
}

function setActiveImage(id){
  activeImageId = id
  const img = images.find(i=>i.id===id)
  if(!img) return
  mainImage.src = img.dataUrl
  markers = img.markers ? JSON.parse(JSON.stringify(img.markers)) : []
  nextId = markers.reduce((m,c)=> Math.max(m,c.id),0) + 1
  resetTransform()
  renderMarkers()
  renderList()
  renderImageList()
  saveStatePreview()
}

function resetTransform(){
  scale = 1
  panX = 0
  panY = 0
  applyTransform()
}

function applyTransform(){
  inner.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`
}

function getImageRect(){
  return mainImage.getBoundingClientRect()
}

function imagePointFromClient(clientX, clientY){
  const rect = inner.getBoundingClientRect()
  const x = (clientX - rect.left - panX) / scale
  const y = (clientY - rect.top - panY) / scale
  return {x,y}
}

function percentFromImagePoint(pt){
  const w = mainImage.naturalWidth || mainImage.width
  const h = mainImage.naturalHeight || mainImage.height
  if(!w || !h) return {px:0,py:0}
  const px = Math.min(100, Math.max(0, (pt.x / w) * 100))
  const py = Math.min(100, Math.max(0, (pt.y / h) * 100))
  return {px,py}
}

function imagePointFromPercent(px,py){
  const w = mainImage.naturalWidth || mainImage.width
  const h = mainImage.naturalHeight || mainImage.height
  return {x: (px/100)*w, y: (py/100)*h}
}

imageWrapper.addEventListener('click', e=>{
  if(e.target.classList.contains('marker')) return
  if(!activeImageId) return alert('Add or select an image first')
  const rect = inner.getBoundingClientRect()
  const pt = imagePointFromClient(e.clientX, e.clientY)
  const pct = percentFromImagePoint(pt)
  const id = nextId++
  const color = colorSelect.value
  const shape = shapeSelect.value
  const marker = {id, imageId: activeImageId, px: pct.px, py: pct.py, label:'', color, shape}
  markers.push(marker)
  pushAction({type:'add_marker', marker: JSON.parse(JSON.stringify(marker))})
  renderMarkers()
  renderList()
  saveImageMarkers()
  saveStatePreview()
})

function renderMarkers(){
  markerLayer.innerHTML = ''
  markers.forEach(m=>{
    const pos = imagePointFromPercent(m.px, m.py)
    const el = document.createElement('div')
    el.className = 'marker ' + m.shape
    el.style.left = pos.x + 'px'
    el.style.top = pos.y + 'px'
    el.style.background = m.color
    el.dataset.id = m.id
    el.innerHTML = `<span class="num">${m.id}</span>`
    el.title = m.label || `#${m.id}`
    el.style.pointerEvents = 'auto'
    markerLayer.appendChild(el)
    addMarkerEventListeners(el, m)
  })
  updateJsonPreview()
}

function addMarkerEventListeners(el, m){
  el.addEventListener('mousedown', e=>{
    if(e.button === 1) return
    e.stopPropagation()
    const start = imagePointFromClient(e.clientX, e.clientY)
    dragState = {id:m.id, startClient:{x:e.clientX, y:e.clientY}, startPt:start}
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onStopDrag, {once:true})
  })
  el.addEventListener('contextmenu', e=>{
    e.preventDefault()
    e.stopPropagation()
    openEditorFor(m.id)
    return false
  })
  el.addEventListener('mouseenter', e=>{
    showTooltipFor(m, el)
  })
  el.addEventListener('mouseleave', hideTooltip)
  el.addEventListener('dblclick', e=>{
    openEditorFor(m.id)
  })
}

function onDrag(e){
  if(!dragState) return
  const pt = imagePointFromClient(e.clientX, e.clientY)
  const p = percentFromImagePoint(pt)
  const idx = markers.findIndex(x=>x.id===dragState.id)
  if(idx===-1) return
  const old = {...markers[idx]}
  markers[idx].px = p.px
  markers[idx].py = p.py
  renderMarkers()
  renderList()
  saveImageMarkers()
}

function onStopDrag(e){
  if(!dragState) return
  const id = dragState.id
  const idx = markers.findIndex(x=>x.id===id)
  if(idx!==-1){
    pushAction({type:'move_marker', id, to: {px: markers[idx].px, py: markers[idx].py}, from: dragState.startPercent || {px: markers[idx].px, py: markers[idx].py}})
  }
  dragState = null
  saveStatePreview()
  document.removeEventListener('mousemove', onDrag)
}

function openEditorFor(id){
  const m = markers.find(x=>x.id===id)
  if(!m) return
  editLabel.value = m.label || ''
  editColor.value = m.color || '#2563eb'
  editShape.value = m.shape || 'circle'
  editor.classList.remove('hidden')
  editor.dataset.editId = id
}

saveMarkerBtn.addEventListener('click', ()=>{
  const id = Number(editor.dataset.editId)
  const idx = markers.findIndex(x=>x.id===id)
  if(idx===-1) return
  const before = JSON.parse(JSON.stringify(markers[idx]))
  markers[idx].label = editLabel.value
  markers[idx].color = editColor.value
  markers[idx].shape = editShape.value
  pushAction({type:'edit_marker', id, before, after: JSON.parse(JSON.stringify(markers[idx]))})
  editor.classList.add('hidden')
  renderMarkers()
  renderList()
  saveImageMarkers()
  saveStatePreview()
})

deleteMarkerBtn.addEventListener('click', ()=>{
  const id = Number(editor.dataset.editId)
  const idx = markers.findIndex(x=>x.id===id)
  if(idx===-1) return
  const before = JSON.parse(JSON.stringify(markers[idx]))
  markers.splice(idx,1)
  pushAction({type:'delete_marker', id, before})
  editor.classList.add('hidden')
  renderMarkers()
  renderList()
  saveImageMarkers()
  saveStatePreview()
})

closeEditor.addEventListener('click', ()=> editor.classList.add('hidden'))

function renderList(){
  markerList.innerHTML = ''
  markers.forEach(m=>{
    const li = document.createElement('li')
    li.textContent = `#${m.id} ${m.label || ''}`
    const btn = document.createElement('button')
    btn.textContent = 'Edit'
    btn.addEventListener('click', ()=> openEditorFor(m.id))
    li.appendChild(btn)
    markerList.appendChild(li)
  })
}

function updateJsonPreview(){
  jsonPreview.textContent = JSON.stringify(markers,null,2)
}

function saveImageMarkers(){
  const img = images.find(i=>i.id===activeImageId)
  if(!img) return
  img.markers = JSON.parse(JSON.stringify(markers))
}

exportBtn.addEventListener('click', ()=>{
  const payload = {images}
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `annotations-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
})

importFile.addEventListener('change', e=>{
  const f = e.target.files[0]
  if(!f) return
  const r = new FileReader()
  r.onload = ev=>{
    try{
      const parsed = JSON.parse(ev.target.result)
      if(parsed.images && Array.isArray(parsed.images)){
        images = parsed.images
        activeImageId = images[0] ? images[0].id : null
        renderImageList()
        if(activeImageId) setActiveImage(activeImageId)
      } else {
        alert('Invalid JSON')
      }
    }catch(err){
      alert('Invalid JSON')
    }
  }
  r.readAsText(f)
  importFile.value = ''
})

pasteBtn.addEventListener('click', async ()=>{
  try{
    const text = await navigator.clipboard.readText()
    const parsed = JSON.parse(text)
    if(parsed.images && Array.isArray(parsed.images)){
      images = parsed.images
      activeImageId = images[0] ? images[0].id : null
      renderImageList()
      if(activeImageId) setActiveImage(activeImageId)
    } else {
      alert('Invalid JSON from clipboard')
    }
  }catch(e){
    alert('Paste failed or clipboard empty')
  }
})

function pushAction(action){
  actionStack.push(action)
  redoStack = []
  updateUndoRedo()
}

function updateUndoRedo(){
  undoBtn.disabled = actionStack.length === 0
  redoBtn.disabled = redoStack.length === 0
}

undoBtn.addEventListener('click', ()=>{
  const action = actionStack.pop()
  if(!action) return
  applyUndo(action)
  redoStack.push(action)
  updateUndoRedo()
  saveStatePreview()
})

redoBtn.addEventListener('click', ()=>{
  const action = redoStack.pop()
  if(!action) return
  applyRedo(action)
  actionStack.push(action)
  updateUndoRedo()
  saveStatePreview()
})

function applyUndo(action){
  if(action.type === 'add_marker'){
    markers = markers.filter(m=>m.id !== action.marker.id)
    saveImageMarkers()
    renderMarkers()
    renderList()
  } else if(action.type === 'delete_marker'){
    markers.push(action.before)
    saveImageMarkers()
    renderMarkers()
    renderList()
  } else if(action.type === 'move_marker'){
    const idx = markers.findIndex(m=>m.id===action.id)
    if(idx!==-1){
      markers[idx].px = action.from?.px ?? markers[idx].px
      markers[idx].py = action.from?.py ?? markers[idx].py
      saveImageMarkers()
      renderMarkers()
      renderList()
    }
  } else if(action.type === 'edit_marker'){
    const idx = markers.findIndex(m=>m.id===action.id)
    if(idx!==-1){
      markers[idx] = JSON.parse(JSON.stringify(action.before))
      saveImageMarkers()
      renderMarkers()
      renderList()
    }
  } else if(action.type === 'add_image'){
    images = images.filter(i=>i.id!==action.imageId)
    if(images.length) activeImageId = images[0].id
    renderImageList()
    if(activeImageId) setActiveImage(activeImageId)
  }
}

function applyRedo(action){
  if(action.type === 'add_marker'){
    markers.push(action.marker)
    saveImageMarkers()
    renderMarkers()
    renderList()
  } else if(action.type === 'delete_marker'){
    markers = markers.filter(m=>m.id !== action.id)
    saveImageMarkers()
    renderMarkers()
    renderList()
  } else if(action.type === 'move_marker'){
    const idx = markers.findIndex(m=>m.id===action.id)
    if(idx!==-1){
      markers[idx].px = action.to.px
      markers[idx].py = action.to.py
      saveImageMarkers()
      renderMarkers()
      renderList()
    }
  } else if(action.type === 'edit_marker'){
    const idx = markers.findIndex(m=>m.id===action.id)
    if(idx!==-1){
      markers[idx] = JSON.parse(JSON.stringify(action.after))
      saveImageMarkers()
      renderMarkers()
      renderList()
    }
  } else if(action.type === 'add_image'){
    const img = images.find(i=>i.id===action.imageId)
    if(img){
      images.push(img)
      renderImageList()
    }
  }
}

function showTooltipFor(m, el){
  hideTooltip()
  tooltipEl = document.createElement('div')
  tooltipEl.className = 'tooltip'
  tooltipEl.textContent = m.label || `#${m.id}`
  document.body.appendChild(tooltipEl)
  const rect = el.getBoundingClientRect()
  tooltipEl.style.left = (rect.left + rect.width/2) + 'px'
  tooltipEl.style.top = (rect.top) + 'px'
}

function hideTooltip(){
  if(tooltipEl){ tooltipEl.remove(); tooltipEl = null }
}

let isMiddleDown = false
inner.addEventListener('wheel', e=>{
  e.preventDefault()
  const delta = Math.sign(e.deltaY) * -0.1
  const prev = scale
  scale = Math.min(4, Math.max(0.2, scale + delta))
  const rect = inner.getBoundingClientRect()
  const ox = e.clientX - rect.left
  const oy = e.clientY - rect.top
  panX -= (ox / prev) * (scale - prev)
  panY -= (oy / prev) * (scale - prev)
  applyTransform()
})

inner.addEventListener('mousedown', e=>{
  if(e.button === 1 || (e.button === 0 && e.ctrlKey)){
    isPanning = true
    isMiddleDown = true
    panStart = {x: e.clientX, y: e.clientY}
    innerStart = {x: panX, y: panY}
    document.body.style.cursor = 'grabbing'
    document.addEventListener('mousemove', onPan)
    document.addEventListener('mouseup', onPanEnd, {once:true})
  }
})

function onPan(e){
  if(!isPanning) return
  panX = innerStart.x + (e.clientX - panStart.x)
  panY = innerStart.y + (e.clientY - panStart.y)
  applyTransform()
}

function onPanEnd(){
  isPanning = false
  isMiddleDown = false
  document.body.style.cursor = ''
  document.removeEventListener('mousemove', onPan)
  saveStatePreview()
}

zoomIn.addEventListener('click', ()=>{ scale = Math.min(4, scale + 0.2); applyTransform(); saveStatePreview() })
zoomOut.addEventListener('click', ()=>{ scale = Math.max(0.2, scale - 0.2); applyTransform(); saveStatePreview() })
fitBtn.addEventListener('click', fitImage)

function fitImage(){
  const wrapperRect = imageWrapper.getBoundingClientRect()
  const img = new Image()
  img.onload = ()=>{
    const iw = img.width, ih = img.height
    const sx = wrapperRect.width / iw
    const sy = wrapperRect.height / ih
    scale = Math.min(sx, sy) * 0.95
    panX = (wrapperRect.width - iw * scale) / 2
    panY = (wrapperRect.height - ih * scale) / 2
    applyTransform()
  }
  img.src = mainImage.src
}

function saveStatePreview(){
  updateJsonPreview()
  updateUndoRedo()
}

function renderImageList(){ imgList.innerHTML=''; images.forEach(img=>{ const div=document.createElement('div'); div.className='img-item'+(img.id===activeImageId?' active':''); div.dataset.id=img.id; const thumb=document.createElement('img'); thumb.className='img-thumb'; thumb.src=img.dataUrl; const span=document.createElement('div'); span.textContent=img.name; div.appendChild(thumb); div.appendChild(span); div.addEventListener('click', ()=> setActiveImage(img.id)); imgList.appendChild(div) }) }

function updateJsonPreview(){ jsonPreview.textContent = JSON.stringify({imageId:activeImageId,markers},null,2) }

function saveImageStateToLocal(){
  try{ localStorage.setItem('anno_images', JSON.stringify(images)) }catch(e){}
}

function loadImageStateFromLocal(){
  try{
    const raw = localStorage.getItem('anno_images')
    if(raw) images = JSON.parse(raw)
  }catch(e){}
}

window.addEventListener('beforeunload', ()=> saveImageStateToLocal())

loadImageStateFromLocal()
if(images.length) { renderImageList(); setActiveImage(images[0].id) }
else renderImageList()
