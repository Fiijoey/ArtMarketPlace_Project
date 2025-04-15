# ArtMarketPlace_Project

# Art Marketplace Solution Project

The Art Marketplace Solution Project is an innovative platform designed to bridge the gap between artists, art enthusiasts, and buyers. This project aims to create a dynamic online marketplace where creative talents can showcase their artwork, connect with a broader audience, and sell their creations with ease.

# Core Objectives

Empower Artists: Provide a user-friendly platform for artists to display and monetize their work.

Seamless User Experience: Offer buyers an intuitive interface for browsing, searching, and purchasing art pieces.

Global Reach: Create opportunities for art to reach an international market, transcending geographical limitations.

Promote Art Culture: Encourage appreciation and support for the creative community by making art more accessible.

# Key Features

Artist Profiles: Personalized dashboards for artists to manage their portfolio and track sales.

Curated Galleries: Categorized galleries for users to explore various art styles and mediums.

Secure Transactions: Ensuring safe and reliable payment processes for both buyers and sellers.

Community Engagement: Features like reviews, ratings, and a blog section to foster an interactive art community.

Mobile Compatibility: A responsive design to ensure accessibility on all devices.

# Instagram Integration

The platform features Instagram integration to showcase artists' latest posts in the gallery section. To refresh the Instagram posts:

1. Ensure you have Node.js installed on your system
2. Set up your Instagram API credentials in the `instagramFetch.js` file
3. Run the following command from the project root:
   ```
   node instagramFetch.js
   ```
4. This will fetch the latest posts from Instagram and update the data in `src/public/json/instagramData.json`
5. The gallery page will automatically display the updated Instagram posts on the next page load

**Note:** You must configure proper API credentials in the `instagramFetch.js` file before running the script. Without valid credentials, the API requests will fail.
