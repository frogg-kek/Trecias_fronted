// Objektas, kuriame saugomos visos formos reikšmės
var formData = {};

// Trumpesnė funkcija elementams gauti
function getEl(id) {
  return document.getElementById(id);
}

// Pagrindiniai DOM elementai
var surveyForm    = getEl('surveyForm');
var progress      = getEl('progress');
var progressText  = getEl('progressText');
var statusMessage = getEl('statusMessage');



// Amžiaus skaičiavimas pagal gimimo datą
function computeAge(birthdateStr) {
  if (!birthdateStr) return null;

  var bd = new Date(birthdateStr);
  var today = new Date();
  var age = today.getFullYear() - bd.getFullYear();
  var m = today.getMonth() - bd.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
    age--;
  }
  return age;
}

// Telefono numerio validacija (+3706xxxxxxx)
function validatePhone(phone) {
  if (!phone) return false;
  var re1 = /^\+3706\d{7}$/;
  return re1.test(phone);
}

// Paprasta email validacija
function validateEmail(email) {
  if (!email) return false;
  var re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email);
}

// Progreso juosta – kiek privalomų laukų užpildyta
function updateProgress() {
  if (!progress || !progressText) return;

  var requiredIds = [
    'gender','firstName','lastName','birthdate',
    'education','phone','email','marital'
  ];
  var filled = 0;

  for (var i = 0; i < requiredIds.length; i++) {
    var id = requiredIds[i];
    var el = getEl(id);
    if (!el) continue;

    if (el.value && el.checkValidity()) {
      filled++;
    }
  }

  var pct = Math.round((filled / requiredIds.length) * 100);

  progress.value = pct;
  progressText.textContent = pct + '%';
}

// Suvienodinam formos duomenis į formData objektą
function syncFormData() {
  var fields = [
    'gender','firstName','middleName','lastName','birthdate','personalCode',
    'education','eduInstitution','eduYear','qualification','degree',
    'phone','email','address','marital','spouseName',
    'profStatus','studyLevel','studyFinish','workPlace','unempReason',
    'leaveEnd','experience','workField'
  ];

  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    var el = getEl(f);
    formData[f] = el ? el.value : '';
  }
}

// Automatinis asmens kodo užpildymas pagal gimimo datą
function autofillPersonalCode() {
  var bd = getEl('birthdate');
  if (!bd || !bd.value) return;

  var d = new Date(bd.value);
  var yy = String(d.getFullYear()).slice(-2);
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  var prefix = yy + mm + dd;

  var pc = getEl('personalCode');
  if (!pc) return;

  // Jei vartotojas nekeičia pats
  if (!pc.dataset.manual) {
    pc.value = prefix;
  }
}



