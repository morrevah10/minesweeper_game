'use strict'
var gStartTime
var gIntervalId

function countNeighbors(gBoard, cellI, cellJ) {
    var count = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i > gBoard.length - 1) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j > gBoard[0].length - 1) continue;
        if (i === cellI && j === cellJ) continue;
        var cell = gBoard[i][j];
        if (cell.isMine === true) count++;
      }
    }
    return count;
  }


  
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function renderCell(location, value) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}



function startTimer() {
  gStartTime = Date.now()
  gIntervalId = setInterval(updateTime, 80)
}


function updateTime() {
  var now = Date.now()
  var diff = now - gStartTime
  gGame.secsPassed = diff /1000
  var elTimerSpan = document.querySelector('.timer span')
  elTimerSpan.innerText = gGame.secsPassed

}

