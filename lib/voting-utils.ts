// Voting System Utility Functions
import { supabase, supabaseAdmin } from './supabase'

/**
 * Cast a vote for a project
 * @param projectId - The ID of the project to vote for
 * @returns Success status and message
 */
export async function castVote(projectId: number) {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        message: "Please login first",
        needsAuth: true
      }
    }

    // Submit the vote
    const { error } = await supabase
      .from('votes')
      .insert({ 
        user_id: user.id, 
        project_id: projectId 
      })

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          message: "You have already voted for this project!"
        }
      }
      return {
        success: false,
        message: `Error submitting vote: ${error.message}`
      }
    }

    return {
      success: true,
      message: "Vote submitted successfully!"
    }
  } catch (error) {
    console.error('Vote casting error:', error)
    return {
      success: false,
      message: "An unexpected error occurred"
    }
  }
}

/**
 * Get voting statistics and leaderboard
 * @returns Leaderboard data with project names and vote counts
 */
export async function getLeaderboard() {
  try {
    // Get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')

    if (projectsError) throw projectsError

    // Get vote counts
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('project_id')

    if (votesError) throw votesError

    // Count votes per project
    const voteCounts: { [key: number]: number } = {}
    votes?.forEach(vote => {
      voteCounts[vote.project_id] = (voteCounts[vote.project_id] || 0) + 1
    })

    // Combine project data with vote counts
    const leaderboard = projects?.map(project => ({
      ...project,
      vote_count: voteCounts[project.id] || 0
    }))
    .sort((a, b) => b.vote_count - a.vote_count)

    return {
      success: true,
      data: leaderboard
    }
  } catch (error) {
    console.error('Leaderboard error:', error)
    return {
      success: false,
      data: [],
      error: 'Failed to load leaderboard'
    }
  }
}

/**
 * Check if a user has already voted for a project
 * @param projectId - The project ID to check
 * @returns Boolean indicating if user has voted
 */
export async function hasUserVoted(projectId: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}

/**
 * Get all projects with voting status for current user
 * @returns Projects with voting status
 */
export async function getProjectsWithVoteStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')

    if (projectsError) throw projectsError

    if (!user) {
      return {
        success: true,
        data: projects?.map(p => ({ ...p, has_voted: false }))
      }
    }

    // Get user's votes
    const { data: userVotes } = await supabase
      .from('votes')
      .select('project_id')
      .eq('user_id', user.id)

    const votedProjects = new Set(userVotes?.map(v => v.project_id))

    const projectsWithStatus = projects?.map(project => ({
      ...project,
      has_voted: votedProjects.has(project.id)
    }))

    return {
      success: true,
      data: projectsWithStatus
    }
  } catch (error) {
    console.error('Projects fetch error:', error)
    return {
      success: false,
      data: [],
      error: 'Failed to load projects'
    }
  }
}

/**
 * Get real-time vote count for a specific project
 * @param projectId - The project ID
 * @returns Vote count
 */
export async function getProjectVoteCount(projectId: number) {
  try {
    const { count, error } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Vote count error:', error)
    return 0
  }
}
