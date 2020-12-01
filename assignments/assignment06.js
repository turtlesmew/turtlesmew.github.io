// --- global variables ---

var loans = [
  {
    loan_year: 2020,
    loan_amount: 10000.0,
    loan_int_rate: 0.0453,
  },
  {
    loan_year: 2021,
    loan_amount: 10000.0,
    loan_int_rate: 0.0453,
  },
  {
    loan_year: 2022,
    loan_amount: 10000.0,
    loan_int_rate: 0.0453,
  },
  {
    loan_year: 2023,
    loan_amount: 10000.0,
    loan_int_rate: 0.0453,
  },
  {
    loan_year: 2024,
    loan_amount: 10000.0,
    loan_int_rate: 0.0453,
  },
];
let loanWithInterest = 0;
let int = 0;

// --- function: loadDoc() ---

function loadDoc() {
  // pre-fill defaults for first loan year
  var defaultYear = loans[0].loan_year;
  $("#loan_year0" + 1).val(defaultYear++); //changed document.getElementById to $, added # before the ID, changed .value to .val()
  var defaultLoanAmount = loans[0].loan_amount;
  $("#loan_amt0" + 1).val(defaultLoanAmount.toFixed(2)); //changed document.getElementById to $, added # before the ID, changed .value to .val()
  var defaultinterestRate = loans[0].loan_int_rate;
  $("#loan_int0" + 1).val(defaultinterestRate); //changed document.getElementById to $, added # before the ID, changed .value to .val()
  var loanWithInterest = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
  $("#loan_bal0" + 1).text(toMoney(loanWithInterest)); //changed document.getElementById to $, added # before the ID, changed .innerHTML to .text(), .toComma to ToMoney()

  // pre-fill defaults for other loan years
  for (var i = 2; i < 6; i++) {
    $(`#loan_year0${i}`).val(defaultYear++); //changes the value of the remaining year values to the default year +1
    $(`#loan_year0${i}`).attr("disabled", "true"); //disables the remaining year values
    $(`#loan_year0${i}`).css({"backgroundColor":"grey","color":"white"}); //sets the background to grey and text to white for the remaining years
    $(`#loan_amt0${i}`).val(defaultLoanAmount.toFixed(2)); //change the loan amount values to 10,000 dollar value
    $(`#loan_int0${i}`).val(defaultinterestRate); // change the interest rate column to the default interest rate
    $(`#loan_int0${i}`).attr("disabled", "true"); //disables the remaining interest rate values
    $(`#loan_int0${i}`).css({"backgroundColor":"grey","color":"white"}); //sets the background to grey and text to white for the remaining interest rates
    loanWithInterest = (loanWithInterest + defaultLoanAmount) * (1 + defaultInterestRate);
    $(`#loan_bal0` + i).text(toMoney(loanWithInterest)); //changed document.getElementById to $, added # before the ID, changed .innerHTML to .text(), .toComma to ToMoney()
  } // end: "for" loop

  // all input fields: select contents on focus
  $("input[type=text]").focus(function() {
    $(this).select();
    $(this).css("background-color", "yellow");
  });
  $("input[type=text]").blur(function() {
    $(this).css("background-color", "white");
    updateLoansArray();
  });

  // set focus to first year: messes up codepen
  $("#loan_year01").focus();
} // end: function loadDoc()

let updateForm = () => {
  loanWithInterest = 0;
  let totalAmt = 0;
  for (i = 1; i < 6; i++) {
    $(`#loan_year0${i}`).val(loans[i - 1].loan_year); //change the year values to the values stored in loans
    let amt = loans[i - 1].loan_amount; //create amt variable
    $(`#loan_amt0${i}`).val(amt); //pull the loaned amount
    totalAmt += parseFloat(amt); //accumulate total amount loaned
    $(`#loan_int0${i}`).val(loans[i - 1].loan_int_rate); //pull integer value
    loanWithInterest = (loanWithInterest + parseFloat(amt)) * (1 + loans[0].loan_int_rate); //calculate the total loaned value with interest
    $(`#loan_bal0` + i).text(toMoney(loanWithInterest));
  }
  let int = loanWithInterest - totalAmt;
  $(`#loan_int_accrued`).text(toMoney(int)); //apply value for total interest collected over college career
}

