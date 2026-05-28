const boardElement =
document.getElementById("board");

const statusText =
document.getElementById("status");

const nodesText =
document.getElementById("nodes");

const currentModeText =
document.getElementById("currentMode");

const modeSelect =
document.getElementById("mode");

const depthInput =
document.getElementById("depth");

let board = [
  "","","",
  "","","",
  "","",""
];

let gameOver = false;

let nodesEvaluated = 0;

const HUMAN = "X";

const AI = "O";

createBoard();

modeSelect.addEventListener(
  "change",
  ()=>{

    currentModeText.innerText =
      modeSelect.value === "minimax"
      ? "Minimax"
      : "Alpha-Beta";

  }
);

function createBoard(
  winningCombo = []
){

  boardElement.innerHTML = "";

  board.forEach((cell,index)=>{

    const div =
    document.createElement("div");

    div.classList.add("cell");

    div.innerText = cell;

    if(cell === "X"){
      div.classList.add("x");
    }

    if(cell === "O"){
      div.classList.add("o");
    }

    if(winningCombo.includes(index)){
      div.classList.add("winner-cell");
    }

    div.addEventListener(
      "click",
      ()=>makeMove(index)
    );

    boardElement.appendChild(div);

  });

}

function makeMove(index){

  if(
    board[index] !== "" ||
    gameOver
  ){
    return;
  }

  board[index] = HUMAN;

  let humanWin =
  checkWinner(board,HUMAN);

  createBoard(humanWin || []);

  if(humanWin){

    statusText.innerText =
    "🎉 Player X Menang!";

    gameOver = true;

    return;
  }

  if(isDraw()){

    statusText.innerText =
    "😮 Game Seri!";

    gameOver = true;

    return;
  }

  aiMove();

}

function aiMove(){

  statusText.innerText =
  "🤖 AI sedang berpikir...";

  statusText.classList.add(
    "thinking"
  );

  setTimeout(()=>{

    nodesEvaluated = 0;

    let availableMoves = [];

    for(let i=0;i<9;i++){

      if(board[i] === ""){
        availableMoves.push(i);
      }

    }

    let move;

    let randomChance =
    Math.random();

    // AI kadang random
    if(randomChance < 0.3){

      move =
      availableMoves[
        Math.floor(
          Math.random() *
          availableMoves.length
        )
      ];

    }else{

      let bestScore = -Infinity;

      for(let i=0;i<9;i++){

        if(board[i] === ""){

          board[i] = AI;

          let score;

          if(
            modeSelect.value ===
            "minimax"
          ){

            score =
            minimax(
              board,
              0,
              false
            );

          }else{

            score =
            alphaBeta(
              board,
              0,
              -Infinity,
              Infinity,
              false
            );

          }

          board[i] = "";

          if(score > bestScore){

            bestScore = score;

            move = i;

          }

        }

      }

    }

    board[move] = AI;

    nodesText.innerText =
    nodesEvaluated;

    statusText.classList.remove(
      "thinking"
    );

    let aiWin =
    checkWinner(board,AI);

    createBoard(aiWin || []);

    if(aiWin){

      statusText.innerText =
      "🤖 AI Menang!";

      gameOver = true;

      return;
    }

    if(isDraw()){

      statusText.innerText =
      "😮 Game Seri!";

      gameOver = true;

      return;
    }

    statusText.innerText =
    "🎯 Giliran Player X";

  },1000);

}

function minimax(
  board,
  depth,
  isMaximizing
){

  nodesEvaluated++;

  const maxDepth =
  parseInt(depthInput.value);

  if(
    checkWinner(board,AI)
  ){
    return 10 - depth;
  }

  if(
    checkWinner(board,HUMAN)
  ){
    return depth - 10;
  }

  if(isDraw()){
    return 0;
  }

  if(depth >= maxDepth){
    return 0;
  }

  if(isMaximizing){

    let bestScore = -Infinity;

    for(let i=0;i<9;i++){

      if(board[i] === ""){

        board[i] = AI;

        let score =
        minimax(
          board,
          depth + 1,
          false
        );

        board[i] = "";

        bestScore =
        Math.max(
          score,
          bestScore
        );

      }

    }

    return bestScore;

  }else{

    let bestScore = Infinity;

    for(let i=0;i<9;i++){

      if(board[i] === ""){

        board[i] = HUMAN;

        let score =
        minimax(
          board,
          depth + 1,
          true
        );

        board[i] = "";

        bestScore =
        Math.min(
          score,
          bestScore
        );

      }

    }

    return bestScore;

  }

}

function alphaBeta(
  board,
  depth,
  alpha,
  beta,
  isMaximizing
){

  nodesEvaluated++;

  const maxDepth =
  parseInt(depthInput.value);

  if(
    checkWinner(board,AI)
  ){
    return 10 - depth;
  }

  if(
    checkWinner(board,HUMAN)
  ){
    return depth - 10;
  }

  if(isDraw()){
    return 0;
  }

  if(depth >= maxDepth){
    return 0;
  }

  if(isMaximizing){

    let bestScore = -Infinity;

    for(let i=0;i<9;i++){

      if(board[i] === ""){

        board[i] = AI;

        let score =
        alphaBeta(
          board,
          depth + 1,
          alpha,
          beta,
          false
        );

        board[i] = "";

        bestScore =
        Math.max(
          bestScore,
          score
        );

        alpha =
        Math.max(
          alpha,
          bestScore
        );

        if(beta <= alpha){
          break;
        }

      }

    }

    return bestScore;

  }else{

    let bestScore = Infinity;

    for(let i=0;i<9;i++){

      if(board[i] === ""){

        board[i] = HUMAN;

        let score =
        alphaBeta(
          board,
          depth + 1,
          alpha,
          beta,
          true
        );

        board[i] = "";

        bestScore =
        Math.min(
          bestScore,
          score
        );

        beta =
        Math.min(
          beta,
          bestScore
        );

        if(beta <= alpha){
          break;
        }

      }

    }

    return bestScore;

  }

}

function checkWinner(
  board,
  player
){

  const wins = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]

  ];

  for(let combination of wins){

    let win =
    combination.every(index=>{

      return (
        board[index] === player
      );

    });

    if(win){
      return combination;
    }

  }

  return null;

}

function isDraw(){

  return board.every(
    cell => cell !== ""
  );

}

function restartGame(){

  board = [
    "","","",
    "","","",
    "","",""
  ];

  gameOver = false;

  nodesEvaluated = 0;

  nodesText.innerText = "0";

  statusText.innerText =
  "🎯 Giliran Player X";

  createBoard();

}