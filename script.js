'use strict';




// BANKIST APP




const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-08-06T17:01:17.194Z',
    '2024-08-08T17:01:17.194Z',
    '2024-08-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};



// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




// Movements

const formatMovementDate = function (now, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));



  const daysPassed = calcDaysPassed(new Date(), now);



  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {

    return new Intl.DateTimeFormat(locale).format(now);
  }
}



const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale,
    {
      style: 'currency',
      currency: currency,
    }
  ).format(value);


}


const displayMovemets = function (acc, sort = false) {

  console.log(acc.movements);
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {

    let date = new Date(acc.movementsDates[i]);
    let movDate = formatMovementDate(date, acc.locale);


    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `        
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${movDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
};




const user = 'Jonas Schmedtmann Ted';




const createUsernames = function (accs) {

  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((element) => element[0])
      .join('');
  })
};


createUsernames(accounts)


const calcDisplayBalanc = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc += cur, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};




const calcDisplaySummary = function (account) {

  const movements = account.movements;
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);


  const interest = movements.filter(mov => mov > 0)
    .map((deposit => deposit * account.interestRate / 100))
    .filter((mov, i, arr) => {
      return mov > 1
    }).reduce((acc, int) => acc + int, 0);

  labelSumOut.textContent = formatCur(out, account.locale, account.currency);
  labelSumIn.textContent = formatCur(incomes, account.locale, account.currency);
  labelSumInterest.textContent = formatCur(interest, account.locale, account.currency);
}


// calcDisplaySummary(account1.movements);

const updateUi = function (acc) {
  displayMovemets(acc);

  // Display Balance

  calcDisplayBalanc(acc);

  // Display Summary

  calcDisplaySummary(acc);
}


// Event handlers
let currentAccount, timer;






const startLogOutTimer = function () {

  // Set time to 5 min
  let time = 100;
  // let startTimer = new Date(5 * 60 * 1000);
  let startTimer = new Date(10000);




  // Call the timer every sec

  const tick = function () {

    const newDate = new Date(startTimer);
    console.log(startTimer);

    let sec = newDate.getSeconds();
    let min = newDate.getMinutes();
    console.log(min, sec);



    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}`.padStart(2, 0) + ":" + `${sec}`.padStart(2, 0);

    // Decrese 1sec


    if (startTimer === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get stared`;
      containerApp.style.opacity = 0;
    }

    startTimer = startTimer - 1000;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;




  // When 0 sec, log out user
}




btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = +(inputLoginPin.value);

  currentAccount = accounts.find(acc => acc.username === username);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (currentAccount?.pin === pin) {
    // Display UI and Welcome message

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]} `
    containerApp.style.opacity = 1;
    // Display all the other Stuff

    // Create current Date

    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    // const locale = navigator.language;
    // console.log(locale);
    const locale = currentAccount.locale;


    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);





    // Clear input Fields

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();
    // Display Movements

    updateUi(currentAccount);


  }

  // console.log('login');
})


// console.log(accounts);
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Acc: ' + currentAccount);
  const username = inputTransferTo.value;

  const reciverAcc = accounts.find(acc => acc.username === username);
  const amount = +(inputTransferAmount.value);

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance > amount &&
    reciverAcc?.username !== currentAccount.username) {
    // Negativ movement to current users
    console.log('test 1');
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    reciverAcc.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());

    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();
    updateUi(currentAccount);
    // Reset Timer

    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    console.log('test 2');

  }
});


btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const loanAmoun = Math.floor(inputLoanAmount.value);
  console.log(currentAccount.movements.some(mov => mov >= loanAmoun * 0.1));

  if (loanAmoun > 0 && currentAccount.movements.some(mov => mov >= loanAmoun * 0.1)) {
    setTimeout(() => {

      currentAccount.movements.push(loanAmoun);
      currentAccount.movementsDates.push(new Date().toISOString());
      inputLoanAmount.blur();
      updateUi(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer()
    }, 3000);
  } else {
    console.log('Loan request has been declined!');
  }
  inputLoanAmount.value = '';

})

btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  const usernameClose = inputCloseUsername.value;
  const pinClose = +(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';
  if (usernameClose === currentAccount.username &&
    pinClose === currentAccount.pin
  ) {
    // Hide UI
    containerApp.style.opacity = 0;

    // Delete user
    const index = accounts.findIndex(acc => acc.username === usernameClose);

    accounts.splice(index, 1);


    console.log('You account has been deleted!');
  }


})


let sorted = false;

btnSort.addEventListener('click', (e) => {
  e.preventDefault();

  displayMovemets(currentAccount, !sorted);
  sorted = !sorted;

});

