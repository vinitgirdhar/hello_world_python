# 🌊 Paani Care - Water Quality Monitoring System

A comprehensive water quality monitoring and health surveillance application designed specifically for Northeast India, addressing water-borne diseases and public health challenges.

## 🚀 Features

### 🗺️ Interactive Mapping
- **Real-time Water Quality Monitoring** - Track water sources across Northeast India
- **Health Facility Mapping** - Locate nearby hospitals and health centers
- **Disease Outbreak Tracking** - Monitor and visualize epidemic outbreaks
- **Safe Zone Identification** - Find safe water distribution points

### 💬 AI-Powered Assistance
- **Multilingual Chatbot** - Support for English, Hindi, and Northeast Indian languages
- **Symptom Analysis** - AI-driven health assessment and recommendations
- **Emergency Response** - Quick access to health services and emergency contacts

### 📊 Data Visualization
- **Water Quality Analytics** - pH levels, turbidity, contamination tracking
- **Health Statistics** - Disease patterns and outbreak predictions
- **Real-time Weather Integration** - Environmental conditions affecting water quality

### 🌐 Multi-language Support
- **English** - Primary interface language
- **Hindi** - Regional language support
- **Northeast Indian Languages** - Local language accessibility

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern, translucent interface elements
- **Dark/Light Theme** - Adaptive theming for better user experience
- **Responsive Design** - Mobile-first approach for accessibility

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Ant Design** for UI components
- **Leaflet.js** for interactive maps
- **CSS3** with modern styling techniques

### Development Tools
- **Create React App** - Project bootstrapping
- **ESLint & Prettier** - Code quality and formatting
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/ashwin8332/paani_care.git
cd paani_care

# Navigate to the application directory
cd paani-care

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Build for Production
```bash
# Create production build
npm run build

# The build folder contains the production-ready files
```

### Environment Configuration
Create a `.env` file in the `paani-care` directory:
```env
REACT_APP_API_BASE_URL=your_api_url
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 📁 Project Structure

```
paani_care/
├── paani-care/                 # Main React application
│   ├── public/                 # Static assets
│   │   ├── videos/            # Video assets
│   │   └── favicon.ico        # App icon
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable components
│   │   │   ├── AIChatbot.tsx  # AI chatbot component
│   │   │   ├── Header.tsx     # Navigation header
│   │   │   ├── Footer.tsx     # Footer component
│   │   │   └── ThemeProvider.tsx # Theme management
│   │   ├── pages/             # Page components
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Map.tsx        # Interactive map
│   │   │   ├── Dashboard.tsx  # Analytics dashboard
│   │   │   └── WaterQuality.tsx # Water quality monitoring
│   │   ├── contexts/          # React contexts
│   │   │   ├── AuthContext.tsx # Authentication
│   │   │   └── LanguageContext.tsx # Multi-language support
│   │   ├── locales/           # Translation files
│   │   │   ├── en.ts          # English translations
│   │   │   └── hi.ts          # Hindi translations
│   │   └── types/             # TypeScript type definitions
│   ├── package.json           # Dependencies and scripts
│   └── tsconfig.json          # TypeScript configuration
├── README.md                  # Project documentation
└── .gitignore                # Git ignore rules
```

## 🌟 Key Features

### Water Quality Monitoring
- **Real-time Data Collection** - Monitor pH levels, turbidity, and contamination
- **Historical Trends** - Track water quality changes over time
- **Alert System** - Notifications for dangerous water conditions

### Health Surveillance
- **Disease Mapping** - Track water-borne disease outbreaks
- **Symptom Reporting** - Community-driven health monitoring
- **ASHA Worker Communication** - Direct connection with health workers

### Emergency Response
- **Safe Zone Location** - Find clean water during emergencies
- **Health Facility Directory** - Locate nearby medical facilities
- **Emergency Contacts** - Quick access to health services

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Ashwin (@ashwin8332)
- **Email**: anshilashwin80@gmail.com

## 🙏 Acknowledgments

- Northeast India Water Quality Monitoring Initiatives
- Public Health Department collaborations
- Open source community contributions
- ASHA workers and health professionals

## 📞 Support

For support, email anshilashwin80@gmail.com or create an issue in this repository.

---

**Built with ❤️ for Northeast India's water quality and public health**

