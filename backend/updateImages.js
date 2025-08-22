const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Generate relevant placeholder images with proper product representation
const getProductImages = (productName, category, brand) => {
  const productType = productName.toLowerCase();
  let imageText = '';
  let bgColor = 'f8f9fa';
  let textColor = '6c757d';
  
  // Determine appropriate image text and colors based on product
  if (productType.includes('iphone')) {
    imageText = 'iPhone';
    bgColor = '000000';
    textColor = 'ffffff';
  } else if (productType.includes('macbook')) {
    imageText = 'MacBook';
    bgColor = 'c0c0c0';
    textColor = '000000';
  } else if (productType.includes('galaxy')) {
    imageText = 'Galaxy';
    bgColor = '1f2937';
    textColor = 'ffffff';
  } else if (productType.includes('ipad')) {
    imageText = 'iPad';
    bgColor = 'ffffff';
    textColor = '000000';
  } else if (productType.includes('headphones') || productType.includes('wh-1000xm5')) {
    imageText = 'Headphones';
    bgColor = '374151';
    textColor = 'ffffff';
  } else if (productType.includes('airpods')) {
    imageText = 'AirPods';
    bgColor = 'ffffff';
    textColor = '000000';
  } else if (productType.includes('tv')) {
    imageText = 'OLED TV';
    bgColor = '000000';
    textColor = 'ffffff';
  } else if (productType.includes('laptop') || productType.includes('xps')) {
    imageText = 'Laptop';
    bgColor = '1f2937';
    textColor = 'ffffff';
  } else if (productType.includes('t-shirt')) {
    imageText = 'T-Shirt';
    bgColor = '3b82f6';
    textColor = 'ffffff';
  } else if (productType.includes('jeans')) {
    imageText = 'Jeans';
    bgColor = '1e40af';
    textColor = 'ffffff';
  } else if (productType.includes('dress')) {
    imageText = 'Dress';
    bgColor = 'ec4899';
    textColor = 'ffffff';
  } else if (productType.includes('sneakers') || productType.includes('running')) {
    imageText = 'Sneakers';
    bgColor = '059669';
    textColor = 'ffffff';
  } else if (productType.includes('boots')) {
    imageText = 'Boots';
    bgColor = '92400e';
    textColor = 'ffffff';
  } else if (productType.includes('sunglasses')) {
    imageText = 'Sunglasses';
    bgColor = '000000';
    textColor = 'ffffff';
  } else if (productType.includes('watch')) {
    imageText = 'Watch';
    bgColor = 'c0c0c0';
    textColor = '000000';
  } else if (productType.includes('lipstick')) {
    imageText = 'Lipstick';
    bgColor = 'dc2626';
    textColor = 'ffffff';
  } else if (productType.includes('mascara')) {
    imageText = 'Mascara';
    bgColor = '000000';
    textColor = 'ffffff';
  } else if (productType.includes('foundation')) {
    imageText = 'Foundation';
    bgColor = 'f59e0b';
    textColor = 'ffffff';
  } else if (productType.includes('yoga mat')) {
    imageText = 'Yoga Mat';
    bgColor = '7c3aed';
    textColor = 'ffffff';
  } else if (productType.includes('dumbbells')) {
    imageText = 'Dumbbells';
    bgColor = '374151';
    textColor = 'ffffff';
  } else {
    // Fallback based on category
    if (category === 'electronics') {
      imageText = 'Electronics';
      bgColor = '1f2937';
      textColor = 'ffffff';
    } else if (category === 'clothing') {
      imageText = 'Clothing';
      bgColor = '3b82f6';
      textColor = 'ffffff';
    } else if (category === 'shoes') {
      imageText = 'Shoes';
      bgColor = '059669';
      textColor = 'ffffff';
    } else if (category === 'beauty') {
      imageText = 'Beauty';
      bgColor = 'ec4899';
      textColor = 'ffffff';
    } else if (category === 'sports') {
      imageText = 'Sports';
      bgColor = 'dc2626';
      textColor = 'ffffff';
    } else {
      imageText = brand;
      bgColor = '6b7280';
      textColor = 'ffffff';
    }
  }
  
  // Create three variations of the same product image
  return [
    `https://via.placeholder.com/600x600/${bgColor}/${textColor}?text=${encodeURIComponent(imageText)}`,
    `https://via.placeholder.com/600x600/${bgColor}/${textColor}?text=${encodeURIComponent(imageText + ' - View 2')}`,
    `https://via.placeholder.com/600x600/${bgColor}/${textColor}?text=${encodeURIComponent(imageText + ' - View 3')}`
  ];
};

async function updateProductImages() {
  try {
    console.log('Updating product images...');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);
    
    for (const product of products) {
      const newImages = getProductImages(product.name, product.category, product.brand);
      product.images = newImages;
      await product.save();
      console.log(`Updated images for: ${product.name}`);
    }
    
    console.log('All product images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
}

updateProductImages();
