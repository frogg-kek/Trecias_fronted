// Centralizuotas JS objektas – saugo visus surinktus formos laukų reikšmes
const formData = {};

const qs = id => document.getElementById(id);
const surveyForm = qs('surveyForm');
const progress = qs('progress');
const progressText = qs('progressText');
const statusMessage = qs('statusMessage');

// Pagalbinės funkcijos (pvz., amžiaus skaičiavimas, pažangos atnaujinimas)
function computeAge(birthdateStr){
  if(!birthdateStr) return null;
  const bd = new Date(birthdateStr);
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
  return age;
}

function updateProgress(){
  const requiredIds = ['gender','firstName','lastName','birthdate','education','phone','email','marital'];
  let filled = 0;
  requiredIds.forEach(id => {
    const el = qs(id);
    if(!el) return;
    if(el.value && el.checkValidity()) filled++;
  });
  const pct = Math.round((filled / requiredIds.length) * 100);
  progress.value = pct;
  progressText.textContent = pct + '%';
}

// Mark labels that contain a span.required as required inputs and return the list
function markAsteriskRequired(){
  const requiredEls = [];
  document.querySelectorAll('label').forEach(label => {
    if(label.querySelector('.required')){
      const id = label.getAttribute('for');
      if(id){
        const el = qs(id);
        if(el){
          el.required = true;
          requiredEls.push(el);
        }
      }
    }
  });
  return requiredEls;
}

function isElementVisible(el){
  if(!el) return false;
  // consider hidden by utility class 'hidden' or not in layout
  if(el.classList && el.classList.contains('hidden')) return false;
  if(el.offsetParent === null) return false;
  return true;
}

function getLabelTextFor(id){
  const lbl = document.querySelector('label[for="'+id+'"]');
  if(!lbl) return id;
  // remove any '*' span text
  const clone = lbl.cloneNode(true);
  const star = clone.querySelector('.required');
  if(star) star.remove();
  return clone.textContent.trim();
}

function checkRequiredFields(){
  // find all inputs/selects that are marked required by attribute and are visible
  const missing = [];
  const requiredEls = Array.from(document.querySelectorAll('input[required],select[required],textarea[required]'));
  for(const el of requiredEls){
    // skip elements that are hidden (their visibility controlled by .hidden or not in layout)
    if(!isElementVisible(el)) continue;
    // treat empty as missing; for checkboxes/radios additional logic could be added
    const val = el.value;
    const valid = el.checkValidity();
    if(!val || !valid){
      missing.push({id: el.id || el.name || '(field)', label: getLabelTextFor(el.id || el.name) });
    }
  }
  return missing;
}

function showRequiredMissingMessage(missing){
  if(!missing || missing.length === 0){
    statusMessage.textContent = '';
    statusMessage.className = 'hint';
    return;
  }
  const names = missing.map(m => m.label);
  statusMessage.textContent = 'Neužpildyti privalomi laukai: ' + names.join(', ');
  statusMessage.className = 'hint error';
}

// Field-level error helpers
function clearFieldError(el){
  if(!el) return;
  el.classList.remove('invalid-field');
  const next = el.nextElementSibling;
  if(next && next.classList && next.classList.contains('inline-error')){
    next.remove();
  }
}

function setFieldError(el, message){
  if(!el) return;
  clearFieldError(el);
  el.classList.add('invalid-field');
  const small = document.createElement('small');
  small.className = 'inline-error';
  small.textContent = message;
  // insert after the element
  if(el.parentNode){
    // If there's a following sibling (like a label) just insert after the element itself
    if(el.nextSibling) el.parentNode.insertBefore(small, el.nextSibling);
    else el.parentNode.appendChild(small);
  }
}

function clearAllFieldErrors(){
  document.querySelectorAll('.invalid-field').forEach(el => el.classList.remove('invalid-field'));
  document.querySelectorAll('.inline-error').forEach(n => n.remove());
}

function showStatusMessage(text, level='error'){
  statusMessage.textContent = text || '';
  statusMessage.className = text ? ('hint ' + level) : 'hint';
}

