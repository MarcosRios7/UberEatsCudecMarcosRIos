let contenido = "";

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

function mostrarPlatillo(platillo, id) {
  let fotoPlatillo;
  if (platillo.foto) { 
        fotoPlatillo = "data:image/png;base64, " + platillo.foto;
    }
 else {
    fotoPlatillo = "img/Comida_def.jpg";
}
  const contenido = `
    <div class='card-panel recipe white row' id='${id}' data-id='${id}'>
        <img src="${fotoPlatillo}" height="100px" width="500px"> 
        <div class='recipe-details'>
          <div class='recipe-title'>${platillo.nombre}</div>
          <div class='recipe-ingredients'>${platillo.ingredientes}</div>
          <div class='recipe-precio'>Precio: $${platillo.precio} MXN</div>

          <div class="recipe-delete">
            <i class="material-icons" data-id='${id}'>
            delete_outline
            </i>
          </div>

        </div>
    </div>
  `;
    document.querySelector(".recipes").innerHTML += contenido;

    limpiarFoto();
};

function actualizarPlatillo(platillo,id){
  let tarjeta = document.getElementById(`${id}`);
  tarjeta.querySelector(".recipe-title").innerHTML = platillo.nombre;
  tarjeta.querySelector(".recipe-ingredientes").innerHTML = platillo.ingredientes;
  tarjeta.querySelector(".recipe-precio").innerHTML = platillo.precio;
}

const borrarPlatillo = (id) => {
const platillo = document.querySelector(`.recipe[data-id=${id}]`);
platillo.remove();
};

function agregarALista(platillo, id) {
  contenidoLista = `
  <option value="${id}">${platillo.nombre}</option>
  `;

}

//El tamaño de ancho del cuadro cuando se abra la camara
let streaming = false;
const width = 320;
let height = 0;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foto = document.getElementById('foto');
const btnFoto = document.getElementById('btnFoto');
const btnTomarFoto = document.getElementById('btnTomarFoto');
const inputFotoFinal = document.getElementById('fotoFinal');

// Botón 1: Abrir/Iniciar cámara
btnFoto.addEventListener('click', async function(e) {
  e.preventDefault();
  
  // Detener stream previo si ya existía uno activo
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    video.srcObject = stream;
    await video.play();
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
  }
});

// Ajustar dimensiones del canvas y video cuando el stream esté listo
video.addEventListener('canplay', function() {
  if (!streaming) {
    // Si no se puede calcular la proporción, usar relación 4:3 por defecto
    height = video.videoHeight / (video.videoWidth / width) || width * (3 / 4);

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    
    streaming = true;
  }
}, false);

// Botón 2: Disparar la foto
btnTomarFoto.addEventListener('click', function(e) {
  e.preventDefault();
  tomarFoto();
});

function tomarFoto() {
  const contexto = canvas.getContext('2d');
  
  if (streaming && width && height) {
    canvas.width = width;
    canvas.height = height;
    contexto.drawImage(video, 0, 0, width, height);

    const fotoFinal = canvas.toDataURL('image/png');
    foto.setAttribute('src', fotoFinal);
    
    if (inputFotoFinal) {
      inputFotoFinal.value = fotoFinal;
    }
  } else {
    limpiarFoto();
  }
}

function limpiarFoto() {
  const contexto = canvas.getContext('2d');
  contexto.fillStyle = '#AAA';
  contexto.fillRect(0, 0, canvas.width || width, canvas.height || width * (3 / 4));
  
  const data = canvas.toDataURL('image/png');
  foto.setAttribute('src', data);
}