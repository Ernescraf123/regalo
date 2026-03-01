let paginaActual = 1;
let animandoCambio = false;

function iniciarMusica() {
    const audio = document.getElementById('bg-music');
    if (!audio) return;

    audio.volume = 0.5;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Algunos navegadores bloquean autoplay sin interacción.
        });
    }
}

function fijarAlturaAlbum() {
    const album = document.getElementById('album');
    const pages = document.querySelectorAll('.book-page');
    if (!album || pages.length === 0) return;

    let maxAltura = 0;

    pages.forEach((p) => {
        const prevDisplay = p.style.display;
        const prevVisibility = p.style.visibility;

        p.style.display = 'block';
        p.style.visibility = 'hidden';
        maxAltura = Math.max(maxAltura, p.offsetHeight);

        p.style.display = prevDisplay;
        p.style.visibility = prevVisibility;
    });

    if (maxAltura > 0) {
        album.style.minHeight = `${maxAltura + 32}px`;
    }
}

function verificarPassword() {
    const pass = document.getElementById('password').value;

    // Cambia "17092025" por la fecha o clave que quieras
    if (pass === "17092025") {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('album').style.display = 'block';
        iniciarMusica();
        paginaActual = 1;

        const pages = document.querySelectorAll('.book-page');
        pages.forEach((p, i) => {
            p.style.display = i === 0 ? 'block' : 'none';
            p.classList.remove(
                'page-exit-next',
                'page-enter-next',
                'page-exit-prev',
                'page-enter-prev',
                'page-animating'
            );
        });

        fijarAlturaAlbum();
    } else {
        alert("¡Clave incorrecta! Intenta de nuevo.");
    }
}

function cambiarPagina(n) {
    if (animandoCambio || n === paginaActual) return;

    const album = document.getElementById('album');
    const paginaOrigen = document.getElementById('page' + paginaActual);
    const paginaDestino = document.getElementById('page' + n);
    if (!album || !paginaOrigen || !paginaDestino) return;

    animandoCambio = true;
    const haciaAdelante = n > paginaActual;
    album.classList.remove('flip-next', 'flip-prev');
    album.classList.add(haciaAdelante ? 'flip-next' : 'flip-prev');

    paginaDestino.style.display = 'block';
    paginaOrigen.classList.add('page-animating');
    paginaDestino.classList.add('page-animating');

    paginaOrigen.classList.add(haciaAdelante ? 'page-exit-next' : 'page-exit-prev');
    paginaDestino.classList.add(haciaAdelante ? 'page-enter-next' : 'page-enter-prev');

    const limpiar = () => {
        paginaOrigen.style.display = 'none';
        paginaOrigen.classList.remove('page-exit-next', 'page-exit-prev', 'page-animating');
        paginaDestino.classList.remove('page-enter-next', 'page-enter-prev', 'page-animating');
        album.classList.remove('flip-next', 'flip-prev');
        paginaActual = n;
        animandoCambio = false;
    };

    paginaDestino.addEventListener('animationend', limpiar, { once: true });
}

window.addEventListener('resize', () => {
    const album = document.getElementById('album');
    if (album && album.style.display !== 'none') {
        fijarAlturaAlbum();
    }
});
