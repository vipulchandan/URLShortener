const mongoose = require('mongoose');
const validator = require('validator');

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        required: [true, 'Please provide a urlCode'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    longUrl: {
        type: String,
        required: [true, 'Please provide a longUrl'],
        validate: {
            validator: (value) => {
                const urlRegex =  /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
                return urlRegex.test(value);
            },
            message: 'Please provide a valid url!',
        }
    },
    shortUrl: {
        type: String,
        required: [true, 'Please provide a shortUrl'],
        unique: true,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('URLShortener', urlSchema);