// Authentication Utility Functions
import { supabase } from './supabase'

/**
 * Sign up a new user
 * @param email - User's email
 * @param password - User's password
 * @returns User data or error
 */
export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/tesseract-hall-of-heroes`
      }
    })

    if (error) throw error

    return {
      success: true,
      user: data.user,
      message: 'Sign up successful! Please check your email to verify your account.'
    }
  } catch (error: any) {
    return {
      success: false,
      user: null,
      message: error.message || 'Sign up failed'
    }
  }
}

/**
 * Sign in a user
 * @param email - User's email
 * @param password - User's password
 * @returns User data or error
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Check if user is admin
    const isAdmin = await checkIfAdmin(data.user?.id)

    return {
      success: true,
      user: data.user,
      isAdmin,
      message: 'Login successful!'
    }
  } catch (error: any) {
    return {
      success: false,
      user: null,
      isAdmin: false,
      message: error.message || 'Login failed'
    }
  }
}

/**
 * Sign out the current user
 * @returns Success status
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Logout failed'
    }
  }
}

/**
 * Get current user
 * @returns Current user data
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return {
        success: false,
        user: null,
        isAdmin: false
      }
    }

    const isAdmin = await checkIfAdmin(user.id)

    return {
      success: true,
      user,
      isAdmin
    }
  } catch {
    return {
      success: false,
      user: null,
      isAdmin: false
    }
  }
}

/**
 * Check if a user is an admin
 * @param userId - User ID to check
 * @returns Boolean indicating admin status
 */
export async function checkIfAdmin(userId?: string) {
  if (!userId) return false

  try {
    const { data, error } = await supabase
      .from('admins')
      .select('is_admin')
      .eq('user_id', userId)
      .single()

    return !error && data?.is_admin === true
  } catch {
    return false
  }
}

/**
 * Reset password for a user
 * @param email - User's email
 * @returns Success status
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/shield-tesseract-access-portal/reset-password`
    })

    if (error) throw error

    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to send reset email'
    }
  }
}

/**
 * Update user password
 * @param newPassword - New password
 * @returns Success status
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return {
      success: true,
      message: 'Password updated successfully!'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update password'
    }
  }
}

/**
 * Subscribe to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(callback: (user: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })

  return () => subscription.unsubscribe()
}
