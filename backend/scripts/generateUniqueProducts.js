import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create image directories for each category
const createImageDirectories = async () => {
  const categories = [
    'electronics',
    'clothing',
    'home',
    'beauty',
    'sports',
    'grocery',
    'fashion',
    'home-decor',
    'accessories',
    'shoes'
  ];
  
  const baseDir = path.join(process.cwd(), 'public', 'images');
  
  // Create base images directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  // Create category subdirectories
  for (const category of categories) {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  }
  
  console.log('✅ Image directories created successfully');
  return baseDir;
};

// Download image from URL and save to local file system
const downloadImage = async (url, filePath) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      writer.on('finish', () => {
        resolve(filePath);
      });
      
      writer.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    throw error;
  }
};

// Generate unique image URLs for each product
const generateUniqueImageUrls = (category, index) => {
  // Collection of Unsplash image IDs organized by category
  const categoryImageIds = {
    electronics: [
      '1592750475338-74b7b21085ab', '1511707171634-5f897ff02aa9', '1556656793-08538906a9f8',
      '1565849904461-04a58ad377e0', '1512499617640-c74ae3a79d37', '1574944985070-8f3ebc6b79d2',
      '1541807084-5c52b6b3adef', '1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8',
      '1505740420928-5e560c06d30e', '1484704849700-f032a568e944', '1583394838336-acd977736f90',
      '1502920917128-1aa500764cbd', '1606983340126-1e6d2b3c0c3d', '1502920917128-1aa500764cbd',
      '1600294037681-c80b4cb5b434', '1606220945770-b5b6c2c55bf1', '1572569511254-d8f925fe2cbb',
      '1546027658-7aa750153465', '1551645179-3a8a5b93a261', '1593642533144-3d12fb54015a',
      '1593642634315-48f5414c3ad9', '1593642702821-c8da6771f0c6', '1593642702909-dec2ba80fbea',
      '1546868871-7041f2a55e12', '1544866092-6f22bca2c7b3', '1498049794561-7780e7231661',
      '1560472354-b33ff0c44a43', '1526738549149-8e07eca6c147', '1489987707025-afc232f7ea0f'
    ],
    clothing: [
      '1521572163474-6864f9cf17ab', '1576566588028-4147f3842f27', '1583743814966-8936f37f4678',
      '1542272604-787c3835535d', '1594633312681-425c7b97ccd1', '1541099649105-f69ad21f3246',
      '1595777457583-95e059d581b8', '1566479179817-c0b5b4b4b1e8', '1515372039744-b8f02a3ae446',
      '1551028719-00167b16eac5', '1594633312681-425c7b97ccd1', '1507003211169-0a1dd7228f2d',
      '1556821840-3a9fbc86339e', '1620799140408-edc6dcb6d633', '1578662996442-48f60103fc96',
      '1556228720-195a672e8a03', '1571781926291-c477ebfd024b', '1620916566398-39f1143ab7be',
      '1598300042247-d088f8ab3a91', '1612817288484-6f916006741a', '1608248543803-ba4f8c70ae0b',
      '1620916297893-84d3e4a9d5a8', '1611930022073-b7a4ba5fcccd', '1596462502278-27bfdc403348',
      '1522335789203-aabd1fc54bc9', '1631214540242-3cd8c4b0b3b8', '1586495777744-4413f21062fa',
      '1445205170230-053b83016050', '1434389677669-e08b4cac3105', '1603487742131-4160ec999306'
    ],
    home: [
      '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64', '1507003211169-0a1dd7228f2d',
      '1556909114-f6e7ad7d3136', '1585515656973-c0e8e4b0e8b8', '1574180566232-eca2adaacc81',
      '1578662996442-48f60103fc96', '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64',
      '1556909114-f6e7ad7d3136', '1585515656973-c0e8e4b0e8b8', '1574180566232-eca2adaacc81',
      '1616486338812-3dadae4b4ace', '1616137147784-222d5e3a4a0f', '1616486029423-aaa4789e8c9a',
      '1616486217729-a487de3d6ad5', '1616486305134-5c2e41ce6e3f', '1616486304898-6a6f5de5b14d',
      '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9', '1616486305134-5c2e41ce6e3f',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9'
    ],
    beauty: [
      '1586495777744-4413f21062fa', '1596462502278-27bfdc403348', '1522335789203-aabd1fc54bc9',
      '1556228720-195a672e8a03', '1571781926291-c477ebfd024b', '1556228453-efd6c1ff04f6',
      '1541643600914-78b084683601', '1588405748880-12d1d2a59d32', '1594736797933-d0401ba2fe65',
      '1598300042247-d088f8ab3a91', '1612817288484-6f916006741a', '1608248543803-ba4f8c70ae0b',
      '1620916297893-84d3e4a9d5a8', '1611930022073-b7a4ba5fcccd', '1596462502278-27bfdc403348',
      '1522335789203-aabd1fc54bc9', '1631214540242-3cd8c4b0b3b8', '1586495777744-4413f21062fa',
      '1570194065650-d99fb4bedf0a', '1608248543803-ba4f8c70ae0b', '1556228578-8c89e6adf883',
      '1556228453-efd6c1ff04f6', '1608248543803-ba4f8c70ae0b', '1570194065650-d99fb4bedf0a',
      '1556228720-195a672e8a03', '1571781926291-c477ebfd024b', '1620916566398-39f1143ab7be',
      '1598300042247-d088f8ab3a91', '1612817288484-6f916006741a', '1608248543803-ba4f8c70ae0b'
    ],
    grocery: [
      '1542838132-92c53300491e', '1583258712108-2753c0b9710c', '1584473457409-813bf79ec373',
      '1542838132-92c53300491e', '1542838132-92c53300491e', '1583258712108-2753c0b9710c',
      '1584473457409-813bf79ec373', '1542838132-92c53300491e', '1542838132-92c53300491e',
      '1583258712108-2753c0b9710c', '1584473457409-813bf79ec373', '1542838132-92c53300491e',
      '1542838132-92c53300491e', '1583258712108-2753c0b9710c', '1584473457409-813bf79ec373',
      '1542838132-92c53300491e', '1542838132-92c53300491e', '1583258712108-2753c0b9710c',
      '1584473457409-813bf79ec373', '1542838132-92c53300491e', '1542838132-92c53300491e',
      '1583258712108-2753c0b9710c', '1584473457409-813bf79ec373', '1542838132-92c53300491e',
      '1542838132-92c53300491e', '1583258712108-2753c0b9710c', '1584473457409-813bf79ec373',
      '1542838132-92c53300491e', '1542838132-92c53300491e', '1583258712108-2753c0b9710c'
    ],
    fashion: [
      '1539109136935-1cee6c535d98', '1483985988355-763728e1935b', '1509631179035-bde33a5086b2',
      '1487222441953-c54fb06c2a51', '1445205170230-053b83016050', '1434389677669-e08b4cac3105',
      '1603487742131-4160ec999306', '1539109136935-1cee6c535d98', '1483985988355-763728e1935b',
      '1509631179035-bde33a5086b2', '1487222441953-c54fb06c2a51', '1445205170230-053b83016050',
      '1434389677669-e08b4cac3105', '1603487742131-4160ec999306', '1539109136935-1cee6c535d98',
      '1483985988355-763728e1935b', '1509631179035-bde33a5086b2', '1487222441953-c54fb06c2a51',
      '1445205170230-053b83016050', '1434389677669-e08b4cac3105', '1603487742131-4160ec999306',
      '1539109136935-1cee6c535d98', '1483985988355-763728e1935b', '1509631179035-bde33a5086b2',
      '1487222441953-c54fb06c2a51', '1445205170230-053b83016050', '1434389677669-e08b4cac3105',
      '1603487742131-4160ec999306', '1539109136935-1cee6c535d98', '1483985988355-763728e1935b'
    ],
    'home-decor': [
      '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64', '1507003211169-0a1dd7228f2d',
      '1556909114-f6e7ad7d3136', '1585515656973-c0e8e4b0e8b8', '1574180566232-eca2adaacc81',
      '1578662996442-48f60103fc96', '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64',
      '1556909114-f6e7ad7d3136', '1585515656973-c0e8e4b0e8b8', '1574180566232-eca2adaacc81',
      '1616486338812-3dadae4b4ace', '1616137147784-222d5e3a4a0f', '1616486029423-aaa4789e8c9a',
      '1616486217729-a487de3d6ad5', '1616486305134-5c2e41ce6e3f', '1616486304898-6a6f5de5b14d',
      '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9', '1616486305134-5c2e41ce6e3f',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9'
    ],
    toys: [
      '1558877385-f0b2c2ce6ba8', '1566479179817-c0b5b4b4b1e8', '1558877385-f0b2c2ce6ba8',
      '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7',
      '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa',
      '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7',
      '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa',
      '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7',
      '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa',
      '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7',
      '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa',
      '1558060370-d644479cb6f7', '1606107557195-0e29a4b5b4aa', '1558060370-d644479cb6f7'
    ],
    sports: [
      '1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1544367567-0f2fcb009e0b',
      '1551698618-1dfe5d97d256', '1546519638-68e109498ffc', '1602143407151-7111542de6e8',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b',
      '1571019613454-1cb2f99b2d8b', '1544966503-7cc5ac882d5f', '1553062407-98eeb64c6a62',
      '1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1544367567-0f2fcb009e0b',
      '1551698618-1dfe5d97d256', '1546519638-68e109498ffc', '1602143407151-7111542de6e8',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b',
      '1571019613454-1cb2f99b2d8b', '1544966503-7cc5ac882d5f', '1553062407-98eeb64c6a62',
      '1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1544367567-0f2fcb009e0b',
      '1551698618-1dfe5d97d256', '1546519638-68e109498ffc', '1602143407151-7111542de6e8'
    ],
    furniture: [
      '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64', '1507003211169-0a1dd7228f2d',
      '1578662996442-48f60103fc96', '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64',
      '1616486338812-3dadae4b4ace', '1616137147784-222d5e3a4a0f', '1616486029423-aaa4789e8c9a',
      '1616486217729-a487de3d6ad5', '1616486305134-5c2e41ce6e3f', '1616486304898-6a6f5de5b14d',
      '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9', '1616486305134-5c2e41ce6e3f',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9',
      '1616486217729-a487de3d6ad5', '1616486138065-e6d7bd115d04', '1616486409117-a2d1e3d9a1d9'
    ],
    accessories: [
      '1572635196237-14b3f281503f', '1511499767150-a48a237f0083', '1473496169904-658ba7c44d8a',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b',
      '1572635196237-14b3f281503f', '1511499767150-a48a237f0083', '1473496169904-658ba7c44d8a',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b',
      '1572635196237-14b3f281503f', '1511499767150-a48a237f0083', '1473496169904-658ba7c44d8a',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b',
      '1572635196237-14b3f281503f', '1511499767150-a48a237f0083', '1473496169904-658ba7c44d8a',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b',
      '1572635196237-14b3f281503f', '1511499767150-a48a237f0083', '1473496169904-658ba7c44d8a',
      '1553062407-98eeb64c6a62', '1544966503-7cc5ac882d5f', '1571019613454-1cb2f99b2d8b'
    ],
    automotive: [
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70',
      '1449824913935-59a10b8d2000', '1558618666-fcd25c85cd64', '1503376780353-7e6692767b70'
    ],
    shoes: [
      '1560343776895-f95de5e284cd', '1542834759-dbf891c3eeb5', '1549298916-b41d501d3772',
      '1525966822774-2a86fef51d37', '1600269452121-4f2416e1c28b', '1543420629-5b8e3e689a20',
      '1551107696-a4b2d64b87e9', '1460353581641-d0866ad4b6ef', '1512374382149-233c42b6a5e2',
      '1515347619252-8d4b3ddb7a34', '1552346154-21d9c5de7d16', '1520639888713-8c0d47c138b4',
      '1465453868837-927a1f8e5225', '1520639888713-8c0d47c138b4', '1491553895911-0055eca6402d',
      '1520639888713-8c0d47c138b4', '1491553895911-0055eca6402d', '1520639888713-8c0d47c138b4',
      '1491553895911-0055eca6402d', '1520639888713-8c0d47c138b4', '1491553895911-0055eca6402d',
      '1520639888713-8c0d47c138b4', '1491553895911-0055eca6402d', '1520639888713-8c0d47c138b4',
      '1491553895911-0055eca6402d', '1520639888713-8c0d47c138b4', '1491553895911-0055eca6402d',
      '1520639888713-8c0d47c138b4', '1491553895911-0055eca6402d', '1520639888713-8c0d47c138b4'
    ]
  };
  
  // Get image IDs for the category
  const imageIds = categoryImageIds[category] || categoryImageIds.electronics;
  
  // Ensure we don't exceed the available images
  const totalImages = imageIds.length;
  
  // Use product index to ensure unique images for each product
  // We'll use a different starting point for each product to ensure uniqueness
  const startIndex = (index * 3) % totalImages;
  
  // Add more randomization to reduce duplicates
  const randomOffset1 = Math.floor(Math.random() * 10000) + index * 100;
  const randomOffset2 = Math.floor(Math.random() * 10000) + index * 200;
  const randomOffset3 = Math.floor(Math.random() * 10000) + index * 300;
  
  // Use different image IDs with larger spacing to reduce duplicates
  const imageIndex1 = (startIndex) % totalImages;
  const imageIndex2 = (startIndex + Math.floor(totalImages / 3)) % totalImages;
  const imageIndex3 = (startIndex + Math.floor(totalImages * 2 / 3)) % totalImages;
  
  // Create unique URLs by adding index-based parameters, random offsets, and varying quality/sizes
  return [
    `https://images.unsplash.com/photo-${imageIds[imageIndex1]}?w=600&h=600&fit=crop&auto=format&q=${75 + (index % 10)}&seed=${randomOffset1}`,
    `https://images.unsplash.com/photo-${imageIds[imageIndex2]}?w=600&h=600&fit=crop&auto=format&q=${80 + (index % 10)}&seed=${randomOffset2}`,
    `https://images.unsplash.com/photo-${imageIds[imageIndex3]}?w=600&h=600&fit=crop&auto=format&q=${85 + (index % 10)}&seed=${randomOffset3}`
  ];
};

