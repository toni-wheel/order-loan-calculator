// --- подключение элементов ---

// ввод данных
const slider = document.querySelector("#slider");
const sliderThumb = document.querySelector("#slider_thumb");
const sliderLine = document.querySelector("#slider_line");
const loanAmount = document.querySelector("#loan_amount");
const loanTerm = document.querySelector("#loan_term");
const loanRate = document.querySelector("#loan_rate");
const paymentTypeRadios = document.querySelectorAll(
  'input[name="payment_type"]'
);
const initialPay = document.querySelector("#initial_pay");

// кнопки
const calculate = document.querySelector("#calculate");
const showDetails = document.querySelector("#show_details");
const hideDetails = document.querySelector("#hide_details");
const tabs = Array.from(document.querySelectorAll(".calc__tab"));
const btnCopy = document.querySelector("#btn_copy");
const btnCopy2 = document.querySelector("#btn_copy2");

// линейный график суммы кредита и переплаты
const chartSum = document.querySelector("#chart_sum");
const chartOver = document.querySelector("#chart_over");

// вывод результатов
const table = document.querySelector("#table");
const detailTable = document.querySelector("#details_table");
const monthlyPaymentOut = document.querySelector("#monthly_payment");
const loanAmountOut = document.querySelector("#loan_amount_out");
const overPaymentOut = document.querySelector("#over_payment_out");
const totalPaymentOut = document.querySelector("#total_payment_out");
const precentPaymentOut = document.querySelector("#precent_payment_out");
const dateOut = document.querySelector("#date_out");

// вывод результатов внизу таблицы
const tableBottomPrecent = document.querySelector("#table_bottom_precent");
const tableBottomDebt = document.querySelector("#table_bottom_debt");
const tableBottomSum = document.querySelector("#table_bottom_sum");

// UI

const calcTitle = document.querySelector("#calc_title");
const calcDesc = document.querySelector("#calc_desc");
const calcImage = document.querySelector("#calc_image");
const loanAmountHint = document.querySelector("#loan_amount_hint");
const addBox = document.querySelector("#add_box");

const loanTermPotreb = Array.from(
  document.querySelectorAll(".loan_term_potreb")
);
const loanTermHouse = Array.from(document.querySelectorAll(".loan_term_house"));

// --- константы ---

const maxRound = 50; // до какого числа округляем
const minLoanRate = 0; // минимальная ставка
const maxLoanRate = 100; // максимальная ставка

// --- утилиты ---

// округление числа точное
function numExactRound(num) {
  let roundedNumber = Number(Math.round(num * 1000000) / 1000000);
  return roundedNumber;
}

// округление числа до двух знаков
function numRound(num) {
  let roundedNumber = Number(Math.round(num * 100) / 100);
  return roundedNumber;
}

// контроль ввода чисел
function numControl(num, minNum, maxNum) {
  const parsedNum = parseFloat(num);

  if (Number.isNaN(parsedNum)) {
    return 0;
  }

  if (parsedNum < minNum) {
    return minNum;
  }

  if (parsedNum > maxNum) {
    return maxNum;
  }

  return parsedNum;
}

function numControlWithDecimal(num, minNum, maxNum) {
  // Проверка на валидность ввода
  if (isNaN(num) || num < minNum || num > maxNum) {
    return 0;
  }

  // Проверка на количество цифр после точки
  var decimalDigits = num.toString().split(".")[1];
  if (decimalDigits && decimalDigits.length > 2) {
    return 0;
  }

  // Возвращаем введенное число
  return num;
}

// форматирование даты
function formattedDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const newDate = date
    .toLocaleDateString("ru-RU", options)
    .split("/")
    .reverse()
    .join(".");

  return newDate;
}

// форматирование даты и времени
function formatMonthYear(date) {
  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}

// рисование графика
function setChart(sum, over) {
  let total = numRound(sum) + numRound(over);
  let sumPrecent = (sum / total) * 100;
  let overPrecent = (over / total) * 100;
  chartOver.style.width = overPrecent + "%";
  chartSum.style.width = sumPrecent + "%";
}

