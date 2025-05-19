function unlockLevel(levelUnlocked) {
  document.getElementById(`triggerBlock${levelUnlocked}`).style.display = "flex";
  document.getElementById('container').style.backgroundImage = `url("./graphics/menu${levelUnlocked}.png")`;
}