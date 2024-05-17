
// Prepare HTML structure
createTable();
let inputs = document.querySelectorAll("input.field");
let message = document.querySelector("div.message");
message.innerHTML = "<h1>Welcome to Sudku game</h1><p>Select the difficulty level below to start the game.</p>";
let cover = document.createElement("div");
cover.classList.add("cover", "none");
let body = document.querySelector("body");
body.appendChild(cover);
let allRelatedFields = getAllRelatedFields();
let modalInfo = document.createElement("div");
modalInfo.classList.toggle("modalInfo");
modalInfo.classList.toggle("none");
let modalInfoP = document.createElement("p");
modalInfoP.innerHTML = "<h1>Good job!</h1><br>Congrats! All fields are completed correctly!";
modalInfo.append(modalInfoP);
let modalInfoButton = document.createElement("button");
modalInfoButton.classList.add("green");
modalInfoButton.innerText = "OK";
modalInfo.append(modalInfoButton);
body.appendChild(modalInfo);
modalInfoButton.addEventListener("click", e => {
  cover.classList.toggle("none");
  modalInfo.classList.toggle("none");
});


// Functions
function createButtons() {
  let buttons = document.querySelector("div.buttons");
  let easyButton = document.createElement("button");
  easyButton.classList.add("green");
  easyButton.innerText = "easy level";
  let mediumButton = document.createElement("button");
  mediumButton.classList.add("yellow");
  mediumButton.innerText = "medium level";
  let hardButton = document.createElement("button");
  hardButton.classList.add("red");
  hardButton.innerText = "hard level";
  buttons.appendChild(easyButton);
  buttons.appendChild(mediumButton);
  buttons.appendChild(hardButton);
  return buttons;
}