// плавный скролл к элементу по его id
function slowScrollToElement(elementId, duration) {
  var element = document.getElementById(elementId);
  if (element) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var start = scrollTop;
    var end = rect.top + scrollTop;
    var distance = end - start;
    var startTime = null;

    function animateScroll(currentTime) {
      if (!startTime) {
        startTime = currentTime;
      }
      var elapsedTime = currentTime - startTime;
      var scrollTo = easeInOut(elapsedTime, start, distance, duration);
      window.scrollTo(0, scrollTo);
      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    function easeInOut(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return (c / 2) * t * t + b;
      }
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animateScroll);
  }
}

// копирование ссылки
function copyPageUrl() {
  var pageUrl = window.location.href;

  navigator.clipboard
    .writeText(pageUrl)
    .then(function () {
      console.log("Ссылка скопирована: " + pageUrl);
      // Дополнительный код после успешного копирования
    })
    .catch(function (error) {
      console.error("Ошибка при копировании ссылки: " + error);
      // Дополнительный код при ошибке копирования
    });
}

// форматирование в белорусские рубли
function formatBelarusianRubles(number) {
  const strNumber = number.toFixed(2).toString();
  const parts = strNumber.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (parts[1] === "00") {
    return integerPart;
  } else {
    return `${integerPart}.${parts[1]}`;
  }
}

// обратное форматирование

function parseBelarusianRubles(formattedNumber) {
  const sanitizedNumber = formattedNumber.replace(/\s/g, "").replace(",", ".");
  return parseFloat(sanitizedNumber);
}

// --- классы ---

// стандартные условия при инициализации
const defaultOption = {
  mode: "sum",
  loanAmount: 10000,
  loanTerm: 36,
  loanRate: 19,
  paymentType: "annuity",
  maxLoanAmount: 60000, // максимальная сумма кредита
  minLoanAmount: 0, // минимальная сумма кредита
  initialPay: 0, // первый взнос по кредиту
};

// результаты расчета
const defaultResult = {
  paymentDiff: [], // ежемесячные дифференцированные платежи
  paymentAnn: 0, // ежемесячный аннуитентный платеж
  overPaymentAnn: 0, // переплата по аннуитентному кредиту
  totalPaymentAnn: 0, // общая сумма выплат по аннуитентному кредиту
  overPaymentDiff: 0, // переплата по дифференцированному кредиту
  totalPaymentDiff: 0, // общая сумма выплат по дифференцированному кредиту
  precentOverPaymentAnn: 0, // процент переплат по аннуитентному кредиту
  precentOverPaymentDiff: 0, // процент переплат по дифференцированному кредиту
  endDate: new Date(), // дата окончания выплат
  detailAnn: [{}], // расчет по месяцам по аннуитентному кредиту
  detailDiff: [{}], // расчет по месяцам по дифференцированному кредиту
};

// класс калькулятора
class Calc {
  // заданные условия (сумма кредита, срок кредита, ставка %)
  option = {};
  // результат расчета (ежемесячный платеж, переплата, окончание выплат)
  result = {};

  constructor(option) {
    this.option = option;
    this.calculateDifferentiatedPayments();
    this.calculateAnnuityPayment();
    this.updateResult();
    this.calcInit();
  }

  get mode() {
    return this.option.mode;
  }

  set mode(mode) {
    this.option.mode = mode;
    this.renderUI();
  }

  set loanAmount(num) {
    this.option.loanAmount = num;
    this.updateResult();
  }

  set loanTerm(num) {
    this.option.loanTerm = num;
    this.updateResult();
  }

  set loanRate(num) {
    this.option.loanRate = num;
    this.updateResult();
  }

  set paymentType(type) {
    this.option.paymentType = type;
    this.updateResult();
  }

  set initialPay(num) {
    this.option.initialPay = num;
    this.updateResult();
  }

  // установка начальных значений
  calcInit() {
    loanAmount.value = formatBelarusianRubles(this.option.loanAmount);
    loanTerm.value = this.option.loanTerm;
    loanRate.value = this.option.loanRate;
  }