function syncFormData(){
  const fields = ['gender','firstName','middleName','lastName','birthdate','personalCode','education','eduInstitution','eduYear','qualification','degree','phone','email','address','marital','spouseName','profStatus','studyLevel','studyFinish','workPlace','unempReason','leaveEnd','experience','workField'];
  fields.forEach(f => {
    const el = qs(f);
    formData[f] = el ? el.value : '';
  });
}

function autofillPersonalCode(){
  const bd = qs('birthdate').value;
  if(!bd) return;
  // užpildo pirmus 6 simbolius asmens kodo formatu YYMMDD
  const d = new Date(bd);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const prefix = yy + mm + dd;
  const pc = qs('personalCode');
  // pakeičia prefiksą tik jei vartotojas rankiniu būdu nekeitė lauko (kad neperrašytume)
  if(!pc.dataset.manual){
    pc.value = prefix;
  }
}

// UI rodymo / slėpimo funkcijos (valdo papildomus laukus priklausomai nuo pasirinkimų)
function updateEducationUI(){
  const val = qs('education').value;
  const det = qs('educationDetails');
  const eduInstitution = qs('eduInstitution');
  const eduYear = qs('eduYear');
  const qualification = qs('qualification');
  const degree = qs('degree');

  const lblInstitution = document.querySelector('label[for="eduInstitution"]');
  const lblYear = document.querySelector('label[for="eduYear"]');
  const lblQualification = document.querySelector('label[for="qualification"]');
  const lblDegree = document.querySelector('label[for="degree"]');

  // pagal nutylėjimą paslepiame visą laukų grupę ir atitinkamas etiketes
  // (det – konteineris, o kiekvienas įrašas turi savo <label> ir <input/select>)
  det.classList.add('hidden');

  eduInstitution.classList.add('hidden'); 
  if(lblInstitution)
     lblInstitution.classList.add('hidden');

  eduYear.classList.add('hidden'); 
  if(lblYear) 
    lblYear.classList.add('hidden');

  qualification.classList.add('hidden'); 
  if(lblQualification) 
    lblQualification.classList.add('hidden');

  degree.classList.add('hidden'); 
  if(lblDegree) 
    lblDegree.classList.add('hidden');

  // Jei nėra pasirinkimo (tuščias), paliekame viską paslėptą
  if(!val) return;

  // parodyti konteinerį su išsilavinimo detalėmis (jis pats gali turėti atskirus laukus paslėptus)
  det.classList.remove('hidden');

  // Jei pasirinkta 'pagrindinis' arba 'vidurinis' – rodomi tik:
  // - Paskutinė įstaiga (eduInstitution)
  // - Baigimo metai (eduYear)
  if(val === 'pagrindinis' || val === 'vidurinis'){
    eduInstitution.classList.remove('hidden'); 
    if(lblInstitution) 
      lblInstitution.classList.remove('hidden');
    eduYear.classList.remove('hidden'); 
    if(lblYear) 
      lblYear.classList.remove('hidden');
    return;
  }

  // Jei pasirinkta 'profesinis' arba 'aukst_kolegija' – rodomi:
  // - Paskutinė įstaiga
  // - Baigimo metai
  // - Kvalifikacija ( papildomas laukas )
  if(val === 'profesinis' || val === 'aukst_kolegija'){
    
    eduInstitution.classList.remove('hidden'); 

    if(lblInstitution) lblInstitution.classList.remove('hidden');
    eduYear.classList.remove('hidden');

     if(lblYear) lblYear.classList.remove('hidden');
    qualification.classList.remove('hidden'); 

    if(lblQualification) 
      lblQualification.classList.remove('hidden');

    return;
  }

  // Jei pasirinktas 'aukštasis - Universitetinis' – rodomi visi papildomi laukai,
  // įskaitant mokslo laipsnį (degree)
  if(val === 'aukst_universitetas'){

    eduInstitution.classList.remove('hidden'); 
    if(lblInstitution) lblInstitution.classList.remove('hidden');
    eduYear.classList.remove('hidden'); 

    if(lblYear) lblYear.classList.remove('hidden');
    qualification.classList.remove('hidden'); 

    if(lblQualification) lblQualification.classList.remove('hidden');
    degree.classList.remove('hidden'); 

    if(lblDegree) lblDegree.classList.remove('hidden');
    return;
  }
}

