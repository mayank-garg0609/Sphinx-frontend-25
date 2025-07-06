import React from "react";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import "./navbar.css";

interface NavbarItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

const navbarTL: NavbarItem[] = [
  { label: "Campus Ambassador ", link: "/caProgram" },
  { label: "Accomodation", link: "/accomodation" },
  { label: "Workshops", link: "/workshops" },
];

const navbarTR: NavbarItem[] = [
  { label: "Events", link: "/events" },
  { label: "Competition", link: "/competition" },
  { label: "Profile", link: "/profile" },
];

const navbarBL: NavbarItem[] = [
  { label: "Contact Us", link: "/contact-us" },
  { label: "Sponsors", link: "/sponsors" },
  { label: "Legals", link: "/legals" },
  { label: "About Us", link: "/about-us" },
];

const navbarBR: NavbarItem[] = [
  { label: "Team", link: "/team" },
  { label: "DevTeam", link: "/dev-team" },
  {
    label: "Instagram",
    link: "https://www.instagram.com/sphinx_mnit/?hl=en",
    icon: <FaInstagram size={20} />,
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/company/sphinx-mnit-jaipur/posts/?feedView=all",
    icon: <FaLinkedin size={20} />,
  },
  {
    label: "Facebook",
    link: "https://www.facebook.com/sphinxMNIT/",
    icon: <FaFacebook size={20} />,
  }, // Optional
];

const Navbar: React.FC = () => {
  return (
    <>
      <div className="bg-TL top-left">
        <div className="navbar-group top-left text-white font-bold tracking-wider">
          {navbarTL.map((item) => (
            <Link key={item.label} href={item.link} className="navbar-link">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-TR top-right">
        <div className="navbar-group top-right text-white font-bold tracking-wider">
          {navbarTR.map((item) => (
            <Link key={item.label} href={item.link} className="navbar-link">
              {item.label}
            </Link>
          ))}
          <Link href="/sign-up">
            <button
              className="navbar-link px-4  border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors z-55"
              type="button"
            >
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-BL bottom-left">
        <div className="navbar-group bottom-left text-white font-bold tracking-wider">
          {navbarBL.map((item) => (
            <Link key={item.label} href={item.link} className="navbar-link">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-BR bottom-right">
        <div className="navbar-group bottom-right text-white font-bold tracking-wider">
          {navbarBR.map((item) => (
            <Link
              key={item.label}
              href={item.link}
              className="navbar-link flex items-center gap-1"
            >
              {item.icon ? item.icon : item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
