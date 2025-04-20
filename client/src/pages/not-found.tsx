import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-100 relative">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            
            <div className="space-y-3 mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Page Not Found
              </h1>
              <p className="text-xl font-bold text-primary/80">404</p>
              <p className="text-gray-600 max-w-sm mx-auto">
                Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button 
                  size="lg"
                  className="rounded-xl px-6 flex items-center gap-2 shadow-sm bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-xl px-6 flex items-center gap-2 border-gray-200 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="absolute -z-10 inset-0 overflow-hidden rounded-xl">
              <div className="absolute -top-1/2 -right-1/2 w-1/2 h-1/2 bg-gray-50 rounded-full opacity-20"></div>
              <div className="absolute -bottom-1/2 -left-1/2 w-1/2 h-1/2 bg-primary/5 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            If you think this is an error, please contact our support team.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
