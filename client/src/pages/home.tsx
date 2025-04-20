import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AuthModal from "@/components/auth-modal";
import DeckCard from "@/components/deck-card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/clerk";
import { Deck } from "@/lib/types";
import { ChevronRight, Search, Zap, CheckCircle, Clock, SparklesIcon, BarChart3, LightbulbIcon, TrendingUpIcon, Sparkles } from "lucide-react";

export default function Home() {
  const [location, navigate] = useLocation();
  const { isSignedIn } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Fetch featured decks for the homepage
  const { data: featuredDecks, isLoading } = useQuery<Deck[]>({
    queryKey: ['/api/decks/featured'],
    enabled: true,
  });

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleExploreClick = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAuthModal={openAuthModal} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  AI-Powered Pitch Deck Analysis
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                  Pitch decks, <span className="text-primary">simplified</span> by AI
                </h1>
                <p className="mt-6 text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Stop spending hours reading pitch decks. Get instant AI-powered summaries, insights, and analysis in seconds.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                  onClick={handleExploreClick}
                >
                  Start Free Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl border-gray-300 hover:bg-gray-50 font-medium"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See How It Works
                </Button>
              </div>
              <div className="flex gap-6 pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                  No credit card required
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                  3 free summaries
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary to-purple-600 opacity-30 blur-xl"></div>
                <div className="relative rounded-2xl shadow-xl overflow-hidden bg-white">
                  <div className="p-1 bg-gradient-to-r from-primary to-purple-600"></div>
                  <div className="px-8 py-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="p-3 rounded-xl bg-primary text-white">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Summary</h3>
                        <p className="text-sm text-gray-500">Key insights extracted</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm">Clear product-market fit with 3x growth in last quarter</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm">Experienced team with previous successful exits</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm">Scalable business model with 85% margins</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        Generated in 2.3 seconds
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 font-medium">
                        View Full Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">500+</div>
              <div className="mt-2 text-sm text-gray-500">Pitch Decks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">15+</div>
              <div className="mt-2 text-sm text-gray-500">Industries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">10k+</div>
              <div className="mt-2 text-sm text-gray-500">AI Summaries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">5k+</div>
              <div className="mt-2 text-sm text-gray-500">Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Decks Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Featured Pitch Decks</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Browse through our curated collection of successful startup pitch decks with AI-powered insights.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-full w-1/3 mt-4"></div>
                </div>
              ))
            ) : featuredDecks?.length ? (
              featuredDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  showSaveButton={false}
                  onViewPremium={openAuthModal}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No featured decks available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              className="px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium" 
              onClick={handleExploreClick}
            >
              Explore All Pitch Decks
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How BriefBank Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get valuable insights from pitch decks in just seconds with our AI-powered analysis.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
              </div>
              <div className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Pitch Decks</h3>
                <p className="text-gray-600">Browse our curated library of pitch decks from successful startups across different industries and funding stages.</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
              </div>
              <div className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600">Our advanced AI instantly analyzes each deck, extracting key insights, strengths, weaknesses, and funding recommendations.</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
              </div>
              <div className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LightbulbIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Inspired</h3>
                <p className="text-gray-600">Use the insights to improve your own pitch, learn effective strategies, and make better business decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BriefBank</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our platform offers unique features to help you understand startup pitch decks faster and better.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col">
              <div className="p-4 rounded-2xl bg-blue-50 text-primary inline-flex items-center justify-center w-14 h-14 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Summaries</h3>
              <p className="text-gray-600 mb-4">Get comprehensive AI-generated summaries that highlight key points, strengths, and weaknesses of each pitch deck.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Executive summary</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Strengths & weaknesses</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Funding recommendations</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col">
              <div className="p-4 rounded-2xl bg-blue-50 text-primary inline-flex items-center justify-center w-14 h-14 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Library</h3>
              <p className="text-gray-600 mb-4">Access a diverse collection of pitch decks across various industries, funding stages, and business models.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">500+ pitch decks</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">15+ industries covered</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Pre-seed to Series C+</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col">
              <div className="p-4 rounded-2xl bg-blue-50 text-primary inline-flex items-center justify-center w-14 h-14 mb-4">
                <TrendingUpIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Time-Saving Research</h3>
              <p className="text-gray-600 mb-4">Save hours of research time by getting instant access to key insights and trends from successful pitch decks.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Fast insights in seconds</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Save decks for later</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">Advanced filtering options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Start for free with 3 AI-powered summaries, then upgrade to Pro for unlimited access.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">₹0</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/forever</span>
                </div>
                <p className="mt-5 text-gray-500">Perfect for exploring and getting started with BriefBank.</p>
              </div>
              <div className="px-8 pt-6 pb-8 border-t border-gray-100 bg-gray-50">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700">3 AI-powered deck summaries</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700">Full deck browsing access</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700">Basic filtering options</p>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="ml-3 text-base text-gray-500">Unlimited summaries</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 py-6 rounded-xl font-medium"
                    onClick={openAuthModal}
                  >
                    Sign Up Free
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-primary rounded-2xl shadow-md overflow-hidden relative transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute top-5 right-5">
                <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <div className="p-8 pt-16">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">₹499</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
                </div>
                <p className="mt-5 text-gray-500">All you need for serious startup research and analysis.</p>
              </div>
              <div className="px-8 pt-6 pb-8 border-t border-gray-100 bg-gray-50">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700"><strong>Unlimited</strong> AI-powered summaries</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700">Full deck browsing access</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700">Advanced filtering & search</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <p className="ml-3 text-base text-gray-700">Early access to new decks</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button 
                    className="w-full py-6 rounded-xl shadow-md font-medium"
                    onClick={openAuthModal}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-primary to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to supercharge your startup research?</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Join thousands of founders, investors, and product managers using BriefBank to gain insights from pitch decks.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            onClick={handleExploreClick}
          >
            Get Started For Free
          </Button>
        </div>
      </div>

      <Footer />
      
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
      />
    </div>
  );
}
