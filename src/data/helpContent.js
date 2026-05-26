export default {
  Home: {
    title: 'Home Screen',
    sections: [
      {
        icon: 'search-outline',
        title: 'Search Products',
        body: 'Type a product name, barcode, or SKU in the search bar to quickly find any product. Results appear as a dropdown — tap one to open its detail page.',
      },
      {
        icon: 'barcode-outline',
        title: 'Barcode Scanner',
        body: 'Tap the barcode icon on the left of the search bar to open your camera. Point it at any product barcode to search for it instantly.',
      },
      {
        icon: 'warning-outline',
        title: 'Low Stock Alert',
        body: 'A yellow banner appears when one or more products are below their low stock threshold. Tap it to go to the Products screen and see which items need restocking.',
      },
      {
        icon: 'notifications-outline',
        title: 'New Orders Banner',
        body: 'A blue banner appears when there are pending orders. Tap it to go directly to the Orders screen.',
      },
      {
        icon: 'grid-outline',
        title: 'Quick Actions',
        body: 'The grid of buttons gives you fast access to all features: Stock Lookup, Stocktake, Pack Order, Add Product, Add Order, Orders, and Products.',
      },
      {
        icon: 'person-outline',
        title: 'Profile Menu',
        body: 'Tap your avatar icon in the top right to access your Account details, Premium status, and to edit your profile information.',
      },
    ],
  },

  Products: {
    title: 'Products Screen',
    sections: [
      {
        icon: 'search-outline',
        title: 'Search Products',
        body: 'Use the search bar to filter your products by name, SKU, or barcode. The list updates as you type.',
      },
      {
        icon: 'warning-outline',
        title: 'Low Stock Filter',
        body: 'Tap the warning icon button to the right of the search bar to show only products that are at or below their low stock threshold.',
      },
      {
        icon: 'cube-outline',
        title: 'Product Cards',
        body: 'Each card shows the product thumbnail, name, brand, barcode, and current stock quantity. The quantity turns red when stock is low.',
      },
      {
        icon: 'eye-outline',
        title: 'View Product Details',
        body: 'Tap any product card to open its full detail screen, where you can see all information including price and storage location.',
      },
      {
        icon: 'add-circle-outline',
        title: 'Add a Product',
        body: 'Tap the + icon in the top right corner to add a new product to your inventory.',
      },
    ],
  },

  AddProduct: {
    title: 'Add Product Screen',
    sections: [
      {
        icon: 'camera-outline',
        title: 'Product Photo',
        body: 'Tap the photo area at the top to add a product image. A dialog will appear letting you choose between taking a new photo with your camera or picking one from your gallery.',
      },
      {
        icon: 'create-outline',
        title: 'Required Fields',
        body: 'Product Name is the only required field. Everything else — brand, barcode, SKU, location, prices, and stock threshold — is optional but recommended for full functionality.',
      },
      {
        icon: 'barcode-outline',
        title: 'Barcode Field',
        body: 'You can type a barcode manually or tap the barcode icon next to the field to scan it with your camera. Scanning is faster and avoids typos.',
      },
      {
        icon: 'warning-outline',
        title: 'Low Stock Threshold',
        body: 'Set a minimum stock number here. The app will alert you on the Home screen and Products screen when this product\'s quantity drops to or below that level. Set to 0 to disable the alert.',
      },
      {
        icon: 'save-outline',
        title: 'Saving the Product',
        body: 'Tap "Save Product" at the bottom when all details are filled in. The product is added to your inventory immediately.',
      },
    ],
  },

  ProductDetail: {
    title: 'Product Detail Screen',
    sections: [
      {
        icon: 'image-outline',
        title: 'Product Image',
        body: 'The product photo is shown at the top. If no photo was added, a placeholder icon is displayed instead.',
      },
      {
        icon: 'cube-outline',
        title: 'Stock Status',
        body: 'The badge next to the product name shows the current stock quantity. It turns red and a warning banner appears when the product is below its low stock threshold.',
      },
      {
        icon: 'information-circle-outline',
        title: 'Product Information',
        body: 'The info card shows all product details: brand, barcode, SKU, storage location, cost price, selling price, and low stock threshold.',
      },
      {
        icon: 'refresh-outline',
        title: 'Updating Stock',
        body: 'To update the stock count, use the Stocktake feature from the Home screen. Search for this product by name or barcode and enter the corrected count.',
      },
    ],
  },

  Orders: {
    title: 'Orders Screen',
    sections: [
      {
        icon: 'list-outline',
        title: 'Order List',
        body: 'All your sales orders are listed here, showing the SO number, customer name, date, and status badge (Pending, Completed, or Cancelled).',
      },
      {
        icon: 'chevron-down-outline',
        title: 'Expanding an Order',
        body: 'Tap any order card to expand it and see shipping address, payment details, total amount, and the list of products in the order.',
      },
      {
        icon: 'checkmark-circle-outline',
        title: 'Mark as Completed',
        body: 'When an expanded order is Pending, a "Mark as Completed" button appears. Tap it to update the order status to Completed.',
      },
      {
        icon: 'add-circle-outline',
        title: 'Creating an Order',
        body: 'Tap the + icon in the top right to create a new sales order. You\'ll fill in the merchant details first, then add items to the order.',
      },
    ],
  },

  AddOrder: {
    title: 'Add Order Screen',
    sections: [
      {
        icon: 'document-text-outline',
        title: 'Step 1 — Order Details',
        body: 'Enter the Merchant Name and SO Number (both required). You can also add a delivery address and set the payment status to Paid, Unpaid, or Partial.',
      },
      {
        icon: 'cube-outline',
        title: 'Step 2 — Add Items',
        body: 'After creating the order, add the products being ordered. Search for each product by barcode or name, enter the quantity, and tap "Add Item to Order".',
      },
      {
        icon: 'barcode-outline',
        title: 'Barcode Scanner',
        body: 'Tap the barcode icon next to the product field to scan a product barcode with your camera rather than typing it manually.',
      },
      {
        icon: 'checkmark-circle-outline',
        title: 'Finishing Up',
        body: 'Once all items are added, tap "Done" to complete the order. You\'ll see a success screen with a summary, then you can view the order in the Orders screen.',
      },
    ],
  },

  PackOrder: {
    title: 'Pack Order Screen',
    sections: [
      {
        icon: 'document-text-outline',
        title: 'Step 1 — Enter SO Number',
        body: 'Type the Sales Order number (e.g. SO-0001) to load the order you want to pack. The order must already exist in your Orders screen.',
      },
      {
        icon: 'cube-outline',
        title: 'Step 2 — Pack Products',
        body: 'Scan or type a product barcode, enter how many units you have packed, then tap "Pack Product". The product\'s stock level is automatically reduced by that amount.',
      },
      {
        icon: 'barcode-outline',
        title: 'Barcode Scanner',
        body: 'Tap the barcode icon next to the product field to scan a barcode with your camera. This is quicker and avoids typing errors.',
      },
      {
        icon: 'refresh-outline',
        title: 'Pack Another Product',
        body: 'After successfully packing one product, tap "Pack Another Product" to continue with the next item in the same order.',
      },
    ],
  },

  StockLookup: {
    title: 'Stock Lookup Screen',
    sections: [
      {
        icon: 'search-outline',
        title: 'Searching',
        body: 'Type a product name, barcode, or SKU then tap the blue search button or press the keyboard Search key. All matching products appear as a list below.',
      },
      {
        icon: 'barcode-outline',
        title: 'Barcode Scanner',
        body: 'Tap the barcode icon on the right of the search field to open your camera. Scan a product barcode and the search runs automatically.',
      },
      {
        icon: 'cube-outline',
        title: 'Search Results',
        body: 'Each result card shows the product thumbnail, name, brand, barcode, and current stock quantity. Products below their threshold show a red "Low" badge.',
      },
      {
        icon: 'eye-outline',
        title: 'View Product Details',
        body: 'Tap any result card to open the full product detail screen with all information about that product.',
      },
    ],
  },

  Stocktake: {
    title: 'Stocktake Screen',
    sections: [
      {
        icon: 'clipboard-outline',
        title: 'What is Stocktake?',
        body: 'Stocktake lets you update a product\'s stock count to match what you physically have on hand. Use this after physically counting your inventory items.',
      },
      {
        icon: 'barcode-outline',
        title: 'Finding a Product',
        body: 'Enter a product barcode or name in the first field, or tap the barcode icon to scan with your camera. The product must already exist in your inventory.',
      },
      {
        icon: 'calculator-outline',
        title: 'Entering the Count',
        body: 'In the second field, type the actual number of units you have physically counted. This will replace the current stock number in the system.',
      },
      {
        icon: 'checkmark-circle-outline',
        title: 'Updating',
        body: 'Tap "Update Information" to save the new stock count. A result card shows the previous and updated quantities side by side. Tap "Stocktake Another" to continue with the next product.',
      },
    ],
  },

  Profile: {
    title: 'Profile Screen',
    sections: [
      {
        icon: 'camera-outline',
        title: 'Profile Photo',
        body: 'Tap your avatar at the top of the screen to change your profile photo. Choose an image from your photo gallery.',
      },
      {
        icon: 'person-outline',
        title: 'Account Tab',
        body: 'Displays your account details: full name, email, business name, sign-up date, and subscription status. You can log out of the app from this tab.',
      },
      {
        icon: 'star-outline',
        title: 'Premium Tab',
        body: 'Shows your free period status and how many days remain. All features are included for free for 2 years from your sign-up date.',
      },
      {
        icon: 'create-outline',
        title: 'Edit Tab',
        body: 'Update your full name and business name here. Your email address is permanent and cannot be changed once set.',
      },
    ],
  },
};
