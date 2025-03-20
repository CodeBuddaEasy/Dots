import { Link } from "react-router-dom";
import heroImage from "../assets/hero.svg";

const Home = () => {
  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-secondary/10 rounded-full filter blur-xl opacity-20 animate-pulse-slow"></div>
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-base-content/80 to-base-content/40">Connecting </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">opportunities</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-base-content/80 to-base-content/40"> with </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">potential</span>
            </h1>
            <p className="text-lg text-base-content/80 mb-8">
              Voluntify helps Estonian organizations find eager talent, and helps young people gain
              valuable experience through internships and volunteering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/listings"
                className="btn btn-primary"
              >
                Find Opportunities
              </Link>
              <Link
                to="/register/employer"
                className="btn btn-secondary"
              >
                Post Opportunities
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="glass p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img
                src={heroImage}
                alt="People connecting"
                className="max-w-full h-auto rounded-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 glass mt-12 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">How Voluntify Works</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Simplifying the process of finding the right opportunities and candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="glass card card-hover">
            <div className="card-body">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center">Chat-Driven Experience</h3>
              <p className="text-base-content/80 text-center">
                Our intuitive chatbot helps you describe what you're looking for, making the
                registration process simple and conversational.
              </p>
            </div>
          </div>

          <div className="glass card card-hover">
            <div className="card-body">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent text-center">Smart Matching</h3>
              <p className="text-base-content/80 text-center">
                We use advanced technology to match opportunities with candidates based on skills,
                interests, and requirements.
              </p>
            </div>
          </div>

          <div className="glass card card-hover">
            <div className="card-body">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary text-center">Easy Application</h3>
              <p className="text-base-content/80 text-center">
                Apply for opportunities with a single click. Organizations can review and contact
                candidates directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 mt-12 glass rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-50"></div>
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Ready to Get Started?</h2>
          <p className="text-base-content/70 max-w-2xl mx-auto mb-8">
            Whether you're looking for an opportunity or seeking talent, join Voluntify today and make
            meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/seeker"
              className="btn btn-primary"
            >
              I'm Looking for Opportunities
            </Link>
            <Link
              to="/register/employer"
              className="btn btn-secondary"
            >
              I'm Looking for Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 