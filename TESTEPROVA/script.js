let val = 0; 
let id; 
let isPaused = false; 
let flag = 0; 
let pontuacao = 0; 
let vidas = 3; 
let faseAtual = 1;
let intervaloAliens; 
let velocidadeAliens = 400; 
let pontuacaoInicialDaRodada = 0;

function add() {
    val++; 
    const hours = Math.floor(val / 3600); 
    const minutes = Math.floor((val % 3600) / 60); 
    const seconds = val % 60; 
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; 
    document.querySelector("#v").textContent = formattedTime; 
}

function startCounter() {
    id = setInterval(add, 1000); 
}

function stopCounter() {
    clearInterval(id); 
}

const nave = document.querySelector(".nave"); 
let positionPercent = 50; 

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
        togglePause(); 
        return;
    }

    if (isPaused) return; 

    const stepPercent = 2; 
    const naveWidthPercent = (nave.offsetWidth / window.innerWidth) * 100;

    if (event.key === "ArrowRight") {
        if (positionPercent + naveWidthPercent < 100) {
            positionPercent += stepPercent;
            if (positionPercent + naveWidthPercent > 100) {
                positionPercent = 100 - naveWidthPercent;
            }
        }
    } else if (event.key === "ArrowLeft") {
        if (positionPercent > 20) {
            positionPercent -= stepPercent;
            if (positionPercent < 0) positionPercent = 0;
        }
    }

    nave.style.transform = `translateX(${positionPercent - 50}vw)`;
});

function togglePause() {
    const pauseOverlay = document.querySelector("#pause-overlay"); 
    if (!isPaused) {
        stopCounter(); 
        isPaused = true; 
        pauseOverlay.style.display = "flex"; 
    } else {
        startCounter(); 
        isPaused = false; 
        pauseOverlay.style.display = "none"; 
    }
}

function youWin() {
    const pauseOverlay = document.querySelector("#win-overlay");
    pauseOverlay.style.display = "flex";
    isPaused = true;
    stopCounter(); 
}

function gameOver() {
    const pauseOverlay = document.querySelector("#over-overlay");
    pauseOverlay.style.display = "flex";
    isPaused = true;
    stopCounter(); 
}

function youLoose() {
    const pauseOverlay = document.querySelector("#loose-overlay");
    pauseOverlay.style.display = "flex";
    isPaused = true;
    stopCounter(); 

    setTimeout(() => {
        pauseOverlay.style.display = "none";
        isPaused = false;
        startCounter(); 
    }, 2000);
}

function atirar(tecla) {
    if (isPaused) return; 
    const naveRect = nave.getBoundingClientRect(); 
    const naveCenter = naveRect.left + naveRect.width / 2; 
    const deslocamento = 30; 
    let missil; 
    if (tecla === "a") {
        missil = document.getElementById("missil1"); 
    } else if (tecla === "d") {
        missil = document.getElementById("missil2"); 
    }
    if (!missil) return; 
    missil.style.left = `${naveCenter + (tecla === "a" ? -deslocamento : deslocamento) - missil.offsetWidth / 2}px`; 
    missil.style.transition = "none"; 
    missil.style.transform = "translateY(0)"; 
    missil.style.opacity = "1"; 
    void missil.offsetWidth; 
    missil.style.transition = "transform 0.4s linear, opacity 0.2s ease-out"; 
    missil.style.transform = "translateY(-600px)"; 
    const intervaloColisao = setInterval(() => {
        detectarColisao(missil); 
    }, 50);
    setTimeout(() => {
        missil.style.opacity = "0"; 
        clearInterval(intervaloColisao); 
    }, 400); 
}

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "a") {
        atirar("a"); 
    } else if (event.key.toLowerCase() === "d") {
        atirar("d"); 
    }
});

function criarAliens() {
    const container = document.getElementById("alien-container"); 
    const rows = 1; 
    const cols = 3; 
    const spacingX = 200; 
    const spacingY = 150; 
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const alien = document.createElement("img"); 
            alien.src = "alien.png"; 
            alien.classList.add("alien"); 
            alien.style.left = `${j * spacingX + 150}px`; 
            alien.style.top = `${i * spacingY - 70}px`; 
            container.appendChild(alien); 
        }
    }
}

function detectarColisao(missil) {
    const missilRect = missil.getBoundingClientRect(); 
    const aliens = document.querySelectorAll(".alien"); 
    aliens.forEach((alien) => {
        const alienRect = alien.getBoundingClientRect(); 
        const colidiu =
            missilRect.left < alienRect.right &&
            missilRect.right > alienRect.left &&
            missilRect.top < alienRect.bottom &&
            missilRect.bottom > alienRect.top; 
        if (colidiu) {
            alien.remove(); 
            missil.style.transition = "none"; 
            missil.style.opacity = "0"; 
            missil.style.transform = "translateY(0)"; 

            pontuacao += 1; 

            document.getElementById("pontuacao").textContent = pontuacao; 

            if (pontuacao === 3 || pontuacao === 6 || pontuacao === 9) {
                proximaFase();
            }

            if (pontuacao === 12 ) {
               youWin(); 
            }
        }
    });
}

function moverAliensParaBaixo() {
    if (isPaused) return; 
    const aliens = document.querySelectorAll(".alien"); 
    const naveRect = nave.getBoundingClientRect(); 
    aliens.forEach((alien) => {
        const topAtual = parseFloat(alien.style.top) || 0; 
        const novoTop = topAtual + 5; 
        alien.style.top = `${novoTop}px`; 
        const alienRect = alien.getBoundingClientRect(); 
        const colidiu = alienRect.bottom >= naveRect.top;

            if (colidiu) {
                vidas--;
                youLoose();
                pontuacao = pontuacaoInicialDaRodada;
                document.getElementById("pontuacao").textContent = pontuacao;
                atualizarPlacarDeVidas();
                if (vidas === 0) {
                    gameOver();
                } else {
                    reiniciarAliens(); 
                    pontuacaoInicialDaRodada = pontuacao; 
                }
            }
    });
}

function atualizarPlacarDeVidas() {
    document.getElementById("life").textContent = `LIFE:${vidas}`; 
}

window.onload = () => {
    startCounter(); 
    criarAliens(); 
    intervaloAliens = setInterval(moverAliensParaBaixo, velocidadeAliens);
    pontuacaoInicialDaRodada = pontuacao; 
};

function proximaFase() {
    faseAtual++;
    document.body.style.backgroundImage = `url('background${faseAtual}.jpg')`;
    velocidadeAliens -= 100;
    clearInterval(intervaloAliens);
    intervaloAliens = setInterval(moverAliensParaBaixo, velocidadeAliens);
    reiniciarAliens();
    pontuacaoInicialDaRodada = pontuacao; 
}

function reiniciarAliens() {
    const container = document.getElementById("alien-container");
    const aliensAntigos = container.querySelectorAll(".alien");
    aliensAntigos.forEach(alien => alien.remove());
    criarAliens();
    pontuacaoInicialDaRodada = pontuacao; 
}
