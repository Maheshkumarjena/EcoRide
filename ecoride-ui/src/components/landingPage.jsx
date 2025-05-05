import React from 'react';
import Link from 'next/link';

const CarpoolLandingPage = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-screen flex items-center justify-center text-gray-800 dark:text-gray-200"
        style={{ backgroundImage: "url('car-pool.jpg')" }}
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-purple-800 dark:text-purple-200">Ride Smarter, Save Together</h1>
          <p className="text-2xl mb-8 text-purple-800 dark:text-purple-300">Join the carpooling revolution and share rides with ease.</p>
          <Link href='/Ride'>
            <button className="bg-purple-300 cursor-pointer text-purple-800 px-6 py-3 rounded hover:bg-purple-400 dark:bg-purple-700 dark:text-purple-200 dark:hover:bg-purple-800 transition-colors duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-purple-200 dark:bg-gray-900 text-purple-800 dark:text-purple-200">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-purple-300 dark:bg-purple-800 p-6 rounded-lg shadow-md max-w-sm text-center transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Save Money</h3>
            <p>Split costs with fellow travelers and reduce your expenses.</p>
          </div>
          <div className="bg-purple-300 dark:bg-purple-800 p-6 rounded-lg shadow-md max-w-sm text-center transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Eco-Friendly</h3>
            <p>Reduce your carbon footprint by sharing rides.</p>
          </div>
          <div className="bg-purple-300 dark:bg-purple-800 p-6 rounded-lg shadow-md max-w-sm text-center transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Convenient</h3>
            <p>Find rides that match your schedule and route.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-purple-100 dark:bg-gray-950 text-purple-800 dark:text-purple-200">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="text-center max-w-sm">
            <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">1</span>
            <p className="mt-4">Sign up and create your profile.</p>
          </div>
          <div className="text-center max-w-sm">
            <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">2</span>
            <p className="mt-4">Search for rides or offer your own.</p>
          </div>
          <div className="text-center max-w-sm">
            <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">3</span>
            <p className="mt-4">Connect with travelers and hit the road!</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 pb-30 bg-purple-200 dark:bg-gray-800 text-purple-800 dark:text-purple-200 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Start Carpooling?</h2>
        <Link href="/SignUp">
          <button className="bg-white cursor-pointer text-purple-600 dark:bg-purple-200 dark:text-purple-800 px-8 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-300">
            Join Now
          </button>
        </Link>
      </section>
    </div>
  );
};

export default CarpoolLandingPage;