# InventoryWizard — User Manual

**Version 1.0**
**Platform: Android**
**Developed for: CSE3MAD Mobile Application Development**

---

## Table of Contents

1. Introduction
2. Getting Started
3. Creating an Account
4. Logging In
5. Home Screen
6. Products
7. Orders
8. Pack Order
9. Stock Lookup
10. Stocktake
11. Profile
12. Help System
13. Common Issues and Troubleshooting

---

## 1. Introduction

InventoryWizard is a mobile inventory management application designed for small to medium-sized businesses. It allows business owners and warehouse staff to manage their product catalogue, track stock levels, process sales orders, and perform warehouse operations directly from a smartphone — without needing a computer or a desktop system.

**Who is it for?**
- Small business owners who sell physical products
- Warehouse workers who pick and pack orders
- Shop managers who need to track stock

**What problems does it solve?**

Traditional inventory management systems are expensive, require training, and are tied to desktop computers. InventoryWizard puts the same capabilities in your pocket. A warehouse worker can scan a barcode and instantly know the stock level. A business owner can create a new order while talking to a customer on the phone. A manager can run a full stocktake by walking the warehouse floor with just a smartphone.

---

## 2. Getting Started

### Requirements
- Android smartphone running Android 8.0 or later
- Internet connection (for login, syncing, and cloud data)
- Camera permission (for barcode scanning)
- Location permission (for delivery address picker)

### Installation
1. Download the InventoryWizard APK file
2. On your Android device, go to **Settings → Security → Install unknown apps** and allow installation from your browser or file manager
3. Open the APK file and tap **Install**
4. Once installed, tap **Open**

---

## 3. Creating an Account

When you first open the app you will see the **Login** screen. If you do not have an account yet, tap **Sign up** at the bottom of the screen.

### Signup Screen

Fill in the following fields:

| Field | Description |
|---|---|
| Full Name | Your real name — used to personalise your account |
| Business Name | Optional — the name of your business or organisation |
| Email | Your email address — used to log in |
| Password | Choose a secure password (minimum 6 characters) |

Tap **Create Account** to register.

**Important:** You must agree to the Terms and Conditions before your account is created. Tap the terms link to read them.

**Real world benefit:** Each account stores its own separate product catalogue and orders. Multiple employees can have their own accounts, keeping their data private and separate.

---

## 4. Logging In

### Email and Password Login

1. Enter your registered email address
2. Enter your password
3. Tap **Login**

If you enter the wrong password, the app will display a clear error message telling you what went wrong. You can tap **Show** next to the password field to reveal what you have typed.

### Google Sign-In

Tap **Continue with Google** to sign in with your existing Google account. This is faster and means you do not need to remember a separate password for InventoryWizard.

**Real world benefit:** Google Sign-In is more secure than a password for many users because it uses Google's two-factor authentication system automatically.

### Forgot Password

Tap **Forgot password?** on the login screen to reset your password via email.

---

## 5. Home Screen

The Home screen is your central dashboard. Everything in the app is accessible from here.

### What you see

**Status banner** — At the top of the screen, a banner shows the current state of your inventory:
- Yellow banner: One or more products are below their low stock threshold — tap it to go straight to your products list
- Blue banner: You have new pending orders — tap it to go to orders
- Green banner: Everything is in order

**Quick access grid** — Seven large buttons give you instant access to every operation:

| Button | What it does |
|---|---|
| Stock Lookup | Search for any product instantly |
| Stocktake | Update stock counts by scanning or typing |
| Pack Order | Guide you through packing a customer order |
| Add Product | Add a new product to your catalogue |
| Add Order | Create a new sales order |
| Orders | View all existing orders |
| Products | Browse your full product list |

### Search bar

The search bar at the top lets you search for any product by name. As you type, results appear in a dropdown list. Tap any result to open the product's full detail page.

You can also tap the **barcode icon** inside the search bar to open the camera and scan a barcode to search for a product — useful when you have a physical item in your hand.

### Profile menu

Tap your avatar (or the initial of your name) in the top right corner to open a profile dropdown with links to:
- **Account** — view your account details
- **Premium Status** — check your subscription and free period
- **Change Details** — edit your name and business name
- **Help** — view the tutorial for the current screen

**Real world benefit:** The home screen gives a warehouse worker everything they need at a glance. With a single tap they can start scanning, packing, or looking up stock — no menus to dig through.

---

## 6. Products

### Products List

The Products screen shows your complete inventory. Each product card displays:
- Product name and brand
- Barcode
- Stock quantity (shown in green if healthy, red if low)
- A "Low" badge if stock is below the threshold you set

Tap the **search icon** to filter products by name, barcode, or SKU.

Tap the **+ button** in the top right to add a new product.

Tap any product to view its full details.

