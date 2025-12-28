# LabNearMe - Comprehensive Lab Finder Platform

LabNearMe is a modern, web-based platform designed to connect patients with medical laboratories and diagnostic centers. It provides an intuitive interface for finding labs by proximity, booking appointments, and managing lab requests.

## 🚀 Key Features

### For Patients
- **Proximity Search**: Find clinics near your current location using geolocation and adjustable search radii (5km to 100km).
- **Interactive Map View**: Visualize clinic locations on an OpenStreetMap with detailed pins showing clinic names, addresses, and images.
- **Easy Booking**: Request lab services directly from the clinic card with instant notifications.
- **Map Navigation**: Get step-by-step routing and directions from your current location to any clinic.
- **Informational Resources**: Dedicated Help Center, Privacy Policy, and Terms of Service pages.

### For Clinics
- **Professional Dashboard**: Manage online/offline status, update clinic profile details, and track lab requests.
- **Service Management**: List and update services offered by the clinic.
- **Verification System**: Secure registration flow including OTP-based verification (planned/mocked).
- **Contact Inquiries**: Receive and respond to user inquiries via the integrated contact system.

### Core Platform Features
- **Dynamic Design**: A premium, responsive UI built with modern aesthetics (glassmorphism, vibrant palettes).
- **SEO Optimized**: Semantic HTML and descriptive meta tags for better search engine visibility.
- **Security First**: Mandatory acceptance of Terms & Conditions for all users, secure role-based access.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Routing**: Wouter
- **Data Fetching**: TanStack React Query
- **Maps & Location**: Leaflet, Leaflet Routing Machine, OpenStreetMap API
- **Icons**: Lucide React
- **Backend API**: Integrated via a custom API client (`/lib/api.ts`)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/Lab-Finder.git
   cd Lab-Finder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   VITE_API_BASE_URL=your_api_url
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support
For any inquiries or feedback, please visit our [Contact Page](http://localhost:5173/contact) or email us at `support@labnearme.com`.
