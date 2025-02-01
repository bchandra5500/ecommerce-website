import { type EnhancedProduct } from "./productRecommender";

export const enhancedProducts: EnhancedProduct[] = [
  {
    id: 1,
    name: "Pro Wireless Headphones",
    price: 299.99,
    description: "Premium noise-cancelling headphones with spatial audio",
    image: "/images/products/headphones.jpg",
    category: "tech",
    features: [
      "wireless",
      "noise-cancelling",
      "spatial audio",
      "premium",
      "bluetooth",
      "long battery life",
    ],
    useCase: ["music", "travel", "work", "commute"],
    metadata: {
      semanticTags: [
        "audio",
        "music",
        "headset",
        "wireless",
        "premium",
        "noise-cancelling",
      ],
      category: {
        primary: "audio",
        secondary: ["tech", "accessories"],
      },
      useCases: [
        { name: "music", confidence: 1.0 },
        { name: "travel", confidence: 0.8 },
        { name: "work", confidence: 0.7 },
      ],
      technicalSpecs: {
        batteryLife: "20 hours",
        connectivity: "Bluetooth 5.0",
        noiseCancellation: "Active",
        driver: "40mm",
        frequency: "20Hz-20kHz",
      },
    },
  },
  {
    id: 2,
    name: "SmartFit Watch Pro",
    price: 249.99,
    description: "Advanced fitness tracking with health monitoring",
    image: "/images/products/smartwatch.jpg",
    category: "tech",
    features: [
      "fitness tracking",
      "heart rate",
      "gps",
      "water resistant",
      "sleep tracking",
    ],
    useCase: ["fitness", "health", "sports", "daily wear"],
    metadata: {
      semanticTags: ["fitness", "health", "smartwatch", "tracking", "wearable"],
      category: {
        primary: "wearables",
        secondary: ["tech", "fitness"],
      },
      useCases: [
        { name: "fitness", confidence: 1.0 },
        { name: "health", confidence: 0.9 },
        { name: "daily wear", confidence: 0.8 },
      ],
      technicalSpecs: {
        batteryLife: "5 days",
        waterResistance: "50m",
        display: "AMOLED",
        sensors: "Heart rate, GPS, Accelerometer",
      },
    },
  },
  {
    id: 3,
    name: "UltraBook X1",
    price: 1299.99,
    description: "Ultra-thin laptop with 4K display and all-day battery",
    image: "/images/products/laptop.jpg",
    category: "tech",
    features: ["4K display", "thin", "lightweight", "powerful", "long battery"],
    useCase: ["work", "productivity", "creative", "professional", "music"],
    metadata: {
      semanticTags: [
        "laptop",
        "computer",
        "ultrabook",
        "professional",
        "premium",
      ],
      category: {
        primary: "computers",
        secondary: ["tech", "productivity"],
      },
      useCases: [
        { name: "work", confidence: 1.0 },
        { name: "productivity", confidence: 0.9 },
        { name: "creative", confidence: 0.8 },
        { name: "music", confidence: 0.6 },
      ],
      technicalSpecs: {
        processor: "Intel i7",
        ram: "16GB",
        storage: "512GB SSD",
        display: "4K",
        graphics: "Intel Iris Xe",
      },
    },
  },
  {
    id: 4,
    name: "HomeHub Speaker",
    price: 199.99,
    description: "Smart speaker with room-filling sound and voice control",
    image: "/images/products/speaker.jpg",
    category: "smart-home",
    features: ["voice control", "smart home", "high quality audio", "wireless"],
    useCase: ["music", "home", "entertainment"],
    metadata: {
      semanticTags: [
        "speaker",
        "audio",
        "smart home",
        "music",
        "voice control",
      ],
      category: {
        primary: "audio",
        secondary: ["smart home", "entertainment"],
      },
      useCases: [
        { name: "music", confidence: 1.0 },
        { name: "entertainment", confidence: 0.9 },
        { name: "smart home", confidence: 0.8 },
      ],
      technicalSpecs: {
        power: "50W",
        connectivity: "WiFi, Bluetooth",
        voiceAssistant: "Yes",
        speakers: "2.1 channel",
      },
    },
  },
  {
    id: 5,
    name: "SecureView Pro",
    price: 179.99,
    description: "1080p security camera with night vision and two-way audio",
    image: "/images/products/camera.jpg",
    category: "smart-home",
    features: ["1080p", "night vision", "two-way audio", "motion detection"],
    useCase: ["security", "monitoring", "home"],
    metadata: {
      semanticTags: [
        "camera",
        "security",
        "surveillance",
        "monitoring",
        "smart home",
      ],
      category: {
        primary: "security",
        secondary: ["smart home", "cameras"],
      },
      useCases: [
        { name: "security", confidence: 1.0 },
        { name: "monitoring", confidence: 0.9 },
        { name: "home", confidence: 0.8 },
      ],
      technicalSpecs: {
        resolution: "1080p",
        nightVision: "Yes",
        audio: "Two-way",
        storage: "Cloud + Local",
      },
    },
  },
  {
    id: 6,
    name: "SmartDisplay Hub",
    price: 149.99,
    description: "7-inch display for smart home control and video calls",
    image: "/images/products/display.jpg",
    category: "smart-home",
    features: [
      "touch screen",
      "video calls",
      "smart home control",
      "voice control",
    ],
    useCase: ["communication", "home control", "entertainment"],
    metadata: {
      semanticTags: [
        "display",
        "screen",
        "smart home",
        "control",
        "communication",
      ],
      category: {
        primary: "smart home",
        secondary: ["displays", "communication"],
      },
      useCases: [
        { name: "home control", confidence: 1.0 },
        { name: "communication", confidence: 0.9 },
        { name: "entertainment", confidence: 0.7 },
      ],
      technicalSpecs: {
        screenSize: "7 inch",
        resolution: "1280x800",
        touchscreen: "Yes",
        camera: "5MP",
      },
    },
  },
  {
    id: 7,
    name: "PowerMat Pro",
    price: 59.99,
    description: "Fast wireless charging pad with multi-device support",
    image: "/images/products/charger.jpg",
    category: "accessories",
    features: ["wireless charging", "fast charging", "multi-device", "compact"],
    useCase: ["charging", "desk", "nightstand"],
    metadata: {
      semanticTags: ["charger", "wireless", "power", "charging", "accessories"],
      category: {
        primary: "charging",
        secondary: ["accessories", "power"],
      },
      useCases: [
        { name: "charging", confidence: 1.0 },
        { name: "desk", confidence: 0.8 },
        { name: "nightstand", confidence: 0.8 },
      ],
      technicalSpecs: {
        power: "15W",
        devices: "Multiple",
        technology: "Qi wireless",
        compatibility: "Universal",
      },
    },
  },
  {
    id: 8,
    name: "MechKeys Elite",
    price: 129.99,
    description: "Mechanical keyboard with RGB backlighting",
    image: "/images/products/keyboard.jpg",
    category: "accessories",
    features: ["mechanical", "rgb", "gaming", "tactile"],
    useCase: ["gaming", "typing", "work"],
    metadata: {
      semanticTags: ["keyboard", "mechanical", "gaming", "rgb", "input device"],
      category: {
        primary: "input devices",
        secondary: ["accessories", "gaming"],
      },
      useCases: [
        { name: "gaming", confidence: 1.0 },
        { name: "typing", confidence: 0.9 },
        { name: "work", confidence: 0.7 },
      ],
      technicalSpecs: {
        switches: "Mechanical",
        lighting: "RGB",
        layout: "Full size",
        connection: "USB-C",
      },
    },
  },
  {
    id: 9,
    name: "PowerBank 20000",
    price: 49.99,
    description: "20000mAh portable charger with fast charging",
    image: "/images/products/powerbank.jpg",
    category: "accessories",
    features: ["portable", "fast charging", "high capacity", "multi-port"],
    useCase: ["travel", "emergency", "outdoor"],
    metadata: {
      semanticTags: ["power bank", "charger", "portable", "battery", "travel"],
      category: {
        primary: "power",
        secondary: ["accessories", "travel"],
      },
      useCases: [
        { name: "travel", confidence: 1.0 },
        { name: "emergency", confidence: 0.9 },
        { name: "outdoor", confidence: 0.8 },
      ],
      technicalSpecs: {
        capacity: "20000mAh",
        ports: "Multiple",
        charging: "Fast charging",
        input: "USB-C",
      },
    },
  },
];
