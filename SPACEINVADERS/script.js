// ==========================
// VARIÁVEIS GLOBAIS
// ==========================

let val = 0; // Armazena o tempo em segundos desde o início do jogo
let id; // Identificador do intervalo de tempo (para pausar/continuar)
let isPaused = false; // Controla se o jogo está pausado ou não
let flag = 0; // Variável reserva (pode ser usada para alternância de mísseis)
let pontuacao = 0; // Armazena a pontuação atual do jogador

// ==========================
// FUNÇÃO PARA CONTAGEM DO TEMPO
// ==========================

function add() {
    val++; // Incrementa o contador de tempo em 1 segundo

    const hours = Math.floor(val / 3600); // Converte segundos em horas
    const minutes = Math.floor((val % 3600) / 60); // Calcula os minutos restantes
    const seconds = val % 60; // Calcula os segundos restantes

    // Formata o tempo como hh:mm:ss com dois dígitos
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Atualiza o conteúdo do elemento com id="v" com o tempo formatado
    document.querySelector("#v").textContent = formattedTime;
}

// ==========================
// CONTROLE DO CONTADOR
// ==========================

function startCounter() {
    id = setInterval(add, 1000); // Executa a função add() a cada 1000ms (1 segundo)
}

function stopCounter() {
    clearInterval(id); // Cancela o intervalo, pausando o contador
}

// ==========================
// CONTROLE DA NAVE
// ==========================

const nave = document.querySelector(".nave"); // Seleciona o elemento da nave
let position = 0; // Define a posição horizontal inicial da nave

// Evento de teclado para controlar a nave e a pausa
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
        togglePause(); // Pausa ou retoma o jogo ao pressionar "p"
        return; // Evita que outras teclas sejam processadas
    }

    if (isPaused) return; // Se estiver pausado, não movimenta a nave

    const step = 10; // Quantidade de pixels que a nave se move por vez
    const containerWidth = window.innerWidth; // Largura da janela
    const naveWidth = nave.offsetWidth; // Largura da nave

    if (event.key === "ArrowRight") {
        position += step; // Move a nave para a direita
        nave.style.transform = `translateX(${position}px)`; // Aplica a posição com CSS
    } else if (event.key === "ArrowLeft") {
        position -= step; // Move a nave para a esquerda
        nave.style.transform = `translateX(${position}px)`; // Aplica a posição com CSS
    }
});

// ==========================
// FUNÇÃO DE PAUSA/RETOMADA
// ==========================

function togglePause() {
    const pauseOverlay = document.querySelector("#pause-overlay"); // Seleciona a tela de pausa

    if (!isPaused) {
        stopCounter(); // Pausa o contador de tempo
        isPaused = true; // Marca o jogo como pausado
        pauseOverlay.style.display = "flex"; // Exibe a tela de pausa
    } else {
        startCounter(); // Retoma o contador de tempo
        isPaused = false; // Marca o jogo como ativo
        pauseOverlay.style.display = "none"; // Esconde a tela de pausa
    }
}

// ==========================
// FUNÇÃO DE DISPARO
// ==========================

function atirar() {
    if (isPaused) return; // Não atira se o jogo estiver pausado

    const naveRect = nave.getBoundingClientRect(); // Pega posição e dimensões da nave
    const naveCenter = naveRect.left + naveRect.width / 2; // Calcula o centro da nave
    const deslocamento = 30; // Deslocamento lateral entre os mísseis

    const missil1 = document.getElementById("missil1"); // Seleciona o primeiro míssil
    const missil2 = document.getElementById("missil2"); // Seleciona o segundo míssil

    [missil1, missil2].forEach((missil, index) => {
        const offset = (index === 0 ? -deslocamento : deslocamento); // Define o deslocamento lateral

        // Posiciona o míssil horizontalmente, baseado no centro da nave
        missil.style.left = `${naveCenter + offset - missil.offsetWidth / 2}px`;

        missil.style.transition = "none"; // Remove qualquer transição anterior
        missil.style.transform = "translateY(0)"; // Coloca o míssil na posição de partida (embaixo)
        missil.style.opacity = "1"; // Torna o míssil visível

        void missil.offsetWidth; // Força o navegador a aplicar as mudanças antes da animação

        // Define a animação de subida do míssil
        missil.style.transition = "transform 0.4s linear, opacity 0.2s ease-out";
        missil.style.transform = "translateY(-600px)"; // Move o míssil para cima

        const intervaloColisao = setInterval(() => {
            detectarColisao(missil); // Verifica colisão durante o voo
        }, 50);

        setTimeout(() => {
            missil.style.opacity = "0"; // Torna o míssil invisível
            missil.style.transform = "translateY(0)"; // Volta o míssil para posição inicial
            clearInterval(intervaloColisao); // Para a verificação de colisão
        }, 400); // Após 400ms, reinicia o míssil
    });
}

// ==========================
// ATIRAR COM A TECLA ESPAÇO
// ==========================

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        atirar(); // Dispara mísseis ao pressionar espaço
    }
});

// ==========================
// CRIAÇÃO DOS ALIENS INIMIGOS
// ==========================

function criarAliens() {
    const container = document.getElementById("alien-container"); // Container onde os aliens serão adicionados

    const rows = 3; // Número de linhas de aliens
    const cols = 8; // Número de colunas de aliens
    const spacingX = 80; // Espaçamento horizontal entre os aliens
    const spacingY = 80; // Espaçamento vertical entre os aliens

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const alien = document.createElement("img"); // Cria um novo elemento de imagem
            alien.src = "alien.png"; // Define o caminho da imagem do alien
            alien.classList.add("alien"); // Adiciona a classe para estilização via CSS
            alien.style.left = `${j * spacingX + 150}px`; // Define a posição horizontal do alien
            alien.style.top = `${i * spacingY + 20}px`; // Define a posição vertical do alien
            container.appendChild(alien); // Adiciona o alien no container
        }
    }
}

// ==========================
// INICIALIZAÇÃO DO JOGO
// ==========================

window.onload = () => {
    startCounter(); // Inicia o contador de tempo assim que a página carrega
    criarAliens(); // Cria os aliens na tela
};

// ==========================
// DETECÇÃO DE COLISÕES
// ==========================

function detectarColisao(missil) {
    const missilRect = missil.getBoundingClientRect(); // Pega as dimensões e posição atual do míssil
    const aliens = document.querySelectorAll(".alien"); // Seleciona todos os aliens existentes na tela

    aliens.forEach((alien) => {
        const alienRect = alien.getBoundingClientRect(); // Pega a posição do alien

        // Verifica se houve sobreposição (colisão) entre o míssil e o alien
        const colidiu =
            missilRect.left < alienRect.right &&
            missilRect.right > alienRect.left &&
            missilRect.top < alienRect.bottom &&
            missilRect.bottom > alienRect.top;

        if (colidiu) {
            alien.remove(); // Remove o alien atingido
            pontuacao += 1; // Incrementa a pontuação
            document.getElementById("pontuacao").textContent = pontuacao; // Atualiza a pontuação na interface
        }
    });
}
