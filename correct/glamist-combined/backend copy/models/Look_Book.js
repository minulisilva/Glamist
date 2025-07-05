import mongoose from 'mongoose';

const lookBookSchema = new mongoose.Schema({
    Look: { type: String, required: true },
    Description: { type: String, required: true },
    image: { type: String, required: true },
});

const LookBook = mongoose.model('LookBook', lookBookSchema);

export default LookBook;


