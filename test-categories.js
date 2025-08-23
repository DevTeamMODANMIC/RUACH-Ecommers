// Simple test to validate categories and subcategories
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the categories file
const categoriesPath = path.join(__dirname, 'lib', 'categories.ts');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');

console.log('=== CATEGORY AND SUBCATEGORY VALIDATION TEST ===\n');

// Extract the MAIN_CATEGORIES from the file
const mainCategoriesMatch = categoriesContent.match(/export const MAIN_CATEGORIES[\s\S]*?=\s*\[([\s\S]*?)\];/);
if (!mainCategoriesMatch) {
  console.error('Could not parse MAIN_CATEGORIES from categories.ts');
  process.exit(1);
}

console.log('✓ Found MAIN_CATEGORIES definition\n');

// Count categories and subcategories
const categoryMatches = categoriesContent.match(/{\s*id:\s*"[^"]+",\s*name:/g);
const subcategoryMatches = categoriesContent.match(/subcategories:\s*\[/g);

console.log(`📊 SUMMARY:`);
console.log(`• Total categories defined: ${categoryMatches ? categoryMatches.length : 0}`);
console.log(`• Categories with subcategories: ${subcategoryMatches ? subcategoryMatches.length : 0}`);

// Check for categories that should have subcategories based on our filter
const categoriesWithSubcats = [];
const categoriesWithoutSubcats = [];

// Simple regex to find category objects with subcategories
const categoryBlockRegex = /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"(?:,\s*subcategories:\s*\[[\s\S]*?\])?\s*}/g;
let match;

while ((match = categoryBlockRegex.exec(categoriesContent)) !== null) {
  const id = match[1];
  const name = match[2];
  const hasSubcategories = match[0].includes('subcategories:');
  
  if (id !== 'all') {
    if (hasSubcategories) {
      categoriesWithSubcats.push({ id, name });
    } else {
      categoriesWithoutSubcats.push({ id, name });
    }
  }
}

console.log('\n📋 CATEGORIES WITH SUBCATEGORIES:');
categoriesWithSubcats.forEach(cat => {
  console.log(`  ✓ ${cat.name} (${cat.id})`);
});

console.log('\n⚠️ CATEGORIES WITHOUT SUBCATEGORIES:');
if (categoriesWithoutSubcats.length === 0) {
  console.log('  ✓ All categories have subcategories defined!');
} else {
  categoriesWithoutSubcats.forEach(cat => {
    console.log(`  ⚠️ ${cat.name} (${cat.id})`);
  });
}

console.log('\n🔍 FILTER LOGIC TEST:');
console.log('Our filter: categories.filter(c => c.id !== "all" && c.subcategories && c.subcategories.length > 0)');
console.log(`Expected result: ${categoriesWithSubcats.length} categories should be available in the dropdown`);

if (categoriesWithSubcats.length === 0) {
  console.log('\n❌ ERROR: No categories with subcategories found!');
  console.log('This explains why the subcategory dropdown is not showing.');
} else {
  console.log('\n✅ SUCCESS: Categories with subcategories are available for the dropdown');
}

console.log('\n=== TEST COMPLETE ===');