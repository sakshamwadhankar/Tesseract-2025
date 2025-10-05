'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, onAuthStateChange } from '@/lib/auth-utils'
import { getLeaderboard, getProjectsWithVoteStatus } from '@/lib/voting-utils'

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(({ user, isAdmin }) => {
      setUser(user)
      setIsAdmin(isAdmin)
      setLoading(false)
    })

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)
      if (user) {
        const { isAdmin } = await getCurrentUser()
        setIsAdmin(isAdmin)
      } else {
        setIsAdmin(false)
      }
    })

    return unsubscribe
  }, [])

  return { user, isAdmin, loading }
}

/**
 * Hook to manage voting leaderboard
 */
export function useLeaderboard(refreshInterval?: number) {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = async () => {
    const result = await getLeaderboard()
    if (result.success) {
      setLeaderboard(result.data || [])
      setError(null)
    } else {
      setError(result.error || 'Failed to load leaderboard')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()

    // Set up refresh interval if specified
    if (refreshInterval) {
      const interval = setInterval(fetchLeaderboard, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  return { leaderboard, loading, error, refresh: fetchLeaderboard }
}

/**
 * Hook to manage projects with vote status
 */
export function useProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    const result = await getProjectsWithVoteStatus()
    if (result.success) {
      setProjects(result.data || [])
      setError(null)
    } else {
      setError(result.error || 'Failed to load projects')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        fetchProjects
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        fetchProjects
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { projects, loading, error, refresh: fetchProjects }
}

/**
 * Hook for real-time vote counts
 */
export function useRealTimeVotes(projectId?: number) {
  const [voteCounts, setVoteCounts] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    const fetchVoteCounts = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('project_id')
        
      if (!error && data) {
        const counts: { [key: number]: number } = {}
        data.forEach(vote => {
          counts[vote.project_id] = (counts[vote.project_id] || 0) + 1
        })
        setVoteCounts(counts)
      }
    }

    fetchVoteCounts()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('votes_realtime')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'votes',
          ...(projectId ? { filter: `project_id=eq.${projectId}` } : {})
        },
        fetchVoteCounts
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [projectId])

  return voteCounts
}