function updateProfUI(){
  const val = qs('profStatus').value;
  const profDetails = qs('profDetails');
  // profDetails – pagrindinis blokas, kuriame dinamiškai rodomi tik atitinkami sub-blokai
  profDetails.classList.remove('hidden');
  // pagal nutylėjimą slėpti visus prof. blokelius
  qs('studyBlock').classList.add('hidden');
  qs('workBlock').classList.add('hidden');
  qs('unempBlock').classList.add('hidden');
  qs('leaveBlock').classList.add('hidden');
  // atidaryti tik tą bloką, kurį pasirinko vartotojas
  if(val === 'studijuoja') qs('studyBlock').classList.remove('hidden');
  if(val === 'dirba') qs('workBlock').classList.remove('hidden');
  if(val === 'nedirba') qs('unempBlock').classList.remove('hidden');
  if(val === 'atostogos') qs('leaveBlock').classList.remove('hidden');
}

function updateMaritalUI(){
  const val = qs('marital').value;
  // parodyti arba paslėpti sutuoktinio lauką priklausomai nuo vedybinės padėties
  const spouse = qs('spouseDetails');
  if(val === 'vedes') spouse.classList.remove('hidden');
  else spouse.classList.add('hidden');
}

function maritalAgeCheck(){
  const bd = qs('birthdate').value;
  const age = computeAge(bd);
  const marital = qs('marital');
  const msg = [];
  if(age === null){
    statusMessage.textContent = 'Nenurodyta gimimo data – negalima pilnai įvertinti santuokos teisėtumo.';
    statusMessage.className = 'hint warning';
    return;
  }
  if(age < 16){
    // jei asmuo jaunesnis nei 16, išjungti (disable) parinktį 'vedes' – negalima nurodyti
    for(const opt of marital.options){
      if(opt.value === 'vedes') opt.disabled = true;
    }
    msg.push('Santuoka negalima – amžius mažesnis nei 16 m.');
    statusMessage.className = 'hint error';
  } else if(age >= 16 && age < 18){
    for(const opt of marital.options){ if(opt.value === 'vedes') opt.disabled = false; }
    msg.push('Dėmesio: santuoka įstatymiškai leidžiama nuo 18 m.; yra ribiniai atvejai nuo 16 m.');
    statusMessage.className = 'hint warning';
  } else {
    for(const opt of marital.options){ if(opt.value === 'vedes') opt.disabled = false; }
    statusMessage.className = 'hint info';
    msg.push('Amžius OK santuokai (18+).');
  }
  statusMessage.textContent = msg.join(' ');
}

function validatePhone(phone){
  if(!phone) return false;
  const re1 = /^\+3706\d{7}$/;
  return re1.test(phone);
}

function validateEmail(email){
  // naudoja paprastą regex kaip papildomą patikrą (naršyklės validacija taip pat taikoma)
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email);
}

function showSummary(){
  syncFormData();
  const s = qs('summary');
  const c = qs('summaryContent');
  c.innerHTML = '';

  const personal = {
    'Lytis': formData.gender,
    'Vardas': formData.firstName,
    'Antras vardas': formData.middleName,
    'Pavardė': formData.lastName,
    'Gimimo data': formData.birthdate,
    'Amžius': computeAge(formData.birthdate),
    'Asmens kodas': formData.personalCode
  };
  const contact = {
    'Tel.': formData.phone,
    'El. paštas': formData.email,
    'Adresas': formData.address
  };
  const education = {
    'Išsilavinimas': formData.education,
    'Įstaiga': formData.eduInstitution,
    'Baigimo metai': formData.eduYear,
    'Kvalifikacija': formData.qualification,
    'Mokslo laipsnis': formData.degree
  };
  const prof = {
    'Vedybinė padėtis': formData.marital,
    'Sutuoktinis': formData.spouseName,
    'Profesinė padėtis': formData.profStatus,
    'Studijos/įstaiga': formData.studyLevel,
    'Tikėtini baigimo metai': formData.studyFinish,
    'Darbo įstaiga / pareigos': formData.workPlace,
    'Nedarbo priežastis': formData.unempReason,
    'Atostogų pabaiga': formData.leaveEnd,
    'Darbo patirtis (metai)': formData.experience,
    'Darbo sritis': formData.workField
  };

  [[ 'Asmens duomenys', personal],[ 'Kontaktai', contact],[ 'Išsilavinimas', education],[ 'Profesinė informacija', prof ]].forEach(([title,obj]) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    const h = document.createElement('h3'); h.textContent = title; card.appendChild(h);
    for(const k in obj){
      const p = document.createElement('p');
      p.innerHTML = `<strong>${k}:</strong> ${obj[k] || '<span style="color:#999">(nepateikta)</span>'}`;
      card.appendChild(p);
    }
    c.appendChild(card);
  });

  s.classList.remove('hidden');
}

