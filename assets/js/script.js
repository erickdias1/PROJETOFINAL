const inputCheck = document.querySelector('#modo-noturno');
const elemento = document.querySelector('body');

inputCheck.addEventListener('click', () => {
    const modo = inputCheck.checked ? 'dark' : 'light';
    elemento.setAttribute("data-bs-theme", modo);

    // Seleciona a imagem do logo dentro da navbar
    const logo = document.querySelector('.navbar-brand img');

    // Altera o atributo src da imagem do logo com base no modo
    if (modo === 'dark') {
        logo.src = './assets/img/logo-dark.webp';
    } else {
        logo.src = './assets/img/logo.webp';
    }
});