  updateResult() {
    if (this.option.mode == "house") {
      this.option.loanAmount =
        parseBelarusianRubles(loanAmount.value) - this.option.initialPay;
    }
    loanAmountOut.value = formatBelarusianRubles(this.option.loanAmount);
    const date = new Date();
    date.setMonth(date.getMonth() + Number(this.option.loanTerm));
    dateOut.value = formatMonthYear(date);
    if (this.option.paymentType == "diff") {
      // вывод ежемесячного платежа
      this.calculateDifferentiatedPayments();
      monthlyPaymentOut.value =
        formatBelarusianRubles(numRound(this.result.paymentDiff[0])) +
        " → " +
        formatBelarusianRubles(
          numRound(this.result.paymentDiff[this.option.loanTerm - 1])
        );

      // вывод общей суммы переплат
      this.calculateTotalPayment();
      totalPaymentOut.value = formatBelarusianRubles(
        numRound(this.result.totalPaymentDiff)
      );

      // вывод переплат
      this.calculateOverPayment();
      overPaymentOut.value = formatBelarusianRubles(
        numRound(this.result.overPaymentDiff)
      );

      // вывод процента переплат
      this.calculatePrecentOverPayment();
      precentPaymentOut.value = numRound(this.result.precentOverPaymentDiff);

      // обновляем график
      setChart(this.option.loanAmount, this.result.overPaymentDiff);
    } else if (this.option.paymentType == "annuity") {
      // вывод ежемесячного платежа
      this.calculateAnnuityPayment();
      monthlyPaymentOut.value = formatBelarusianRubles(
        numRound(this.result.paymentAnn)
      );

      // вывод общей суммы переплат
      this.calculateTotalPayment();
      totalPaymentOut.value = formatBelarusianRubles(
        numRound(this.result.totalPaymentAnn)
      );

      // вывод переплат
      this.calculateOverPayment();
      overPaymentOut.value = formatBelarusianRubles(
        numRound(this.result.overPaymentAnn)
      );

      // вывод процента переплат
      this.calculatePrecentOverPayment();
      precentPaymentOut.value = numRound(this.result.precentOverPaymentAnn);

      // обновляем график
      setChart(this.option.loanAmount, this.result.overPaymentAnn);
    }
  }

  // возвращает значение аннуитентного платежа
  calculateAnnuityPayment() {
    // Convert the interest rate to a decimal
    const monthlyRate = this.option.loanRate / (12 * 100);

    // Calculate the monthly loan payment using the annuity formula
    const monthlyPayment =
      (this.option.loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -this.option.loanTerm));

    // Round the monthly payment to two decimal places
    const roundedPayment = numExactRound(monthlyPayment);

