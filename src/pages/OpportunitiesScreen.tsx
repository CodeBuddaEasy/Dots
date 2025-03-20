import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaUsers, FaComments, FaRocket } from 'react-icons/fa';
import Background3D from '../components/common/Background3D';

interface EventIdea {
  type: string;
  title: string;
  description: string;
  contactEmail?: string;
}

const OpportunitiesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'submit'>('discover');
  const [ideaType, setIdeaType] = useState<string>('event');
  const [ideaTitle, setIdeaTitle] = useState<string>('');
  const [ideaDescription, setIdeaDescription] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const opportunityTypes = [
    {
      id: 'event',
      title: 'Event',
      icon: FaUsers,
      description: 'Organize gatherings for people to connect and learn'
    },
    {
      id: 'workshop',
      title: 'Workshop',
      icon: FaLightbulb,
      description: 'Share your knowledge and skills with others'
    },
    {
      id: 'discussion',
      title: 'Discussion Group',
      icon: FaComments,
      description: 'Create a space for meaningful conversations'
    },
    {
      id: 'project',
      title: 'Project Collaboration',
      icon: FaRocket,
      description: 'Bring together people to work on ideas that matter'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setIdeaType('event');
        setIdeaTitle('');
        setIdeaDescription('');
        setContactEmail('');
        setSubmitSuccess(false);
        setActiveTab('discover');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-indigo-950 text-white flex flex-col">
      <Background3D />
      {/* Header with navigation */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">Dots</Link>
            <nav className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Home
              </Link>
              <Link to="/seekers" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Seekers
              </Link>
              <Link to="/inspirators" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Inspirators
              </Link>
              <Link to="/success-stories" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Bridges We Build
              </Link>
              <Link to="/communities" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Communities - Hub
              </Link>
              <Link to="/opportunities" className="px-3 py-2 rounded-lg bg-white/10 text-white">
                Growing Together
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">Growing Together</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're more than just volunteering; we're about creating opportunities for everyone to grow, connect, and make an impact.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-900/50 rounded-lg p-1">
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'discover' ? 'bg-blue-600 text-white' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveTab('discover')}
              >
                Discover Opportunities
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'submit' ? 'bg-blue-600 text-white' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveTab('submit')}
              >
                Submit Your Idea
              </button>
            </div>
          </div>
        </div>

        {/* Discover Opportunities Content */}
        {activeTab === 'discover' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900/40 backdrop-blur-md p-8 rounded-xl border-l-4 border-purple-500">
                <h2 className="text-2xl font-bold mb-4">Why Go Beyond Volunteering?</h2>
                <p className="text-gray-300 mb-6">
                  While volunteering provides valuable experiences, sometimes you need more ways to grow, connect, and make a difference. Our platform helps you take the next step by creating and joining initiatives that align with your passions.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Develop leadership and organizational skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Build a network of passionate individuals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Create meaningful impact in areas you care about</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Test your ideas in a supportive environment</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-md p-8 rounded-xl border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="bg-blue-500/20 text-blue-300 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <div>
                      <h3 className="font-bold text-white">Submit Your Idea</h3>
                      <p className="text-gray-300">Share what you'd like to create or organize</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-500/20 text-blue-300 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <div>
                      <h3 className="font-bold text-white">Get Connected</h3>
                      <p className="text-gray-300">We'll help match you with like-minded individuals</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-500/20 text-blue-300 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <div>
                      <h3 className="font-bold text-white">Receive Support</h3>
                      <p className="text-gray-300">Access resources, guidance, and promotion for your initiative</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-500/20 text-blue-300 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <div>
                      <h3 className="font-bold text-white">Launch & Grow</h3>
                      <p className="text-gray-300">Turn your idea into reality and build a community around it</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div className="text-center mb-12">
              <button
                onClick={() => setActiveTab('submit')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ready to Submit Your Idea?
              </button>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-md p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Tech Skills Workshop Series</h3>
                  <p className="text-gray-300 mb-4">
                    "I proposed a series of coding workshops and met three other developers who helped me create a monthly event that's now attended by over 50 people!"
                  </p>
                  <p className="text-sm text-gray-400">— Kristjan, Web Developer</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Environmental Discussion Club</h3>
                  <p className="text-gray-300 mb-4">
                    "My passion for sustainability found a home when I started a monthly discussion group. We've since organized two community clean-ups and influenced local policy."
                  </p>
                  <p className="text-sm text-gray-400">— Mari, Environmental Advocate</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Art Therapy Sessions</h3>
                  <p className="text-gray-300 mb-4">
                    "I wanted to use my art therapy background to help others. Through this platform, I launched weekly sessions that have helped dozens of people express themselves."
                  </p>
                  <p className="text-sm text-gray-400">— Liisa, Art Therapist</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Your Idea Content */}
        {activeTab === 'submit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitSuccess ? (
              <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-2">Thank You for Your Submission!</h2>
                <p className="mb-4">We've received your idea and will be in touch soon to discuss next steps. Your initiative could be the next big opportunity in our community!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-900/40 backdrop-blur-md p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Share Your Idea</h2>
                
                <div className="mb-6">
                  <label className="block text-white mb-2">What type of opportunity would you like to create?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {opportunityTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          ideaType === type.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-blue-500/50"
                        }`}
                        onClick={() => setIdeaType(type.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <type.icon className="text-3xl mb-3 text-blue-400" />
                          <h3 className="font-bold mb-1">{type.title}</h3>
                          <p className="text-sm text-gray-300">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="title" className="block text-white mb-2">Title of your idea</label>
                  <input
                    type="text"
                    id="title"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                    placeholder="e.g., 'Monthly Creative Writing Workshop'"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-white mb-2">Description</label>
                  <textarea
                    id="description"
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-white h-32"
                    placeholder="Describe your idea, who it's for, and what impact you hope to make..."
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-white mb-2">Contact Email</label>
                  <input
                    type="email"
                    id="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Your Idea'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OpportunitiesScreen; 