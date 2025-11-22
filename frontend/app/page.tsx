import Link from 'next/link';
import { MessageCircle, Users, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="h-screen bg-[#404EED] font-sans overflow-x-hidden overflow-y-auto flex flex-col">
      
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-white font-bold text-2xl">
          <MessageCircle className="w-8 h-8" />
          <span>Tenord</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <button className="text-white hover:underline font-medium px-4 py-2">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-white text-[#2c2f33] px-4 py-2 rounded-full text-sm font-medium hover:text-[#5865F2] hover:shadow-lg transition-all duration-200">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      
      <main className="flex-1">
        <div className="relative overflow-hidden bg-[#404EED] pb-20">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-6 pt-20 text-center text-white z-10">
            <h1 className="font-black text-5xl md:text-7xl mb-6 tracking-tight font-['Rubik']">
              IMAGINE A PLACE...
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto font-light opacity-90">
              ...where you can belong to a school club, a gaming group, or a worldwide art community.
              Where just you and a handful of friends can spend time together. A place that makes it easy
              to talk every day and hang out more often.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/app">
                <button className="bg-white text-[#23272a] px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center hover:text-[#5865F2] hover:shadow-xl transition-all duration-200 min-w-[200px]">
                  Open Tenord
                </button>
              </Link>
            </div>
          </div>
        </div>

        
        <div className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#5865F2]/10 rounded-2xl flex items-center justify-center mb-6 text-[#5865F2]">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#23272a] mb-3">Create Invite-Only Places</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tenord servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.
                </p>
              </div>

              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#5865F2]/10 rounded-2xl flex items-center justify-center mb-6 text-[#5865F2]">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#23272a] mb-3">Real-Time Messaging</h3>
                <p className="text-gray-600 leading-relaxed">
                  Low-latency messaging feels like you&apos;re in the same room. See who&apos;s typing, edit messages instantly, and express yourself with emojis.
                </p>
              </div>

              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#5865F2]/10 rounded-2xl flex items-center justify-center mb-6 text-[#5865F2]">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#23272a] mb-3">Custom Profiles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Customize your identity with unique avatars, banners, and bios. Stand out in every community you join.
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-[#f6f6f6] py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#23272a] mb-6">Ready to start your journey?</h2>
          <Link href="/register">
            <button className="bg-[#5865F2] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#4752c4] hover:shadow-lg transition-all duration-200">
              Join Tenord Today
            </button>
          </Link>
        </div>
      </main>

      
      <footer className="bg-[#23272a] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div className="col-span-1">
              <div className="flex items-center space-x-2 text-white font-bold text-xl mb-4">
                <MessageCircle className="w-6 h-6" />
                <span>Tenord</span>
              </div>
              <p className="text-gray-400 text-sm">
                A place to connect, collaborate, and communicate.
              </p>
            </div>

            
            <div>
              <h3 className="text-white font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/app" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Open App
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            
            <div>
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Tenord. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="/guidelines" className="text-gray-400 hover:text-white text-sm transition-colors">
                Guidelines
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}