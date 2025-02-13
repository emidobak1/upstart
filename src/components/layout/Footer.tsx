const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">U</span>
              </div>
              <span className="text-xl font-medium">upstart</span>
            </div>
            <p className="text-gray-600">Connecting ambitious students with innovative startups.</p>
          </div>
          <div>
            <h3 className="font-medium mb-4">For Students</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Browse Projects</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Success Stories</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Resources</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">For Startups</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Post a Project</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Find Talent</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Partner Program</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">© 2025 Upstart. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;