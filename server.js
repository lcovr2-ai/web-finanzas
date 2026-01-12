const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor web-finanzas activo 🚀");
});

// Ruta de prueba health
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend funcionando correctamente",
    time: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
