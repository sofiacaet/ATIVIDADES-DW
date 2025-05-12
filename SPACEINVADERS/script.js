let val = 0;
let id;
let isPaused = false; // Variável para controlar o estado do jogo

// FUNCTION: Atualiza o contador de tempo
function add() { 
    val++;
    const hours = Math.floor(val / 3600); // Calcula as horas
    const minutes = Math.floor((val % 3600) / 60); // Calcula os minutos
    const seconds = val % 60; // Calcula os segundos

    // Formata o tempo como hh:mm:ss
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.querySelector("#v").textContent = formattedTime;
}

// SET INTERVAL: Inicia o contador
function startCounter() {
    id = setInterval(add, 1000);
}

// CLEAR INTERVAL: Para o contador
function stopCounter() {
    clearInterval(id);
}

// MOVIMENTO DA NAVE
const nave = document.querySelector(".nave"); // Seleciona a nave
let position = 0; // Define a posição inicial da nave

// Adiciona um evento de teclado para mover a nave
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
        // Pausa o jogo ao pressionar a tecla P
        togglePause();
        return;
    }

    if (isPaused) return; // Não permite movimento se o jogo estiver pausado

    const step = 10; // Define o número de pixels que a nave se move a cada tecla pressionada
    const containerWidth = window.innerWidth; // Largura total da janela
    const naveWidth = nave.offsetWidth; // Largura da nave

    if (event.key === "ArrowRight") {
        // Move para a direita apenas se não atingir o limite direito
        position += step;
        nave.style.transform = `translateX(${position}px)`;
    } else if (event.key === "ArrowLeft") {
        // Move para a esquerda apenas se não atingir o limite esquerdo
        position -= step;
        nave.style.transform = `translateX(${position}px)`;
    }
});

// FUNÇÃO: Alterna entre pausar e retomar o jogo
function togglePause() {
    const pauseOverlay = document.querySelector("#pause-overlay");

    if (!isPaused) {
        // Pausa o jogo
        stopCounter();
        isPaused = true;
        pauseOverlay.style.display = "flex";
    } else {
        // Retoma o jogo
        startCounter();
        isPaused = false;
        pauseOverlay.style.display = "none";
    }
}

// Inicia o contador ao carregar a página
window.onload = startCounter;
