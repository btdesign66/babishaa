// BABISHA - Lehenga Collection Website JavaScript
console.log('BABISHA script loaded successfully!');

// Global Variables
let currentUser = null;
let fabricData = [];
let filteredFabrics = [];
let currentPageNumber = 1;
let itemsPerPage = 6;

// Sample Fabric Data - All Collections
const sampleFabrics = [
    {
        id: 1,
        name: "RANI Collection - Style 1",
        category: "lehenga",
        price: 5051,
        originalPrice: 6631,
        image: "images/lehengas/02__RANI_TAARANI-A1.jpeg",
        description: "Elegant RANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 140,
        onSale: true,
        savings: 26
    },
    {
        id: 2,
        name: "RANI Collection - Style 2",
        category: "lehenga",
        price: 3805,
        originalPrice: 5328,
        image: "images/lehengas/02__RANI_TAARANI-A2.jpeg",
        description: "Elegant RANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 88,
        onSale: true,
        savings: 22
    },
    {
        id: 3,
        name: "RANI Collection - Style 3",
        category: "lehenga",
        price: 4454,
        originalPrice: 5684,
        image: "images/lehengas/02__RANI_TAARANI-A3.jpeg",
        description: "Elegant RANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 110,
        onSale: true,
        savings: 27
    },
    {
        id: 4,
        name: "RANI Collection - Style 4",
        category: "lehenga",
        price: 3593,
        originalPrice: 4990,
        image: "images/lehengas/02__RANI_TAARANI-A4.jpeg",
        description: "Elegant RANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 184,
        onSale: true,
        savings: 25
    },
    {
        id: 5,
        name: "RANIKA Collection - Style 1",
        category: "lehenga",
        price: 5287,
        originalPrice: 6832,
        image: "images/lehengas/03__RANIKA_TAARANI-B1.jpeg",
        description: "Elegant RANIKA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 81,
        onSale: true,
        savings: 24
    },
    {
        id: 6,
        name: "RANIKA Collection - Style 2",
        category: "lehenga",
        price: 3547,
        originalPrice: 5461,
        image: "images/lehengas/03__RANIKA_TAARANI-B2.jpeg",
        description: "Elegant RANIKA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 62,
        onSale: true,
        savings: 20
    },
    {
        id: 7,
        name: "RANIKA Collection - Style 3",
        category: "lehenga",
        price: 3704,
        originalPrice: 5623,
        image: "images/lehengas/03__RANIKA_TAARANI-B3.jpeg",
        description: "Elegant RANIKA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 62,
        onSale: true,
        savings: 27
    },
    {
        id: 8,
        name: "RANIKA Collection - Style 4",
        category: "lehenga",
        price: 3895,
        originalPrice: 5164,
        image: "images/lehengas/03__RANIKA_TAARANI-B4.jpeg",
        description: "Elegant RANIKA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 180,
        onSale: true,
        savings: 23
    },
    {
        id: 9,
        name: "RUPA Collection - Style 1",
        category: "lehenga",
        price: 4325,
        originalPrice: 5480,
        image: "images/lehengas/04__RUPA_TAARANI-C1.jpeg",
        description: "Elegant RUPA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 107,
        onSale: true,
        savings: 22
    },
    {
        id: 10,
        name: "RUPA Collection - Style 2",
        category: "lehenga",
        price: 3661,
        originalPrice: 4872,
        image: "images/lehengas/04__RUPA_TAARANI-C2.jpeg",
        description: "Elegant RUPA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 52,
        onSale: true,
        savings: 27
    },
    {
        id: 11,
        name: "RUPA Collection - Style 3",
        category: "lehenga",
        price: 5224,
        originalPrice: 6778,
        image: "images/lehengas/04__RUPA_TAARANI-C3.jpeg",
        description: "Elegant RUPA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 161,
        onSale: true,
        savings: 27
    },
    {
        id: 12,
        name: "RUPA Collection - Style 4",
        category: "lehenga",
        price: 3927,
        originalPrice: 5017,
        image: "images/lehengas/04__RUPA_TAARANI-C4.jpeg",
        description: "Elegant RUPA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 69,
        onSale: true,
        savings: 21
    },
    {
        id: 13,
        name: "RANO Collection - Style 1",
        category: "lehenga",
        price: 4564,
        originalPrice: 6457,
        image: "images/lehengas/05__RANO_TAARANI-D1.jpeg",
        description: "Elegant RANO collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 133,
        onSale: true,
        savings: 29
    },
    {
        id: 14,
        name: "RANO Collection - Style 2",
        category: "lehenga",
        price: 3674,
        originalPrice: 5098,
        image: "images/lehengas/05__RANO_TAARANI-D2.jpeg",
        description: "Elegant RANO collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 55,
        onSale: true,
        savings: 27
    },
    {
        id: 15,
        name: "RANO Collection - Style 3",
        category: "lehenga",
        price: 4841,
        originalPrice: 6246,
        image: "images/lehengas/05__RANO_TAARANI-D3.jpeg",
        description: "Elegant RANO collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 84,
        onSale: true,
        savings: 21
    },
    {
        id: 16,
        name: "RANO Collection - Style 4",
        category: "lehenga",
        price: 5215,
        originalPrice: 6873,
        image: "images/lehengas/05__RANO_TAARANI-D4.jpeg",
        description: "Elegant RANO collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 133,
        onSale: true,
        savings: 23
    },
    {
        id: 17,
        name: "RADHA Collection - Style 1",
        category: "lehenga",
        price: 4236,
        originalPrice: 5833,
        image: "images/lehengas/06__RADHA_TAARANI-E1.jpeg",
        description: "Elegant RADHA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 81,
        onSale: true,
        savings: 24
    },
    {
        id: 18,
        name: "RADHA Collection - Style 2",
        category: "lehenga",
        price: 4629,
        originalPrice: 6585,
        image: "images/lehengas/06__RADHA_TAARANI-E2.jpeg",
        description: "Elegant RADHA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 85,
        onSale: true,
        savings: 22
    },
    {
        id: 19,
        name: "RADHA Collection - Style 3",
        category: "lehenga",
        price: 4498,
        originalPrice: 6428,
        image: "images/lehengas/06__RADHA_TAARANI-E3.jpeg",
        description: "Elegant RADHA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 159,
        onSale: true,
        savings: 24
    },
    {
        id: 20,
        name: "RADHA Collection - Style 4",
        category: "lehenga",
        price: 5322,
        originalPrice: 6920,
        image: "images/lehengas/06__RADHA_TAARANI-E4.jpeg",
        description: "Elegant RADHA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 182,
        onSale: true,
        savings: 29
    },
    {
        id: 21,
        name: "ALIA Collection - Style 1",
        category: "lehenga",
        price: 4374,
        originalPrice: 5500,
        image: "images/lehengas/07__ALIA_UNIQUE-A1.jpeg",
        description: "Elegant ALIA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 60,
        onSale: true,
        savings: 26
    },
    {
        id: 22,
        name: "ALIA Collection - Style 2",
        category: "lehenga",
        price: 4551,
        originalPrice: 6287,
        image: "images/lehengas/07__ALIA_UNIQUE-A2.jpeg",
        description: "Elegant ALIA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 131,
        onSale: true,
        savings: 20
    },
    {
        id: 23,
        name: "AMARA Collection - Style 1",
        category: "lehenga",
        price: 4300,
        originalPrice: 6023,
        image: "images/lehengas/08__AMARA_UNIQUE-B1.jpeg",
        description: "Elegant AMARA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 192,
        onSale: true,
        savings: 28
    },
    {
        id: 24,
        name: "AMARA Collection - Style 2",
        category: "lehenga",
        price: 4176,
        originalPrice: 5384,
        image: "images/lehengas/08__AMARA_UNIQUE-B2.jpeg",
        description: "Elegant AMARA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 191,
        onSale: true,
        savings: 28
    },
    {
        id: 25,
        name: "ANAYA Collection - Style 1",
        category: "lehenga",
        price: 3884,
        originalPrice: 4960,
        image: "images/lehengas/09__ANAYA_UNIQUE-C1.jpeg",
        description: "Elegant ANAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 168,
        onSale: true,
        savings: 29
    },
    {
        id: 26,
        name: "ANAYA Collection - Style 2",
        category: "lehenga",
        price: 4008,
        originalPrice: 5428,
        image: "images/lehengas/09__ANAYA_UNIQUE-C2.jpeg",
        description: "Elegant ANAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 162,
        onSale: true,
        savings: 21
    },
    {
        id: 27,
        name: "AVNI Collection - Style 1",
        category: "lehenga",
        price: 4960,
        originalPrice: 6858,
        image: "images/lehengas/10__AVNI_UNIQUE-D1.jpeg",
        description: "Elegant AVNI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 168,
        onSale: true,
        savings: 24
    },
    {
        id: 28,
        name: "AVNI Collection - Style 2",
        category: "lehenga",
        price: 3531,
        originalPrice: 5519,
        image: "images/lehengas/10__AVNI_UNIQUE-D2.jpeg",
        description: "Elegant AVNI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 76,
        onSale: true,
        savings: 24
    },
    {
        id: 29,
        name: "AAYRA Collection - Style 1",
        category: "lehenga",
        price: 5330,
        originalPrice: 7268,
        image: "images/lehengas/11__AAYRA_UNIQUE-E1.jpeg",
        description: "Elegant AAYRA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 59,
        onSale: true,
        savings: 28
    },
    {
        id: 30,
        name: "AAYRA Collection - Style 2",
        category: "lehenga",
        price: 3731,
        originalPrice: 5405,
        image: "images/lehengas/11__AAYRA_UNIQUE-E2.jpeg",
        description: "Elegant AAYRA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 107,
        onSale: true,
        savings: 23
    },
    {
        id: 31,
        name: "ADITI Collection - Style 1",
        category: "lehenga",
        price: 5432,
        originalPrice: 7030,
        image: "images/lehengas/12__ADITI_UNIQUE-F1.jpeg",
        description: "Elegant ADITI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 122,
        onSale: true,
        savings: 29
    },
    {
        id: 32,
        name: "ADITI Collection - Style 2",
        category: "lehenga",
        price: 4539,
        originalPrice: 5544,
        image: "images/lehengas/12__ADITI_UNIQUE-F2.jpeg",
        description: "Elegant ADITI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 51,
        onSale: true,
        savings: 24
    },
    {
        id: 33,
        name: "ANJALI Collection - Style 1",
        category: "lehenga",
        price: 4836,
        originalPrice: 6803,
        image: "images/lehengas/13__ANJALI_UNIQUE-G1.jpeg",
        description: "Elegant ANJALI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 127,
        onSale: true,
        savings: 26
    },
    {
        id: 34,
        name: "ANJALI Collection - Style 2",
        category: "lehenga",
        price: 3500,
        originalPrice: 5467,
        image: "images/lehengas/13__ANJALI_UNIQUE-G2.jpeg",
        description: "Elegant ANJALI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 78,
        onSale: true,
        savings: 28
    },
    {
        id: 35,
        name: "AARIKA Collection - Style 1",
        category: "lehenga",
        price: 4100,
        originalPrice: 5566,
        image: "images/lehengas/14__AARIKA_UNIQUE-H1.jpeg",
        description: "Elegant AARIKA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 78,
        onSale: true,
        savings: 28
    },
    {
        id: 36,
        name: "AARIKA Collection - Style 2",
        category: "lehenga",
        price: 3507,
        originalPrice: 4556,
        image: "images/lehengas/14__AARIKA_UNIQUE-H2.jpeg",
        description: "Elegant AARIKA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 169,
        onSale: true,
        savings: 23
    },
    {
        id: 37,
        name: "AMORA Collection - Style 1",
        category: "lehenga",
        price: 5035,
        originalPrice: 7023,
        image: "images/lehengas/15__AMORA_UNIQUE-I1.jpeg",
        description: "Elegant AMORA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 158,
        onSale: true,
        savings: 24
    },
    {
        id: 38,
        name: "AMORA Collection - Style 2",
        category: "lehenga",
        price: 5224,
        originalPrice: 7004,
        image: "images/lehengas/15__AMORA_UNIQUE-I2.jpeg",
        description: "Elegant AMORA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 83,
        onSale: true,
        savings: 28
    },
    {
        id: 39,
        name: "BAANI Collection - Style 1",
        category: "lehenga",
        price: 5412,
        originalPrice: 7276,
        image: "images/lehengas/16__BAANI_A1.jpeg",
        description: "Elegant BAANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 68,
        onSale: true,
        savings: 20
    },
    {
        id: 40,
        name: "BAANI Collection - Style 2",
        category: "lehenga",
        price: 4992,
        originalPrice: 6464,
        image: "images/lehengas/16__BAANI_A2.jpeg",
        description: "Elegant BAANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 102,
        onSale: true,
        savings: 23
    },
    {
        id: 41,
        name: "BAANI Collection - Style 3",
        category: "lehenga",
        price: 3771,
        originalPrice: 5028,
        image: "images/lehengas/16__BAANI_A3.jpeg",
        description: "Elegant BAANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 111,
        onSale: true,
        savings: 27
    },
    {
        id: 42,
        name: "BINAL Collection - Style 1",
        category: "lehenga",
        price: 4361,
        originalPrice: 5815,
        image: "images/lehengas/17__BINAL_B1.jpeg",
        description: "Elegant BINAL collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 66,
        onSale: true,
        savings: 28
    },
    {
        id: 43,
        name: "BINAL Collection - Style 2",
        category: "lehenga",
        price: 4164,
        originalPrice: 6121,
        image: "images/lehengas/17__BINAL_B2.jpeg",
        description: "Elegant BINAL collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 159,
        onSale: true,
        savings: 21
    },
    {
        id: 44,
        name: "BINAL Collection - Style 3",
        category: "lehenga",
        price: 4473,
        originalPrice: 5488,
        image: "images/lehengas/17__BINAL_B3.jpeg",
        description: "Elegant BINAL collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 82,
        onSale: true,
        savings: 21
    },
    {
        id: 45,
        name: "BELA Collection - Style 1",
        category: "lehenga",
        price: 4677,
        originalPrice: 6641,
        image: "images/lehengas/18__BELA_A1.jpeg",
        description: "Elegant BELA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 160,
        onSale: true,
        savings: 20
    },
    {
        id: 46,
        name: "BELA Collection - Style 2",
        category: "lehenga",
        price: 3720,
        originalPrice: 4754,
        image: "images/lehengas/18__BELA_A2.jpeg",
        description: "Elegant BELA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 154,
        onSale: true,
        savings: 22
    },
    {
        id: 47,
        name: "BELA Collection - Style 3",
        category: "lehenga",
        price: 4945,
        originalPrice: 6406,
        image: "images/lehengas/18__BELA_A3.jpeg",
        description: "Elegant BELA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 81,
        onSale: true,
        savings: 26
    },
    {
        id: 48,
        name: "BINITA Collection - Style 1",
        category: "lehenga",
        price: 4023,
        originalPrice: 5186,
        image: "images/lehengas/20__BINITA_B1.jpeg",
        description: "Elegant BINITA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 139,
        onSale: true,
        savings: 29
    },
    {
        id: 49,
        name: "BINITA Collection - Style 2",
        category: "lehenga",
        price: 5394,
        originalPrice: 7387,
        image: "images/lehengas/20__BINITA_B2.jpeg",
        description: "Elegant BINITA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 139,
        onSale: true,
        savings: 24
    },
    {
        id: 50,
        name: "BINITA Collection - Style 3",
        category: "lehenga",
        price: 4460,
        originalPrice: 5893,
        image: "images/lehengas/20__BINITA_B3.jpeg",
        description: "Elegant BINITA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 72,
        onSale: true,
        savings: 29
    },
    {
        id: 51,
        name: "BRIJA Collection - Style 1",
        category: "lehenga",
        price: 4716,
        originalPrice: 5848,
        image: "images/lehengas/21__BRIJA_C1.jpeg",
        description: "Elegant BRIJA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 62,
        onSale: true,
        savings: 27
    },
    {
        id: 52,
        name: "BRIJA Collection - Style 2",
        category: "lehenga",
        price: 4260,
        originalPrice: 5445,
        image: "images/lehengas/21__BRIJA_C2.jpeg",
        description: "Elegant BRIJA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 63,
        onSale: true,
        savings: 24
    },
    {
        id: 53,
        name: "CHITRA Collection - Style 1",
        category: "lehenga",
        price: 4046,
        originalPrice: 5257,
        image: "images/lehengas/22__CHITRA_B1.jpeg",
        description: "Elegant CHITRA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 82,
        onSale: true,
        savings: 26
    },
    {
        id: 54,
        name: "CHITRA Collection - Style 2",
        category: "lehenga",
        price: 5462,
        originalPrice: 6490,
        image: "images/lehengas/22__CHITRA_B2.jpeg",
        description: "Elegant CHITRA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 141,
        onSale: true,
        savings: 22
    },
    {
        id: 55,
        name: "CHITRA Collection - Style 3",
        category: "lehenga",
        price: 4929,
        originalPrice: 6670,
        image: "images/lehengas/22__CHITRA_B3.jpeg",
        description: "Elegant CHITRA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 57,
        onSale: true,
        savings: 20
    },
    {
        id: 56,
        name: "CHITRA Collection - Style 4",
        category: "lehenga",
        price: 5031,
        originalPrice: 6990,
        image: "images/lehengas/22__CHITRA_B4.jpeg",
        description: "Elegant CHITRA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 94,
        onSale: true,
        savings: 21
    },
    {
        id: 57,
        name: "CHARMI Collection - Style 1",
        category: "lehenga",
        price: 5355,
        originalPrice: 7151,
        image: "images/lehengas/23__CHARMI_A1.jpeg",
        description: "Elegant CHARMI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 67,
        onSale: true,
        savings: 24
    },
    {
        id: 58,
        name: "CHARMI Collection - Style 2",
        category: "lehenga",
        price: 3652,
        originalPrice: 4849,
        image: "images/lehengas/23__CHARMI_A2.jpeg",
        description: "Elegant CHARMI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 186,
        onSale: true,
        savings: 22
    },
    {
        id: 59,
        name: "CHARMI Collection - Style 3",
        category: "lehenga",
        price: 5350,
        originalPrice: 6890,
        image: "images/lehengas/23__CHARMI_A3.jpeg",
        description: "Elegant CHARMI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 91,
        onSale: true,
        savings: 28
    },
    {
        id: 60,
        name: "CHARMI Collection - Style 4",
        category: "lehenga",
        price: 5375,
        originalPrice: 7264,
        image: "images/lehengas/23__CHARMI_A4.jpeg",
        description: "Elegant CHARMI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 98,
        onSale: true,
        savings: 21
    },
    {
        id: 61,
        name: "CHHAYA Collection - Style 1",
        category: "lehenga",
        price: 3512,
        originalPrice: 5484,
        image: "images/lehengas/24__CHHAYA_A1.jpeg",
        description: "Elegant CHHAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 95,
        onSale: true,
        savings: 25
    },
    {
        id: 62,
        name: "CHHAYA Collection - Style 2",
        category: "lehenga",
        price: 4867,
        originalPrice: 5940,
        image: "images/lehengas/24__CHHAYA_A2.jpeg",
        description: "Elegant CHHAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 104,
        onSale: true,
        savings: 28
    },
    {
        id: 63,
        name: "CHHAYA Collection - Style 3",
        category: "lehenga",
        price: 4911,
        originalPrice: 6745,
        image: "images/lehengas/24__CHHAYA_A3.jpeg",
        description: "Elegant CHHAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 85,
        onSale: true,
        savings: 23
    },
    {
        id: 64,
        name: "CHHAYA Collection - Style 4",
        category: "lehenga",
        price: 4530,
        originalPrice: 5746,
        image: "images/lehengas/24__CHHAYA_A4.jpeg",
        description: "Elegant CHHAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 190,
        onSale: true,
        savings: 24
    },
    {
        id: 65,
        name: "CHHAYA Collection - Style 5",
        category: "lehenga",
        price: 4308,
        originalPrice: 5450,
        image: "images/lehengas/24__CHHAYA_A5.jpeg",
        description: "Elegant CHHAYA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 60,
        onSale: true,
        savings: 20
    },
    {
        id: 66,
        name: "CHANDANI Collection - Style 1",
        category: "lehenga",
        price: 5035,
        originalPrice: 6396,
        image: "images/lehengas/25__CHANDANI_B1.jpeg",
        description: "Elegant CHANDANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 120,
        onSale: true,
        savings: 26
    },
    {
        id: 67,
        name: "CHANDANI Collection - Style 2",
        category: "lehenga",
        price: 5227,
        originalPrice: 6768,
        image: "images/lehengas/25__CHANDANI_B2.jpeg",
        description: "Elegant CHANDANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 123,
        onSale: true,
        savings: 23
    },
    {
        id: 68,
        name: "CHANDANI Collection - Style 3",
        category: "lehenga",
        price: 4604,
        originalPrice: 6221,
        image: "images/lehengas/25__CHANDANI_B3.jpeg",
        description: "Elegant CHANDANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 192,
        onSale: true,
        savings: 23
    },
    {
        id: 69,
        name: "CHANDANI Collection - Style 4",
        category: "lehenga",
        price: 4956,
        originalPrice: 6546,
        image: "images/lehengas/25__CHANDANI_B4.jpeg",
        description: "Elegant CHANDANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 165,
        onSale: true,
        savings: 26
    },
    {
        id: 70,
        name: "CHANDANI Collection - Style 5",
        category: "lehenga",
        price: 3938,
        originalPrice: 5044,
        image: "images/lehengas/25__CHANDANI_B5.jpeg",
        description: "Elegant CHANDANI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 155,
        onSale: true,
        savings: 28
    },
    {
        id: 71,
        name: "CHETVI Collection - Style 1",
        category: "lehenga",
        price: 5226,
        originalPrice: 6755,
        image: "images/lehengas/26__CHETVI_C1.jpeg",
        description: "Elegant CHETVI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 72,
        onSale: true,
        savings: 28
    },
    {
        id: 72,
        name: "CHETVI Collection - Style 2",
        category: "lehenga",
        price: 4244,
        originalPrice: 5387,
        image: "images/lehengas/26__CHETVI_C2.jpeg",
        description: "Elegant CHETVI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 120,
        onSale: true,
        savings: 26
    },
    {
        id: 73,
        name: "CHETVI Collection - Style 3",
        category: "lehenga",
        price: 3606,
        originalPrice: 5301,
        image: "images/lehengas/26__CHETVI_C3.jpeg",
        description: "Elegant CHETVI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 85,
        onSale: true,
        savings: 26
    },
    {
        id: 74,
        name: "CHETVI Collection - Style 4",
        category: "lehenga",
        price: 3784,
        originalPrice: 5245,
        image: "images/lehengas/26__CHETVI_C4.jpeg",
        description: "Elegant CHETVI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 145,
        onSale: true,
        savings: 20
    },
    {
        id: 75,
        name: "CHETVI Collection - Style 5",
        category: "lehenga",
        price: 3904,
        originalPrice: 5706,
        image: "images/lehengas/26__CHETVI_C5.jpeg",
        description: "Elegant CHETVI collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 91,
        onSale: true,
        savings: 23
    },
    {
        id: 76,
        name: "1 Collection - Style 1",
        category: "lehenga",
        price: 4757,
        originalPrice: 6538,
        image: "images/lehengas/27_1__DIYA_A1.jpeg",
        description: "Elegant 1 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 107,
        onSale: true,
        savings: 27
    },
    {
        id: 77,
        name: "1 Collection - Style 2",
        category: "lehenga",
        price: 4591,
        originalPrice: 5732,
        image: "images/lehengas/27_1__DIYA_A2.jpeg",
        description: "Elegant 1 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 82,
        onSale: true,
        savings: 29
    },
    {
        id: 78,
        name: "1 Collection - Style 3",
        category: "lehenga",
        price: 4606,
        originalPrice: 5786,
        image: "images/lehengas/27_1__DIYA_A3.jpeg",
        description: "Elegant 1 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 53,
        onSale: true,
        savings: 27
    },
    {
        id: 79,
        name: "1 Collection - Style 4",
        category: "lehenga",
        price: 5184,
        originalPrice: 7133,
        image: "images/lehengas/27_1__DIYA_A4.jpeg",
        description: "Elegant 1 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 133,
        onSale: true,
        savings: 26
    },
    {
        id: 80,
        name: "2 Collection - Style 1",
        category: "lehenga",
        price: 5363,
        originalPrice: 6528,
        image: "images/lehengas/27_2__DHARA_B1.jpeg",
        description: "Elegant 2 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 148,
        onSale: true,
        savings: 26
    },
    {
        id: 81,
        name: "2 Collection - Style 2",
        category: "lehenga",
        price: 4603,
        originalPrice: 5658,
        image: "images/lehengas/27_2__DHARA_B2.jpeg",
        description: "Elegant 2 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 173,
        onSale: true,
        savings: 20
    },
    {
        id: 82,
        name: "2 Collection - Style 3",
        category: "lehenga",
        price: 4357,
        originalPrice: 6354,
        image: "images/lehengas/27_2__DHARA_B3.jpeg",
        description: "Elegant 2 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 125,
        onSale: true,
        savings: 22
    },
    {
        id: 83,
        name: "2 Collection - Style 4",
        category: "lehenga",
        price: 3589,
        originalPrice: 5573,
        image: "images/lehengas/27_2__DHARA_B4.jpeg",
        description: "Elegant 2 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 156,
        onSale: true,
        savings: 28
    },
    {
        id: 84,
        name: "3 Collection - Style 1",
        category: "lehenga",
        price: 4739,
        originalPrice: 6299,
        image: "images/lehengas/27_3__DEVIKA_C1.jpeg",
        description: "Elegant 3 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 67,
        onSale: true,
        savings: 20
    },
    {
        id: 85,
        name: "3 Collection - Style 2",
        category: "lehenga",
        price: 4274,
        originalPrice: 5893,
        image: "images/lehengas/27_3__DEVIKA_C2.jpeg",
        description: "Elegant 3 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 167,
        onSale: true,
        savings: 29
    },
    {
        id: 86,
        name: "3 Collection - Style 3",
        category: "lehenga",
        price: 4022,
        originalPrice: 5967,
        image: "images/lehengas/27_3__DEVIKA_C3.jpeg",
        description: "Elegant 3 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 187,
        onSale: true,
        savings: 24
    },
    {
        id: 87,
        name: "3 Collection - Style 4",
        category: "lehenga",
        price: 5074,
        originalPrice: 6718,
        image: "images/lehengas/27_3__DEVIKA_C4.jpeg",
        description: "Elegant 3 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 130,
        onSale: true,
        savings: 27
    },
    {
        id: 88,
        name: "4 Collection - Style 1",
        category: "lehenga",
        price: 4864,
        originalPrice: 5940,
        image: "images/lehengas/27_4__DAMINI_D1.jpeg",
        description: "Elegant 4 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 101,
        onSale: true,
        savings: 27
    },
    {
        id: 89,
        name: "4 Collection - Style 2",
        category: "lehenga",
        price: 4624,
        originalPrice: 6163,
        image: "images/lehengas/27_4__DAMINI_D2.jpeg",
        description: "Elegant 4 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 117,
        onSale: true,
        savings: 24
    },
    {
        id: 90,
        name: "4 Collection - Style 3",
        category: "lehenga",
        price: 4596,
        originalPrice: 6513,
        image: "images/lehengas/27_4__DAMINI_D3.jpeg",
        description: "Elegant 4 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 113,
        onSale: true,
        savings: 22
    },
    {
        id: 91,
        name: "4 Collection - Style 4",
        category: "lehenga",
        price: 4014,
        originalPrice: 5084,
        image: "images/lehengas/27_4__DAMINI_D4.jpeg",
        description: "Elegant 4 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 136,
        onSale: true,
        savings: 28
    },
    {
        id: 92,
        name: "5 Collection - Style 1",
        category: "lehenga",
        price: 4640,
        originalPrice: 6473,
        image: "images/lehengas/27_5__DOYITA_E1.jpeg",
        description: "Elegant 5 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 138,
        onSale: true,
        savings: 28
    },
    {
        id: 93,
        name: "5 Collection - Style 2",
        category: "lehenga",
        price: 5289,
        originalPrice: 6605,
        image: "images/lehengas/27_5__DOYITA_E2.jpeg",
        description: "Elegant 5 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 111,
        onSale: true,
        savings: 26
    },
    {
        id: 94,
        name: "5 Collection - Style 3",
        category: "lehenga",
        price: 5213,
        originalPrice: 6697,
        image: "images/lehengas/27_5__DOYITA_E3.jpeg",
        description: "Elegant 5 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 177,
        onSale: true,
        savings: 29
    },
    {
        id: 95,
        name: "6 Collection - Style 1",
        category: "lehenga",
        price: 4399,
        originalPrice: 5812,
        image: "images/lehengas/27_6__DAYA_F1.jpeg",
        description: "Elegant 6 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 193,
        onSale: true,
        savings: 21
    },
    {
        id: 96,
        name: "6 Collection - Style 2",
        category: "lehenga",
        price: 3899,
        originalPrice: 5234,
        image: "images/lehengas/27_6__DAYA_F2.jpeg",
        description: "Elegant 6 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 113,
        onSale: true,
        savings: 29
    },
    {
        id: 97,
        name: "6 Collection - Style 3",
        category: "lehenga",
        price: 4117,
        originalPrice: 5622,
        image: "images/lehengas/27_6__DAYA_F3.jpeg",
        description: "Elegant 6 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 134,
        onSale: true,
        savings: 24
    },
    {
        id: 98,
        name: "6 Collection - Style 4",
        category: "lehenga",
        price: 3728,
        originalPrice: 5220,
        image: "images/lehengas/27_6__DAYA_F4.jpeg",
        description: "Elegant 6 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 187,
        onSale: true,
        savings: 28
    },
    {
        id: 99,
        name: "7 Collection - Style 1",
        category: "lehenga",
        price: 3698,
        originalPrice: 5509,
        image: "images/lehengas/27_7__DALIHA_G1.jpeg",
        description: "Elegant 7 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 57,
        onSale: true,
        savings: 25
    },
    {
        id: 100,
        name: "7 Collection - Style 2",
        category: "lehenga",
        price: 3915,
        originalPrice: 5476,
        image: "images/lehengas/27_7__DALIHA_G2.jpeg",
        description: "Elegant 7 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 142,
        onSale: true,
        savings: 25
    },
    {
        id: 101,
        name: "7 Collection - Style 3",
        category: "lehenga",
        price: 5397,
        originalPrice: 6720,
        image: "images/lehengas/27_7__DALIHA_G3.jpeg",
        description: "Elegant 7 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 195,
        onSale: true,
        savings: 23
    },
    {
        id: 102,
        name: "7 Collection - Style 4",
        category: "lehenga",
        price: 4387,
        originalPrice: 5912,
        image: "images/lehengas/27_7__DALIHA_G4.jpeg",
        description: "Elegant 7 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 84,
        onSale: true,
        savings: 27
    },
    {
        id: 103,
        name: "7 Collection - Style 5",
        category: "lehenga",
        price: 4957,
        originalPrice: 6392,
        image: "images/lehengas/27_7__DALIHA_G5.jpeg",
        description: "Elegant 7 collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 175,
        onSale: true,
        savings: 23
    },
    {
        id: 104,
        name: "ERIS Collection - Style 1",
        category: "lehenga",
        price: 3636,
        originalPrice: 5234,
        image: "images/lehengas/28__ERIS_A1.jpeg",
        description: "Elegant ERIS collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 140,
        onSale: true,
        savings: 29
    },
    {
        id: 105,
        name: "ERIS Collection - Style 2",
        category: "lehenga",
        price: 3620,
        originalPrice: 5274,
        image: "images/lehengas/28__ERIS_A2.jpeg",
        description: "Elegant ERIS collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 76,
        onSale: true,
        savings: 21
    },
    {
        id: 106,
        name: "ERIS Collection - Style 3",
        category: "lehenga",
        price: 3652,
        originalPrice: 5032,
        image: "images/lehengas/28__ERIS_A3.jpeg",
        description: "Elegant ERIS collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 102,
        onSale: true,
        savings: 22
    },
    {
        id: 107,
        name: "ERIS Collection - Style 4",
        category: "lehenga",
        price: 4865,
        originalPrice: 6256,
        image: "images/lehengas/28__ERIS_A4.jpeg",
        description: "Elegant ERIS collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 160,
        onSale: true,
        savings: 27
    },
    {
        id: 108,
        name: "EKTA Collection - Style 1",
        category: "lehenga",
        price: 4549,
        originalPrice: 6141,
        image: "images/lehengas/29__EKTA_E1.jpeg",
        description: "Elegant EKTA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 155,
        onSale: true,
        savings: 26
    },
    {
        id: 109,
        name: "EKTA Collection - Style 2",
        category: "lehenga",
        price: 5206,
        originalPrice: 7161,
        image: "images/lehengas/29__EKTA_E2.jpeg",
        description: "Elegant EKTA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 72,
        onSale: true,
        savings: 20
    },
    {
        id: 110,
        name: "EKTA Collection - Style 3",
        category: "lehenga",
        price: 4775,
        originalPrice: 6650,
        image: "images/lehengas/29__EKTA_E3.jpeg",
        description: "Elegant EKTA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 93,
        onSale: true,
        savings: 27
    },
    {
        id: 111,
        name: "EKTA Collection - Style 4",
        category: "lehenga",
        price: 4715,
        originalPrice: 6074,
        image: "images/lehengas/29__EKTA_E4.jpeg",
        description: "Elegant EKTA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 185,
        onSale: true,
        savings: 21
    },
    {
        id: 112,
        name: "EKTA Collection - Style 5",
        category: "lehenga",
        price: 3709,
        originalPrice: 5468,
        image: "images/lehengas/29__EKTA_E5.jpeg",
        description: "Elegant EKTA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 122,
        onSale: true,
        savings: 24
    },
    {
        id: 113,
        name: "FALAK Collection - Style 1",
        category: "lehenga",
        price: 3985,
        originalPrice: 5810,
        image: "images/lehengas/30__FALAK_A1.jpeg",
        description: "Elegant FALAK collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 112,
        onSale: true,
        savings: 29
    },
    {
        id: 114,
        name: "FALAK Collection - Style 2",
        category: "lehenga",
        price: 5068,
        originalPrice: 6491,
        image: "images/lehengas/30__FALAK_A2.jpeg",
        description: "Elegant FALAK collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 119,
        onSale: true,
        savings: 26
    },
    {
        id: 115,
        name: "FALAK Collection - Style 3",
        category: "lehenga",
        price: 3715,
        originalPrice: 5327,
        image: "images/lehengas/30__FALAK_A3.jpeg",
        description: "Elegant FALAK collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 121,
        onSale: true,
        savings: 29
    },
    {
        id: 116,
        name: "FALAK Collection - Style 4",
        category: "lehenga",
        price: 5307,
        originalPrice: 6931,
        image: "images/lehengas/30__FALAK_A4.jpeg",
        description: "Elegant FALAK collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 59,
        onSale: true,
        savings: 28
    },
    {
        id: 117,
        name: "FIA Collection - Style 1",
        category: "lehenga",
        price: 5282,
        originalPrice: 6707,
        image: "images/lehengas/31__FIA_B1.jpeg",
        description: "Elegant FIA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 83,
        onSale: true,
        savings: 29
    },
    {
        id: 118,
        name: "FIA Collection - Style 2",
        category: "lehenga",
        price: 5420,
        originalPrice: 7328,
        image: "images/lehengas/31__FIA_B2.jpeg",
        description: "Elegant FIA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 135,
        onSale: true,
        savings: 23
    },
    {
        id: 119,
        name: "FIA Collection - Style 3",
        category: "lehenga",
        price: 4428,
        originalPrice: 6074,
        image: "images/lehengas/31__FIA_B3.jpeg",
        description: "Elegant FIA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 138,
        onSale: true,
        savings: 20
    },
    {
        id: 120,
        name: "FIA Collection - Style 4",
        category: "lehenga",
        price: 4430,
        originalPrice: 5725,
        image: "images/lehengas/31__FIA_B4.jpeg",
        description: "Elegant FIA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.7,
        reviews: 88,
        onSale: true,
        savings: 28
    },
    {
        id: 121,
        name: "FATIMA Collection - Style 1",
        category: "lehenga",
        price: 3765,
        originalPrice: 4824,
        image: "images/lehengas/32__FATIMA_C1.jpeg",
        description: "Elegant FATIMA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 173,
        onSale: true,
        savings: 22
    },
    {
        id: 122,
        name: "FATIMA Collection - Style 2",
        category: "lehenga",
        price: 4251,
        originalPrice: 5787,
        image: "images/lehengas/32__FATIMA_C2.jpeg",
        description: "Elegant FATIMA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 5,
        reviews: 141,
        onSale: true,
        savings: 23
    },
    {
        id: 123,
        name: "FATIMA Collection - Style 3",
        category: "lehenga",
        price: 5438,
        originalPrice: 7005,
        image: "images/lehengas/32__FATIMA_C3.jpeg",
        description: "Elegant FATIMA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.8,
        reviews: 80,
        onSale: true,
        savings: 28
    },
    {
        id: 124,
        name: "FATIMA Collection - Style 4",
        category: "lehenga",
        price: 4533,
        originalPrice: 5648,
        image: "images/lehengas/32__FATIMA_C4.jpeg",
        description: "Elegant FATIMA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 86,
        onSale: true,
        savings: 26
    },
    {
        id: 125,
        name: "FEMINA Collection - Style 1",
        category: "lehenga",
        price: 5131,
        originalPrice: 6183,
        image: "images/lehengas/33__FEMINA_D1.jpeg",
        description: "Elegant FEMINA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 102,
        onSale: true,
        savings: 26
    },
    {
        id: 126,
        name: "FEMINA Collection - Style 2",
        category: "lehenga",
        price: 4124,
        originalPrice: 5327,
        image: "images/lehengas/33__FEMINA_D2.jpeg",
        description: "Elegant FEMINA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 128,
        onSale: true,
        savings: 23
    },
    {
        id: 127,
        name: "FEMINA Collection - Style 3",
        category: "lehenga",
        price: 4497,
        originalPrice: 5838,
        image: "images/lehengas/33__FEMINA_D3.jpeg",
        description: "Elegant FEMINA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.9,
        reviews: 170,
        onSale: true,
        savings: 28
    },
    {
        id: 128,
        name: "FEMINA Collection - Style 4",
        category: "lehenga",
        price: 4149,
        originalPrice: 5676,
        image: "images/lehengas/33__FEMINA_D4.jpeg",
        description: "Elegant FEMINA collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions.",
        specifications: {
            gsm: "320-380",
            material: "Silk Blend with Embroidery",
            width: "44 inches",
            colors: "Multi-color with Golden Work",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.6,
        reviews: 81,
        onSale: true,
        savings: 27
    }
];


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize immediately
    initializeApp();
    initializeInteractiveFeatures();
    
    // Also try after a short delay as fallback
    setTimeout(function() {
        console.log('Fallback initialization triggered');
        const currentPage = getCurrentPage();
        if (currentPage === 'products') {
            if (fabricData && fabricData.length > 0 && (!filteredFabrics || filteredFabrics.length === 0)) {
                filteredFabrics = [...fabricData];
            }
            displayFabrics();
        }
    }, 500);
});

