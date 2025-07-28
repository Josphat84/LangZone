// frontend/app/careers/page.tsx
export default function CareersPage() {
  const openPositions = [
    {
      title: "Language Instructor (Multiple Languages)",
      type: "Remote | Part-time/Full-time",
      description: "Teach your native language to students worldwide through our platform.",
      responsibilities: [
        "Deliver high-quality language instruction",
        "Create engaging lesson plans",
        "Provide constructive feedback",
        "Maintain professional communication"
      ],
      requirements: [
        "Native or near-native proficiency",
        "Teaching experience",
        "Bachelor's degree or equivalent",
        "Reliable internet connection"
      ]
    },
    {
      title: "Frontend Developer",
      type: "Remote | Full-time",
      description: "Help build and improve our learning platform with modern web technologies.",
      responsibilities: [
        "Develop new user-facing features",
        "Optimize application performance",
        "Collaborate with design team",
        "Write clean, maintainable code"
      ],
      requirements: [
        "3+ years experience with React/Next.js",
        "Proficient in TypeScript",
        "Strong CSS/Tailwind skills",
        "Experience with testing"
      ]
    }
  ];

  const benefits = [
    {
      title: "Flexible Work",
      description: "Remote opportunities with flexible schedules",
      icon: "🌍"
    },
    {
      title: "Learning Budget",
      description: "Annual stipend for professional development",
      icon: "📚"
    },
    {
      title: "Wellness Program",
      description: "Health and wellness benefits",
      icon: "🧘"
    },
    {
      title: "Language Perks",
      description: "Free language lessons",
      icon: "🗣️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Join the LangZone Team
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Help us revolutionize language learning through technology and human connection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a 
              href="#positions" 
              className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm md:text-base font-medium hover:bg-teal-700 transition-colors"
            >
              View Openings
            </a>
            <a 
              href="#culture" 
              className="border border-teal-600 text-teal-600 px-6 py-2 rounded-full text-sm md:text-base font-medium hover:bg-teal-50 transition-colors"
            >
              Our Culture
            </a>
          </div>
        </section>

        {/* Culture Section */}
        <section id="culture" className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-lg font-semibold mb-2">Global Mindset</h3>
              <p className="text-gray-700 text-sm">We celebrate diversity across cultures and backgrounds.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-700 text-sm">Constantly improving the learning experience.</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="text-lg font-semibold mb-2">Passion for Learning</h3>
              <p className="text-gray-700 text-sm">Lifelong learners who grow together.</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Join Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{benefit.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-700 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Current Openings</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
                  <p className="text-teal-600 text-sm">{position.type}</p>
                </div>
                <p className="text-gray-700 mb-4 text-sm">{position.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">RESPONSIBILITIES</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                      {position.responsibilities.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">REQUIREMENTS</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                      {position.requirements.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  Apply for Position
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* General Application */}
        <section className="bg-teal-50 rounded-xl p-6 md:p-8 text-center border border-teal-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Interested but don't see your role?</h2>
          <p className="text-gray-700 text-sm mb-4 max-w-md mx-auto">
            We're always looking for talented people. Send us your resume!
          </p>
          <button className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition-colors">
            Submit General Application
          </button>
        </section>
      </main>
    </div>
  );
}