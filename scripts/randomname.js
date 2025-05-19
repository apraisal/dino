function biggerwhenclick(buttonId){
    let button = document.getElementById(buttonId);
    button.style.transform = "scale(1.2)";
}

function smallerafterclick(buttonId){
    let button = document.getElementById(buttonId);
    button.style.transform = "scale(1)";
}

 
const words = [
    "GreeN", "JoHn", "Walter",
    "FasT", "Magnificent", "Amazing", "Perry_The", 
    "Big", "I_like", "Italian", "Jamaican",
    "Deep_Boiled", "Slow"
];

const words2 = [
     "Princess", "Fried_Chiken", "Batman", "Platpous",
     "Fortnite", "Watermelon", "Spiderman", "refrigerator",
     "Twingo", "Skib"
];
document.getElementById("word1").textContent="No Name Selected";
document.getElementById("word2").textContent="No Name Selected";
document.getElementById("word3").textContent="No Name Selected";
document.getElementById("word4").textContent="No Name Selected";

function generateWord1() {
  const randomIndex = Math.floor(Math.random() * words.length); const randomIndex2 = Math.floor(Math.random() * words2.length);
    document.getElementById("word1").textContent = words[randomIndex]+"_"+words2[randomIndex2];
}
function generateWord2() {
    const randomIndex = Math.floor(Math.random() * words.length); const randomIndex2 = Math.floor(Math.random() * words2.length);
      document.getElementById("word2").textContent = words[randomIndex]+"_"+words2[randomIndex2];
  }
  function generateWord3() {
    const randomIndex = Math.floor(Math.random() * words.length); const randomIndex2 = Math.floor(Math.random() * words2.length);
      document.getElementById("word3").textContent = words[randomIndex]+"_"+words2[randomIndex2];
  }
  function generateWord4() {
    const randomIndex = Math.floor(Math.random() * words.length); const randomIndex2 = Math.floor(Math.random() * words2.length);
      document.getElementById("word4").textContent = words[randomIndex]+"_"+words2[randomIndex2];
  }