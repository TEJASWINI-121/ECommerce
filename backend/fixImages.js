import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create better product-specific image mappings
const getRelevantImages = (productName, category, brand) => {
  const productType = productName.toLowerCase();
  
  // Electronics
  if (productType.includes('iphone') || productType.includes('apple iphone')) {
    return [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('macbook') || productType.includes('laptop')) {
    return [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('galaxy') || productType.includes('samsung')) {
    return [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('ipad')) {
    return [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('headphones') || productType.includes('wh-1000xm5')) {
    return [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('airpods')) {
    return [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('tv') || productType.includes('oled')) {
    return [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Clothing
  if (productType.includes('t-shirt') || productType.includes('shirt')) {
    return [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('jeans')) {
    return [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('dress')) {
    return [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('jacket') || productType.includes('blazer')) {
    return [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('sweater') || productType.includes('hoodie')) {
    return [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a9fbc86339e?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Shoes
  if (productType.includes('sneakers') || productType.includes('running')) {
    return [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('boots')) {
    return [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('loafers') || productType.includes('dress shoes')) {
    return [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('sandals')) {
    return [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Accessories
  if (productType.includes('watch')) {
    return [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('sunglasses')) {
    return [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('wallet')) {
    return [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('handbag') || productType.includes('bag')) {
    return [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('backpack')) {
    return [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('belt')) {
    return [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('scarf') || productType.includes('hat')) {
    return [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556821840-3a9fbc86339e?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Home Decor
  if (productType.includes('lamp')) {
    return [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('pillow') || productType.includes('cushion')) {
    return [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('vase') || productType.includes('pot')) {
    return [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('candle')) {
    return [
      'https://images.unsplash.com/photo-1602874801006-e26c4c5b5b6a?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1602874801006-e26c4c5b5b6a?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('mirror')) {
    return [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('curtains')) {
    return [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('art') || productType.includes('wall')) {
    return [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Beauty
  if (productType.includes('lipstick')) {
    return [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('foundation') || productType.includes('makeup')) {
    return [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('mascara')) {
    return [
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('moisturizer') || productType.includes('serum') || productType.includes('cleanser')) {
    return [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('eyeshadow') || productType.includes('palette')) {
    return [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('perfume')) {
    return [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Sports
  if (productType.includes('yoga mat')) {
    return [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('dumbbells') || productType.includes('weights')) {
    return [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('water bottle') || productType.includes('bottle')) {
    return [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('resistance bands') || productType.includes('bands')) {
    return [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('tennis racket') || productType.includes('racket')) {
    return [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('basketball')) {
    return [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('fitness tracker') || productType.includes('tracker')) {
    return [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('protein powder') || productType.includes('protein')) {
    return [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('leggings')) {
    return [
      'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Grocery
  if (productType.includes('honey')) {
    return [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('olive oil') || productType.includes('oil')) {
    return [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('quinoa')) {
    return [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('almond butter') || productType.includes('butter')) {
    return [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('green tea') || productType.includes('tea')) {
    return [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('dark chocolate') || productType.includes('chocolate')) {
    return [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('coconut oil') || productType.includes('coconut')) {
    return [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  if (productType.includes('protein bars') || productType.includes('bars')) {
    return [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop&crop=center'
    ];
  }
  
  // Fallback based on category
  if (category === 'electronics') {
    return [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop&crop=center'
    ];
  } else if (category === 'clothing') {
    return [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop&crop=center'
    ];
  } else if (category === 'shoes') {
    return [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&crop=center'
    ];
  } else if (category === 'beauty') {
    return [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop&crop=center'
    ];
  } else if (category === 'sports') {
    return [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center'
    ];
  } else {
    // Generic fallback
    return [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&crop=center'
    ];
  }
};

async function fixAllImages() {
  try {
    console.log('🔧 Fixing product images with relevant URLs...\n');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to fix\n`);
    
    for (const product of products) {
      const relevantImages = getRelevantImages(product.name, product.category, product.brand);
      product.images = relevantImages;
      await product.save();
      console.log(`✅ Fixed images for: ${product.name}`);
    }
    
    console.log('\n🎉 All product images fixed successfully!');
    console.log('📸 All products now have relevant, high-quality images');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    process.exit(1);
  }
}

fixAllImages();
