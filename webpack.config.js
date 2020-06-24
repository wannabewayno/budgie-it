const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  // Update the entry point
  entry: './public/src',
  output: {
    // Set the path and filename for the output bundle (hint: You will need to use "__dirname")
    path: __dirname + "/public/dist",
    filename: "bundle.js"
  },
  mode: "development",
  plugins: [
    new WebpackPwaManifest({
        "ios":true,
        "filename":"manifest.json",
        "inject":true,
        "fingerprints":false,
        "name": "budget tracker app",
        "short_name": "budgie-it",
        "icons": [
          {
            src: path.resolve(
              __dirname,
              "public/icons/icon-512x512.png"
              ),
            // the plugin will generate an image for each size
            // included in the size array
            size: [72, 96, 128, 144, 152, 192, 384, 512]
          }
        ],
        "theme_color": "#ffffff",
        "background_color": "#ffffff",
        "start_url": "/",
        "display": "standalone"
      }
    )
  ]
};

module.exports = config;