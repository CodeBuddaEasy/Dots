interface ListingCardProps {
  listing: {
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
  };
  onFindSimilar?: (listingId: string) => void;
  isReference?: boolean;
}

const ListingCard = ({ listing, onFindSimilar, isReference = false }: ListingCardProps) => {
  return (
    <div className={`glass card card-hover ${isReference ? 'border-secondary border-2' : 'border-base-300'}`}>
      {isReference && (
        <div className="bg-secondary/20 px-6 py-2 border-b border-secondary/30 flex items-center">
          <span className="text-sm font-medium text-secondary">Reference Listing</span>
        </div>
      )}
      
      {listing.matchPercentage !== undefined && !isReference && (
        <div className="bg-base-200/80 px-6 py-2 border-b border-base-300 flex items-center justify-between">
          <span className="text-sm font-medium">Match score:</span>
          <div className="flex items-center">
            <div className="w-32 bg-base-300 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${
                  listing.matchPercentage >= 80 ? 'bg-success' : 
                  listing.matchPercentage >= 60 ? 'bg-success/80' : 
                  listing.matchPercentage >= 40 ? 'bg-warning' : 
                  listing.matchPercentage >= 20 ? 'bg-warning/80' : 'bg-error'
                }`}
                style={{ width: `${listing.matchPercentage}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${
              listing.matchPercentage >= 80 ? 'text-success' : 
              listing.matchPercentage >= 60 ? 'text-success/80' : 
              listing.matchPercentage >= 40 ? 'text-warning' : 
              listing.matchPercentage >= 20 ? 'text-warning/80' : 'text-error'
            }`}>
              {listing.matchPercentage}%
            </span>
          </div>
        </div>
      )}
      <div className="px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-accent">{listing.position}</h2>
            <h3 className="text-lg font-medium text-primary">{listing.company}</h3>
          </div>
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary">
            {listing.offer_type}
          </span>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-accent mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{listing.location}</span>
          </div>

          {listing.duration && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {listing.duration}
            </div>
          )}

          {listing.compensation && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {listing.compensation}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-700 mb-4 line-clamp-3">{listing.description}</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-4-4m4 4l4-4"
                />
              </svg>
              {new Date(listing.created_at).toLocaleDateString()}
            </div>
          </div>

          {listing.requirements && listing.requirements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {listing.requirements.slice(0, 3).map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
                {listing.requirements.length > 3 && (
                  <li className="text-primary">+{listing.requirements.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-base-300 bg-base-200/50 flex justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Posted: </span>
          <span className="font-medium">{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="flex gap-2">
          {onFindSimilar && (
            <button 
              onClick={() => onFindSimilar(listing.id)} 
              className="btn btn-sm btn-primary gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path>
              </svg>
              Find Similar
            </button>
          )}
          
          <a 
            href={`mailto:${listing.contact_email}?subject=Application for ${listing.position} position`} 
            className="btn btn-sm btn-secondary gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingCard; 