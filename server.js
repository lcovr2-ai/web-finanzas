const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos
app.use(express.static(path.join(__dirname, "public")));

// 🔐 RUTA RAÍZ → SIEMPRE LOGIN
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// 🔎 Ruta de prueba (para confirmar servidor)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando correctamente" });
});

// ❌ Cualquier otra ruta inexistente
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});