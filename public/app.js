let cuentaSeleccionada = "";

fetch("/api/cuentas")
  .then(r => r.json())
  .then(data => {
    const select = document.getElementById("cuentas");
    data.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nombre || c.id;
      select.appendChild(opt);
    });
    cuentaSeleccionada = select.value;
  });

document.getElementById("cuentas").addEventListener("change", e => {
  cuentaSeleccionada = e.target.value;
});

function cargarMovimientos() {
  const inicio = document.getElementById("inicio").value;
  const fin = document.getElementById("fin").value;

  let url = `/api/movimientos/${cuentaSeleccionada}?`;
  if (inicio) url += `inicio=${inicio}&`;
  if (fin) url += `fin=${fin}`;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      const tbody = document.querySelector("#tabla tbody");
      tbody.innerHTML = "";

      data.forEach(m => {
        tbody.innerHTML += `
          <tr>
            <td>${(m.Fecha || "").substring(0,10)}</td>
            <td>${m.Actividad || ""}</td>
            <td>${Number(m["Depositos MXN"] || 0).toFixed(2)}</td>
            <td>${Number(m["Retiros MXN"] || 0).toFixed(2)}</td>
            <td>${Number(m.Saldo || 0).toFixed(2)}</td>
          </tr>
        `;
      });
    });
}

function exportarExcel() {
  window.location.href = `/api/exportar/${cuentaSeleccionada}`;
}
