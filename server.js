// jwt-auth-demo/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const { connectDB } = require('./config/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor solo después de conectar a la BD
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🌍 http://localhost:${PORT}`);
  });
};

startServer();
