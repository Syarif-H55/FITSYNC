'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { setSession } from '@/lib/session'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    
    if (!phone.trim()) {
      setError('Phone number is required')
      return false
    }
    
    // Basic phone number validation
    const phoneRegex = /^\d{10,15}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)')
      return false
    }
    
    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      // Check if username already exists in localStorage
      const usersJson = localStorage.getItem('users');
      const existingUsers = usersJson ? JSON.parse(usersJson) : [];
      
      const userExists = existingUsers.find(u => u.username === username);
      if (userExists) {
        setError('Username already exists');
        setLoading(false);
        return;
      }

      // Add new user to localStorage
      const newUser = {
        username,
        email,
        password, // In real app, this should be hashed
        phone,
        createdAt: new Date().toISOString()
      };
      
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Show OTP modal after successful registration
      setShowOtpModal(true);
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOtpSubmit = () => {
    // In a real app, this would verify the OTP and complete registration
    // For now, we'll just close the modal and redirect to login
    setShowOtpModal(false)
    router.push('/auth/login')
  }

  // OTP Modal Component
  const OtpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1C1F26] p-6 rounded-2xl w-full max-w-md border border-[#2A2D33]">
        <h2 className="text-xl font-bold text-white mb-4">Verify Your Phone Number</h2>
        <p className="text-[#A0A3A8] mb-4">Enter the OTP sent to your phone number</p>
        
        <div className="space-y-4">
          <div className="flex justify-between space-x-2">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-2xl border border-[#2A2D33] rounded text-white bg-[#22252D]"
                placeholder="-"
              />
            ))}
          </div>
          
          <div className="text-center text-sm text-[#A0A3A8]">
            <p>OTP sent to: {phone}</p>
            <p className="mt-2">Enter the 6-digit code received on your phone</p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              className="flex-1 bg-[#22252D] border-[#2A2D33] text-white hover:bg-[#2A2D33] rounded-lg" 
              onClick={() => setShowOtpModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#00FFAA] hover:from-[#6d32d6] hover:to-[#00e69a] text-white rounded-lg" 
              onClick={handleOtpSubmit}
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E12] p-4">
      <Card className="w-full max-w-md bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <CardDescription className="text-[#A0A3A8]">Join FitSync Web to start your wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-[#E4E6EB]">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                className="bg-[#22252D] border-[#2A2D33] text-white rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-[#E4E6EB]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="bg-[#22252D] border-[#2A2D33] text-white rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-[#E4E6EB]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className="bg-[#22252D] border-[#2A2D33] text-white rounded-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-[#E4E6EB]">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                disabled={loading}
                className="bg-[#22252D] border-[#2A2D33] text-white rounded-lg"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#00FFAA] hover:from-[#6d32d6] hover:to-[#00e69a] text-white rounded-lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#A0A3A8]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#00FFAA] font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {showOtpModal && <OtpModal />}
    </div>
  )
}