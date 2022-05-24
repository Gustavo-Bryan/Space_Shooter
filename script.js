//Variáveis
const yourShip = document.querySelector(".player-shooter");
const playArea = document.querySelector("#main-play-area");
let info = document.querySelector(".niveis");
const startButton = document.querySelector(".start-button");
let score = document.getElementById("score");
let endScore = document.getElementById("endScore");
let end = document.querySelector(".end");
let frase = document.getElementById("frase");
let arrow = document.querySelector(".arrow");
let contInicial = document.querySelector(".container-inicio");
let again = document.querySelector(".again");
let lasers = document.querySelectorAll(".laser");
const aliensImg = [
  "./img/monster-1.png",
  "./img/monster-2.png",
  "./img/monster-3.png",
];
let alienPosition = [
  0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600,
];

arrow.addEventListener("click", () => {
  contInicial.style.display = "none";
  info.style.display = "block";
});

//movimento e tiro da nave
function flyShip(event) {
  if (event.key === "w") {
    event.preventDefault();
    moveUp();
  } else if (event.key === "s") {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    fireLaser();
  }
}

//função de subir
function moveUp() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
  if (topPosition === "0px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
  }
}

//função de descer
function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
  if (topPosition >= "650px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 50;
    yourShip.style.top = `${position}px`;
  }
}

//funcionalidade de tiro
function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

//Criar Laser
function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(yourShip).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(yourShip).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "./img/shoot.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xPosition + 20}px`;
  newLaser.style.top = `${yPosition - 60}px`;
  return newLaser;
}

//Movimentação do Laser
function moveLaser(laser) {
  setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll(".alien");

    aliens.forEach((alien) => {
      //comparando se cada alien foi atingido, se sim, troca o src da imagem
      if (checkLaserCollision(laser, alien)) {
        alien.src = "./img/explosion.png";
        alien.classList.remove("alien");
        alien.classList.add("dead-alien");
        score.innerText++;
      }
    });

    if (xPosition >= 600) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
  let newAlien = document.createElement("img");
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
  newAlien.src = alienSprite;
  newAlien.classList.add("alien", "alien-transition");
  newAlien.style.left = "650px";
  newAlien.style.top = `${
    alienPosition[Math.floor(Math.random() * alienPosition.length)]
  }px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
  setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue("left")
    );
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}

//função para  colisão
function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;
  if (
    laserLeft < 600 &&
    laserLeft >= alienLeft - 40 &&
    laserTop <= alienTop &&
    laserTop >= alienBottom
  ) {
    laser.remove();
    return true;
  } else {
    return false;
  }
}

//inicio do jogo
let scoreDiv = document.querySelector(".scoreDiv");
startButton.addEventListener("click", (event) => {
  playGame();
});

function playGame() {
  yourShip.style.display = "block";
  scoreDiv.classList.add("ativo");
  window.addEventListener("keydown", flyShip);
  info.style.display = "none";
}

//Verifica nivel de dificuldade escolhida
function dificuldade() {
  let niveis = document.querySelectorAll("li");
  niveis.forEach((item) => {
    //para cada opção, ativa a função de verificar
    item.addEventListener("click", verifica);
  });
  function verifica() {
    //retorna qual opção a pessoa escolheu e define o nivel de velocidade para surgir os aliens
    nivel = this.innerText;
    if (nivel == "Fácil") {
      //nivel fácil
      alienInterval = setInterval(() => {
        createAliens();
      }, 2500);
    } else if (nivel == "Médio") {
      //nivel médio
      alienInterval = setInterval(() => {
        createAliens();
      }, 2000);
    } else if (nivel == "Dificil") {
      //nivel dificil
      alienInterval = setInterval(() => {
        createAliens();
      }, 1500);
    }
  }
}
dificuldade();

//função de game over
function gameOver() {
  scoreDiv.classList.remove("ativo");
  window.removeEventListener("keydown", flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll(".alien");
  aliens.forEach((alien) => alien.remove());

  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    end.classList.add("ativo");
    endScore.innerText = `Você destruiu: ${score.innerText} naves!`;
    score.innerText = "0";

    //Analisa a pontuação do Player e retorna uma frase
    if (score.innerText <= 5) {
      frase.innerText = `Você não foi tão bem, treine mais!`;
    } else if (score.innerText <= 10) {
      frase.innerText = `Você está começando a pegar o jeito, mas ainda falta treino!`;
    } else if (score.innerText <= 20) {
      frase.innerText = `Você está no caminho certo para se tornar um lendário guerreiro espacial!`;
    } else if (score.innerText <= 40) {
      frase.innerText = `Wow! Você superou todas as expectativas, sendo digno de ser chamado Mestre Espacial!!`;
    } else if (score.innerText >= 60) {
      frase.innerText = `Você é demais!! Seu nome será escrito no livro dos Lendários Guerreiros Espaciais! Parabéns!`;
    }
  });
}

again.addEventListener("click", () => {
  end.classList.remove("ativo");
  info.style.display = "block";
});
