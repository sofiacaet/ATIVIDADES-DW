// ------------------------------
// Variáveis Globais
// ------------------------------
let val = 0; // Armazena o tempo em segundos desde o início do jogo
let id; // Identificador do setInterval do cronômetro (usado para pausar)
let isPaused = false; // Indica se o jogo está pausado
let flag = 0; // Variável de controle (reserva, pode ser usada depois)
let pontuacao = 0; // Contador de pontuação do jogador
let vidas = 3; // Número inicial de vidas do jogador
let direcao = 1; // Direção atual dos aliens: 1 = direita, -1 = esquerda
let descidaPendente = false; // Indica se os aliens devem descer (usada na movimentação)

// ------------------------------
// Funções de Cronômetro
// ------------------------------
function add() {
    val++; // Incrementa o tempo (1 segundo)
    const hours = Math.floor(val / 3600); // Converte para horas
    const minutes = Math.floor((val % 3600) / 60); // Minutos restantes
    const seconds = val % 60; // Segundos restantes

    // Formata no padrão HH:MM:SS com dois dígitos
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Atualiza o elemento com ID "v" na tela
    document.querySelector("#v").textContent = formattedTime;
}

function startCounter() {
    id = setInterval(add, 1000); // Chama add() a cada 1 segundo
}

function stopCounter() {
    clearInterval(id); // Pausa o cronômetro
}

// ------------------------------
// Movimento da Nave
// ------------------------------
const nave = document.querySelector(".nave"); // Seleciona a nave
let position = 0; // Posição horizontal da nave

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
        togglePause(); // Alterna pausa ao pressionar "p"
        return;
    }

    if (isPaused) return; // Se pausado, não move a nave

    const step = 10; // Quantidade de movimento por tecla
    const containerWidth = window.innerWidth;
    const naveWidth = nave.offsetWidth;

    if (event.key === "ArrowRight") {
        position += step; // Move para a direita
        nave.style.transform = `translateX(${position}px)`;
    } else if (event.key === "ArrowLeft") {
        position -= step; // Move para a esquerda
        nave.style.transform = `translateX(${position}px)`;
    }
});

// ------------------------------
// Alternar Pausa
// ------------------------------
function togglePause() {
    const pauseOverlay = document.querySelector("#pause-overlay"); // Tela de pausa

    if (!isPaused) {
        stopCounter(); // Pausa tempo
        isPaused = true;
        pauseOverlay.style.display = "flex"; // Mostra overlay
    } else {
        startCounter(); // Continua tempo
        isPaused = false;
        pauseOverlay.style.display = "none"; // Esconde overlay
    }
}

// ------------------------------
// Função de Tiro
// ------------------------------
function atirar(tecla) {
    if (isPaused) return;

    const naveRect = nave.getBoundingClientRect(); // Posição atual da nave
    const naveCenter = naveRect.left + naveRect.width / 2; // Centro horizontal da nave
    const deslocamento = 30; // Distância do centro até cada míssil
    let missil;

    // Seleciona qual míssil usar baseado na tecla
    if (tecla === "a") {
        missil = document.getElementById("missil1");
    } else if (tecla === "d") {
        missil = document.getElementById("missil2");
    }

    if (!missil) return;

    // Posiciona o míssil e aplica animações
    missil.style.left = `${naveCenter + (tecla === "a" ? -deslocamento : deslocamento) - missil.offsetWidth / 2}px`;
    missil.style.transition = "none";
    missil.style.transform = "translateY(0)";
    missil.style.opacity = "1";
    void missil.offsetWidth; // Força o navegador a aplicar mudanças antes da animação

    // Aplica animação de subida
    missil.style.transition = "transform 0.4s linear, opacity 0.2s ease-out";
    missil.style.transform = "translateY(-600px)";

    // Verifica colisão durante o trajeto
    const intervaloColisao = setInterval(() => {
        detectarColisao(missil);
    }, 50);

    // Após 400ms, o míssil desaparece e volta para a posição inicial
    setTimeout(() => {
        missil.style.opacity = "0";
        missil.style.transform = "translateY(0)";
        clearInterval(intervaloColisao);
    }, 400);
}

// Dispara os mísseis com as teclas A e D
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "a") {
        atirar("a");
    } else if (event.key.toLowerCase() === "d") {
        atirar("d");
    }
});

// ------------------------------
// Criar Aliens
// ------------------------------
function criarAliens() {
    const container = document.getElementById("alien-container"); // Área dos aliens
    const rows = 3;
    const cols = 8;
    const spacingX = 80;
    const spacingY = 80;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const alien = document.createElement("img");
            alien.src = "alien.png";
            alien.classList.add("alien");
            alien.style.left = `${j * spacingX + 150}px`; // Posição horizontal
            alien.style.top = `${i * spacingY + 20}px`; // Posição vertical
            container.appendChild(alien);
        }
    }
}

// ------------------------------
// Detectar Colisão
// ------------------------------
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
            alien.remove(); // Remove o alien atingido
            pontuacao += 1;
            document.getElementById("pontuacao").textContent = pontuacao; // Atualiza score
        }
    });
}

// ------------------------------
// Mover Aliens
// ------------------------------
function moverAliens() {
    if (isPaused) return;

    const aliens = document.querySelectorAll(".alien");
    let moveParaBaixo = false;

    // Verifica se algum alien tocou a borda
    aliens.forEach(alien => {
        const alienRect = alien.getBoundingClientRect();
        if ((direcao === 1 && alienRect.right >= window.innerWidth - 10) ||
            (direcao === -1 && alienRect.left <= 10)) {
            moveParaBaixo = true;
        }
    });

    // Move os aliens
    aliens.forEach(alien => {
        let leftAtual = parseFloat(alien.style.left) || 0;
        let topAtual = parseFloat(alien.style.top) || 0;

        if (moveParaBaixo) {
            alien.style.top = `${topAtual + 20}px`; // Desce os aliens
        } else {
            alien.style.left = `${leftAtual + (10 * direcao)}px`; // Move lateralmente
        }
    });

    if (moveParaBaixo) {
        direcao *= -1; // Inverte direção
    }
}

// ------------------------------
// Atualizar Vidas na Tela
// ------------------------------
function atualizarPlacarDeVidas() {
    document.getElementById("life").textContent = `LIFE:${vidas}`; // Mostra vidas
}

// ------------------------------
// Inicialização do Jogo
// ------------------------------
window.onload = () => {
    startCounter(); // Inicia o cronômetro
    criarAliens(); // Cria os inimigos
    setInterval(moverAliens, 500); // Move os aliens a cada 500ms
};
