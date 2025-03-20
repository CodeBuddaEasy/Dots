import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nova } from '../../services/ai/NovaAI';

interface OnboardingStep {
  id: string;
  question: string;
  type: 'text' | 'multiSelect' | 'singleSelect' | 'freeform';
  options?: string[];
  placeholder?: string;
}

interface OnboardingResponses {
  name?: string;
  interests?: string[];
  skills?: string[];
  goals?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'name',
    question: "What name would you like to be called?",
    type: 'text',
    placeholder: 'Enter your preferred name'
  },
  {
    id: 'interests',
    question: "What areas interest you the most?",
    type: 'multiSelect',
    options: [
      'Technology & Innovation',
      'Community Building',
      'Education & Mentoring',
      'Environmental Impact',
      'Social Justice',
      'Healthcare',
      'Arts & Culture'
    ]
  },
  {
    id: 'skills',
    question: "What skills would you like to develop or share?",
    type: 'multiSelect',
    options: [
      'Programming',
      'Design',
      'Project Management',
      'Leadership',
      'Teaching',
      'Writing',
      'Public Speaking'
    ]
  },
  {
    id: 'goals',
    question: "What brings you to our community?",
    type: 'freeform',
    placeholder: 'Share your aspirations and what you hope to achieve...'
  }
];

export const ImmersiveOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<OnboardingResponses>({});
  const [novaResponse, setNovaResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial Nova greeting
    handleNovaInteraction('Hello, I\'m Nova! I\'ll be your guide on this journey.');
  }, []);

  const handleNovaInteraction = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await nova.interact(message);
      setNovaResponse(response.message);
    } catch (error) {
      console.error('Error interacting with Nova:', error);
      setNovaResponse('I seem to be having trouble. Let\'s continue with your journey.');
    }
    setIsLoading(false);
  };

  const handleResponse = async (value: string | string[]) => {
    const currentStepData = onboardingSteps[currentStep];
    setResponses(prev => ({ ...prev, [currentStepData.id]: value }));

    // Generate personalized Nova response based on the answer
    const message = `The user's ${currentStepData.id} is: ${Array.isArray(value) ? value.join(', ') : value}. Please provide an encouraging and personalized response.`;
    await handleNovaInteraction(message);

    // Move to next step after a brief delay
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final step completed, save responses and proceed
        console.log('Onboarding completed:', responses);
        // TODO: Handle onboarding completion
      }
    }, 1500);
  };

  const renderInput = (step: OnboardingStep) => {
    switch (step.type) {
      case 'text':
        return (
          <input
            type="text"
            className="input w-full max-w-md"
            placeholder={step.placeholder}
            onChange={(e) => handleResponse(e.target.value)}
          />
        );
      case 'multiSelect':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
            {step.options?.map((option) => (
              <button
                key={option}
                className="btn btn-secondary"
                onClick={() => {
                  const currentValue = responses[step.id as keyof OnboardingResponses] as string[] || [];
                  handleResponse([...currentValue, option]);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'freeform':
        return (
          <textarea
            className="input w-full max-w-2xl h-32"
            placeholder={step.placeholder}
            onChange={(e) => handleResponse(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-primary-500'
                      : index < currentStep
                      ? 'bg-secondary-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              {onboardingSteps[currentStep].question}
            </h2>

            {/* Input */}
            <div className="flex flex-col items-center space-y-6">
              {renderInput(onboardingSteps[currentStep])}
            </div>

            {/* Nova's Response */}
            <AnimatePresence>
              {novaResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8"
                >
                  <div className="chatbot-bubble chatbot-bot">
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    ) : (
                      novaResponse
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ImmersiveOnboarding; 