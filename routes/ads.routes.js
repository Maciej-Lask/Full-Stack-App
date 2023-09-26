const express = require('express');
const router = express.Router();

const ads = require('../controllers/ads.controller');
const authMiddleware = require('../utils/authMiddleware');
const imageUpload = require('../utils/imageUpload');

// GET /api/ads – który zwróci wszystkie ogłoszenia,
router.get('/ads', ads.getAllAds);

// GET /api/ads/:id – który zwróci konkretne ogłoszenie,
router.get('/ads/:id', ads.getAdById);

// POST /api/ads – do dodawania nowego ogłoszenia,
router.post('/ads', authMiddleware, imageUpload.single('image'), ads.createAd);

// DELETE /api/ads/:id – do usuwania ogłoszenia,
router.delete('/ads/:id',authMiddleware, ads.deleteAd);

// PUT lub PATCH /api/ads/:id – do edycji ogłoszenia,
router.put(
  '/ads/:id',
  authMiddleware,
  imageUpload.single('image'),
  ads.updateAd
);
// router.patch('/ads/:id',authMiddleware, ads.partialUpdateAd);

// GET /api/ads/search/:searchPhrase – który zwróci ogłoszenia pasujące tytułem do podanej frazy,
router.get('/ads/search/:searchPhrase', ads.searchAdsByTitle);

module.exports = router;
