/* Student Management — compact, production-ready */

/* Elements */
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const deptInput = document.getElementById("dept");
const addBtn = document.getElementById("addBtn");
const searchBox = document.getElementById("searchBox");
const tableBody = document.querySelector("#studentTable tbody");
const headers = document.querySelectorAll("th[data-col]");
const errorMsg = document.getElementById("errorMsg");

const totalStudents = document.getElementById("totalStudents");
const totalDepts = document.getElementById("totalDepts");
const popularDept = document.getElementById("popularDept");
const chartCanvas = document.getElementById("deptChart");
const ctx = chartCanvas.getContext("2d");

const exportBtn = document.getElementById("exportBtn");
const toastEl = document.getElementById("toast");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageNumbers = document.getElementById("pageNumbers");
const pageSizeSelect = document.getElementById("pageSize");

/* Data and state */
let students = JSON.parse(localStorage.getItem("students_db")) || [];
let currentPage = 1;
let pageSize = parseInt(pageSizeSelect.value || 10);
let sortState = { name: 1, roll: 1, dept: 1 };

/* Utility: toast */
let toastTimeout;
function toast(msg){
  clearTimeout(toastTimeout);
  toastEl.textContent = msg;
  toastEl.style.opacity = "1";
  toastEl.style.transform = "translateY(0)";
  toastTimeout = setTimeout(()=>{
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateY(-6px)";
  }, 1600);
}

/* Save DB */
function saveDB(){ localStorage.setItem("students_db", JSON.stringify(students)); }

/* Add student */
addBtn.addEventListener("click", ()=>{
  const n = nameInput.value.trim();
  const r = rollInput.value.trim();
  const d = deptInput.value.trim();
  if(!n || !r || !d){ errorMsg.textContent = "All fields are required."; return; }
  errorMsg.textContent = "";
  students.push({ name:n, roll:r, dept:d });
  saveDB();
  nameInput.value = ""; rollInput.value = ""; deptInput.value = "";
  toast("Student added");
  renderTable();
});

/* Render table with search / pagination */
function getFiltered(){
  const q = (searchBox.value || "").trim().toLowerCase();
  return students.filter(s => 
    s.name.toLowerCase().includes(q) ||
    s.roll.toLowerCase().includes(q) ||
    s.dept.toLowerCase().includes(q)
  );
}

function renderTable(){
  const filtered = getFiltered();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if(currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage -1)*pageSize;
  const pageData = filtered.slice(start, start+pageSize);

  tableBody.innerHTML = "";
  pageData.forEach(item=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.roll)}</td>
      <td>${escapeHtml(item.dept)}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    // delete
    tr.querySelector(".delete-btn").addEventListener("click", ()=>{
      const i = students.indexOf(item);
      if(i !== -1){ students.splice(i,1); saveDB(); toast("Deleted"); renderTable(); }
    });
    // edit
    tr.querySelector(".edit-btn").addEventListener("click", ()=> enableEdit(tr, item));
    tableBody.appendChild(tr);
  });

  renderPagination(filtered.length);
  renderStats();
  renderChart();
}

/* Pagination */
function renderPagination(totalItems){
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  pageNumbers.innerHTML = "";
  for(let i=1;i<=totalPages;i++){
    const s = document.createElement("span");
    s.textContent = i;
    if(i === currentPage) s.classList.add("active-page");
    s.addEventListener("click", ()=>{ currentPage = i; renderTable(); });
    pageNumbers.appendChild(s);
  }
}
prevPageBtn.addEventListener("click", ()=>{ currentPage = Math.max(1, currentPage-1); renderTable(); });
nextPageBtn.addEventListener("click", ()=>{ 
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  currentPage = Math.min(totalPages, currentPage+1); renderTable();
});
pageSizeSelect.addEventListener("change", ()=>{ pageSize = parseInt(pageSizeSelect.value); currentPage = 1; renderTable(); });

/* Search */
searchBox.addEventListener("input", ()=>{ currentPage = 1; renderTable(); });

/* Sorting */
headers.forEach(h => {
  h.addEventListener("click", ()=>{
    const col = h.dataset.col;
    students.sort((a,b)=> a[col].localeCompare(b[col]) * sortState[col]);
    sortState[col] *= -1;
    saveDB(); renderTable();
  });
});

/* Edit row inline */
function enableEdit(row, obj){
  row.classList.add("editing");
  row.innerHTML = `
    <td><input class="edit-input" value="${escapeHtml(obj.name)}" /></td>
    <td><input class="edit-input" value="${escapeHtml(obj.roll)}" /></td>
    <td><input class="edit-input" value="${escapeHtml(obj.dept)}" /></td>
    <td>
      <button class="save-btn">Save</button>
      <button class="cancel-btn">Cancel</button>
    </td>
  `;
  const saveBtn = row.querySelector(".save-btn");
  const cancelBtn = row.querySelector(".cancel-btn");
  saveBtn.addEventListener("click", ()=>{
    const inputs = row.querySelectorAll("input");
    const n = inputs[0].value.trim(), r = inputs[1].value.trim(), d = inputs[2].value.trim();
    if(!n || !r || !d){ toast("All fields required"); return; }
    obj.name = n; obj.roll = r; obj.dept = d;
    saveDB(); toast("Updated"); renderTable();
  });
  cancelBtn.addEventListener("click", ()=> renderTable());
}

/* CSV export of full dataset (respecting current filtered set if needed) */
exportBtn.addEventListener("click", ()=>{
  /* export the current filtered set (not only current page) */
  const filtered = getFiltered();
  let csv = "Name,Roll,Department\n";
  filtered.forEach(s => {
    csv += `"${s.name.replace(/"/g,'""')}","${s.roll.replace(/"/g,'""')}","${s.dept.replace(/"/g,'""')}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "students.csv"; a.click();
  URL.revokeObjectURL(url);
  toast("Exported CSV");
});

/* Stats */
function renderStats(){
  totalStudents.textContent = students.length;
  const deptCounts = {};
  students.forEach(s => deptCounts[s.dept] = (deptCounts[s.dept]||0)+1);
  totalDepts.textContent = Object.keys(deptCounts).length;
  const popular = Object.keys(deptCounts).sort((a,b)=>deptCounts[b]-deptCounts[a])[0];
  popularDept.textContent = popular || "—";
}

/* Chart (simple pie) */
function renderChart(){
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  ctx.clearRect(0,0,width,height);
  if(students.length === 0) return;
  const counts = {};
  students.forEach(s => counts[s.dept] = (counts[s.dept]||0)+1);
  const names = Object.keys(counts);
  const total = students.length;
  const colors = ["#22c1c3","#60a5fa","#fbbf24","#fb7185","#a78bfa","#34d399"];
  let start = 0;
  const cx = width/2, cy = height/2, r = Math.min(width,height)/3;
  let i=0;
  for(const d of names){
    const slice = (counts[d]/total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,start+slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start += slice;
    i++;
  }
}

/* escape helper */
function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* initial render */
renderTable();
