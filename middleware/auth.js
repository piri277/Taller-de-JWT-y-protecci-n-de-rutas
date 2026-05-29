// jwt-auth-demo/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token;

  // Buscar token en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7); // Extrae el token después de "Bearer "
  }
  // Si no está en el header, buscar en las cookies
  else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  // Si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar los datos del usuario en req.user
    next();
  } catch (error) {
    // Manejo específico de token expirado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }

    // Otros errores de JWT
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
