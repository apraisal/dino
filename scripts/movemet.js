
    const movableObject = document.getElementById('movableObject');


    const triggerBlocks = [
      document.getElementById('triggerBlock1'),
      document.getElementById('triggerBlock2'),
      document.getElementById('triggerBlock3'),
      document.getElementById('triggerBlock4'),
      document.getElementById('triggerBlock5'),
      document.getElementById('triggerBlock6'),
    ];


    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const messageContainer = document.getElementById('messageContainer');
    const messageText = document.getElementById('messageText');
    const dismissMessageBtn = document.getElementById('dismissMessageBtn');
    const hrefBtn = document.getElementById('gotolevel');

    const containerWidth = 900;
    const containerHeight = 430;
    const objectWidth = 50;
    const objectHeight = 50;

    let posX = 450; 
    let posY = 300; 
    let moving = false; 
    let interval = null; 
    let isMoving = true; 
    let lastDirection = null;
    let currentMessage = ""; 
    let level = 0;



    function updatePosition() {
      movableObject.style.left = `${posX}px`;
      movableObject.style.top = `${posY}px`;
    }


    function isWithinBounds(newPosX, newPosY) {
      return newPosX >= 0 && newPosX <= containerWidth - objectWidth &&
             newPosY >= 170 && newPosY <= containerHeight - objectHeight;
    }

    function move(direction) {
      let newPosX = posX;
      let newPosY = posY;

      if (direction === 'up') {
        newPosY -= 5; 
      } else if (direction === 'down') {
        newPosY += 5; 
      } else if (direction === 'left') {
        newPosX -= 5;
      } else if (direction === 'right') {
        newPosX += 5; 
      }


      if (isWithinBounds(newPosX, newPosY)) {
        posX = newPosX;
        posY = newPosY;
        updatePosition();
      }

      checkCollision();
    }


    function startMove(direction) {
      if (isMoving) {
        lastDirection = direction;
        interval = setInterval(() => {
          move(direction);
        }, 20); 
      }
    }

   
    function stopMove() {
      clearInterval(interval);
    }


    function checkCollision() {
      const objRect = movableObject.getBoundingClientRect();

      for (let i = 0; i < triggerBlocks.length; i++) {
        const triggerRect = triggerBlocks[i].getBoundingClientRect();
        if (
          objRect.left < triggerRect.right &&
          objRect.right > triggerRect.left &&
          objRect.top < triggerRect.bottom &&
          objRect.bottom > triggerRect.top
        ) {

          isMoving = false;
          stopMove();

          currentMessage = `do you want do go to level  ${i + 1}!`;
          level = i + 1;
                    messageText.textContent = currentMessage;


          messageContainer.style.display = 'block';
          break;
        }
      }
    }


    upBtn.addEventListener('mousedown', () => startMove('up'));
    upBtn.addEventListener('mouseup', stopMove);
    upBtn.addEventListener('mouseleave', stopMove);

    downBtn.addEventListener('mousedown', () => startMove('down'));
    downBtn.addEventListener('mouseup', stopMove);
    downBtn.addEventListener('mouseleave', stopMove);

    leftBtn.addEventListener('mousedown', () => startMove('left'));
    leftBtn.addEventListener('mouseup', stopMove);
    leftBtn.addEventListener('mouseleave', stopMove);

    rightBtn.addEventListener('mousedown', () => startMove('right'));
    rightBtn.addEventListener('mouseup', stopMove);
    rightBtn.addEventListener('mouseleave', stopMove);

    hrefBtn.addEventListener('click', () => {
      messageContainer.style.display = 'none';
      mainpage.style.display="none";
      const DINOgameport = document.getElementById("dino");
      console.log(DINOgameport);
      DINOgameport.style.display="flex";
      nameGenerator();
      StartGame();
    }
    )

    dismissMessageBtn.addEventListener('click', () => {

      messageContainer.style.display = 'none';


      if (lastDirection === 'up') {
        posY += 5;
      } else if (lastDirection === 'down') {
        posY -= 5; 
      } else if (lastDirection === 'left') {
        posX += 5; 
      } else if (lastDirection === 'right') {
        posX -= 5; 
      }

 
      updatePosition();

  
      isMoving = true;
    });