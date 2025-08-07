async function compartirPantalla() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });

    const video = document.querySelector("video");
    video.srcObject = stream;
  } catch (error) {
    console.error("No se pudo compartir la pantalla:", error);
  }
}

async function resetMazo() {
  try {
    // Enviar instrucción al backend para resetear el mazo
    const response = await fetch('http://127.0.0.1:8000/restart_deck_of_cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      const data = await response.json();
      // Actualizar interfaz con datos del backend
      // mostrarDatosAPI(data);
      actualizarZen(0);
      alert("Mazo reseteado - Datos actualizados");
    } else {
      alert("Error al resetear el mazo en el backend");
    }
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    alert("Error de conexión al resetear el mazo");
  }
}


// Función para actualizar la recomendación de un jugador específico
function actualizarRecomendacion(jugadorId, recomendacion) {
  // Remover clase active de todos los badges del jugador
  const playerCard = document.getElementById(`player-${jugadorId}`);
  if (!playerCard) return;
  
  const allBadges = playerCard.querySelectorAll('.rec-badge');
  allBadges.forEach(badge => {
    badge.classList.remove('active');
  });
  
  // Agregar clase active al badge correspondiente
  const targetBadge = playerCard.querySelector(`[data-action="${recomendacion.toLowerCase()}"]`);
  if (targetBadge) {
    targetBadge.classList.add('active');
  }
}

// Función para crear una tarjeta de jugador
function crearTarjetaJugador(jugador) {
  const playerCard = document.createElement('div');
  playerCard.className = 'player-card';
  playerCard.id = `player-${jugador.id}`;
  
  // Aplicar opacidad si está inactivo
  const opacityClass = jugador.estado === 'inactive' ? 'inactive-player' : '';
  
  playerCard.innerHTML = `
    <div class="player-header">
      <span class="player-name">${jugador.nombre}</span>
      <span class="player-status ${jugador.estado}">${jugador.estado}</span>
    </div>
    <div class="player-cards">
      <h3>Cartas:</h3>
      <div class="cards-display">
        ${jugador.cartas.length > 0 ? jugador.cartas.map(carta => `<span class="card">${carta}</span>`).join('') : '<span class="no-cards">Sin cartas</span>'}
      </div>
      <p class="total">Total: ${jugador.total}</p>
    </div>
    <div class="recommendation">
      <h3>Recomendación:</h3>
      <div class="recommendation-buttons">
        <span class="rec-badge rec-stand" data-action="stand" data-player="${jugador.id}">STAND</span>
        <span class="rec-badge rec-hit" data-action="hit" data-player="${jugador.id}">HIT</span>
        <span class="rec-badge rec-double" data-action="double" data-player="${jugador.id}">DOUBLE</span>
        <span class="rec-badge rec-split" data-action="split" data-player="${jugador.id}">SPLIT</span>
      </div>
    </div>
  `;
  
  if (jugador.estado === 'inactive') {
    playerCard.classList.add('inactive-player');
  }
  
  return playerCard;
}

// // Función para actualizar las cartas de un jugador específico
// function actualizarCartasJugador(jugadorId, cartas, total) {
//   const playerCard = document.getElementById(`player-${jugadorId}`);
//   if (!playerCard) return;
  
//   const cardsDisplay = playerCard.querySelector('.cards-display');
//   const totalElement = playerCard.querySelector('.total');
  
//   // Limpiar cartas existentes
//   cardsDisplay.innerHTML = '';
  
//   // Agregar nuevas cartas
//   cartas.forEach(carta => {
//     const cardSpan = document.createElement('span');
//     cardSpan.className = 'card';
//     cardSpan.textContent = carta;
//     cardsDisplay.appendChild(cardSpan);
//   });
  
//   // Actualizar total
//   totalElement.textContent = `Total: ${total}`;
// }

// Modificar actualizarZen para actualizar el gauge
function actualizarZen(valor) {
  const valueNumber = document.querySelector('.zen-number');
  valueNumber.textContent = valor;
}

