const DASH_KEY = 'dashboard_layout_v2';
const SETTINGS_KEY = 'dashboard_settings_v2';

const dashboard = document.getElementById('dashboard');
const addCardBtn = document.getElementById('addCardBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const downloadState = document.getElementById('downloadState');
const loadState = document.getElementById('loadState');

const snapToggle = document.getElementById('snapToggle');
const gridSizeInput = document.getElementById('gridSize');
const constrainToggle = document.getElementById('constrainToggle');
const touchToggle = document.getElementById('touchToggle');

const modal = document.getElementById('modal');
const jsonInput = document.getElementById('jsonInput');
const applyJson = document.getElementById('applyJson');
const cancelJson = document.getElementById('cancelJson');

const template = document.getElementById('card-template');

let cards = [];
let zCounter = 1000;
let settings = {
  snap: true,
  gridSize: 20,
  constrain: false,
  touchOptim: true
};

/* ---------------------------
   Persistence: load/save settings & layout
   --------------------------- */
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      settings = {...settings, ...s};
    }
  } catch (e) { console.error('loadSettings', e); }
  // apply to controls
  snapToggle.checked = !!settings.snap;
  gridSizeInput.value = settings.gridSize;
  constrainToggle.checked = !!settings.constrain;
  touchToggle.checked = !!settings.touchOptim;
  applyTouchUI(settings.touchOptim);
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) { console.error('saveSettings', e); }
}

