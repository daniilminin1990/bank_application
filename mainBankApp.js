"use strict";

const account1 = {
  owner: "Daniil Minin",
  movements: [2000000, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1999, 8600, -30],
  pin: 2222,
};

const account3 = {
  owner: "Tatyana Filimonova",
  movements: [500, 340, -1500, -90, 3210, -1999, 8600, -30],
  pin: 3333,
};

const account4 = {
  owner: "Anna Filimonova",
  movements: [50, 1000, 700, 50, 30],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// * Elements
const labelWelcome = document.querySelector(".welcome"),
  labelDate = document.querySelector(".date"),
  labelBalance = document.querySelector(".balance__value"),
  labelSumIn = document.querySelector(".summary__value--in"),
  labelSumOut = document.querySelector(".summary__value--out"),
  labelSumInterest = document.querySelector(".summary__value--interest"),
  labelTimer = document.querySelector(".timer");
console.log(
  labelWelcome,
  labelDate,
  labelBalance,
  labelSumIn,
  labelSumOut,
  labelSumInterest,
  labelTimer
);

const containerApp = document.querySelector(".app"),
  containerMovements = document.querySelector(".movements");
console.log(containerApp, containerMovements);

const btnLogin = document.querySelector(".login__btn"),
  btnTransfer = document.querySelector(".form__btn--transfer"),
  btnLoan = document.querySelector(".form__btn--loan"),
  btnClose = document.querySelector(".form__btn--close"),
  btnSort = document.querySelector(".btn--sort");
console.log(btnLogin, btnTransfer, btnLoan, btnClose, btnSort);

const inputLoginUsername = document.querySelector(".login__input--user"),
  inputLoginPin = document.querySelector(".login__input--pin"),
  inputTransferTo = document.querySelector(".form__input--to"),
  inputTransferAmount = document.querySelector(".form__input--amount"),
  inputLoanAmount = document.querySelector(".form__input--loan-amount"),
  inputCloseUsername = document.querySelector(".form__input--user"),
  inputClosePin = document.querySelector(".form__input--pin");
console.log(
  inputLoginUsername,
  inputLoginPin,
  inputTransferTo,
  inputTransferAmount,
  inputLoanAmount,
  inputCloseUsername,
  inputClosePin
);

// Todo Вывод на страницу всех приходов и уходов
function displayMovements(movements) {
  containerMovements.innerHTML = "";
  movements.forEach((val, i) => {
    const textType = val > 0 ? "пополнение" : "снятие";
    const type = val > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i++} ${textType}
      </div>
      <div class="movements__date">24/01/2037</div>
      <div class="movements__value">${val}₽</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// todo Создание логина из ФИО в объекте
function createLogIn(accs) {
  accs.forEach((acc) => {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map((val) => {
        return val[0];
      })
      .join("");
  });
}

createLogIn(accounts);
console.log(accounts);

// Метод массива REDUCE
// todo Подсчет и вывод на страницу общего баланса (reduce)
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (acc, val) {
    return acc + val;
  });
  labelBalance.textContent = `${acc.balance}₽`;
}

// todo Подсчет и вывод точечно приход, уход, сумма
function calcDisplaySum(movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₽`;
  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₽`;

  labelSumInterest.textContent = `${incomes + out}₽`;
}

const acc = accounts.find((acc) => acc.owner === "Tatyana Filimonova");
console.log(acc);

// Объединение функций
function updateUI(acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

// Кнопка логин
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Полет нормальный");
  currentAccount = accounts.find(function (acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    console.log("Oni chan");
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    inputLoginPin.value = inputLoginUsername.value = "";
  }
});

// Кнопка перевод средств
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const recieveAcc = accounts.find(function (acc) {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  console.log(amount, recieveAcc);
  if (
    recieveAcc &&
    amount > 0 &&
    currentAccount.balance > amount &&
    recieveAcc !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    recieveAcc.movements.push(amount);
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
  }
});

// Закрытие аккаунта
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.logIn === currentAccount.logIn;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

// ! 8-15 Методы массива Some() и Every()
/* 
some() проверяет все элементы массива и возвращает true, если хотя бы один элемент соответствует телу функции (условию)
Синтаксис

const arr = [1, 2, 3, 4, 5, -5, -10];
const someRes = function (ar) {
  return ar.some(function (val) {
    return val < 0;
  });
};
console.log(someRes(arr)); // true, потому что хотя бы 1 < 0

every() то же, что и some, но возвращает true, если ВСЕ элементы соответствуют телу функции (условию)
Синтаксис 

const everyRes = function (ar) {
  return ar.every(function (val) {
    return val < 0;
  });
};
console.log(everyRes(arr)); // false, потому что не все эл-ты < 0

const arrPos = [1, 2, 3];
console.log(someRes(arrPos)); // false, потому что ни одного < 0
console.log(everyRes(arrPos)); // false, потому что нет < 0

const arrNeg = [-1, -4, -10];
console.log(someRes(arrNeg)); // true, потому что хотя бы 1 < 0
console.log(everyRes(arrNeg)); // true, потому что все < 0
*/

/* 
Работаем с полем "Внести деньги"

*/

// Кнопка "Внести сумму"
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // Создадим переменную которая содержит сумму, которую мы внесем в поле inputLoanAmount
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  // Очищаем поле input
  inputLoanAmount.value = "";
});

// ! 8-16 Метод массива flat()
/* 
Расформировывает массив с вложенными массивами в один большой массив
БЕЗ КОЛБЕК ФУНКЦИЙ
flat() Работает ТОЛЬКО НА ОДНОМ УРОВНЕ ВЛОЖЕННОСТИ
Поэтому существует возможность указывать параметр - цифру, до какой глубины расформировывать массив
const arr = [[1, 2, 3], 4, [5, 6, 7]];
const flatted = arr.flat();
console.log(flatted); // (7) [1, 2, 3, 4, 5, 6, 7]

// Сделаем второй уровень вложенности
const arr1 = [[1, [2, 3]], 4, [5, [6, 7]]];
console.log(arr1.flat(2)); // (7) [1, 2, 3, 4, 5, 6, 7]
*/
/* 
С помощью метода flat сделаем подсчет сумм всех аккаунтов в свойстве movements

const accMap = accounts.map(function (acc) {
  return acc.movements;
});
console.log(accMap); // (4) [Array(8), Array(8), Array(8), Array(5)] - все movements в одном массиве.

// Расплющим массив
const accMov = accMap.flat();
console.log(accMov); // (29) [2000000, 450, -400, 3000, -650, -130, 70, 1300, 5000, 3400, -150, -790, -3210, -1999, 8600, -30, 500, 340, -1500, -90, 3210, -1999, 8600, -30, 50, 1000, 700, 50, 30]

// Сложим все значения массива
const allBalance = accMov.reduce(function (acc, mov) {
  return acc + mov;
}, 0);
console.log(allBalance); // 2025322

Но такая запись не очень читабельная, поэтому объединим все в одно длинное выражение
*/

// Общий баланс всех аккаунтов
const allBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(allBalance); // 2025322
