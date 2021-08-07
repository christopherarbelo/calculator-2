function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function divide(num1, num2) {
    if (num2 === 0) return undefined;
    return num1 / num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function operate(operator, num1, num2) {
    switch (operator) {
        case '+':
            return formatNumber(add(num1, num2));
        case '-':
            return formatNumber(subtract(num1, num2));
        case '/':
            return formatNumber(divide(num1, num2));
        case '*':
            return formatNumber(multiply(num1, num2));
        default:
            console.log(`ERROR: operator: ${operator}`);
            break;
    }
}

const DISPLAY = document.querySelector('.display p');
const BUTTONS = document.querySelectorAll('.button');

let operand = [];
let operands = [];
let operators = [];

window.addEventListener('keydown', (e) => {
    let keyCode = e.key;
    let valueType = categorizeValue(keyCode);
    populateValues(keyCode, valueType);
    // prevent enter button from selecting active button
    if (keyCode === 'Enter' && e.target.nodeName === 'BUTTON' && e.target.type === 'button') {
        e.preventDefault()
    }
});

BUTTONS.forEach(button => button.addEventListener('click', (e) => {
    let value = e.target.textContent;
    let valueType = categorizeValue(value);
    populateValues(value, valueType);
}));

function populateValues(value, valueType) {
    value = (valueType === 'operand' && value !== '.') ? +value : value;

    switch (valueType) {
        case 'operand':
            updateOperand(value);
            break;
        case 'operator':
            updateOperator(value);
            break;
        case 'evaluate':
            getAnswer(value);
            break;
        case 'AC':
            clearArray(operand, operands, operators);
            clearDisplay();
            break;
        case 'Backspace':
            backspace();
            break;
    }
}

function updateOperand(value) {
    if (value === '.' && operand.findIndex(num => num === '.') === -1 || value !== '.') {
        operand.push(value);
        displayValue(value);
    }
}

function updateOperator(value) {
    transferOperand();
    transferOperator(value);
    if (operators.length > 1) {
        preformOperation();
    }
    if (operators.length > 0) {
        clearDisplay();
        displayValue(value);
    }
}

function getAnswer(value) {
    transferOperand();
    if (operators.length === operands.length) return;
    while (operators.length > 0) {
        preformOperation();
    }
    clearDisplay();
    displayValue(operands[0]);
}

function preformOperation() {
    let index = operators.findIndex(operator => operator === '/' || operator === '*');

    if (index !== -1 && operands[index + 1]) {
        let result = operate(operators[index], operands[index], operands[index + 1])
        operators.splice(index, 1);
        operands = [...operands.slice(0, index), ...operands.slice(index + 2, operands.length)];
        operands.splice(index, 0, result);
    } else if ((operands.length > operators.length) || (operands.length >= operators.length && index === -1)) {
        let result = operate(operators[0], operands[0], operands[1]);
        index = 0;
        operators.splice(index, 1);
        operands = [...operands.slice(0, index), ...operands.slice(index + 2, operands.length)];
        operands.splice(index, 0, result);
    }
}

function backspace() {
    let value = DISPLAY.textContent;
    let valueType = categorizeValue(value);
    if (valueType === 'operand') {
        if (operands.length > 0) {
            let revisedNumber = `${operands[operands.length - 1]}`.split('');
            revisedNumber.pop()
            revisedNumber = revisedNumber.join('');
            if (revisedNumber) {
                operands[operands.length - 1] = +revisedNumber;
            } else {
                operands.pop();
            }
        } else {
            operand.pop();
        }
    } else if (valueType === 'operator') {
        operators.pop();
    }
    clearDisplay();
    if (operands.length > 0) {
        displayValue(operands[operands.length - 1]);
    } else if (operand.length > 0) {
        displayValue(operand.join(''));
    }
}

function displayValue(value) {
    if (categorizeValue(DISPLAY.textContent) === 'operator') {
        DISPLAY.textContent = '';
    }
    DISPLAY.textContent = `${DISPLAY.textContent}${value}`;
}

function transferOperand() {
    if (operand.length > 0) {
        operands.push(convertToNumber(operand));
        clearArray(operand);
    }
}

function transferOperator(value) {
    if (operands.length > operators.length) {
        operators.push(value);
    } else if (operands.length === operators.length && operands.length !== 0) {
        operators.pop();
        operators.push(value);
    }
}

function clearDisplay() {
    DISPLAY.textContent = "";
}

function categorizeValue(value) {
    if (/([0-9]|\.)/.test(value)) {
        return 'operand';
    } else if (/(\/|\*|\+|\-)/.test(value)) {
        return 'operator'
    } else if (/(=|Enter)/.test(value)) {
        return 'evaluate'
    } else if (/c/.test(value)) {
        return 'AC'
    }
    return value;
}

function clearArray(...arrays) {
    arrays.forEach(array => array.length = 0);
}

function convertToNumber(array) {
    return +(array.join(''));
}

function formatNumber(number) {
    if ((`${number}`.split('e'))[0].length < 12) return number;

    let array = `${number}`.split('e');
    number = array[0].split('.');
    decimalPortion = number[1].split('');

    if (decimalPortion.length > 5) {
        decimalPortion.splice(-5, 5);
    }

    number[1] = decimalPortion.join('');
    array[0] = number.join('.');
    return +(array.join('e'));
}