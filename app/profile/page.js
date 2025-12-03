'use client';

import Navbar from '@/components/Navbar';
import ProfileSummary from '@/components/profile/ProfileSummary';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0E0E12] text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
          <p className="text-[#A0A3A8]">Manage your health metrics and preferences</p>
        </div>

        <ProfileSummary />
      </main>
    </div>
  );
}