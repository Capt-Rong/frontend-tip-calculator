// --- Initialization ---
const allFields = document.querySelector('.splitter__data');
const billInput = document.getElementById('bill');
const peopleInput = document.getElementById('people');
const customButton = document.querySelector('.splitter__tip-button-block');
const customLiField = document.querySelector(
  '.splitter__tip-item_custom-field'
);
const tipButtons = document.querySelectorAll('.splitter__tip-item');
const customField = document.getElementById('custom');
const warningMessage = document.querySelector('.splitter__warning');
const tipAmount = document.getElementById('resultAmount');
const totalAmount = document.getElementById('resultTotal');
const resetButton = document.getElementById('reset');

const billLimit = 1000000;
const percentLimit = 99;
const peopleLimit = 1000;

let tipValue = 0;

// --- Utility Functions ---
function formatCurrency(value) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function colorReset() {
  tipButtons.forEach((btn) =>
    btn.classList.remove('splitter__tip-item_pushed')
  );
}

// --- Input Restrictions ---
billInput.addEventListener('input', (e) => {
  if (e.target.value > billLimit) e.target.value = billLimit;
  validateInput(billInput);
  getResult();
});
customField.addEventListener('input', (e) => {
  if (e.target.value > percentLimit) e.target.value = percentLimit;
  validateInput(customField);
  colorReset();
  tipValue = Number(e.target.value) || 0;
  getResult();
});
peopleInput.addEventListener('input', (e) => {
  if (e.target.value > peopleLimit) e.target.value = peopleLimit;
  validateInput(peopleInput);
  getResult();
  peopleCheck();
});

// --- Tip Button Handling ---
tipButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    colorReset();
    const input = event.target.textContent.trim().toLowerCase();
    if (input === 'custom') {
      if (customButton) customButton.style.display = 'none';
      if (customLiField) customLiField.style.display = 'initial';
      if (customField) {
        customField.style.display = 'block';
        customField.focus();
      }
    } else {
      if (customField) {
        customField.value = '';
        customField.style.display = 'none';
      }
      if (customLiField) customLiField.style.display = 'none';
      if (customButton) customButton.style.display = 'initial';
      button.classList.add('splitter__tip-item_pushed');
      tipValue = Number(event.target.value);
      getResult();
    }
  });
});

// --- People Input Validation ---
function peopleCheck() {
  if (!Number(peopleInput.value)) {
    warningMessage.style.display = 'block';
    peopleInput.classList.add('splitter__input_outline');
  } else {
    warningMessage.style.display = 'none';
    peopleInput.classList.remove('splitter__input_outline');
  }
}

// --- Validation of input (negative, blank, error type)
function validateInput(input) {
  const value = Number(input.value);
  if (isNaN(value) || value < 0 || input.value.trim() === '') {
    input.classList.add('splitter__input_outline');
    return false;
  } else {
    input.classList.remove('splitter__input_outline');
    return true;
  }
}

// --- Calculation and Result Update ---
function getResult() {
  const billValue = Number(billInput.value);
  const numPeople = Number(peopleInput.value);

  let tipPercent = tipValue;
  if (customField && customField.value) tipPercent = Number(customField.value);

  if (!billValue || !numPeople || !tipPercent) {
    tipAmount.textContent = formatCurrency(0);
    totalAmount.textContent = formatCurrency(0);
    resetButton.setAttribute('disabled', '');
    resetButton.classList.remove('splitter__main-button_enabled');
    return;
  }

  const tipPerPerson = (billValue * (tipPercent / 100)) / numPeople;
  const totalPerPerson = billValue / numPeople + tipPerPerson;

  tipAmount.textContent = formatCurrency(tipPerPerson);
  totalAmount.textContent = formatCurrency(totalPerPerson);

  resetButton.removeAttribute('disabled');
  resetButton.classList.add('splitter__main-button_enabled');
}

// --- Reset Button Hover Effects ---
const addHover = () =>
  resetButton.classList.add('splitter__main-button_hovered');
const removeHover = () =>
  resetButton.classList.remove('splitter__main-button_hovered');
resetButton.addEventListener('mouseover', addHover);
resetButton.addEventListener('mouseout', removeHover);

// --- Reset All Fields ---
resetButton.addEventListener('click', () => {
  colorReset();
  tipAmount.textContent = formatCurrency(0);
  totalAmount.textContent = formatCurrency(0);
  billInput.value = '';
  peopleInput.value = '';
  tipValue = 0;
  if (customField) {
    customField.value = '';
    customField.style.display = 'none';
  }
  if (customLiField) customLiField.style.display = 'none';
  if (customButton) customButton.style.display = 'initial';

  warningMessage.style.display = 'none';
  peopleInput.classList.remove('splitter__input_outline');
  resetButton.setAttribute('disabled', '');
  resetButton.classList.remove(
    'splitter__main-button_enabled',
    'splitter__main-button_hovered'
  );
  billInput.focus();
});

// --- Prevent Form Submission (if form exists) ---
if (allFields && allFields.tagName === 'FORM') {
  allFields.addEventListener('submit', (event) => event.preventDefault());
}

// --- Initial State ---
resetButton.setAttribute('disabled', '');
if (customField) customField.style.display = 'none';
if (customLiField) customLiField.style.display = 'none';
if (customButton) customButton.style.display = 'initial';
warningMessage.style.display = 'none';
tipAmount.textContent = formatCurrency(0);
totalAmount.textContent = formatCurrency(0);
