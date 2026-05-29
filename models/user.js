// jwt-auth-demo/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor proporciona un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: 6,
      select: false, // No retorna la contraseña por defecto
    },
  },
  { timestamps: true }
);

// Hash de la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Si la contraseña no ha sido modificada, continúa
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema);
