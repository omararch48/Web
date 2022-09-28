const modulo = (() =>{
    'use strict'
    let   deck       = [];
    const tipos      = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];
    // Puntos
    let puntosJugadores = [];
    // Referencias HTML
    const marcadores = document.querySelectorAll('small');
    const btnNuevo   = document.querySelector('#btnNuevo');
    const btnPedir   = document.querySelector('#btnPedir');
    const btnDetener = document.querySelector('#btnDetener');
    const divCartas  = document.querySelectorAll('.divCartas');
    // Funciones
    const crearDeck = () => {
        deck = [];
        for(let i = 2; i <= 10 ; i++) {
            for(let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for(let especial of especiales) {
            for(let tipo of tipos) {
                deck.push(especial + tipo);
            }
        }
        return _.shuffle(deck); 
    }
    const pedirCarta = () => {
        if(deck.length === 0) {
            throw 'No hay cartas';
        }        
        return deck.pop();
    }
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (valor === 'A') ? 11 : ((isNaN(valor)) ? 10 : valor * 1 );
    }
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno]      += valorCarta(carta);
        marcadores[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }
    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src   = `./img/cards/${carta}.png`;
        imgCarta.classList.add('carta');            
        divCartas[turno].append(imgCarta);
    }
    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if(puntosComputadora === puntosMinimos) {
                alert("Empate");
            } else if(puntosMinimos > 21) {
                alert("Has perdido");
            } else if(puntosComputadora > 21) {
                alert("Ganaste");
            } else if(puntosComputadora > puntosMinimos) {
                alert("Has perdido");
            }
        }, 1000);
    }
    // Turno Computadora
    const turnoComputadora = (puntosMinimos) => { 
        let puntosComputadora = 0;
        do {
            const carta       =  pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        } while((puntosComputadora <= puntosMinimos) && (puntosMinimos <= 21));        
        determinarGanador();
        btnDetener.disabled = true;
    }
    // Eventos
    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });
    btnPedir.addEventListener('click', () => {
        const carta   =  pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);
        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;        
            turnoComputadora(puntosJugador);
        }
    });
    btnDetener.addEventListener('click', () => {
        turnoComputadora(puntosJugadores[0]);
        btnPedir.disabled = true;
        btnDetener.disabled = true;
    });
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        marcadores.forEach(elem => (elem.innerText = 0));
        divCartas.forEach(elem => (elem.innerText = ''));
        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }
    return {
        nuevoJuego: inicializarJuego
    };
})();