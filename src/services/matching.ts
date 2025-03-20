import { 
  generateEmbedding, 
  prepareSeeker, 
  prepareListing, 
  calculateCosineSimilarity, 
  similarityToPercentage 
} from './openai';
import { 
  getAllSeekers, 
  getListings, 
  storeSeeker, 
  storeListing,
  getSeekerEmbedding,
  getListingEmbedding,
  getCurrentUserProfile
} from './supabase';

// Generate embeddings for all listings in the database
export const generateListingEmbeddings = async () => {
  try {
    const listingsResponse = await getListings();
    if (!listingsResponse.success || !listingsResponse.data) {
      throw new Error('Failed to fetch listings');
    }

    const listings = listingsResponse.data;
    console.log(`Generating embeddings for ${listings.length} listings...`);
    
    const results = await Promise.all(listings.map(async (listing) => {
      const preparedText = prepareListing(listing);
      const embedding = await generateEmbedding(preparedText);
      
      if (!embedding) {
        return { success: false, id: listing.id, error: 'Failed to generate embedding' };
      }
      
      const storeResult = await storeListing(listing.id, embedding);
      return { 
        success: storeResult.success, 
        id: listing.id, 
        error: storeResult.success ? null : 'Failed to store embedding' 
      };
    }));
    
    const successful = results.filter(r => r.success).length;
    console.log(`Successfully generated and stored ${successful}/${listings.length} listing embeddings`);
    
    return { success: true, totalCount: listings.length, successCount: successful };
  } catch (error) {
    console.error('Error generating listing embeddings:', error);
    return { success: false, error };
  }
};

// Generate embeddings for all seekers in the database
export const generateSeekerEmbeddings = async () => {
  try {
    const seekersResponse = await getAllSeekers();
    if (!seekersResponse.success || !seekersResponse.data) {
      throw new Error('Failed to fetch seekers');
    }

    const seekers = seekersResponse.data;
    console.log(`Generating embeddings for ${seekers.length} seekers...`);
    
    const results = await Promise.all(seekers.map(async (seeker) => {
      const preparedText = prepareSeeker(seeker);
      const embedding = await generateEmbedding(preparedText);
      
      if (!embedding) {
        return { success: false, id: seeker.id, error: 'Failed to generate embedding' };
      }
      
      const storeResult = await storeSeeker(seeker.id, embedding);
      return { 
        success: storeResult.success, 
        id: seeker.id, 
        error: storeResult.success ? null : 'Failed to store embedding' 
      };
    }));
    
    const successful = results.filter(r => r.success).length;
    console.log(`Successfully generated and stored ${successful}/${seekers.length} seeker embeddings`);
    
    return { success: true, totalCount: seekers.length, successCount: successful };
  } catch (error) {
    console.error('Error generating seeker embeddings:', error);
    return { success: false, error };
  }
};

// Match listings with the current user profile
export const matchListingsWithCurrentUser = async () => {
  try {
    // Get the current user profile
    const profileResponse = await getCurrentUserProfile();
    if (!profileResponse.success || !profileResponse.data) {
      throw new Error('Failed to fetch current user profile');
    }
    
    const profile = profileResponse.data;
    const userType = profileResponse.userType;
    
    if (userType !== 'seeker') {
      throw new Error('Only job seekers can use smart matching');
    }
    
    // Generate embedding for the current user if not already done
    const seekerEmbeddingResponse = await getSeekerEmbedding(profile.id);
    let seekerEmbedding;
    
    if (!seekerEmbeddingResponse.success || !seekerEmbeddingResponse.data) {
      // Generate and store new embedding
      const preparedText = prepareSeeker(profile);
      seekerEmbedding = await generateEmbedding(preparedText);
      
      if (!seekerEmbedding) {
        throw new Error('Failed to generate embedding for user profile');
      }
      
      await storeSeeker(profile.id, seekerEmbedding);
    } else {
      seekerEmbedding = seekerEmbeddingResponse.data;
    }
    
    // Get all listings
    const listingsResponse = await getListings();
    if (!listingsResponse.success || !listingsResponse.data) {
      throw new Error('Failed to fetch listings');
    }
    
    const listings = listingsResponse.data;
    
    // Match each listing with the seeker
    const matchedListings = await Promise.all(listings.map(async (listing) => {
      let listingEmbedding;
      
      // Try to get existing embedding
      const listingEmbeddingResponse = await getListingEmbedding(listing.id);
      
      if (!listingEmbeddingResponse.success || !listingEmbeddingResponse.data) {
        // Generate new embedding
        const preparedText = prepareListing(listing);
        listingEmbedding = await generateEmbedding(preparedText);
        
        if (!listingEmbedding) {
          return { ...listing, matchPercentage: 0 };
        }
        
        await storeListing(listing.id, listingEmbedding);
      } else {
        listingEmbedding = listingEmbeddingResponse.data;
      }
      
      // Calculate similarity
      const similarity = calculateCosineSimilarity(seekerEmbedding, listingEmbedding);
      const matchPercentage = similarityToPercentage(similarity);
      
      return { ...listing, matchPercentage };
    }));
    
    // Sort by match percentage (highest first)
    matchedListings.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return { success: true, data: matchedListings };
  } catch (error) {
    console.error('Error matching listings with user:', error);
    return { success: false, error, data: [] };
  }
};