// Generate product data
const generateProductData = () => {
  const products = [];
  let productId = 1;
  
  // Define categories and their product counts to reach 200+ products
  const categoryProductCounts = {
    electronics: 40,
    clothing: 40,
    home: 30,
    beauty: 30,
    sports: 30,
    grocery: 20,
    fashion: 20,
    'home-decor': 20,
    accessories: 20,
    shoes: 20
  };
  
  // Define brands for each category
  const categoryBrands = {
    electronics: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Asus', 'Lenovo', 'Bose', 'JBL'],
    clothing: ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Levi\'s', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren'],
    home: ['IKEA', 'West Elm', 'Pottery Barn', 'Crate & Barrel', 'Williams-Sonoma', 'Wayfair', 'Target', 'Bed Bath & Beyond'],
    beauty: ['L\'Oreal', 'Maybelline', 'MAC', 'Estee Lauder', 'Clinique', 'Neutrogena', 'Olay', 'Dove', 'Nivea', 'CeraVe'],
    sports: ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'Wilson', 'Callaway', 'Yeti', 'Coleman', 'The North Face'],
    grocery: ['Whole Foods', 'Trader Joe\'s', 'Kroger', 'Safeway', 'Aldi', 'Publix', 'Costco', 'Walmart', 'Target', 'Amazon Fresh'],
    fashion: ['Gucci', 'Louis Vuitton', 'Prada', 'Chanel', 'Versace', 'Dior', 'Burberry', 'Fendi', 'Balenciaga', 'Hermes'],
    'home-decor': ['IKEA', 'West Elm', 'Pottery Barn', 'Crate & Barrel', 'Williams-Sonoma', 'Wayfair', 'Target', 'Restoration Hardware'],
    accessories: ['Ray-Ban', 'Fossil', 'Michael Kors', 'Coach', 'Kate Spade', 'Swarovski', 'Pandora', 'Tiffany & Co.'],
    shoes: ['Nike', 'Adidas', 'Converse', 'Vans', 'New Balance', 'Puma', 'Reebok', 'Timberland', 'Dr. Martens', 'Crocs']
  };
  
  // Generate products for each category
  Object.entries(categoryProductCounts).forEach(([category, count]) => {
    const brands = categoryBrands[category];
    
    for (let i = 0; i < count; i++) {
      const brand = brands[i % brands.length];
      const price = Math.floor(Math.random() * 500) + 20;
      const originalPrice = price + Math.floor(Math.random() * 100) + 10;
      
      products.push({
        name: `${brand} ${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`,
        description: `High-quality ${category} product from ${brand} with premium features and excellent performance. This product is designed to provide the best user experience.`,
        price: price,
        originalPrice: originalPrice,
        category: category,
        brand: brand,
        stock: Math.floor(Math.random() * 200) + 50,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        numReviews: Math.floor(Math.random() * 5000) + 100,
        featured: Math.random() > 0.8, // 20% chance of being featured
        sellerId: 'admin',
        sellerName: 'ShopEase Store'
      });
      
      productId++;
    }
  });
  
  return products;
};

