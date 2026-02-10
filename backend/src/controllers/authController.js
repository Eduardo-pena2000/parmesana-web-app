const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    let { phone, email, password, firstName, lastName } = req.body;

    // Sanitize phone (remove spaces)
    if (phone) {
      phone = phone.replace(/\s+/g, '');
    }

    // Validate required fields
    if (!phone || !firstName) {
      return res.status(400).json({
        success: false,
        message: 'Teléfono y nombre son requeridos'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { phone }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este número de teléfono'
      });
    }

    // Check email if provided
    const emailToSave = email === '' ? null : email;

    if (emailToSave) {
      const emailExists = await User.findOne({ where: { email: emailToSave } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con este email'
        });
      }
    }

    // Create user
    const user = await User.create({
      phone,
      email: emailToSave,
      password,
      firstName,
      lastName
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    let { phone, email, password } = req.body;

    // Sanitize phone (remove spaces, dashes, parentheses)
    if (phone) {
      phone = phone.replace(/[\s\-\(\)]/g, '');
    }

    // Validate required fields
    if ((!phone && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere teléfono/email y contraseña'
      });
    }

    // Find user
    const user = await User.findOne({
      where: phone ? { phone } : { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta soporte.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: tokens
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expirado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al renovar token',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          association: 'addresses',
          where: { isActive: true },
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we just return success as the client will delete the token

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      error: error.message
    });
  }
};
