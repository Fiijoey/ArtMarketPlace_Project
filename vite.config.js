import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        artPeice: resolve(__dirname, "src/artPeice/index.html"),
        checkedout: resolve(__dirname, "src/checkout/success.html"),
        gellary: resolve(__dirname, "src/gallery/index.html"),
        artist: resolve(__dirname, "src/artist/index.html"),
        shop: resolve(__dirname, "src/shop/index.html"),
        artistDetail: resolve(__dirname, "src/artist/artist-detail.html"),
      },
    },
  },
});
