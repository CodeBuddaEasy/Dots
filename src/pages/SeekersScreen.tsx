import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Background3D from '../components/common/Background3D';

interface ChatQuestion {
  id: number;
  question: string;
  description?: string;
  options?: string[];
  allowCustomInput?: boolean;
  inputPlaceholder?: string;
  isContactInfo?: boolean;
  isLocation?: boolean;
}

interface UserAnswer {
  questionId: number;
  answer: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  city: string;
}

const SeekersScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    city: '',
  });

  // List of Estonian cities
  const estonianCities = [
    'Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 
    'Viljandi', 'Rakvere', 'Maardu', 'Sillamäe', 'Kuressaare',
    'Võru', 'Valga', 'Jõhvi', 'Haapsalu', 'Keila', 
    'Paide', 'Tapa', 'Põlva', 'Türi', 'Elva'
  ];

  const questions: ChatQuestion[] = [
    {
      id: 1,
      question: "What field are you most passionate about?",
      description: "Choose the area where you'd like to grow, learn, and connect with others. Your choice helps us match you with relevant opportunities and mentors.",
      options: ["Technology", "Design", "Business", "Science", "Arts", "Education", "Other"],
      allowCustomInput: true,
      inputPlaceholder: "Tell us about your passion..."
    },
    {
      id: 2,
      question: "What is your current experience level?",
      description: "This helps us understand your current skills and tailor opportunities that will challenge you appropriately.",
      options: ["Just starting out", "Some experience", "Experienced professional", "Expert/Leader"]
    },
    {
      id: 3,
      question: "What kind of opportunities are you looking for?",
      description: "Select the type of engagement that best fits your current lifestyle and career goals.",
      options: [
        "Full-time job - Long-term commitment with regular hours", 
        "Internship - Structured learning experience with mentorship", 
        "Freelance work - Project-based, flexible schedule", 
        "Mentorship - Guided professional development", 
        "Learning resources - Self-paced growth", 
        "Networking - Building connections in your field"
      ]
    },
    {
      id: 4,
      question: "What's your timeline for finding opportunities?",
      description: "Let us know your urgency level so we can prioritize recommendations accordingly.",
      options: ["As soon as possible", "Within 3 months", "Within 6 months", "Just exploring for now"]
    },
    {
      id: 5,
      question: "What are your top skills you'd like to leverage or develop?",
      description: "List skills you already have or ones you'd like to develop. This helps us match you with opportunities for growth.",
      allowCustomInput: true,
      inputPlaceholder: "List your skills separated by commas..."
    },
    {
      id: 6,
      question: "We'd like to know a bit more about you",
      description: "Your contact information helps us connect you with opportunities. This information will only be shared with Inspirators you choose to connect with.",
      isContactInfo: true
    },
    {
      id: 7,
      question: "Where are you located?",
      description: "Select the Estonian city where you're currently based or willing to engage in activities.",
      isLocation: true
    }
  ];

  const handleOptionSelect = (answer: string) => {
    setAnswers([...answers, { questionId: questions[currentStep].id, answer }]);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleCustomInput = () => {
    if (customInput.trim()) {
      handleOptionSelect(customInput);
      setCustomInput('');
    }
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleContactInfoSubmit = () => {
    if (contactInfo.email && contactInfo.phone) {
      setAnswers([
        ...answers, 
        { 
          questionId: questions[currentStep].id, 
          answer: `Email: ${contactInfo.email}, Phone: ${contactInfo.phone}` 
        }
      ]);
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleCitySelect = (city: string) => {
    setContactInfo({
      ...contactInfo,
      city
    });
    setAnswers([
      ...answers, 
      { 
        questionId: questions[currentStep].id, 
        answer: `City: ${city}` 
      }
    ]);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetJourney = () => {
    setAnswers([]);
    setCurrentStep(0);
    setShowResults(false);
    setContactInfo({
      email: '',
      phone: '',
      city: '',
    });
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
              <Link to="/seekers" className="px-3 py-2 rounded-lg bg-white/10 text-white">
                Seekers
              </Link>
              <Link to="/inspirators" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Inspirators
              </Link>
              <Link to="/success-stories" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Success Stories
              </Link>
              <Link to="/communities" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Communities
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Seekers' Journey</h1>
          <p className="text-xl text-gray-300">Discover your path and connect with opportunities</p>
        </motion.div>

        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-8 rounded-xl shadow-xl"
              >
                <div className="mb-6">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Progress</span>
                    <span>{currentStep + 1} of {questions.length}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"
                      initial={{ width: `${(currentStep / questions.length) * 100}%` }}
                      animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-3">{questions[currentStep].question}</h2>
                
                {questions[currentStep].description && (
                  <p className="text-gray-300 mb-6">
                    {questions[currentStep].description}
                  </p>
                )}

                {!questions[currentStep].isContactInfo && !questions[currentStep].isLocation && (
                  <div className="space-y-3">
                    {questions[currentStep].options?.map((option, idx) => (
                      <motion.button
                        key={idx}
                        className="w-full p-4 text-left rounded-lg glass hover:bg-white/10 transition-colors border border-white/10"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </motion.button>
                    ))}

                    {questions[currentStep].allowCustomInput && (
                      <div className="mt-6">
                        <div className="flex">
                          <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder={questions[currentStep].inputPlaceholder || "Type your answer..."}
                            className="flex-grow p-4 bg-gray-800/50 rounded-l-lg border border-white/10 focus:outline-none focus:border-purple-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
                          />
                          <button
                            className="px-4 bg-purple-600 rounded-r-lg hover:bg-purple-700 transition-colors"
                            onClick={handleCustomInput}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {questions[currentStep].isContactInfo && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactInfoChange}
                        placeholder="your.email@example.com"
                        className="w-full p-4 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleContactInfoChange}
                        placeholder="+372 XXXXXXXX"
                        className="w-full p-4 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                        onClick={handleContactInfoSubmit}
                        disabled={!contactInfo.email || !contactInfo.phone}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {questions[currentStep].isLocation && (
                  <div className="space-y-4">
                    <p className="text-gray-300 mb-4">Choose the Estonian city where you're currently located:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {estonianCities.map((city, idx) => (
                        <motion.button
                          key={idx}
                          className="p-3 text-center rounded-lg glass hover:bg-white/10 transition-colors border border-white/10"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-8 rounded-xl shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6">Your Journey Profile</h2>
                
                <div className="space-y-6 mb-8">
                  {answers.map((answer, idx) => {
                    const question = questions.find(q => q.id === answer.questionId);
                    return (
                      <div key={idx} className="border-b border-white/10 pb-4">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">{question?.question}</h3>
                        <p className="text-xl">{answer.answer}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-3">Recommended Next Steps</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Complete your detailed profile to get personalized matches</li>
                    <li>Explore opportunities in your field of interest</li>
                    <li>Connect with mentors who can guide your journey</li>
                    <li>Join communities that align with your career goals</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="glass p-6 rounded-xl border-t-4 border-blue-500">
                    <h3 className="text-xl font-bold mb-2">Communities</h3>
                    <p className="text-gray-300 mb-4">
                      Join industry-specific communities to connect with like-minded professionals.
                    </p>
                    <Link to="/communities" className="text-blue-400 hover:text-blue-300 font-medium">
                      Explore Communities →
                    </Link>
                  </div>

                  <div className="glass p-6 rounded-xl border-t-4 border-green-500">
                    <h3 className="text-xl font-bold mb-2">Success Stories</h3>
                    <p className="text-gray-300 mb-4">
                      Discover how other Seekers have found opportunities and grown through our platform.
                    </p>
                    <Link to="/success-stories" className="text-green-400 hover:text-green-300 font-medium">
                      Read Stories →
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <motion.button
                    className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetJourney}
                  >
                    Start Over
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Opportunities
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Complete Profile
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SeekersScreen; 