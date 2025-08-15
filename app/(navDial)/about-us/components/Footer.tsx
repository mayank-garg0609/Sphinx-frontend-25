import React from "react";

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="px-6 py-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Quick Links Section */}
        <div>
          <h4 className="text-xl font-semibold mb-6 text-white">Quick Links</h4>
          <ul className="space-y-3 text-zinc-400">
            <li className="hover:text-white transition-colors duration-300">
              About Us
            </li>
            <li className="hover:text-white transition-colors duration-300">
              Events
            </li>
            <li className="hover:text-white transition-colors duration-300">
              Gallery
            </li>
            <li className="hover:text-white transition-colors duration-300">
              Contact
            </li>
          </ul>
        </div>

        {/* Marketing Team */}
        <div>
          <h4 className="text-xl font-semibold mb-6 text-white">
            Marketing Team
          </h4>
          <div className="space-y-3 text-zinc-400">
            <p className="hover:text-white transition-colors duration-300">
              Lorem Ipsum — +91 98765 43210
            </p>
            <p className="hover:text-white transition-colors duration-300">
              Lorem Ipsum — +91 91234 56789
            </p>
          </div>
        </div>

        {/* Technical Team */}
        <div>
          <h4 className="text-xl font-semibold mb-6 text-white">
            Technical Team
          </h4>
          <div className="space-y-3 text-zinc-400">
            <p className="hover:text-white transition-colors duration-300">
              Lorem Ipsum — +91 99887 66554
            </p>
            <p className="hover:text-white transition-colors duration-300">
              Lorem Ipsum — +91 99123 45678
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500">
        <p>Copyright © 2024 SPHINX | MNIT Jaipur</p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
