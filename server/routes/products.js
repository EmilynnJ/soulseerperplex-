const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all active products
router.get('/', async (req, res) => {
  try {
    const { 
      active = 'true',
      limit = 50,
      page = 1
    } = req.query;

    // Build query
    const query = {};
    if (active === 'true') {
      query.active = true;
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Format response to include price information
    const formattedProducts = products.map(product => ({
      id: product._id,
      stripeProductId: product.stripeProductId,
      name: product.name,
      description: product.description,
      images: product.images,
      active: product.active,
      prices: product.prices.filter(price => price.active).map(price => ({
        id: price.stripePriceId,
        unitAmount: price.unitAmount,
        currency: price.currency,
        type: price.type,
        recurring: price.recurring
      })),
      // Get the default price (first active price)
      defaultPrice: (() => {
        const activePrice = product.prices.find(p => p.active);
        return activePrice ? {
          amount: activePrice.unitAmount / 100, // Convert cents to dollars
          currency: activePrice.currency
        } : null;
      })(),
      metadata: product.metadata
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      message: 'Server error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single product by ID
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Format response
    const formattedProduct = {
      id: product._id,
      stripeProductId: product.stripeProductId,
      name: product.name,
      description: product.description,
      images: product.images,
      active: product.active,
      prices: product.prices.filter(price => price.active).map(price => ({
        id: price.stripePriceId,
        unitAmount: price.unitAmount,
        currency: price.currency,
        type: price.type,
        recurring: price.recurring
      })),
      defaultPrice: (() => {
        const activePrice = product.prices.find(p => p.active);
        return activePrice ? {
          amount: activePrice.unitAmount / 100,
          currency: activePrice.currency
        } : null;
      })(),
      metadata: product.metadata,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    res.json(formattedProduct);

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      message: 'Server error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
