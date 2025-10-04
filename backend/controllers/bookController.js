const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');
mongoose.set('debug', true);
const createBook = async (req, res, next) => {
    try {
        const { title, author, description, genre, year } = req.body;
        if (!title || !author) return res.status(400).json({ message: 'Title and author required' });

        const book = await Book.create({
            title, author, description, genre, year,
            addedBy: req.user._id
        });
        res.status(201).json(book);
    } catch (err) { next(err); }
};

const getBooks = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 5;
        const skip = (page - 1) * limit;

        const filter = {};
        
        if (req.query.search) {
            const s = req.query.search;
            filter.$or = [
                { title: new RegExp(s, 'i') },
                { author: new RegExp(s, 'i') }
            ];
        }
        if (req.query.genre) filter.genre = req.query.genre;

        const [total, books] = await Promise.all([
            Book.countDocuments(filter),
            Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        ]);

        const bookIds = books.map(b => b._id);
        const ratings = await Review.aggregate([
            { $match: { bookId: { $in: bookIds.map(id => new mongoose.Types.ObjectId(id)) } } },
            { $group: { _id: '$bookId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);

        const ratingMap = {};
        ratings.forEach(r => ratingMap[r._id.toString()] = { avgRating: r.avgRating, count: r.count });

        const results = books.map(b => ({
            ...b,
            averageRating: ratingMap[b._id.toString()] ? Number(ratingMap[b._id.toString()].avgRating.toFixed(2)) : null,
            ratingsCount: ratingMap[b._id.toString()] ? ratingMap[b._id.toString()].count : 0
        }));

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            total,
            count: results.length,
            books: results
        });
    } catch (err) { next(err); }
};

const getBookDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).populate('addedBy', 'name email').lean();
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const reviews = await Review.find({ bookId: id }).populate('userId', 'name').sort({ createdAt: -1 }).lean();

        const avgObj = await Review.aggregate([
            { $match: { bookId: new mongoose.Types.ObjectId(id) } },
            { $group: { _id: '$bookId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);

        const averageRating = avgObj[0] ? Number(avgObj[0].avgRating.toFixed(2)) : null;
        const ratingsCount = avgObj[0] ? avgObj[0].count : 0;

        res.json({ book, reviews, averageRating, ratingsCount });
    } catch (err) { next(err); }
};

const updateBook = async (req, res, next) => {
    try {
        console.log('updateBook called!');
        console.log('req.user:', req.user);
        console.log('req.body:', req.body);

        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Authorization: only the creator can update
        if (!book.addedBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this book' });
        }

        // Update allowed fields
        const allowed = ['title', 'author', 'description', 'genre', 'year'];
        let updated = false;
        allowed.forEach(field => {
            if (req.body[field] !== undefined) {
                book[field] = field === 'year' ? Number(req.body[field]) : req.body[field];
                updated = true;
            }
        });

        if (!updated) return res.status(400).json({ message: 'No valid fields provided for update' });

        const updatedBook = await book.save();
        console.log('Book after save:', updatedBook);

        res.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        console.log('deleteBook called!');
        console.log('req.user:', req.user);

        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Only the creator can delete
        if (!book.addedBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this book' });
        }

        // Delete associated reviews first
        await Review.deleteMany({ bookId: id });

        // Delete the book using deleteOne
        await Book.deleteOne({ _id: id });

        console.log(`Book ${id} deleted successfully`);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Delete book error:', err);
        next(err);
    }
};


module.exports = { createBook, getBooks, getBookDetails, updateBook, deleteBook };
