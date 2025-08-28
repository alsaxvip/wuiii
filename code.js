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