function updateEducationUI() {
  var eduSelect      = getEl('education');
  var det            = getEl('educationDetails');
  var eduInstitution = getEl('eduInstitution');
  var eduYear        = getEl('eduYear');
  var qualification  = getEl('qualification');
  var degree         = getEl('degree');

  var lblInstitution   = document.querySelector('label[for="eduInstitution"]');
  var lblYear          = document.querySelector('label[for="eduYear"]');
  var lblQualification = document.querySelector('label[for="qualification"]');
  var lblDegree        = document.querySelector('label[for="degree"]');

  if (!eduSelect || !det) return;

  var val = eduSelect.value;

  // viską paslepiam
  det.classList.add('hidden');
  if (eduInstitution) eduInstitution.classList.add('hidden');
  if (lblInstitution) lblInstitution.classList.add('hidden');
  if (eduYear)        eduYear.classList.add('hidden');
  if (lblYear)        lblYear.classList.add('hidden');
  if (qualification)  qualification.classList.add('hidden');
  if (lblQualification) lblQualification.classList.add('hidden');
  if (degree)         degree.classList.add('hidden');
  if (lblDegree)      lblDegree.classList.add('hidden');

  
  if (!val) return;

  // Rodom pagrindinį išsilavinimo bloką
  det.classList.remove('hidden');

  // Pagrindinis / vidurinis
  if (val === 'pagrindinis' || val === 'vidurinis') {
    if (eduInstitution) eduInstitution.classList.remove('hidden');
    if (lblInstitution) lblInstitution.classList.remove('hidden');
    if (eduYear)        eduYear.classList.remove('hidden');
    if (lblYear)        lblYear.classList.remove('hidden');
    return;
  }

  // Profesinis / aukštasis koleginis
  if (val === 'profesinis' || val === 'aukst_kolegija') {
    if (eduInstitution)   eduInstitution.classList.remove('hidden');
    if (lblInstitution)   lblInstitution.classList.remove('hidden');
    if (eduYear)          eduYear.classList.remove('hidden');
    if (lblYear)          lblYear.classList.remove('hidden');
    if (qualification)    qualification.classList.remove('hidden');
    if (lblQualification) lblQualification.classList.remove('hidden');
    return;
  }

  // Aukštasis universitetinis
  if (val === 'aukst_universitetas') {
    if (eduInstitution)   eduInstitution.classList.remove('hidden');
    if (lblInstitution)   lblInstitution.classList.remove('hidden');
    if (eduYear)          eduYear.classList.remove('hidden');
    if (lblYear)          lblYear.classList.remove('hidden');
    if (qualification)    qualification.classList.remove('hidden');
    if (lblQualification) lblQualification.classList.remove('hidden');
    if (degree)           degree.classList.remove('hidden');
    if (lblDegree)        lblDegree.classList.remove('hidden');
    return;
  }
}

function updateProfUI() {
  var profSelect  = getEl('profStatus');
  var profDetails = getEl('profDetails');
  var studyBlock  = getEl('studyBlock');
  var workBlock   = getEl('workBlock');
  var unempBlock  = getEl('unempBlock');
  var leaveBlock  = getEl('leaveBlock');

  if (!profSelect || !profDetails) return;

  var val = profSelect.value;

  // Rodome pagrindinį bloką
  profDetails.classList.remove('hidden');

  // Viską slepiam
  if (studyBlock) studyBlock.classList.add('hidden');
  if (workBlock)  workBlock.classList.add('hidden');
  if (unempBlock) unempBlock.classList.add('hidden');
  if (leaveBlock) leaveBlock.classList.add('hidden');

  // Parodome tik pasirinktą
  if (val === 'studijuoja' && studyBlock) studyBlock.classList.remove('hidden');
  if (val === 'dirba'      && workBlock)  workBlock.classList.remove('hidden');
  if (val === 'nedirba'    && unempBlock) unempBlock.classList.remove('hidden');
  if (val === 'atostogos'  && leaveBlock) leaveBlock.classList.remove('hidden');
}

function updateMaritalUI() {
  var maritalSelect = getEl('marital');
  var spouseDetails = getEl('spouseDetails');
  if (!maritalSelect || !spouseDetails) return;

  var val = maritalSelect.value;

  if (val === 'vedes') {
    spouseDetails.classList.remove('hidden');
  } else {
    spouseDetails.classList.add('hidden');
  }
}

// Santuokos amžiaus tikrinimas
function maritalAgeCheck() {
  var bdInput      = getEl('birthdate');
  var maritalSelect = getEl('marital');
  if (!bdInput || !maritalSelect || !statusMessage) return;

  var bd  = bdInput.value;
  var age = computeAge(bd);
  var msg = [];

  if (age === null) {
    statusMessage.textContent = 'Nenurodyta gimimo data – negalima pilnai įvertinti santuokos teisėtumo.';
    statusMessage.className = 'hint warning';
    return;
  }

  var i;
  if (age < 16) {
    for (i = 0; i < maritalSelect.options.length; i++) {
      if (maritalSelect.options[i].value === 'vedes') {
        maritalSelect.options[i].disabled = true;
      }
    }
    msg.push('Santuoka negalima – amžius mažesnis nei 16 m.');
    statusMessage.className = 'hint error';
  } else if (age >= 16 && age < 18) {
    for (i = 0; i < maritalSelect.options.length; i++) {
      if (maritalSelect.options[i].value === 'vedes') {
        maritalSelect.options[i].disabled = false;
      }
    }
    msg.push('Dėmesio: santuoka įstatymiškai leidžiama nuo 18 m.; yra ribiniai atvejai nuo 16 m.');
    statusMessage.className = 'hint warning';
  } else {
    for (i = 0; i < maritalSelect.options.length; i++) {
      if (maritalSelect.options[i].value === 'vedes') {
        maritalSelect.options[i].disabled = false;
      }
    }
    statusMessage.className = 'hint info';
    msg.push('Amžius OK santuokai (18+).');
  }

  statusMessage.textContent = msg.join(' ');
}


