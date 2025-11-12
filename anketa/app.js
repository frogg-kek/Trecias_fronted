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
  // sinchronizuoti duomenis iš formos į formData objektą
  syncFormData();
  // validacijos (pvz., telefono ir el. pašto formato patikra, amžiaus taisyklės)
  const errors = [];
  if(!validatePhone(formData.phone)) errors.push('Telefono numeris turi būti formatu +3706xxxxxxx');
  if(!validateEmail(formData.email)) errors.push('El. pašto adresas neteisingas');
  const age = computeAge(formData.birthdate);
  if(age !== null && formData.marital === 'vedes' && age < 16) errors.push('Sutuoktinis negali būti nurodytas jei asmuo jaunesnis nei 16 m.');

  if(errors.length){
    alert('Patikrinkite šiuos klaidų pranešimus:\n- ' + errors.join('\n- '));
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
  for(const k in formData) delete formData[k];
});

// Pradinė UI būsena: atnaujinti rodomus laukus ir progreso indikatorių
updateEducationUI(); updateProfUI(); updateMaritalUI(); updateProgress();

// formData eksponuojamas konsolėje (naudinga derinimui / inspect devtools)
window.formData = formData;