### Adding a Product

Tap **Add Product** from the home screen or the + button on the Products screen.

Fill in the following fields:

| Field | Required | Description |
|---|---|---|
| Product Name | Yes | The name of the item |
| Brand | No | Manufacturer or brand name |
| SKU | No | Your internal stock-keeping unit code |
| Barcode | No | The product's barcode number |
| Quantity | Yes | How many units you currently have |
| Low Stock Threshold | No | The minimum quantity before a warning is shown |
| Cost Price | No | What you paid for the item |
| Selling Price | No | What you sell it for |
| Storage Location | No | Where in the warehouse it is stored (e.g. Shelf B3) |
| Product Photo | No | Tap the camera icon to take a photo or choose from your gallery |

You can scan the barcode instead of typing it by tapping the **barcode icon** next to the barcode field.

Tap **Save Product** when done.

**Real world benefit:** Having cost price and selling price stored against each product means you can quickly calculate your profit margin. The storage location field tells a warehouse worker exactly where to find the item without asking anyone.

### Product Detail Screen

Tap any product in the list to see its full information including:
- Product photo (or a placeholder icon if none was added)
- Current stock quantity in a large badge
- Low stock warning banner if stock is below threshold
- All stored details in a clean information table

---

## 7. Orders

### Orders List

The Orders screen shows all your sales orders. Each order card shows:
- SO (Sales Order) number
- Customer name
- Number of items
- Payment status (Paid / Unpaid / Partial)
- Date created

### Creating an Order

Tap **Add Order** from the home screen or the + button on the Orders screen. The process is split into two steps:

**Step 1 — Order Details**

| Field | Required | Description |
|---|---|---|
| Merchant Name | Yes | The customer's name or business |
| SO Number | Yes | A unique reference number for this order (e.g. SO-0042) |
| Delivery Address | No | Where to ship the order |
| Payment Status | Yes | Choose Unpaid, Paid, or Partial |

**Delivery Address Map Picker**

Tap the **location pin icon** on the right side of the Delivery Address field to open an interactive map. The map will centre on your current location. Tap anywhere on the map to drop a pin at the delivery address. The app will automatically convert the pin location to a street address using reverse geocoding. Tap **Confirm Location** to fill the address field automatically.

This is particularly useful when a customer reads out a general area or landmark — you can tap the location on the map rather than trying to type a full address.

**Step 2 — Add Items**

After filling in the order details and tapping **Create New Order**, you move to the items step.

1. Enter or scan the barcode of a product
2. Enter the quantity ordered
3. Tap **Add Item to Order**
4. Repeat for each product in the order
5. Tap **Done** when all items have been added

Added items appear in a list at the bottom of the screen so you can track what has been added.

**Real world benefit:** Creating orders on the phone while talking to a customer means orders are recorded instantly — no paper forms that get lost or misread later. The map picker removes address typing errors that cause delivery failures.

---

## 8. Pack Order

The Pack Order screen guides a warehouse worker through the process of physically packing a customer's order and deducting the packed quantities from stock automatically.

### Step 1 — Enter SO Number

Type the SO number of the order you are about to pack (e.g. `SO-0042`) and tap **Enter**. The app will look up the order and confirm the customer's name.

### Step 2 — Pack a Product

1. Scan or enter the barcode of the product you are packing
2. Enter the quantity you are placing in the box
3. Tap **Pack Product**

The app will:
- Look up the product in your inventory
- Deduct the packed quantity from the current stock level
- Show a success confirmation with the product name and packed count

### Step 3 — Continue or Finish

After packing each product, you can:
- Tap **Pack Another Product** to pack the next item in the order
- Tap **New Order** to start a completely different order

**Torch Button**

In low-light warehouse environments, tap the **torch icon** (top left of the barcode scanner) to turn on your phone's flashlight. Tap it again to turn it off. This makes it possible to scan barcodes in dark storage areas, under shelving, or in poorly lit warehouses.

**Real world benefit:** This screen turns the packing process into a guided checklist. Stock is deducted automatically as items are packed, so your inventory counts are always accurate without requiring anyone to manually update spreadsheets after each order.

---

## 9. Stock Lookup

Stock Lookup lets you instantly find any product and check its current stock level.

### Searching

Type any of the following into the search bar:
- Product name (or partial name)
- Barcode number
- SKU code

Tap the **Search** button or press Enter on your keyboard. Results appear immediately.

Alternatively, tap the **barcode icon** to open the camera and scan a physical barcode.

### Reading the Results

Each result card shows:
- Product name and brand
- Barcode
- SKU (if set)
- Stock quantity — shown in green if healthy, red if low
- A **Low** badge if the quantity is at or below the low stock threshold

Tap any result to open the full product detail page.

