import express from 'express';
import { shortenedUrl, originalUrl, qrGenerator } from '../Controllers/urlControllers.js' ;

const router = express.Router();

router.post('/shorten', shortenedUrl);
router.get('/:shortenUrl', originalUrl);
router.get('/qrgenerate', qrGenerator);
// router.get('/qr/:url', getQrCode);

export default router;