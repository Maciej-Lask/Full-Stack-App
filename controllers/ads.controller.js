const Ad = require('../models/Ad.model');
const fs = require('fs');
const getImageFileType = require('../utils/getImageFileType');
const User = require('../models/User.model');
// const getCurrentUser = require('../controllers/auth.controller');
// Obsługuje żądanie GET /api/ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('sellerInfo'); // Populujemy pole "sellerInfo" autora
    res.status(200).json(ads);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Wystąpił błąd podczas pobierania ogłoszeń.' });
  }
};

// Obsługuje żądanie GET /api/ads/:id
exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('sellerInfo'); // Populujemy pole "sellerInfo" autora
    if (!ad) {
      return res
        .status(404)
        .json({ error: 'Ogłoszenie nie zostało znalezione.' });
    }
    res.status(200).json(ad);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Wystąpił błąd podczas pobierania ogłoszenia.' });
  }
};
// Obsługuje żądanie POST /api/ads
exports.createAd = async (req, res) => {
  try {
    const { title, content, price, location } = req.body;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
    console.log(req.body, req.file);
    // Sprawdzanie, czy dane ogłoszenia są poprawne
    if (
      title &&
      content &&
      price &&
      location &&
      req.file &&
      ['image/jpeg', 'image/png', 'image/jpg'].includes(fileType)
    ) {
      const newAd = await Ad.create({
        title,
        content,
        price,
        location,
        sellerInfo: req.session.userId, // Ustaw autora ogłoszenia jako zalogowanego użytkownika
        image: req.file.filename, // Zapisz nazwę pliku obrazka
      });

      res.status(201).json(newAd);
    } else {
      if (req.file) {
        // Usuń przesłany plik, jeśli wystąpił błąd
        fs.unlinkSync(`./public/uploads/${req.file.filename}`);
      }
      
      res.status(400).json({ error: 'Nieprawidłowe dane ogłoszenia.' });
    }
  } catch (error) {
    if (req.file) {
      // Usuń przesłany plik w przypadku błędu
      fs.unlinkSync(`./public/uploads/${req.file.filename}`);
    }
    console.error(error);
    res
      .status(500)
      .json({ error: 'Wystąpił błąd podczas tworzenia ogłoszenia.' });
  }
};

// Obsługuje żądanie DELETE /api/ads/:id
exports.deleteAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.session.userId;
    // console.log(userId);

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res
        .status(404)
        .json({ error: 'Ogłoszenie nie zostało znalezione.' });
    }

    // Sprawdź, czy zalogowany użytkownik jest autorem ogłoszenia
    if (ad.sellerInfo.toString() !== userId) {
      return res
        .status(403)
        .json({ error: 'Brak uprawnień do usunięcia tego ogłoszenia.' });
    }
    console.log(ad.sellerInfo.toString());

    // Usuń plik obrazka z folderu "uploads"
    if (ad.image) {
      const imagePath = `./public/uploads/${ad.image}`;
      fs.unlinkSync(imagePath);
    }

    const deletedAd = await Ad.findByIdAndDelete(adId);
    if (!deletedAd) {
      return res
        .status(404)
        .json({ error: 'Ogłoszenie nie zostało znalezione.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Wystąpił błąd podczas usuwania ogłoszenia.' });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.session.userId;

    const existingAd = await Ad.findById(adId);

    if (!existingAd) {
      return res
        .status(404)
        .json({ error: 'Ogłoszenie nie zostało znalezione.' });
    }

    if (existingAd.sellerInfo.toString() !== userId) {
      return res
        .status(403)
        .json({ error: 'Brak uprawnień do edycji tego ogłoszenia.' });
    }

    const updatedAdData = req.body;

    if (req.file) {
      if (existingAd.image) {
        // Usuń stary obrazek, jeśli istnieje
        fs.unlinkSync(`./public/uploads/${existingAd.image}`);
      }
      updatedAdData.image = req.file.filename;
    }

    const updatedAd = await Ad.findByIdAndUpdate(adId, updatedAdData, {
      new: true,
    });

    res.status(200).json(updatedAd);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(`./public/uploads/${req.file.filename}`);
    }
    console.error(error);
    res
      .status(500)
      .json({ error: 'Wystąpił błąd podczas aktualizacji ogłoszenia.' });
  }
};


// Obsługuje żądanie GET /api/ads/search/:searchPhrase
exports.searchAdsByTitle = async (req, res) => {
  try {
    const searchPhrase = req.params.searchPhrase;
    const ads = await Ad.find({
      title: { $regex: searchPhrase, $options: 'i' },
    });
    res.status(200).json(ads);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Wystąpił błąd podczas wyszukiwania ogłoszeń.' });
  }
};
