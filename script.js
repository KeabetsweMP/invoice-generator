// ================================
// GRAB ALL THE ELEMENTS
// ================================

const nextInvoiceBtn = document.getElementById('next-invoice-btn');
const clearBtn       = document.getElementById('clear-btn');
const paidBtn        = document.getElementById('paid-btn');
const receipt        = document.querySelector('.receipt');
const inputLogo      = document.getElementById('logo-upload');
const rLogo          = document.getElementById('r-logo');

const inputBusinessName    = document.getElementById('business-name');
const inputBusinessAddress = document.getElementById('business-address');
const inputClientName      = document.getElementById('client-name');
const inputInvoiceDate     = document.getElementById('invoice-date');
const inputInvoiceNumber   = document.getElementById('invoice-number');
const inputCurrency        = document.getElementById('currency');
const inputTaxRate         = document.getElementById('tax-rate');
const inputNote            = document.getElementById('note');

const rBusinessName    = document.getElementById('r-business-name');
const rBusinessAddress = document.getElementById('r-business-address');
const rClientName      = document.getElementById('r-client-name');
const rInvoiceDate     = document.getElementById('r-invoice-date');
const rInvoiceNumber   = document.getElementById('r-invoice-number');
const rTaxRateLabel    = document.getElementById('r-tax-rate-label');
const rNote            = document.getElementById('r-note');
const rSubtotal        = document.getElementById('r-subtotal');
const rTaxAmount       = document.getElementById('r-tax-amount');
const rTotal           = document.getElementById('r-total');
const rItemList        = document.getElementById('r-items-list');

const addItemBtn     = document.getElementById('add-item-btn');
const printBtn       = document.getElementById('print-btn');
const itemsContainer = document.getElementById('items-container');


// ================================
// LOGO UPLOAD
// ================================
inputLogo.addEventListener('change', () => {
    const file = inputLogo.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        rLogo.src = e.target.result;
        rLogo.style.display = 'block';
    };
    reader.readAsDataURL(file);
});


// ================================
// CURRENCY HELPER
// ================================
function getCurrency() {
    return inputCurrency.value;
}


// ================================
// LIVE UPDATE FUNCTION
// ================================
function updateReceipt() {
    rBusinessName.textContent    = inputBusinessName.value    || 'Your Business Name';
    rBusinessAddress.textContent = inputBusinessAddress.value || 'Your Address';
    rClientName.textContent      = inputClientName.value      || 'Client Name';
    rInvoiceNumber.textContent   = inputInvoiceNumber.value   || '#0001';
    rNote.textContent            = inputNote.value            || 'Thank you for your business!';

    if (inputInvoiceDate.value) {
        const dateObj = new Date(inputInvoiceDate.value + 'T00:00:00');
        rInvoiceDate.textContent = dateObj.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } else {
        rInvoiceDate.textContent = '-';
    }

    calculateTotals();
}


// ================================
// ADD ITEM ROW
// ================================
function addItemRow() {
    const row = document.createElement('div');
    row.classList.add('item-row');

    row.innerHTML = `
        <input type="text"   class="item-desc"  placeholder="Item description" />
        <input type="number" class="item-qty"   placeholder="Qty" min="1" />
        <input type="number" class="item-price" placeholder="Price" min="0" step="0.01" />
        <button class="remove-item-btn" title="Remove item">x</button>
    `;

    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateReceipt);
    });

    row.querySelector('.remove-item-btn').addEventListener('click', () => {
        row.remove();
        updateReceipt();
    });

    itemsContainer.appendChild(row);
}


// ================================
// CALCULATE TOTALS
// ================================
function calculateTotals() {
    const rows = itemsContainer.querySelectorAll('.item-row');
    let subtotal = 0;

    rItemList.innerHTML = '';

    rows.forEach(row => {
        const desc      = row.querySelector('.item-desc').value  || '-';
        const qty       = parseFloat(row.querySelector('.item-qty').value)   || 0;
        const price     = parseFloat(row.querySelector('.item-price').value) || 0;
        const lineTotal = qty * price;

        subtotal += lineTotal;

        if (desc !== '-' || price > 0) {
            const receiptRow = document.createElement('div');
            receiptRow.classList.add('r-item-row');
            receiptRow.innerHTML = `
                <span>${desc}</span>
                <span>${qty}</span>
                <span>${getCurrency()}${price.toFixed(2)}</span>
                <span>${getCurrency()}${lineTotal.toFixed(2)}</span>
            `;
            rItemList.appendChild(receiptRow);
        }
    });

    const taxRate   = parseFloat(inputTaxRate.value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total     = subtotal + taxAmount;

    rSubtotal.textContent     = getCurrency() + subtotal.toFixed(2);
    rTaxAmount.textContent    = getCurrency() + taxAmount.toFixed(2);
    rTotal.textContent        = getCurrency() + total.toFixed(2);
    rTaxRateLabel.textContent = taxRate;
}


// ================================
// INVOICE NUMBER HELPERS
// ================================
function formatInvoiceNumber(num) {
    return '#' + String(num).padStart(4, '0');
}

function loadInvoiceNumber() {
    const saved = localStorage.getItem('invoiceNumber');
    const num   = saved ? parseInt(saved) : 1;
    inputInvoiceNumber.value = formatInvoiceNumber(num);
    updateReceipt();
}

function nextInvoice() {
    const current    = inputInvoiceNumber.value.replace('#', '');
    const currentNum = parseInt(current) || 1;
    const nextNum    = currentNum + 1;

    localStorage.setItem('invoiceNumber', nextNum);
    inputInvoiceNumber.value = formatInvoiceNumber(nextNum);
    updateReceipt();

    alert(`Invoice saved! Next invoice: ${formatInvoiceNumber(nextNum)}`);
}


// ================================
// CLEAR / RESET
// ================================
function clearALL() {
    inputBusinessName.value    = '';
    inputBusinessAddress.value = '';
    inputClientName.value      = '';
    inputInvoiceDate.value     = '';
    inputTaxRate.value         = '';
    inputNote.value            = '';
    inputCurrency.value        = '$';

    rLogo.src           = '';
    rLogo.style.display = 'none';
    inputLogo.value     = '';

    receipt.classList.remove('paid');
    paidBtn.classList.remove('active');
    paidBtn.textContent = '✔ Mark as Paid';

    itemsContainer.innerHTML = '';
    addItemRow();
    loadInvoiceNumber();
}


// ================================
// EVENT LISTENERS
// ================================
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

inputCurrency.addEventListener('change', updateReceipt);

addItemBtn.addEventListener('click', () => {
    addItemRow();
    updateReceipt();
});

printBtn.addEventListener('click', () => {
    window.print();
});

paidBtn.addEventListener('click', () => {
    receipt.classList.toggle('paid');
    paidBtn.classList.toggle('active');
    paidBtn.textContent = receipt.classList.contains('paid')
        ? '✖ Mark as Unpaid'
        : '✔ Mark as Paid';
});

clearBtn.addEventListener('click', clearALL);
nextInvoiceBtn.addEventListener('click', nextInvoice);


// ================================
// ON PAGE LOAD
// ================================
addItemRow();
loadInvoiceNumber();
