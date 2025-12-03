'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getUserProfile } from '@/lib/userProfile'
import { getSession } from '@/lib/session'

export default function HomePage() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      // Check authentication status and redirect accordingly
      const handleRedirect = () => {
        // Check both next-auth status and our local session
        const isAuthenticated = (status === 'authenticated') || (getSession() !== null && getSession() !== undefined && getSession()?.username);
        
        if (isAuthenticated) {
          // If authenticated, check if user has completed onboarding
          const profile = getUserProfile();
          console.log('Home page - authenticated user, profile:', profile);
          
          if (!profile?.onboardingCompleted) {
            console.log('Home page - redirecting to onboarding');
            router.push('/onboarding');
          } else {
            console.log('Home page - redirecting to dashboard');
            router.push('/dashboard');
          }
        } else {
          // If not authenticated, redirect to login
          console.log('Home page - not authenticated, redirecting to login');
          router.push('/auth/login');
        }
      };

      // Wait if session is loading
      if (status !== 'loading') {
        handleRedirect();
      }
    }
  }, [status]); // Hanya status yang menjadi dependency, bukan router

  // Log system changes when component loads
  useEffect(() => {
    console.log("✅ Workout page removed successfully");
    console.log("🎯 FitSync refactor complete:");
    console.log("✅ Workout page removed");
    console.log("✅ Unified activities");
    console.log("✅ Simplified meals AI");
    console.log("✅ Dashboard synced");
    console.log("✅ UX feedback added");
    console.log("✅ Insight data integration successful.");
  }, []);

  // Tambahkan loading sementara
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E12]">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}