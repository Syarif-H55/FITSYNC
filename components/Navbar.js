'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import XPBadge from '@/components/XPBadge'
import { useXp } from '@/context/XpContext'
import { useState, useEffect } from 'react'
import { User, LogOut, Dumbbell, Utensils, Moon, BarChart3, MessageCircle, UserCircle, Activity } from 'lucide-react'
import { clearSession, getSession } from '@/lib/session'

export default function Navbar() {
  const { data: session, status } = useSession()
  const { xp } = useXp()
  const [hasValidSession, setHasValidSession] = useState(false);
  const [userName, setUserName] = useState('User');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for active session
    const activeSession = getSession();
    const isValidSession = (status === 'authenticated' || activeSession);
    setHasValidSession(isValidSession);

    // Get user name from session
    if (session?.user?.name) {
      setUserName(session.user.name);
    } else if (activeSession?.name) {
      setUserName(activeSession.name);
    } else {
      setUserName('User');
    }
  }, [status, session]);

  const handleLogout = async () => {
    // Clear session and profile data
    clearSession();
    await signOut({ callbackUrl: '/auth/login' })
  }

  // Render nothing during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <nav className="bg-gray-800 border-b border-gray-700 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                FitSync
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {/* Placeholder for session-dependent content */}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#12141A]/90 backdrop-blur-md border-b border-[#2A2D33] py-3 fixed w-full top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-white">
              FitSync
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {hasValidSession && (
              <>
                <Link href="/activities">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#00C48C] hover:bg-gray-700/50">
                    <Activity className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Activities</span>
                  </Button>
                </Link>

                <Link href="/meals">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#FF6B6B] hover:bg-gray-700/50">
                    <Utensils className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Meals</span>
                  </Button>
                </Link>
                <Link href="/sleep">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#FFA726] hover:bg-gray-700/50">
                    <Moon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sleep</span>
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#BA68C8] hover:bg-gray-700/50">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Insights</span>
                  </Button>
                </Link>
                <Link href="/ai-coach">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#BA68C8] hover:bg-gray-700/50">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">AI Coach</span>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#2196F3] hover:bg-gray-700/50">
                    <UserCircle className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm text-gray-400">Hi, {userName}</span>
                    <XPBadge size="small" />
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-[#FF6B6B] hover:bg-gray-700/50"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C48C] to-[#4FB3FF] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}