import React from 'react';

export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] to-[#161B22] flex items-center justify-center p-4">
      {children}
    </div>
  );
}