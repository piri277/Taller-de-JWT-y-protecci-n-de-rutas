// jwt-auth-demo/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación más detallada
    const missingFields = [];
    if (!name) missingFields.push('nombre');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('contraseña');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Faltan campos obligatorios: ${missingFields.join(', ')}`,
        success: false 
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({ name, email, password });
    await nuevoUsuario.save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: nuevoUsuario._id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
  }
});

// Manejador para métodos no permitidos en /register
router.all('/register', (req, res) => {
  console.log(`⚠️ Intento de acceso no permitido: ${req.method} en /register`);
  res.status(405).json({ 
    message: `El método ${req.method} no está permitido en esta ruta. Usa POST para registrarte.` 
  });
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que los campos requeridos existan
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor proporciona email y contraseña.' });
    }

    // Buscar usuario por email (incluyendo la contraseña)
    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos.' });
    }

    // Verificar contraseña
    const contraseñaValida = await usuario.matchPassword(password);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos.' });
    }

    // Generar JWT
    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Configurar cookie HTTP-Only segura
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos en milisegundos
    });

    res.status(200).json({
      message: 'Login exitoso.',
      token,
      user: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logout exitoso.' });
});

// Manejador para métodos no permitidos en /login
router.all('/login', (req, res) => {
  res.status(405).json({ 
    message: `El método ${req.method} no está permitido en esta ruta. Usa POST para iniciar sesión.` 
  });
});

module.exports = router;
