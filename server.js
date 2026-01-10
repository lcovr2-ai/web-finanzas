// ================================
// IMPORTS
// ================================
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

// ================================
// APP CONFIG
// ================================
const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// MIDDLEWARES
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "clave-super-secreta-finanzas",
    resave: false,
    saveUninitialized: false,
  })
);

// ================================
// ARCHIVOS PÚBLICOS LIMITADOS
// SOLO login, estilos y JS
// ================================
app.use(
  express.static(path.join(__dirname, "public"), {
    index: false, // 🔒 EVITA que index.html cargue solo
  })
);

// ================================
// LOGIN
// ================================
app.post("/login", (req, res) => {
  const { user, password } = req.body;

  const usersPath = path.join(__dirname, "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  const foundUser = users.find(
    u => u.user === user && u.password === password
  );

  if (!foundUser) {
    return res.json({
      ok: false,
      msg: "Usuario o contraseña incorrectos",
    });
  }

  req.session.user = {
    user: foundUser.user,
    name: foundUser.name,
  };

  res.json({ ok: true });
});

// ================================
// LOGOUT
// ================================
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// ================================
// RUTA PROTEGIDA (APP)
// ================================
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================================
// TEST API
// ================================
app.get("/api/test", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  res.json({ msg: "API segura funcionando" });
});

// ================================
// SERVER
// ================================
app.listen(PORT, () => {
  console.log("==================================");
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log("==================================");
});