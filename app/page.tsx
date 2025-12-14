import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">NeuraLearn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Personalized Learning Platform for CSE Students powered by AI
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Master computer science concepts through adaptive quizzes, get personalized recommendations based on your weak areas, and track your progress with intelligent analytics.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Adaptive Quizzes</h3>
            <p className="text-gray-600">
              Take quizzes on various CSE topics and get instant feedback on your performance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Weak Area Analysis</h3>
            <p className="text-gray-600">
              AI-powered analysis identifies your weak areas and tracks your improvement over time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
            <p className="text-gray-600">
              Get personalized learning resources based on your performance using RAG technology.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="font-semibold mb-2">Register</h4>
              <p className="text-sm text-gray-600">Create your account as a student</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="font-semibold mb-2">Take Quizzes</h4>
              <p className="text-sm text-gray-600">Test your knowledge on various topics</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="font-semibold mb-2">Get Analysis</h4>
              <p className="text-sm text-gray-600">See your weak areas and trends</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">4️⃣</div>
              <h4 className="font-semibold mb-2">Improve</h4>
              <p className="text-sm text-gray-600">Follow personalized recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
