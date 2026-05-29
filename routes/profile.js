// jwt-auth-demo/routes/profile.js
const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Obtener perfil del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user contiene { id, email } del token verificado
    const usuario = await User.findById(req.user.id).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      message: 'Perfil obtenido exitosamente.',
      user: usuario,
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil.', error: error.message });
  }
});

module.exports = router;
