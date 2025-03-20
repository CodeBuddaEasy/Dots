import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { submitEmployerPosting } from "../services/supabase";

const EmployerForm = () => {
  const { formData, updateFormData } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!formData.requirements) {
      updateFormData({ requirements: [] });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const requirements = e.target.value.split("\n").filter((req) => req.trim() !== "");
    updateFormData({ requirements });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitEmployerPosting(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/listings");
        }, 3000);
      } else {
        setError("An error occurred during submission. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting posting:", error);
      setError("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Job Posting</h2>

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <p>
            Thank you for submitting your opportunity! It's now live on our platform. Redirecting you
            to listings...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Organization/Company Name *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position Title *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                required
                value={formData.position || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
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
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="City, Estonia"
              />
            </div>

            <div>
              <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-1">
                Opportunity Type *
              </label>
              <select
                id="offerType"
                name="offerType"
                required
                value={formData.offerType || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="">Select type</option>
                <option value="internship">Internship</option>
                <option value="volunteering">Volunteering</option>
                <option value="entry-level">Entry-level Job</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="e.g. 3 months, Ongoing, Summer 2023"
              />
            </div>

            <div>
              <label
                htmlFor="compensation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Compensation
              </label>
              <input
                type="text"
                id="compensation"
                name="compensation"
                value={formData.compensation || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="e.g. Unpaid, 500€/month, Transport covered"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="Provide a detailed description of the opportunity and what the candidate would be doing"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="requirements"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Requirements (one per line)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                value={Array.isArray(formData.requirements) ? formData.requirements.join("\n") : ""}
                onChange={handleRequirementsChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="List each requirement on a new line, e.g.:
Basic computer skills"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Post Opportunity"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployerForm; 