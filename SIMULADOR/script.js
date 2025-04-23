const elementosSimulados = document.querySelectorAll('.elementos-simulados'); 
const container = document.querySelector('main');

let ultimaCor = '';


document.querySelectorAll('th').forEach((th) => { 
    
    th.addEventListener('click', () => { 
        
        const cor = getComputedStyle(th).backgroundColor; 
        
        ultimaCor = cor; 
        elementosSimulados.forEach(el => el.style.backgroundColor = cor); 
        document.querySelectorAll('.formato1, .formato2').forEach(el => {
            el.style.backgroundColor = cor;
        });
    });
});

function inputSize() {
    const inputBox = document.querySelector("#size-options"); 
    const tamanho = inputBox.value + 'px'; 

    elementosSimulados.forEach(el => { 
        el.style.width = tamanho; 
        el.style.height = tamanho; 
    });
}

document.querySelectorAll('th').forEach((th) => {
    th.addEventListener('click', () => {

        elementosSimulados.forEach(el => {
            if (th.classList.contains('formato2')) {
                el.classList.remove('formato1');
                el.classList.add('formato2');
            } else if (th.classList.contains('formato1')) {
                el.classList.remove('formato2');
                el.classList.add('formato1');
            }
        });
    });
});

document.getElementById('flex-direction').addEventListener('change', (event) => {
    container.style.flexDirection = event.target.value;
  });
  
  document.getElementById('justify-content').addEventListener('change', (event) => {
    container.style.justifyContent = event.target.value;
  });
  
  document.getElementById('align-items').addEventListener('change', (event) => {
    container.style.alignItems = event.target.value;
  });

