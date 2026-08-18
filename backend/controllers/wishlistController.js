const Wishlist = require('../models/favWishlist');

// 1. Add Item to Wishlist (விஷ்லிஸ்ட்டில் காரைச் சேர்த்தல்)
const addToWishlist = async (req, res) => {
  console.log("🔥 HIT ADD TO WISHLIST API! Body data:", req.body);
  try {
    const { carId } = req.body;
    const userId = req.user?._id || req.user?.id || req.body.user; 

    if (!carId) {
      return res.status(400).json({ success: false, message: 'Car ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // இந்த யூசருக்கு ஏற்கனவே விஷ்லிஸ்ட் உள்ளதா எனப் பார்த்தல்
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // இல்லை என்றால் புதிதாக விஷ்லிஸ்ட் உருவாக்கி காரைச் சேர்த்தல்
      wishlist = new Wishlist({
        user: userId,
        cars: [carId]
      });
    } else {
      // ஏற்கனவே இருந்தால், அந்த கார் ஏற்கனவே உள்ளதா எனச் சரிபார்த்தல் (ObjectId ஒப்பீடு பாதுகாப்புடன்)
      const carExists = wishlist.cars.some(id => id.toString() === carId.toString());
      if (carExists) {
        return res.status(400).json({ success: false, message: 'Car is already in your wishlist' });
      }
      // இல்லையெனில் கார்களின் பட்டியலோடு புதிய காரைச் சேர்த்தல்
      wishlist.cars.push(carId);
    }

    await wishlist.save();
    console.log("✅ Car added to wishlist successfully!");

    res.status(201).json({ 
      success: true, 
      message: 'Item added to wishlist successfully!', 
      wishlist 
    });
  } catch (error) {
    console.error("❌ Wishlist Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get All Wishlist Items for the logged-in user
const getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.query.user;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // விஷ்லிஸ்ட்டை எடுத்து, உள்ளே இருக்கும் 'cars' விபரங்களை populate செய்தல்
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate('cars');

    res.status(200).json({ 
      success: true, 
      wishlist: wishlist ? wishlist.cars : [] 
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Remove Item from Wishlist (விஷ்லிஸ்ட்டிலிருந்து குறிப்பிட்ட காரை நீக்குதல்)
const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params; // இங்கே 'id' என்பது காரின் ID (carId) ஆகும்
    const userId = req.user?._id || req.user?.id || req.body.user;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Car ID parameter is required' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    // குறிப்பிட்ட காரை மட்டும் பாதுகாப்பாக அறேயிலிருந்து நீக்குதல்
    wishlist.cars = wishlist.cars.filter(carId => carId.toString() !== id.toString());
    await wishlist.save();

    res.status(200).json({ success: true, message: 'Item removed from wishlist successfully!', wishlist });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};