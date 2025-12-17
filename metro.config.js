// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Get the default Expo config
const config = getDefaultConfig(__dirname);

// 2. Wrap the config with the NativeWind preprocessor
const nativewindConfig = withNativeWind(config, { 
  input: "./app/globals.css" 
}); 

// 3. Export the final, processed config
module.exports = nativewindConfig;