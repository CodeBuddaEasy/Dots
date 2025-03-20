interface SeekerCardProps {
  seeker: {
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
  };
}

const SeekerCard = ({ seeker }: SeekerCardProps) => {
  // Parse skills and interests from strings to arrays
  const skillsArray = seeker.skills ? seeker.skills.split(',').map(s => s.trim()) : [];
  const interestsArray = seeker.interests ? seeker.interests.split(',').map(i => i.trim()) : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {seeker.matchPercentage !== undefined && (
        <div className="bg-gray-100 px-6 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Match score:</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-300 rounded-full h-2.5 mr-2">
              <div 
                className={`h-2.5 rounded-full ${
                  seeker.matchPercentage >= 80 ? 'bg-green-500' : 
                  seeker.matchPercentage >= 60 ? 'bg-green-400' : 
                  seeker.matchPercentage >= 40 ? 'bg-yellow-500' : 
                  seeker.matchPercentage >= 20 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${seeker.matchPercentage}%` }}
              ></div>
            </div>
            <span className={`text-sm font-medium ${
              seeker.matchPercentage >= 80 ? 'text-green-600' : 
              seeker.matchPercentage >= 60 ? 'text-green-500' : 
              seeker.matchPercentage >= 40 ? 'text-yellow-600' : 
              seeker.matchPercentage >= 20 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {seeker.matchPercentage}%
            </span>
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{seeker.name}</h3>
            {seeker.location && <p className="text-gray-600 mb-2">{seeker.location}</p>}
          </div>
        </div>

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interestsArray.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Interests:</h4>
            <div className="flex flex-wrap gap-2">
              {interestsArray.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {seeker.experience && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Experience:</h4>
            <p className="text-gray-700 line-clamp-3">{seeker.experience}</p>
          </div>
        )}

        {/* Availability */}
        {seeker.availability && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Availability:</h4>
            <p className="text-gray-700">{seeker.availability}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <a
            href={`mailto:${seeker.email}?subject=Opportunity for ${seeker.name}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default SeekerCard; 