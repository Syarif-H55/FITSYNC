'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useXp } from '@/context/XpContext';
import { getUserProfile } from '@/lib/userProfile';
import { getSession } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Target, Calendar, Flame, HeartPulse, Award, Settings } from 'lucide-react';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';

interface ProfileSummaryProps {
  // No props needed for now
}

export default function ProfileSummary({}: ProfileSummaryProps) {
  const { data: session } = useSession();
  const { xp, level } = useXp();
  const [profileData, setProfileData] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get user profile
      const profile = getUserProfile();
      if (profile) {
        setProfileData(profile);
      } else {
        console.error('No profile found');
        return;
      }

      // Get user ID for stats
      let userId = 'default_user';
      if (session && session.user) {
        // Use the consistent userId helper to ensure we use the same format as data storage
        const { getConsistentUserId } = await import('@/lib/userId-helper');
        userId = getConsistentUserId(session);
      } else {
        const fallbackSession = getSession();
        userId = fallbackSession?.username || 'default_user';
      }

      // Get weekly stats
      const stats = await getWeeklyStats(userId);
      setWeeklyStats(stats || {});
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-[#A0A3A8]">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-[#A0A3A8]">No profile data available</p>
      </div>
    );
  }

  // Calculate weekly stats
  const weeklySteps = weeklyStats?.steps ? weeklyStats.steps.reduce((sum: number, val: number) => sum + (val || 0), 0) : 0;
  const weeklyCaloriesIn = weeklyStats?.caloriesIn ? weeklyStats.caloriesIn.reduce((sum: number, val: number) => sum + (val || 0), 0) : 0;
  const weeklyCaloriesOut = weeklyStats?.caloriesOut ? weeklyStats.caloriesOut.reduce((sum: number, val: number) => sum + (val || 0), 0) : 0;
  const avgSleep = weeklyStats?.sleepHours ? 
    weeklyStats.sleepHours.filter((h: number) => h > 0).reduce((sum: number, val: number) => sum + val, 0) / 
    weeklyStats.sleepHours.filter((h: number) => h > 0).length || 0 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Summary */}
      <div className="lg:col-span-1">
        <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#22252D] border-2 border-dashed rounded-xl w-16 h-16 border-[#2A2D33]" />
            </div>
            <CardTitle className="text-xl text-white">{session?.user?.name || getSession()?.name || 'Demo User'}</CardTitle>
            <p className="text-[#A0A3A8]">{session?.user?.email || getSession()?.email || 'demo@example.com'}</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00FFAA]">{level}</div>
                <div className="text-sm text-[#A0A3A8]">Level</div>
              </div>
              <div className="mx-8 text-center">
                <div className="text-3xl font-bold text-[#7C3AED]">{xp}</div>
                <div className="text-sm text-[#A0A3A8]">XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00FFAA]">{profileData.workoutStreak || 0}</div>
                <div className="text-sm text-[#A0A3A8]">Streak</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="w-full bg-[#22252D] border-[#2A2D33] text-white hover:bg-[#2A2D33] rounded-lg py-2 px-4">
                <User className="h-4 w-4 mr-2 inline" />
                Overview
              </button>
              <button className="w-full bg-[#22252D] border-[#2A2D33] text-white hover:bg-[#2A2D33] rounded-lg py-2 px-4">
                <Settings className="h-4 w-4 mr-2 inline" />
                Preferences
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Content */}
      <div className="lg:col-span-2">
        <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white">Health Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-[#00FFAA] mr-3" />
                    <div>
                      <div className="text-sm text-[#A0A3A8]">Step Goal</div>
                      <div className="font-medium text-white">{profileData.goalSteps?.toLocaleString() || '10,000'} steps</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-[#00FFAA] mr-3" />
                    <div>
                      <div className="text-sm text-[#A0A3A8]">Calories In</div>
                      <div className="font-medium text-white">{weeklyCaloriesIn || 0} kcal</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                  <div className="flex items-center">
                    <HeartPulse className="h-5 w-5 text-[#7C3AED] mr-3" />
                    <div>
                      <div className="text-sm text-[#A0A3A8]">Avg Sleep</div>
                      <div className="font-medium text-white">{avgSleep ? avgSleep.toFixed(1) : '0'} hours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-[#00FFAA] mr-3" />
                    <div>
                      <div className="text-sm text-[#A0A3A8]">Weekly Steps</div>
                      <div className="font-medium text-white">{weeklySteps?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-[#7C3AED] mr-3" />
                    <div>
                      <div className="text-sm text-[#A0A3A8]">Calories Out</div>
                      <div className="font-medium text-white">{weeklyCaloriesOut || 0} kcal</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-[#00FFAA] mr-3" />
                    <div>
                      <div className="text-sm text-[#A0A3A8]">Current Streak</div>
                      <div className="font-medium text-white">{profileData.workoutStreak || 0} days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#E4E6EB] text-sm">Weight</p>
                  <div className="mt-1 p-2 bg-[#22252D] rounded border border-[#2A2D33] text-white">
                    {profileData.weight || 70} kg
                  </div>
                </div>
                <div>
                  <p className="text-[#E4E6EB] text-sm">Height</p>
                  <div className="mt-1 p-2 bg-[#22252D] rounded border border-[#2A2D33] text-white">
                    {profileData.height || 175} cm
                  </div>
                </div>
                <div>
                  <p className="text-[#E4E6EB] text-sm">Age</p>
                  <div className="mt-1 p-2 bg-[#22252D] rounded border border-[#2A2D33] text-white">
                    {profileData.age || 25} years
                  </div>
                </div>
                <div>
                  <p className="text-[#E4E6EB] text-sm">Gender</p>
                  <div className="mt-1 p-2 bg-[#22252D] rounded border border-[#2A2D33] text-white">
                    {profileData.gender || 'Male'}
                  </div>
                </div>
                <div>
                  <p className="text-[#E4E6EB] text-sm">Activity Level</p>
                  <div className="mt-1 p-2 bg-[#22252D] rounded border border-[#2A2D33] text-white">
                    {profileData.activityLevel || 'Moderate'}
                  </div>
                </div>
                <div>
                  <p className="text-[#E4E6EB] text-sm">Goal</p>
                  <div className="mt-1 p-2 bg-[#22252D] rounded border border-[#2A2D33] text-white">
                    {profileData.goalType ?
                      (profileData.goalType === 'lose' ? 'Lose Weight' :
                       profileData.goalType === 'gain' ? 'Gain Weight' : 'Maintain Weight')
                      : 'Maintain Weight'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}