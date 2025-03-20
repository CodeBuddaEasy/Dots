# Dots: A Platform for Connecting and Growing

Dots (formerly Voluntify) is a platform connecting young people and unemployed individuals with establishments offering internship and volunteering roles in Estonia.

## Project Overview

Dots aims to solve two key issues:
- **For Organizations**: Providing access to eager talent for internships, volunteering, and entry-level positions
- **For Job Seekers**: Reducing the friction associated with work search and building confidence through opportunities

## Features

- **Chat-Driven Registration**: Intuitive chatbot interface to gather information from both job seekers and employers
- **Smart Form Filling**: AI-powered extraction of relevant information from conversations to pre-fill registration forms
- **Opportunity Listings**: Searchable and filterable board of available positions
- **Modern UI**: Responsive, accessible design that works on all devices
- **Communities Hub**: Connect with like-minded individuals in your area of interest
- **Bridges We Build**: Success stories to inspire and guide new users
- **Growing Together**: Beyond volunteering opportunities for personal and professional growth

## Tech Stack

- **Frontend**: React with TypeScript, built with Vite
- **Styling**: TailwindCSS with DaisyUI components
- **Animation**: Framer Motion for smooth UI transitions
- **3D Effects**: Three.js for immersive background effects
- **Backend**: Supabase for database and authentication
- **AI Integration**: OpenAI for chatbot and data extraction
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/CodeBuddaEasy/Dots.git
cd Dots
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for different routes
- `/src/services` - API integration services (Supabase, OpenAI)
- `/src/context` - React context for state management
- `/src/assets` - Static assets like images and icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors and supporters of the project
- Inspired by the need to connect talent with opportunities in Estonia