function loadLayout() {
  try {
    const raw = localStorage.getItem(DASH_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    cards = parsed;
    cards.forEach(c => renderCard(c));
  } catch (e) { console.error('loadLayout', e); }
}

function saveLayout() {
  try {
    const state = cards.map(c => ({
      id:c.id,left:c.left,top:c.top,width:c.width,height:c.height,content:c.content,z:c.z
    }));
    localStorage.setItem(DASH_KEY, JSON.stringify(state));
  } catch (e) { console.error('saveLayout', e); }
}

/* ---------------------------
   Utilities
   --------------------------- */
function getEventPoint(e) {
  if (e.touches && e.touches[0]) return {x: e.touches[0].clientX, y: e.touches[0].clientY};
  return {x: e.clientX, y: e.clientY};
}

function snapValue(value) {
  const g = Number(settings.gridSize) || 20;
  if (!settings.snap) return value;
  return Math.round(value / g) * g;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function createCardData(opts = {}) {
  const id = opts.id ?? ('card_' + Date.now() + '_' + Math.floor(Math.random()*1000));
  const rect = dashboard.getBoundingClientRect();
  const left = typeof opts.left === 'number' ? opts.left : Math.max(12, Math.min(rect.width - 300, 20 + cards.length * 24));
  const top = typeof opts.top === 'number' ? opts.top : Math.max(12, Math.min(rect.height - 200, 20 + cards.length * 24));
  const width = opts.width ?? 280;
  const height = opts.height ?? 180;
  const z = opts.z ?? ++zCounter;
  const content = opts.content ?? `Widget ${cards.length + 1}`;
  return {id,left,top,width,height,content,z};
}

/* ---------------------------
   Rendering & handlers
   --------------------------- */
function renderCard(data) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.id = data.id;
  node.tabIndex = 0;
  node.style.left = data.left + 'px';
  node.style.top = data.top + 'px';
  node.style.width = data.width + 'px';
  node.style.height = data.height + 'px';
  node.style.zIndex = data.z ?? ++zCounter;
  node.querySelector('.card-title').textContent = data.content;
  attachCardHandlers(node, data);
  dashboard.appendChild(node);
  data.el = node;
  // apply touch class if set
  if (settings.touchOptim) node.classList.add('touch-optimized');
  return node;
}

function attachCardHandlers(el, data) {
  const header = el.querySelector('.card-header');
  const handle = el.querySelector('.resize-handle');
  const removeBtn = el.querySelector('.remove-btn');
  const body = el.querySelector('.card-body');

  // focusable to receive keyboard nudges
  el.addEventListener('keydown', (e) => {
    const step = Number(settings.gridSize) || 20;
    const big = e.shiftKey ? step * 5 : step;
    let moved = false;
    if (e.key === 'ArrowUp') {
      data.top = clamp( (settings.snap ? snapValue(data.top - big) : data.top - big), 6, dashboard.clientHeight - 40);
      el.style.top = data.top + 'px';
      moved = true;
    } else if (e.key === 'ArrowDown') {
      data.top = clamp( (settings.snap ? snapValue(data.top + big) : data.top + big), 6, dashboard.clientHeight - 40);
      el.style.top = data.top + 'px';
      moved = true;
    } else if (e.key === 'ArrowLeft') {
      data.left = clamp( (settings.snap ? snapValue(data.left - big) : data.left - big), 6, dashboard.clientWidth - 40);
      el.style.left = data.left + 'px';
      moved = true;
    } else if (e.key === 'ArrowRight') {
      data.left = clamp( (settings.snap ? snapValue(data.left + big) : data.left + big), 6, dashboard.clientWidth - 40);
      el.style.left = data.left + 'px';
      moved = true;
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      removeBtn.click();
    }
    if (moved) {
      e.preventDefault();
      persistData(data);
    }
  });

  header.addEventListener('mousedown', startDrag);
  header.addEventListener('touchstart', startDrag, {passive:false});
  handle.addEventListener('mousedown', startResize);
  handle.addEventListener('touchstart', startResize, {passive:false});
  removeBtn.addEventListener('click', removeCard);
  body.addEventListener('dblclick', makeEditable);

  function makeEditable() {
    const txt = prompt('Edit widget title and content (title | content)', `${data.content} | ${body.innerText.trim()}`);
    if (txt === null) return;
    const [titlePart, ...rest] = txt.split('|');
    const title = titlePart ? titlePart.trim() : data.content;
    const content = rest.length ? rest.join('|').trim() : body.innerText;
    data.content = title;
    el.querySelector('.card-title').textContent = title;
    body.innerHTML = `<p>${content}</p>`;
    persistData(data);
  }

  function removeCard() {
    dashboard.removeChild(el);
    cards = cards.filter(c => c.id !== data.id);
    saveLayout();
  }

  function startDrag(e) {
    e.preventDefault();
    bringToFront(el);
    el.classList.add('dragging');
    const start = getEventPoint(e);
    const rect = el.getBoundingClientRect();
    const dashRect = dashboard.getBoundingClientRect();
    const offsetX = start.x - rect.left;
    const offsetY = start.y - rect.top;

    function onMove(ev) {
      ev.preventDefault();
      const p = getEventPoint(ev);
      let nx = p.x - dashRect.left - offsetX;
      let ny = p.y - dashRect.top - offsetY;

      // optionally snap to grid
      if (settings.snap) {
        nx = snapValue(nx);
        ny = snapValue(ny);
      }

      // optional constrain to grid bounds
      if (settings.constrain) {
        nx = Math.round(nx / settings.gridSize) * settings.gridSize;
        ny = Math.round(ny / settings.gridSize) * settings.gridSize;
      }

      // clamp inside dashboard
      nx = clamp(nx, 6, dashRect.width - 40);
      ny = clamp(ny, 6, dashRect.height - 40);

      el.style.left = nx + 'px';
      el.style.top = ny + 'px';
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      el.classList.remove('dragging');
      data.left = parseInt(el.style.left,10);
      data.top = parseInt(el.style.top,10);
      persistData(data);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, {passive:false});
    document.addEventListener('touchend', onUp);
  }

  function startResize(e) {
    e.preventDefault();
    bringToFront(el);
    const start = getEventPoint(e);
    const rect = el.getBoundingClientRect();
    const dashRect = dashboard.getBoundingClientRect();

    function onMove(ev) {
      ev.preventDefault();
      const p = getEventPoint(ev);
      let nw = Math.max(140, Math.round((p.x - rect.left) ));
      let nh = Math.max(90, Math.round((p.y - rect.top) ));

      if (settings.snap) {
        nw = snapValue(nw);
        nh = snapValue(nh);
      }

      // clamp so the card doesn't overflow dashboard
      if (rect.left + nw > dashRect.left + dashRect.width - 10) nw = dashRect.left + dashRect.width - rect.left - 10;
      if (rect.top + nh > dashRect.top + dashRect.height - 10) nh = dashRect.top + dashRect.height - rect.top - 10;

      el.style.width = nw + 'px';
      el.style.height = nh + 'px';
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      data.width = parseInt(el.style.width,10);
      data.height = parseInt(el.style.height,10);
      persistData(data);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, {passive:false});
    document.addEventListener('touchend', onUp);
  }
}

/* bring to front and persist z */
function bringToFront(el) {
  zCounter++;
  el.style.zIndex = zCounter;
  const id = el.dataset.id;
  const idx = cards.findIndex(c => c.id === id);
  if (idx >= 0) cards[idx].z = zCounter;
  saveLayout();
}

/* persist data structure for single card */
function persistData(data) {
  const idx = cards.findIndex(c => c.id === data.id);
  const snapshot = {...data};
  // don't keep element reference
  delete snapshot.el;
  if (idx >= 0) {
    cards[idx] = {...cards[idx], ...snapshot};
  } else {
    cards.push(snapshot);
  }
  saveLayout();
}

/* ---------------------------
   UI actions
   --------------------------- */
addCardBtn.addEventListener('click', ()=> {
  const d = createCardData();
  cards.push(d);
  renderCard(d);
  saveLayout();
});

clearBtn.addEventListener('click', ()=> {
  if (!confirm('Remove all widgets?')) return;
  cards = [];
  while (dashboard.firstChild) dashboard.removeChild(dashboard.firstChild);
  localStorage.removeItem(DASH_KEY);
});

/* export to JSON file (download) */
exportBtn.addEventListener('click', () => {
  const payload = {settings, cards};
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

/* import via file input */
importFile.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (parsed.cards && Array.isArray(parsed.cards)) {
        applyImported(parsed);
      } else if (Array.isArray(parsed)) {
        applyImported({cards: parsed});
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Failed to parse JSON: ' + err.message);
    } finally {
      importFile.value = '';
    }
  };
  reader.readAsText(f);
});

