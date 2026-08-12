const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required!']
  },
  cars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }]
}, {
  timestamps: true
});

const FavWishlist = mongoose.model('FavWishlist', wishlistSchema);

module.exports = FavWishlist;