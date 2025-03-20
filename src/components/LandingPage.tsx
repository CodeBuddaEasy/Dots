import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Background3D from './common/Background3D';

interface ClanCardProps {
  type: string;
  description: string;
  color: string;
  onClick: () => void;
}

const Logo = () => (
  <motion.div
    className="w-32 h-32 relative mb-8"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary rounded-full" />
    <motion.div 
      className="absolute w-full h-full"
      style={{ borderRadius: "50%", border: "4px solid currentColor" }}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary rounded-full" />
    <div className="absolute bottom-0 right-0 w-16 h-16 bg-accent rounded-full" />
  </motion.div>
);

const ClanCard: React.FC<ClanCardProps> = ({ type, description, color, onClick }) => (
  <motion.div
    className={`glass bg-gray-900/80 backdrop-blur-md p-8 rounded-xl cursor-pointer ${color} max-w-md mx-4 transition-all duration-300`}
    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
    onClick={onClick}
  >
    <h3 className="text-3xl font-bold mb-4">{type}</h3>
    <p className="text-gray-200 text-lg">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-blue-950 to-indigo-950">
      <Background3D />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Logo />
          <h1 className="text-7xl font-bold mb-6 font-futuristic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">Welcome to Dots</h1>
          <p className="text-2xl font-semibold text-gray-200 mb-12">Connect. Grow. Inspire.</p>
        </motion.div>

        <motion.div 
          className="flex justify-center gap-8 flex-wrap mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ClanCard
            type="Seekers"
            description="Bold pioneers charting new territories of knowledge and experience. Join this clan if you're ready to explore and grow."
            color="border-purple-500/40 hover:border-purple-500/70"
            onClick={() => navigate('/seekers')}
          />
          <ClanCard
            type="Inspirators"
            description="Guides and mentors sharing wisdom and creating opportunities. Join this clan if you're ready to lead and inspire."
            color="border-green-500/40 hover:border-green-500/70"
            onClick={() => navigate('/inspirators')}
          />
        </motion.div>
        
        <motion.div
          className="flex flex-col items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 bg-blue-600/80 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-blue-600 transition-colors"
              onClick={() => navigate('/communities')}
            >
              Explore Communities
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 bg-purple-600/80 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-purple-600 transition-colors"
              onClick={() => navigate('/success-stories')}
            >
              Bridges We Build
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-6 py-3 bg-pink-600/80 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-pink-600 transition-colors"
              onClick={() => navigate('/opportunities')}
            >
              Growing Together
            </motion.button>
          </div>
          
          <p className="text-gray-400 text-center max-w-2xl mt-4">
            Discover how Dots connects people across the universe, creating bridges of opportunity, 
            community, and growth for everyone seeking to make an impact.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 