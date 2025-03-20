import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { submitSeekerApplication } from "../services/supabase";
import { motion } from "framer-motion";
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface ValidationState {
  email: boolean;
  name: boolean;
  skills: boolean;
  description: boolean;
}

interface FieldSuggestion {
  field: string;
  suggestion: string;
}

const jobTypeDescriptions = {
  "full-time": "Standard 40-hour work week with benefits",
  "part-time": "Reduced hours, flexible scheduling options",
  "weekends": "Work available on Saturdays and Sundays only",
  "flexible": "Adaptable hours based on your availability"
};

const SeekerForm = () => {
  const { formData, updateFormData } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [validation, setValidation] = useState<ValidationState>({
    email: true,
    name: true,
    skills: true,
    description: true
  });
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
  const [step, setStep] = useState(1);
  const [agreeToEmails, setAgreeToEmails] = useState(false);
  const navigate = useNavigate();

  // Initialize arrays if they don't exist
  useEffect(() => {
    if (!formData.skills) {
      updateFormData({ skills: [] });
    }
    if (!formData.interests) {
      updateFormData({ interests: [] });
    }
  }, []);

  // Validate form fields
  useEffect(() => {
    const newValidation = { ...validation };
    const newSuggestions: FieldSuggestion[] = [];
    
    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newValidation.email = emailRegex.test(formData.email);
      
      if (!newValidation.email) {
        newSuggestions.push({
          field: 'email',
          suggestion: 'Please enter a valid email address'
        });
      }
    }
    
    // Name validation
    if (formData.name) {
      newValidation.name = formData.name.length >= 2;
      
      if (!newValidation.name) {
        newSuggestions.push({
          field: 'name',
          suggestion: 'Name should be at least 2 characters'
        });
      }
    }
    
    // Skills validation
    if (formData.skills && formData.skills.length > 0) {
      newValidation.skills = formData.skills.length >= 2;
      
      if (!newValidation.skills) {
        newSuggestions.push({
          field: 'skills',
          suggestion: 'Consider adding at least 2-3 skills to improve matching'
        });
      }
    } else {
      newSuggestions.push({
        field: 'skills',
        suggestion: 'Adding skills will help connect you with the right opportunities'
      });
    }
    
    // Description validation
    if (formData.description) {
      newValidation.description = formData.description.length >= 30;
      
      if (!newValidation.description) {
        newSuggestions.push({
          field: 'description',
          suggestion: 'A more detailed description helps others understand your background and goals'
        });
      }
    }
    
    setValidation(newValidation);
    setSuggestions(newSuggestions);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim()).filter(Boolean);
    updateFormData({ skills });
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(",").map((interest) => interest.trim()).filter(Boolean);
    updateFormData({ interests });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitSeekerApplication(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/listings");
        }, 3000);
      } else {
        setError("An error occurred during submission. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to start over? All your information will be cleared.")) {
      updateFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        skills: [],
        interests: [],
        experience: "",
        availability: "",
        description: ""
      });
      setStep(1);
      window.scrollTo(0, 0);
    }
  };

  const renderStepOne = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
            className={`w-full rounded-md border ${!validation.name && formData.name ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
          />
          {!validation.name && formData.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <FaExclamationTriangle className="mr-1" /> Name is too short
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email || ""}
            onChange={handleChange}
            className={`w-full rounded-md border ${!validation.email && formData.email ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
          />
          {!validation.email && formData.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <FaExclamationTriangle className="mr-1" /> Please enter a valid email
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="City, Estonia"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToEmails"
              checked={agreeToEmails}
              onChange={(e) => setAgreeToEmails(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="agreeToEmails" className="ml-2 block text-sm text-gray-700">
              We will never send you spam. You will receive only relevant volunteering opportunities.
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/80 transition-colors"
        >
          Next Step
        </button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="grid grid-cols-1 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""}
            onChange={handleSkillsChange}
            className={`w-full rounded-md border ${!validation.skills && formData.skills?.length ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            placeholder="e.g. Communication, Teamwork, JavaScript, Design"
          />
          {suggestions.find(s => s.field === 'skills') && (
            <p className="mt-1 text-sm text-blue-500 flex items-center">
              <FaInfoCircle className="mr-1" /> {suggestions.find(s => s.field === 'skills')?.suggestion}
            </p>
          )}
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Suggested skills based on popular categories:</p>
            <div className="flex flex-wrap gap-2">
              {["Communication", "Leadership", "Problem Solving", "Teamwork", "JavaScript", "React", "Design", "Project Management", "Content Writing"].map((skill, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const currentSkills = Array.isArray(formData.skills) ? [...formData.skills] : [];
                    if (!currentSkills.includes(skill)) {
                      updateFormData({ skills: [...currentSkills, skill] });
                    }
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
            Interests (comma separated)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={Array.isArray(formData.interests) ? formData.interests.join(", ") : ""}
            onChange={handleInterestsChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="e.g. Education, Technology, Social Work, Environment"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            rows={3}
            value={formData.experience || ""}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="Please describe your previous work or volunteer experience"
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="availability"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Availability
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {Object.entries(jobTypeDescriptions).map(([value, description], index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  formData.availability === value
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-primary/50"
                }`}
                onClick={() => updateFormData({ availability: value })}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{value.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(showTooltip === value ? "" : value);
                    }}
                  >
                    <FaInfoCircle />
                  </button>
                </div>
                {showTooltip === value && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-gray-600"
                  >
                    {description}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            About Me
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description || ""}
            onChange={handleChange}
            className={`w-full rounded-md border ${!validation.description && formData.description ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            placeholder="Tell us a bit about yourself, your goals, and what you're looking for"
          ></textarea>
          {suggestions.find(s => s.field === 'description') && (
            <p className="mt-1 text-sm text-blue-500 flex items-center">
              <FaInfoCircle className="mr-1" /> {suggestions.find(s => s.field === 'description')?.suggestion}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/80 transition-colors"
        >
          Review & Submit
        </button>
      </div>
    </>
  );

  const renderReview = () => (
    <>
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Review Your Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg">{formData.name || "Not provided"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg">{formData.email || "Not provided"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-lg">{formData.phone || "Not provided"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-lg">{formData.location || "Not provided"}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Skills</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No skills provided</p>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Interests</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.interests && formData.interests.length > 0 ? (
                formData.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No interests provided</p>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Availability</p>
            <p className="text-lg">{formData.availability ? formData.availability.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) : "Not specified"}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">About Me</p>
            <p className="text-md whitespace-pre-line">{formData.description || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={resetForm}
          className="col-span-1 bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors text-center"
        >
          Start Over
        </button>
        
        <button
          type="button"
          onClick={prevStep}
          className="col-span-1 bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors text-center"
        >
          Edit Information
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-1 bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 text-center"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Profile</h2>

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            <p>
              Thank you for submitting your profile! We'll match you with opportunities that fit your
              skills and interests. We will be in touch soon. Stay connected!
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {stepNumber}
                  </div>
                  <p className="text-xs mt-2 text-gray-600">
                    {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Skills & Preferences' : 'Review'}
                  </p>
                </div>
              ))}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${(step - 1) * 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderReview()}
        </form>
      )}
    </div>
  );
};

export default SeekerForm; 