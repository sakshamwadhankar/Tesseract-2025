/**
 * QUICK INTEGRATION SCRIPT
 * Add this to your existing HTML pages to connect backend without changing UI
 * Just add: <script src="/scripts/quick-integrate.js"></script>
 */

// Import Supabase from CDN (add this to your HTML head)
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

// Initialize Supabase
const SUPABASE_URL = 'https://lwyxcndmbpotaegbzswh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXhjbmRtYnBvdGFlZ2J6c3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTUzNTAsImV4cCI6MjA3NTEzMTM1MH0.r3M_CMzMxo8r5R3B_DQzNnMcYDfKrNwCIQuyRoHYX7Y'

let supabaseClient;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.supabase !== 'undefined') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    initializePage()
  } else {
    console.error('Supabase not loaded. Add Supabase CDN script to your HTML.')
  }
})

// ============================================
// UNIVERSAL FUNCTIONS (All Pages)
// ============================================

async function getCurrentUser() {
  if (!supabaseClient) return null
  const { data: { user } } = await supabaseClient.auth.getUser()
  return user
}

async function checkIfAdmin(userId) {
  if (!supabaseClient || !userId) return false
  const { data } = await supabaseClient
    .from('admins')
    .select('is_admin')
    .eq('user_id', userId)
    .single()
  return data?.is_admin === true
}

// ============================================
// PAGE-SPECIFIC INITIALIZATION
// ============================================

function initializePage() {
  const currentPath = window.location.pathname

  // Login Page
  if (currentPath.includes('shield-tesseract-access-portal')) {
    initLoginPage()
  }
  // Voting Page
  else if (currentPath.includes('avenger-vote-vault')) {
    initVotingPage()
  }
  // Leaderboard Page
  else if (currentPath.includes('tesseract-hall-of-heroes')) {
    initLeaderboardPage()
  }
  // Admin Dashboard
  else if (currentPath.includes('furys-war-room-console')) {
    initAdminPage()
  }
  // Error Page
  else if (currentPath.includes('hydra-glitch-hax')) {
    initErrorPage()
  }
}

// ============================================
// LOGIN PAGE INTEGRATION
// ============================================

function initLoginPage() {
  // Attach to existing login button (modify selector as needed)
  const loginBtn = document.querySelector('#loginBtn, .login-btn, button[type="submit"]')
  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault()
      
      // Get values from existing inputs (modify selectors as needed)
      const email = document.querySelector('input[type="email"], #email')?.value
      const password = document.querySelector('input[type="password"], #password')?.value
      
      if (!email || !password) {
        alert('Please enter email and password')
        return
      }

      // Sign in
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        alert('Login failed: ' + error.message)
      } else {
        // Check if admin
        const isAdmin = await checkIfAdmin(data.user.id)
        
        // Redirect based on user type
        if (isAdmin) {
          window.location.href = '/furys-war-room-console'
        } else {
          window.location.href = '/avenger-vote-vault'
        }
      }
    })
  }

  // Add sign-up functionality
  const signupBtn = document.querySelector('#signupBtn, .signup-btn')
  if (signupBtn) {
    signupBtn.addEventListener('click', async (e) => {
      e.preventDefault()
      
      const email = document.querySelector('input[type="email"], #email')?.value
      const password = document.querySelector('input[type="password"], #password')?.value
      
      const { error } = await supabaseClient.auth.signUp({
        email,
        password
      })

      if (error) {
        alert('Sign up failed: ' + error.message)
      } else {
        alert('Sign up successful! Check your email to verify your account.')
      }
    })
  }
}

// ============================================
// VOTING PAGE INTEGRATION
// ============================================

async function initVotingPage() {
  // Check authentication
  const user = await getCurrentUser()
  if (!user) {
    window.location.href = '/shield-tesseract-access-portal'
    return
  }

  // Load projects
  const { data: projects } = await supabaseClient
    .from('projects')
    .select('*')
    .eq('is_unlocked', true)

  // Get user's existing votes
  const { data: userVotes } = await supabaseClient
    .from('votes')
    .select('project_id')
    .eq('user_id', user.id)

  const votedProjects = new Set(userVotes?.map(v => v.project_id))

  // Attach vote handlers to existing buttons
  document.querySelectorAll('.vote-btn, [data-vote], button[onclick*="vote"]').forEach((btn, index) => {
    // Assume project ID is index + 1 or from data attribute
    const projectId = btn.dataset.projectId || (projects?.[index]?.id) || (index + 1)
    
    // Disable if already voted
    if (votedProjects.has(parseInt(projectId))) {
      btn.disabled = true
      btn.textContent = 'Already Voted'
      btn.style.opacity = '0.5'
    }

    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      
      // Submit vote
      const { error } = await supabaseClient
        .from('votes')
        .insert({ 
          user_id: user.id, 
          project_id: projectId 
        })

      if (error) {
        if (error.code === '23505') {
          alert('You have already voted for this project!')
        } else {
          alert('Vote failed: ' + error.message)
        }
      } else {
        // Redirect to thank you page
        window.location.href = '/tesseract-hall-of-heroes?thank=1'
      }
    })
  })
}

// ============================================
// LEADERBOARD PAGE INTEGRATION
// ============================================