// Ar elementas matomas (neužslėptas)
function isElementVisible(el) {
  if (!el) return false;
  if (el.classList && el.classList.contains('hidden')) return false;
  if (el.offsetParent === null) return false;
  return true;
}

function getLabelTextFor(id) {
  var lbl = document.querySelector('label[for="' + id + '"]');
  if (!lbl) return id;

  var text = lbl.textContent.trim();
  if (text.endsWith('*')) {
    text = text.slice(0, -1).trim();
  }
  return text;
}

// Suranda visus required laukus ir grąžina tuos, kurie tušti/neteisingi
function checkRequiredFields() {
  var missing = [];
  var requiredEls = document.querySelectorAll('input[required], select[required], textarea[required]');

  requiredEls.forEach(function (el) {
    if (!isElementVisible(el)) return;

    var value = el.value;
    var valid = el.checkValidity();

    if (!value || !valid) {
      var id = el.id || el.name || '(field)';
      missing.push({
        id: id,
        label: getLabelTextFor(id)
      });
    }
  });

  return missing;
}

// Parodo bendrą žinutę apie neužpildytus laukus
function showRequiredMissingMessage(missing) {
  if (!statusMessage) return;

  if (!missing || missing.length === 0) {
    statusMessage.textContent = '';
    statusMessage.className = 'hint';
    return;
  }

  var names = missing.map(function (m) { return m.label; });
  statusMessage.textContent = 'Neužpildyti privalomi laukai: ' + names.join(', ');
  statusMessage.className = 'hint error';
}

// Bendras status žinutės rodymas
function showStatusMessage(text, level) {
  if (!statusMessage) return;
  if (level === undefined) level = 'error';

  statusMessage.textContent = text || '';
  statusMessage.className = text ? ('hint ' + level) : 'hint';
}

function showSummary() {
  // Pirma sinchronizuojam duomenis
  syncFormData();

  var s = getEl('summary');
  var c = getEl('summaryContent');
  if (!s || !c) return;

  // Išvalome seną turinį
  c.innerHTML = '';

  var personal = {
    'Lytis': formData.gender,
    'Vardas': formData.firstName,
    'Antras vardas': formData.middleName,
    'Pavardė': formData.lastName,
    'Gimimo data': formData.birthdate,
    'Amžius': computeAge(formData.birthdate),
    'Asmens kodas': formData.personalCode
  };
  var contact = {
    'Tel.': formData.phone,
    'El. paštas': formData.email,
    'Adresas': formData.address
  };
  var education = {
    'Išsilavinimas': formData.education,
    'Įstaiga': formData.eduInstitution,
    'Baigimo metai': formData.eduYear,
    'Kvalifikacija': formData.qualification,
    'Mokslo laipsnis': formData.degree
  };
  var prof = {
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

  var groups = [
    ['Asmens duomenys', personal],
    ['Kontaktai', contact],
    ['Išsilavinimas', education],
    ['Profesinė informacija', prof]
  ];

  groups.forEach(function (pair) {
    var title = pair[0];
    var obj = pair[1];

    var card = document.createElement('div');
    card.className = 'summary-card';

    var h = document.createElement('h3');
    h.textContent = title;
    card.appendChild(h);

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      var p = document.createElement('p');
      var value = obj[key];

      if (!value && value !== 0) {
        value = '<span style="color:#999">(nepateikta)</span>';
      }

      p.innerHTML = '<strong>' + key + ':</strong> ' + value;
      card.appendChild(p);
    }

    c.appendChild(card);
  });

  // Parodom santrauką
  s.classList.remove('hidden');
}

