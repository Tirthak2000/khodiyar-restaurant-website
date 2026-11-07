/* ============================================================
   KHODIYAR RESTAURANT — site settings + full menu
   Edit prices and dishes here. Both pages read from this file.
   ============================================================ */

window.KHODIYAR = {
  config: {
    name: "Khodiyar Restaurant",
    phoneDisplay: "+91 97239 51073",
    phoneLink: "tel:+919723951073",
    whatsapp: "https://wa.me/919723951073",   // orders and chats go to this number
    whatsappText: "Hello Khodiyar Restaurant! ",
    orderTypes: ["Dine-in", "Takeaway", "Delivery"],  // remove one to hide it in the order form
    email: "officialkhodiyar@gmail.com",
    googleReview: "https://g.page/r/CQC4Lfe8KjY_EBM/review",
    // TODO: replace with your exact Zomato restaurant page link
    zomato: "https://www.zomato.com/"
  },

  /* Unsplash photo IDs (free licence). Swap any ID to change a photo,
     or set img: null on a category to show the bandhani pattern instead. */
  photos: {
    thali:    "1589778655375-3e622a9fc91c",
    paneer:   "1631452180519-c014fe946bc7",
    paneer2:  "1631452180539-96aca7d48617",
    redCurry: "1690401767645-595de0e0e5f8",
    sizzler:  "1567188040759-fb8a883dc6d8",
    homestyle:"1546833999-b9f581a1996d",
    dal:      "1736680056444-02b10f16a245",
    rice:     "1642821373181-696a54913e93",
    roti:     "1567337710282-00832b415979",
    noodles:  "1585032226651-759b368d7246",
    spices:   "1771541897176-44a3e01dc484"
  },

  /* Dishes shown as big cards on the home page.
     dish must match a name in the menu below (prices come from there). */
  featured: [
    { dish: "Special Khodiyar Paneer", photo: "paneer", label: "House special", kicker: "The one with our name",
      desc: "The paneer dish that carries our name, cooked to our own house recipe." },
    { dish: "Paneer Angara", photo: "redCurry", label: "Punjabi", kicker: "For spice lovers",
      desc: "Paneer in a fiery, smoky red masala for those who like it hot." },
    { dish: "Butter Dal Tadka", photo: "dal", label: "Dal", kicker: "Comfort in a bowl",
      desc: "Yellow dal finished with a sizzling butter tadka. Perfect with jeera rice." },
    { dish: "Veg Biryani", photo: "rice", label: "Rice", kicker: "One-pot favourite",
      desc: "Fragrant rice layered with vegetables and whole spices." },
    { dish: "Butter Naan", photo: "roti", label: "Tandoor", kicker: "Fresh from the tandoor",
      desc: "Soft naan from the tandoor, brushed with butter." },
    { dish: "Veg Hakka Noodles", photo: "noodles", label: "Indo-Chinese", kicker: "Wok-tossed favourite",
      desc: "Noodles tossed with crunchy vegetables, Indo-Chinese style." }
  ],

  /* Menu. p = price in ₹. v = variants [label, price].
     tag: "special" shows the House special badge. */
  menu: [
    {
      id: "soups-chinese", title: "Soups & Chinese", gu: "સૂપ અને ચાઇનીઝ",
      img: "noodles", hue: "chili",
      items: [
        { n: "Manchow Soup", p: 100 },
        { n: "Hot and Sour Soup", p: 110 },
        { n: "Paneer Chilli", v: [["Dry", 190], ["Gravy", 200]] },
        { n: "Manchurian", v: [["Dry", 160], ["Gravy", 180]] },
        { n: "Veg Hakka Noodles", p: 150 },
        { n: "Paneer Manchurian (Dry)", p: 190 },
        { n: "Manchurian Noodles", p: 200 },
        { n: "French Fries", p: 80 }
      ]
    },
    {
      id: "paneer", title: "Paneer & Kaju", gu: "પનીર અને કાજુ",
      img: "paneer", hue: "marigold",
      items: [
        { n: "Special Khodiyar Paneer", p: 210, tag: "special" },
        { n: "Paneer Butter Masala", p: 190 },
        { n: "Paneer Cheese", p: 180 },
        { n: "Paneer Tikka Masala", p: 160 },
        { n: "Paneer Butter Masala", p: 170 }, // printed twice on the paper menu (₹190 and ₹170), please confirm
        { n: "Paneer Tawa Masala", p: 170 },
        { n: "Paneer Tufani", p: 190 },
        { n: "Paneer Angara", p: 200 },
        { n: "Paneer Kebab", p: 170 },
        { n: "Paneer Handi", p: 180 },
        { n: "Kaju Curry", p: 200 },
        { n: "Kaju Masala", p: 190 },
        { n: "Matar Paneer", p: 160 },
        { n: "Palak Paneer", p: 170 },
        { n: "Plain Palak", p: 150 },
        { n: "Palak Lasaniya", p: 180 }
      ]
    },
    {
      id: "vegetable", title: "Vegetable", gu: "શાક",
      img: "redCurry", hue: "leaf",
      items: [
        { n: "Special Khodiyar Veg", p: 190, tag: "special" },
        { n: "Veg Jaipuri", p: 160 },
        { n: "Veg Handi", p: 160 },
        { n: "Veg Kadai", p: 170 },
        { n: "Veg Kolhapuri", p: 170 },
        { n: "Veg Tufani", p: 170 },
        { n: "Veg Tawa Masala", p: 160 },
        { n: "Veg Angara", p: 170 },
        { n: "Veg Hyderabadi", p: 170 }
      ]
    },
    {
      id: "kathiawadi", title: "Kathiawadi", gu: "કાઠિયાવાડી",
      img: "homestyle", hue: "turmeric",
      items: [
        { n: "Sev Tameta", p: 110 },
        { n: "Lasaniya Bataka", p: 120 },
        { n: "Baingan Masala", p: 120 },
        { n: "Bhindi Masala", p: 130 },
        { n: "Bhindi Shep", p: 120 },
        { n: "Ganthiya Masala", p: 140 },
        { n: "Kaju Ganthiya", p: 170 },
        { n: "Dahi Fry", p: 100 },
        { n: "Methi Papad", p: 140 },
        { n: "Plain Khichdi", p: 90 },
        { n: "Masala Khichdi", p: 120 },
        { n: "Special Khichdi", p: 130, tag: "special" },
        { n: "Kathiyawadi Kadhi", p: 80 }
      ]
    },
    {
      id: "dal", title: "Special Dal", gu: "દાળ",
      img: "dal", hue: "saffron",
      items: [
        { n: "Dal Fry", p: 100 },
        { n: "Dal Tadka", p: 120 },
        { n: "Butter Dal Tadka", p: 130 }
      ]
    },
    {
      id: "rice", title: "Rice & Biryani", gu: "ભાત અને બિરયાની",
      img: "rice", hue: "maroon",
      items: [
        { n: "Jeera Rice", p: 100 },
        { n: "Plain Rice", p: 70 },
        { n: "Cashew Pulao", p: 140 },
        { n: "Green Pea Pulao", p: 130 },
        { n: "Veg Pulao", p: 120 },
        { n: "Special Pulao", p: 130, tag: "special" },
        { n: "Hyderabadi Biryani", p: 170 },
        { n: "Veg Biryani", p: 170 }
      ]
    },
    {
      id: "roti", title: "Roti & Naan", gu: "રોટલી અને નાન",
      img: "roti", hue: "gold",
      items: [
        { n: "Chapati", v: [["Plain", 12], ["Butter", 15]] },
        { n: "Bhakhri", v: [["Plain", 12], ["Butter", 15]] },
        { n: "Plain Paratha", p: 25 },
        { n: "Butter Paratha", p: 30 },
        { n: "Bajri Rotla", p: 30 },
        { n: "Plain Tandoori Roti", p: 25 },
        { n: "Butter Tandoori Roti", p: 25 },
        { n: "Plain Naan", p: 40 },
        { n: "Butter Naan", p: 50 },
        { n: "Garlic Naan", p: 60 },
        { n: "Plain Phulka", p: 40 },
        { n: "Butter Phulka", p: 50 },
        { n: "Lachha Paratha", p: 50 },
        { n: "Plain Lachha Paratha", p: 70 } // printed as ₹70, higher than Lachha Paratha ₹50, please confirm
      ]
    },
    {
      id: "papad-drinks", title: "Papad, Chaas & Lassi", gu: "પાપડ, છાશ અને લસ્સી",
      img: null, hue: "teal",
      items: [
        { n: "Roasted Papad", p: 20 },
        { n: "Fried Papad", p: 25 },
        { n: "Masala Papad", p: 30 },
        { n: "Buttermilk (Chaas)", p: 20 },
        { n: "Sweet Lassi", p: 60 },
        { n: "Special Lassi", p: 80, tag: "special" }
      ]
    }
  ]
};
