# TechVault - Modern E-commerce Platform

TechVault is a modern e-commerce platform built with React, TypeScript, and MongoDB, featuring category-based product organization, AI-powered recommendations, and real-time chat support.

## Features

- 🛍️ Modern product catalog with dynamic filtering
- 🗃️ Category-based product organization
- 🛒 Interactive shopping cart
- 💬 Real-time chat support with AI recommendations
- 🖼️ High-quality product images from CDN
- 🎨 Sleek UI with Tailwind CSS
- 📱 Fully responsive design
- ⚡ Fast and optimized performance
- 🔄 MongoDB integration for product management
- 🤖 AI-powered product recommendations

## Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **UI Components**:
  - HeadlessUI for accessible components
  - HeroIcons for modern icons
- **Notifications**: React Hot Toast

### Backend

- **Server**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **API**: RESTful endpoints
- **MCP Servers**:
  - Product DB Server (MongoDB operations)
  - Product Image Server (DALL-E integration)
  - OpenAI Server (Chat recommendations)

### Type System

- **Base Types**: Shared product interfaces
- **MongoDB Types**: Database-specific schemas
- **UI Types**: Frontend-specific interfaces
- **Enhanced Types**: AI recommendation types
- **Type Conversion**: Automated type transformations

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB Atlas account
- OpenAI API key
- Environment variables configured

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Create .env file
   cp .env.example .env

   # Add your configuration
   MONGODB_URI=your_mongodb_uri
   OPENAI_API_KEY=your_openai_key
   PORT=5002
   ```

4. Start the development servers:

   ```bash
   # Start Express backend
   npm run server

   # Start React frontend
   npm start

   # Start MCP servers
   npm run mcp
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
ecommerce-app/
├── server/               # Express backend
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   └── routes/          # API endpoints
├── src/
│   ├── components/      # React components
│   │   ├── CategoryPage/
│   │   ├── ChatWidget/
│   │   ├── Navbar/
│   │   ├── ProductCatalog/
│   │   └── ShoppingCart/
│   ├── context/        # React Context providers
│   │   └── CartContext.tsx
│   ├── types/         # TypeScript type definitions
│   │   └── product.ts
│   ├── utils/         # Utility functions
│   │   ├── productData.ts
│   │   └── productRecommender.ts
│   ├── App.tsx       # Main application component
│   └── index.tsx     # Application entry point
└── package.json
```

## Development

### Type System

The application uses a sophisticated type system:

```typescript
// Base product interface
interface BaseProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

// MongoDB specific
interface MongoProduct extends BaseProduct {
  _id: string;
  specs: Record<string, string>;
}

// UI specific
interface UIProduct extends BaseProduct {
  id: number;
  features: string[];
  useCase: string[];
}

// Enhanced with metadata
interface EnhancedProduct extends UIProduct {
  metadata: ProductMetadata;
}
```

### Available Scripts

- `npm start`: Runs the React app in development mode
- `npm run server`: Starts the Express backend server
- `npm run mcp`: Starts all MCP servers
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