// Initialize App Function
function initializeApp() {
    console.log('Initializing app...');
    fabricData = [...sampleFabrics];
    filteredFabrics = [...fabricData];
    
    console.log('Fabric data loaded:', fabricData.length, 'fabrics');
    console.log('Sample fabrics array length:', sampleFabrics.length);
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);
    
    switch(currentPage) {
        case 'products':
            console.log('Initializing products page...');
            initializeProductsPage();
            break;
        case 'index':
            console.log('Initializing home page...');
            initializeHomePage();
            break;
        default:
            console.log('Initializing general page...');
            initializeGeneralPage();
    }
}

// Get Current Page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('products.html')) return 'products';
    if (path.includes('index.html') || path === '/') return 'index';
    return 'general';
}

// Initialize Products Page
function initializeProductsPage() {
    console.log('Setting up products page...');
    
    // Ensure filteredFabrics is initialized with all products
    if (filteredFabrics.length === 0) {
        filteredFabrics = [...fabricData];
    }
    
    initializeFilters();
    initializeSearch();
    initializeSorting();
    initializePagination();
    initializeMobileFilterSidebar();
    
    // Handle URL parameters first (this will call displayFabrics if needed)
    const hasURLParams = handleURLParameters();
    
    // Only display fabrics if handleURLParameters didn't already do it
    if (!hasURLParams) {
        console.log('No URL parameters, displaying all fabrics...');
        console.log('filteredFabrics.length:', filteredFabrics.length);
        console.log('fabricData.length:', fabricData.length);
        
        // Ensure we have fabrics to display
        if (filteredFabrics.length === 0 && fabricData.length > 0) {
            console.log('filteredFabrics is empty, resetting from fabricData');
            filteredFabrics = [...fabricData];
        }
        
        if (filteredFabrics.length > 0) {
            displayFabrics();
        } else {
            console.error('No fabrics available to display!');
        }
    }
}

