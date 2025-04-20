import { Link } from "wouter";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold mb-4">BriefBank</div>
            <p className="text-gray-300 mb-4">AI-powered pitch deck library—explore, learn, and get inspired in seconds.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Features</h3>
            <ul className="space-y-3">
              <li><Link href="/decks"><a className="text-gray-300 hover:text-white">Pitch Deck Library</a></Link></li>
              <li><Link href="#"><a className="text-gray-300 hover:text-white">AI Summaries</a></Link></li>
              <li><Link href="#"><a className="text-gray-300 hover:text-white">Startup Research</a></Link></li>
              <li><Link href="#pricing"><a className="text-gray-300 hover:text-white">Pricing</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#"><a className="text-gray-300 hover:text-white">Help Center</a></Link></li>
              <li><Link href="#"><a className="text-gray-300 hover:text-white">Contact Us</a></Link></li>
              <li><Link href="#"><a className="text-gray-300 hover:text-white">FAQs</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#"><a className="text-gray-300 hover:text-white">Privacy Policy</a></Link></li>
              <li><Link href="#"><a className="text-gray-300 hover:text-white">Terms of Service</a></Link></li>
              <li><Link href="#"><a className="text-gray-300 hover:text-white">Cookie Policy</a></Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">© {new Date().getFullYear()} BriefBank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
