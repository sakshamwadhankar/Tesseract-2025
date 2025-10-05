/**
 * EXAMPLE INTEGRATION COMPONENTS
 * These show how to integrate the voting backend into your existing pages
 * WITHOUT modifying your current UI/design
 * 
 * Simply import these functions/components where needed in your existing pages
 */

'use client'

import { useState } from 'react'
import { castVote } from '@/lib/voting-utils'
import { signIn, signUp, signOut } from '@/lib/auth-utils'
import { toggleProjectLock, getAdminProjectStats } from '@/lib/admin-utils'
import { useAuth, useLeaderboard, useProjects, useRealTimeVotes } from '@/hooks/useSupabase'

// ============================================
// FOR: shield-tesseract-access-portal (Login Page)
// ============================================

export function LoginHandler() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    const result = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password)
    
    setMessage(result.message)
    
    if (result.success) {
      // Redirect based on user type
      if (result.isAdmin) {
        window.location.href = '/furys-war-room-console'
      } else {
        window.location.href = '/avenger-vote-vault'
      }
    }
  }

  // Add this to your existing login form
  return {
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    setIsSignUp,
    handleAuth,
    message
  }
}

// ============================================
// FOR: avenger-vote-vault (Voting Page)
// ============================================

export function VoteHandler() {
  const { projects, loading, refresh } = useProjects()
  const { user } = useAuth()
  const [voting, setVoting] = useState(false)
  const [message, setMessage] = useState('')

  const handleVote = async (projectId: number) => {
    if (!user) {
      window.location.href = '/shield-tesseract-access-portal'
      return
    }

    setVoting(true)
    const result = await castVote(projectId)
    setMessage(result.message)
    
    if (result.success) {
      // Redirect to thank you page
      setTimeout(() => {
        window.location.href = '/tesseract-hall-of-heroes?thank=1'
      }, 1000)
    } else if (result.needsAuth) {
      window.location.href = '/shield-tesseract-access-portal'
    }
    
    setVoting(false)
    refresh() // Refresh project list
  }

  return {
    projects: projects.filter(p => p.is_unlocked), // Only show unlocked projects
    loading,
    voting,
    handleVote,
    message,
    user
  }
}

// ============================================
// FOR: tesseract-hall-of-heroes (Leaderboard)
// ============================================

export function LeaderboardHandler() {
  const { leaderboard, loading, refresh } = useLeaderboard(5000) // Auto-refresh every 5 seconds
  const voteCounts = useRealTimeVotes() // Real-time vote updates
  
  // Check for thank you message
  const showThankYou = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('thank') === '1'

  // Combine leaderboard with real-time counts
  const enhancedLeaderboard = leaderboard.map(project => ({
    ...project,
    live_votes: voteCounts[project.id] || project.vote_count || 0
  }))

  return {
    leaderboard: enhancedLeaderboard,
    loading,
    refresh,
    showThankYou
  }
}

// ============================================
// FOR: furys-war-room-console (Admin Dashboard)
// ============================================

export function AdminHandler() {
  const { user, isAdmin } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Redirect if not admin
  if (!loading && !isAdmin) {
    window.location.href = '/hydra-glitch-hax'
    return null
  }

  const loadProjects = async () => {
    setLoading(true)
    const result = await getAdminProjectStats()
    if (result.success) {
      setProjects(result.data)
    } else {
      setMessage(result.message || 'Failed to load projects')
    }
    setLoading(false)
  }

  const handleToggleLock = async (projectId: number, currentStatus: boolean) => {
    const result = await toggleProjectLock(projectId, !currentStatus)
    setMessage(result.message)
    if (result.success) {
      loadProjects() // Refresh list
    }
  }

  // Load projects on mount
  if (projects.length === 0 && !loading && isAdmin) {
    loadProjects()
  }

  return {
    projects,
    loading,
    handleToggleLock,
    message,
    isAdmin
  }
}

// ============================================
// FOR: hydra-glitch-hax (Error/Denied Page)
// ============================================

export function AccessDeniedHandler() {
  const { user, isAdmin } = useAuth()
  
  const handleRedirect = () => {
    if (!user) {
      window.location.href = '/shield-tesseract-access-portal'
    } else if (isAdmin) {
      window.location.href = '/furys-war-room-console'
    } else {
      window.location.href = '/avenger-vote-vault'
    }
  }

  return {
    user,
    isAdmin,
    handleRedirect
  }
}

// ============================================
// UTILITY: Add to any page header for user info
// ============================================

export function UserStatusBar() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '1rem',
      background: 'rgba(0,0,0,0.8)',
      color: '#0ea5e9',
      borderRadius: '0 0 0 12px',
      fontSize: '0.875rem',
      zIndex: 9999
    }}>
      {user ? (
        <>
          <span>Welcome, {user.email}</span>
          {isAdmin && <span style={{ marginLeft: '0.5rem', color: '#fbbf24' }}>⭐ Admin</span>}
          <button 
            onClick={() => signOut().then(() => window.location.href = '/')}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.75rem',
              background: '#ef4444',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <a href="/shield-tesseract-access-portal" style={{ color: '#0ea5e9' }}>Login</a>
      )}
    </div>
  )
}
