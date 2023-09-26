const User = require('../models/User.model');
const lodash = require('lodash');
const bcrypt = require('bcryptjs');
const getImageFileType = require('../utils/getImageFileType');

const fs = require('fs');

// Obsługuje żądanie POST /auth/register – do rejestracji nowego użytkownika
exports.register = async (req, res) => {
  try {
    const { login, password, avatar, phoneNumber } = req.body;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
    // console.log(req.body, req.file);
    // const escapedLogin = lodash.escape(login);
    // const escapedPassword = lodash.escape(password);
    // const escapedAvatar = lodash.escape(avatar);
    // const escapedPhoneNumber = lodash.escape(phoneNumber);

    // const [, extension] = req.file.originalname.split('.');

    // Sprawdzanie, czy użytkownik o podanym loginie już istnieje
    const existingUser = await User.findOne({ login: login });
    if (existingUser) {
      fs.unlinkSync(`./public/uploads/${req.file.filename}`);
      return res
        .status(409)
        .json({ error: 'User with this login already exists' });
    }
    // Weryfikacja danych
    if (
      // !escapedLogin ||
      // !escapedPassword ||
      // !escapedAvatar ||
      // !escapedPhoneNumber ||
      // typeof escapedLogin !== 'string' ||
      // typeof escapedPassword !== 'string' ||
      // typeof escapedAvatar !== 'string' ||
      // typeof escapedPhoneNumber !== 'string' ||
      // escapedLogin.length < 3 ||
      // escapedLogin.length > 20 ||
      // escapedPassword.length < 6 ||
      // escapedPassword.length > 25 ||
      // escapedPhoneNumber.length < 9
      !login ||
      !password ||
      !req.file ||
      !['image/jpeg', 'image/png', 'image/jpg'].includes(fileType) ||
      !phoneNumber ||
      typeof login !== 'string' ||
      typeof password !== 'string' ||
      // typeof avatar !== 'string' ||
      typeof phoneNumber !== 'string' ||
      login.length < 3 ||
      login.length > 20 ||
      password.length < 6 ||
      password.length > 25 ||
      phoneNumber.length < 9
    ) {
      // if (req.file) {
      //   fs.unlinkSync(`./public/uploads/${req.file.filename}`);
      // }
      return res.status(400).json({ error: 'Incorrect registration data' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const newUser = await User.create({
      login,
      password: hashedPassword,
      avatar: req.file.filename,
      phoneNumber,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    // if (req.file) {
    //   fs.unlinkSync(`./public/uploads/${req.file.filename}`);
    // }
    res.status(500).json({ error: 'Error while registering' });
  }
};

// Obsługuje żądanie POST /auth/login – do weryfikacji użytkownika i utworzenia sesji
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (
      login &&
      password &&
      typeof login === 'string' &&
      typeof password === 'string'
    ) {
      const user = await User.findOne({ login });
      if (!user) {
        return res.status(401).json({ error: 'Wrong login or password' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Wrong login or password' });
      } else {
        req.session.login = user.login;
        // req.session.userId = user.id;
        req.session.userId = user._id;
        res.status(200).json({ message: 'Logged in successfully' });
      }
    } else {
      return res.status(400).json({ error: 'Missing login or password' });
    }
    // const escapedLogin = lodash.escape(login);
    // const escapedPassword = lodash.escape(password);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while logging' });
  }
};

// Obsługuje żądanie GET /auth/user – zwracający informację o aktualnie zalogowanym użytkowniku
exports.getCurrentUser = async (req, res) => {
  const message = `User ${req.session.login} is logged`;
  res.send({ message });
};

// Obsługuje żądanie POST /auth/logout – do wylogowywania użytkownika
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error while logging out:', err);
      return res.status(500).json({ message: 'Error while logging out' });
    }

    return res.status(200).json({ message: `User LOGGED OUT` });
  });
};