// Įvykių susiejimas su lauko pakeitimais ir forma
// Registruojame listener'ius visiems input ir select elementams
// kad atnaujintume progresą, automatinį asmens kodo užpildymą ir UI pokyčius
[...document.querySelectorAll('input,select')].forEach(el => {
  el.addEventListener('input', e => {
    if(e.target.id === 'personalCode') e.target.dataset.manual = '1';
    // clear inline error for this field as user types
    clearFieldError(e.target);
    updateProgress();
  });
});

qs('birthdate').addEventListener('change', e => {
  autofillPersonalCode();
  maritalAgeCheck();
  updateProgress();
});

qs('education').addEventListener('change', updateEducationUI);
qs('profStatus').addEventListener('change', updateProfUI);
qs('marital').addEventListener('change', updateMaritalUI);

surveyForm.addEventListener('submit', e => {
  e.preventDefault();
  // Check required fields (those marked with asterisk) first
  clearAllFieldErrors();
  const missing = checkRequiredFields();
  if(missing.length){
    // show inline errors for each missing
    missing.forEach(m => {
      const el = document.getElementById(m.id);
      setFieldError(el, 'Šis laukas privalomas');
    });
    showRequiredMissingMessage(missing);
    // focus first missing field
    const first = document.getElementById(missing[0].id);
    if(first) first.focus();
    return;
  }
  // sinchronizuoti duomenis iš formos į formData objektą
  syncFormData();
  // validacijos (pvz., telefono ir el. pašto formato patikra, amžiaus taisyklės)
  const fieldErrors = [];
  if(!validatePhone(formData.phone)) fieldErrors.push({id:'phone', message: 'Telefono numeris turi būti formatu +3706xxxxxxx'});
  if(!validateEmail(formData.email)) fieldErrors.push({id:'email', message: 'El. pašto adresas neteisingas'});
  const age = computeAge(formData.birthdate);
  if(age !== null && formData.marital === 'vedes' && age < 16) fieldErrors.push({id:'marital', message: 'Sutuoktinis negali būti nurodytas jei asmuo jaunesnis nei 16 m.'});

  if(fieldErrors.length){
    // show inline field errors
    fieldErrors.forEach(fe => {
      const el = qs(fe.id);
      setFieldError(el, fe.message);
    });
    showStatusMessage(fieldErrors.map(f=>f.message).join(' | '), 'error');
    return;
  }

  // Viskas gerai — parodyti santrauką suskirstytą į kategorijas
  showSummary();
});

qs('resetBtn').addEventListener('click', () => {
  surveyForm.reset();
  qs('educationDetails').classList.add('hidden');
  qs('profDetails').classList.add('hidden');
  qs('spouseDetails').classList.add('hidden');
  qs('summary').classList.add('hidden');
  progress.value = 0; progressText.textContent = '0%';
  statusMessage.textContent = '';
  clearAllFieldErrors();
  for(const k in formData) delete formData[k];
});

// Pradinė UI būsena: atnaujinti rodomus laukus ir progreso indikatorių
updateEducationUI(); updateProfUI(); updateMaritalUI(); updateProgress();

// Ensure fields with asterisk are set as required and attach listeners to clear errors
const starred = markAsteriskRequired();
starred.forEach(el => {
  el.addEventListener('input', () => {
    const miss = checkRequiredFields();
    if(miss.length === 0) showRequiredMissingMessage([]);
    updateProgress();
  });
  el.addEventListener('change', () => {
    const miss = checkRequiredFields();
    if(miss.length === 0) showRequiredMissingMessage([]);
    updateProgress();
  });
});

// formData eksponuojamas konsolėje (naudinga derinimui / inspect devtools)
window.formData = formData;