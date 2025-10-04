const Review = require('../models/Review');
const Book = require('../models/Book');

const addReview = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { rating, reviewText } = req.body;
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const existing = await Review.findOne({ bookId, userId: req.user._id });
        if (existing) return res.status(400).json({ message: 'You already reviewed this book' });

        const review = await Review.create({
            bookId, userId: req.user._id, rating, reviewText
        });

        res.status(201).json(review);
    } catch (err) { next(err); }
};

const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (!review.userId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

        if (req.body.rating !== undefined) {
            if (req.body.rating < 1 || req.body.rating > 5) return res.status(400).json({ message: 'Invalid rating' });
            review.rating = req.body.rating;
        }
        if (req.body.reviewText !== undefined) review.reviewText = req.body.reviewText;

        const updated = await review.save();
        res.json(updated);
    } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (!review.userId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

        await Review.deleteOne({ _id: id });
        res.json({ message: 'Review deleted' });
    } catch (err) { next(err); }
};

const getReviewsByBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const reviews = await Review.find({ bookId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .lean();
        res.json(reviews);
    } catch (err) { next(err); }
};

module.exports = { addReview, updateReview, deleteReview, getReviewsByBook };
