# API Storage

A modern web application for managing API service information, including endpoints, keys, and models.

![API Storage Screenshot](https://via.placeholder.com/800x450.png?text=API+Storage+Screenshot)

## Features

- 🔐 Securely store API service details (endpoints, keys, models)
- 🔍 Search and filter through your API services
- 📋 Copy API information to clipboard with one click
- 🌙 Modern dark mode interface
- 💾 Local storage persistence
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- npm or yarn package manager

### Installation

1. Clone the repository or download the source code

```bash
git clone https://github.com/yourusername/api-storage.git
cd api-storage
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding a New API Service

1. Click the "Add Service" button in the top right corner
2. Fill in the service details:
   - Name: A descriptive name for the API service
   - Base URL: The root endpoint for the API
   - Models: Add one or more model identifiers
   - API Keys: Add one or more named API keys

### Managing Services

- **Search**: Use the search bar to filter services by name, URL, model, or API key
- **Edit**: Click the edit icon on any service to modify its details
- **Delete**: Click the delete icon to remove a service
- **Copy**: Use the copy buttons to quickly copy URLs, keys, or other information

## Development

### Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React

### Project Structure

```
api-storage/
├── public/
├── src/
│   ├── components/     # React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
