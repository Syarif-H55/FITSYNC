// app/ai-coach/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/Badge';
import { useXp } from '@/context/XpContext';
import { askAI, askAIWithRetry } from '@/lib/aiService';
import { prompts } from '@/lib/aiPrompts';
import { 
  MessageCircle, 
  Send, 
  Dumbbell, 
  Utensils, 
  BarChart3, 
  User, 
  Sparkles,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function AIChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { xp, level } = useXp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your FitSync AI Coach. How can I help you with your fitness journey today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Get user data for context
  const getUserContext = () => {
    // In a real app, you'd fetch actual user data, but for now we'll use demo values
    return {
      name: session?.user?.name || 'User',
      level: level,
      xp: xp,
      steps: 8547, // Mock data - would come from actual user data
      goalSteps: 10000,
      streak: 5, // Mock data
      calories: 2100, // Mock data
      fitnessGoal: 'weight_loss' as const,
      recentActivity: 'completed HIIT workout and logged 3 meals',
      dietaryRestrictions: [],
      foodPreferences: ['chicken', 'vegetables', 'protein shakes'],
      activityLevel: 3, // 1-5 scale
      sleep: 7.2,
      weight: 75,
      height: 175,
      gender: 'male',
    };
  };

  useEffect(() => {
    // Check for demo session in localStorage
    const checkDemoSession = () => {
      if (typeof window !== 'undefined') {
        const demoSession = localStorage.getItem('demoSession');
        return demoSession ? JSON.parse(demoSession) : null;
      }
      return null;
    };

    const demoSession = checkDemoSession();
    
    if (status === 'unauthenticated' && !demoSession) {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get user context for personalized response
      const userContext = getUserContext();
      
      // For general questions, use the general fitness prompt
      const prompt = prompts.generalFitness(input, userContext);
      
      // Get AI response
      const response = await askAIWithRetry(prompt);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Suggest Today's Workout",
      icon: <Dumbbell className="h-5 w-5" />,
      onClick: async () => {
        setIsLoading(true);
        try {
          const userContext = getUserContext();
          const prompt = prompts.workoutPlan(userContext);
          const response = await askAIWithRetry(prompt);
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            content: response.reply,
            role: 'assistant',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error generating workout:', error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: "Sorry, I couldn't generate a workout. Please try again.",
            role: 'assistant',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    {
      title: "Adjust My Nutrition",
      icon: <Utensils className="h-5 w-5" />,
      onClick: async () => {
        setIsLoading(true);
        try {
          const userContext = getUserContext();
          const prompt = prompts.mealPlan(userContext);
          const response = await askAIWithRetry(prompt);
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            content: response.reply,
            role: 'assistant',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error generating meal plan:', error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: "Sorry, I couldn't generate a meal plan. Please try again.",
            role: 'assistant',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    {
      title: "How Am I Doing?",
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: async () => {
        setIsLoading(true);
        try {
          const userContext = getUserContext();
          const datapoints = {
            workoutsThisWeek: 4,
            mealsLogged: 18,
            avgSleep: 7.2,
            stepsThisWeek: 45000,
            xpGained: 850,
            goalProgress: 45
          };
          const prompt = prompts.weeklySummary(userContext, datapoints);
          const response = await askAIWithRetry(prompt);
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            content: response.reply,
            role: 'assistant',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error generating summary:', error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: "Sorry, I couldn't generate a progress summary. Please try again.",
            role: 'assistant',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    {
      title: "Motivate Me!",
      icon: <Sparkles className="h-5 w-5" />,
      onClick: async () => {
        setIsLoading(true);
        try {
          const userContext = getUserContext();
          const prompt = prompts.motivationalShort(userContext);
          const response = await askAIWithRetry(prompt);
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            content: response.reply,
            role: 'assistant',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error generating motivation:', error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: "Sorry, I couldn't generate motivation. Please try again.",
            role: 'assistant',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    }
  ];

  if (status === 'loading') {
    // Check for demo session during loading
    if (typeof window !== 'undefined') {
      const demoSession = localStorage.getItem('demoSession');
      if (demoSession) {
        // Continue loading if demo session exists
      } else {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-2xl">Loading...</div>
          </div>
        );
      }
    }
  }

  // Check if user has a valid session (either authenticated or demo session)
  const checkDemoSession = () => {
    if (typeof window !== 'undefined') {
      const demoSession = localStorage.getItem('demoSession');
      return demoSession ? JSON.parse(demoSession) : null;
    }
    return null;
  };

  const demoSession = checkDemoSession();
  const hasValidSession = (status === 'authenticated' || demoSession);

  if (!hasValidSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0E0E12] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-[#00FFAA]" />
            FitSync AI Coach
          </h1>
          <p className="text-[#A0A3A8]">Your personal fitness and wellness assistant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-[#00FFAA]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start bg-[#22252D] border-[#2A2D33] text-white hover:bg-[#2A2D33] rounded-lg"
                      onClick={action.onClick}
                      disabled={isLoading}
                    >
                      <span className="mr-2">{action.icon}</span>
                      {action.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] flex flex-col bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-[#7C3AED]" />
                  Chat with AI Coach
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-[#12141A] p-4 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-[#00FFAA] text-[#0E0E12] rounded-br-none'
                            : 'bg-[#22252D] text-[#E4E6EB] rounded-bl-none border border-[#2A2D33]'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-[#0E0E12]' : 'text-[#A0A3A8]'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#22252D] text-[#E4E6EB] rounded-lg p-4 rounded-bl-none max-w-[80%] border border-[#2A2D33]">
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2 text-[#00FFAA]" />
                          <span>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="mt-auto">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about fitness, nutrition, or wellness..."
                      className="flex-1 bg-[#22252D] border-[#2A2D33] text-white rounded-lg"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !input.trim()}
                      className="bg-gradient-to-r from-[#7C3AED] to-[#00FFAA] hover:from-[#6d32d6] hover:to-[#00e69a] rounded-lg"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}