// Initialize Mobile Filter Sidebar Toggle
function initializeMobileFilterSidebar() {
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (!filterSidebar) return;
    
    const filterTitle = filterSidebar.querySelector('h5');
    if (!filterTitle) return;
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add click handler to toggle sidebar
        filterTitle.style.cursor = 'pointer';
        filterTitle.addEventListener('click', function() {
            filterSidebar.classList.toggle('collapsed');
        });
        
        // Initially collapse on mobile
        filterSidebar.classList.add('collapsed');
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow && !filterTitle.hasAttribute('data-mobile-initialized')) {
            filterTitle.style.cursor = 'pointer';
            filterTitle.addEventListener('click', function() {
                filterSidebar.classList.toggle('collapsed');
            });
            filterTitle.setAttribute('data-mobile-initialized', 'true');
        }
    });
}

// Initialize Home Page
function initializeHomePage() {
    // Home page specific initialization
    console.log('Home page initialized');
}

// Initialize General Page
function initializeGeneralPage() {
    // General page initialization
    console.log('General page initialized');
}

// Display Fabrics
function displayFabrics() {
    console.log('Display fabrics called');
    const fabricGrid = document.getElementById('fabricGrid');
    console.log('Fabric grid element:', fabricGrid);
    
    if (!fabricGrid) {
        console.error('Fabric grid element not found!');
        return;
    }
    
    // Ensure we have products to display
    if (!filteredFabrics || filteredFabrics.length === 0) {
        console.warn('No filtered fabrics, using all fabric data');
        if (fabricData && fabricData.length > 0) {
            filteredFabrics = [...fabricData];
        } else if (sampleFabrics && sampleFabrics.length > 0) {
            fabricData = [...sampleFabrics];
            filteredFabrics = [...fabricData];
        } else {
            console.error('No fabric data available!');
            fabricGrid.innerHTML = '<div class="col-12"><p class="text-center text-danger">No products available. Please check the console for errors.</p></div>';
            return;
        }
    }
    
    console.log('Displaying fabrics:', filteredFabrics.length);
    
    fabricGrid.innerHTML = '';
    
    if (filteredFabrics.length === 0) {
        fabricGrid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No products found matching your criteria.</p></div>';
        updateResultsCount();
        currentPageNumber = 1;
        updatePagination();
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredFabrics.length / itemsPerPage);
    if (currentPageNumber > totalPages) {
        currentPageNumber = totalPages;
    }
    if (currentPageNumber < 1) {
        currentPageNumber = 1;
    }
    
    // Get items for current page
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageFabrics = filteredFabrics.slice(startIndex, endIndex);
    
    console.log('Total fabrics:', filteredFabrics.length);
    console.log('Current page:', currentPageNumber);
    console.log('Items per page:', itemsPerPage);
    console.log('Start index:', startIndex);
    console.log('End index:', endIndex);
    console.log('Fabrics for current page:', currentPageFabrics.length);
    
    if (currentPageFabrics.length === 0) {
        console.warn('No fabrics to display for current page!');
        fabricGrid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No products found for this page.</p></div>';
        updateResultsCount();
        updatePagination();
        return;
    }
    
    currentPageFabrics.forEach(fabric => {
        const fabricCard = createFabricCard(fabric);
        if (fabricCard) {
            fabricGrid.appendChild(fabricCard);
        } else {
            console.error('Failed to create fabric card for:', fabric);
        }
    });
    
    console.log('Fabric cards created, updating results...');
    updateResultsCount();
    updatePagination();
}