var inputsAndSelects = document.querySelectorAll('input, select');
inputsAndSelects.forEach(function (el) {
  el.addEventListener('input', function (e) {
    if (e.target.id === 'personalCode') {
      // pažymime, kad vartotojas pats keitė – neperrašyti automatiškai
      e.target.dataset.manual = '1';
    }
    updateProgress();
  });
});

// Gimimo datos keitimas: asmens kodas + santuokos amžius + progresas
var birthdateInput = getEl('birthdate');
if (birthdateInput) {
  birthdateInput.addEventListener('change', function () {
    autofillPersonalCode();
    maritalAgeCheck();
    updateProgress();
  });
}

// Išsilavinimo select
var educationSelect = getEl('education');
if (educationSelect) {
  educationSelect.addEventListener('change', function () {
    updateEducationUI();
    updateProgress();
  });
}

// Profesinės padėties select
var profStatusSelect = getEl('profStatus');
if (profStatusSelect) {
  profStatusSelect.addEventListener('change', function () {
    updateProfUI();
    updateProgress();
  });
}

// Vedybinės padėties select
var maritalSelect = getEl('marital');
if (maritalSelect) {
  maritalSelect.addEventListener('change', function () {
    updateMaritalUI();
    updateProgress();
  });
}

// Formos submit
if (surveyForm) {
  surveyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // 1) Required laukų tikrinimas
    var missing = checkRequiredFields();
    if (missing.length) {
      showRequiredMissingMessage(missing);

      // Fokusas į pirmą trūkstamą
      var first = getEl(missing[0].id);
      if (first) first.focus();
      return;
    }

    syncFormData();

    // 3) Papildomos validacijos (tel, email, amžius+santuoka)
    var fieldErrors = [];

    if (!validatePhone(formData.phone)) {
      fieldErrors.push('Telefono numeris turi būti formatu +3706xxxxxxx');
    }
    if (!validateEmail(formData.email)) {
      fieldErrors.push('El. pašto adresas neteisingas');
    }

    var age = computeAge(formData.birthdate);
    if (age !== null && formData.marital === 'vedes' && age < 16) {
      fieldErrors.push('Sutuoktinis negali būti nurodytas jei asmuo jaunesnis nei 16 m.');
    }

    if (fieldErrors.length) {
      var msgText = fieldErrors.join(' | ');
      showStatusMessage(msgText, 'error');
      return;
    }

    // 4) Jei viskas gerai – rodom santrauką
    showSummary();
  });
}

// Reset mygtukas
var resetBtn = getEl('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', function () {
    if (!surveyForm) return;

    surveyForm.reset();

    var eduDet  = getEl('educationDetails');
    var profDet = getEl('profDetails');
    var spouseDet = getEl('spouseDetails');
    var summary = getEl('summary');

    if (eduDet)    eduDet.classList.add('hidden');
    if (profDet)   profDet.classList.add('hidden');
    if (spouseDet) spouseDet.classList.add('hidden');
    if (summary)   summary.classList.add('hidden');

    if (progress) {
      progress.value = 0;
    }
    if (progressText) {
      progressText.textContent = '0%';
    }

    if (statusMessage) {
      statusMessage.textContent = '';
      statusMessage.className = 'hint';
    }

    // išvalom formData
    for (var k in formData) {
      if (formData.hasOwnProperty(k)) delete formData[k];
    }

    // atnaujinam UI
    updateEducationUI();
    updateProfUI();
    updateMaritalUI();
    updateProgress();
  });
}

// Pradinė UI būsena
updateEducationUI();
updateProfUI();
updateMaritalUI();
updateProgress();
maritalAgeCheck();