/* Download state (same as export) */
downloadState.addEventListener('click', () => exportBtn.click());

/* Load state by paste (opens modal) */
loadState.addEventListener('click', () => {
  jsonInput.value = '';
  modal.classList.remove('hidden');
});
applyJson.addEventListener('click', () => {
  try {
    const parsed = JSON.parse(jsonInput.value);
    if (parsed.cards && Array.isArray(parsed.cards)) {
      applyImported(parsed);
      modal.classList.add('hidden');
    } else if (Array.isArray(parsed)) {
      applyImported({cards: parsed});
      modal.classList.add('hidden');
    } else {
      alert('Invalid JSON structure.');
    }
  } catch (err) {
    alert('Invalid JSON: ' + err.message);
  }
});
cancelJson.addEventListener('click', () => modal.classList.add('hidden'));

/* apply imported payload */
function applyImported(payload) {
  // optional: apply settings if present
  if (payload.settings) {
    settings = {...settings, ...payload.settings};
    saveSettings();
    snapToggle.checked = settings.snap;
    gridSizeInput.value = settings.gridSize;
    constrainToggle.checked = settings.constrain;
    touchToggle.checked = settings.touchOptim;
    applyTouchUI(settings.touchOptim);
  }
  // replace cards
  cards = (payload.cards || []).map(c => createCardData(c));
  // clear DOM and render
  while (dashboard.firstChild) dashboard.removeChild(dashboard.firstChild);
  cards.forEach(c => renderCard(c));
  saveLayout();
}

/* options controls bind */
snapToggle.addEventListener('change', () => { settings.snap = snapToggle.checked; saveSettings(); });
gridSizeInput.addEventListener('change', () => {
  let v = parseInt(gridSizeInput.value,10);
  if (isNaN(v) || v < 4) v = 4;
  settings.gridSize = v;
  gridSizeInput.value = v;
  // update grid background size
  dashboard.style.setProperty('--grid-size', `${v}px`);
  // update visual grid scale by changing the pseudo-element background-size
  dashboard.style.setProperty('background-size', `${v}px ${v}px`);
  saveSettings();
});
constrainToggle.addEventListener('change', () => { settings.constrain = constrainToggle.checked; saveSettings(); });
touchToggle.addEventListener('change', () => { settings.touchOptim = touchToggle.checked; applyTouchUI(settings.touchOptim); saveSettings(); });

function applyTouchUI(enabled) {
  // add/remove touch class on dashboard children
  Array.from(dashboard.children).forEach(ch => {
    if (enabled) ch.classList.add('touch-optimized'); else ch.classList.remove('touch-optimized');
  });
}

/* import via paste on keyboard: support Ctrl+Shift+I to open paste modal */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
    e.preventDefault();
    loadState.click();
  }
});

/* persist on window resize just in case */
window.addEventListener('resize', () => saveLayout());

/* ---------------------------
   Initialization: hydrate default state
   --------------------------- */
function hydrate() {
  loadSettings();
  loadLayout();
  // if no cards, create samples
  if (cards.length === 0) {
    const sample = createCardData({left:20,top:20,content:'Welcome'});
    const sample2 = createCardData({left:340,top:20,content:'Analytics'});
    cards.push(sample, sample2);
    renderCard(sample);
    renderCard(sample2);
    saveLayout();
  } else {
    // rendered in loadLayout
    // ensure touch class reflects setting
    if (settings.touchOptim) applyTouchUI(true);
  }
}

hydrate();