function addButtonsListener(buttons) {
  buttons.querySelector(".green").addEventListener("click", e => {
    clearBoard();
    fillBoard(50);
    message.innerHTML = "<h1>Level easy</h1><p>Level easy? That's a piece of cake ;)</p>";
  });

  buttons.querySelector(".yellow").addEventListener("click", e => {
    clearBoard();
    fillBoard(30);
    message.innerHTML = "<h1>Level medium</h1><p>Let's start the game. Good luck!</p>";
  });

  buttons.querySelector(".red").addEventListener("click", e => {
    clearBoard();
    fillBoard(20);
    message.innerHTML = "<h1>Level hard</h1><p>I keep fingers crossed! You can do it.</p>";
  });
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomNumbers(min, max, quantity) {
let numbers = [];
while(numbers.length < quantity) {
  let number = randomNumber(min, max);
      if(!(numbers.includes(number))) {
          numbers.push(number);
      }
  }
return numbers;
}

function getAllRelatedFields() {
  let relatedFields = [];
  for(input of inputs) {
    relatedFields[input.id] = [];
    for(i = 0; i < inputs.length; i++) {
      if(input.dataset.row == inputs[i].dataset.row && input.id !== inputs[i].id) {
        if(!relatedFields[input.id].includes(inputs[i].id)) {
          relatedFields[input.id].push(inputs[i].id);
        }
      }
      if(input.dataset.col == inputs[i].dataset.col && input.id !== inputs[i].id) {
        if(!relatedFields[input.id].includes(inputs[i].id)) {
          relatedFields[input.id].push(inputs[i].id);
        }
      }
      if(input.dataset.field == inputs[i].dataset.field && input.id !== inputs[i].id) {
        if(!relatedFields[input.id].includes(inputs[i].id)) {
          relatedFields[input.id].push(inputs[i].id);
        }
      }
    }
  }
  return relatedFields;
}

function checkNumber(numberId, number) {
  for(relatedField of allRelatedFields[numberId]) {
    if(board[relatedField] == number) {
      return false;
    }
  }
  return true;
}

function generateBoard() {
  do {
    board = [];
    for(input of inputs) {
      let numbers1to9 = randomNumbers(1, 9, 9);
      loop:
      for(number of numbers1to9) {
        if(checkNumber(input.id, number)) {
          board[input.id] = number;
          break loop;
        }
      }
    }
  }
  while(board.length > board.filter((el) => Number.isInteger(board.indexOf(el))).length);
  return board;
}

function fillBoard(quantity) {
  let inputIds = randomNumbers(0, 80, quantity);
  let board = generateBoard();
  for(inputId of inputIds) {
    inputs[inputId].value = board[inputId];
    inputs[inputId].readOnly = true;
    inputs[inputId].classList.add("correct", "bold");
  }
  for(input of inputs) {
    if(input.value == "") {
      input.addEventListener("input", e => {
        checkFields();
        checkBoard();
      });
    }
  }
}

function getFieldsToCheck() {
  let fieldsToCheck = [];
  for(input of inputs) {
    if(input.readOnly !== true && input.value !== null) {
      fieldsToCheck.push(input.id);
    }
  }
  return fieldsToCheck;
}

function checkFields() {
  let fieldsToCheck = getFieldsToCheck();
  for(fieldId of fieldsToCheck) {
    if(validateNumber(inputs[fieldId].value) && checkNumber(fieldId, inputs[fieldId].value)) {
      inputs[fieldId].classList.remove("incorrect");
      inputs[fieldId].classList.add("correct");
    }
    else {
      inputs[fieldId].classList.remove("correct");
      inputs[fieldId].classList.add("incorrect");
    }
  }
  for(input of inputs) {
    if(input.value == "") {
      input.classList.remove("correct", "incorrect");
    }
  }
}

function checkBoard() {
  let correctFields = 0;
  for(input of inputs) {
    if(input.classList.contains("correct")) {
      correctFields++;
    }
  }
  if(correctFields == 81) {
    showmodalInfo();
    for(input of inputs) {
      input.readOnly = true;
    }
  }
}

function prepareBoard() {
  for(input of inputs) {
    input.value = "";
    input.readOnly = true;
    input.classList.remove("correct", "incorrect", "bold");
  }
}

function createTable() {
  let divTable = document.getElementById("table");
  let id = 0;
  let row = 1;
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  let idFields = getIdFields();
  for(i = 0; i < 9; i++) {
    let tr = document.createElement("tr");
    for(j = 0; j < 9; j++) {
      let td = document.createElement("td");
      let input = document.createElement("input");
      input.setAttribute("id", id);
      input.setAttribute("type", "text");
      input.setAttribute("data-field", idFields[id]);
      input.setAttribute("data-row", row);
      input.setAttribute("data-col", j+1);
      input.setAttribute("class", "field");
      if(idFields[id] % 2) {
        input.classList.add("odd");
      }
      td.append(input);
      tr.append(td);
      id++;
    }
    row++;
    tbody.append(tr);
  }
  table.append(tbody);
  divTable.appendChild(table);
}

function getIdFields() {
  let ids = [];
  let f = 1;
  for(i = 0; i < 81; i++) {
    ids.push(f);
    if(ids.length % 3 == 0) {
      f++;
    }
    if(ids.length % 9 == 0 && ids.length % 27 !== 0) {
      f = f - 3;
    }
    if(ids.length % 27 == 0 && ids.length % 9 !== 0) {
      f++;
    }
  }
  return ids;
}

function clearBoard() {
  for(input of inputs) {
    input.value = "";
    input.readOnly = false;
    input.classList.remove("correct", "incorrect", "bold");
  }
}

function validateNumber(number) {
  if(Number.isInteger(Number(number)) && Number(number) >= 1 && Number(number) <= 9 && number.length == 1) {
    return true;
  }
  return false;
}

function showmodalInfo() {
  cover.classList.remove("none");
  modalInfo.classList.remove("none");
}

prepareBoard();
addButtonsListener(createButtons());
