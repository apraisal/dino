const startOptContainer = document.getElementById('startOptCointainer');
const mainpage = document.getElementById('mainpage');
const PlayerChoiceContainer = document.getElementById('PlayerChoiceContainer');
const gameoverContainer = document.querySelector('.gameover'); 
const scorePlayer = document.querySelectorAll('#score');
let pointsArray = [0,0,0,0];
let playerChoice=0;
let playerAmount=0;

function buttonpageplay() {
  if (playerChoice==0){
    PlayerChoiceContainer.style.display="flex";
    startOptContainer.style.display="none";
    playerChoice=1;
  }
  else {
    mainpage.style.display="flex";
    startOptContainer.style.display="none";
  }
}

function buttonpagepause() {
  gameoverContainer.style.display="none";
  mainpage.style.display="none";
  startOptContainer.style.display="flex";
  scoreCounter();
}

let buttons = document.querySelectorAll(".playerButton");
buttons.forEach((button) => {
  let i = 1;
  button.addEventListener("click", () =>{
    playerAmount = parseInt(button.value);
    playerchoicepause(playerAmount);
  });
  i++;
});

function playerchoicepause(numPlayers){
  for (let i = 1; i <= numPlayers; i++) {
    document.getElementById(`player${i}stats`).style.display='block';
  }
  PlayerChoiceContainer.style.display="none";
  mainpage.style.display="flex";
  scoreCounter();
}

function scoreCounter(){  
  scorePlayer.forEach((score, index) => {
    if(pointsArray[index]){
      scorePlayer[index].innerText = `Total Score: ${pointsArray[index]}`;
    }
  });
}

function buttonpagestartSettings(){
  startOptContainer.style.display="none";
  settingsCointainer.style.display="flex";
}

function backToStartSettings(){
  settingsCointainer.style.display="none";
  startOptContainer.style.display="flex";
}

function buttonpageautor(){
  startOptContainer.style.display="none";
  authorsCointainer.style.display="flex";
}

function backToStartSettingsfromAuthors(){
  authorsCointainer.style.display="none";
  startOptContainer.style.display="flex";
}

function gameReset(){
  document.getElementById("gameover").style.display="none";
  startOptContainer.style.display="flex";
}
function hallToMenu(){
  document.getElementById("mainpage").style.display="none";
    startOptContainer.style.display="flex";
}
gameoverContainer.style.display="none";

