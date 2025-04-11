/**
 * Instagram API Data Fetcher
 * 
 * This script fetches posts from the Instagram API and saves them to a JSON file.
 * It can be executed via `node instagramFetch.js` when a data refresh is needed.
 */

import fetch from 'node-fetch';
import fs from 'fs';

// Instagram API configuration
// IMPORTANT: Replace 'YOUR_ACCESS_TOKEN' with your actual Instagram API access token
const INSTAGRAM_API_ENDPOINT = 'https://graph.instagram.com/me/media';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';
const FIELDS = 'id,media_url,caption,permalink,timestamp,media_type';
const OUTPUT_FILE_PATH = 'src/public/json/instagramData.json';

/**
 * Fetches Instagram posts and saves them to a JSON file
 */
async function fetchInstagramPosts() {
  try {
    console.log('Fetching Instagram posts...');
    
    // Construct the full API URL with parameters
    const apiUrl = `${INSTAGRAM_API_ENDPOINT}?fields=${FIELDS}&access_token=${ACCESS_TOKEN}`;
    
    // Make the API request
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API returned status ${response.status}: ${errorData}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Create directory if it doesn't exist
    const dir = OUTPUT_FILE_PATH.substring(0, OUTPUT_FILE_PATH.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the data to the JSON file with pretty formatting
    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(data, null, 2));
    
    console.log(`Instagram data successfully fetched and saved to ${OUTPUT_FILE_PATH}`);
    console.log(`Total posts fetched: ${data.data ? data.data.length : 0}`);
    
  } catch (error) {
    console.error('Error fetching Instagram data:', error.message);
    process.exit(1);
  }
}

// Execute the function
(async () => {
  await fetchInstagramPosts();
})();