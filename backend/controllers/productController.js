import Product from '../models/Product.js';

// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 20;
    const page = Number(req.query.pageNumber) || 1;

    // Build query object
    const query = {};

    // Search functionality
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { category: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category filtering
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Brand filtering (multiple brands)
    if (req.query.brand) {
      if (Array.isArray(req.query.brand)) {
        query.brand = { $in: req.query.brand };
      } else {
        query.brand = req.query.brand;
      }
    }

    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Rating filtering
    if (req.query.minRating) {
      query.rating = { $gte: Number(req.query.minRating) };
    }

    // In stock filtering
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured products filtering
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Build sort object
    let sortOption = {};
    switch (req.query.sortBy) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1, numReviews: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'popularity':
        sortOption = { numReviews: -1, rating: -1 };
        break;
      default:
        sortOption = { featured: -1, createdAt: -1 };
    }

    // Use aggregation for better performance
    const [result] = await Product.aggregate([
      { $match: query },
      {
        $facet: {
          products: [
            { $sort: sortOption },
            { $skip: pageSize * (page - 1) },
            { $limit: pageSize },
            {
              $project: {
                name: 1,
                price: 1,
                originalPrice: 1,
                images: { $slice: ['$images', 1] }, // Only first image for list view
                brand: 1,
                category: 1,
                rating: 1,
                numReviews: 1,
                stock: 1,
                featured: 1,
                createdAt: 1
              }
            }
          ],
          totalCount: [{ $count: 'count' }],
          // Get filter options for frontend
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ],
          brands: [
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ],
          priceRange: [
            {
              $group: {
                _id: null,
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
              }
            }
          ]
        }
      }
    ]);

    const products = result.products;
    const count = result.totalCount[0]?.count || 0;
    const categories = result.categories;
    const brands = result.brands;
    const priceRange = result.priceRange[0] || { minPrice: 0, maxPrice: 1000 };

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      filters: {
        categories,
        brands,
        priceRange
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      stock,
      originalPrice,
      specifications
    } = req.body;

    const product = new Product({
      name,
      price,
      description,
      images,
      brand,
      category,
      stock,
      originalPrice,
      specifications
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      stock,
      originalPrice,
      specifications
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.originalPrice = originalPrice || product.originalPrice;
      product.specifications = specifications || product.specifications;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .sort({ rating: -1, numReviews: -1 })
      .limit(8)
      .select('name price originalPrice images brand category rating numReviews stock');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories with product counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all brands with product counts
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          categories: { $addToSet: '$category' },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get search suggestions
// @route   GET /api/products/search-suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const suggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { brand: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          suggestion: '$name',
          type: { $literal: 'product' },
          category: 1,
          brand: 1,
          price: 1,
          images: { $slice: ['$images', 1] }
        }
      },
      { $limit: 5 }
    ]);

    // Add category and brand suggestions
    const categorySuggestions = await Product.aggregate([
      { $match: { category: { $regex: q, $options: 'i' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { suggestion: '$_id', type: { $literal: 'category' }, count: 1 } },
      { $limit: 3 }
    ]);

    const brandSuggestions = await Product.aggregate([
      { $match: { brand: { $regex: q, $options: 'i' } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $project: { suggestion: '$_id', type: { $literal: 'brand' }, count: 1 } },
      { $limit: 3 }
    ]);

    const allSuggestions = [...suggestions, ...categorySuggestions, ...brandSuggestions];
    res.json(allSuggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};