const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addReview, updateReview, deleteReview, getReviewsByBook } = require('../controllers/reviewController');

router.post('/:bookId', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/book/:bookId', getReviewsByBook);
module.exports = router;
