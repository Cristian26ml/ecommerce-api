const socket = io();

// Escuchar cambios en productos
socket.on("productChange", (change) => {
  console.log("Producto actualizado en tiempo real:", change);
  // Aquí puedes refrescar la lista de productos automáticamente
});

// Escuchar cambios en órdenes
socket.on("orderChange", (change) => {
  console.log("Orden actualizada en tiempo real:", change);
  // Aquí puedes refrescar el dashboard de órdenes automáticamente
});
