# TechVault - Modern E-commerce Platform

TechVault is a modern e-commerce platform built with React and TypeScript, featuring a real-time chat support system and an intuitive shopping experience.

## Features

- 🛍️ Modern product catalog with dynamic filtering
- 🛒 Interactive shopping cart
- 💬 Real-time chat support with product recommendations
- 🎨 Sleek UI with Tailwind CSS
- 📱 Fully responsive design
- ⚡ Fast and optimized performance

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **UI Components**:
  - HeadlessUI for accessible components
  - HeroIcons for modern icons
- **Notifications**: React Hot Toast
- **Development Tools**:
  - PostCSS for CSS processing
  - ESLint & Prettier for code quality

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v18 or higher)
- npm (v8 or higher)

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

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
ecommerce-app/
├── public/
│   └── images/
│       └── products/    # Product images
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.tsx
│   │   ├── ProductCatalog.tsx
│   │   ├── ShoppingCart.tsx
│   │   └── ChatWidget.tsx
│   ├── context/        # React Context providers
│   │   └── CartContext.tsx
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Application entry point
└── package.json
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