async function initLeaderboardPage() {
  // Show thank you message if coming from voting
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('thank') === '1') {
    const thankYouDiv = document.createElement('div')
    thankYouDiv.innerHTML = `
      <div style="
        padding: 20px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border: 2px solid #0ea5e9;
        border-radius: 12px;
        text-align: center;
        margin: 20px auto;
        max-width: 600px;
        box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
        animation: glow 2s ease-in-out infinite;
      ">
        <h2 style="color: #0ea5e9; margin: 0;">✅ Thank You For Your Vote!</h2>
        <p style="color: #94a3b8; margin-top: 10px;">Your vote has been recorded successfully.</p>
      </div>
    `
    document.body.insertBefore(thankYouDiv, document.body.firstChild)
  }

  // Load and display leaderboard
  async function loadLeaderboard() {
    // Get all projects
    const { data: projects } = await supabaseClient
      .from('projects')
      .select('*')

    // Get all votes
    const { data: votes } = await supabaseClient
      .from('votes')
      .select('project_id')

    // Count votes
    const voteCounts = {}
    votes?.forEach(v => {
      voteCounts[v.project_id] = (voteCounts[v.project_id] || 0) + 1
    })

    // Create leaderboard
    const leaderboard = projects?.map(p => ({
      ...p,
      votes: voteCounts[p.id] || 0
    })).sort((a, b) => b.votes - a.votes)

    // Update existing leaderboard display (modify selector as needed)
    const leaderboardContainer = document.querySelector('.leaderboard, #leaderboard, [data-leaderboard]')
    if (leaderboardContainer && leaderboard) {
      // Update vote counts in existing elements
      leaderboard.forEach((project, index) => {
        const voteElement = document.querySelector(`.vote-count-${index + 1}, [data-votes="${index + 1}"]`)
        if (voteElement) {
          voteElement.textContent = project.votes
        }
      })
    }
  }

  // Initial load
  loadLeaderboard()

  // Refresh every 5 seconds
  setInterval(loadLeaderboard, 5000)

  // Subscribe to real-time updates
  supabaseClient
    .channel('votes_channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'votes' },
      loadLeaderboard
    )
    .subscribe()
}

// ============================================
// ADMIN PAGE INTEGRATION
// ============================================

async function initAdminPage() {
  // Check admin authentication
  const user = await getCurrentUser()
  const isAdmin = user ? await checkIfAdmin(user.id) : false

  if (!isAdmin) {
    window.location.href = '/hydra-glitch-hax'
    return
  }

  // Load projects with stats
  async function loadAdminProjects() {
    const { data: projects } = await supabaseClient
      .from('projects')
      .select('*')

    // Get vote counts
    const { data: votes } = await supabaseClient
      .from('votes')
      .select('project_id')

    const voteCounts = {}
    votes?.forEach(v => {
      voteCounts[v.project_id] = (voteCounts[v.project_id] || 0) + 1
    })

    // Display projects (modify selectors as needed)
    projects?.forEach((project, index) => {
      // Find toggle button for this project
      const toggleBtn = document.querySelector(`#toggle-${project.id}, [data-project="${project.id}"], .toggle-btn:nth-child(${index + 1})`)
      
      if (toggleBtn) {
        toggleBtn.dataset.projectId = project.id
        toggleBtn.dataset.unlocked = project.is_unlocked
        toggleBtn.textContent = project.is_unlocked ? 'Lock' : 'Unlock'
        
        toggleBtn.addEventListener('click', async () => {
          const { error } = await supabaseClient
            .from('projects')
            .update({ is_unlocked: !project.is_unlocked })
            .eq('id', project.id)

          if (error) {
            alert('Failed to update project: ' + error.message)
          } else {
            alert(`Project ${!project.is_unlocked ? 'unlocked' : 'locked'} successfully!`)
            loadAdminProjects() // Refresh
          }
        })
      }

      // Update vote count display
      const voteDisplay = document.querySelector(`#votes-${project.id}, [data-vote-count="${project.id}"]`)
      if (voteDisplay) {
        voteDisplay.textContent = voteCounts[project.id] || 0
      }
    })
  }

  // Initial load
  loadAdminProjects()

  // Add logout button
  const logoutBtn = document.querySelector('#logout, .logout-btn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut()
      window.location.href = '/'
    })
  }
}

// ============================================
// ERROR PAGE INTEGRATION
// ============================================

function initErrorPage() {
  // Add redirect button
  const redirectBtn = document.querySelector('.redirect-btn, #redirect, button')
  if (redirectBtn) {
    redirectBtn.addEventListener('click', async () => {
      const user = await getCurrentUser()
      
      if (!user) {
        window.location.href = '/shield-tesseract-access-portal'
      } else {
        const isAdmin = await checkIfAdmin(user.id)
        if (isAdmin) {
          window.location.href = '/furys-war-room-console'
        } else {
          window.location.href = '/avenger-vote-vault'
        }
      }
    })
  }
}

// ============================================
// ADD CSS ANIMATIONS (Optional)
// ============================================

const style = document.createElement('style')
style.textContent = `
  @keyframes glow {
    0%, 100% { box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3); }
    50% { box-shadow: 0 4px 30px rgba(6, 182, 212, 0.6); }
  }
`
document.head.appendChild(style)
