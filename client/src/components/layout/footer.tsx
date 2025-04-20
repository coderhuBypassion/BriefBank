import { Link } from "wouter";
import { Twitter, Linkedin, Github, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center text-xl font-bold mb-5">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              BriefBank
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              AI-powered pitch deck library—explore, learn, and get inspired in seconds. Your trusted source for startup research.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-300 tracking-wider uppercase mb-5">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Pitch Deck Library
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    AI Summaries
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Startup Research
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/#pricing">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Pricing
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-300 tracking-wider uppercase mb-5">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Help Center
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Contact Us
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    FAQs
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-300 tracking-wider uppercase mb-5">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Privacy Policy
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Terms of Service
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <div className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    Cookie Policy
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BriefBank. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span>Made with</span>
              <span className="text-primary">♥</span>
              <span>for startup founders</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