**Real world benefit:** A customer calls asking if you have a product in stock. Instead of walking to a computer, you scan the barcode from the shelf or type the product name on your phone and have the answer in seconds.

---

## 10. Stocktake

Stocktake allows you to correct stock quantities when you physically count your inventory. This is done regularly in businesses to make sure the system matches what is actually on the shelf.

### How to perform a stocktake

1. Pick up a product from the shelf
2. Count how many units you physically have
3. Scan the barcode or type the product name
4. Enter the actual count in the **Product in Hand** field
5. Tap **Update Information**

The app will update the product's quantity in the database to match what you entered.

### Result display

After a successful update, the app shows:
- The product name
- The **previous** quantity (what the system had before)
- The **updated** quantity (what you just counted)

This before/after view makes it easy to spot discrepancies.

Tap **Stocktake Another** to continue counting the next product.

**Real world benefit:** In most businesses, stock counts drift over time due to theft, damage, or recording errors. Regular stocktakes using this screen keep your inventory data accurate so you never under-order or over-order stock.

---

## 11. Profile

Access the Profile screen by tapping your avatar on the Home screen and selecting **Account** or **Change Details**.

The Profile screen has three tabs:

### Account Tab
Displays your current account information:
- Full name
- Email address
- Business name
- Member since date
- Subscription status

Tap **Log Out** at the bottom to sign out of the app.

### Premium Tab
Shows your subscription status and free period progress:
- Days remaining on your 2-year free period
- A progress bar showing how much of the free period has been used
- A list of features included in your subscription

### Edit Tab
Update your personal details:
- **Full Name** — change how your name appears in the app
- **Business Name** — update your business name
- Email cannot be changed

Tap **Save Changes** to apply your updates.

### Profile Photo
Tap your avatar at the top of any Profile tab to change your profile photo. The app will ask permission to access your photo library. Select a photo, crop it to a square, and it will be saved to your profile.

**Real world benefit:** Keeping your business name up to date ensures it appears correctly on any documents or records generated by the app.

---

## 12. Help System

Every screen in the app has a built-in tutorial accessible via the **? icon** in the top right corner of the screen header.

### First-time tutorial
The first time you visit any screen, the help modal opens automatically so you learn how to use it before doing anything.

### Accessing help again
At any time, tap the **? icon** in the top right corner of any screen to re-open the tutorial for that screen.

### What the help screen contains
Each tutorial is specific to the screen you are on. It explains what the screen does, how to use each feature on it, and tips for common tasks.

---

## 13. Common Issues and Troubleshooting

---

**Problem: I cannot log in — "No account found with that email"**

Cause: The email address entered does not match any registered account, or was entered incorrectly.

Solution:
1. Check for typos in the email address
2. Make sure you are using the same email you registered with
3. If you signed up with Google, use the **Continue with Google** button instead of email/password

---

**Problem: Barcode scanner is not reading the barcode**

Cause: Poor lighting, blurry camera, or barcode is damaged.

Solution:
1. Tap the **torch icon** (top left of the scanner) to turn on the flashlight
2. Hold the phone steady and 10–20cm from the barcode
3. Make sure the barcode is fully inside the white corner frame
4. If the barcode is damaged, manually type the number into the barcode field

---

**Problem: The map is not loading on the Add Order screen**

Cause: No internet connection, or location permission has not been granted.

Solution:
1. Make sure you are connected to the internet
2. Go to **Settings → Apps → InventoryWizard → Permissions** and enable Location
3. Restart the app and try again
4. If the map still does not load, manually type the delivery address into the text field

---

**Problem: Product not found when scanning during Pack Order or Stocktake**

Cause: The product may not have a barcode saved in the system, or was added under a different barcode.

Solution:
1. Go to the Products screen and find the product by name
2. Open the product detail and check what barcode is stored
3. Update the product's barcode if necessary via the Add Product screen

---

**Problem: Stock quantities are not updating after packing**

Cause: A network error may have occurred during the update.

Solution:
1. Check your internet connection
2. Repeat the packing step — the app will show an error message if the update fails
3. Use the Stocktake screen to manually correct the quantity if needed

---

**Problem: Low stock alerts are not appearing on the home screen**

Cause: The low stock threshold may not have been set for the product.

Solution:
1. Open the product's detail page
2. Check the **Low Stock Threshold** value — if it shows `—` it has not been set
3. Edit the product and enter a threshold value (e.g. 5 means a warning appears when stock drops to 5 or below)

---

**Problem: I accidentally logged out**

Solution:
1. Open the app — you will be taken to the Login screen
2. Enter your email and password and tap Login
3. All your data is stored in Firebase and will be restored automatically

---

*InventoryWizard v1.0 — User Manual*
*Developed as part of CSE3MAD Mobile Application Development*
