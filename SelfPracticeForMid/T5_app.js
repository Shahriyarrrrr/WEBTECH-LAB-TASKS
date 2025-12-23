const fileInput=document.getElementById('fileInput')
const dropZone=document.getElementById('dropZone')
const previewArea=document.getElementById('previewArea')
const pasteHint=document.getElementById('pasteHint')
const cropToggle=document.getElementById('cropToggle')
const layoutGrid=document.getElementById('layoutGrid')
const layoutList=document.getElementById('layoutList')
const supabaseUrl=document.getElementById('supabaseUrl')
const supabaseKey=document.getElementById('supabaseKey')
const supabaseBucket=document.getElementById('supabaseBucket')
const initSupabase=document.getElementById('initSupabase')
const uploadSupabase=document.getElementById('uploadSupabase')
const supabaseStatus=document.getElementById('supabaseStatus')
const firebaseConfig=document.getElementById('firebaseConfig')
const initFirebase=document.getElementById('initFirebase')
const uploadFirebase=document.getElementById('uploadFirebase')
const firebaseStatus=document.getElementById('firebaseStatus')
const exportJson=document.getElementById('exportJson')
const importJson=document.getElementById('importJson')
const importFile=document.getElementById('importFile')
const totalProgress=document.getElementById('totalProgress').querySelector('.bar')
const progressText=document.getElementById('progressText')

let items=[]
let enableCropBeforeAdd=false
let supabaseClient=null
let firebaseApp=null
let firebaseStorage=null
let layoutMode='grid'
let currentCropItem=null

dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('dragover')})
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'))
dropZone.addEventListener('drop',e=>{e.preventDefault();dropZone.classList.remove('dragover');handleFiles(e.dataTransfer.files)})
dropZone.addEventListener('click',()=>fileInput.click())
fileInput.addEventListener('change',()=>handleFiles(fileInput.files))

pasteHint.addEventListener('click',()=>alert('Use Ctrl+V to paste screenshots.'))
window.addEventListener('paste',e=>{
  if(!e.clipboardData)return
  const arr=[]
  for(const it of e.clipboardData.items){
    if(it.kind==='file'){arr.push(it.getAsFile())}
  }
  if(arr.length)handleFiles(arr)
})

layoutGrid.addEventListener('click',()=>{layoutMode='grid';layoutGrid.classList.add('active');layoutList.classList.remove('active');renderItems()})
layoutList.addEventListener('click',()=>{layoutMode='list';layoutList.classList.add('active');layoutGrid.classList.remove('active');renderItems()})
cropToggle.addEventListener('click',()=>{enableCropBeforeAdd=!enableCropBeforeAdd;cropToggle.classList.toggle('active')})

function formatBytes(n){if(n<1024)return n+' B';if(n<1024*1024)return(n/1024).toFixed(1)+' KB';return(n/(1024*1024)).toFixed(2)+' MB'}

async function handleFiles(list){
  const arr=[...list]
  for(const file of arr){
    if(!file.type.startsWith('image/')){alert(file.name+' is not an image');continue}
    const dataURL=await readFileURL(file)
    if(enableCropBeforeAdd){
      openCropModal(dataURL,async b=>{
        const out=await processImageBlob(b,file.name)
        addItem(out)
      })
    }else{
      const out=await processImageFile(file)
      addItem(out)
    }
  }
  fileInput.value=''
}

function readFileURL(f){
  return new Promise(res=>{
    const r=new FileReader()
    r.onload=e=>res(e.target.result)
    r.readAsDataURL(f)
  })
}

async function loadImage(data){
  return new Promise(res=>{
    const img=new Image()
    img.onload=()=>res(img)
    img.src=data
  })
}

async function processImageFile(file){
  const img=await loadImage(await readFileURL(file))
  const blob=await convertToWebp(img)
  return{id:uid(),name:file.name,size:blob.size,blob,url:URL.createObjectURL(blob)}
}

async function processImageBlob(data,name){
  const img=await loadImage(data)
  const blob=await convertToWebp(img)
  return{id:uid(),name:name||'image.webp',size:blob.size,blob,url:URL.createObjectURL(blob)}
}

