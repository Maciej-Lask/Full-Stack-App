const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');

const imageUpload = require('../utils/imageUpload');

const authController = require('../controllers/auth.controller');

// POST /auth/register – do rejestracji nowego użytkownika
router.post('/register', imageUpload.single('avatar'), authController.register);

// POST /auth/login – do weryfikacji użytkownika i utworzenia sesji
router.post('/login', authController.login);

// GET /auth/user – zwracający informację o aktualnie zalogowanym użytkowniku
router.get('/user', authMiddleware, authController.getCurrentUser);

// POST /auth/logout – do wylogowywania użytkownika
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
