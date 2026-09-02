const fs = require('fs');
const path = require('path');

/**
 * Utility function to delete an image file from the server uploads folder
 * @param {String} imagePath - Relative path of the image (e.g., '/uploads/cars/car-123.jpg')
 */
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  // If the image is an external URL (like Unsplash or Cloudinary), do not delete locally
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return;
  }

  // Clean the path to get the absolute path on the server
  // Removes leading slash if present to join correctly
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const absolutePath = path.join(__dirname, '..', cleanPath);

  // Check if file exists, then delete
  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(absolutePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Failed to delete image file: ${unlinkErr.message}`);
        } else {
          console.log(`Successfully deleted image file: ${absolutePath}`);
        }
      });
    }
  });
};

module.exports = {
  deleteImageFile
};