// Create Fabric Card
function createFabricCard(fabric) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    const savingsText = fabric.onSale ? 
        `<span class="badge bg-danger me-2">Save ${fabric.savings}%</span>` : '';
    
    col.innerHTML = `
        <div class="fabric-card h-100">
            <div class="fabric-image position-relative">
                ${savingsText}
                <img src="${fabric.image}" alt="${fabric.name}" class="img-fluid">
                <div class="product-overlay">
                    <div class="quick-actions">
                        <button class="btn btn-light btn-sm" onclick="viewFabricDetails(${fabric.id})">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="orderNow(${fabric.id})">
                            <i class="fab fa-whatsapp me-1"></i>Order Now
                        </button>
                    </div>
                </div>
            </div>
            <div class="fabric-info p-3">
                <h5 class="fabric-name mb-2">${fabric.name}</h5>
                <p class="fabric-description text-muted small mb-2">${fabric.description}</p>
                <div class="fabric-specs mb-2">
                    <small class="text-muted">
                        <strong>GSM:</strong> ${fabric.specifications.gsm} | 
                        <strong>Width:</strong> ${fabric.specifications.width} | 
                        <strong>Origin:</strong> ${fabric.specifications.origin}
                    </small>
                </div>
                <div class="fabric-rating mb-2">
                    <div class="stars">
                        ${generateStars(fabric.rating)}
                    </div>
                    <small class="text-muted ms-2">${fabric.reviews} reviews</small>
                </div>
                <div class="fabric-price">
                    <span class="current-price h5 text-primary">â‚¹${fabric.price.toLocaleString()}/meter</span>
                    ${fabric.onSale ? `<span class="original-price text-muted text-decoration-line-through ms-2">â‚¹${fabric.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="fabric-supplier mt-2">
                    <small class="text-muted">Supplier: ${fabric.supplier}</small>
                </div>
                <!-- Always visible buttons below product info -->
                <div class="fabric-actions mt-3">
                    <button class="btn btn-outline-secondary btn-sm me-2" onclick="viewFabricDetails(${fabric.id})">
                        <i class="fas fa-eye me-1"></i>View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="window.open('https://wa.me/919624113555?text=Hi! I am interested in ordering this product:%0A%0A*${fabric.name}*%0APrice: â‚¹${fabric.price.toLocaleString()}/meter%0A${fabric.onSale ? `Original Price: â‚¹${fabric.originalPrice.toLocaleString()} (Save ${fabric.savings}%)%0A` : ''}Description: ${fabric.description}%0A%0ASpecifications:%0A- GSM: ${fabric.specifications.gsm}%0A- Material: ${fabric.specifications.material}%0A- Width: ${fabric.specifications.width}%0A- Colors: ${fabric.specifications.colors}%0A- Origin: ${fabric.specifications.origin}%0A%0ASupplier: ${fabric.supplier}%0A%0APlease let me know about availability and ordering process. Thank you!', '_blank')">
                        <i class="fab fa-whatsapp me-1"></i>Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Generate Stars
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

// Initialize Filters
function initializeFilters() {
    const filterInputs = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', applyFilters);
    }
}

