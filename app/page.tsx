import Chat from './components/Chat';
import Link from 'next/link';

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
}

function SidebarItem({ icon, label, href }: SidebarItemProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <span className="text-gray-500">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Covera Digital AI</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Recent Conversations</h2>
            <div className="space-y-1">
              <SidebarItem icon="💬" label="Auto Insurance Quote" href="#" />
              <SidebarItem icon="💬" label="Home Policy Review" href="#" />
              <SidebarItem icon="💬" label="Claims Support" href="#" />
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Document Processing</h2>
            <div className="space-y-1">
              <SidebarItem icon="📄" label="OCR Document Scanner" href="#" />
              <SidebarItem icon="🔍" label="Policy Image Analysis" href="#" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div>
                <h2 className="font-medium">Covera Assistant</h2>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="text-gray-600 hover:text-gray-900">History</button>
              <button className="text-gray-600 hover:text-gray-900">Settings</button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1">
          <Chat />
        </div>
      </main>
    </div>
  );
}