function convertToWebp(img){
  return new Promise(res=>{
    const c=document.createElement('canvas')
    c.width=img.width
    c.height=img.height
    c.getContext('2d').drawImage(img,0,0)
    c.toBlob(b=>res(b),'image/webp',0.92)
  })
}

function uid(){return'i'+Math.random().toString(36).slice(2)}

function addItem(o){
  items.push({...o,uploading:false,progress:0})
  renderItems()
  updateTotalProgress()
}

function renderItems(){
  previewArea.innerHTML=''
  previewArea.className='preview-area '+layoutMode
  items.forEach(it=>{
    const card=document.createElement('div')
    card.className='preview-card'+(layoutMode==='list'?' list':'')
    card.draggable=true
    card.dataset.id=it.id

    const drag=document.createElement('div')
    drag.className='drag-handle'
    drag.textContent='≡'
    card.appendChild(drag)

    const remove=document.createElement('button')
    remove.className='remove-btn'
    remove.textContent='Remove'
    remove.onclick=()=>removeItem(it.id)
    card.appendChild(remove)

    const img=document.createElement('img')
    img.className='thumb'
    img.src=it.url
    img.onclick=()=>openCropModal(it.url,async b=>{
      const p=await processImageBlob(await blobToDataURL(b),it.name)
      it.blob=p.blob
      it.url=p.url
      it.size=p.size
      renderItems()
    })
    card.appendChild(img)

    const info=document.createElement('div')
    info.className='preview-info'
    info.innerHTML=`<b>${it.name}</b><br>${formatBytes(it.size)}`
    card.appendChild(info)

    const actions=document.createElement('div')
    actions.className='preview-actions'

    const download=document.createElement('button')
    download.className='small-btn'
    download.textContent='Download'
    download.onclick=()=>downloadBlob(it.blob,it.name.replace(/\.[^/.]+$/,'')+'.webp')
    actions.appendChild(download)

    const up=document.createElement('button')
    up.className='small-btn'
    up.textContent=it.uploading?`Uploading ${Math.floor(it.progress)}%`:'Upload'
    up.onclick=()=>uploadSingle(it.id)
    actions.appendChild(up)

    card.appendChild(actions)

    card.ondragstart=e=>e.dataTransfer.setData('id',it.id)
    card.ondragover=e=>e.preventDefault()
    card.ondrop=e=>{
      e.preventDefault()
      const src=e.dataTransfer.getData('id')
      reorder(src,it.id)
    }

    previewArea.appendChild(card)
  })
}

function removeItem(id){
  const i=items.findIndex(x=>x.id===id)
  if(i!==-1){URL.revokeObjectURL(items[i].url);items.splice(i,1)}
  renderItems()
}

function reorder(a,b){
  const ia=items.findIndex(x=>x.id===a)
  const ib=items.findIndex(x=>x.id===b)
  if(ia<0||ib<0)return
  const [x]=items.splice(ia,1)
  items.splice(ib,0,x)
  renderItems()
}

function blobToDataURL(blob){
  return new Promise(res=>{
    const r=new FileReader()
    r.onload=e=>res(e.target.result)
    r.readAsDataURL(blob)
  })
}

