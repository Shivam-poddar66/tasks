const WooCommerceAPI = require('woocommerce-api');

const wooCommerce = new WooCommerceAPI({
  url: process.env.WC_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  wpAPI: true,
  version: 'wc/v3'
});

module.exports = wooCommerce; 