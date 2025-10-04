const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createBook, getBooks, getBookDetails, updateBook, deleteBook
} = require('../controllers/bookController');

router.get('/', getBooks);
router.post('/', protect, createBook);
router.get('/:id', getBookDetails);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
