import express from 'express';
import fetchReview from './controllers/review.js';
import oauth from './controllers/oauth.js';

const router = express.Router();

router.post('/fetch', fetchReview);
router.post('/oauth', oauth);

export default router;
