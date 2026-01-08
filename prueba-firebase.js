// prueba-firebase.js
const admin = require('firebase-admin');

console.log("🔍 INICIANDO PRUEBA DE CONEXIÓN...");

async function probarConexion() {
  try {
    // 1. Cargar credenciales
    console.log("📄 Cargando credenciales...");
    const serviceAccount = require("./flujo-bancario-firebase-adminsdk-fbsvc-5a065cc39f.json");
    console.log("✅ Credenciales cargadas del proyecto:", serviceAccount.project_id);
    
    // 2. Inicializar Firebase
    console.log("🚀 Inicializando Firebase...");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://flujo-bancario-default-rtdb.firebaseio.com"
    });
    console.log("✅ Firebase inicializado");
    
    // 3. Conectar a la base de datos
    console.log("🔗 Conectando a la base de datos...");
    const db = admin.database();
    
    // 4. Intentar escribir un dato de prueba
    console.log("✏️ Intentando escribir dato de prueba...");
    const testRef = db.ref('prueba_conexion');
    await testRef.set({
      mensaje: "Esto es una prueba",
      fecha: new Date().toISOString()
    });
    console.log("✅✅✅ ¡ESCRITURA EXITOSA! La conexión funciona.");
    
    // 5. Leer el dato para confirmar
    console.log("📖 Leyendo dato para confirmar...");
    const snapshot = await testRef.once('value');
    console.log("✅ Datos leídos:", snapshot.val());
    
    // 6. Limpiar
    await testRef.remove();
    console.log("🧹 Datos de prueba eliminados");
    
    console.log("🎉 ¡PRUEBA COMPLETADA CON ÉXITO!");
    console.log("Tu Firebase está correctamente configurado.");
    process.exit(0);
    
  } catch (error) {
    console.error("❌❌❌ ERROR ENCONTRADO:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code || "Sin código específico");
    
    if (error.message.includes("private_key")) {
      console.log("\n💡 POSIBLE SOLUCIÓN: Tu archivo JSON de Firebase puede estar corrupto.");
      console.log("   Ve a Firebase Console > Configuración del proyecto > Cuentas de servicio");
      console.log("   Genera una NUEVA clave privada y descárgala.");
    }
    
    if (error.message.includes("databaseURL")) {
      console.log("\n💡 POSIBLE SOLUCIÓN: Revisa la URL de tu base de datos:");
      console.log("   1. Ve a Firebase Console");
      console.log("   2. Haz clic en 'Realtime Database'");
      console.log("   3. Copia la URL que aparece (algo como: https://TU-PROYECTO.firebaseio.com)");
    }
    
    process.exit(1);
  }
}

probarConexion();