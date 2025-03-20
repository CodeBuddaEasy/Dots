export const colors = {
  background: {
    primary: 'from-indigo-900 via-purple-900 to-pink-900',
    secondary: 'from-gray-900 to-gray-800',
    overlay: 'bg-black/30',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
  },
  accent: {
    primary: 'from-blue-500 to-purple-500',
    secondary: 'from-cyan-400 to-blue-500',
  },
  border: {
    primary: 'border-white/10',
    secondary: 'border-gray-700',
  }
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  slideIn: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    },
    exit: { y: 20, opacity: 0 }
  },
  scale: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }
}; 