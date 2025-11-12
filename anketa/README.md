# Anketa — Kliento duomenų surinkimas

Trumpai: paprasta, beginner-friendly statinė anketa (HTML/CSS/JS) vykdoma kliento naršyklėje. Visi surinkti duomenys laikomi viename JavaScript objekte (`formData`).

Ką įgyvendinta (pagal užduoties reikalavimus):
- Anketa kaip HTML dokumentas su kliento pusėje vykdomais scenarijais (Vanilla JS, DOM API).
- CSS naudojama stiliui ir responsive dizainui (pritaikymas mažiems ekranams).
- Visi duomenys kaupiami viename objekte `formData` (matomas konsolėje `window.formData`).
- Principai:
  - Minimalios anketos principas: pradiniame vaizde matomi tik būtini laukai; pagal pasirinkimus pasirodo papildomi laukeliai (pvz., išsilavinimo detalės, sutuoktinio duomenys, profesinė info).
  - Minimalaus pildymo principas: kai kuriuos laukus (pvz., asmens kodo dalis) automatiškai pildome iš gimimo datos.
  - Kategorizuotas pateikimas: pateikimo metu duomenys grupuojami (Asmens duomenys, Kontaktai, Išsilavinimas, Profesinė informacija).
  - Matomumo (Visibility) principas: rodomas pildymo progresas (progres baras ir procentai) bei amžiaus/santuokos statuso pranešimai.
- Responsive: formos išdėstymas prisitaiko prie smulkių ekranų.

Kaip paleisti
1. Atidarykite failą `index.html` naršyklėje (pvz., dukart spustelėkite arba per "Open File").
2. Užpildykite formą. Būtini laukai pažymėti raudonu žvaigždute.
3. Paspauskite "Pateikti" — jei validacija OK, apačioje bus parodyta sugrupuota įvestų duomenų santrauka.

Pastabos / Validacija
- Telefono numerio formatas: priimama `+3706xxxxxxx` arba `86xxxxxxx`.
- El. pašto validacija: paprastas regex.
- Asmens kodo pirmieji 6 skaitmenys automatiškai užpildomi iš gimimo datos (`YYMMDD-`). Vartotojas gali koreguoti lauką; jei pradeda rašyti, automatinis pakeitimas nutraukiamas.
- Santuokos pasirinkimo logika: jei amžius < 16 — santuokos pasirinkimas užblokuojamas; jei 16–17 — rodoma įspėjamoji žinutė; 18+ — OK.

Failų sąrašas
- `index.html` — pagrindinis dokumentas
- `styles.css` — paprasti stiliai, responsive
- `app.js` — formos logika, DOM manipuliacijos, `formData` objektas
- `README.md` — šis dokumentas

Kiti žingsniai (galimi patobulinimai)
- Pridėti gražesnį UI / validacijos pranešimų bloką vietoje `alert`.
- Išsaugoti įrašus localStorage arba siųsti į serverį (šiuo metu nėra serverio).
- Papildyti vienetiniais testais (pvz., Jest + jsdom) — dabar tai statinė JS aplikacija, todėl paprastesnė rankinė patikra.

Autor: paruošta pagal pateiktus reikalavimus
