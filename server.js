const express = require("express");
const app = express();

app.get("*", (req, res) => {
  res.send("🔥 SERVIDOR NODE ACTIVO - ESTA ES UNA PRUEBA 🔥");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor de prueba levantado en puerto", PORT);
});
