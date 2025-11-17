import React from "react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/potree", label: "Potree" },
    { path: "/PointNetPage", label: "PointNet++ Classifier" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-[color:var(--border)]">
      <div className="max-w-[2000px] mx-auto px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--blue-primary)] to-[var(--blue-muted)] flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[color:var(--foreground)]">
              Twinner
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="justify-center hidden md:flex nav-rail">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 mx-1 rounded-full text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-[var(--blue-primary)]"
                    : "text-[color:var(--foreground)]/70 hover:text-[color:var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-end gap-3">
            <Link to="/PointNetPage" className="hidden sm:inline-flex px-4 py-2 rounded-full btn-primary text-sm font-medium">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
