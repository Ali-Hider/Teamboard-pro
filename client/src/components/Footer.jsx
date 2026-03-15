const Footer = () => {
  return (
    <footer className="bg-purple-950 border-t border-purple-800 py-6 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Logo — gradient glow */}
        <span className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
          TeamBoard Pro
        </span>

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-purple-300">
          © {new Date().getFullYear()} TeamBoard Pro. All rights reserved.
        </p>

        {/* Tech stack */}
        <span className="text-xs sm:text-sm text-purple-300">
          Built with React + Node.js
        </span>

      </div>
    </footer>
  );
};

export default Footer;