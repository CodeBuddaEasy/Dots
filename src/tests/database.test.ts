import { submitEmployerPosting, getListings } from '../services/supabase';
import { FormData } from '../context/AppContext';

// Test data
const testListing: FormData = {
  company: "Test Company",
  position: "Test Position",
  description: "This is a test listing",
  requirements: ["Test requirements"],
  location: "Tallinn",
  offerType: "internship",
  duration: "3 months",
  compensation: "Paid",
  email: "test@example.com",
  phone: "+372123456789",
  name: "",
  skills: [],
  interests: [],
  experience: "",
  availability: ""
};

// Function to run the test
async function runDatabaseTest() {
  console.log("Starting database test...");

  try {
    // 1. Submit a test listing
    console.log("Submitting test listing...");
    const submitResult = await submitEmployerPosting(testListing);
    console.log("Submit result (detailed):", JSON.stringify(submitResult, null, 2));

    if (!submitResult.success) {
      throw new Error(`Failed to submit listing: ${JSON.stringify(submitResult.error)}`);
    }

    // 2. Retrieve listings with detailed error logging
    console.log("Retrieving listings...");
    const getResult = await getListings();
    console.log("Get result (detailed):", JSON.stringify(getResult, null, 2));

    if (!getResult.success) {
      throw new Error(`Failed to get listings: ${JSON.stringify(getResult.error)}`);
    }

    // 3. Test filtering with detailed logging
    console.log("Testing filters...");
    const filteredResult = await getListings({
      offerType: "internship",
      location: "Tallinn",
      searchTerm: "test"
    });
    console.log("Filtered result (detailed):", JSON.stringify(filteredResult, null, 2));

    console.log("All tests completed successfully!");
  } catch (error) {
    console.error("Test failed with detailed error:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
  }
}

// Export the test function
export { runDatabaseTest }; 