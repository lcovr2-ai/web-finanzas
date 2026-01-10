const express = require("express");
const path = require("path");

const app = express();

// 🔑 PUERTO CORRECTO PARA RENDER
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos
app.use(express.static(path.join(__dirname, "public")));

// Ruta de prueba CLARA
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    msg: "Servidor Node funcionando correctamente"
  });
});

// 🚀 INICIO DEL SERVIDOR
app.listen(PORT, () => {
  console.log("==================================");
  console.log("Servidor corriendo correctamente");
  console.log(`Puerto usado: ${PORT}`);
  console.log("==================================");
});