// Apply Filters
function applyFilters() {
    const selectedCategories = getSelectedCategories();
    const priceRange = getPriceRange();
    
    filteredFabrics = fabricData.filter(fabric => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(fabric.category);
        const priceMatch = fabric.price >= priceRange.min && fabric.price <= priceRange.max;
        
        return categoryMatch && priceMatch;
    });
    
    // Reset to first page when filters change
    currentPageNumber = 1;
    displayFabrics();
}

// Get Selected Categories
function getSelectedCategories() {
    const selected = [];
    const categoryInputs = document.querySelectorAll('.filter-option input[type="checkbox"]:checked');
    
    // Check if "All Fabrics" is selected
    const allCheckbox = document.getElementById('cat-all');
    if (allCheckbox && allCheckbox.checked) {
        return []; // Return empty array to show all categories
    }
    
    categoryInputs.forEach(input => {
        if (input.value !== 'all') {
            selected.push(input.value);
        }
    });
    
    // If no categories are selected via checkboxes, check URL parameter
    if (selected.length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category === 'lehengas') {
            selected.push('lehenga');
        } else if (category === 'sarees') {
            selected.push('sarees');
        } else if (category) {
            selected.push(category);
        }
    }
    
    return selected;
}

// Get Price Range
function getPriceRange() {
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange) {
        return {
            min: parseInt(minPrice?.value) || 0,
            max: parseInt(priceRange.value) || 10000
        };
    }
    
    return { min: 0, max: 10000 };
}

