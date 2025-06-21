// Script to check if all image paths in the product data are valid
// Usage: node check-image-paths.js

const fs = require('fs');
const path = require('path');

console.log('Starting image path check...');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Function to get all products from utils.ts
function extractProductsFromFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the predefinedProducts array
    const productsMatch = fileContent.match(/const predefinedProducts = \[([\s\S]*?)\];/);
    
    if (!productsMatch) {
      console.error('Could not find predefinedProducts array in the file');
      return [];
    }
    
    // Evaluate the array (this is a bit hacky but works for our purpose)
    // Replace single quotes with double quotes for JSON parsing
    const productsArrayString = productsMatch[1]
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":'); // Convert property names to strings
    
    try {
      // Try to parse as JSON (this might fail due to comments or other JS features)
      return JSON.parse(`[${productsArrayString}]`);
    } catch (parseError) {
      console.error('Error parsing products array:', parseError);
      
      // Fallback: extract just the image paths using regex
      const imagePathsRegex = /images: \[(.*?)\]/g;
      const matches = [...fileContent.matchAll(imagePathsRegex)];
      
      const imagePaths = [];
      matches.forEach(match => {
        const pathsString = match[1];
        const paths = pathsString.match(/"([^"]+)"/g) || [];
        paths.forEach(p => imagePaths.push(p.replace(/"/g, '')));
      });
      
      return imagePaths.map(path => ({ images: [path] }));
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

// Main function
function checkImagePaths() {
  // Get products from utils.ts
  const utilsPath = path.join(__dirname, 'lib', 'utils.ts');
  const products = extractProductsFromFile(utilsPath);
  
  console.log(`Found ${products.length} products to check`);
  
  // Check each image path
  const results = {
    valid: 0,
    invalid: 0,
    paths: []
  };
  
  products.forEach((product, index) => {
    if (!product.images) {
      console.log(`Product #${index + 1} has no images array`);
      return;
    }
    
    product.images.forEach(imagePath => {
      // Remove leading slash for path resolution
      const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      const fullPath = path.join(__dirname, 'public', relativePath);
      
      const exists = fileExists(fullPath);
      
      results.paths.push({
        path: imagePath,
        exists,
        fullPath
      });
      
      if (exists) {
        results.valid++;
      } else {
        results.invalid++;
      }
    });
  });
  
  // Print results
  console.log('\nResults:');
  console.log(`Total image paths checked: ${results.valid + results.invalid}`);
  console.log(`Valid paths: ${results.valid}`);
  console.log(`Invalid paths: ${results.invalid}`);
  
  if (results.invalid > 0) {
    console.log('\nInvalid image paths:');
    results.paths
      .filter(p => !p.exists)
      .forEach(p => {
        console.log(`- ${p.path} (expected at: ${p.fullPath})`);
      });
  }
}

checkImagePaths();

console.log('\nImage path check completed.'); 