const mongoose = require('mongoose');
const Car = require('../models/Car');
require('dotenv').config();

const carsData = [
    // --- HATCHBACKS (8 Cars) ---
    { 
        name: "Swift", 
        brand: "Maruti", 
        category: "Hatchback", 
        pricePerDay: 1500, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800",
        isAvailable: true 
    },
    { 
        name: "WagonR", 
        brand: "Maruti", 
        category: "Hatchback", 
        pricePerDay: 1300, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c351?w=800",
        isAvailable: true 
    },
    { 
        name: "i10", 
        brand: "Hyundai", 
        category: "Hatchback", 
        pricePerDay: 1400, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://www.greencarguide.co.uk/wp-content/uploads/2010/09/Hyundai_i10_1500x850-1500x850.jpg",
        isAvailable: true 
    },
    { 
        name: "Baleno", 
        brand: "Maruti", 
        category: "Hatchback", 
        pricePerDay: 1600, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        isAvailable: true 
    },
    { 
        name: "Altroz", 
        brand: "Tata", 
        category: "Hatchback", 
        pricePerDay: 1700, 
        seats: 5, 
        fuelType: "diesel", 
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
        isAvailable: true 
    },
    { 
        name: "Tiago", 
        brand: "Tata", 
        category: "Hatchback", 
        pricePerDay: 1200, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800",
        isAvailable: true 
    },
    { 
        name: "Glanza", 
        brand: "Toyota", 
        category: "Hatchback", 
        pricePerDay: 1800, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1599912027806-cfec9f5944b6?w=800",
        isAvailable: true 
    },
    { 
        name: "Grand i10", 
        brand: "Hyundai", 
        category: "Hatchback", 
        pricePerDay: 1500, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://www.greencarguide.co.uk/wp-content/uploads/2010/09/Hyundai_i10_1500x850-1500x850.jpg",
        isAvailable: true 
    },

    // --- SEDANS (8 Cars) ---
    { 
        name: "Dzire", 
        brand: "Maruti", 
        category: "Sedan", 
        pricePerDay: 2000, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800",
        isAvailable: true 
    },
    { 
        name: "Honda City", 
        brand: "Honda", 
        category: "Sedan", 
        pricePerDay: 2500, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=800",
        isAvailable: true 
    },
    { 
        name: "Verna", 
        brand: "Hyundai", 
        category: "Sedan", 
        pricePerDay: 2600, 
        seats: 5, 
        fuelType: "diesel", 
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
        isAvailable: true 
    },
    { 
        name: "Ciaz", 
        brand: "Maruti", 
        category: "Sedan", 
        pricePerDay: 2200, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
        isAvailable: true 
    },
    { 
        name: "Aura", 
        brand: "Hyundai", 
        category: "Sedan", 
        pricePerDay: 1900, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800",
        isAvailable: true 
    },
    { 
        name: "Virtus", 
        brand: "Volkswagen", 
        category: "Sedan", 
        pricePerDay: 3000, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
        isAvailable: true 
    },
    { 
        name: "Slavia", 
        brand: "Skoda", 
        category: "Sedan", 
        pricePerDay: 2900, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
        isAvailable: true 
    },
    { 
        name: "Accord", 
        brand: "Honda", 
        category: "Sedan", 
        pricePerDay: 3200, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
        isAvailable: true 
    },

    // --- SUVS (10 Cars) ---
    { 
        name: "Creta", 
        brand: "Hyundai", 
        category: "SUV", 
        pricePerDay: 3500, 
        seats: 5, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUD5-N2gK_k3dU_ixuBYYfMvG_EmHiSPOlr2d25iP2Ow&s=10",
        isAvailable: true 
    },
    { 
        name: "Scorpio", 
        brand: "Mahindra", 
        category: "SUV", 
        pricePerDay: 3800, 
        seats: 7, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRydnpF-qrE5Em6RSXwPvs42RzIrgyfdmQbbHKS42ivWQ&s=10",
        isAvailable: true 
    },
    { 
        name: "Thar", 
        brand: "Mahindra", 
        category: "SUV", 
        pricePerDay: 4000, 
        seats: 4, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSatpTlpICUSj4KrXAcnzrtDrSDT3YiqBM82xX6wJDdEQ&s=10",
        isAvailable: true 
    },
    { 
        name: "Innova Crysta", 
        brand: "Toyota", 
        category: "SUV", 
        pricePerDay: 4500, 
        seats: 7, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAfBFzWzRjiZ63mYZrjKKa6GvWa8qXOJGfql7xNS-cCA&s=10",
        isAvailable: true 
    },
    { 
        name: "Seltos", 
        brand: "Kia", 
        category: "SUV", 
        pricePerDay: 3400, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReKQynp9VSfur2Ev6VUy7ItzpT88xD5GttpLLRbHPiSg&s=10",
        isAvailable: true 
    },
    { 
        name: "Nexon", 
        brand: "Tata", 
        category: "SUV", 
        pricePerDay: 2500, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
        isAvailable: true 
    },
    { 
        name: "Harrier", 
        brand: "Tata", 
        category: "SUV", 
        pricePerDay: 3900, 
        seats: 5, 
        fuelType: "diesel", 
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
        isAvailable: true 
    },
    { 
        name: "Fortuner", 
        brand: "Toyota", 
        category: "SUV", 
        pricePerDay: 6000, 
        seats: 7, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNjWme-5_Cwa2uaZR51WlQf5NWroMfMWiv22schUo2yA&s=10",
        isAvailable: true 
    },
    { 
        name: "XUV700", 
        brand: "Mahindra", 
        category: "SUV", 
        pricePerDay: 4200, 
        seats: 7, 
        fuelType: "diesel", 
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
        isAvailable: true 
    },
    { 
        name: "Compass", 
        brand: "Jeep", 
        category: "SUV", 
        pricePerDay: 4800, 
        seats: 5, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStxNKkjfUQsPcxV6fwpm-j7XyS_EkM0xerm42c4HOEfQ&s=10",
        isAvailable: true 
    },

    // --- LUXURY (4 Cars) ---
    { 
        name: "BMW 3 Series", 
        brand: "BMW", 
        category: "Luxury", 
        pricePerDay: 9000, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        isAvailable: true 
    },
    { 
        name: "Audi A4", 
        brand: "Audi", 
        category: "Luxury", 
        pricePerDay: 9500, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800",
        isAvailable: true 
    },
    { 
        name: "Mercedes C-Class", 
        brand: "Mercedes", 
        category: "Luxury", 
        pricePerDay: 10000, 
        seats: 5, 
        fuelType: "petrol", 
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
        isAvailable: true 
    },
    { 
        name: "Defender", 
        brand: "Land Rover", 
        category: "Luxury", 
        pricePerDay: 15000, 
        seats: 7, 
        fuelType: "diesel", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjZJJdl1hxqpmzLeLGwXj8cP9O8WTjpDfbkl8kJPB0XQ&s=10",
        isAvailable: true 
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental-db');
        console.log('MongoDB Connected for Seeding...');

        // பழைய டேட்டாவை முழுமையாக நீக்கிவிட்டு 30 கார்களைச் சேர்க்கிறோம்
        await Car.deleteMany({});
        console.log('Old cars deleted successfully.');

        await Car.insertMany(carsData);
        console.log('All 30 Cars Added Successfully to MongoDB with Custom Images!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();