    this.result.paymentAnn = roundedPayment;
  }

  // возвращяет массив дифференцированных платежей по месяцам
  calculateDifferentiatedPayments() {
    var interestRate = this.option.loanRate / 100;
    var monthlyRate = interestRate / 12;
    var payments = [];

    for (var i = 1; i <= this.option.loanTerm; i++) {
      var interestPayment =
        (this.option.loanAmount -
          (this.option.loanAmount * (i - 1)) / this.option.loanTerm) *
        monthlyRate;
      var principalPayment = this.option.loanAmount / this.option.loanTerm;
      var monthlyPayment = interestPayment + principalPayment;
      payments.push(Number(numExactRound(monthlyPayment)));
    }
    this.result.paymentDiff = payments;
  }

  // расчет общей суммы выплат
  calculateTotalPayment() {
    this.result.totalPaymentAnn = this.result.paymentAnn * this.option.loanTerm;

    const arrPaymentDiff = this.result.paymentDiff;

    this.result.totalPaymentDiff = arrPaymentDiff.reduce(
      (acc, current) => acc + current
    );
  }

  // расчет переплаты
  calculateOverPayment() {
    this.result.overPaymentAnn =
      this.result.totalPaymentAnn - this.option.loanAmount;

    this.result.overPaymentDiff =
      this.result.totalPaymentDiff - this.option.loanAmount;
  }

  // расчет процента перплат
  calculatePrecentOverPayment() {
    this.result.precentOverPaymentAnn =
      (this.result.overPaymentAnn * 100) / this.option.loanAmount;

    this.result.precentOverPaymentDiff =
      (this.result.overPaymentDiff * 100) / this.option.loanAmount;
  }

  // детализация по аннуитентному платежу
  calculateDetailAnn() {
    const monthlyInterestRate = this.option.loanRate / (12 * 100);
    let date = new Date(); // получаем текущую дату
    date.setMonth(date.getMonth() + 1);
    let loanBalanceMonth = this.option.loanAmount; // получаем остаток кредита
    let precentMonth = 0;
    let debtMonth = 0;
    let sumMonth = this.result.paymentAnn;
    let arr = [];

    for (let month = 0; month < this.option.loanTerm; month++) {
      precentMonth = loanBalanceMonth * monthlyInterestRate;
      debtMonth = sumMonth - precentMonth;
      loanBalanceMonth = loanBalanceMonth + precentMonth - sumMonth;
      let item = {
        date: formattedDate(date),
        loanBalanceMonth: numExactRound(loanBalanceMonth),
        precentMonth: numExactRound(precentMonth),
        debtMonth: numExactRound(debtMonth),
        sumMonth: numExactRound(Number(sumMonth)),
      };
      date.setMonth(date.getMonth() + 1);
      arr.push(item);
    }
    this.result.detailAnn = arr;
    this.renderDetailAnn();
  }
  // ренедеринг детализации  по аннуитентному платежу
  renderDetailAnn() {
    detailTable.innerHTML = "";
    for (let month = 0; month < this.option.loanTerm; month++) {
      // Create table rows
      const trElement = document.createElement("tr");
      const thElementDate = document.createElement("th");
      const thElementBalance = document.createElement("th");
      const thElementPrecent = document.createElement("th");
      const thElementDebt = document.createElement("th");
      const thElementSum = document.createElement("th");

      // Add classes to table rows
      trElement.classList.add("calc__detail-payment");
      thElementDate.classList.add("calc__detail-date");
      thElementBalance.classList.add("calc__detail-balance");
      thElementBalance.classList.add("amount");
      thElementPrecent.classList.add("calc__detail-precent");
      thElementPrecent.classList.add("amount");
      thElementDebt.classList.add("calc__detail-main");
      thElementDebt.classList.add("amount");
      thElementSum.classList.add("calc__detail-sum");
      thElementSum.classList.add("amount");

      // Set the text content for table headers
      thElementDate.innerHTML = this.result.detailAnn[month].date;
      thElementBalance.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailAnn[month].loanBalanceMonth)
      );
      thElementPrecent.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailAnn[month].precentMonth)
      );
      thElementDebt.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailAnn[month].debtMonth)
      );
      thElementSum.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailAnn[month].sumMonth)
      );

      // Append the table headers to the table row
      trElement.appendChild(thElementDate);
      trElement.appendChild(thElementBalance);
      trElement.appendChild(thElementPrecent);
      trElement.appendChild(thElementDebt);
      trElement.appendChild(thElementSum);

      detailTable.append(trElement);

      tableBottomPrecent.value = formatBelarusianRubles(
        numRound(this.result.overPaymentAnn)
      );
      tableBottomDebt.value = formatBelarusianRubles(
        numRound(this.option.loanAmount)
      );
      tableBottomSum.value = formatBelarusianRubles(
        numRound(this.result.totalPaymentAnn)
      );
    }
  }

  calculateDetailDiff() {
    let date = new Date(); // получаем текущую дату
    date.setMonth(date.getMonth() + 1);
    let loanBalanceMonth = this.option.loanAmount; // получаем остаток кредита
    let precentMonth = 0;
    let debtMonth = this.option.loanAmount / this.option.loanTerm;
    let sumMonth = this.result.paymentDiff;
    let arr = [];

    for (let month = 0; month < this.option.loanTerm; month++) {
      precentMonth = Number(sumMonth[month]) - debtMonth;
      loanBalanceMonth = loanBalanceMonth + precentMonth - sumMonth[month];
      let item = {
        date: formattedDate(date),
        loanBalanceMonth: numExactRound(loanBalanceMonth),
        precentMonth: numExactRound(precentMonth),
        debtMonth: numExactRound(debtMonth),
        sumMonth: numExactRound(Number(sumMonth[month])),
      };

      date.setMonth(date.getMonth() + 1);
      arr.push(item);
    }
    this.result.detailDiff = arr;
    this.renderDetailDiff();
  }

  renderDetailDiff() {
    detailTable.innerHTML = "";

    for (let month = 0; month < this.option.loanTerm; month++) {
      // Create table rows
      const trElement = document.createElement("tr");
      const thElementDate = document.createElement("th");
      const thElementBalance = document.createElement("th");
      const thElementPrecent = document.createElement("th");
      const thElementDebt = document.createElement("th");
      const thElementSum = document.createElement("th");

      // Add classes to table rows
      trElement.classList.add("calc__detail-payment");
      thElementDate.classList.add("calc__detail-date");
      thElementBalance.classList.add("calc__detail-balance");
      thElementBalance.classList.add("amount");
      thElementPrecent.classList.add("calc__detail-precent");
      thElementPrecent.classList.add("amount");
      thElementDebt.classList.add("calc__detail-main");
      thElementDebt.classList.add("amount");
      thElementSum.classList.add("calc__detail-sum");
      thElementSum.classList.add("amount");

      // Set the text content for table headers
      thElementDate.innerHTML = this.result.detailDiff[month].date;
      thElementBalance.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailDiff[month].loanBalanceMonth)
      );
      thElementPrecent.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailDiff[month].precentMonth)
      );
      thElementDebt.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailDiff[month].debtMonth)
      );
      thElementSum.innerHTML = formatBelarusianRubles(
        numRound(this.result.detailDiff[month].sumMonth)
      );

      // Append the table headers to the table row
      trElement.appendChild(thElementDate);
      trElement.appendChild(thElementBalance);
      trElement.appendChild(thElementPrecent);
      trElement.appendChild(thElementDebt);
      trElement.appendChild(thElementSum);

      detailTable.append(trElement);

      tableBottomPrecent.value = formatBelarusianRubles(
        numRound(this.result.overPaymentDiff)
      );
      tableBottomDebt.value = formatBelarusianRubles(
        numRound(this.option.loanAmount)
      );
      tableBottomSum.value = formatBelarusianRubles(
        numRound(this.result.totalPaymentDiff)
      );
    }
  }

  renderUI() {
    if (this.option.mode == "sum") {
      calcTitle.textContent = "Кредитный калькулятор";
      calcDesc.textContent =
        "Калькулятор кредитов позволит подобрать лучший потребительский кредит в 2023 от банков Беларуси. Произведите расчет онлайн и узнайте ежемесячные платежи и сумму переплат.";
      calcImage.src = "./img/svg/icon-calc-potreb.svg";
      loanAmountHint.textContent = "Сумма кредита, BYN";
      this.option.maxLoanAmount = 60000;
      addBox.style.display = "none";
      // обновляем срок кредита
      loanTermHouse.forEach((el) => {
        el.style.display = "none";
      });
      loanTermPotreb.forEach((el) => {
        el.style.display = "block";
      });
    } else if (this.option.mode == "house") {
      calcTitle.textContent = "Калькулятор кредитов на жилье";
      calcDesc.textContent =
        "Калькулятор кредитов позволит подобрать лучший кредит на жилье в 2023 от банков Беларуси. Произведите расчет онлайн и узнайте ежемесячные платежи и сумму переплат.";
      calcImage.src = "./img/svg/icon-calc-house.svg";
      loanAmountHint.textContent = "Стоимость недвижимости, BYN";
      this.option.maxLoanAmount = 1000000;
      addBox.style.display = "flex";
      // обновляем срок кредита
      loanTermHouse.forEach((el) => {
        el.style.display = "block";
      });
      loanTermPotreb.forEach((el) => {
        el.style.display = "none";
      });
    }
  }
}

