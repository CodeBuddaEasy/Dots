import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Voluntify</h3>
            <p className="text-gray-300 text-sm">
              Connecting young people and unemployed with establishments offering internship and
              volunteering roles in Estonia.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-300 hover:text-white">
                  Explore Opportunities
                </Link>
              </li>
              <li>
                <Link to="/register/seeker" className="text-gray-300 hover:text-white">
                  For Job Seekers
                </Link>
              </li>
              <li>
                <Link to="/register/employer" className="text-gray-300 hover:text-white">
                  For Employers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Tallinn, Estonia</li>
              <li>Email: info@voluntify.ee</li>
              <li>Phone: +372 5555 5555</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Voluntify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 