// Find similar listings based on a reference listing
export const findSimilarListings = async (referenceListingId: string) => {
  try {
    // Get the reference listing
    const listingsResponse = await getListings();
    if (!listingsResponse.success || !listingsResponse.data) {
      throw new Error('Failed to fetch listings');
    }
    
    const listings = listingsResponse.data;
    const referenceListing = listings.find(listing => listing.id === referenceListingId);
    
    if (!referenceListing) {
      throw new Error('Reference listing not found');
    }
    
    // Generate or retrieve embedding for reference listing
    let referenceEmbedding;
    const embeddingResponse = await getListingEmbedding(referenceListingId);
    
    if (!embeddingResponse.success || !embeddingResponse.data) {
      // Generate new embedding
      const preparedText = prepareListing(referenceListing);
      referenceEmbedding = await generateEmbedding(preparedText);
      
      if (!referenceEmbedding) {
        throw new Error('Failed to generate embedding for reference listing');
      }
      
      await storeListing(referenceListingId, referenceEmbedding);
    } else {
      referenceEmbedding = embeddingResponse.data;
    }
    
    // Process all other listings to find similarities
    const similarListings = await Promise.all(
      listings
        .filter(listing => listing.id !== referenceListingId) // Exclude reference listing
        .map(async (listing) => {
          let listingEmbedding;
          
          // Try to get existing embedding
          const listingEmbeddingResponse = await getListingEmbedding(listing.id);
          
          if (!listingEmbeddingResponse.success || !listingEmbeddingResponse.data) {
            // Generate new embedding
            const preparedText = prepareListing(listing);
            listingEmbedding = await generateEmbedding(preparedText);
            
            if (!listingEmbedding) {
              return { ...listing, matchPercentage: 0 };
            }
            
            await storeListing(listing.id, listingEmbedding);
          } else {
            listingEmbedding = listingEmbeddingResponse.data;
          }
          
          // Calculate similarity
          const similarity = calculateCosineSimilarity(referenceEmbedding, listingEmbedding);
          const matchPercentage = similarityToPercentage(similarity);
          
          return { ...listing, matchPercentage };
        })
    );
    
    // Sort by match percentage (highest first)
    similarListings.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return { 
      success: true, 
      data: similarListings,
      referenceListing 
    };
  } catch (error) {
    console.error('Error finding similar listings:', error);
    return { success: false, error, data: [], referenceListing: null };
  }
};

// Match listings based on seeker profile information
export const matchListingsToSeeker = async (seekerData: any) => {
  try {
    // Prepare seeker data
    const preparedSeekerText = `Skills: ${seekerData.skills.join(", ")}. Interests: ${seekerData.interests.join(", ")}`;
    
    // Generate embedding for seeker data
    const seekerEmbedding = await generateEmbedding(preparedSeekerText);
    
    if (!seekerEmbedding) {
      throw new Error('Failed to generate embedding for seeker data');
    }
    
    // Get all listings
    const listingsResponse = await getListings();
    if (!listingsResponse.success || !listingsResponse.data) {
      throw new Error('Failed to fetch listings');
    }
    
    const listings = listingsResponse.data;
    
    // Match each listing with the seeker
    const matchedListings = await Promise.all(listings.map(async (listing) => {
      let listingEmbedding;
      
      // Try to get existing embedding
      const listingEmbeddingResponse = await getListingEmbedding(listing.id);
      
      if (!listingEmbeddingResponse.success || !listingEmbeddingResponse.data) {
        // Generate new embedding
        const preparedText = prepareListing(listing);
        listingEmbedding = await generateEmbedding(preparedText);
        
        if (!listingEmbedding) {
          return { ...listing, matchPercentage: 0 };
        }
        
        await storeListing(listing.id, listingEmbedding);
      } else {
        listingEmbedding = listingEmbeddingResponse.data;
      }
      
      // Calculate similarity
      const similarity = calculateCosineSimilarity(seekerEmbedding, listingEmbedding);
      const matchPercentage = similarityToPercentage(similarity);
      
      return { ...listing, matchPercentage };
    }));
    
    // Sort by match percentage (highest first)
    matchedListings.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return { success: true, data: matchedListings };
  } catch (error) {
    console.error('Error matching listings to seeker:', error);
    return { success: false, error, data: [] };
  }
};

// Match seekers based on job listing information
export const matchSeekersToListing = async (listingData: any) => {
  try {
    // Prepare listing data
    const preparedListingText = `Position: ${listingData.position}. Description: ${listingData.description}. Requirements: ${listingData.requirements.join(", ")}`;
    
    // Generate embedding for listing data
    const listingEmbedding = await generateEmbedding(preparedListingText);
    
    if (!listingEmbedding) {
      throw new Error('Failed to generate embedding for listing data');
    }
    
    // Get all seekers
    const seekersResponse = await getAllSeekers();
    if (!seekersResponse.success || !seekersResponse.data) {
      throw new Error('Failed to fetch seekers');
    }
    
    const seekers = seekersResponse.data;
    
    // Match each seeker with the listing
    const matchedSeekers = await Promise.all(seekers.map(async (seeker) => {
      let seekerEmbedding;
      
      // Try to get existing embedding
      const seekerEmbeddingResponse = await getSeekerEmbedding(seeker.id);
      
      if (!seekerEmbeddingResponse.success || !seekerEmbeddingResponse.data) {
        // Generate new embedding
        const preparedText = prepareSeeker(seeker);
        seekerEmbedding = await generateEmbedding(preparedText);
        
        if (!seekerEmbedding) {
          return { ...seeker, matchPercentage: 0 };
        }
        
        await storeSeeker(seeker.id, seekerEmbedding);
      } else {
        seekerEmbedding = seekerEmbeddingResponse.data;
      }
      
      // Calculate similarity
      const similarity = calculateCosineSimilarity(listingEmbedding, seekerEmbedding);
      const matchPercentage = similarityToPercentage(similarity);
      
      return { ...seeker, matchPercentage };
    }));
    
    // Sort by match percentage (highest first)
    matchedSeekers.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return { success: true, data: matchedSeekers };
  } catch (error) {
    console.error('Error matching seekers to listing:', error);
    return { success: false, error, data: [] };
  }
}; 