// Simple API test script
// Run with: npx tsx test-apis.ts

async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test featured products API
    console.log('1. Testing /api/featured-products...');
    const featuredRes = await fetch(`${baseUrl}/api/featured-products?page=1&limit=5`);
    if (featuredRes.ok) {
      const featuredData = await featuredRes.json();
      console.log(`   ✅ Success: Found ${featuredData.products?.length || 0} products`);
      console.log(`   📊 Total: ${featuredData.total}, Has More: ${featuredData.hasMore}`);
    } else {
      console.log(`   ❌ Failed: ${featuredRes.status}`);
    }
    
    // Test products API
    console.log('\\n2. Testing /api/products...');
    const productsRes = await fetch(`${baseUrl}/api/products?limit=5`);
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      console.log(`   ✅ Success: Found ${productsData.products?.length || 0} products`);
      console.log(`   📊 Total: ${productsData.total}`);
    } else {
      console.log(`   ❌ Failed: ${productsRes.status}`);
    }
    
    // Test admin products API
    console.log('\\n3. Testing /api/admin/products...');
    const adminRes = await fetch(`${baseUrl}/api/admin/products?page=1&limit=5`);
    if (adminRes.ok) {
      const adminData = await adminRes.json();
      console.log(`   ✅ Success: Found ${adminData.products?.length || 0} products`);
      console.log(`   📊 Total: ${adminData.total}, Pages: ${adminData.pages}`);
    } else {
      console.log(`   ❌ Failed: ${adminRes.status}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\\n💡 Make sure the development server is running: npm run dev');
  }
  
  console.log('\\n🏁 API tests completed!');
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPIs();
}

export { testAPIs };