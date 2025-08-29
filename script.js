const CSV_URL_NILAI = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnw5Bm8vr7kZu45jaY3GKSYXXW4ooFohGm1tZfC4n8rPyPuG3qYc2xRPZvc9VMTkjGWHhl7eAsqzPp/pub?gid=1829383988&single=true&output=csv';
const CSV_URL_GAME = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnw5Bm8vr7kZu45jaY3GKSYXXW4ooFohGm1tZfC4n8rPyPuG3qYc2xRPZvc9VMTkjGWHhl7eAsqzPp/pub?gid=1080330117&single=true&output=csv';
const CSV_URL_GAME2 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQnw5Bm8vr7kZu45jaY3GKSYXXW4ooFohGm1tZfC4n8rPyPuG3qYc2xRPZvc9VMTkjGWHhl7eAsqzPp/pub?gid=714629508&single=true&output=csv';

let allData = {};

// Custom CSV parser
function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index].trim();
      });
      data.push(entry);
    }
  }
  return data;
}

// Main initialization function
async function init() {
  try {
    const [nilaiResponse, gameResponse, game2Response] = await Promise.all([
      fetch(CSV_URL_NILAI),
      fetch(CSV_URL_GAME),
      fetch(CSV_URL_GAME2)
    ]);

    const [nilaiText, gameText, game2Text] = await Promise.all([
      nilaiResponse.text(),
      gameResponse.text(),
      game2Response.text()
    ]);
    
    allData.nilai = parseCsv(nilaiText);
    allData.game = parseCsv(gameText);
    allData.game2 = parseCsv(game2Text);

    document.getElementById('loading-message').style.display = 'none';
    showSection('nilai'); // Show initial section
    
  } catch (error) {
    document.getElementById('loading-message').textContent = 'Gagal memuat data. Mohon periksa koneksi internet atau tautan CSV.';
    console.error('Failed to load CSV data:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);

function showSection(section) {
  const sections = ['nilai', 'badges', 'hof'];
  sections.forEach(s => {
    document.getElementById(`${s}-section`).style.display = 'none';
    document.getElementById(`show${s.charAt(0).toUpperCase() + s.slice(1)}Btn`).classList.remove('btn-green');
    document.getElementById(`show${s.charAt(0).toUpperCase() + s.slice(1)}Btn`).classList.add('btn-secondary');
  });

  document.getElementById(`${section}-section`).style.display = 'block';
  document.getElementById(`show${section.charAt(0).toUpperCase() + section.slice(1)}Btn`).classList.remove('btn-secondary');
  document.getElementById(`show${section.charAt(0).toUpperCase() + section.slice(1)}Btn`).classList.add('btn-green');
  
  const pageTitles = {
    nilai: 'NILAI MATEMATIKA',
    badges: 'MY BADGES',
    hof: 'HALL OF FAME'
  };
  document.getElementById('pageTitle').textContent = pageTitles[section];

  if (section === 'hof') {
    loadHallOfFameData();
  }
}

function getNilai() {
  const nisn = document.getElementById('nisnInputNilai').value.trim();
  const errorMessage = document.getElementById('error-message-nilai');
  const resultContainer = document.getElementById('result-container-nilai');
  const nilaiTableBody = document.getElementById('nilaiTableBody');

  errorMessage.textContent = '';
  resultContainer.style.display = 'none';
  nilaiTableBody.innerHTML = '';

  if (!nisn) {
    errorMessage.textContent = 'Mohon masukkan NISN Anda.';
    return;
  }
  
  const data = allData.nilai;
  const studentData = data.find(row => String(row['NISN']).trim() === nisn);
  
  if (!studentData) {
    errorMessage.textContent = 'NISN tidak ditemukan. Mohon periksa kembali NISN Anda.';
    resultContainer.style.display = 'none';
    return;
  }
  
  displayNilai(studentData);
}

function displayNilai(data) {
  document.getElementById('namaLengkapNilai').textContent = data['NAMA LENGKAP'];
  document.getElementById('nisnDisplayNilai').textContent = data['NISN'];
  document.getElementById('kelasDisplay').textContent = data['KELAS'];
  document.getElementById('predikatNilai').textContent = data['PREDIKAT'];
  
  let kehadiranValue = parseFloat(data['LOGIN']);
  if (!isNaN(kehadiranValue) && kehadiranValue > 0 && kehadiranValue <= 1) {
      kehadiranValue = Math.round(kehadiranValue * 100);
  }
  document.getElementById('kehadiranDisplay').textContent = kehadiranValue ? kehadiranValue + '%' : '-';

  const nilaiTableBody = document.getElementById('nilaiTableBody');
  const aspekPenilaian = [
    "LKS BAB 1", "LKS BAB 2", "LKS BAB 3",
    "CATATAN TUGAS BAB 1", "CATATAN TUGAS BAB 2", "CATATAN TUGAS BAB 3",
    "KETERAMPILAN BAB 1", "KETERAMPILAN BAB 2", "KETERAMPILAN BAB 3",
    "ATS LKS", "ATS ASLI", "ATS PERBAIKAN 25 SOAL",
    "AAS LKS", "AAS ASLI", "PENILAIAN HARIAN",
    "NILAI AKHIR ATS", "NILAI AKHIR AAS"
  ];

  aspekPenilaian.forEach(aspek => {
    const row = nilaiTableBody.insertRow();
    const aspekCell = row.insertCell();
    const nilaiCell = row.insertCell();

    aspekCell.textContent = aspek;
    nilaiCell.textContent = data[aspek] !== undefined ? Math.round(parseFloat(data[aspek])) : '-';

    if (aspek === "NILAI AKHIR ATS" || aspek === "NILAI AKHIR AAS" || aspek === "PENILAIAN HARIAN") {
      row.classList.add('highlight-row');
    }
  });
  document.getElementById('result-container-nilai').style.display = 'block';
}

function getBadges() {
  const nisn = document.getElementById('nisnInputBadges').value.trim();
  const errorMessage = document.getElementById('error-message-badges');
  const resultContainer = document.getElementById('result-container-badges');
  const myBadgesTableBody = document.getElementById('myBadgesTableBody');
  
  errorMessage.textContent = '';
  resultContainer.style.display = 'none';
  myBadgesTableBody.innerHTML = '';

  if (!nisn) {
    errorMessage.textContent = 'Mohon masukkan NISN Anda.';
    return;
  }

  const badgesData = allData.game2;
  const studentBadgesData = badgesData.find(row => String(row['NISN']).trim() === nisn);
  
  if (!studentBadgesData) {
    errorMessage.textContent = 'NISN tidak ditemukan. Mohon periksa kembali NISN Anda.';
    resultContainer.style.display = 'none';
    return;
  }
  
  const gameData = allData.game;
  const studentPoinData = gameData.find(row => String(row['NISN']).trim() === nisn);

  const badgesList = Object.keys(studentBadgesData).filter(key => key.startsWith('BADGES '));
  const myBadges = [];
  badgesList.forEach(badgeKey => {
    if (studentBadgesData[badgeKey].trim() !== '') {
      const badgeName = studentBadgesData[badgeKey].trim();
      let poin = '-';
      if (studentPoinData) {
        // Find the point for this badge
        const poinKey = Object.keys(studentPoinData).find(key => key.includes(badgeName));
        if (poinKey) {
          poin = studentPoinData[poinKey];
        }
      }
      myBadges.push({ badge: badgeName, poin: poin });
    }
  });

  document.getElementById('namaLengkapBadges').textContent = studentBadgesData['NAMA LENGKAP'];
  document.getElementById('nisnDisplayBadges').textContent = studentBadgesData['NISN'];
  document.getElementById('poinDisplay').textContent = studentBadgesData['POIN BADGES'];

  if (myBadges.length > 0) {
    myBadges.forEach((item, index) => {
      const row = myBadgesTableBody.insertRow();
      const noCell = row.insertCell();
      const badgeCell = row.insertCell();
      const poinCell = row.insertCell();
      
      noCell.textContent = index + 1;
      badgeCell.textContent = item.badge;
      poinCell.textContent = item.poin;
    });
  } else {
      const row = myBadgesTableBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 3;
      cell.textContent = "Tidak ada badges yang ditemukan.";
  }
  
  resultContainer.style.display = 'block';
}

function loadHallOfFameData() {
  const tableBody = document.getElementById('hofTableBody');
  const hofData = allData.game;

  tableBody.innerHTML = '';

  if (hofData.length === 0) {
    document.getElementById('error-message-hof').textContent = 'Tidak ada data Hall of Fame yang ditemukan.';
    return;
  }

  const topData = hofData.slice(0, 20); // Ambil 20 baris pertama
  topData.forEach((row, index) => {
    const newRow = tableBody.insertRow();
    const noCell = newRow.insertCell();
    const namaCell = newRow.insertCell();
    const poinCell = newRow.insertCell();
    const badgesCell = newRow.insertCell();
    
    noCell.textContent = index + 1;
    namaCell.textContent = row['NAMA'];
    poinCell.textContent = row['POIN'];
    badgesCell.textContent = row['BADGES'];
  });
}
