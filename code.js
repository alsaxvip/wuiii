<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* Styling from your original index.html */
    :root {
      --green: #4CAF50;
      --white: #FFFFFF;
      --yellow: #FFEB3B;
      --red: #F44336;
      --gold: #ffc107;
    }

    body {
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 20px;
      background-color: var(--white);
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: var(--white);
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 2px solid var(--green);
      padding-bottom: 20px;
    }
    .header img {
      height: 80px;
      margin-right: 20px;
    }
    .header h1 {
      margin: 0;
      color: var(--green);
      font-size: 2.5em;
    }

    /* Common button style */
    .btn {
      padding: 12px 25px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1.1em;
      transition: background-color 0.3s ease;
      margin: 5px;
    }

    .btn-green {
      background-color: var(--green);
      color: var(--white);
    }
    .btn-green:hover {
      background-color: #388E3C;
    }

    .btn-secondary {
      background-color: #9e9e9e;
      color: var(--white);
    }
    .btn-secondary:hover {
      background-color: #757575;
    }

    .login-section, .hof-section {
      text-align: center;
      margin-bottom: 30px;
    }
    .login-section input[type="text"] {
      padding: 12px;
      width: 60%;
      max-width: 300px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1.1em;
      margin-right: 10px;
    }
    
    .student-info {
      background-color: #e8f5e9;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 25px;
      border: 1px solid var(--green);
    }
    .student-info p {
      margin: 8px 0;
      font-size: 1.1em;
    }
    .student-info p strong {
      color: var(--green);
    }
    .nilai-table, .hof-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .nilai-table th, .nilai-table td, .hof-table th, .hof-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: center;
    }
    .nilai-table th {
      background-color: var(--green);
      color: var(--white);
      font-weight: bold;
    }
    .nilai-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .nilai-table tr:hover {
      background-color: #f1f1f1;
    }
    .highlight-row {
      background-color: var(--yellow) !important;
      font-weight: bold;
    }
    #error-message {
      color: var(--red);
      text-align: center;
      margin-top: 15px;
      font-weight: bold;
    }

    /* Hall of Fame Specific Styling */
    .hof-table thead th {
      background-color: var(--gold);
      color: var(--white);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hof-table tr:nth-child(odd) {
      background-color: #f9f9f9;
    }
    .hof-table tr:hover {
      background-color: #f1f1f1;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://iili.io/FqqmPFp.png" alt="Logo Sekolah">
      <h1 id="pageTitle">NILAI MATEMATIKA</h1>
    </div>

    <div style="text-align:center; margin-bottom: 20px;">
      <button class="btn btn-green" id="showNilaiBtn" onclick="showSection('nilai')">Lihat Nilai</button>
      <button class="btn btn-secondary" id="showHofBtn" onclick="showSection('hof')">Hall Of Fame</button>
    </div>

    <div id="nilai-section">
      <div class="login-section">
        <p>Masukkan NISN Anda untuk melihat nilai:</p>
        <input type="text" id="nisnInput" placeholder="Masukkan NISN">
        <button class="btn btn-green" onclick="getNilai()">Cari Nilai</button>
        <div id="error-message-nilai"></div>
      </div>
      <div id="result-container" style="display:none;">
        <div class="student-info">
          <p><strong>NAMA LENGKAP : </strong> <span id="namaLengkap"></span></p>
          <p><strong>NISN : </strong> <span id="nisnDisplay"></span></p>
          <p><strong>PREDIKAT : </strong> <span id="predikat"></span></p>
        </div>
        <table class="nilai-table">
          <thead>
            <tr>
              <th>ASPEK PENILAIAN</th>
              <th>NILAI</th>
            </tr>
          </thead>
          <tbody id="nilaiTableBody"></tbody>
        </table>
      </div>
    </div>

    <div id="hof-section" style="display:none;">
      <div class="table-container">
        <table class="hof-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Poin</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody id="hofTableBody"></tbody>
        </table>
      </div>
      <div id="loading-message" style="display:none;"><p>Loading data...</p></div>
      <div id="error-message-hof" class="error-message" style="display:none;"></div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      showSection('nilai'); // Default to showing the nilai section
    });

    function showSection(section) {
      const nilaiSection = document.getElementById('nilai-section');
      const hofSection = document.getElementById('hof-section');
      const pageTitle = document.getElementById('pageTitle');
      const showNilaiBtn = document.getElementById('showNilaiBtn');
      const showHofBtn = document.getElementById('showHofBtn');

      if (section === 'nilai') {
        nilaiSection.style.display = 'block';
        hofSection.style.display = 'none';
        pageTitle.textContent = 'NILAI MATEMATIKA';
        showNilaiBtn.classList.remove('btn-secondary');
        showNilaiBtn.classList.add('btn-green');
        showHofBtn.classList.remove('btn-green');
        showHofBtn.classList.add('btn-secondary');
      } else if (section === 'hof') {
        nilaiSection.style.display = 'none';
        hofSection.style.display = 'block';
        pageTitle.textContent = 'HALL OF FAME';
        showNilaiBtn.classList.remove('btn-green');
        showNilaiBtn.classList.add('btn-secondary');
        showHofBtn.classList.remove('btn-secondary');
        showHofBtn.classList.add('btn-green');
        // Load data for Hall of Fame if not already loaded
        if (document.getElementById('hofTableBody').innerHTML === '') {
          loadHallOfFameData();
        }
      }
    }

    function getNilai() {
      const nisn = document.getElementById('nisnInput').value;
      const errorMessage = document.getElementById('error-message-nilai');
      const resultContainer = document.getElementById('result-container');
      const nilaiTableBody = document.getElementById('nilaiTableBody');

      errorMessage.textContent = '';
      resultContainer.style.display = 'none';
      nilaiTableBody.innerHTML = '';

      if (!nisn) {
        errorMessage.textContent = 'Mohon masukkan NISN Anda.';
        return;
      }

      google.script.run
        .withSuccessHandler(displayNilai)
        .withFailureHandler(showErrorNilai)
        .getNilaiByNisn(nisn);
    }

    function displayNilai(data) {
      const errorMessage = document.getElementById('error-message-nilai');
      const resultContainer = document.getElementById('result-container');

      if (!data) {
        errorMessage.textContent = 'NISN tidak ditemukan. Mohon periksa kembali NISN Anda.';
        resultContainer.style.display = 'none';
        return;
      }

      document.getElementById('namaLengkap').textContent = data.namaLengkap;
      document.getElementById('nisnDisplay').textContent = data.nisn;
      document.getElementById('predikat').textContent = data.predikat;

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
        nilaiCell.textContent = data.nilai[aspek] !== undefined ? data.nilai[aspek] : '-';

        if (aspek === "PENILAIAN HARIAN" || aspek === "NILAI AKHIR ATS" || aspek === "NILAI AKHIR AAS") {
          row.classList.add('highlight-row');
        }
      });

      resultContainer.style.display = 'block';
    }

    function showErrorNilai(error) {
      document.getElementById('error-message-nilai').textContent = 'Terjadi kesalahan: ' + error.message;
      document.getElementById('result-container').style.display = 'none';
    }
    
    // Hall of Fame functions
    function loadHallOfFameData() {
      const loadingMessage = document.getElementById('loading-message');
      loadingMessage.style.display = 'block';
      google.script.run
        .withSuccessHandler(displayHallOfFame)
        .withFailureHandler(showErrorHof)
        .getHallOfFameData();
    }

    function displayHallOfFame(response) {
      const loadingMessage = document.getElementById('loading-message');
      const errorMessage = document.getElementById('error-message-hof');
      const tableBody = document.getElementById('hofTableBody');

      loadingMessage.style.display = 'none';
      tableBody.innerHTML = ''; // Clear existing table

      if (response.error) {
        showErrorHof(new Error(response.error));
        return;
      }

      if (response.data.length === 0) {
        errorMessage.textContent = 'No data found.';
        errorMessage.style.display = 'block';
        return;
      }

      response.data.forEach(row => {
        if (row.every(cell => cell === "")) {
          return;
        }
        const newRow = tableBody.insertRow();
        row.forEach(cellValue => {
          const cell = newRow.insertCell();
          cell.textContent = cellValue;
        });
      });
    }

    function showErrorHof(error) {
      const loadingMessage = document.getElementById('loading-message');
      const errorMessage = document.getElementById('error-message-hof');
      loadingMessage.style.display = 'none';
      errorMessage.textContent = `Failed to load data: ${error.message}`;
      errorMessage.style.display = 'block';
    }
