import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FormData } from '../context/AppContext';
import { getEnvVar } from "../utils/envLoader";

// Get environment variables using our custom loader
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Debug info
console.log('Supabase Configuration:');
console.log('- URL:', supabaseUrl);
console.log('- Key (first 10 chars):', supabaseKey?.substring(0, 10));

// Check for missing configuration
if (!supabaseUrl || !supabaseKey) {
  console.error('============================================');
  console.error('Supabase configuration is missing!');
  console.error('Make sure your .env file contains:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('============================================');
}

// Create the Supabase client with error handling
export let supabase: SupabaseClient;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw new Error('Failed to initialize Supabase client');
}

// Submit application for job seeker
export const submitSeekerApplication = async (formData: FormData) => {
  try {
    // Prepare data for Supabase - convert arrays to strings for DB storage
    const skillsText = Array.isArray(formData.skills) 
      ? formData.skills.join(', ') 
      : formData.skills || '';
      
    const interestsText = Array.isArray(formData.interests) 
      ? formData.interests.join(', ') 
      : formData.interests || '';

    const { data, error } = await supabase
      .from('seekers')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          location: formData.location,
          skills: skillsText,
          interests: interestsText,
          experience: formData.experience,
          availability: formData.availability,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting seeker application:', error);
    return { success: false, error };
  }
};

// Submit job posting for employer
export const submitEmployerPosting = async (formData: FormData) => {
  try {
    console.log('Submitting employer posting with data:', JSON.stringify(formData, null, 2));
    
    // Prepare data for Supabase - convert arrays to strings for DB storage
    const requirementsText = Array.isArray(formData.requirements) 
      ? formData.requirements.join('\n') 
      : formData.requirements || '';

    const postingData = {
      company: formData.company,
      position: formData.position,
      description: formData.description,
      requirements: requirementsText,
      location: formData.location,
      offer_type: formData.offerType,
      duration: formData.duration,
      compensation: formData.compensation,
      contact_email: formData.email,
      contact_phone: formData.phone,
      created_at: new Date().toISOString()
    };

    console.log('Prepared posting data:', JSON.stringify(postingData, null, 2));

    const { data, error } = await supabase
      .from('listings')
      .insert([postingData])
      .select();

    if (error) {
      console.error('Error in submitEmployerPosting:', error);
      throw error;
    }

    console.log('Successfully submitted posting:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting employer posting:', error);
    return { success: false, error };
  }
};

// Get all listings with optional filters
export const getListings = async (filters: {
  offerType?: string;
  location?: string;
  searchTerm?: string;
} = {}) => {
  try {
    console.log('Getting listings with filters:', filters);
    
    let query = supabase.from('listings').select('*');

    if (filters.offerType) {
      query = query.eq('offer_type', filters.offerType);
    }

    if (filters.location) {
      query = query.eq('location', filters.location);
    }

    if (filters.searchTerm) {
      query = query.or(
        `description.ilike.%${filters.searchTerm}%,position.ilike.%${filters.searchTerm}%,company.ilike.%${filters.searchTerm}%`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error in getListings:', error);
      throw error;
    }

    console.log('Successfully retrieved listings:', data?.length || 0, 'results');
    return { success: true, data };
  } catch (error) {
    console.error('Error getting listings:', error);
    return { success: false, error, data: [] };
  }
};

// Store an embedding for a seeker
export const storeSeeker = async (seekerId: string, embedding: number[]) => {
  try {
    const { data, error } = await supabase
      .from('seeker_embeddings')
      .insert([
        {
          seeker_id: seekerId,
          embedding: embedding,
          updated_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error storing seeker embedding:', error);
    return { success: false, error };
  }
};

// Store an embedding for a listing
export const storeListing = async (listingId: string, embedding: number[]) => {
  try {
    const { data, error } = await supabase
      .from('listing_embeddings')
      .insert([
        {
          listing_id: listingId,
          embedding: embedding,
          updated_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error storing listing embedding:', error);
    return { success: false, error };
  }
};

// Get all seekers with their details
export const getAllSeekers = async () => {
  try {
    const { data, error } = await supabase
      .from('seekers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error getting seekers:', error);
    return { success: false, error, data: [] };
  }
};

// Get an embedding for a seeker
export const getSeekerEmbedding = async (seekerId: string) => {
  try {
    const { data, error } = await supabase
      .from('seeker_embeddings')
      .select('embedding')
      .eq('seeker_id', seekerId)
      .single();

    if (error) throw error;
    return { success: true, data: data.embedding };
  } catch (error) {
    console.error('Error getting seeker embedding:', error);
    return { success: false, error, data: null };
  }
};

// Get an embedding for a listing
export const getListingEmbedding = async (listingId: string) => {
  try {
    const { data, error } = await supabase
      .from('listing_embeddings')
      .select('embedding')
      .eq('listing_id', listingId)
      .single();

    if (error) throw error;
    return { success: true, data: data.embedding };
  } catch (error) {
    console.error('Error getting listing embedding:', error);
    return { success: false, error, data: null };
  }
};

// Get the current user profile
export const getCurrentUserProfile = async () => {
  try {
    const { data: seekerData, error: seekerError } = await supabase
      .from('seekers')
      .select('*')
      .eq('email', (await supabase.auth.getUser()).data.user?.email || '')
      .single();

    if (!seekerError && seekerData) {
      return { success: true, data: seekerData, userType: 'seeker' };
    }

    // If no seeker found, try employer
    const { data: employerData, error: employerError } = await supabase
      .from('employers')
      .select('*')
      .eq('email', (await supabase.auth.getUser()).data.user?.email || '')
      .single();

    if (!employerError && employerData) {
      return { success: true, data: employerData, userType: 'employer' };
    }

    return { success: false, data: null, userType: null };
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return { success: false, error, data: null, userType: null };
  }
}; 