// Advanced text analyzer (no branding phrases used anywhere)

// Elements
const input = document.getElementById('inputText');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportReport');
const liveMode = document.getElementById('liveMode');

const refText = document.getElementById('refText');

const resultPanel = document.getElementById('resultPanel');

const charsEl = document.getElementById('chars');
const charsNoSpaceEl = document.getElementById('charsNoSpace');
const wordsEl = document.getElementById('words');
const sentencesEl = document.getElementById('sentences');
const parasEl = document.getElementById('paras');
const fleschEl = document.getElementById('flesch');

const keywordsEl = document.getElementById('keywords');
const freqListEl = document.getElementById('freqList');
const suggestionsEl = document.getElementById('suggestions');
const longSentEl = document.getElementById('longSentences');
const summaryEl = document.getElementById('summary');
const reversedEl = document.getElementById('reversed');
const overlapEl = document.getElementById('overlap');

const removeSpacesBtn = document.getElementById('removeSpaces');
const removeBlankBtn = document.getElementById('removeBlank');
const toLowerBtn = document.getElementById('toLower');
const capSentBtn = document.getElementById('capSent');

const toastEl = document.getElementById('toast');

function toast(msg){
  toastEl.textContent = msg;
  toastEl.style.opacity = '1';
  toastEl.style.transform = 'translateY(0)';
  setTimeout(()=>{ toastEl.style.opacity = '0'; toastEl.style.transform='translateY(-6px)'; }, 1500);
}

/* -- Utility functions -- */
function splitWords(text){
  return text.trim().split(/\s+/).filter(Boolean);
}

function splitSentences(text){
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length>0);
}

function countSyllables(word){
  word = word.toLowerCase().replace(/[^a-z]/g,'');
  if(!word) return 0;
  const vowels = 'aeiouy';
  let syllables = 0;
  let prevVowel = false;
  for(let ch of word){
    const isV = vowels.includes(ch);
    if(isV && !prevVowel){ syllables++; prevVowel = true; }
    else if(!isV) prevVowel = false;
  }
  // heuristics
  if(word.length <= 3) return 1;
  if(word.endsWith('e')) syllables = Math.max(1, syllables - 1);
  return syllables || 1;
}

function fleschReadingEase(totalWords, totalSentences, totalSyllables){
  if(totalWords === 0 || totalSentences===0) return 0;
  const score = 206.835 - 1.015*(totalWords/totalSentences) - 84.6*(totalSyllables/totalWords);
  return Math.round(score);
}

function levenshtein(a,b){
  const m=a.length,n=b.length; const dp=Array(m+1).fill().map(()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++) dp[i][0]=i;
  for(let j=0;j<=n;j++) dp[0][j]=j;
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
    const cost = a[i-1]===b[j-1]?0:1;
    dp[i][j]=Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
  }
  return dp[m][n];
}

// small common-word dictionary for basic spelling suggestions
const commonWords = (`the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us`).split(' ');

const stopwords = new Set([
  "the","is","in","and","a","to","it","of","for","on","with","as","this","that","by","an","be","are","or","from","at","was","but","not","have","they","you","I","he","she","we","his","her"
]);