// Initialize Search
function initializeSearch() {
    const searchInput = document.getElementById('fabricSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle Search
function handleSearch() {
    const searchTerm = document.getElementById('fabricSearch').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredFabrics = [...fabricData];
    } else {
        filteredFabrics = fabricData.filter(fabric => 
            fabric.name.toLowerCase().includes(searchTerm) ||
            fabric.description.toLowerCase().includes(searchTerm) ||
            fabric.category.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPageNumber = 1;
    displayFabrics();
}

// Initialize Sorting
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
}

// Apply Sorting
function applySorting() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'price-low':
            filteredFabrics.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredFabrics.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredFabrics.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredFabrics.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredFabrics.sort((a, b) => b.id - a.id);
            break;
        default:
            // Keep original order
            break;
    }
    
    currentPageNumber = 1;
    displayFabrics();
}

// Initialize Pagination
function initializePagination() {
    // Simple pagination implementation
    updatePagination();
}

// Update Pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredFabrics.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    // Ensure currentPageNumber is within valid range
    if (currentPageNumber > totalPages) {
        currentPageNumber = totalPages;
    }
    if (currentPageNumber < 1) {
        currentPageNumber = 1;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPageNumber > 1) {
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1" onclick="goToPage(${currentPageNumber - 1})" title="Previous">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
    }
    
    // Always show first page
    if (currentPageNumber > 3) {
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1 ${currentPageNumber === 1 ? 'active' : ''}" onclick="goToPage(1)">
                1
            </button>
        `;
        if (currentPageNumber > 4) {
            paginationHTML += `<span class="me-1" style="padding: 0.375rem 0.5rem;">...</span>`;
        }
    }
    
    // Show pages around current page
    const startPage = Math.max(1, currentPageNumber - 2);
    const endPage = Math.min(totalPages, currentPageNumber + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPageNumber ? 'active' : '';
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1 ${isActive}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Always show last page
    if (currentPageNumber < totalPages - 2) {
        if (currentPageNumber < totalPages - 3) {
            paginationHTML += `<span class="me-1" style="padding: 0.375rem 0.5rem;">...</span>`;
        }
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1 ${currentPageNumber === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">
                ${totalPages}
            </button>
        `;
    }
    
    // Next button
    if (currentPageNumber < totalPages) {
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1" onclick="goToPage(${currentPageNumber + 1})" title="Next">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    pagination.innerHTML = paginationHTML;
    
    // Update showing range
    updateShowingRange();
}

