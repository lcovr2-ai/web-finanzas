// ================================
// IMPORTS
// ================================
const express = require("express");
const fs = require("fs");
const path = require("path");

// ================================
// APP CONFIG
// ================================
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (frontend)
app.use(express.static(path.join(__dirname, "public")));

// ================================
// LOGIN
// ================================
app.post("/login", (req, res) => {
  const { user, password } = req.body;

  // Leer usuarios
  const usersPath = path.join(__dirname, "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  // Buscar usuario
  const foundUser = users.find(
    u => u.user === user && u.password === password
  );

  if (foundUser) {
    res.json({
      ok: true,
      name: foundUser.name
    });
  } else {
    res.json({
      ok: false,
      msg: "Usuario o contraseña incorrectos"
    });
  }
});

// ================================
// EJEMPLO DE RUTA PROTEGIDA (FUTURO)
// ================================
app.get("/api/test", (req, res) => {
  res.json({
    msg: "API funcionando correctamente"
  });
});

// ================================
// SERVIDOR
// ================================
app.listen(PORT, () => {
  console.log("==================================");
  console.log(`Servidor corriendo en:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log("==================================");
});