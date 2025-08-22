import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
    enum: ['electronics', 'clothing', 'shoes', 'accessories', 'home-decor', 'beauty', 'sports', 'grocery', 'fashion', 'home']
  },
  brand: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  featured: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: Map,
    of: String
  },
  sellerId: {
    type: String,
    default: 'seller1'
  },
  sellerName: {
    type: String,
    default: 'Default Store'
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);