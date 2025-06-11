const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const wooCommerce = require('../config/woocommerce');
const auth = require('../middleware/auth');

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;
    const userId = req.user.id;

    // Create product in local database
    const [result] = await pool.query(
      'INSERT INTO products (user_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
      [userId, name, description, price, image_url]
    );

    const productId = result.insertId;

    // Sync with WooCommerce
    try {
      const wooProduct = {
        name,
        description,
        regular_price: price.toString(),
        images: [{ src: image_url }]
      };

      const wooResponse = await new Promise((resolve, reject) => {
        wooCommerce.post('products', wooProduct, (err, data, res) => {
          if (err) reject(err);
          resolve(data);
        });
      });

      // Update local product with WooCommerce ID and status
      await pool.query(
        'UPDATE products SET woocommerce_id = ?, status = ? WHERE id = ?',
        [wooResponse.id, 'synced_to_woocommerce', productId]
      );

      res.status(201).json({
        message: 'Product created and synced successfully',
        product: {
          id: productId,
          name,
          description,
          price,
          image_url,
          status: 'synced_to_woocommerce',
          woocommerce_id: wooResponse.id
        }
      });
    } catch (wooError) {
      // Update product status to sync failed
      await pool.query(
        'UPDATE products SET status = ? WHERE id = ?',
        ['sync_failed', productId]
      );

      throw wooError;
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// Get user's products
router.get('/', auth, async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    // Check if product exists and belongs to user
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [productId, userId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    // Update local product
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
      [name, description, price, image_url, productId]
    );

    // Sync with WooCommerce if product was previously synced
    if (product.woocommerce_id) {
      try {
        const wooProduct = {
          name,
          description,
          regular_price: price.toString(),
          images: [{ src: image_url }]
        };

        await new Promise((resolve, reject) => {
          wooCommerce.put(`products/${product.woocommerce_id}`, wooProduct, (err, data, res) => {
            if (err) reject(err);
            resolve(data);
          });
        });

        await pool.query(
          'UPDATE products SET status = ? WHERE id = ?',
          ['synced_to_woocommerce', productId]
        );
      } catch (wooError) {
        await pool.query(
          'UPDATE products SET status = ? WHERE id = ?',
          ['sync_failed', productId]
        );
        throw wooError;
      }
    }

    res.json({
      message: 'Product updated successfully',
      product: {
        id: productId,
        name,
        description,
        price,
        image_url,
        status: product.woocommerce_id ? 'synced_to_woocommerce' : 'created_locally'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // Check if product exists and belongs to user
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND user_id = ?',
      [productId, userId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    // Delete from WooCommerce if synced
    if (product.woocommerce_id) {
      try {
        await new Promise((resolve, reject) => {
          wooCommerce.delete(`products/${product.woocommerce_id}`, (err, data, res) => {
            if (err) reject(err);
            resolve(data);
          });
        });
      } catch (wooError) {
        console.error('Error deleting from WooCommerce:', wooError);
      }
    }

    // Delete from local database
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router; 