// --- объекты ---

// создание объекта калькулятора
const myCalc = new Calc(defaultOption);

// --- обработчики элементов ---

// ввод суммы кредита

sliderThumb.addEventListener("mousedown", startDrag);
sliderThumb.addEventListener("touchstart", startDrag);

function startDrag(e) {
  e.preventDefault();

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", stopDrag);
}

function drag(e) {
  var min = 0;
  var max = slider.offsetWidth - sliderThumb.offsetWidth;
  var value;

  if (e.type === "mousemove") {
    value = e.clientX - slider.getBoundingClientRect().left;
  } else if (e.type === "touchmove") {
    value = e.touches[0].clientX - slider.getBoundingClientRect().left;
  }

  if (value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }

  sliderThumb.style.left = value + "px";
  sliderLine.style.width = value + "px";

  var percentage = (value / max) * 100;

  var newValue = (myCalc.option.maxLoanAmount * percentage) / 100;
  newValue = Math.round(newValue / 50) * 50;

  loanAmount.value = formatBelarusianRubles(newValue);
  myCalc.loanAmount = newValue;
}

function stopDrag() {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
}

// ввод суммы кредита
loanAmount.addEventListener("input", (e) => {
  let num = parseBelarusianRubles(loanAmount.value);
  num = numControl(
    num,
    myCalc.option.minLoanAmount,
    myCalc.option.maxLoanAmount
  );
  loanAmount.value = formatBelarusianRubles(num);
  myCalc.loanAmount = num;
});

