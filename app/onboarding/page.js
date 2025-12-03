'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { saveUserProfile, getUserProfile } from '@/lib/userProfile';
import { getSession } from '@/lib/session';
import ProgressStepper from './components/ProgressStepper';
import ProfileStep from './components/ProfileStep';
import ActivityStep from './components/ActivityStep';
import GoalStep from './components/GoalStep';
import SummaryStep from './components/SummaryStep';

export default function OnboardingPage() {
  console.log('[ONBOARDING PAGE] Component mounted, current path:', typeof window !== 'undefined' ? window.location.pathname : 'server');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Initialize default values in localStorage for a new user
  const initializeUserData = () => {
    // Initialize default activity tracking values if they don't exist
    if (!localStorage.getItem('steps')) localStorage.setItem('steps', '0');
    if (!localStorage.getItem('calories')) localStorage.setItem('calories', '0');
    if (!localStorage.getItem('sleepHours')) localStorage.setItem('sleepHours', '0');
    if (!localStorage.getItem('goalSteps')) localStorage.setItem('goalSteps', '10000');
    
    // Initialize default weekly data for the past 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      
      const stepsKey = `steps-${formattedDate}`;
      const caloriesKey = `calories-${formattedDate}`;
      const sleepKey = `sleep-${formattedDate}`;
      
      if (!localStorage.getItem(stepsKey)) localStorage.setItem(stepsKey, '0');
      if (!localStorage.getItem(caloriesKey)) localStorage.setItem(caloriesKey, '0');
      if (!localStorage.getItem(sleepKey)) localStorage.setItem(sleepKey, '0');
    }
  };

  // Check authentication and onboarding status on mount, but only redirect if not authenticated
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Wait for status to load
      if (status === 'loading') return;

      // Check authentication status using both next-auth session and local session
      const isAuthenticated = (status === 'authenticated') || (getSession() !== null && getSession() !== undefined);

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log('[ONBOARDING] No authenticated session found, redirecting to login');
        router.push('/auth/login');
        return;
      }

      // Don't redirect to dashboard here, because that could cause a loop
      // We only check onboarding status when component mounts
      const profile = getUserProfile();
      console.log('[ONBOARDING] Checking profile on mount:', profile);

      // If onboarding is already completed with all required fields, redirect to dashboard
      if (profile?.onboardingCompleted && profile.name && profile.age && profile.gender && profile.height && profile.weight) {
        console.log('[ONBOARDING] Onboarding already completed with all required fields, redirecting to dashboard');
        // Check if already navigating to prevent redirect loop
        // Only redirect if we're still on the onboarding page
        if (typeof window !== 'undefined' && window.location.pathname === '/onboarding') {
          router.push('/dashboard');
        }
        return; // Early return to avoid further execution when redirecting
      }

      // If profile exists but onboarding is not complete, allow onboarding flow to continue
      console.log('[ONBOARDING] Onboarding not completed, staying on onboarding page');
    };

    // Only run on the client side
    if (typeof window !== 'undefined') {
      checkAuthAndRedirect();
    }
  }, [status]); // Removed router.pathname to prevent loop - only check on status change

  const steps = [
    { id: 1, component: ProfileStep, title: 'Profile Info' },
    { id: 2, component: ActivityStep, title: 'Activity Level' },
    { id: 3, component: GoalStep, title: 'Set Your Goal' },
    { id: 4, component: SummaryStep, title: 'Review & Confirm' }
  ];

  const handleNext = (stepData) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === steps.length) {
      // Final submission - validate required fields before saving
      if (!updatedData.name || !updatedData.age || !updatedData.gender || !updatedData.height || !updatedData.weight) {
        console.error('[ONBOARDING] Required fields are missing for onboarding completion');
        return; // Don't proceed if required fields are missing
      }

      // Initialize user data with default values after onboarding completion
      initializeUserData();
      const savedProfile = saveUserProfile({
        ...updatedData,
        onboardingCompleted: true
      });
      console.log('[ONBOARDING] Saved user profile:', savedProfile);

      // Verify the profile was saved properly
      const verificationProfile = getUserProfile();
      console.log('[ONBOARDING] Verification - profile after save:', {
        exists: !!verificationProfile,
        onboardingCompleted: verificationProfile?.onboardingCompleted,
        name: verificationProfile?.name,
        age: verificationProfile?.age,
        gender: verificationProfile?.gender,
        height: verificationProfile?.height,
        weight: verificationProfile?.weight
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    router.push('/dashboard');
  };

  const handleEditStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  // Don't render anything while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0E12]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Display onboarding form if user is logged in and hasn't completed onboarding
  return (
    <div className="bg-[#161B22] rounded-2xl shadow-xl w-full max-w-md p-6 border border-[#30363D]">
      <ProgressStepper currentStep={currentStep} totalSteps={steps.length} />
      
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              data={formData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              onEditStep={handleEditStep}
              isFirst={currentStep === 1}
              isLast={currentStep === steps.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}