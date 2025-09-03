document.addEventListener('DOMContentLoaded', () => {
    const SPREADSHEET_ID = '1EwK-Co9glsswvy9pQpWeLxq8QXGt5SUaQOYekQ4rTJE';
    const SHEET_NAME = 'AT78';
    const GOOGLE_SHEETS_API_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

    const loginSection = document.getElementById('login-section');
    const nisnInput = document.getElementById('nisn-input');
    const loginButton = document.getElementById('login-button');
    const resultSection = document.getElementById('result-section');
    const loadingMessage = document.getElementById('loading');

    const namaLengkapSpan = document.getElementById('nama-lengkap');
    const nisnSpan = document.getElementById('nisn');
    const kelasSpan = document.getElementById('kelas');
    const nilaiSpan = document.getElementById('nilai');
    const rankSpan = document.getElementById('rank');
    const answerTableBody = document.getElementById('answer-table-body');

    let sheetData = [];
    let answerKeys = {}; // Store answer keys for different classes

    // Function to fetch and process data from Google Sheets
    async function fetchAndProcessSheetData() {
        loadingMessage.classList.remove('hidden');
        try {
            const response = await fetch(GOOGLE_SHEETS_API_URL);
            const text = await response.text();
            const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const data = JSON.parse(jsonText);

            sheetData = data.table.rows;

            // Define the data ranges based on your specifications
            const kelas7DataRange = { startRow: 3, endRow: 21 }; // Rows 4 to 22 (0-indexed)
            const kelas8DataRange = { startRow: 22, endRow: 102 }; // Rows 23 to 103 (0-indexed)

            // Define answer key rows
            const answerKey7Row = sheetData[1].c; // Row 2 (0-indexed)
            const answerKey8Row = sheetData[2].c; // Row 3 (0-indexed)

            // Extract the answer keys
            const answerKeyStartCol = 5; // Column F (0-indexed)
            const answerKeyEndCol = 29; // Column AD (0-indexed)

            answerKeys['7'] = answerKey7Row.slice(answerKeyStartCol, answerKeyEndCol + 1).map(cell => cell?.v);
            answerKeys['8'] = answerKey8Row.slice(answerKeyStartCol, answerKeyEndCol + 1).map(cell => cell?.v);
            
            // Adjust the student data to include a "kelas" property for easier filtering
            sheetData.forEach((row, index) => {
                if (index >= kelas7DataRange.startRow && index <= kelas7DataRange.endRow) {
                    row.kelas = '7';
                } else if (index >= kelas8DataRange.startRow && index <= kelas8DataRange.endRow) {
                    row.kelas = '8';
                } else {
                    row.kelas = 'N/A';
                }
            });

            loadingMessage.classList.add('hidden');
            console.log("Data fetched successfully.");
            console.log("Kelas 7 Answer Key:", answerKeys['7']);
            console.log("Kelas 8 Answer Key:", answerKeys['8']);

        } catch (error) {
            console.error('Error fetching data:', error);
            loadingMessage.textContent = 'Failed to load data. Please try again later.';
        }
    }

    // Function to display student data and answers
    function displayStudentData(studentRow) {
        const kelas = studentRow.kelas;
        const answerKey = answerKeys[kelas];
        
        // Data from the main header (A:E)
        const namaLengkap = studentRow.c[0]?.v || 'N/A';
        const nisn = studentRow.c[1]?.v || 'N/A';
        const nilaiRaw = studentRow.c[2]?.v || 0;
        const rank = studentRow.c[3]?.v || 'N/A';
        
        // Update the display elements
        namaLengkapSpan.textContent = namaLengkap;
        nisnSpan.textContent = nisn;
        kelasSpan.textContent = kelas;
        nilaiSpan.textContent = Math.round(nilaiRaw);
        rankSpan.textContent = rank;

        // Clear previous answers
        answerTableBody.innerHTML = '';
        
        // Student's answers start from column F (index 5)
        const studentAnswers = studentRow.c.slice(5, 30).map(cell => cell?.v);

        for (let i = 0; i < answerKey.length; i++) {
            const row = document.createElement('tr');
            const questionNumber = i + 1;
            const studentAnswer = studentAnswers[i];
            const correctAnswer = answerKey[i];
            const isCorrect = String(studentAnswer).trim() === String(correctAnswer).trim();
            const status = isCorrect ? 'BENAR' : 'SALAH';
            const poin = isCorrect ? 4 : 0;

            if (!isCorrect) {
                row.classList.add('incorrect-row');
            }

            row.innerHTML = `
                <td>${questionNumber}</td>
                <td>${studentAnswer || '-'}</td>
                <td>${status}</td>
                <td>${poin}</td>
            `;
            answerTableBody.appendChild(row);
        }

        loginSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
    }

    // Login logic
    loginButton.addEventListener('click', () => {
        const enteredNisn = nisnInput.value.trim();

        if (!enteredNisn) {
            alert('Please enter your NISN.');
            return;
        }

        // Search for the NISN in the student data
        const studentRow = sheetData.find(row => {
            // NISN is in column B (index 1)
            const nisnCell = row.c[1];
            return nisnCell && String(nisnCell.v).trim() === enteredNisn;
        });

        if (studentRow) {
            displayStudentData(studentRow);
        } else {
            alert('NISN not found. Please check your NISN and try again.');
        }
    });

    // Initial data fetch when the page loads
    fetchAndProcessSheetData();
});
