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
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((val, i) => {
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

// Общая функция
function updateUI(acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

// Кнопка Login
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

// Закрытие аккаунта, удаление аккаунта из общего списка
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

// Общий баланс всех аккаунтов
const allBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(allBalance); // 2025322

// ! 8-17 метод массива sort()
/* 
Сортирует массив. ИЗМЕНЯЕТ ОРИГИНАЛЬНЫЙ МАССИВ
Сравнивает все элементы по юникоду. Т.е. если у нас будут заглавные и строчные буквы, то все пойдет по пизде - будет сортировать по приоритетности букв по юникоду JS
*/
const arr = ["e", "b", "a", "c", "d"];
console.log(arr.sort()); //(5) ['a', 'b', 'c', 'd', 'e']
console.log(arr); // (5) ['a', 'b', 'c', 'd', 'e'] -- МЕНЯЕТ ОРИГИНАЛЬНЫЙ МАССИВ, ЗНАЧИТ ЛУЧШЕ ДЕЛАТЬ НЕЗАВИСИМУЮ КОПИЮ

const arrUp = ["E", "b", "a", "c", "D"];
console.log(arrUp.sort()); // (5) ['D', 'E', 'a', 'b', 'c'] -- потому что верхний регистр имеет приоритет над нижним

/*
Что насчет чисел?!
Числа тоже сортируются как хуйня, но в этом есть логика - 
sort() сортирует числа сначала конвертировав их в строки, только потом выводит результат. А это значит что 1000 будет раньше чем 200 [1000, 200], но математически это неправильно
*/
const arrN = [5000, 3400, -150, -790, -3210, -1999, 8600, -30];
console.log(arrN.sort()); // (8) [-150, -1999, -30, -3210, -790, 3400, 5000, 8600]

/*
Вот тут и имеет смысл дополнительный параметр метода - использование callBack функции
! Внимание - нужно просто запомнить формулу этой функции, иначе заебессья
Есть 3 варианта написания:
1 - долго, с if
console.log(
  arrN.sort(function (a, b) {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
  })
); // (8) [-3210, -1999, -790, -150, -30, 3400, 5000, 8600]

2 - короче, a - b
console.log(
  arrN.sort(function (a, b) {
    return a - b;
  })
); // (8) [-3210, -1999, -790, -150, -30, 3400, 5000, 8600]

3 - стрелочный
console.log(arrN.sort((a, b) => a - b)); // (8) [-3210, -1999, -790, -150, -30, 3400, 5000, 8600]

То есть этот метод с callBack сравнивает каждую пару чисел. И пока не будет удовлетворено условие с каждой новой итерацией, он не успокоится
*/

/* 
! Теперь сделаем дополнения в код выше.
1) В функции displayMovements добавим доп параметр, который нам понадобится для реализации функции сортировки movements
* function displayMovements(movements) { // было
* function displayMovements(movements, sort = false) { // стало
Т.е. ввели значение по умолчанию
2) Здесь же создадим переменную, которая будет независимой копией (т.к. sort изменяет оригинал) сортировать movements в зависимости от условия, будет ли sort = true или false, т.е. через тернарный оператор
* const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;
3) Заменим 
* movements.forEach(function (value, i) { // было
* movs.forEach(function (value, i) { // было

*/

// Кнопка Фильтр
// создадим переменную sorted = false, чтобы манипулировать ей для фильтрации
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // вызываем доработанную функцию displayMovements
  displayMovements(currentAccount.movements, !sorted);
  // Будет меняться при каждом нажатии на кнопку
  sorted = !sorted;
});
