const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// 📌 Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 📌 Ruta principal → LOGIN
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 📌 Endpoint de prueba (backend vivo)
app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend funcionando correctamente",
    time: new Date()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});