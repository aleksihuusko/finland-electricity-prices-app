# Finland Electricity Prices App

A React-based web application that displays real-time electricity prices for Finland using the ENTSO-E Transparency Platform API. The app shows both current day and next day electricity prices in EUR/MWh.

![finland-electricity-prices-app](https://github.com/user-attachments/assets/a6dcda21-deff-4d8e-a2e9-4f4954420bee)

## Features

- Real-time electricity prices for Finland
- Display of current day's hourly prices

- Next day's prices (available after 13:00 Finnish time)
- Responsive design for both desktop and mobile
- Loading states and error handling
- Clean and intuitive user interface

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- An API key from ENTSO-E Transparency Platform

## Getting Started

1. Clone the repository:

```bash
git clone [your-repository-url]
cd sahkohinnat-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your ENTSO-E API key:

```bash
VITE_ENTSOE_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run lint` - Runs ESLint for code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
sahkohinnat-app/
├── src/
│   ├── components/
│   │   └── PriceTable.jsx
│   ├── services/
│   │   └── electricityService.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── index.css
│   │   └── PriceTable.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
└── vite.config.js
```

## Development

The project uses:

- Vite as the build tool
- React 18 for the UI
- ESLint for code quality
- CSS for styling

To start development:

1. Make sure you have all dependencies installed
2. Start the development server with `npm run dev`
3. Make changes to the code - hot reloading is enabled
4. Use ESLint for code quality (`npm run lint`)

## API Configuration

The application uses the ENTSO-E Transparency Platform API. The proxy configuration in `vite.config.js` handles the API requests to avoid CORS issues.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ENTSO-E Transparency Platform for providing the electricity price data
- React community for the excellent documentation and tools
