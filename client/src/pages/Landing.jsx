import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Team Management",
    description: "Invite team members, assign roles, and manage your entire company from one place.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Project Tracking",
    description: "Create and manage projects with real-time status updates and full audit control.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Task Assignment",
    description: "Assign tasks to team members, track progress, and update statuses in real time.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Role Based Access",
    description: "Admin, Manager, and Member roles with fine-grained permission control built in.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Invitations",
    description: "Invite new members via email with a secure token-based onboarding flow.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Live Dashboard",
    description: "Get a real-time overview of your projects, tasks, and team activity at a glance.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <span className="font-extrabold text-base sm:text-lg bg-gradient-to-r from-purple-700 via-purple-500 to-pink-400 bg-clip-text text-transparent">
            TeamBoard Pro
          </span>

          {/* Nav buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 bg-gradient-to-b from-purple-50 via-white to-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Multi-tenant SaaS Project Management
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl mb-6">
          Manage your team{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            smarter
          </span>
          , not harder
        </h1>

        {/* Subheading */}
        <p className="text-gray-500 text-sm sm:text-lg lg:text-xl max-w-xl mb-10 leading-relaxed">
          TeamBoard Pro brings your projects, tasks, and team together in one workspace. Built for companies that move fast.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto text-sm sm:text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Create your workspace
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-sm sm:text-base font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-6 sm:px-8 py-3 rounded-xl transition-all"
          >
            Sign in instead
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Everything your team needs
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              From onboarding to delivery — TeamBoard Pro covers the full workflow.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA banner */}
      <section className="px-4 sm:px-8 py-14 sm:py-20 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-purple-200 text-sm sm:text-base mb-8">
            Create your company workspace in seconds. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-block text-sm sm:text-base font-semibold text-purple-700 bg-white hover:bg-purple-50 px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;