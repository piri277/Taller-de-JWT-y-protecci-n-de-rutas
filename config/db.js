// jwt-auth-demo/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI no está definida en el archivo .env');
      process.exit(1);
    }

    const connString = process.env.MONGODB_URI || '';
    console.log(`Intentando conectar a: ${connString.includes('srv') ? 'MongoDB Atlas' : 'Localhost'}`);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:');
    console.error('Mensaje:', error.message);
    if (error.message.includes('querySrv')) {
      console.error('💡 Tip: Intenta usar la "Standard Connection String" en lugar de "+srv" en tu .env');
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
