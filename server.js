const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware de protección
function requireAuth(req, res, next) {
  // Render no mantiene sesiones aún, así que usamos una cookie simple
  if (req.headers.cookie && req.headers.cookie.includes("auth=true")) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

// Ruta protegida PRINCIPAL
app.get("/", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login fake (temporal, para cerrar el hueco)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // VALIDACIÓN TEMPORAL
  if (email && password) {
    res.setHeader(
      "Set-Cookie",
      "auth=true; Path=/; HttpOnly=false"
    );
    return res.json({ ok: true });
  }

  res.status(401).json({ ok: false });
});

// Logout
app.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "auth=; Path=/; Max-Age=0"
  );
  res.redirect("/login.html");
});

// Arranque
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});