// // Función para obtener datos del backend (ejemplo)
// async function obtenerDatosJuego() {
//   try {
//     const response = await fetch('/api/game-data');
//     if (response.ok) {
//       const data = await response.json();
      
//       // Actualizar interfaz con datos del backend
//       actualizarJugadores(data.jugadores);
//       actualizarValorHilo(data.valorHilo);
      
//     } else {
//       console.error('Error al obtener datos del juego');
//     }
//   } catch (error) {
//     console.error('Error en la conexión:', error);
//   }
// }

// Función para actualizar todos los jugadores
function actualizarJugadores(jugadores) {
  const playersGrid = document.getElementById('players-grid');
  playersGrid.innerHTML = '';
  
  jugadores.forEach(jugador => {
    const playerCard = crearTarjetaJugador(jugador);
    playersGrid.appendChild(playerCard);
    
    // Actualizar la recomendación para cada jugador
    if (jugador.estado === 'active') {
      actualizarRecomendacion(jugador.id, jugador.recomendacion);
    }
  });
}

// // Función para recibir datos del backend via JSON
// async function obtenerDatosBackend() {
//   try {
//     const response = await fetch('/api/game-data', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
    
//     if (response.ok) {
//       const data = await response.json();
      
//       // Actualizar interfaz con datos del backend
//       actualizarJugadores(data.jugadores);
//       actualizarValorHilo(data.valorHilo);
      
//       console.log('Datos recibidos del backend:', data);
//     } else {
//       console.error('Error al obtener datos del juego:', response.status);
//       // Fallback: usar datos simulados si falla la conexión
//       simularDatosBackend();
//     }
//   } catch (error) {
//     console.error('Error en la conexión:', error);
//     // Fallback: usar datos simulados si falla la conexión
//     // simularDatosBackend();
//   }
// }

async function capturarImagen() {
  const video = document.querySelector("video");
  if (!video.srcObject) {
    alert("Primero debes iniciar la compartir pantalla");
    return;
  }

  // Crear un canvas para capturar la imagen
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Dibujar el frame actual del video en el canvas
  ctx.drawImage(video, 0, 0);
  
  // Convertir a blob
  canvas.toBlob(async function(blob) {
    // PRIMERO: Descargar la imagen localmente
    // const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    // const filename = `captura-blackjack-${timestamp}.png`;
    
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = filename;
    // a.click();
    // URL.revokeObjectURL(url);
    
    // console.log(`Imagen descargada localmente como: ${filename}`);
    
    // SEGUNDO: Enviar a la API de FastAPI
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', blob, 'captura-blackjack.png');
      
      // Enviar a la API de FastAPI
      const response = await fetch('http://127.0.0.1:8000/detect', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Respuesta de la API:', result);
        
        // Mostrar los datos del JSON en pantalla
        // mostrarDatosAPI(result);
        const adaptado = adaptarDatosAPI(result);
        actualizarJugadores(adaptado.jugadores);
        actualizarZen(adaptado.valorHilo);

      } else {
        console.error('Error al enviar imagen:', response.status);
        alert('Error al procesar la imagen en el servidor');
      }
    } catch (error) {
      console.error('Error en la conexión con el servidor:', error);
      alert('Error de conexión con la API - La imagen ya fue descargada localmente');
    }
  }, "image/png");
}

