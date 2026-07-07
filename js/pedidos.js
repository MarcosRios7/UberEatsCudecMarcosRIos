let contenidoLista= '';
document.addEventListener('DOMContentLoaded', function() {
    
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
});

db.collection("platillos").onSnapshot((datos)=>{
    datos.docChanges().forEach((registro)=>{
        if (registro.type==="added"){
            agregarALista(registro.doc.data(), registro.doc.id);
        }
    });
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});

function agregarALista (platillo, id) {
    contenidoLista += `<option value= '${id}'>
    ${platillo.nombre}
    </option>`;
    document.getElementById("listaPlatillos").innerHTML = contenidoLista; 
}

const pedidoAgregar = document.querySelector("form");
pedidoAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const pedidoNuevo = {
        platillo: document.getElementById("listaPlatillos").value,
        nombre: document.getElementById("nombrePedido").value,
        precio: document.getElementById("direccionPedido").value
    }
    db.collection("pedidos").add(pedidoNuevo)
    .catch((error) => {
        console.log(error);
        alert("Error al agregar pedido");
    }
    );

    document.getElementById("listaPlatillos").value = "";
    document.getElementById("nombrePedido").value = "";
    document.getElementById("direccionPedido").value = "";
    alert("Pedido agregado");
});

document.getElementById("btnUbicacion").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(exito, error);
    }
    else alert("Esta aplicacion no soporta la geolocalización")
});

function exito(posicion){
   // alert(posicion.coords.latitude + " " + posicion.coords.longitude);
   let latitude = posicion.coords.latitude;
   let longitude = posicion.coords.longitude;
   fetch (`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
   headers: {
    'User-Agent': 'ProyectoMarcosRios (Marcosrios246@gmail.com)'
   }
   })
   .then(respuesta => respuesta.json())
   .then(data=>{
    // 1. Select the input element using its ID
    const inputDireccion = document.getElementById('direccionPedido');
    
    // 2. Assign the address string to the input's value
    if (inputDireccion) {
        inputDireccion.value = data.display_name;
    }
})
   .catch(error => console.error(error));
}
function error(error){
    alert("Ha habido un error");
    console.log(error);
}