// Update Showing Range
function updateShowingRange() {
    const showingRange = document.getElementById('showingRange');
    if (!showingRange) return;
    
    const start = (currentPageNumber - 1) * itemsPerPage + 1;
    const end = Math.min(currentPageNumber * itemsPerPage, filteredFabrics.length);
    
    showingRange.textContent = `${start}-${end}`;
}

// Go to Page
function goToPage(page) {
    currentPageNumber = page;
    displayFabrics();
    updatePagination();
    
    // Scroll to top of products
    const productsSection = document.querySelector('.products-container');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update Results Count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const totalResults = document.getElementById('totalResults');
    
    const count = filteredFabrics ? filteredFabrics.length : 0;
    
    if (resultsCount) {
        resultsCount.textContent = `${count} fabrics found`;
    }
    
    if (totalResults) {
        totalResults.textContent = count.toString();
    }
    
    // showingRange is now updated in updateShowingRange()
    updateShowingRange();
}

// Handle URL Parameters
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const collection = urlParams.get('collection');
    const occasion = urlParams.get('occasion');
    const fabric = urlParams.get('fabric');
    
    // If no category parameter, don't display yet (let initializeProductsPage handle it)
    if (!category && !collection && !occasion && !fabric) {
        console.log('No URL parameters found');
        filteredFabrics = [...fabricData];
        console.log('filteredFabrics set to:', filteredFabrics.length);
        return false; // Return false to indicate no URL params, so caller can handle display
    }
    
    if (category) {
        // Check the appropriate checkbox
        if (category === 'lehengas') {
            const lehengaCheckbox = document.getElementById('cat-lehenga');
            if (lehengaCheckbox) {
                lehengaCheckbox.checked = true;
            }
            // Uncheck "All Fabrics"
            const allCheckbox = document.getElementById('cat-all');
            if (allCheckbox) {
                allCheckbox.checked = false;
            }
        } else if (category === 'sarees') {
            const sareesCheckbox = document.getElementById('cat-sarees');
            if (sareesCheckbox) {
                sareesCheckbox.checked = true;
            }
            // Uncheck "All Fabrics"
            const allCheckbox = document.getElementById('cat-all');
            if (allCheckbox) {
                allCheckbox.checked = false;
            }
        }
        
        // Filter by category - handle both 'lehenga' and 'lehengas'
        filteredFabrics = fabricData.filter(fabric => {
            // Handle both singular and plural forms
            if (category === 'lehengas' && fabric.category === 'lehenga') {
                return true;
            }
            return fabric.category === category;
        });
        displayFabrics();
        return true; // Return true to indicate we handled URL params and displayed
    } else if (collection || occasion || fabric) {
        // For collection, occasion, or fabric parameters, show all products for now
        // (since products don't have these properties yet)
        filteredFabrics = [...fabricData];
        displayFabrics();
        return true; // Return true to indicate we handled URL params and displayed
    }
    
    return false;
}

// Interactive Features
function initializeInteractiveFeatures() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize modals
    initializeModals();
    
    // Add event listeners for Order Now buttons
    setTimeout(function() {
        console.log('ðŸ”§ Setting up Order Now button listeners...');
        const orderButtons = document.querySelectorAll('.order-now-btn');
        console.log('ðŸ” Found', orderButtons.length, 'Order Now buttons');
        
        orderButtons.forEach(function(button, index) {
            console.log(`ðŸ”˜ Button ${index + 1}:`, button);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('ðŸ–±ï¸ Order Now button clicked via event listener!');
                const fabricId = this.getAttribute('data-fabric-id');
                console.log('ðŸ†” Fabric ID from data attribute:', fabricId);
                orderNow(fabricId);
            });
        });
    }, 1000);
}

// Initialize Modals
function initializeModals() {
    // Login modal
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register modal
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Inquiry modal
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquiry);
    }
}

// Modal Functions
function openLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function openRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function openInquiryModal() {
    const modal = new bootstrap.Modal(document.getElementById('inquiryModal'));
    modal.show();
}

// Form Handlers
function handleLogin(e) {
    e.preventDefault();
    // Handle login logic
    console.log('Login form submitted');
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
}

function handleRegister(e) {
    e.preventDefault();
    // Handle registration logic
    console.log('Register form submitted');
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
}