// Función para adaptar el JSON de la API al formato visual de jugadores
function adaptarDatosAPI(apiData) {
  const jugadores = [];
  let valorHilo = null;
  
  for (const key in apiData) {
    if (Object.hasOwnProperty.call(apiData, key)) {
      const jugadorData = apiData[key];
      
      // Cartas puede venir como array o string
      let cartas = [];
      if (Array.isArray(jugadorData.carts)) {
        cartas = jugadorData.carts;
      } else if (typeof jugadorData.carts === 'string') {
        try {
          // Intentar parsear si es un string JSON
          cartas = JSON.parse(jugadorData.carts.replace(/'/g, '"'));
        } catch {
          // Si no es JSON válido, tratar como string simple
          cartas = jugadorData.carts ? [jugadorData.carts] : [];
        }
      }
      
      // Mostrar solo el número de la carta, sin palo
      const cartasVisuales = cartas.map(carta => carta ? `${carta}` : '').filter(carta => carta !== '');
      
      // Calcular el total de las cartas
      const total = cartasVisuales.reduce((acc, carta) => {
        const numero = carta.replace(/[♥♦♠♣]/g, '');
        if (numero === 'A') return acc + 11; // As como 11
        if (['K', 'Q', 'J'].includes(numero)) return acc + 10;
        const num = parseInt(numero);
        return acc + (isNaN(num) ? 0 : num);
      }, 0);
      
      // Estado: el crupier es "inactive", los demás "active" (pero si no tiene cartas, también inactive)
      let estado = jugadorData.player === 'Crupier' ? 'inactive' : 'active';
      if (cartasVisuales.length === 0) {
        estado = 'inactive';
      }
      
      // Recomendación: extraer de best_strategy
      let recomendacion = 'stand';
      if (jugadorData.best_strategy) {
        if (jugadorData.best_strategy.includes('PLANTARSE')) {
          recomendacion = 'stand';
        } else if (jugadorData.best_strategy.includes('PEDIR_CARTA')) {
          recomendacion = 'hit';
        } else if (jugadorData.best_strategy.includes('DOBLAR')) {
          recomendacion = 'double';
        } else if (jugadorData.best_strategy.includes('DIVIDIR')) {
          recomendacion = 'split';
        }
      }
      
      // Obtener valor hilo del primer jugador que tenga zen válido
      if (valorHilo === null && jugadorData.zen && jugadorData.zen !== 'N/A') {
        valorHilo = jugadorData.zen;
      }
      
      jugadores.push({
        id: key,
        nombre: jugadorData.player,
        estado,
        cartas: cartasVisuales,
        total,
        recomendacion
      });
    }
  }
  
  return { jugadores, valorHilo: valorHilo ?? 'N/A' };
}

// Función para mostrar los datos de la API en pantalla
function mostrarDatosAPI(data) {
  // Adaptar datos de la API al formato visual
  const adaptado = adaptarDatosAPI(data);
  actualizarJugadores(adaptado.jugadores);
  actualizarZen(adaptado.valorHilo);

  // (Opcional) Mostrar el JSON en un modal como antes
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  const content = document.createElement('div');
  content.style.cssText = `
    background: #313b44;
    padding: 30px;
    border-radius: 15px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    border: 2px solid #e62815;
  `;
  const title = document.createElement('h2');
  title.textContent = 'Datos de la API';
  title.style.cssText = `
    color: #e62815;
    margin-bottom: 20px;
    text-align: center;
  `;
  const dataDisplay = document.createElement('pre');
  dataDisplay.textContent = JSON.stringify(data, null, 2);
  dataDisplay.style.cssText = `
    color: #aaa8ad;
    background: #1c1d22;
    padding: 20px;
    border-radius: 10px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
  `;
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Cerrar';
  closeButton.style.cssText = `
    background: #e62815;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    font-size: 16px;
  `;
  closeButton.onclick = () => document.body.removeChild(modal);
  content.appendChild(title);
  content.appendChild(dataDisplay);
  content.appendChild(closeButton);
  modal.appendChild(content);
  document.body.appendChild(modal);
} 




// ===== TUTORIAL BÁSICO =====

// Lista simple de pasos
const pasosBasicos = [
  {
    titulo: "¡Bienvenido a Blackjack 2IA!",
    texto: "Sigue los pasos para aprender a jugar.",
    elemento: null
  },
  {
    paso: "1",
    titulo: "Compartir Pantalla",
    texto: "Comparte la pantalla del juego del casino para detectar cartas.",
    elemento: "button[onclick='compartirPantalla()']"
  },
  {
    paso: "2",
    titulo: "Reset del Mazo",
    texto: "Reinicia el contador de cartas a cero cuando haya una nueva baraja.",
    elemento: "button[onclick='resetMazo()']"
  },
  {
    paso: "3",
    titulo: "Capturar Imagen",
    texto: "Captura las cartas de la mesa.",
    elemento: "button[onclick='capturarImagen()']"
  },
  {
    paso: "4",
    titulo: "Valor Zen",
    texto: "El valor Zen te ayuda a contar cartas y tomar mejores decisiones.",
    elemento: ".value-section"
  },
  {
    paso: "5",
    titulo: "Pantalla compartida",
    texto: "Aquí verás el video de la pantalla compartida.",
    elemento: "video"
  },
  {
    paso: "6",
    titulo: "Sección de Jugadores",
    texto: "Aquí verás todos los jugadores detectados con sus cartas y recomendaciones.",
    elemento: ".players-container"
  },
  {
    titulo: "¡Listo para jugar!",
    texto: "Ya conoces lo básico. ¡Empieza compartiendo tu pantalla!",
    elemento: null
  }
];

// Variables simples
let pasoActual = 0;

// Obtengo los elementos del HTML
const tutorial = document.getElementById('tutorial-simple');
const titulo = document.getElementById('tutorial-titulo');
const texto = document.getElementById('tutorial-texto');
const numeroCirculo = document.getElementById('numero-del-paso-del-tutorial');
const btnAnterior = document.getElementById('tutorial-anterior');
const btnSiguiente = document.getElementById('tutorial-siguiente');
const btnCerrar = document.getElementById('tutorial-cerrar');
const btnIniciar = document.getElementById('start-tutorial');

// Función para mostrar un paso
function mostrarPaso(numero) {
  const paso = pasosBasicos[numero]; // Obtener el paso actual
  
  // Actualizar número en el círculo y mostrar/ocultar círculo
  if (paso.paso) {
    numeroCirculo.textContent = paso.paso;
    numeroCirculo.style.display = 'flex';
  } else {
    numeroCirculo.style.display = 'none';
  }
  
  // Actualizar texto del título (sin el número, ya que está en el círculo)
  titulo.textContent = paso.titulo;
  texto.textContent = paso.texto;

  // Quitar destacado anterior
  document.querySelectorAll('.destacar').forEach(el => {
    el.classList.remove('destacar');
  });
  
  // Destacar elemento si existe
  if (paso.elemento) {
    const elemento = document.querySelector(paso.elemento);
    if (elemento) {
      elemento.classList.add('destacar');
      console.log(`Elemento destacado: ${paso.elemento}`, elemento);
    } else {
      console.warn(`No se encontró el elemento: ${paso.elemento}`);
    }
  }
  
  // Mostrar/ocultar botones
  btnAnterior.style.display = numero === 0 ? 'none' : 'inline-block';
  btnSiguiente.textContent = numero === pasosBasicos.length - 1 ? 'Finalizar' : 'Siguiente →';
}

// Función para iniciar tutorial
function iniciarTutorial() {
  pasoActual = 0;
  tutorial.classList.remove('hidden');
  mostrarPaso(pasoActual);
}

// Función para cerrar tutorial
function cerrarTutorial() {
  tutorial.classList.add('hidden');
  // Quitar todos los destacados correctamente
  document.querySelectorAll('.destacar').forEach(el => {
    el.classList.remove('destacar');
  });
}

// Función siguiente paso
function siguientePaso() {
  if (pasoActual < pasosBasicos.length - 1) {
    pasoActual++;
    mostrarPaso(pasoActual);
  } else {
    cerrarTutorial();
  }
}

// Función paso anterior
function anteriorPaso() {
  if (pasoActual > 0) {
    pasoActual--;
    mostrarPaso(pasoActual);
  }
}

// Conectar botones (cuando la página cargue)
document.addEventListener('DOMContentLoaded', function() {
  btnIniciar.addEventListener('click', iniciarTutorial);
  btnSiguiente.addEventListener('click', siguientePaso);
  btnAnterior.addEventListener('click', anteriorPaso);
  btnCerrar.addEventListener('click', cerrarTutorial);
}); 