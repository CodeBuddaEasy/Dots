import { useState, useEffect } from "react";
import { getListings, getAllSeekers } from "../services/supabase";
import { findSimilarListings, matchListingsToSeeker, matchSeekersToListing } from "../services/matching";
import ListingCard from "../components/ListingCard";
import SeekerCard from "../components/SeekerCard";
import MatchForm from "../components/MatchForm";

interface Listing {
  id: string;
  company: string;
  position: string;
  location: string;
  offer_type: string;
  description: string;
  requirements?: string[];
  duration?: string;
  compensation?: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  matchPercentage?: number;
}

interface Seeker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string;
  interests: string;
  experience?: string;
  availability?: string;
  created_at: string;
  matchPercentage?: number;
}

const locationOptions = [
  { value: "", label: "All Locations" },
  { value: "Tallinn", label: "Tallinn" },
  { value: "Tartu", label: "Tartu" },
  { value: "Pärnu", label: "Pärnu" },
  { value: "Narva", label: "Narva" },
  { value: "Viljandi", label: "Viljandi" },
  { value: "Rakvere", label: "Rakvere" },
  { value: "Kuressaare", label: "Kuressaare" },
  { value: "Võru", label: "Võru" },
  { value: "Valga", label: "Valga" },
  { value: "Haapsalu", label: "Haapsalu" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "International", label: "International" }
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "internship", label: "Internship" },
  { value: "volunteering", label: "Volunteering" },
  { value: "entry-level", label: "Entry-Level" },
  { value: "other", label: "Other" },
];

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [seekers, setSeekers] = useState<Seeker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchingError, setMatchingError] = useState("");
  const [referenceListingId, setReferenceListingId] = useState<string | null>(null);
  const [similarMode, setSimilarMode] = useState(false);
  const [matchMode, setMatchMode] = useState<'none' | 'seeker' | 'employer'>('none');
  const [showSeekers, setShowSeekers] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    offerType: "",
    searchTerm: "",
  });
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch initial listings
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const response = await getListings();
        if (response.success && response.data) {
          setListings(response.data as Listing[]);
          setFilteredListings(response.data as Listing[]);
        } else {
          setError("Failed to fetch listings. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to fetch listings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Apply filters
  useEffect(() => {
    if (showSeekers) return; // Don't apply filters when showing seekers
    
    // Apply filters
    let result = [...listings];

    if (filters.location) {
      result = result.filter((listing) => 
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.offerType) {
      result = result.filter((listing) => listing.offer_type === filters.offerType);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (listing) =>
          listing.position.toLowerCase().includes(term) ||
          listing.company.toLowerCase().includes(term) ||
          listing.description.toLowerCase().includes(term)
      );
    }

    setFilteredListings(result);
  }, [listings, filters, showSeekers]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      offerType: "",
      searchTerm: "",
    });
  };

  const handleFindSimilar = async (listingId: string) => {
    setIsMatching(true);
    setMatchingError("");
    setSimilarMode(true);
    setReferenceListingId(listingId);
    setShowSeekers(false);
    setMatchMode('none');

    try {
      const response = await findSimilarListings(listingId);
      
      if (response.success && response.data) {
        // Get the reference listing and the similar listings
        const referenceListing = response.referenceListing;
        const similarListings = response.data;
        
        // Combine them, with reference listing first
        const combinedListings = referenceListing ? [referenceListing, ...similarListings] : similarListings;
        
        setListings(combinedListings);
        
        // Apply existing filters to the matched results
        let result = [...similarListings]; // Don't include reference in filtering
        
        if (filters.location) {
          result = result.filter((listing) => 
            listing.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        
        if (filters.offerType) {
          result = result.filter((listing) => listing.offer_type === filters.offerType);
        }
        
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          result = result.filter(
            (listing) =>
              listing.position.toLowerCase().includes(term) ||
              listing.company.toLowerCase().includes(term) ||
              listing.description.toLowerCase().includes(term)
          );
        }
        
        // Add back the reference listing at the top
        setFilteredListings(referenceListing ? [referenceListing, ...result] : result);
      } else {
        setMatchingError("Failed to find similar listings. Please try again later.");
      }
    } catch (error) {
      console.error("Error finding similar listings:", error);
      setMatchingError("Failed to find similar listings. Please try again later.");
    } finally {
      setIsMatching(false);
    }
  };

  const resetToAllListings = async () => {
    setSimilarMode(false);
    setReferenceListingId(null);
    setShowSeekers(false);
    setMatchMode('none');
    setIsLoading(true);
    
    try {
      const response = await getListings();
      if (response.success && response.data) {
        setListings(response.data as Listing[]);
        setFilteredListings(response.data as Listing[]);
      } else {
        setError("Failed to fetch listings. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to fetch listings. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeekerMatch = async (formData: any) => {
    setIsMatching(true);
    setMatchingError("");
    setSimilarMode(false);
    setReferenceListingId(null);
    setShowSeekers(false);

    try {
      const response = await matchListingsToSeeker(formData);
      
      if (response.success && response.data) {
        setListings(response.data);
        
        // Apply existing filters to the matched results
        let result = [...response.data];
        
        if (filters.location) {
          result = result.filter((listing) => 
            listing.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        
        if (filters.offerType) {
          result = result.filter((listing) => listing.offer_type === filters.offerType);
        }
        
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          result = result.filter(
            (listing) =>
              listing.position.toLowerCase().includes(term) ||
              listing.company.toLowerCase().includes(term) ||
              listing.description.toLowerCase().includes(term)
          );
        }
        
        setFilteredListings(result);
      } else {
        setMatchingError("Failed to match listings. Please try again later.");
      }
    } catch (error) {
      console.error("Error matching listings:", error);
      setMatchingError("Failed to match listings. Please try again later.");
    } finally {
      setIsMatching(false);
    }
  };

  const handleEmployerMatch = async (formData: any) => {
    setIsMatching(true);
    setMatchingError("");
    setSimilarMode(false);
    setReferenceListingId(null);
    setShowSeekers(true);

    try {
      const response = await matchSeekersToListing(formData);
      
      if (response.success && response.data) {
        setSeekers(response.data);
      } else {
        setMatchingError("Failed to match candidates. Please try again later.");
      }
    } catch (error) {
      console.error("Error matching candidates:", error);
      setMatchingError("Failed to match candidates. Please try again later.");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Explore Opportunities</h1>
      <p className="text-base-content/80 mb-8">
        Find internships, volunteering positions, and entry-level jobs in Estonia.
      </p>

      {/* Main Actions */}
      <div className="mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => {
              setMatchMode(matchMode === 'seeker' ? 'none' : 'seeker');
              setShowSeekers(false);
              setSimilarMode(false);
            }}
            className={`btn rounded-r-none ${
              matchMode === 'seeker' 
                ? 'btn-primary' 
                : 'btn-outline'
            }`}
          >
            Find Matching Listings
          </button>
          <button
            type="button"
            onClick={() => {
              setMatchMode(matchMode === 'employer' ? 'none' : 'employer');
              setShowSeekers(false);
              setSimilarMode(false);
            }}
            className={`btn rounded-l-none ${
              matchMode === 'employer' 
                ? 'btn-secondary' 
                : 'btn-outline'
            }`}
          >
            Find Matching Candidates
          </button>
        </div>
      </div>

      {/* Matching Form */}
      {matchMode !== 'none' && (
        <MatchForm 
          isEmployer={matchMode === 'employer'} 
          onMatch={matchMode === 'employer' ? handleEmployerMatch : handleSeekerMatch}
          isLoading={isMatching}
        />
      )}

      {/* Filters (only show when viewing listings) */}
      {!showSeekers && (
        <div className="glass card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="searchTerm" className="block text-sm font-medium mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="searchTerm"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  className="form-input w-full rounded-md"
                  placeholder="Search keyword"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="form-select w-full rounded-md"
                >
                  {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="offerType" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="offerType"
                  name="offerType"
                  value={filters.offerType}
                  onChange={handleFilterChange}
                  className="form-select w-full rounded-md"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-accent btn-sm w-full"
                >
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message if matching is in progress */}
      {isMatching && (
        <div className="glass p-8 text-center mb-8 rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-base-content/80">Finding the best matches for you...</p>
        </div>
      )}

      {/* Display error if any */}
      {matchingError && (
        <div className="glass bg-error/10 border border-error/30 text-error rounded-lg p-4 mb-8">
          <p>{matchingError}</p>
        </div>
      )}

      {/* Listing results */}
      {!isMatching && !showSeekers && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {similarMode ? 'Similar Listings' : 'Available Opportunities'}
          </h2>
          
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onFindSimilar={similarMode ? undefined : handleFindSimilar}
                  isReference={false}
                />
              ))}
            </div>
          ) : (
            <div className="glass card text-center p-8">
              <div className="card-body">
                <svg className="w-16 h-16 text-base-content/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium mb-2">No listings found</h3>
                <p className="text-base-content/60">
                  {error || "We couldn't find any listings matching your criteria. Try adjusting your filters."}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Seeker results */}
      {!isMatching && showSeekers && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
            Matching Candidates
          </h2>
          
          {seekers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {seekers.map((seeker) => (
                <SeekerCard key={seeker.id} seeker={seeker} />
              ))}
            </div>
          ) : (
            <div className="glass card text-center p-8">
              <div className="card-body">
                <svg className="w-16 h-16 text-base-content/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium mb-2">No candidates found</h3>
                <p className="text-base-content/60">
                  We couldn't find any candidates matching your criteria. Try adjusting your search parameters.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 