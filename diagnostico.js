// diagnostico.js
const admin = require('firebase-admin');

console.log("🔍 DIAGNÓSTICO COMPLETO DE FIRESTORE");
console.log("=".repeat(60));

async function diagnosticar() {
  try {
    // 1. Inicializar Firebase
    const serviceAccount = require("./flujo-bancario-firebase-adminsdk-fbsvc-5a065cc39f.json");
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    const db = admin.firestore();
    console.log("✅ Firebase Firestore inicializado\n");
    
    // 2. ANALIZAR COLECCIÓN "Cuentas"
    console.log("📁 ANALIZANDO COLECCIÓN: Cuentas");
    console.log("-".repeat(40));
    
    const cuentasSnapshot = await db.collection("Cuentas").get();
    
    console.log(`Total documentos: ${cuentasSnapshot.size}`);
    
    if (cuentasSnapshot.size > 0) {
      // Mostrar primeros 3 documentos como ejemplo
      console.log("\n📄 EJEMPLOS de documentos (primeros 3):");
      let count = 0;
      cuentasSnapshot.forEach(doc => {
        if (count < 3) {
          console.log(`\n📋 Documento ID: ${doc.id}`);
          const data = doc.data();
          console.log("Campos:", Object.keys(data));
          console.log("Datos:", JSON.stringify(data, null, 2));
          
          // Verificar subcolecciones
          console.log("🔍 Verificando subcolecciones...");
        }
        count++;
      });
      
      // Verificar si hay subcolecciones en el primer documento
      const primerDoc = cuentasSnapshot.docs[0];
      if (primerDoc) {
        try {
          const subcolecciones = await db.collection("Cuentas")
            .doc(primerDoc.id)
            .listCollections();
          
          console.log(`\n📂 Subcolecciones en ${primerDoc.id}:`);
          if (subcolecciones.length === 0) {
            console.log("   No hay subcolecciones");
          } else {
            subcolecciones.forEach(subcol => {
              console.log(`   - ${subcol.id}`);
              
              // Verificar contenido de la subcolección
              subcol.get().then(snap => {
                console.log(`     (${snap.size} documentos)`);
              });
            });
          }
        } catch (error) {
          console.log("   Error al listar subcolecciones:", error.message);
        }
      }
    }
    
    // 3. ANALIZAR COLECCIÓN "movimientos" (si existe)
    console.log("\n\n📁 ANALIZANDO COLECCIÓN: movimientos");
    console.log("-".repeat(40));
    
    try {
      const movimientosSnapshot = await db.collection("movimientos").get();
      
      console.log(`Total documentos: ${movimientosSnapshot.size}`);
      
      if (movimientosSnapshot.size > 0) {
        console.log("\n📄 EJEMPLOS de documentos (todos):");
        movimientosSnapshot.forEach(doc => {
          console.log(`\n📋 Documento ID: ${doc.id}`);
          const data = doc.data();
          console.log("Campos:", Object.keys(data));
          console.log("Datos:", JSON.stringify(data, null, 2));
        });
      }
    } catch (error) {
      console.log("❌ Error accediendo a colección 'movimientos':", error.message);
    }
    
    // 4. BUSCAR TODAS LAS COLECCIONES
    console.log("\n\n🔎 BUSCANDO TODAS LAS COLECCIONES");
    console.log("-".repeat(40));
    
    const todasColecciones = await db.listCollections();
    console.log(`Colecciones encontradas: ${todasColecciones.length}`);
    
    todasColecciones.forEach(coleccion => {
      console.log(`   - ${coleccion.id}`);
    });
    
    // 5. BUSCAR MOVIMIENTOS EN TODAS LAS COLECCIONES
    console.log("\n\n🔍 BUSCANDO MOVIMIENTOS EN TODAS PARTES");
    console.log("-".repeat(40));
    
    // Revisar cada colección por datos que parezcan movimientos
    for (const coleccionRef of todasColecciones) {
      const nombreColeccion = coleccionRef.id;
      
      if (nombreColeccion.toLowerCase().includes('movimiento') || 
          nombreColeccion.toLowerCase().includes('transacc') ||
          nombreColeccion.toLowerCase().includes('operacion')) {
        
        console.log(`\n📊 Revisando colección: ${nombreColeccion}`);
        const snap = await coleccionRef.limit(2).get();
        
        if (!snap.empty) {
          console.log(`   Documentos: ${snap.size}`);
          snap.forEach(doc => {
            const data = doc.data();
            console.log(`   📄 Documento ${doc.id}:`, Object.keys(data));
          });
        }
      }
    }
    
    // 6. PRUEBA ESPECÍFICA: Buscar cuenta "BAJIO 8390"
    console.log("\n\n🎯 PRUEBA ESPECÍFICA: Buscando cuenta 'BAJIO 8390'");
    console.log("-".repeat(40));
    
    // Buscar por nombre
    const querySnapshot = await db.collection("Cuentas")
      .where("nombre", "==", "BAJIO 8390")
      .get();
    
    if (querySnapshot.empty) {
      console.log("❌ No se encontró cuenta con nombre 'BAJIO 8390'");
      
      // Buscar cualquier cuenta que contenga "BAJIO"
      const todasCuentas = await db.collection("Cuentas").get();
      const cuentasBajio = [];
      
      todasCuentas.forEach(doc => {
        const data = doc.data();
        if (data.nombre && data.nombre.includes("BAJIO")) {
          cuentasBajio.push({
            id: doc.id,
            nombre: data.nombre
          });
        }
      });
      
      console.log(`\n🔍 Cuentas que contienen "BAJIO": ${cuentasBajio.length}`);
      cuentasBajio.forEach(c => {
        console.log(`   - ${c.nombre} (ID: ${c.id})`);
      });
    } else {
      querySnapshot.forEach(doc => {
        console.log(`✅ Encontrada: ${doc.id} -> ${doc.data().nombre}`);
        
        // Verificar subcolecciones de esta cuenta
        console.log("🔍 Revisando subcolecciones...");
      });
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("📋 RESUMEN DEL DIAGNÓSTICO:");
    console.log("=".repeat(60));
    console.log(`1. Colección "Cuentas": ${cuentasSnapshot.size} documentos`);
    console.log(`2. Colección "movimientos": ${await db.collection("movimientos").get().then(s => s.size)} documentos`);
    console.log(`3. Total colecciones: ${todasColecciones.length}`);
    console.log(`4. Colecciones: ${todasColecciones.map(c => c.id).join(", ")}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error("❌ ERROR en diagnóstico:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

diagnosticar();