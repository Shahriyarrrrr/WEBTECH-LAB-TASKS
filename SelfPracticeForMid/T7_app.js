const form=document.getElementById('multiForm')
const slidesContainer=document.getElementById('slides')
const stepsButtons=[...document.querySelectorAll('.step')]
const fields=[...document.querySelectorAll('.slide')]
const progressBar=document.getElementById('progressBar')
const toast=document.getElementById('toast')
const reviewModal=document.getElementById('reviewModal')
const reviewContent=document.getElementById('reviewContent')
const reviewBtn=document.getElementById('reviewBtn')
const closeReview=document.getElementById('closeReview')
const confirmSubmit=document.getElementById('confirmSubmit')
const submitBtn=document.getElementById('submitBtn')

const STORAGE='multi_step_v2'
let current=1
const total=fields.length

const mapFieldIds=['name','email','phone','street','city','zip']

function setSlide(n){
  current=n
  const translate = - ((n - 1) * 100 / total)
  form.style.transform = `translateX(${translate}%)`
  fields.forEach((f,i)=>{
    if(i===n-1) f.classList.add('active')
    else f.classList.remove('active')
  })
  stepsButtons.forEach((b,i)=>{
    if(i===n-1) b.classList.add('active')
    else b.classList.remove('active')
  })
  updateProgress()
  persist()
  window.scrollTo({top:0,behavior:'smooth'})
}

function updateProgress(){
  const pct = Math.round(((current-1)/(total-1))*100)
  progressBar.style.width = `${pct}%`
}

function showToast(msg,timeout=1800){
  toast.textContent = msg
  toast.classList.remove('hidden')
  setTimeout(()=>toast.classList.add('hidden'),timeout)
}

function persist(){
  const data={}
  mapFieldIds.forEach(id=>{
    const el=document.getElementById(id)
    if(el) data[id]=el.value
  })
  data._current=current
  localStorage.setItem(STORAGE,JSON.stringify(data))
}

function restore(){
  try{
    const raw=localStorage.getItem(STORAGE)
    if(!raw) return
    const data=JSON.parse(raw)
    mapFieldIds.forEach(id=>{
      const el=document.getElementById(id)
      if(el && data[id] !== undefined) el.value=data[id]
    })
    const cur=Math.min(total,Math.max(1,Number(data._current)||1))
    current = cur
  }catch(e){}
}

function validateStep(n){
  clearErrors(n)
  if(n===1) return validatePersonal()
  if(n===2) return validateAddress()
  if(n===3) return true
  return false
}

function clearErrors(n){
  const errs=document.querySelectorAll(`.slide[data-step="${n}"] .error`)
  errs.forEach(e=>e.textContent='')
}

function validateEmailFormat(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function validatePersonal(){
  const name=document.getElementById('name').value.trim()
  const email=document.getElementById('email').value.trim()
  const elName=document.getElementById('err-name')
  const elEmail=document.getElementById('err-email')
  let ok=true
  if(!name){ elName.textContent='Name required'; ok=false }
  if(!email){ elEmail.textContent='Email required'; ok=false }
  else if(!validateEmailFormat(email)){ elEmail.textContent='Invalid email'; ok=false }
  if(!ok) shakeStep(1)
  return ok
}

function validateAddress(){
  const street=document.getElementById('street').value.trim()
  const city=document.getElementById('city').value.trim()
  const zip=document.getElementById('zip').value.trim()
  const es=document.getElementById('err-street')
  const ec=document.getElementById('err-city')
  const ez=document.getElementById('err-zip')
  let ok=true
  if(!street){ es.textContent='Street required'; ok=false }
  if(!city){ ec.textContent='City required'; ok=false }
  if(!zip){ ez.textContent='ZIP required'; ok=false }
  if(!ok) shakeStep(2)
  return ok
}

function shakeStep(n){
  const el=document.querySelector(`.slide[data-step="${n}"]`)
  if(!el) return
  el.classList.add('shake')
  setTimeout(()=>el.classList.remove('shake'),450)
}

stepsButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const stepNum=Number(btn.dataset.step)
    let allowed=true
    for(let i=1;i<stepNum;i++){
      if(!validateStep(i)){ allowed=false; stepsButtons[i-1].classList.add('shake'); setTimeout(()=>stepsButtons[i-1].classList.remove('shake'),450); break }
    }
    if(allowed) setSlide(stepNum)
    else showToast('Complete earlier steps first')
  })
})

document.getElementById('next1').addEventListener('click',()=>{
  if(validateStep(1)) setSlide(2)
  else showToast('Please fix errors')
})

document.getElementById('back2').addEventListener('click',()=>setSlide(1))
document.getElementById('next2').addEventListener('click',()=>{
  if(validateStep(2)) setSlide(3)
  else showToast('Please fix errors')
})

document.getElementById('back3').addEventListener('click',()=>setSlide(2))

form.addEventListener('input',()=>persist())

reviewBtn.addEventListener('click',()=>{
  populateReview()
  reviewModal.classList.remove('hidden')
})

closeReview.addEventListener('click',()=>reviewModal.classList.add('hidden'))

confirmSubmit.addEventListener('click',()=>{
  reviewModal.classList.add('hidden')
  submitFinal()
})

form.addEventListener('submit',e=>{
  e.preventDefault()
  const ok1=validateStep(1)
  const ok2=validateStep(2)
  if(!ok1){ setSlide(1); showToast('Fix errors') ; return }
  if(!ok2){ setSlide(2); showToast('Fix errors') ; return }
  populateReview()
  reviewModal.classList.remove('hidden')
})

function populateReview(){
  const data={}
  mapFieldIds.forEach(id=>{
    const el=document.getElementById(id)
    data[id]=el?el.value:''
  })
  reviewContent.innerHTML=`
    <dl>
      <dt>Full name</dt><dd>${escapeHtml(data.name)}</dd>
      <dt>Email</dt><dd>${escapeHtml(data.email)}</dd>
      <dt>Phone</dt><dd>${escapeHtml(data.phone)}</dd>
      <dt>Street</dt><dd>${escapeHtml(data.street)}</dd>
      <dt>City</dt><dd>${escapeHtml(data.city)}</dd>
      <dt>ZIP</dt><dd>${escapeHtml(data.zip)}</dd>
    </dl>`
}

function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;') }

function submitFinal(){
  const payload={}
  mapFieldIds.forEach(id=>{ const el=document.getElementById(id); payload[id]=el?el.value:'' })
  localStorage.removeItem(STORAGE)
  showToast('Submitted successfully',2200)
  resetForm()
}

function resetForm(){
  mapFieldIds.forEach(id=>{ const el=document.getElementById(id); if(el) el.value='' })
  setSlide(1)
}

restore()
setSlide(current)
updateProgress()
