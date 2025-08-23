/**
 * Utility script to remove dummy/mock services from Firebase
 * 
 * These are the dummy services that need to be removed:
 * 1. "Home Plumbing Repair"
 * 2. "Emergency Leak Fix" 
 * 3. "Bathroom Renovation"
 * 
 * INSTRUCTIONS:
 * 1. Open your browser console on the service provider dashboard
 * 2. Copy and paste this entire script
 * 3. Run: removeDummyServices()
 * 4. The script will find and delete the dummy services
 */

// Import Firebase functions (these should be available on your service provider dashboard page)
async function removeDummyServices() {
  try {
    console.log("🔍 Searching for dummy services to remove...");
    
    // Check if Firebase is available
    if (typeof window === 'undefined' || !window.firebase) {
      console.error("❌ Firebase not found. Please run this script on the service provider dashboard page.");
      return;
    }
    
    // Get Firebase modules from the page
    const { collection, query, where, getDocs, deleteDoc, doc, db } = window.firebase;
    
    if (!db) {
      console.error("❌ Firebase Firestore not initialized. Please run this script on the service provider dashboard page.");
      return;
    }
    
    // List of dummy service names to remove
    const dummyServiceNames = [
      "Home Plumbing Repair",
      "Emergency Leak Fix", 
      "Bathroom Renovation"
    ];
    
    let totalDeleted = 0;
    
    for (const serviceName of dummyServiceNames) {
      console.log(`🔍 Looking for service: ${serviceName}`);
      
      // Query for services with this exact name
      const q = query(
        collection(db, "services"),
        where("name", "==", serviceName)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`ℹ️  Service "${serviceName}" not found (may already be deleted)`);
        continue;
      }
      
      // Delete each matching service
      for (const docSnapshot of querySnapshot.docs) {
        const serviceData = docSnapshot.data();
        console.log(`🗑️  Deleting service: ${serviceName} (ID: ${docSnapshot.id})`);
        console.log(`   - Description: ${serviceData.description || 'N/A'}`);
        console.log(`   - Category: ${serviceData.category || 'N/A'}`);
        console.log(`   - Price: ${serviceData.basePrice || serviceData.hourlyRate || 'Custom'}`);
        
        await deleteDoc(doc(db, "services", docSnapshot.id));
        totalDeleted++;
        console.log(`✅ Successfully deleted "${serviceName}"`);
      }
    }
    
    console.log(`\n🎉 Cleanup complete! Deleted ${totalDeleted} dummy services.`);
    
    if (totalDeleted > 0) {
      console.log("🔄 Please refresh the page to see the updated services list.");
    } else {
      console.log("ℹ️  No dummy services found to delete.");
    }
    
  } catch (error) {
    console.error("❌ Error removing dummy services:", error);
    console.log("💡 Make sure you're running this script on the service provider dashboard page where Firebase is initialized.");
  }
}

// Alternative method: Remove services by partial name match
async function removeDummyServicesByPattern() {
  try {
    console.log("🔍 Searching for dummy services by pattern...");
    
    const { collection, getDocs, deleteDoc, doc, db } = window.firebase;
    
    if (!db) {
      console.error("❌ Firebase Firestore not initialized.");
      return;
    }
    
    // Get all services and filter on the client side
    const servicesRef = collection(db, "services");
    const querySnapshot = await getDocs(servicesRef);
    
    const dummyPatterns = [
      /home.*plumbing.*repair/i,
      /emergency.*leak.*fix/i,
      /bathroom.*renovation/i,
      /plumbing.*repair/i,
      /leak.*fix/i
    ];
    
    let totalDeleted = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const serviceData = docSnapshot.data();
      const serviceName = serviceData.name || "";
      const serviceDescription = serviceData.description || "";
      
      // Check if this service matches any dummy pattern
      const isDummy = dummyPatterns.some(pattern => 
        pattern.test(serviceName) || pattern.test(serviceDescription)
      );
      
      if (isDummy) {
        console.log(`🗑️  Found potential dummy service: ${serviceName} (ID: ${docSnapshot.id})`);
        console.log(`   - Description: ${serviceDescription}`);
        console.log(`   - Category: ${serviceData.category || 'N/A'}`);
        
        // Ask for confirmation
        const shouldDelete = confirm(`Delete service "${serviceName}"?`);
        
        if (shouldDelete) {
          await deleteDoc(doc(db, "services", docSnapshot.id));
          totalDeleted++;
          console.log(`✅ Deleted "${serviceName}"`);
        } else {
          console.log(`⏭️  Skipped "${serviceName}"`);
        }
      }
    }
    
    console.log(`\n🎉 Pattern-based cleanup complete! Deleted ${totalDeleted} services.`);
    
    if (totalDeleted > 0) {
      console.log("🔄 Please refresh the page to see the updated services list.");
    }
    
  } catch (error) {
    console.error("❌ Error removing dummy services by pattern:", error);
  }
}

// Export functions for browser console use
window.removeDummyServices = removeDummyServices;
window.removeDummyServicesByPattern = removeDummyServicesByPattern;

console.log(`
🛠️  DUMMY SERVICES REMOVAL UTILITY LOADED

Available functions:
1. removeDummyServices() - Remove specific dummy services by exact name
2. removeDummyServicesByPattern() - Find and remove services by pattern matching

To use:
1. Make sure you're on the service provider dashboard page
2. Run one of the functions above in the console
3. Refresh the page after deletion

Target services to remove:
- "Home Plumbing Repair"
- "Emergency Leak Fix"
- "Bathroom Renovation"
`);