// AGGRESSIVE DUMMY SERVICES REMOVAL SCRIPT
// Copy and paste this entire code block into your browser console on the service provider dashboard
// This version handles caching issues and persistent services

(async function() {
  try {
    console.log("🧹 Starting AGGRESSIVE dummy services cleanup...");
    
    // Import Firebase functions from the global scope or window
    let db, collection, query, where, getDocs, deleteDoc, doc;
    
    try {
      // Try to get Firebase from various possible sources
      if (window.firebase) {
        ({ db, collection, query, where, getDocs, deleteDoc, doc } = window.firebase);
      } else {
        // Try dynamic import
        const firebaseModule = await import('/lib/firebase');
        const firestoreModule = await import('firebase/firestore');
        db = firebaseModule.db;
        ({ collection, query, where, getDocs, deleteDoc, doc } = firestoreModule);
      }
    } catch (importError) {
      console.error("❌ Firebase import failed:", importError);
      console.log("💡 Make sure you're on the service provider dashboard page where Firebase is loaded.");
      return;
    }
    
    if (!db) {
      console.error("❌ Firebase database not found.");
      return;
    }
    
    // Get ALL services from database (avoid cached queries)
    console.log("🔍 Fetching ALL services from database...");
    const allServicesSnapshot = await getDocs(collection(db, "services"));
    
    console.log(`📊 Total services in database: ${allServicesSnapshot.docs.length}`);
    
    // List all services first
    console.log("\n=== ALL SERVICES IN DATABASE ===");
    allServicesSnapshot.docs.forEach((docSnapshot, index) => {
      const data = docSnapshot.data();
      console.log(`${index + 1}. "${data.name}" (ID: ${docSnapshot.id})`, {
        category: data.category,
        description: data.description?.substring(0, 50) + "...",
        isActive: data.isActive
      });
    });
    console.log("=== END OF SERVICES LIST ===\n");
    
    // Target services (exact names and patterns)
    const exactNames = [
      "Home Plumbing Repair",
      "Emergency Leak Fix", 
      "Bathroom Renovation"
    ];
    
    const patterns = [
      /home.*plumbing.*repair/i,
      /emergency.*leak.*fix/i,
      /bathroom.*renovation/i,
      /plumbing.*repair.*service/i,
      /professional.*plumbing/i
    ];
    
    const servicesToDelete = [];
    
    // Find services to delete
    allServicesSnapshot.docs.forEach((docSnapshot) => {
      const serviceData = docSnapshot.data();
      const serviceName = serviceData.name || "";
      const serviceDescription = serviceData.description || "";
      
      // Check exact name matches
      if (exactNames.includes(serviceName)) {
        servicesToDelete.push({
          id: docSnapshot.id,
          name: serviceName,
          reason: "Exact name match"
        });
        return;
      }
      
      // Check pattern matches
      const matchesPattern = patterns.some(pattern => 
        pattern.test(serviceName) || pattern.test(serviceDescription)
      );
      
      if (matchesPattern) {
        servicesToDelete.push({
          id: docSnapshot.id,
          name: serviceName,
          reason: "Pattern match"
        });
      }
    });
    
    console.log(`🎯 Found ${servicesToDelete.length} dummy services to delete:`);
    servicesToDelete.forEach((service, index) => {
      console.log(`${index + 1}. "${service.name}" (${service.reason})`);
    });
    
    if (servicesToDelete.length === 0) {
      console.log("✅ No dummy services found to delete!");
      return;
    }
    
    // Confirm deletion
    if (!confirm(`Found ${servicesToDelete.length} dummy services. Delete them all?`)) {
      console.log("❌ Deletion cancelled by user.");
      return;
    }
    
    let deletedCount = 0;
    
    // Delete services one by one
    for (const service of servicesToDelete) {
      try {
        console.log(`🗑️  Deleting: "${service.name}" (${service.id})`);
        await deleteDoc(doc(db, "services", service.id));
        deletedCount++;
        console.log(`✅ Deleted: "${service.name}"`);
      } catch (deleteError) {
        console.error(`❌ Failed to delete "${service.name}":`, deleteError);
      }
    }
    
    console.log(`\n🎉 Deletion complete! Removed ${deletedCount}/${servicesToDelete.length} services.`);
    
    // Clear caches
    console.log("🗂️ Clearing browser caches...");
    
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('service') || key.includes('firebase') || key.includes('cache')) {
        localStorage.removeItem(key);
        console.log(`Cleared localStorage: ${key}`);
      }
    });
    
    // Clear sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('service') || key.includes('firebase') || key.includes('cache')) {
        sessionStorage.removeItem(key);
        console.log(`Cleared sessionStorage: ${key}`);
      }
    });
    
    console.log("🔄 Cache cleared! Refreshing page in 3 seconds...");
    
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error("❌ Error during aggressive cleanup:", error);
    console.log("💡 Try running this script on the service provider dashboard page.");
  }
})();