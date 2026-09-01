const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String, // ObjectId-க்கு பதிலாக String ஆக மாற்றப்பட்டுள்ளது
        required: true
    },
    category: {
        type: String, // ObjectId-க்கு பதிலாக String ஆக மாற்றப்பட்டுள்ளது
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Car', carSchema);