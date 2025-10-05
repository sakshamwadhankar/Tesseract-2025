// Admin Utility Functions
import { supabase, supabaseAdmin } from './supabase'
import { checkIfAdmin } from './auth-utils'

/**
 * Toggle project lock status (admin only)
 * @param projectId - Project ID to toggle
 * @param isUnlocked - New lock status
 * @returns Success status
 */
export async function toggleProjectLock(projectId: number, isUnlocked: boolean) {
  try {
    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await checkIfAdmin(user.id))) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      }
    }

    // Update project lock status
    const { error } = await supabase
      .from('projects')
      .update({ is_unlocked: isUnlocked })
      .eq('id', projectId)

    if (error) throw error

    return {
      success: true,
      message: `Project ${isUnlocked ? 'unlocked' : 'locked'} successfully!`
    }
  } catch (error: any) {
    console.error('Project lock toggle error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update project'
    }
  }
}

/**
 * Get all projects with voting statistics (admin view)
 * @returns Projects with detailed stats
 */
export async function getAdminProjectStats() {
  try {
    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await checkIfAdmin(user.id))) {
      return {
        success: false,
        data: [],
        message: 'Unauthorized: Admin access required'
      }
    }

    // Get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('id')

    if (projectsError) throw projectsError

    // Get all votes
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('*')

    if (votesError) throw votesError

    // Calculate statistics for each project
    const projectStats = projects?.map(project => {
      const projectVotes = votes?.filter(v => v.project_id === project.id) || []
      
      return {
        ...project,
        total_votes: projectVotes.length,
        unique_voters: new Set(projectVotes.map(v => v.user_id)).size,
        last_vote: projectVotes.length > 0 
          ? Math.max(...projectVotes.map(v => new Date(v.created_at).getTime()))
          : null
      }
    })

    return {
      success: true,
      data: projectStats || []
    }
  } catch (error: any) {
    console.error('Admin stats error:', error)
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to load statistics'
    }
  }
}

/**
 * Add a new project (admin only)
 * @param teamName - Name of the team
 * @param projectUrl - URL of the project
 * @returns Success status and project data
 */
export async function addProject(teamName: string, projectUrl: string) {
  try {
    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await checkIfAdmin(user.id))) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      }
    }

    // Insert new project
    const { data, error } = await supabase
      .from('projects')
      .insert({ 
        team_name: teamName, 
        project_url: projectUrl,
        is_unlocked: false 
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data,
      message: 'Project added successfully!'
    }
  } catch (error: any) {
    console.error('Add project error:', error)
    return {
      success: false,
      message: error.message || 'Failed to add project'
    }
  }
}

/**
 * Delete a project (admin only)
 * @param projectId - Project ID to delete
 * @returns Success status
 */
export async function deleteProject(projectId: number) {
  try {
    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await checkIfAdmin(user.id))) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      }
    }

    // Delete project (votes will cascade delete)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) throw error

    return {
      success: true,
      message: 'Project deleted successfully!'
    }
  } catch (error: any) {
    console.error('Delete project error:', error)
    return {
      success: false,
      message: error.message || 'Failed to delete project'
    }
  }
}

/**
 * Get voting activity log (admin only)
 * @param limit - Number of recent votes to fetch
 * @returns Recent voting activity
 */
export async function getVotingActivity(limit: number = 50) {
  try {
    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await checkIfAdmin(user.id))) {
      return {
        success: false,
        data: [],
        message: 'Unauthorized: Admin access required'
      }
    }

    // Get recent votes with project details
    const { data, error } = await supabase
      .from('votes')
      .select(`
        *,
        projects:project_id (
          team_name,
          project_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Voting activity error:', error)
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to load activity'
    }
  }
}

/**
 * Make a user an admin (requires service role key)
 * @param userEmail - Email of the user to make admin
 * @returns Success status
 */
export async function makeUserAdmin(userEmail: string) {
  try {
    // Get user by email using admin client
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (userError) throw userError

    const user = users.users.find(u => u.email === userEmail)
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    // Add to admins table
    const { error } = await supabaseAdmin
      .from('admins')
      .upsert({ 
        user_id: user.id, 
        is_admin: true 
      })

    if (error) throw error

    return {
      success: true,
      message: `${userEmail} is now an admin!`
    }
  } catch (error: any) {
    console.error('Make admin error:', error)
    return {
      success: false,
      message: error.message || 'Failed to grant admin access'
    }
  }
}

/**
 * Remove admin privileges from a user
 * @param userId - User ID to remove admin from
 * @returns Success status
 */
export async function removeAdmin(userId: string) {
  try {
    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await checkIfAdmin(user.id))) {
      return {
        success: false,
        message: 'Unauthorized: Admin access required'
      }
    }

    // Prevent removing own admin status
    if (user.id === userId) {
      return {
        success: false,
        message: 'Cannot remove your own admin status'
      }
    }

    // Remove from admins table
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    return {
      success: true,
      message: 'Admin privileges removed successfully!'
    }
  } catch (error: any) {
    console.error('Remove admin error:', error)
    return {
      success: false,
      message: error.message || 'Failed to remove admin'
    }
  }
}