// Main function to generate products with unique images
const generateProductsWithUniqueImages = async () => {
  try {
    console.log('🚀 Starting product generation with unique images...');
    
    // Connect to database
    await connectDB();
    
    // Create image directories
    const baseDir = await createImageDirectories();
    
    // Generate product data
    const products = generateProductData();
    console.log(`📦 Generated ${products.length} product data entries`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Process products in batches to avoid overwhelming the server
    const batchSize = 20;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const currentBatch = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(products.length / batchSize);
      
      console.log(`⏳ Processing batch ${currentBatch}/${totalBatches} (${i+1}-${Math.min(i+batchSize, products.length)} of ${products.length} products)`);
      
      // Process batch with Promise.all for parallel processing
      const batchPromises = batch.map(async (productData, batchIndex) => {
        try {
          const productIndex = i + batchIndex;
          console.log(`📝 Processing product ${productIndex + 1}/${products.length}: ${productData.name}`);
          
          // Generate unique image URLs for this product
          const imageUrls = generateUniqueImageUrls(productData.category, productIndex);
          const localImagePaths = [];
          
          // Download images
          for (let j = 0; j < imageUrls.length; j++) {
            const filename = `${productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${productIndex}-${j}.jpg`;
            const categoryDir = path.join(baseDir, productData.category);
            
            // Create category directory if it doesn't exist
            if (!fs.existsSync(categoryDir)) {
              fs.mkdirSync(categoryDir, { recursive: true });
            }
            
            const filepath = path.join(categoryDir, filename);
            
            try {
              await downloadImage(imageUrls[j], filepath);
              localImagePaths.push(`/images/${productData.category}/${filename}`);
              console.log(`  ✅ Downloaded image ${j + 1} for ${productData.name}`);
            } catch (error) {
              console.error(`  ❌ Failed to download image ${j + 1} for ${productData.name}: ${error.message}`);
              // Use placeholder as fallback
              localImagePaths.push(`https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(productData.name.split(' ')[0])}`);
            }
          }
          
          // Create product with local image paths
          const product = new Product({
            ...productData,
            images: localImagePaths
          });
          
          await product.save();
          successCount++;
          console.log(`  ✅ Product saved successfully: ${productData.name}`);
        } catch (error) {
          errorCount++;
          console.error(`  ❌ Failed to process product ${productData.name}: ${error.message}`);
        }
      });
      
      // Wait for all products in batch to complete
      await Promise.all(batchPromises);
      
      // Add a small delay between batches
      if (i + batchSize < products.length) {
        console.log('  ⏸️ Pausing for 1 second before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Log progress
      console.log(`📊 Progress: ${Math.round((i + batch.length) / products.length * 100)}% complete`);
      console.log(`📊 Stats: ${successCount} successful, ${errorCount} failed`);
    }
    
    // Get final product count
    const finalCount = await Product.countDocuments();
    
    console.log('\n🎉 Product generation completed!');
    console.log(`✅ Successfully generated: ${successCount} products`);
    console.log(`❌ Failed to generate: ${errorCount} products`);
    console.log(`📊 Total products in database: ${finalCount}`);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
    
    return true;
  } catch (error) {
    console.error('❌ Error generating products:', error);
    
    // Disconnect from database on error
    try {
      await mongoose.disconnect();
      console.log('🔌 Database connection closed');
    } catch (disconnectError) {
      console.error('❌ Error disconnecting from database:', disconnectError);
    }
    
    return false;
  }
};

// Run the script
generateProductsWithUniqueImages()
  .then(result => {
    console.log('Script completed with result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });