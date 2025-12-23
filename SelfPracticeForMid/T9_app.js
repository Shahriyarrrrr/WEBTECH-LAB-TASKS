const zBase=2000
let zCounter=0

function createRoot(type){
  const root=document.createElement('div')
  root.className='modal-root'
  if(type==='drawer-left') root.classList.add('drawer-left')
  if(type==='drawer-right') root.classList.add('drawer-right')
  if(type==='drawer-bottom') root.classList.add('drawer-bottom')
  root.style.zIndex = zBase + (++zCounter)
  const overlay=document.createElement('div')
  overlay.className='modal-overlay'
  const wrapper=document.createElement('div')
  wrapper.className='modal-wrapper'
  root.appendChild(overlay)
  root.appendChild(wrapper)
  return {root,overlay,wrapper}
}

function buildCard(options){
  const card=document.createElement('div')
  card.className='modal-card'
  if(options.small) card.classList.add('small')
  const header=document.createElement('div')
  header.className='modal-header draggable'
  const title=document.createElement('div')
  title.className='modal-title'
  title.textContent = options.title || 'Modal'
  const close=document.createElement('button')
  close.className='modal-close'
  close.innerHTML='✕'
  header.appendChild(title)
  header.appendChild(close)
  const body=document.createElement('div')
  body.className='modal-body'
  const footer=document.createElement('div')
  footer.className='modal-footer'
  card.appendChild(header)
  card.appendChild(body)
  card.appendChild(footer)
  return {card,header,title,close,body,footer}
}

function openModal(opts={}){
  const type = opts.type || 'center'
  const {root,overlay,wrapper} = createRoot(type)
  wrapper.classList.add('modal-wrapper')
  if(type.startsWith('drawer')) wrapper.style.width = opts.width || (type==='drawer-bottom' ? '100%' : '420px')
  document.body.appendChild(root)
  setTimeout(()=>root.classList.add('enter'),10)
  const {card,header,close,body,footer,title} = buildCard(opts)
  if(opts.stackLabel){
    const s=document.createElement('span')
    s.className='stack-indicator'
    s.textContent = opts.stackLabel
    title.prepend(s)
  }
  wrapper.appendChild(card)
  const okBtn=document.createElement('button')
  okBtn.className='btn'
  okBtn.textContent='OK'
  const cancelBtn=document.createElement('button')
  cancelBtn.className='btn'
  cancelBtn.textContent='Close'
  footer.appendChild(cancelBtn)
  footer.appendChild(okBtn)
  if(opts.buttons){
    footer.innerHTML=''
    opts.buttons.forEach(b=>{
      const btn=document.createElement('button')
      btn.className='btn'
      if(b.primary) btn.classList.add('primary')
      btn.textContent=b.text
      btn.addEventListener('click', ()=>{ if(b.onClick) b.onClick(api); if(b.closeOnClick!==false) closeAll() })
      footer.appendChild(btn)
    })
  }
  function closeAll(){
    wrapper.classList.remove('active')
    overlay.classList.remove('active')
    setTimeout(()=>{ if(root && root.parentNode) root.parentNode.removeChild(root) },260)
    window.removeEventListener('keydown', onKey)
  }
  close.addEventListener('click', closeAll)
  cancelBtn.addEventListener('click', closeAll)
  overlay.addEventListener('click', e=>{ if(e.target===overlay) closeAll() })
  function onKey(e){ if(e.key==='Escape') closeAll() }
  window.addEventListener('keydown', onKey)
  wrapper.classList.add('active')
  overlay.classList.add('active')
  if(opts.ajax){
    body.innerHTML = '<div class="loading"><div class="spinner"></div><div>Loading…</div></div>'
    fetch(opts.ajax).then(r=>r.text()).then(html=>{
      body.innerHTML = html
      if(opts.onContentLoaded) opts.onContentLoaded({body,wrapper,card})
    }).catch(err=>{
      body.innerHTML = '<div>Error loading content</div>'
    })
  } else if(opts.html){
    body.innerHTML = opts.html
    if(opts.onContentLoaded) opts.onContentLoaded({body,wrapper,card})
  } else if(opts.form){
    renderForm(opts.form, body, (result)=>{
      if(opts.onSubmit) opts.onSubmit(result, api)
    })
  }
  if(opts.draggable){
    makeDraggable(wrapper, header)
  }
  const api = {
    close: closeAll,
    setContent: c=>{ body.innerHTML = c },
    body, footer, wrapper, root
  }
  return api
}

function makeDraggable(wrapper, handle){
  let dragging=false, startX=0, startY=0, origX=0, origY=0
  wrapper.style.position='fixed'
  wrapper.style.left = '50%'
  wrapper.style.top = '50%'
  wrapper.style.transform = 'translate(-50%,-50%)'
  handle.addEventListener('mousedown', onDown)
  handle.addEventListener('touchstart', onDown, {passive:false})
  function onDown(e){
    e.preventDefault()
    dragging=true
    handle.classList.add('dragging')
    startX = (e.touches ? e.touches[0].clientX : e.clientX)
    startY = (e.touches ? e.touches[0].clientY : e.clientY)
    const rect = wrapper.getBoundingClientRect()
    origX = rect.left
    origY = rect.top
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove, {passive:false})
    document.addEventListener('touchend', onUp)
  }
  function onMove(e){
    if(!dragging) return
    const cx = (e.touches ? e.touches[0].clientX : e.clientX)
    const cy = (e.touches ? e.touches[0].clientY : e.clientY)
    let nx = origX + (cx - startX)
    let ny = origY + (cy - startY)
    const vw = window.innerWidth, vh = window.innerHeight
    const wr = wrapper.getBoundingClientRect()
    nx = Math.max(6, Math.min(vw - wr.width - 6, nx))
    ny = Math.max(6, Math.min(vh - wr.height - 6, ny))
    wrapper.style.left = nx + 'px'
    wrapper.style.top = ny + 'px'
    wrapper.style.transform = 'translate(0,0)'
  }
  function onUp(){
    dragging=false
    handle.classList.remove('dragging')
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onUp)
  }
}

function renderForm(schema, container, onSubmit){
  container.innerHTML = ''
  const form=document.createElement('form')
  schema.fields.forEach(f=>{
    const row=document.createElement('div')
    row.className='form-row'
    const label=document.createElement('label')
    label.textContent = f.label
    const input=document.createElement('input')
    input.name = f.name
    input.type = f.type || 'text'
    if(f.placeholder) input.placeholder = f.placeholder
    row.appendChild(label)
    row.appendChild(input)
    const err=document.createElement('div')
    err.className='form-error'
    row.appendChild(err)
    form.appendChild(row)
  })
  const actions=document.createElement('div')
  actions.style.display='flex'
  actions.style.justifyContent='flex-end'
  actions.style.gap='8px'
  const submit=document.createElement('button')
  submit.type='submit'
  submit.className='btn primary'
  submit.textContent='Submit'
  const cancel=document.createElement('button')
  cancel.type='button'
  cancel.className='btn'
  cancel.textContent='Cancel'
  actions.appendChild(cancel)
  actions.appendChild(submit)
  form.appendChild(actions)
  container.appendChild(form)
  form.addEventListener('submit', e=>{
    e.preventDefault()
    const data={}
    let ok=true
    schema.fields.forEach((f,idx)=>{
      const input=form.elements[f.name]
      const val = (input && input.value || '').trim()
      const errEl = form.querySelectorAll('.form-error')[idx]
      errEl.textContent = ''
      if(f.required && !val){ errEl.textContent = f.error || 'Required'; ok=false }
      if(f.type==='email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){ errEl.textContent = 'Invalid email'; ok=false }
      data[f.name]=val
    })
    if(ok){ onSubmit(data) }
  })
  cancel.addEventListener('click', ()=>{ const root = container.closest('.modal-root'); if(root && root.parentNode) root.parentNode.removeChild(root) })
}

document.getElementById('openCenter').addEventListener('click', ()=>{
  openModal({title:'Center Modal', html:'<p>This is a centered modal with scale animation.</p><p>You can open multiple modals; they stack.</p>', stackLabel:'1'})
})

document.getElementById('openDraggable').addEventListener('click', ()=>{
  openModal({title:'Draggable', html:'<p>Drag the header to move me around.</p>', draggable:true})
})

document.getElementById('openStack').addEventListener('click', ()=>{
  openModal({title:'Stack A', html:'<p>Stack A</p>', stackLabel:'A'})
  setTimeout(()=>openModal({title:'Stack B', html:'<p>Stack B</p>', stackLabel:'B'}),180)
  setTimeout(()=>openModal({title:'Stack C', html:'<p>Stack C</p>', stackLabel:'C'}),360)
})

document.getElementById('openDrawerBottom').addEventListener('click', ()=>{
  openModal({title:'Drawer Bottom', type:'drawer-bottom', html:'<p>This is a drawer from the bottom.</p>', buttons:[{text:'Close'}]})
})

document.getElementById('openDrawerRight').addEventListener('click', ()=>{
  openModal({title:'Drawer Right', type:'drawer-right', html:'<p>This drawer slides from the right.</p>'})
})

document.getElementById('openAjax').addEventListener('click', ()=>{
  openModal({title:'AJAX Content', ajax:'https://baconipsum.com/api/?type=meat-and-filler&paras=2&format=text', onContentLoaded:({body})=>{
    const pre=document.createElement('pre')
    pre.textContent = body.textContent || body.innerText || body.innerHTML
    body.innerHTML = ''
    body.appendChild(pre)
  }})
})

document.getElementById('openForm').addEventListener('click', ()=>{
  openModal({title:'Fill Details', form:{fields:[
    {name:'fullname',label:'Full name',required:true},
    {name:'email',label:'Email',type:'email',required:true},
    {name:'notes',label:'Notes'}
  ]}, onSubmit:(data,api)=>{
    api.setContent(`<p>Received: ${escapeHtml(data.fullname)} — ${escapeHtml(data.email)}</p>`)
    setTimeout(()=>{ if(api && api.close) api.close() },1200)
  }})
})

function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;') }
