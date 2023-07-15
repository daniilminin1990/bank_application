"use strict";

// ! Иди к следующему bookmark. Это копия с main6.js

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
  inputTransferAmount = document.querySelector(".login__input--amount"),
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
  // Вот оно
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
    // Теперь помещаем этот элемент в контейнер containerMovements через insertAdjacentHTML()
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// displayMovements(account1.movements);

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
console.log(accounts); // ЕБАТЬ ВСЕ ЗАРАБОТАЛО С ПЕРВОГО РАЗА!!! Получился массив, внутри которого объект имеет новый НУЖНЫЙ элемент, как и задумывалось

// Метод массива REDUCE
// todo Подсчет и вывод на страницу общего баланса (reduce)
function calcPrintBalance(movements) {
  const balance = movements.reduce(function (acc, val) {
    return acc + val;
  });
  labelBalance.textContent = `${balance}₽`;
}
// calcPrintBalance(account1.movements);

// todo Подсчет и вывод точечно приход, уход, сумма
function calcDisplaySum(movements) {
  // пошли другим путем - используем фильтр и reduce
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₽`;
  // С уходом точно также
  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₽`;

  // Для суммы просто сложил. А я хотел использовать ранее написанную функцию
  labelSumInterest.textContent = `${incomes + out}₽`;
}

// calcDisplaySum(account1.movements);

// * Метод Math.abs(num) - оставляет только значение без знака. То есть минус не запишет

// Теперь создадим функцию на примере нашего приложения
// Сделаем так, чтобы методом find возвращался пользователь с определенными именем и фамилией из массива пользователей accounts
const acc = accounts.find((acc) => acc.owner === "Tatyana Filimonova");
console.log(acc); // Вывел весь объект из массива accounts, который соответствовал телу функции

// ! 8 - 12 урок
/* 
Теперь сделаем возможность логиниться в аккаунте
И вернем свойство opacity в css
Будем работать с переменной btnLogin, которая является html элементом кнопкой login__btn
*/

/* 
btnLogin.addEventListener("click", function () {
  console.log("Полет нормальный");
});

Когда пишем так, у нас слова "Полет нормальный" появляются в консоли на долю секунды и пропадают, ПОЧЕМУ?!
Потому что так работает стандартное поведение button в form, и нам это стандартное поведение нужно убрать
Для этого нужно использовать объект СОБЫТИЕ в колбэк функции для слушателя событий (e) и использовать метод preventDefault
*/
/* 
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Полет нормальный");
});
// А вот так сообщение остается на месте
*/

/* 
Todo: Еще один момент для form - когда мы, после введения данных в полях input используем кнопку Enter, то это все равно что нажать на button
То есть нам не обязательно нажимать на кнопку

Теперь поработаем с логином.
Для этого нам НЕОБХОДИМО СОЗДАТЬ ПЕРЕМЕННУЮ ЗА ПРЕДЕЛАМИ addEventListener - currentAccount и манипулировать ею внутри, чтобы логиниться
1 currenAccount должен быть равен элементу login в объекте аккаунта, в массиве аккаунтов, то есть используем метод find в accounts
2 у нас есть переменная inputLoginPin, которая соответствует полю ввода тега input с классом login__input--pin.
  Если введенный в поле inputLoginPin будет совпадать с accounts.account.pin, то возвращаем свойство opacity: 0 переменной containerApp, который тег app,
*/
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Полет нормальный");
  currentAccount = accounts.find(function (acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  console.log(currentAccount);
  /* 
  Что мы тут сделали?! Мы тут написали - вложи в переменную currentAccount объект одного пользователя из массива объектов пользователей, у которого acc.logIn будет
  полностью соответствовать введенному значению в поле input.
  А если не будет равно, то будет undefined
  ! Но - форма записи интересная, без if - это и сбило с толку. А это плохо, потому что это должно было быть понятно из урока про filter. Там же он работает по условию. Условие соблюдено (true) - возвращается значение
  */
  // Если currentAccount != undefined, то есть в принципе существует + если currentAccount.pin === +inputLoginPin.value
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    console.log("Oni chan");
    // Включим opacity: 0 в style.css, и отключим его с помощью js
    containerApp.style.opacity = 100;
    // Теперь нужно обновить поля "текущий баланс", столбец прихода-ухода и значения в footer приход-уход-сумма. Функции написаны, их нужно применить с переменной currentAccount
    displayMovements(currentAccount.movements);
    calcPrintBalance(currentAccount.movements);
    calcDisplaySum(currentAccount.movements);
    // После того как залогинились, нужно удалять данные из Input, а они пока там остаются
    inputLoginPin.value = inputLoginUsername.value = "";
  }
});

/*
! Разобрался с Git и GitHub
Разобрался с Git и GitHub, теперь в нем все ковыряю, в ветке practice
А для врезания этого кода в ветку master, нужно в терминале писать:
Сначала сохранить все в practice:
git status - проверка
git add . - сохраняем
git commit -m "Что изменил"
git push origin practice - пушим в ветку practice на GitHub
git checkout master - сменили ветку на master
git merge practice - совмещаем ветку master с веткой practice
удаляю ненужное, например комментарии лишние
git status - проверка
git add . - сохраняем
git commit -m "Что изменил"
git push - пушим в master
*/

// ! 8 - 13 Урок Перевод средств из аккаунта
