// src/components/layout/Header.tsx
export default function Header() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <span className="text-xl font-medium">upstart</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-black text-sm border-b-2 border-black h-16 flex items-center">Home</a>
            <a href="#" className="text-gray-600 text-sm hover:text-gray-900">For Students</a>
            <a href="#" className="text-gray-600 text-sm hover:text-gray-900">For Startups</a>
            <div className="flex items-center space-x-4">
              <button className="text-gray-900 text-sm hover:text-black">Log in</button>
              <button className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900 transition">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}