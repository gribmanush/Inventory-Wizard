# InventoryWizard

A mobile inventory management application built for small businesses to track products, manage orders, and streamline warehouse operations — all from a smartphone.

---

## Features

- **Product Management** — Add, view, and manage products with barcode, SKU, pricing, and stock levels
- **Low Stock Alerts** — Visual warnings when stock falls below a defined threshold
- **Order Management** — Create and track sales orders with customer details
- **Pack Order Workflow** — Step-by-step guided order packing with barcode scanning
- **Stock Lookup** — Instantly find any product by scanning or entering a barcode
- **Stocktake** — Perform full or partial inventory counts and update quantities
- **Barcode Scanner** — Camera-based barcode scanning with torch/flashlight support
- **Authentication** — Email/password and Google Sign-In via Firebase Auth
- **Profile Management** — Update business name, display name, and avatar
- **Help System** — Contextual tutorials on every screen, auto-shown on first visit
- **Dark/Light Theme** — System-aware theming throughout the app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Navigation | React Navigation v7 (Stack) |
| Authentication | Firebase Authentication |
| Cloud Database | Firebase Firestore |
| Local Database | SQLite (expo-sqlite) |
| Camera / Scanner | expo-camera |
| Image Picker | expo-image-picker |
| Storage | AsyncStorage |
| Styling | React Native StyleSheet |
| Build | EAS Build |
| Testing | Jest + Firebase Test Lab |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BarcodeScannerModal.js
│   ├── HelpModal.js
│   └── Logo.js
├── config/
│   └── firebase.js      # Firebase initialisation
├── contexts/
│   ├── AuthContext.js   # Global auth state
│   ├── DrawerContext.js
│   └── ThemeContext.js  # Light/dark theme
├── data/
│   └── helpContent.js   # In-app tutorial content
├── database/
│   └── database.js      # All Firestore query functions
├── hooks/
│   └── useHelpModal.js  # First-visit tutorial logic
├── navigation/
│   ├── AppNavigator.js
│   └── DrawerModal.js
├── screens/
│   ├── auth/            # Login, Signup
│   ├── home/            # Dashboard
│   ├── misc/            # Help, Terms
│   ├── operations/      # PackOrder, StockLookup, Stocktake
│   ├── orders/          # Orders, AddOrder
│   ├── products/        # Products, AddProduct, ProductDetail
│   └── profile/         # Profile
├── theme/
│   └── index.js         # Colour tokens
└── utils/
    ├── crypto.js
    └── profanity.js
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your mobile device

### Installation

```bash
git clone https://github.com/gribmanush/InventoryWizard.git
cd InventoryWizard
npm install
```

### Running the App

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

---

## Firebase Setup

This project uses Firebase for authentication and cloud data storage.

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google providers)
3. Enable **Firestore Database**
4. Create `src/config/firebase.js` with your project credentials:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

> **Never commit real credentials to version control.** The `firebase.js` config file is excluded from this repository.

---

## Building an APK

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for cloud-based Android builds.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Download the APK from the link provided in the terminal or from [expo.dev](https://expo.dev).

---

## Testing

### Jest

Unit, integration, and end-to-end tests are written with Jest.

```bash
npm test
```

### Firebase Test Lab

1. Build and download the APK (see above)
2. Go to Firebase Console → **Test Lab**
3. Upload the APK and run a **Robo Test**
4. Review screenshots, video recording, and crash logs per device

---

## Firebase Technologies Used

| Technology | Purpose | Why Selected |
|---|---|---|
| **Firebase Authentication** | User sign-in (email/password + Google) | Handles session management, token refresh, and OAuth flow out of the box — no custom auth server needed |
| **Firestore** | Cloud storage for products, orders, and user profiles | Real-time capable, scales automatically, and supports per-user data isolation via subcollections |
| **Firebase Test Lab** | Automated UI testing on real devices | Enables Robo tests without writing test code — covers device fragmentation across manufacturers |

---

## Screens

| Screen | Description |
|---|---|
| Login | Email/password and Google Sign-In |
| Signup | Account creation with business name |
| Home | Dashboard with quick-access operations |
| Products | Full product list with search |
| Add Product | Create product with barcode, pricing, stock |
| Product Detail | View all product information |
| Orders | Sales order list |
| Add Order | Create order with line items |
| Pack Order | Guided barcode-scan packing workflow |
| Stock Lookup | Instant product lookup by barcode |
| Stocktake | Bulk inventory count and update |
| Profile | Edit account and business details |

---

## License

This project was developed as part of the CSE3MAD Mobile Application Development unit.