const SPREADSHEET_ID = "1EwK-Co9glsswvy9pQpWeLxq8QXGt5SUaQOYekQ4rTJE";
const SHEET_NAME = "NILAI";

function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('NILAI MATEMATIKA');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getNilaiByNisn(nisn) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // Find the header row (row 1 in spreadsheet, index 0 in array)
  const header = data[0];

  // Find the NISN column index (assuming NISN is in the header)
  const nisnColumnIndex = header.indexOf("NISN");
  if (nisnColumnIndex === -1) {
    throw new Error("Kolom 'NISN' tidak ditemukan di header sheet.");
  }

  let studentData = null;
  // Iterate through data starting from the second row (index 1 in array)
  for (let i = 1; i < data.length; i++) {
    if (data[i][nisnColumnIndex].toString() === nisn.toString()) {
      studentData = data[i];
      break;
    }
  }

  if (!studentData) {
    return null; // NISN not found
  }

  // Map data to desired output format
  const output = {
    namaLengkap: studentData[header.indexOf("NAMA LENGKAP")],
    nisn: studentData[header.indexOf("NISN")],
    predikat: studentData[header.indexOf("PREDIKAT")],
    nilai: {
      "LKS BAB 1": Math.round(studentData[header.indexOf("LKS BAB 1")]),
      "LKS BAB 2": Math.round(studentData[header.indexOf("LKS BAB 2")]),
      "LKS BAB 3": Math.round(studentData[header.indexOf("LKS BAB 3")]),
      "CATATAN TUGAS BAB 1": Math.round(studentData[header.indexOf("CATATAN TUGAS BAB 1")]),
      "CATATAN TUGAS BAB 2": Math.round(studentData[header.indexOf("CATATAN TUGAS BAB 2")]),
      "CATATAN TUGAS BAB 3": Math.round(studentData[header.indexOf("CATATAN TUGAS BAB 3")]),
      "KETERAMPILAN BAB 1": Math.round(studentData[header.indexOf("KETERAMPILAN BAB 1")]),
      "KETERAMPILAN BAB 2": Math.round(studentData[header.indexOf("KETERAMPILAN BAB 2")]),
      "KETERAMPILAN BAB 3": Math.round(studentData[header.indexOf("KETERAMPILAN BAB 3")]),
      "ATS LKS": Math.round(studentData[header.indexOf("ATS LKS")]),
      "ATS ASLI": Math.round(studentData[header.indexOf("ATS ASLI")]),
      "ATS PERBAIKAN 25 SOAL": Math.round(studentData[header.indexOf("ATS PERBAIKAN 25 SOAL")]),
      "AAS LKS": Math.round(studentData[header.indexOf("AAS LKS")]),
      "AAS ASLI": Math.round(studentData[header.indexOf("AAS ASLI")]),
      "PENILAIAN HARIAN": Math.round(studentData[header.indexOf("PENILAIAN HARIAN")]),
      "NILAI AKHIR ATS": Math.round(studentData[header.indexOf("NILAI AKHIR ATS")]),
      "NILAI AKHIR AAS": Math.round(studentData[header.indexOf("NILAI AKHIR AAS")])
    }
  };
  return output;
}

const SPREADSHEET_ID_HOF = "1EwK-Co9glsswvy9pQpWeLxq8QXGt5SUaQOYekQ4rTJE";
const SHEET_NAME_HOF = "GAME";

function getHallOfFameData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID_HOF);
  const sheet = ss.getSheetByName(SHEET_NAME_HOF);

  if (!sheet) {
    return { error: `Sheet "${SHEET_NAME_HOF}" not found.` };
  }

  const startRow = 2; // Data starts from row 2
  const numRows = 20; // Fetch 10 rows
  const numColumns = 4; // Fetch 4 columns (No., Nama, Poin, Badges)

  try {
    const dataRange = sheet.getRange(startRow, 1, numRows, numColumns);
    const data = dataRange.getValues();

    return {
      success: true,
      data: data
    };
  } catch (e) {
    return { error: `Could not retrieve data. Error: ${e.message}` };
  }
}


  </script>
</body>
</html>