function handleInquiry(e) {
    e.preventDefault();
    // Handle inquiry logic
    console.log('Inquiry form submitted');
    bootstrap.Modal.getInstance(document.getElementById('inquiryModal')).hide();
}

// WhatsApp Order Function
// Order Now Function - WhatsApp Integration
function orderNow(fabricId) {
    console.log('ðŸŽ¯ Order Now clicked for fabric ID:', fabricId);
    console.log('ðŸ” Current fabricData:', fabricData);
    
    const fabric = fabricData.find(f => f.id === fabricId);
    if (fabric) {
        console.log('âœ… Found fabric:', fabric.name);
        console.log('ðŸ“± Creating WhatsApp message...');
        const message = `Hi! I'm interested in ordering this fabric:

*${fabric.name}*
Price: â‚¹${fabric.price.toLocaleString()}/meter
${fabric.onSale ? `Original Price: â‚¹${fabric.originalPrice.toLocaleString()} (Save ${fabric.savings}%)` : ''}

Description: ${fabric.description}

Specifications:
- GSM: ${fabric.specifications.gsm}
- Material: ${fabric.specifications.material}
- Width: ${fabric.specifications.width}
- Colors: ${fabric.specifications.colors}
- Origin: ${fabric.specifications.origin}

Supplier: ${fabric.supplier}

Please let me know about availability and ordering process. Thank you!`;

        const whatsappUrl = `https://wa.me/919624113555?text=${encodeURIComponent(message)}`;
        console.log('ðŸ”— WhatsApp URL created:', whatsappUrl);
        window.open(whatsappUrl, '_blank');
        console.log('âœ… WhatsApp opened successfully!');
    } else {
        console.error('âŒ Fabric not found for ID:', fabricId);
        console.log('ðŸ” Available fabric IDs:', fabricData.map(f => f.id));
        alert('Sorry, there was an error finding this product. Please try again.');
    }
}

// Cart Functions (kept for compatibility)
function addToCart(fabricId) {
    // Redirect to WhatsApp instead
    orderNow(fabricId);
}

function openCart() {
    console.log('Opening cart');
    // Cart logic here
}

function openWishlist() {
    console.log('Opening wishlist');
    // Wishlist logic here
}

// Fabric Details
function viewFabricDetails(fabricId) {
    const fabric = fabricData.find(f => f.id === fabricId);
    if (fabric) {
        // Open fabric details modal or navigate to details page
        console.log('Viewing details for:', fabric.name);
    }
}

// Filter Functions
function toggleFilterSection(element) {
    const options = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (options.style.display === 'none' || options.style.display === '') {
        options.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        options.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

function clearAllFilters() {
    // Reset all filter inputs
    const filterInputs = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.checked = false;
    });
    
    // Reset price range
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange) {
        priceRange.value = 5000;
    }
    if (minPrice) {
        minPrice.value = 500;
    }
    if (maxPrice) {
        maxPrice.value = 5000;
    }
    
    // Reset search
    const searchInput = document.getElementById('fabricSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'featured';
    }
    
    // Reset filters
    filteredFabrics = [...fabricData];
    currentPageNumber = 1;
    displayFabrics();
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fallback initialization with timeout
setTimeout(function() {
    const fabricGrid = document.getElementById('fabricGrid');
    if (fabricGrid && fabricGrid.innerHTML.includes('Loading fabrics')) {
        console.log('Fallback initialization triggered');
        displayFabrics();
    }
}, 2000);

// Test function to verify buttons are working
function testOrderNow() {
    console.log('ðŸ§ª Testing Order Now function...');
    if (fabricData.length > 0) {
        console.log('ðŸ” Testing with first fabric:', fabricData[0]);
        orderNow(fabricData[0].id);
    } else {
        console.log('âŒ No fabric data available for testing');
    }
}

// Simple test function
function testClick() {
    console.log('ðŸ–±ï¸ Test click function called!');
    alert('Test click is working!');
}

// Direct WhatsApp order function
function orderNowDirect(fabricId) {
    console.log('ðŸŽ¯ Order Now Direct clicked for fabric ID:', fabricId);
    console.log('ðŸ” Current fabricData:', fabricData);
    console.log('ðŸ” fabricData length:', fabricData ? fabricData.length : 'undefined');
    
    const fabric = fabricData.find(f => f.id === fabricId);
    console.log('ðŸ” Found fabric:', fabric);
    
    if (fabric) {
        console.log('âœ… Found fabric:', fabric.name);
        const message = `Hi! I am interested in ordering ${fabric.name} - Price: â‚¹${fabric.price.toLocaleString()}/meter. Please tell me more about availability and ordering process.`;
        console.log('ðŸ“ Message:', message);
        
        const whatsappUrl = `https://wa.me/919624113555?text=${encodeURIComponent(message)}`;
        console.log('ðŸ”— Opening WhatsApp:', whatsappUrl);
        
        try {
            window.open(whatsappUrl, '_blank');
            console.log('âœ… WhatsApp window opened successfully!');
        } catch (error) {
            console.error('âŒ Error opening WhatsApp:', error);
            alert('Error opening WhatsApp. Please try again.');
        }
    } else {
        console.error('âŒ Fabric not found for ID:', fabricId);
        console.log('ðŸ” Available fabric IDs:', fabricData ? fabricData.map(f => f.id) : 'No fabric data');
        alert('Sorry, there was an error finding this product. Please try again.');
    }
}

// Test WhatsApp function
function testWhatsApp() {
    console.log('ðŸ“± Testing WhatsApp directly...');
    window.open('https://wa.me/919624113555?text=Hi! This is a test message from BABISHA website.', '_blank');
}

// Export functions for global access
window.addToCart = addToCart;
window.orderNow = orderNow;
window.orderNowDirect = orderNowDirect;
window.testOrderNow = testOrderNow;
window.testClick = testClick;
window.testWhatsApp = testWhatsApp;
window.openCart = openCart;
window.openWishlist = openWishlist;
window.viewFabricDetails = viewFabricDetails;
window.toggleFilterSection = toggleFilterSection;
window.clearAllFilters = clearAllFilters;
window.initializeMobileFilterSidebar = initializeMobileFilterSidebar;
window.openLoginModal = openLoginModal;
window.goToPage = goToPage;
window.updateShowingRange = updateShowingRange;

window.openRegisterModal = openRegisterModal;
window.openInquiryModal = openInquiryModal;

// Hero Carousel Functionality
let currentHeroSlide = 0;
let heroSlideInterval = null;

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    if (slides.length === 0) return;
    
    // First, hide all slides explicitly
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.visibility = 'hidden';
        slide.style.pointerEvents = 'none';
        slide.style.zIndex = '0';
    });
    
    // Reset current slide
    currentHeroSlide = 0;
    
    // Set initial slide
    showSlide(0);
    
    // Auto-play is disabled - slides only change on manual navigation
}

function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    if (slides.length === 0) return;
    
    // Ensure index is within bounds
    if (index >= slides.length) {
        currentHeroSlide = 0;
    } else if (index < 0) {
        currentHeroSlide = slides.length - 1;
    } else {
        currentHeroSlide = index;
    }
    
    // Update slides - ensure only one is visible
    slides.forEach((slide, i) => {
        if (i === currentHeroSlide) {
            slide.classList.add('active');
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.pointerEvents = 'auto';
            slide.style.zIndex = '1';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.pointerEvents = 'none';
            slide.style.zIndex = '0';
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === currentHeroSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    currentHeroSlide += direction;
    
    if (currentHeroSlide >= slides.length) {
        currentHeroSlide = 0;
    } else if (currentHeroSlide < 0) {
        currentHeroSlide = slides.length - 1;
    }
    
    showSlide(currentHeroSlide);
}

function currentSlide(index) {
    showSlide(index - 1); // Convert to 0-based index
}

// Make functions globally available
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// Initialize carousel when DOM is ready
function initializeCarousel() {
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
        initHeroCarousel();
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarousel);
} else {
    initializeCarousel();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (document.querySelectorAll('.hero-slide.active').length === 0) {
        initHeroCarousel();
    }
});

