export const INITIAL_PRODUCTS = [
  {
    id: "tj-101",
    name: "The Solitaire Harmony Diamond Ring",
    sku: "TJ-RNG-01",
    category: "Rings",
    metal: "18K Yellow Gold",
    material: "Diamond",
    purity: "18K (750)",
    price: 48999,
    originalPrice: 59999,
    discount: 18,
    rating: 4.9,
    reviewCount: 42,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 14,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80"
    ],
    description: "An epitome of eternal devotion. The Solitaire Harmony ring features an exceptional hand-selected conflict-free solitaire diamond nestled in a timeless 18K yellow gold band with micropave accents.",
    specifications: {
      grossWeight: "3.42 g",
      netGoldWeight: "3.28 g",
      purity: "18K Hallmarked Gold",
      diamondWeight: "0.70 ct",
      diamondClarity: "VVS1 - E/F Colour Grade",
      certification: "IGI & BIS Hallmarked",
      dimensions: "Ring Width: 2.1mm | Head: 5.8mm"
    },
    availableSizes: ["10", "12", "14", "16", "18"],
    careInstructions: "Store individually in the provided velvet case. Clean periodically with a soft lint-free cloth and lukewarm soapy water.",
    reviews: [
      {
        id: "rev-1",
        author: "Meera Singhania",
        rating: 5,
        date: "2026-10-14",
        title: "Breathtaking brilliance and finish!",
        text: "The sparkle in person exceeds the photos. It arrived securely packed with the IGI certificate and BIS hallmark stamp. Absolutely in love with Tiwari Jewellers' craftsmanship.",
        verifiedBuyer: true
      },
      {
        id: "rev-2",
        author: "Aditya Roy",
        rating: 5,
        date: "2026-09-28",
        title: "Perfect engagement ring",
        text: "My fiancée was overwhelmed with joy. The ring size was exact and the gold band has a smooth, opulent feel.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-102",
    name: "Royal Polki Emerald Heritage Ring",
    sku: "TJ-RNG-02",
    category: "Rings",
    metal: "22K Yellow Gold",
    material: "Gold",
    purity: "22K (916)",
    price: 72500,
    originalPrice: 85000,
    discount: 15,
    rating: 4.8,
    reviewCount: 28,
    badge: "Festive Special",
    isNew: true,
    inStock: true,
    stockQuantity: 8,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Inspired by Rajasthani royal court treasures, this statement ring highlights an exquisite certified Zambian emerald framed by uncut Polki diamonds set in handcrafted 22K hallmarked gold with delicate floral enamelling.",
    specifications: {
      grossWeight: "7.85 g",
      netGoldWeight: "6.90 g",
      purity: "22K BIS 916 Gold",
      diamondWeight: "0.95 ct Polki Uncut",
      diamondClarity: "Natural Polki Uncut",
      certification: "BIS Hallmarked & SGL Authenticated",
      dimensions: "Ring Motif: 18mm x 14mm"
    },
    availableSizes: ["12", "14", "16", "18"],
    careInstructions: "Avoid contact with perfumes, hairsprays, or chemical solvents. Clean with dry microfibre cloth only.",
    reviews: [
      {
        id: "rev-3",
        author: "Kavita Maheshwari",
        rating: 5,
        date: "2026-10-20",
        title: "Regal and magnificent",
        text: "The emerald color is rich and royal. I wore it for Diwali dinner and received endless compliments.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-103",
    name: "Celeste Halo 925 Sterling Silver Ring",
    sku: "TJ-RNG-03",
    category: "Rings",
    metal: "925 Sterling Silver",
    material: "Silver",
    purity: "925 Silver",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.7,
    reviewCount: 64,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 25,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Graceful and luminous, the Celeste Halo Ring is sculpted in nickel-free 925 sterling silver with a triple rhodium protective coating and accented with AAA grade hand-faceted Swiss zirconia stones.",
    specifications: {
      grossWeight: "2.80 g",
      netGoldWeight: "N/A (Pure Silver)",
      purity: "92.5% Pure Sterling Silver",
      diamondWeight: "AAA Cubic Zirconia",
      diamondClarity: "Flawless Simulated Diamonds",
      certification: "925 Authenticity Stamp & Certificate",
      dimensions: "Halo Width: 8.5mm"
    },
    availableSizes: ["10", "12", "14", "16"],
    careInstructions: "Store in an airtight ziplock pouch. Rhodium plating protects against tarnishing for years.",
    reviews: [
      {
        id: "rev-4",
        author: "Ananya Deshmukh",
        rating: 5,
        date: "2026-10-05",
        title: "Looks just like real platinum & diamond!",
        text: "Incredible value for money. Perfect for everyday luxury and office wear.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-104",
    name: "Kundan Pearl Royal Maharani Jhumkas",
    sku: "TJ-EAR-01",
    category: "Earrings",
    metal: "22K Yellow Gold",
    material: "Gold",
    purity: "22K (916)",
    price: 68500,
    originalPrice: 79000,
    discount: 13,
    rating: 4.9,
    reviewCount: 38,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 6,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Capturing century-old royal craftsmanship, these 22K gold jhumkas showcase jadau kundan floral domes fringed with cultured seed pearls and ruby drops that sway gracefully with every movement.",
    specifications: {
      grossWeight: "14.20 g",
      netGoldWeight: "11.60 g",
      purity: "22K BIS 916 Hallmarked",
      diamondWeight: "Fine Kundan Stones",
      diamondClarity: "Grade A Polki Kundan",
      certification: "BIS Hallmarked",
      dimensions: "Length: 52mm | Dome Diameter: 24mm"
    },
    availableSizes: ["Standard"],
    careInstructions: "Wipe with a soft cotton cloth after wearing. Store flat in velvet lined box.",
    reviews: [
      {
        id: "rev-5",
        author: "Pooja Kapoor",
        rating: 5,
        date: "2026-09-15",
        title: "Heirloom grade jewelry piece",
        text: "The details on the jhumka dome are breathtaking. Felt like royalty wearing this on my sister's wedding.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-105",
    name: "Sparkling Cascade Diamond Chandelier Earrings",
    sku: "TJ-EAR-02",
    category: "Earrings",
    metal: "18K White Gold",
    material: "Diamond",
    purity: "18K (750)",
    price: 89999,
    originalPrice: 110000,
    discount: 18,
    rating: 5.0,
    reviewCount: 19,
    badge: "New Arrival",
    isNew: true,
    inStock: true,
    stockQuantity: 5,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Designed for gala evenings and red carpet moments. Three fluid tiers of brilliant-cut round and marquise diamonds suspend from an 18K white gold blossom post.",
    specifications: {
      grossWeight: "9.80 g",
      netGoldWeight: "8.40 g",
      purity: "18K White Gold Hallmarked",
      diamondWeight: "1.45 ct",
      diamondClarity: "VVS-VS / F-G Color",
      certification: "IGI Certified",
      dimensions: "Length: 44mm | Width: 16mm"
    },
    availableSizes: ["Standard"],
    careInstructions: "Avoid submerging in hot liquids. Ultrasonic cleaning recommended annually.",
    reviews: [
      {
        id: "rev-6",
        author: "Shreya Verma",
        rating: 5,
        date: "2026-10-11",
        title: "Spectacular shimmer!",
        text: "The diamonds reflect light like mirrors. The weight balance on the earlobe is very comfortable.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-106",
    name: "Dainty Blossom 925 Sterling Silver Studs",
    sku: "TJ-EAR-03",
    category: "Earrings",
    metal: "925 Sterling Silver",
    material: "Silver",
    purity: "925 Silver",
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    rating: 4.8,
    reviewCount: 51,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 40,
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Understated modern charm. Handcrafted floral petal motifs in certified 925 sterling silver with micro-pave zirconia centers. Hypoallergenic and perfect for daily wear.",
    specifications: {
      grossWeight: "1.95 g",
      netGoldWeight: "N/A",
      purity: "925 Sterling Silver",
      diamondWeight: "0.20 ct equiv Zirconia",
      diamondClarity: "AAA Grade",
      certification: "925 Silver Authenticity Hallmark",
      dimensions: "Diameter: 7mm"
    },
    availableSizes: ["Standard"],
    careInstructions: "Wipe with provided silver polishing cloth. Store in dry place.",
    reviews: [
      {
        id: "rev-7",
        author: "Neha Sharma",
        rating: 5,
        date: "2026-09-30",
        title: "Simple, chic and great quality",
        text: "Doesn't irritate sensitive ears at all. Beautiful packaging too!",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-107",
    name: "Maharani Polki Kundan Choker Necklace Set",
    sku: "TJ-NCK-01",
    category: "Necklaces",
    metal: "22K Yellow Gold",
    material: "Gold",
    purity: "22K (916)",
    price: 185000,
    originalPrice: 210000,
    discount: 12,
    rating: 5.0,
    reviewCount: 31,
    badge: "Festive Special",
    isNew: true,
    inStock: true,
    stockQuantity: 4,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611591475879-11c5e6d62888?auto=format&fit=crop&w=900&q=80"
    ],
    description: "A monumental masterwork of traditional Indian jewellery art. Features layers of authentic uncut polki diamonds, hand-enamelled meenakari backs, and Basra pearl tassels, accompanied by matching earrings.",
    specifications: {
      grossWeight: "38.50 g",
      netGoldWeight: "31.20 g",
      purity: "22K BIS 916 Hallmarked",
      diamondWeight: "3.20 ct Uncut Polki",
      diamondClarity: "Certified Heritage Polki",
      certification: "BIS Hallmark + SGL Certified",
      dimensions: "Choker Width: 32mm | Adjustable Dori"
    },
    availableSizes: ["Adjustable Dori"],
    careInstructions: "Store strictly in moisture-free velvet box. Do not expose to moisture or perfumes.",
    reviews: [
      {
        id: "rev-8",
        author: "Sunita Tiwari",
        rating: 5,
        date: "2026-10-18",
        title: "Bridal perfection!",
        text: "Wore this for my wedding reception. The heritage feel and gold luster are unmatched. Truly world-class craftsmanship from Tiwari Jewellers.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-108",
    name: "Eternity Solitaire Diamond Pendant Necklace",
    sku: "TJ-NCK-02",
    category: "Necklaces",
    metal: "18K Yellow Gold",
    material: "Diamond",
    purity: "18K (750)",
    price: 36500,
    originalPrice: 42000,
    discount: 13,
    rating: 4.9,
    reviewCount: 46,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 18,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Effortless poise. A sparkling 0.40 ct round brilliant diamond suspended on a 18-inch delicate 18K yellow gold cable chain with adjustable loops.",
    specifications: {
      grossWeight: "2.90 g",
      netGoldWeight: "2.82 g",
      purity: "18K Gold Hallmarked",
      diamondWeight: "0.40 ct",
      diamondClarity: "VVS2 / F Colour",
      certification: "IGI Certificate Included",
      dimensions: "Chain: 16-18 inches adjustable | Pendant: 6mm"
    },
    availableSizes: ["16-18 inch adjustable"],
    careInstructions: "Safe for everyday wear. Remove prior to strenuous exercise or swimming.",
    reviews: [
      {
        id: "rev-9",
        author: "Rhea Saxena",
        rating: 5,
        date: "2026-09-22",
        title: "Subtle and stunning",
        text: "I haven't taken it off since it arrived. Looks radiant on open necklines and collared shirts alike.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-109",
    name: "Opulent Emerald Cascade Necklace",
    sku: "TJ-NCK-03",
    category: "Necklaces",
    metal: "18K Rose Gold",
    material: "Rose Gold",
    purity: "18K (750)",
    price: 125000,
    originalPrice: 145000,
    discount: 14,
    rating: 4.9,
    reviewCount: 16,
    badge: "New Arrival",
    isNew: true,
    inStock: true,
    stockQuantity: 5,
    images: [
      "https://images.unsplash.com/photo-1611591475879-11c5e6d62888?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
    ],
    description: "A symphony of rich green teardrop Zambian emeralds accented with round brilliant diamonds, cast in romantic 18K rose gold.",
    specifications: {
      grossWeight: "22.40 g",
      netGoldWeight: "19.80 g",
      purity: "18K Rose Gold Hallmarked",
      diamondWeight: "1.15 ct Diamonds + 4.5 ct Emeralds",
      diamondClarity: "VS / G-H Color",
      certification: "Gemological Institute Certified",
      dimensions: "Length: 17 inches with safety lock"
    },
    availableSizes: ["17 inch"],
    careInstructions: "Protect emeralds from direct heat and harsh sunlight.",
    reviews: [
      {
        id: "rev-10",
        author: "Divya Joshi",
        rating: 5,
        date: "2026-10-09",
        title: "Heads turned all night!",
        text: "The combination of warm rose gold and deep forest emeralds is out of this world.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-110",
    name: "Aura Diamond Drop Pendant",
    sku: "TJ-PND-01",
    category: "Pendants",
    metal: "18K Rose Gold",
    material: "Diamond",
    purity: "18K (750)",
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    rating: 4.8,
    reviewCount: 33,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 15,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
    ],
    description: "A graceful pear silhouette set with cascading micropave diamonds surrounding an elevated central diamond, suspended from an 18K rose gold bale.",
    specifications: {
      grossWeight: "2.10 g",
      netGoldWeight: "2.04 g",
      purity: "18K Rose Gold",
      diamondWeight: "0.28 ct",
      diamondClarity: "SI1 - G Color",
      certification: "BIS & SGL Certified",
      dimensions: "Pendant Length: 15mm | Width: 8mm"
    },
    availableSizes: ["Standard Pendant"],
    careInstructions: "Clean with lukewarm water and soft brush.",
    reviews: [
      {
        id: "rev-11",
        author: "Kareena Sen",
        rating: 5,
        date: "2026-08-19",
        title: "Charming gift",
        text: "Gifted this to my daughter for her graduation. She adores it.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-111",
    name: "Sacred Om 22K Gold Pendant",
    sku: "TJ-PND-02",
    category: "Pendants",
    metal: "22K Yellow Gold",
    material: "Gold",
    purity: "22K (916)",
    price: 18500,
    originalPrice: 21500,
    discount: 14,
    rating: 4.9,
    reviewCount: 72,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 20,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Spirituality meets fine jewellery design. Meticulously laser-cut and hand-polished 22K gold featuring the sacred 'Om' symbol adorned with high-gloss diamond-cut edges.",
    specifications: {
      grossWeight: "2.65 g",
      netGoldWeight: "2.65 g (100% Pure 22K Gold)",
      purity: "22K BIS 916 Hallmarked",
      diamondWeight: "Nil",
      diamondClarity: "N/A",
      certification: "BIS 916 Hallmark",
      dimensions: "Height: 20mm | Width: 16mm"
    },
    availableSizes: ["Standard Pendant"],
    careInstructions: "Avoid bending. Store separately from harder gemstone jewellery.",
    reviews: [
      {
        id: "rev-12",
        author: "Rajeshwar Pandey",
        rating: 5,
        date: "2026-10-12",
        title: "Divine craftsmanship",
        text: "The finish is immaculate and 916 hallmark is clearly visible under a loupe.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-112",
    name: "Imperial Diamond Tennis Bracelet",
    sku: "TJ-BRC-01",
    category: "Bracelets",
    metal: "18K White Gold",
    material: "Diamond",
    purity: "18K (750)",
    price: 135000,
    originalPrice: 160000,
    discount: 16,
    rating: 5.0,
    reviewCount: 22,
    badge: "New Arrival",
    isNew: true,
    inStock: true,
    stockQuantity: 4,
    images: [
      "https://images.unsplash.com/photo-1611591475879-11c5e6d62888?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80"
    ],
    description: "The timeless icon of high luxury. A continuous stream of hand-selected round brilliant cut diamonds, set in individually articulated 18K white gold four-prong baskets with a double security clasp.",
    specifications: {
      grossWeight: "12.80 g",
      netGoldWeight: "10.40 g",
      purity: "18K White Gold",
      diamondWeight: "2.50 ct Total Weight",
      diamondClarity: "VVS-VS / F Color",
      certification: "IGI Certificate with Unique Laser Inscription",
      dimensions: "Length: 7 inches (17.8 cm) | Width: 2.8mm"
    },
    availableSizes: ["6.5 inch", "7 inch", "7.5 inch"],
    careInstructions: "Check clasp periodically. Professional ultrasonic cleaning recommended every 6 months.",
    reviews: [
      {
        id: "rev-13",
        author: "Alisha Oberoi",
        rating: 5,
        date: "2026-10-25",
        title: "The sparkle is unreal!",
        text: "A true investment piece. The diamonds are so clear and bright, and the clasp clicks securely.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-113",
    name: "Aethel 22K Royal Gold Filigree Kada Bangle",
    sku: "TJ-BNG-01",
    category: "Bangles",
    metal: "22K Yellow Gold",
    material: "Gold",
    purity: "22K (916)",
    price: 112000,
    originalPrice: 128000,
    discount: 12,
    rating: 4.9,
    reviewCount: 29,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 7,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611591475879-11c5e6d62888?auto=format&fit=crop&w=900&q=80"
    ],
    description: "An authentic Indian heritage kada crafted in pure 22K gold, decorated with intricate filigree jaali openwork, floral screw closures, and antique matte-gloss texturing.",
    specifications: {
      grossWeight: "20.10 g",
      netGoldWeight: "20.10 g (Solid 22K Gold)",
      purity: "22K (916 Hallmarked)",
      diamondWeight: "Nil",
      diamondClarity: "N/A",
      certification: "BIS Hallmarked & HUID Verified",
      dimensions: "Width: 10mm | Inner Diameter: 2.4 / 2.6 / 2.8"
    },
    availableSizes: ["2.4", "2.6", "2.8"],
    careInstructions: "Keep in fabric sleeve to preserve delicate filigree edges.",
    reviews: [
      {
        id: "rev-14",
        author: "Nirmala Devi",
        rating: 5,
        date: "2026-09-18",
        title: "Pure traditional excellence",
        text: "The weight and feel in hand is heavy and solid. Authentic 916 gold at fair making charges.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-114",
    name: "925 Sterling Silver Italian Charm Bracelet",
    sku: "TJ-BRC-02",
    category: "Bracelets",
    metal: "925 Sterling Silver",
    material: "Silver",
    purity: "925 Silver",
    price: 4499,
    originalPrice: 6200,
    discount: 27,
    rating: 4.8,
    reviewCount: 45,
    badge: "New Arrival",
    isNew: true,
    inStock: true,
    stockQuantity: 30,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Modern Italian design in authentic 925 sterling silver with a triple rhodium anti-tarnish coating. Accented with miniature lucky talisman charms and a lobster clasp.",
    specifications: {
      grossWeight: "6.20 g",
      netGoldWeight: "N/A",
      purity: "925 Sterling Silver",
      diamondWeight: "AAA Zirconia Accent Charms",
      diamondClarity: "AAA Grade",
      certification: "925 Authenticity Guarantee Card",
      dimensions: "Length: 7.2 inches adjustable with 1 inch extender"
    },
    availableSizes: ["Adjustable 7-8.2 inch"],
    careInstructions: "Rhodium shield prevents tarnishing. Wipe with microfibre after wear.",
    reviews: [
      {
        id: "rev-15",
        author: "Tanvi Agarwal",
        rating: 5,
        date: "2026-10-02",
        title: "Love the charms and shine!",
        text: "Feels very high-end and matches all my western and ethnic outfits.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-115",
    name: "Amour Infinity Diamond Band",
    sku: "TJ-RNG-04",
    category: "Rings",
    metal: "18K Rose Gold",
    material: "Rose Gold",
    purity: "18K (750)",
    price: 32500,
    originalPrice: 38000,
    discount: 14,
    rating: 4.9,
    reviewCount: 36,
    badge: "Bestseller",
    isNew: false,
    inStock: true,
    stockQuantity: 12,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80"
    ],
    description: "An eternal loop of romance. Interlocking 18K rose gold ribbons pavé-set with 0.35 ct brilliant diamonds that loop in a graceful infinity silhouette.",
    specifications: {
      grossWeight: "2.75 g",
      netGoldWeight: "2.68 g",
      purity: "18K Rose Gold",
      diamondWeight: "0.35 ct",
      diamondClarity: "VS - F/G Color",
      certification: "IGI Certified & Hallmarked",
      dimensions: "Band Width: 3.2mm"
    },
    availableSizes: ["10", "12", "14", "16", "18"],
    careInstructions: "Store individually in soft pouch.",
    reviews: [
      {
        id: "rev-16",
        author: "Preeti Varma",
        rating: 5,
        date: "2026-09-05",
        title: "Delicate and meaningful",
        text: "My husband gifted this for our anniversary. It stacks wonderfully with my engagement solitaire.",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "tj-116",
    name: "Mayuri Peacock Enamel 925 Silver Pendant",
    sku: "TJ-PND-03",
    category: "Pendants",
    metal: "925 Sterling Silver",
    material: "Silver",
    purity: "925 Silver",
    price: 3899,
    originalPrice: 5200,
    discount: 25,
    rating: 4.8,
    reviewCount: 27,
    badge: "New Arrival",
    isNew: true,
    inStock: true,
    stockQuantity: 22,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Honouring Rajasthan's legendary Meenakari enamel artistry. A dancing peacock sculpted in certified 925 sterling silver with cobalt blue and emerald green vitreous glass enamelling.",
    specifications: {
      grossWeight: "4.10 g",
      netGoldWeight: "N/A",
      purity: "925 Sterling Silver",
      diamondWeight: "Fine Marcasite and CZ",
      diamondClarity: "N/A",
      certification: "925 Silver Authenticity Certificate",
      dimensions: "Pendant: 28mm x 18mm"
    },
    availableSizes: ["Standard Pendant"],
    careInstructions: "Keep away from perfumes and hair spray.",
    reviews: [
      {
        id: "rev-17",
        author: "Madhuri Sen",
        rating: 5,
        date: "2026-10-15",
        title: "Vibrant colors and superb finish",
        text: "The blue enamel gleams in sunlight. Beautiful ethnic statement piece.",
        verifiedBuyer: true
      }
    ]
  }
];

export const INITIAL_CATEGORIES = [
  {
    id: "cat-rings",
    name: "Rings",
    slug: "rings",
    description: "From timeless diamond solitaires to intricate royal polki and everyday silver bands.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
    itemCount: 4
  },
  {
    id: "cat-earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Heritage jhumkas, radiant chandelier drops and minimalist daily studs.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80",
    itemCount: 3
  },
  {
    id: "cat-necklaces",
    name: "Necklaces",
    slug: "necklaces",
    description: "Majestic bridal chokers, layered polki strings and delicate diamond chains.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
    itemCount: 3
  },
  {
    id: "cat-pendants",
    name: "Pendants",
    slug: "pendants",
    description: "Devotional sacred talismans, floral drops and modern geometric pendants.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
    itemCount: 3
  },
  {
    id: "cat-bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Classic diamond tennis bracelets, charm chains and elegant everyday cuffs.",
    image: "https://images.unsplash.com/photo-1611591475879-11c5e6d62888?auto=format&fit=crop&w=700&q=80",
    itemCount: 2
  },
  {
    id: "cat-bangles",
    name: "Bangles",
    slug: "bangles",
    description: "Royal 22K gold filigree kadas, contemporary bangles and bridal sets.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
    itemCount: 1
  },
  {
    id: "cat-silver",
    name: "Silver Jewellery",
    slug: "silver",
    description: "Certified 925 sterling silver jewellery with anti-tarnish rhodium finish.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=80",
    itemCount: 4
  },
  {
    id: "cat-gold",
    name: "Gold Jewellery",
    slug: "gold",
    description: "100% BIS Hallmarked 22K and 18K gold crafted by master karigars.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=80",
    itemCount: 7
  }
];

export const INITIAL_ORDERS = [
  {
    id: "TJ-ORD-8821",
    customer: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210"
    },
    shippingAddress: {
      fullName: "Priya Sharma",
      street: "Flat 402, Royal Palms Residency, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      phone: "+91 98765 43210"
    },
    items: [
      {
        id: "tj-101",
        name: "The Solitaire Harmony Diamond Ring",
        sku: "TJ-RNG-01",
        price: 48999,
        quantity: 1,
        selectedSize: "14",
        selectedMetal: "18K Yellow Gold",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80"
      }
    ],
    pricing: {
      subtotal: 48999,
      discount: 4899,
      couponCode: "TIWARI10",
      deliveryCharge: 0,
      total: 44100
    },
    paymentMethod: "Razorpay (UPI / Card)",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    trackingNumber: "BLUEDART-TJ-992819",
    createdAt: "2026-10-30T10:15:00Z"
  },
  {
    id: "TJ-ORD-8819",
    customer: {
      name: "Vikram Singhania",
      email: "vikram.s@example.com",
      phone: "+91 98234 11223"
    },
    shippingAddress: {
      fullName: "Vikram Singhania",
      street: "12, Malabar Hill Crest",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400006",
      phone: "+91 98234 11223"
    },
    items: [
      {
        id: "tj-104",
        name: "Kundan Pearl Royal Maharani Jhumkas",
        sku: "TJ-EAR-01",
        price: 68500,
        quantity: 1,
        selectedSize: "Standard",
        selectedMetal: "22K Yellow Gold",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80"
      }
    ],
    pricing: {
      subtotal: 68500,
      discount: 0,
      couponCode: null,
      deliveryCharge: 0,
      total: 68500
    },
    paymentMethod: "Razorpay (Credit Card)",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    trackingNumber: "SEQUEL-TJ-77123",
    createdAt: "2026-10-28T14:40:00Z"
  }
];

export const INITIAL_COUPONS = [
  {
    code: "TIWARI10",
    discountPercent: 10,
    maxDiscount: 5000,
    minOrder: 5000,
    description: "10% festive welcome discount up to ₹5,000 on orders above ₹5,000"
  },
  {
    code: "FESTIVE15",
    discountPercent: 15,
    maxDiscount: 10000,
    minOrder: 25000,
    description: "15% off up to ₹10,000 on royal heritage purchases above ₹25,000"
  },
  {
    code: "SPARKLE500",
    flatDiscount: 500,
    minOrder: 2999,
    description: "Flat ₹500 instant discount on silver jewellery and everyday collections"
  }
];
