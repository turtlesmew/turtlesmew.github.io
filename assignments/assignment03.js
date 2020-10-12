let elem = [];
// assign the entire table row for hole "i" to a variable, elem
for (var i = 1; i <= 18; i++) {
  let id = String(i);
  elem[i] = document.getElementById(id);
}
//This can't be done in the loop because the id is not a number
elem[19] = document.getElementById("totals");

//event handlers for the three buttons in row i
for (let i = 1; i <= 18; i++) {
  elem[i].children[4].children[0].onclick = function () {
    add1(elem[i]);
  };
  elem[i].children[4].children[1].onclick = function () {
    sub1(elem[i]);
  };
  elem[i].children[4].children[2].onclick = function () {
    clear(elem[i]);
  };
}

// adds one to the score in that row
function add1(elem) {
  if (elem.children[2].innerHTML == "-") {
    elem.children[2].innerHTML = "1";
  } else {
    let currentScore = elem.children[2].innerHTML;
    currentScore = Number.parseInt(currentScore);
    elem.children[2].innerHTML = currentScore + 1;
  }
  over(elem);
  total();
}

//subtracts one from the score in that row
function sub1(elem) {
  if (elem.children[2].innerHTML > "0") {
    let currentScore = elem.children[2].innerHTML;
    currentScore = Number.parseInt(currentScore);
    elem.children[2].innerHTML = currentScore - 1;
  }
  over(elem);
  total();
}

//clears that row
function clear(elem) {
  elem.children[2].innerHTML = "-";
  elem.children[3].innerHTML = "-";
  total();
}

//calculates if the score is over par in that row
function over(elem) {
  let par = elem.children[1].innerHTML;
  par = Number.parseInt(par);
  let score = elem.children[2].innerHTML;
  score = Number.parseInt(score);
  if (score > par) {
    elem.children[3].innerHTML = score - par;
  } else {
    elem.children[3].innerHTML = "-";
  }
}

//calculates the total if the round has been updated
function total() {
  let parTotal = 72; //this number is a constant from 4*18
  let scoreTotal = 0;
  let overTotal = 0;
  //this loop will run through each row
  for (let i = 1; i <= 18; i++) {
    if (elem[i].children[2].innerHTML != "-") {
      //checks to see if there is a score value
      let score = elem[i].children[2].innerHTML;
      score = Number.parseInt(score);
      scoreTotal += score;
    }
    if (elem[i].children[3].innerHTML != "-") {
      //checks to see if there is an over value
      let over = elem[i].children[3].innerHTML;
      over = Number.parseInt(over);
      overTotal += over;
    }
  }
  //assigns the totals to the correct columns
  elem[19].children[1].innerHTML = parTotal;
  elem[19].children[2].innerHTML = scoreTotal;
  elem[19].children[3].innerHTML = overTotal;
}
