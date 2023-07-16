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

// ! 8-14 findIndex()
/* 
Урок 8-14 Метод массива findIndex()

Используется для определения индекса элемента в массиве. Перебирает массив и исходя из результата true или false, возвращает индекс элемента массива

const arr = [1, 2, 3, 4, 5, 6, 7];
const index = arr.findIndex(function (num) {
  return num === 5;
});
console.log(index); // 4

Но в чем отличие от indexOf

const fIn = arr.indexOf(5);
console.log(fIn); // 4

В примерах выше - ни в чем, результат тот же, но для более сложных структур findIndex лучше, так как сам по себе более глубокий, чем indexOf
indexOf - мы не можем зайти вглубь элемента и поиск производится только на поверхности.

Сделаем то же самое для наших аккаунтов
const index = accounts.findIndex((acc) => acc.logIn === "af");
console.log(index); // 1

Работаем над полем "Закрытие аккаунта"
*/
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  /* Нужно чтобы пользователь совпадал с currentAcc, PIN = currentAcc.pin */
  // inputCloseUsername
  // inputClosePin
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // ищем индекс текущего аккаунта ис массива аккаунтов
    const index = accounts.findIndex(function (acc) {
      return acc.logIn === currentAccount.logIn;
    });
    // console.log(index); // dm 1111 ---> 0, если ввести неверные данные - то ничего не получим
    // Для удаления аккаунта воспользуемся методом SPLICE (точечное удаление из массива)
    accounts.splice(index, 1);
    // Теперь нужно выйти на стартовую страницу, а все содержимое содержится в переменной containerApp и изменим style.opacity на 0
    containerApp.style.opacity = 0;
    console.log(accounts); // аккаунт удаляется
  }
  // Здесь очищаем поля inputClosePin и inputCloseUsername
  inputClosePin.value = inputCloseUsername.value = "";
});
