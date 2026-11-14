const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function roundResult(n) {
  return Math.round(n * 1e10) / 1e10;
}

function clearActive() {
  buttons.forEach(function (b) {
    b.classList.remove("active");
  });
}

function setActive(button) {
  clearActive();
  button.classList.add("active");
}

function calculate(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") {
    if (b === 0) return null;
    return a / b;
  }
  return b;
}

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
      currentInput = "0";
      firstNumber = null;
      operator = null;
      shouldResetDisplay = false;
      clearActive();
      updateDisplay();
      return;
    }

    if (action === "equals") {
      clearActive();
      if (operator === null) return;

      const b = Number(currentInput);
      const result = calculate(firstNumber, operator, b);

      if (result === null) {
        currentInput = "Ошибка";
      } else {
        currentInput = String(roundResult(result));
      }

      firstNumber = null;
      operator = null;
      shouldResetDisplay = true;
      updateDisplay();
      return;
    }

    if (action === "backspace") {
      if (currentInput === "Ошибка" || shouldResetDisplay) return;

      if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
      } else {
        currentInput = "0";
      }

      if (currentInput === "-" || currentInput === "") {
        currentInput = "0";
      }

      updateDisplay();
      return;
    }

    if (action === "sign") {
      if (currentInput === "Ошибка" || currentInput === "0") return;

      if (currentInput.startsWith("-")) {
        currentInput = currentInput.slice(1);
      } else {
        currentInput = "-" + currentInput;
      }

      updateDisplay();
      return;
    }

    if (action === "percent") {
      if (currentInput === "Ошибка") return;

      const n = Number(currentInput);
      currentInput = String(roundResult(n / 100));
      shouldResetDisplay = false;
      updateDisplay();
      return;
    }

    if (value === "+" || value === "-" || value === "*" || value === "/") {
      if (operator !== null && !shouldResetDisplay) {
        const b = Number(currentInput);
        const result = calculate(firstNumber, operator, b);

        if (result === null) {
          currentInput = "Ошибка";
          firstNumber = null;
          operator = null;
          shouldResetDisplay = true;
          clearActive();
          updateDisplay();
          return;
        }

        firstNumber = result;
        currentInput = String(roundResult(result));
        updateDisplay();
      } else {
        firstNumber = Number(currentInput);
      }

      operator = value;
      shouldResetDisplay = true;
      setActive(button);
      return;
    }

    if (value === ".") {
      if (shouldResetDisplay) {
        currentInput = "0.";
        shouldResetDisplay = false;
      } else if (!currentInput.includes(".")) {
        currentInput = currentInput + ".";
      }
      updateDisplay();
      return;
    }

    if (value !== undefined && /[0-9]/.test(value)) {
      clearActive();
      if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
      } else if (currentInput === "0") {
        currentInput = value;
      } else {
        currentInput = currentInput + value;
      }
      updateDisplay();
    }
  });
});