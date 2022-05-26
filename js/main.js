"use strict";

const MINE = "💣";
const FLAG = "🚩";
const LIVE = "❤";
var gBoard;
var gGame;
//var gCell;
var gFlag = 0;
var gMines = [];
var gCorrectMark = 0;
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gMines = [];
var gLivesNum =3;

function initGame() {
  chooseDifficulty(gLevel.SIZE, gLevel.MINES);
  livesCounter()
}

function chooseDifficulty(size, numOfMines) {
  gLevel.SIZE = size;
  gLevel.MINES = numOfMines;
  startGame();
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      var Cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = Cell;
    }
  }

  return board;
}

function renderBoard() {
  var strHTML = "";
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      var className = "cell";
      strHTML += `<td class="${className} cell-${i}-${j}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})" ></td>\n`;
    }
    strHTML += `</tr>\n`;
  }
  var elboard = document.querySelector("tbody.board");
  elboard.innerHTML = strHTML;
}

function setMinesAroundCount(gBoard) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cellNeighbors = countNeighbors(gBoard, i, j);
      gBoard[i][j].minesAroundCount = cellNeighbors;
    }
  }
}

function cellClicked(elCell, i, j) {
  // console.log(gGame.shownCount);
  if (gGame.shownCount === 0) {
    randomMine(gLevel);
    setMinesAroundCount(gBoard);
  } //first not a mine

  if(gLivesNum===0) {
    gGame.isOn=false
    var elEndGame = document.querySelector(".resat");
    elEndGame.innerHTML = `<button onclick="startGame()">🤯</button>`;
  }


  if(gGame.isOn){
  var cell = gBoard[i][j];
  cell.isShown = true;
  elCell.classList.add("shown");
  gGame.shownCount++;

  if (cell.minesAroundCount !== 0) {
    elCell.innerText = gBoard[i][j].minesAroundCount;
  }
  if (cell.isMine === true) {
    elCell.innerText = MINE;
    var elclickedMine = document.querySelector(".resat");
    elclickedMine.innerHTML = `<button onclick="startGame()">😫</button>`;
    gLivesNum--
    livesCounter()
    //gGame.isOn=false
  }
  //console.log(cell.minesAroundCount);
  //console.log(gBoard);
  if (cell.minesAroundCount === 0 && cell.isMine !== true) {
    expandShown(gBoard, i, j);
  }
  }
}

function randomMine(gLevel) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var minLocaion = {
      i: getRandomInt(0, gLevel.SIZE),
      j: getRandomInt(0, gLevel.SIZE),
    };
    if (gBoard[minLocaion.i][minLocaion.j] === MINE) continue;
    gBoard[minLocaion.i][minLocaion.j].isMine = true;
    gMines.push(minLocaion);
  }
}

function startGame() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  // randomMine(gLevel);
  // setMinesAroundCount(gBoard);
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gCorrectMark = 0;
  gFlag = 0;
  gLivesNum =3
  var elStartGame = document.querySelector(".resat");
  elStartGame.innerHTML = `<button onclick="startGame()">😀</button>`;
  livesCounter()
}

function cellMarked(elCell, indexI, indexJ) {
  elCell.classList.toggle("marked");
  var cell = gBoard[indexI][indexJ];
  if (cell.isMarked === false) {
    cell.isMarked = true;
    gGame.markedCount++;
    gFlag++;
    if (cell.isMine === true) gCorrectMark++;
    //console.log(gFlag);
    //console.log('gCorrectMark',gCorrectMark)
    renderCell({ i: indexI, j: indexJ }, FLAG);
  } else {
    cell.isMarked = false;
    gGame.markedCount--;
    gFlag--;
    if (cell.isMine === true) gCorrectMark--;
    //console.log(gFlag);
    //console.log('gCorrectMark',gCorrectMark)
    renderCell({ i: indexI, j: indexJ }, (elCell.innerText = ""));
  }
}

function expandShown(gBoard, expendI, expendJ) {
  // console.log("gBoard", gBoard);
  // console.log("elCell", elCell);
  // console.log("expendI", expendI);
  // console.log("expendJ", expendJ);
  for (var i = expendI - 1; i <= expendI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = expendJ - 1; j <= expendJ + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue;
      if (i === expendI && j === expendJ) continue;
      var cell = gBoard[i][j];
      //console.log("gBoard[i][j]", gBoard[i][j]);
      if (cell.isMarked) continue;
      if (cell.isMine) continue;

      cell.isShown = true;
      gGame.shownCount++;
      var elExpend = document.querySelector(`.cell-${i}-${j}`);
      elExpend.classList.add("shown");
      if (cell.minesAroundCount !== 0) {
        elExpend.innerText = cell.minesAroundCount;
      }
      // if(cell.minesAroundCount===0){
      //   expandShown(gBoard, i, j)
      // } not working
    }
  }
}

function checkGameOver(gBoard) {
  if (
    gFlag === gLevel.MINES &&
    gFlag === gCorrectMark &&
    gGame.shownCount === gLevel.SIZE ** 2 - gCorrectMark
  ) {
    var elWinGame = document.querySelector(".resat");
    elWinGame.innerHTML = `<button onclick="startGame()">😎</button>`;
  }
}

function gameOver() {
  gGame.isOn = false;
  gLivesNum =3
}



function livesCounter(){
  console.log('gLivesNum',gLivesNum)
  
  var elLives = document.querySelector('.lives')
  elLives.innerText=''
  for(var i=0;i<gLivesNum; i++){
    elLives.innerText+=LIVE
  }
}