// ввод срока кредита
loanTerm.addEventListener("change", (e) => {
  let num = loanTerm.value;
  myCalc.loanTerm = num;
});

// ввод процентов
loanRate.addEventListener("input", (e) => {
  let num = loanRate.value;
  num = numControlWithDecimal(num, minLoanRate, maxLoanRate);
  loanRate.value = num;
  myCalc.loanRate = num;
});

// ввод первоначального взноса
initialPay.addEventListener("input", (e) => {
  let num = parseBelarusianRubles(initialPay.value);
  num = numControl(num, 0, myCalc.option.loanAmount);
  initialPay.value = formatBelarusianRubles(num);
  myCalc.initialPay = num;
});

// переключение типа платежа
paymentTypeRadios.forEach((paymentTypeRadio) => {
  paymentTypeRadio.addEventListener("change", (e) => {
    if (paymentTypeRadio.checked) {
      selectedValue = paymentTypeRadio.value;
      myCalc.paymentType = selectedValue;
    }
    if (myCalc.option.paymentType == "diff") {
      myCalc.calculateDetailDiff();
    } else if (myCalc.option.paymentType == "annuity") {
      myCalc.calculateDetailAnn();
    }
  });
});

// кнопка "Рассчитать"
calculate.addEventListener("click", (e) => {
  e.preventDefault();
  if (myCalc.option.paymentType == "diff") {
    myCalc.calculateDetailDiff();
  } else if (myCalc.option.paymentType == "annuity") {
    myCalc.calculateDetailAnn();
  }
  // скрипт для мобильной версии
  if (window.innerWidth < 1024) {
    slowScrollToElement("out", 500);
  }
});

// кнопка "Показать таблицу"
showDetails.addEventListener("click", (e) => {
  e.preventDefault();
  if (myCalc.option.paymentType == "diff") {
    myCalc.calculateDetailDiff();
  } else if (myCalc.option.paymentType == "annuity") {
    myCalc.calculateDetailAnn();
  }
  table.style.display = "block";
  slowScrollToElement("table", 500);
});

// кнопка "Скрыть таблицу"

hideDetails.addEventListener("click", (e) => {
  e.preventDefault();
  table.style.display = "none";
});

// тест

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    let mode = myCalc.mode;
    let newMode = e.target.id;
    if (mode != newMode) {
      tabs.forEach((tab) => {
        if (tab.id == newMode) {
          tab.classList.add("calc__tab--active");
        } else if (tab.id == mode) {
          tab.classList.remove("calc__tab--active");
        }
      });
    }
    myCalc.mode = newMode;
  });
});

// копирование ссылки

btnCopy.addEventListener("click", (e) => {
  e.preventDefault();
  copyPageUrl();
});

btnCopy2.addEventListener("click", (e) => {
  e.preventDefault();
  copyPageUrl();
});
