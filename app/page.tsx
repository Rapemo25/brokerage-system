import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Brokerage Assistant
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Your AI-powered financial advisor
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">AI Online</span>
            </div>
          </div>
        </div>
      </div>
      <Chat />
    </main>
  );
}