/* -- Core analysis -- */
function analyze(){
  const text = input.value;
  if(!text || !text.trim()){
    resultPanel.classList.add('hidden');
    return;
  }
  resultPanel.classList.remove('hidden');

  // basic counts
  const charCount = text.length;
  const charNoSpace = text.replace(/\s+/g,'').length;
  const words = splitWords(text);
  const totalWords = words.length;
  const sentences = splitSentences(text);
  const totalSentences = sentences.length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length>0).length;

  // syllables
  let totalSyllables = 0;
  words.forEach(w => totalSyllables += countSyllables(w));

  // flesch
  const flesch = fleschReadingEase(totalWords, totalSentences || 1, totalSyllables || Math.max(1,totalWords));

  // frequencies & keyword density
  const freq = {};
  words.forEach(w => {
    const key = w.toLowerCase().replace(/[^a-z0-9']/g,'');
    if(!key) return;
    freq[key] = (freq[key]||0)+1;
  });

  const freqEntries = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
  const topKeywords = freqEntries.filter(([k])=>!stopwords.has(k)).slice(0,8);
  const keywordChips = topKeywords.map(([k,c]) => {
    const density = ((c/totalWords)*100).toFixed(2) + '%';
    return `<span class="chip">${k} (${density})</span>`;
  }).join(' ');
  keywordsEl.innerHTML = keywordChips || '<span class="muted">N/A</span>';

  // frequent words list
  freqListEl.innerHTML = freqEntries.slice(0,20).map(([k,c])=>`<div>${k} — ${c}</div>`).join('');

  // reversed text
  reversedEl.textContent = text.split('').reverse().join('');

  // long sentences (threshold 30 words)
  const longSentences = sentences.map(s=>s.trim()).filter(s => splitWords(s).length > 30);
  longSentEl.innerHTML = longSentences.length ? longSentences.map(s=>`<div>${escapeHtml(s)}</div>`).join('') : '<div class="muted">None</div>';

  // suggestions: repeated words, capitalization, punctuation spacing
  const suggestions = [];
  // repeated words (two in a row)
  const repeated = text.match(/\b(\w+)\s+\1\b/gi);
  if(repeated) suggestions.push(`Repeated words found: ${[...new Set(repeated)].join(', ')}`);

  // sentence start capitalization
  sentences.forEach(s=>{
    const first = s.trim().charAt(0);
    if(first && first === first.toLowerCase()){
      suggestions.push(`Sentence may start with lowercase: "${s.trim().slice(0,40)}..."`);
    }
  });

  // punctuation spacing
  if(/\w[,;:]\S/.test(text)) suggestions.push('Missing space after punctuation candidate (e.g., "word,word").');

  // spelling suggestions: check words against commonWords and cost
  const miss = [];
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z']/g,'');
    if(!clean) return;
    if(commonWords.includes(clean) || clean.length<=2) return;
    // if word is alphabetic and not in commonWords, offer suggestion from list if distance small
    if(!commonWords.includes(clean)){
      let best = null; let bestD = 99;
      for(const cw of commonWords){
        const d = levenshtein(clean, cw);
        if(d < bestD){ bestD = d; best = cw; }
      }
      if(bestD>0 && bestD <= Math.min(2, Math.floor(clean.length/3))) miss.push(`${clean} → suggestion: ${best} (dist ${bestD})`);
    }
  });
  if(miss.length) suggestions.push('Spelling suggestions: ' + miss.slice(0,6).join('; '));

  suggestionsEl.innerHTML = suggestions.length ? suggestions.map(s=>`<div>${escapeHtml(s)}</div>`).join('') : '<div class="muted">No issues detected</div>';

  // summary (simple extractive): score sentences by overlap with top keywords
  const keywordSet = new Set(topKeywords.map(e=>e[0]));
  const scored = sentences.map(s=>{
    const ws = splitWords(s.toLowerCase()).map(w=>w.replace(/[^a-z0-9']/g,''));
    const score = ws.reduce((acc,w)=> acc + (keywordSet.has(w)?1:0), 0);
    return {s,score};
  });
  const topSents = scored.sort((a,b)=>b.score-a.score).slice(0,3).filter(x=>x.score>0).map(x=>x.s.trim());
  summaryEl.innerHTML = topSents.length ? topSents.map(s=>`<div>${escapeHtml(s)}</div>`).join('') : '<div class="muted">Unable to produce summary (not enough keywords)</div>';

  // overlap with reference (n-gram trigrams)
  const ref = (refText.value || '').trim();
  if(ref){
    const overlapPercent = computeNgramOverlap(text, ref, 3);
    overlapEl.textContent = `${overlapPercent.toFixed(2)}% n-gram overlap (n=3)`;
  } else {
    overlapEl.textContent = 'No reference provided';
  }

  // fill top metrics
  charsEl.textContent = charCount;
  charsNoSpaceEl.textContent = charNoSpace;
  wordsEl.textContent = totalWords;
  sentencesEl.textContent = totalSentences;
  parasEl.textContent = paragraphs;
  fleschEl.textContent = flesch;

  // show toast briefly
  toast('Analysis complete');
}

/* n-gram overlap (simple) */
function computeNgramOverlap(a,b,n){
  function ngrams(s,n){
    const txt = s.toLowerCase().replace(/\s+/g,' ');
    const tokens = txt.split(' ').filter(Boolean);
    const out = new Set();
    for(let i=0;i<=tokens.length-n;i++){
      out.add(tokens.slice(i,i+n).join(' '));
    }
    return out;
  }
  const A = ngrams(a,n);
  const B = ngrams(b,n);
  if(A.size===0 || B.size===0) return 0;
  let match=0;
  A.forEach(x=>{ if(B.has(x)) match++; });
  const denom = Math.max(A.size, B.size);
  return (match/denom)*100;
}

/* Helpers */
function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* Buttons & tools */
analyzeBtn.addEventListener('click', analyze);
clearBtn.addEventListener('click', ()=>{
  input.value = ''; refText.value = '';
  resultPanel.classList.add('hidden');
  toast('Cleared');
});
exportBtn.addEventListener('click', ()=>{
  const report = buildReportText();
  const blob = new Blob([report], {type:'text/plain'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='text-analysis-report.txt'; a.click();
  toast('Report exported');
});

removeSpacesBtn.addEventListener('click', ()=>{
  input.value = input.value.replace(/\s+/g,' ').trim();
  analyze();
});
removeBlankBtn.addEventListener('click', ()=>{
  input.value = input.value.replace(/\n{2,}/g,'\n').trim();
  analyze();
});
toLowerBtn.addEventListener('click', ()=>{ input.value = input.value.toLowerCase(); analyze(); });
capSentBtn.addEventListener('click', ()=>{
  input.value = input.value.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  analyze();
});

/* live mode */
liveMode.addEventListener('change', ()=>{
  if(liveMode.checked) input.addEventListener('input', analyze);
  else input.removeEventListener('input', analyze);
});

/* build textual report */
function buildReportText(){
  return `Text Analysis Report
Generated: ${new Date().toLocaleString()}

Characters: ${charsEl.textContent}
Characters (no spaces): ${charsNoSpaceEl.textContent}
Words: ${wordsEl.textContent}
Sentences: ${sentencesEl.textContent}
Paragraphs: ${parasEl.textContent}
Flesch score: ${fleschEl.textContent}

Top keywords:
${keywordsEl.textContent.replace(/<[^>]+>/g,'')}

Frequent words:
${freqListEl.textContent}

Suggestions:
${suggestionsEl.textContent}

Summary:
${summaryEl.textContent}

Reversed text:
${reversedEl.textContent}

Overlap:
${overlapEl.textContent}

---- End of report
`;
}

/* accessibility: keyboard shortcut (Ctrl+Enter) to analyze */
input.addEventListener('keydown', (e)=>{ if(e.ctrlKey && e.key==='Enter') analyze(); });

/* initial hide */
resultPanel.classList.add('hidden');