function downloadBlob(blob,name){
  const a=document.createElement('a')
  a.href=URL.createObjectURL(blob)
  a.download=name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

async function uploadSingle(id){
  const it=items.find(x=>x.id===id)
  if(!it)return
  if(supabaseClient)await uploadToSupabase(it)
  if(firebaseStorage)await uploadToFirebase(it)
}

function updateTotalProgress(){
  const total=items.reduce((a,b)=>a+b.blob.size,0)
  const done=items.reduce((a,b)=>a+(b.progress/100)*b.blob.size,0)
  const pct=total?Math.round((done/total)*100):0
  totalProgress.style.width=pct+'%'
  progressText.textContent=`${items.length} files`
}

initSupabase.addEventListener('click',()=>{
  if(!supabaseUrl.value||!supabaseKey.value||!supabaseBucket.value){
    supabaseStatus.textContent='Missing values';return
  }
  supabaseClient=window.supabase.createClient(supabaseUrl.value,supabaseKey.value)
  supabaseStatus.textContent='Supabase initialized'
})

async function uploadToSupabase(it){
  const bucket=supabaseBucket.value
  const path=Date.now()+'_'+it.name.replace(/\s+/g,'_')
  it.uploading=true
  it.progress=0
  renderItems()
  const up=await supabaseClient.storage.from(bucket).upload(path,it.blob,{upsert:true})
  if(up.error){it.uploading=false;alert(up.error.message);renderItems();return}
  const {publicURL}=supabaseClient.storage.from(bucket).getPublicUrl(path)
  it.uploadUrl=publicURL
  it.uploading=false
  it.progress=100
  renderItems()
  updateTotalProgress()
}

initFirebase.addEventListener('click',()=>{
  try{
    const cfg=JSON.parse(firebaseConfig.value)
    firebaseApp=firebase.initializeApp(cfg)
    firebaseStorage=firebase.storage()
    firebaseStatus.textContent='Firebase initialized'
  }catch(e){
    firebaseStatus.textContent='Invalid JSON'
  }
})

async function uploadToFirebase(it){
  const name=Date.now()+'_'+it.name.replace(/\s+/g,'_')
  const ref=firebaseStorage.ref().child(name)
  it.uploading=true
  it.progress=0
  renderItems()
  const task=ref.put(it.blob)
  task.on('state_changed',s=>{
    it.progress=(s.bytesTransferred/s.totalBytes)*100
    renderItems()
  },err=>{
    it.uploading=false
    alert(err.message)
    renderItems()
  },async()=>{
    it.uploadUrl=await task.snapshot.ref.getDownloadURL()
    it.uploading=false
    it.progress=100
    renderItems()
    updateTotalProgress()
  })
}

exportJson.addEventListener('click',()=>{
  const data=items.map(x=>({id:x.id,name:x.name,size:x.size,url:x.uploadUrl||null}))
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
  downloadBlob(blob,'export.json')
})

importJson.addEventListener('click',()=>importFile.click())
importFile.addEventListener('change',e=>{
  const f=e.target.files[0]
  const r=new FileReader()
  r.onload=ev=>{
    try{
      const arr=JSON.parse(ev.target.result)
      arr.forEach(x=>{
        if(x.url){
          items.push({id:x.id||uid(),name:x.name,size:x.size||0,url:x.url,blob:null,progress:100,uploading:false})
        }
      })
      renderItems()
    }catch(e){alert('Invalid JSON')}
  }
  r.readAsText(f)
})

function openCropModal(src,onApply){
  const modal=document.getElementById('cropModal')
  const img=document.getElementById('cropImage')
  const box=document.getElementById('cropBox')
  const container=document.getElementById('cropContainer')
  img.src=src
  img.onload=()=>{
    box.style.left='40px'
    box.style.top='40px'
    box.style.width='180px'
    box.style.height='120px'
    modal.classList.remove('hidden')
    const apply=document.getElementById('applyCrop')
    const cancel=document.getElementById('cancelCrop')
    function done(){
      apply.onclick=null
      cancel.onclick=null
      modal.classList.add('hidden')
    }
    apply.onclick=async()=>{
      const c=captureCrop(img,box,container)
      c.toBlob(b=>{
        done()
        onApply(b)
      },'image/png')
    }
    cancel.onclick=()=>done()
  }
}

function captureCrop(img,box,container){
  const ib=img.getBoundingClientRect()
  const bb=box.getBoundingClientRect()
  const scaleX=img.naturalWidth/ib.width
  const scaleY=img.naturalHeight/ib.height
  const sx=(bb.left-ib.left)*scaleX
  const sy=(bb.top-ib.top)*scaleY
  const sw=bb.width*scaleX
  const sh=bb.height*scaleY
  const c=document.createElement('canvas')
  c.width=sw
  c.height=sh
  c.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,sw,sh)
  return c
}
