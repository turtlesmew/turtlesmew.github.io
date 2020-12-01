// --- global variables ---

var loans = [
    { loan_year: 2020, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2021, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2022, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2023, loan_amount: 10000.00, loan_int_rate: 0.0453 },
    { loan_year: 2024, loan_amount: 10000.00, loan_int_rate: 0.0453 }
  ]; 
  let loanWithInterest = 0;
  let int = 0;
  
  // --- function: loadDoc() ---
  
  function loadDoc() {
    
    // pre-fill defaults for first loan year
    var defaultYear = loans[0].loan_year;
    $("#loan_year0" + 1).val(defaultYear++);
    var defaultLoanAmount = loans[0].loan_amount;
    $("#loan_amt0" + 1).val(defaultLoanAmount.toFixed(2));
    var defaultInterestRate = loans[0].loan_int_rate;
    $("#loan_int0" + 1).val(defaultInterestRate);
    var loanWithInterest = loans[0].loan_amount * (1 + loans[0].loan_int_rate);
    $("#loan_bal0" + 1).text(toMoney(loanWithInterest));
    
    // pre-fill defaults for other loan years
    for(var i=2; i<6; i++) {
      $(`#loan_year0${i}`).val(defaultYear++);
      $(`#loan_year0${i}`).attr("disabled","true");
      $(`#loan_year0${i}`).css({"backgroundColor":"grey","color":"white"});
      $(`#loan_amt0${i}`).val(defaultLoanAmount.toFixed(2));
      $(`#loan_int0${i}`).val(defaultInterestRate);
      $(`#loan_int0${i}`).attr("disabled","true");
      $(`#loan_int0${i}`).css({"backgroundColor":"grey","color":"white"});
      loanWithInterest = (loanWithInterest + defaultLoanAmount) * (1 + defaultInterestRate);
      $("#loan_bal0" + i).text(toMoney(loanWithInterest));
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
    for(i=1;i<6;i++){
      $(`#loan_year0${i}`).val(loans[i-1].loan_year);
      let amt = loans[i-1].loan_amount
      $(`#loan_amt0${i}`).val(amt);
      totalAmt+= parseFloat(amt);
      $(`#loan_int0${i}`).val(loans[i-1].loan_int_rate);
      loanWithInterest = (loanWithInterest + parseFloat(amt)) * (1 + loans[0].loan_int_rate);

      $("#loan_bal0" + i).text(toMoney(loanWithInterest));
    }
    int = loanWithInterest-totalAmt;
    $(`#loan_int_accrued`).text(toMoney(int));
  }
  
  function toComma(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  let toMoney = (value) =>{
    return `\$${toComma(value.toFixed(2))}`;
  }
  
  function updateLoansArray() {
    let valid = true;
    let yearP = /^(19|20)\d{2}$/;
    let amtP = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
    let intP = /^(0|)+(.[0-9]{1,5})?$/;

    if(!yearP.test($(`#loan_year01`).val())){
      valid = false;
      $(`#loan_year01`).css("background-color", "red");
    }
    
    for (i = 1; i < 6; i++) {
      if(!amtP.test($(`#loan_amt0${i}`).val())){
        valid = false;
        $(`#loan_amt0${i}`).css("background-color", "red");
      } 
    }

    if(!intP.test($(`#loan_int01`).val())){
      valid = false;
      $(`#loan_int01`).css("background-color", "red");
    }

    if(valid){
      loans[0].loan_year = parseInt($("#loan_year01").val());
      for(var i=1; i<5; i++) {
        loans[i].loan_year = loans[0].loan_year + i;
      }
      for(i = 1; i<6; i++){
        let amt = parseFloat($(`#loan_amt0${i}`).val()).toFixed(2);
        loans[i-1].loan_amount = amt;
      }
      let rate = parseFloat($("#loan_int01").val());
      for(i=0; i<5; i++){
        loans[i].loan_int_rate = rate;
      }

      updateForm();
    }
  }

 let saveForm = () => {
   localStorage.setItem(`as06`, JSON.stringify(loans));
 }

 let loadForm = () => {
  if(localStorage.getItem(`as06`) != null){
     loans = JSON.parse(localStorage.getItem(`as06`));
     updateForm();
  } else {
     alert(`Error: no saved values`);
  }
 }

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
  $scope.payments =[];
  $scope.populate = function () {
    updateForm();
    let total = loanWithInterest;
    let iRate = loans[0].loan_int_rate;
    let r = iRate / 12;
    let n = 11;
    //loan payment formula
    //https://www.thebalance.com/loan-payment-calculations-315564
    let pay = 12 * (total / ((((1+r)**(n*12))-1)/(r *(1+r)**(n*12))));
    for (let i = 0; i < 10; i++) {
      total -= pay //6500
      let int = total * (iRate); 
      $scope.payments[i]={
        "year":loans[4].loan_year + i + 1,
        "payment": toMoney(pay), //toMoney(6500),
        "amt": toMoney(int),
        "ye": toMoney(total += int)
      }
    }
    $scope.payments[10] = {
      "year":loans[4].loan_year + 11,
      "payment": toMoney(total),
      "amt": toMoney(0),
      "ye":toMoney(0)
    }
  }
});
