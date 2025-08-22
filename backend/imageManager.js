import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory structure
const createImageDirectories = () => {
  const baseDir = path.join(__dirname, 'public', 'images');
  const categories = ['electronics', 'clothing', 'shoes', 'accessories', 'home-decor', 'beauty', 'sports', 'grocery'];
  
  // Create base directories
  if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
  }
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  
  // Create category directories
  categories.forEach(category => {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir);
    }
  });
  
  console.log('Image directories created successfully!');
};

// Download image from URL
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Get relevant image URLs for products
const getProductImageUrls = (productName, category, brand) => {
  const productType = productName.toLowerCase();
  let imageUrls = [];
  
  // Define specific image URLs for different product types
  if (productType.includes('iphone')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('macbook')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('galaxy')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('ipad')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('headphones') || productType.includes('wh-1000xm5')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('airpods')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('tv')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('laptop') || productType.includes('xps')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('t-shirt')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('jeans')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('dress')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('sneakers') || productType.includes('running')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('boots')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('sunglasses')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('watch')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('lipstick')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('mascara')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('foundation')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('yoga mat')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ];
  } else if (productType.includes('dumbbells')) {
    imageUrls = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ];
  } else {
    // Fallback images based on category
    if (category === 'electronics') {
      imageUrls = [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop'
      ];
    } else if (category === 'clothing') {
      imageUrls = [
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop'
      ];
    } else if (category === 'shoes') {
      imageUrls = [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'
      ];
    } else if (category === 'beauty') {
      imageUrls = [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop'
      ];
    } else if (category === 'sports') {
      imageUrls = [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop'
      ];
    } else {
      // Generic fallback
      imageUrls = [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop'
      ];
    }
  }
  
  return imageUrls;
};

export {
  createImageDirectories,
  downloadImage,
  getProductImageUrls
};
