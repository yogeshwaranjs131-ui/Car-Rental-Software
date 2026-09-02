const express = require('express');
const router = express.Router();

// 1. தற்காலிகமாக ஒரு சாதாரண டெஸ்ட் கண்ட்ரோலரை நாமே உள்ளே உருவாக்குவோம்
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Reviews route is working perfectly!' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Review created successfully!' });
});

module.exports = router;