function toComma(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let toMoney = (value) => {
  return `\$${toComma(value.toFixed(2))}`;
}

let saveForm = () => {
  localStorage.setItem(`as06`, JSON.stringify(loans));
}

let loadForm = () => {
  if (localStorage.getItem(`as06`) != null) { //if there is data on device
    loans = JSON.parse(localStorage.getItem(`as06`)); //apply the values from the saved data to loans
    updateForm(); //calls updateForm
  } else { //if there is no on device data
    alert(`Error: no saved values`); //alert the user
  }
}

function updateLoansArray() {
  let yearPrd = /^(19|20)\d{2}$/; //checks if the value is a number and within 1899 and 2099
  let amountPrd = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/; //checks if the value is a number and above 1 whole dollar
  let intPrd = /^(0|)+(.[0-9]{1,5})?$/; //checks to ensure the value is a number is below 1.0
  let valid = true; //flag for everything being valid

  if (!yearPrd.test($(`#loan_year01`).val())) { //if year period does not pass
    valid = false; //set to false
    alert("error in year field"); //messagebox to tell user error
  }

  for (i = 1; i < 6; i++) { //loop through full amount field
    if (!amountPrd.test($(`#loan_amt0${i}`).val())) { //if amount period is not passed
      valid = false; //set to false
      alert("error in amount field in box: " + i); //messagebox to tell user error in box i
    }
  }

  if (!intPrd.test($(`#loan_int01`).val())) { //if int period is not passed
    valid = false; //set to false
    alert("error in interest rate field"); //messagebox to tell user error in interest rate
  }

  if (valid) { //if everything is valid
    loans[0].loan_year = parseInt($("#loan_year01").val()); //pass the year value from the input box
    for (var i = 1; i < 5; i++) { //loop for the rest of the year values
      loans[i].loan_year = loans[0].loan_year + i; //apply value to loans adding i for proper input
    }

    for (i = 1; i < 6; i++) { //loop for entirety of amount values
      let amount = parseFloat($(`#loan_amt0${i}`).val()).toFixed(2); //pass the float value
      loans[i - 1].loan_amount = amount; //save value to loans
    }

    let interestRate = parseFloat($("#loan_int01").val()); //generate interest rate value
    for (i = 0; i < 5; i++) { //loop for interest rate field
      loans[i].loan_int_rate = interestRate; //save interest rate to loans
    }

    updateForm(); //calls updateForm
  }
}

var app = angular.module("myApp", []); //create app using angular inside the myApp field

app.controller("myCtrl", function ($scope) {
  //everything within the myCtrl field
  $scope.payments = []; //find the payments

  $scope.populate = function () {
    //begin the populate function

    updateForm(); //update the form

    let endPrice = loanWithInterest; //create an endPrice set to loanwithinterest
    let interestRate = loans[0].loan_int_rate; //create an interestRate value from loan_int_rate
    let r = interestRate / 12; //create an r value for interest over months instead of over years
    let n = 11; //create an n value of the number of months

    let pay = 12 * (endPrice / (((1 + r) ** (n * 12) - 1) / (r * (1 + r) ** (n * 12)))); //calculate payment
    for (let i = 0; i < 10; i++) { //loop 10 times
      endPrice -= pay; //decrease endPrice
      let totalInterest = endPrice * interestRate; //create totalInterest equal montly interest rate * end price
      $scope.payments[i] = { //adjust payments values
        "year": loans[4].loan_year + i + 1, //go to year the next
        "payment": toMoney(pay), //set payment
        "amt": toMoney(totalInterest), //set interest amount
        "ye": toMoney((endPrice += totalInterest)), //set ye
      }
    }
    $scope.payments[10] = { //payment values at position 10
      "year": loans[4].loan_year + 11, //year will equal the year of interest plus 11
      "payment": toMoney(endPrice), //set payment to endPrice
      "amt": toMoney(0), //set interest amount to 0
      "ye": toMoney(0), //set ye to 0
    }
  }
});
