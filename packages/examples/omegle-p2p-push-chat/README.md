# Omegle Chat but using Push Chat

## Introduction

This project facilitates random peer-to-peer online connections through Push Chat.

### Installation

1. #### Clone the repo

2. #### Setup the server

   1. ##### Navigate to the server directory:

   ```bash
   cd server
   ```

   2. ##### Install dependencies using Yarn or npm:

   ```bash
     # Using Yarn
     yarn install

     # Using npm
     npm install
   ```

   3. ##### Start the server:

   ```bash
     # Using Yarn
     yarn start

     # Using npm
     npm start
   ```

  ##### Server will start at http://localhost:3001

3. #### Setup the client

   1. ##### Navigate to the client directory:

   ```bash
   cd client
   ```

   2. ##### Install dependencies using Yarn or npm:

   ```bash
     # Using Yarn
     yarn install

     # Using npm
     npm install
   ```

   3. ##### Start the server:

   ```bash
     # Using Yarn
     yarn start

     # Using npm
     npm start
   ```

   ##### React app starts at http://localhost:3000

### If you're facing polyfills issue, add this code snippet in your `webpack.config.js`.

```typescript
// webpack.config.js
module.exports = {
  // ... other configurations
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      zlib: require.resolve('browserify-zlib'),
      url: require.resolve('url/'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
    },
  },
};
```
### Install the packages
```bash
npm install stream-http https-browserify browserify-zlib url assert stream-browserify
```
