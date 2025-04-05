import fetch from 'node-fetch';
import fs from 'fs';

// Replace the following placeholders with your actual Shopify store details
const shop = 'your-shop-name';  // e.g., 'mystore'
const accessToken = 'your-access-token';  // Shopify Admin API access token
const apiVersion = '2023-04';  // Update as necessary

// Construct the Shopify API endpoint for retrieving products
const url = `https://${shop}.myshopify.com/admin/api/${apiVersion}/products.json`;

(async () => {
  try {
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Write the product data to products.json file with pretty formatting
    fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
    console.log('Product data has been saved to products.json');
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
})();
