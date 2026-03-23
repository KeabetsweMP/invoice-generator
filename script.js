// GRAB ALL THE ELEMENTS //

// FORM INPUTS (left side)

const inputLogo = document.getElementById('logo-upload');

const rLogo = document.getElementById('r-logo');

const inputBusinessName = document.getElementById('business-name');

const inputBusinessAddress = document.getElementById('business-address');

const inputClientName = document.getElementById('client-name');

const inputInvoiceDate = document.getElementById('invoice-date');

const inputInvoiceNumber = document.getElementById('invoice-number');

const inputTaxRate = document.getElementById('tax-rate');

const inputNote = document.getElementById('note');


//RECEIPT DISPLAY (right side - all the r-prefixed ids)//

const rBusinessName = document.getElementById('r-business-name');

const rBusinessAddress = document.getElementById('r-business-address');

const rClientName = document.getElementById('r-client-name');

const rInvoiceDate = document.getElementById('r-invoice-date');

const rInvoiceNumber = document.getElementById('r-invoice-number');

const rTaxRateLabel = document.getElementById('r-tax-rate-label');

const rNote = document.getElementById('r-note');

const rSubtotal = document.getElementById('r-subtotal');

const rTaxAmount = document.getElementById('r-tax-amount');

const rTotal = document.getElementById('r-total');

const rItemList = document.getElementById('r-items-list');


// LOGO UPLOAD //
inputLogo.addEventListener('change', () => {
    const file = inputLogo.files[0];

    if (!file) return;

    const reader = new FileReader();

    // THIS RUNS WHEN THE READER FINISHES READING THE FILE //
    reader.onload = (e) => {
        rLogo.src = e.target.result;
        rLogo.style.display = 'block';
    };

    reader.readAsDataURL(file);
});

// BUTTONS & CONTAINERS

const addItemBtn = document.getElementById('add-item-btn');

const printBtn = document.getElementById('print-btn');

const itemsContainer = document.getElementById('items-container');



// LIVE UPDATE FUNCTION |  RUNS EVERYTIME ANY INPUT CHANGES | IT READS FORM VALUES AND PUSHES THEM INTO THE RECEIPT//

function updateReceipt( ) {
    // IF THE INPUT IS EMPTY, SHOW THE FALLBACK PLACEHOLDER INSTEAD OF BLANK //
    rBusinessName.textContent = inputBusinessName.value || 'Your Business Name';

    rBusinessAddress.textContent = inputBusinessAddress.value || 'Your Address';

    rClientName.textContent = inputClientName.value || 'Client Name';

    rInvoiceNumber.textContent = inputInvoiceNumber.value || '#0001';

    rNote.textContent = inputNote.value || 'Thank you for your business!';

    // FOR FORMAT THE DATE NICELY (from "2025-01-01" to "JAN 1, 2025")
    if (inputInvoiceDate.value) {
        const dateObj = new Date(inputInvoiceDate.value + 'T00:00:00'); // tp prevents timezone shift

        rInvoiceDate.textContent = dateObj.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } else {
        rInvoiceDate.textContent = '-';
        }

        // ALWAYS RECALCULATE TOTALS WHEN  ANYTHING CHANGES //
        calculateTotals();
}

// ADD / REMOVE ITEMS //
// EACH TIME "+ ADD ITEM" IS CLICKED, WE CREATE A NEW ROW OF INPUTS //

function addItemRow() {
    //....//
    const row = document.createElement('div');
    row.classList.add('item-row');

    // THE INNTER HTML - 3 INPUTS + 1 REMOVE BUTTON //
    row.innerHTML = `
        <input type="text" class="item-desc" placeholder="Item description" />
        <input type="number" class="item-qty" placeholder="Qty" min="1" />
        <input type="number" class="item-price" placeholder="Price" min="0" step="0.01" />
        <button class="remove-item-btn" title="Remove item">x</button>
    `;

    //ANY INPUT IN THIS ROW CHANGES - UPDATE THE RECEIPT//
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateReceipt);
    });

    // THE x BUTTON IS CLICKED -- REMOVE THIS ROW AND UPDATE RECEIPT //
    row.querySelector('.remove-item-btn').addEventListener('click', () => {
        row.remove();
        updateReceipt(); //THIS RECALCULATE AFTER REMOVAL //
    });

    // ADD THE ROW TO THE ITMES CONTAINER IN THE FORM //
    itemsContainer.appendChild(row);

}

// CALCULATE TOTALS //
// LOOPS THROUGH EVERY ITEM ROW, CALCULATES EACH LINE TOTAL, // 
// BUILDS THE RECEIPT ITEM LIST, THEN SUM EVERTHING UP //

function calculateTotals( ) {
    const rows = itemsContainer.querySelectorAll('.item-row');

    let subtotal = 0;

    // CLEAR CURRENT RECEIPT ITEM LIST BEFORE REBUILDING IT //

    rItemList.innerHTML = '';

    rows.forEach(row => {
        const desc = row.querySelector('.item-desc').value || '-';

        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;

        const price = parseFloat(row.querySelector('.item-price').value) || 0;

        const lineTotal = qty * price;

        subtotal += lineTotal;

        // SHOW ROWS THAT HAVE AT LEAST A DESCRIPTION OR A PRICE //
        if (desc !== '-' || price > 0) {
            const receiptRow = document.createElement('div');

            receiptRow.classList.add('r-item-row');

            receiptRow.innerHTML = `
            <span>${desc}</span>
            <span>${qty}</span>
            <span>$${price.toFixed(2)}</span>
            <span>$${lineTotal.toFixed(2)}</span>
            `;

            rItemList.appendChild(receiptRow);
        }
    });

     // CALCULATE TAX //

    const taxRate = parseFloat(inputTaxRate.value) || 0;

    const taxAmount = subtotal * (taxRate / 100);

    const total = subtotal + taxAmount;

    // UPDATE THE RECEIPT TOTAL DISPLAY //

    rSubtotal.textContent = '$' + subtotal.toFixed(2);

    rTaxAmount.textContent = '$' + taxAmount.toFixed(2);

    rTotal.textContent = '$' + total.toFixed(2);

    rTaxRateLabel.textContent = taxRate;
}

// EVENT LISTERNERS //
// 'LISTEN' FOR USER ACTION AND RUN OUR FUNCTIONS //
// LISTEN TO EVERY TEXT|DATE|NUMBER INPUT IN THE FORM //
[
    inputBusinessName,
    inputBusinessAddress,
    inputClientName,
    inputInvoiceDate,
    inputInvoiceNumber,
    inputTaxRate,
    inputNote
].forEach(input => {
    input.addEventListener('input', updateReceipt);
});

// ADD ITEM BUTTON //

addItemBtn.addEventListener('click', () => {
    addItemRow();    // THIS CREATE THE ROW //

    updateReceipt();  // THIS REFRESH RECEIPT //
});

// PRINT BUTTON //
printBtn.addEventListener('click', () => {
    window.print();
});

// START WITH ONE ITEM ROW //
// ADD ONE EMPTY ITEM ROW WHEN THE PAGE FIRST LOADS //
// SO THE USER DOESN'T START WITH A COMPLETELY EMPTY FORM //

addItemRow();



