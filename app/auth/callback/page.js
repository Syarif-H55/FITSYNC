'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { setSession } from '@/lib/session';
import { getUserProfile } from '@/lib/userProfile';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Set session for Google login
      setSession({
        username: session.user.email.split('@')[0], // Use email prefix as username
        email: session.user.email,
        name: session.user.name || session.user.email
      });

      // Check if user has completed onboarding
      const profile = getUserProfile();
      if (!profile?.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E12]">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  );
}