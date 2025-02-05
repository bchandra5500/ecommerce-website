import mongoose from "mongoose";
import Product from "../models/Product.js";

export async function purgeProducts() {
  try {
    console.log("Connected to database:", mongoose.connection.name);
    console.log("Attempting to purge products collection...");
    const result = await Product.deleteMany({});
    console.log("Purge result:", result);
    return {
      success: true,
      message: `All products purged successfully. Deleted ${result.deletedCount} documents.`,
    };
  } catch (error) {
    console.error("Purge error:", error);
    return { success: false, error: error.message };
  }
}

export async function seedProducts() {
  try {
    const products = [
      // Phones
      {
        name: "iPhone 15 Pro",
        brand: "Apple",
        model: "15 Pro",
        price: 999.99,
        description:
          "Latest iPhone model with titanium frame, premium glass design, and advanced triple camera system",
        image:
          "https://images.macrumors.com/t/SuHt0iQuSjaO-ExOZzJieONGf_I=/2500x/article-new/2023/09/iPhone-15-Pro-Lineup-Feature.jpg",
        category: "phones",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            screen: "6.1 inch OLED",
            storage: "256GB",
            camera: "48MP Triple Camera",
            processor: "A17 Pro",
            battery: "4000mAh",
            os: "iOS 17",
          },
        },
        metadata: {
          features: ["Titanium frame", "A17 Pro chip", "48MP camera"],
          useCases: ["Photography", "Gaming", "Professional use"],
          tags: ["premium", "5G", "titanium"],
          ratings: { average: 4.8, count: 245 },
          searchKeywords: ["iphone", "apple", "pro", "titanium", "5G"],
        },
      },
      {
        name: "Samsung Galaxy S23 Ultra",
        brand: "Samsung",
        model: "S23 Ultra",
        price: 1199.99,
        description:
          "Premium Android flagship with S-Pen and advanced quad-camera system",
        image:
          "https://image-us.samsung.com/SamsungUS/configurator/S23U-V2-Configurator-DT-800x600.jpg?$product-details-jpg$",
        category: "phones",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            screen: "6.8 inch AMOLED",
            storage: "512GB",
            camera: "200MP Quad Camera",
            processor: "Snapdragon 8 Gen 2",
            battery: "5000mAh",
            os: "Android 13",
          },
        },
        metadata: {
          features: ["S-Pen included", "200MP camera", "8K video"],
          useCases: ["Note-taking", "Photography", "Gaming"],
          tags: ["premium", "5G", "stylus"],
          ratings: { average: 4.7, count: 189 },
          searchKeywords: ["samsung", "galaxy", "ultra", "s-pen", "android"],
        },
      },
      {
        name: "Galaxy S24 Ultra",
        brand: "Samsung",
        model: "S24 Ultra",
        price: 1299.99,
        description:
          "Premium Android smartphone with advanced AI features and 200MP camera",
        image:
          "https://image-us.samsung.com/us/smartphones/galaxy-s24/all-gallery/01_E1_OnlineExclusive_SandstoneOrange_Lockup_1600x1200.jpg?$default-400-jpg$",
        category: "phones",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            screen: "6.8-inch Dynamic AMOLED 2X",
            processor: "Snapdragon 8 Gen 3",
            ram: "12GB",
            storage: "512GB",
            camera: "200MP main + 12MP ultra-wide + 50MP telephoto",
            battery: "5000mAh",
            os: "Android 14",
          },
        },
        metadata: {
          features: [
            "AI-powered camera",
            "S Pen included",
            "IP68 water resistance",
          ],
          useCases: ["Photography", "Productivity", "Gaming"],
          tags: ["premium", "AI", "stylus"],
          ratings: { average: 4.9, count: 56 },
          searchKeywords: ["samsung", "galaxy", "s24", "ultra", "AI"],
        },
      },
      {
        name: "Google Pixel 8 Pro",
        brand: "Google",
        model: "Pixel 8 Pro",
        price: 999.99,
        description:
          "Google's flagship phone with advanced AI features and exceptional camera capabilities",
        image:
          "https://m.media-amazon.com/images/I/610q+UV1bcL._AC_UF894,1000_QL80_.jpg",
        category: "phones",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "2 year limited",
          },
          details: {
            screen: "6.7-inch LTPO OLED",
            processor: "Google Tensor G3",
            ram: "12GB",
            storage: "256GB",
            camera: "50MP main + 48MP ultra-wide + 48MP telephoto",
            battery: "5050mAh",
            os: "Android 14",
          },
        },
        metadata: {
          features: [
            "Advanced AI photo editing",
            "7 years of updates",
            "IP68 rating",
          ],
          useCases: ["Photography", "AI features", "Long-term use"],
          tags: ["AI", "camera", "google"],
          ratings: { average: 4.7, count: 142 },
          searchKeywords: ["google", "pixel", "ai", "camera"],
        },
      },
      {
        name: "OnePlus 12",
        brand: "OnePlus",
        model: "12",
        price: 799.99,
        description:
          "Flagship killer with Snapdragon 8 Gen 3 and Hasselblad cameras",
        image:
          "https://m.media-amazon.com/images/I/711F6T6aySL._AC_UF894,1000_QL80_.jpg",
        category: "phones",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            screen: "6.82-inch LTPO AMOLED",
            processor: "Snapdragon 8 Gen 3",
            ram: "16GB",
            storage: "512GB",
            camera: "50MP main + 48MP ultra-wide + 64MP telephoto",
            battery: "5400mAh",
            os: "OxygenOS 14",
          },
        },
        metadata: {
          features: [
            "100W SUPERVOOC charging",
            "Hasselblad cameras",
            "Rain Touch",
          ],
          useCases: ["Gaming", "Photography", "Fast charging"],
          tags: ["fast charging", "performance", "camera"],
          ratings: { average: 4.6, count: 89 },
          searchKeywords: ["oneplus", "hasselblad", "fast charging"],
        },
      },

      // Computers
      {
        name: "ROG Strix Gaming Laptop",
        brand: "ASUS",
        model: "ROG Strix",
        price: 2499.99,
        description:
          "Ultimate gaming laptop with RTX 4090 and high refresh rate display",
        image: "https://m.media-amazon.com/images/I/81GrCeuCzxL.jpg",
        category: "computers",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            processor: "Intel i9-13900HX",
            gpu: "NVIDIA RTX 4090 16GB",
            ram: "32GB DDR5",
            storage: "2TB NVMe SSD",
            display: "17.3 inch 240Hz QHD",
          },
        },
        metadata: {
          features: ["RTX 4090", "240Hz display", "DDR5 memory"],
          useCases: ["Gaming", "Content creation", "3D rendering"],
          tags: ["gaming", "high-performance", "rtx"],
          ratings: { average: 4.8, count: 156 },
          searchKeywords: ["rog", "gaming", "rtx 4090", "asus"],
        },
      },
      {
        name: "MacBook Pro 16",
        brand: "Apple",
        model: "MacBook Pro 16-inch",
        price: 2699.99,
        description:
          "Professional laptop with M3 Max chip and stunning Liquid Retina XDR display",
        image:
          "https://i.ebayimg.com/00/s/MTA2NlgxNjAw/z/EGUAAOSwSWhjxdjA/$_57.JPG?set_id=880000500F",
        category: "computers",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            processor: "M3 Max",
            ram: "32GB Unified Memory",
            storage: "1TB SSD",
            display: "16-inch Liquid Retina XDR",
            battery: "22 hours",
          },
        },
        metadata: {
          features: ["M3 Max chip", "XDR display", "22-hour battery"],
          useCases: ["Professional work", "Content creation", "Development"],
          tags: ["apple", "pro", "m3"],
          ratings: { average: 4.9, count: 234 },
          searchKeywords: ["macbook", "pro", "m3", "apple"],
        },
      },
      {
        name: "Dell XPS 15 (2024)",
        brand: "Dell",
        model: "XPS 15 9530",
        price: 2199.99,
        description:
          "Premium ultrabook with 13th Gen Intel Core processors and OLED display",
        image:
          "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3778&hei=2323&qlt=100,1&resMode=sharp2&size=3778,2323&chrss=full&imwidth=5000",
        category: "computers",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            processor: "Intel Core i9-13900H",
            gpu: "NVIDIA RTX 4070 8GB",
            ram: "32GB DDR5",
            storage: "1TB NVMe SSD",
            display: "15.6-inch 3.5K OLED Touch",
            battery: "86Whr",
          },
        },
        metadata: {
          features: ["OLED display", "RTX 4070", "CNC aluminum"],
          useCases: ["Professional work", "Content creation", "Light gaming"],
          tags: ["premium", "ultrabook", "oled"],
          ratings: { average: 4.7, count: 167 },
          searchKeywords: ["dell", "xps", "oled", "ultrabook"],
        },
      },
      {
        name: "Framework Laptop 16",
        brand: "Framework",
        model: "Laptop 16",
        price: 1699.99,
        description:
          "Modular, upgradeable 16-inch laptop with customizable ports and replaceable components",
        image:
          "https://images.prismic.io/frameworkmarketplace/6c6fd60e-5c28-4d48-882a-9cc383df0dc9_Work+%26+Play.jpg?auto=format,compress",
        category: "computers",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            processor: "AMD Ryzen 7 7840HS",
            gpu: "RX 7700S 8GB",
            ram: "32GB DDR5",
            storage: "1TB NVMe SSD",
            display: "16-inch 2560x1600 165Hz",
            battery: "85Whr",
          },
        },
        metadata: {
          features: ["Modular design", "User-repairable", "Customizable ports"],
          useCases: ["Professional work", "Gaming", "Long-term ownership"],
          tags: ["modular", "repairable", "customizable"],
          ratings: { average: 4.6, count: 98 },
          searchKeywords: ["framework", "modular", "repairable", "sustainable"],
        },
      },

      // Headsets
      {
        name: "HyperX Cloud Alpha Wireless",
        brand: "HyperX",
        model: "Cloud Alpha Wireless",
        price: 199.99,
        description:
          "Premium wireless gaming headset with 300-hour battery life",
        image: "https://m.media-amazon.com/images/I/81h57VezuJL.jpg",
        category: "headsets",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "2 year limited",
          },
          details: {
            type: "Over-ear",
            connectivity: "2.4GHz Wireless",
            battery: "300 hours",
            microphone: "Detachable",
            drivers: "50mm Dual Chamber",
          },
        },
        metadata: {
          features: [
            "300-hour battery",
            "DTS Headphone:X",
            "Dual Chamber Drivers",
          ],
          useCases: ["Gaming", "Voice chat", "Music"],
          tags: ["gaming", "wireless", "long battery"],
          ratings: { average: 4.7, count: 342 },
          searchKeywords: [
            "hyperx",
            "gaming headset",
            "wireless",
            "cloud alpha",
          ],
        },
      },
      {
        name: "Sony WH-1000XM5",
        brand: "Sony",
        model: "WH-1000XM5",
        price: 399.99,
        description:
          "Premium noise-cancelling headphones with industry-leading audio quality",
        image:
          "https://i2-prod.themirror.com/incoming/article896458.ece/ALTERNATES/n615/0_Sony-WH-1000XM5-Headphones-1jpeg.jpg",
        category: "headsets",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            type: "Over-ear",
            connectivity: "Bluetooth 5.2",
            battery: "30 hours",
            microphone: "Built-in Array",
            features: "Adaptive noise cancellation, LDAC codec",
          },
        },
        metadata: {
          features: ["Adaptive NC", "LDAC codec", "Multipoint connection"],
          useCases: ["Travel", "Work", "Music"],
          tags: ["noise cancelling", "premium", "wireless"],
          ratings: { average: 4.8, count: 567 },
          searchKeywords: ["sony", "noise cancelling", "bluetooth", "premium"],
        },
      },
      {
        name: "Apple AirPods Pro 2",
        brand: "Apple",
        model: "AirPods Pro 2nd Gen",
        price: 249.99,
        description:
          "Premium wireless earbuds with advanced noise cancellation and USB-C charging",
        image:
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FMT_WHH?wid=750&hei=556&fmt=jpeg&qlt=90&.v=1724041668836",
        category: "headsets",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            type: "In-ear TWS",
            connectivity: "Bluetooth 5.3",
            battery: "6 hours (ANC on), 30 hours with case",
            microphone: "Dual beamforming",
            features: "Active Noise Cancellation, Adaptive Audio",
          },
        },
        metadata: {
          features: ["H2 chip", "Adaptive Audio", "USB-C charging"],
          useCases: ["Commuting", "Workouts", "Calls"],
          tags: ["wireless", "anc", "apple"],
          ratings: { average: 4.8, count: 892 },
          searchKeywords: ["airpods", "pro", "apple", "wireless", "earbuds"],
        },
      },
      {
        name: "Bose QuietComfort Ultra",
        brand: "Bose",
        model: "QuietComfort Ultra",
        price: 429.99,
        description:
          "Premium over-ear headphones with immersive audio and advanced noise cancellation",
        image:
          "https://m.media-amazon.com/images/I/51yWZxN3vRL._AC_UF894,1000_QL80_.jpg",
        category: "headsets",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            type: "Over-ear",
            connectivity: "Bluetooth 5.3, Multipoint",
            battery: "24 hours",
            microphone: "4-mic array",
            features: "CustomTune audio calibration",
          },
        },
        metadata: {
          features: ["Immersive audio", "Advanced NC", "CustomTune"],
          useCases: ["Travel", "Work", "Music"],
          tags: ["premium", "noise cancelling", "comfort"],
          ratings: { average: 4.7, count: 234 },
          searchKeywords: [
            "bose",
            "quietcomfort",
            "noise cancelling",
            "premium",
          ],
        },
      },

      // Accessories
      {
        name: "Razer BlackWidow V4 Pro",
        brand: "Razer",
        model: "BlackWidow V4 Pro",
        price: 229.99,
        description:
          "Premium mechanical gaming keyboard with optical switches and customizable RGB",
        image: "https://m.media-amazon.com/images/I/81L4FpeS3VL.jpg",
        category: "accessories",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "2 year limited",
          },
          details: {
            type: "Mechanical",
            switches: "Razer Green",
            backlight: "Chroma RGB",
            layout: "Full-size",
            features: "USB Passthrough, Media Controls",
          },
        },
        metadata: {
          features: ["Optical switches", "Chroma RGB", "Media controls"],
          useCases: ["Gaming", "Typing", "Productivity"],
          tags: ["mechanical", "rgb", "gaming"],
          ratings: { average: 4.6, count: 312 },
          searchKeywords: ["razer", "keyboard", "mechanical", "gaming"],
        },
      },
      {
        name: "Anker PowerCore III Elite",
        brand: "Anker",
        model: "PowerCore III Elite",
        price: 159.99,
        description: "High-capacity power bank with 25600mAh and 87W USB-C PD",
        image:
          "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6433/6433261_sd.jpg;maxHeight=640;maxWidth=550;format=webp",
        category: "accessories",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "18 months",
          },
          details: {
            capacity: "25600mAh",
            ports: "2x USB-C, 2x USB-A",
            maxOutput: "87W",
            fastCharging: "USB-C PD, QC 3.0",
            features: "LED display, Trickle charging",
          },
        },
        metadata: {
          features: ["87W USB-C PD", "LED display", "Trickle charging"],
          useCases: ["Travel", "Multiple device charging", "Laptop charging"],
          tags: ["power bank", "portable", "fast charging"],
          ratings: { average: 4.7, count: 523 },
          searchKeywords: ["anker", "power bank", "portable charger", "usb-c"],
        },
      },
      {
        name: "Logitech Brio 4K",
        brand: "Logitech",
        model: "Brio 4K",
        price: 199.99,
        description:
          "Professional 4K webcam with HDR and Windows Hello support",
        image:
          "https://i5.walmartimages.com/seo/Logitech-Brio-4K-Webcam-Ultra-HD-Video-Calling-Noise-Canceling-mic-Auto-Light-Correction-Wide-Field-View-Works-Microsoft-Teams-Zoom-Google-Voice-PC-M_4747d576-8fd6-4489-aef0-a24f9b2185ef.7874a6911c23f57c5ca8da63d2ce3295.jpeg",
        category: "accessories",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            resolution: "4K Ultra HD",
            frameRate: "90 fps at 1080p",
            features: "HDR, 5x digital zoom",
            connectivity: "USB-C",
            compatibility: "Windows Hello, Mac, Chrome OS",
          },
        },
        metadata: {
          features: ["4K resolution", "Windows Hello", "HDR support"],
          useCases: ["Video conferencing", "Content creation", "Streaming"],
          tags: ["webcam", "4k", "professional"],
          ratings: { average: 4.5, count: 289 },
          searchKeywords: ["logitech", "webcam", "4k", "streaming"],
        },
      },
      {
        name: "Samsung 45W USB-C Super Fast Charger",
        brand: "Samsung",
        model: "45W Super Fast Charger",
        price: 49.99,
        description:
          "Official Samsung 45W travel adapter with Super Fast Charging 2.0 support",
        image:
          "https://image-us.samsung.com/SamsungUS/home/mobile/mobile-accessories/all-mobile-accessories/05132024/gallery/CHL581434_EP-T4511X_005_Package_Black_1600x1200.jpg?$product-details-jpg$",
        category: "accessories",
        status: "active",
        specs: {
          common: {
            releaseYear: 2024,
            warranty: "1 year limited",
          },
          details: {
            output: "45W maximum",
            ports: "1x USB-C",
            technology: "PPS, USB-PD 3.0",
            compatibility: "Universal USB-C devices",
          },
        },
        metadata: {
          features: ["45W output", "GaN technology", "Universal compatibility"],
          useCases: ["Fast charging", "Travel", "Multiple device charging"],
          tags: ["charger", "fast charging", "compact"],
          ratings: { average: 4.6, count: 178 },
          searchKeywords: ["samsung", "charger", "45w", "fast charging"],
        },
      },
      {
        name: "Apple Magic Trackpad",
        brand: "Apple",
        model: "Magic Trackpad",
        price: 129.99,
        description: "Multi-touch trackpad with Force Touch and USB-C charging",
        image:
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXK93?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1730508284008",
        category: "accessories",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            connectivity: "Bluetooth, USB-C",
            battery: "1 month per charge",
            surface: "Edge-to-edge glass",
            compatibility: "Mac, iPad",
          },
        },
        metadata: {
          features: ["Force Touch", "Multi-touch gestures", "USB-C charging"],
          useCases: ["Mac navigation", "Drawing", "Gesture control"],
          tags: ["apple", "trackpad", "bluetooth"],
          ratings: { average: 4.8, count: 456 },
          searchKeywords: [
            "apple",
            "magic trackpad",
            "force touch",
            "bluetooth",
          ],
        },
      },
      {
        name: "SteelSeries QcK Heavy XXL",
        brand: "SteelSeries",
        model: "QcK Heavy XXL",
        price: 39.99,
        description:
          "Professional gaming mouse pad with micro-woven cloth surface and non-slip base",
        image:
          "https://m.media-amazon.com/images/I/316ltdPI+tL._AC_UF894,1000_QL80_.jpg",
        category: "accessories",
        status: "active",
        specs: {
          common: {
            releaseYear: 2023,
            warranty: "1 year limited",
          },
          details: {
            size: "900mm x 400mm",
            thickness: "4mm",
            material: "Micro-woven cloth",
            base: "Non-slip rubber",
          },
        },
        metadata: {
          features: ["Micro-woven surface", "Non-slip base", "Stitched edges"],
          useCases: ["Gaming", "Professional use", "Desk setup"],
          tags: ["mousepad", "gaming", "large"],
          ratings: { average: 4.7, count: 892 },
          searchKeywords: ["steelseries", "mousepad", "qck", "gaming"],
        },
      },
    ];

    await Product.insertMany(products);
    return {
      success: true,
      message: `${products.length} products seeded successfully`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
