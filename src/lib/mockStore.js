export const mockStore = {
  // Initial Data
  initialPosts: [
    {
      id: 'mock-1',
      content: 'Just finished the new react module! 🚀 #learning #react',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      media_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      profiles: { email: 'student@iiit.ac.in', role: 'student', verification_status: 'verified' },
      user_id: 'mock-u-1'
    },
    {
      id: 'mock-2',
      content: 'Does anyone have the notes for CS201?',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      media_url: null,
      profiles: { email: 'peer@iiit.ac.in', role: 'student', verification_status: 'verified' },
      user_id: 'mock-u-2'
    }
  ],
  
  initialConnections: [
    { id: 'mock-conn-1', sender_id: 'mock-user-1', receiver_id: 'current-user', status: 'accepted', profile: { email: 'sarah@project.com', role: 'student' } }
  ],

  initialRequests: [
    { id: 'mock-req-1', sender_id: 'mock-user-2', receiver_id: 'current-user', status: 'pending', profile: { email: 'mentor@alumni.com', role: 'alumni' } }
  ],

  initialUsers: [
    { id: 'mock-u-1', email: 'alice@iiit.ac.in', role: 'student', verification_status: 'verified' },
    { id: 'mock-u-2', email: 'dr.bob@iiit.ac.in', role: 'teacher', verification_status: 'verified' },
    { id: 'mock-u-3', email: 'charlie@alum.com', role: 'alumni', verification_status: 'verified' }
  ],

  initialBulletins: [
    {
      id: "mock-b-1",
      title: "Semester End Examinations Schedule",
      content: "The final schedule for Spring 2026 examinations has been released. Please check the college website.",
      level: "college",
      created_at: new Date().toISOString(),
      profiles: { email: "registrar@iiit.ac.in", role: "admin" }
    },
    {
      id: "mock-b-2",
      title: "CSE Department Meeting",
      content: "All 3rd year CSE students are requested to attend the briefing on Major Projects.",
      level: "department",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      profiles: { email: "hod.cse@iiit.ac.in", role: "teacher" }
    },
    {
      id: "mock-b-3",
      title: "CS201 Class Canceled",
      content: "Today's DSA class is rescheduled to Saturday 10 AM.",
      level: "class",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      profiles: { email: "prof.dsa@iiit.ac.in", role: "teacher" }
    }
  ],

  initialClassrooms: [
    { 
      id: "mock-c-1", 
      name: "Computer Science 2026", 
      subject: "B.Tech CSE", 
      type: "official",
      teacher_id: "mock-t-1",
      section: "A",
      member_count: 120
    },
    { 
      id: "mock-c-2", 
      name: "Data Structures & Algo", 
      subject: "CS201", 
      type: "official",
      teacher_id: "mock-t-2",
      section: "Core",
      member_count: 65
    },
    { 
      id: "mock-c-3", 
      name: "Competitive Coding Club", 
      subject: "Extra Curricular", 
      type: "unofficial",
      teacher_id: "mock-s-1",
      section: "Club",
      member_count: 240
    }
  ],

  initialPendingUsers: [
    { id: 'mock-p-1', email: 'junior@iiit.ac.in', role: 'student', verification_status: 'pending' },
    { id: 'mock-p-2', email: 'guest.lecturer@iiit.ac.in', role: 'teacher', verification_status: 'pending' }
  ],
  
  initialMessages: [
    { sender_id: 'Sarah (Project Lead)', receiver_id: 'mock-u-1', message: 'Hey! How is the project coming along?' },
    { sender_id: 'mock-u-1', receiver_id: 'Sarah (Project Lead)', message: 'Going great! Just finishing up the UI.' },
    { sender_id: 'Sarah (Project Lead)', receiver_id: 'mock-u-1', message: 'Awesome, let me know if you need help.' }
  ],

  // Methods
  getPosts: () => {
    const stored = localStorage.getItem('mock_posts')
    if (!stored) {
      localStorage.setItem('mock_posts', JSON.stringify(mockStore.initialPosts))
      return mockStore.initialPosts
    }
    return JSON.parse(stored)
  },

  getBulletins: () => {
    return mockStore.initialBulletins
  },

  getClassrooms: () => {
    return mockStore.initialClassrooms
  },

  addPost: (post) => {
    const posts = mockStore.getPosts()
    const newPost = { ...post, id: `mock-${Date.now()}`, created_at: new Date().toISOString() }
    const updated = [newPost, ...posts]
    localStorage.setItem('mock_posts', JSON.stringify(updated))
    return updated
  },

  getConnections: () => {
    const stored = localStorage.getItem('mock_connections')
    if (!stored) {
      localStorage.setItem('mock_connections', JSON.stringify(mockStore.initialConnections))
      return mockStore.initialConnections
    }
    return JSON.parse(stored)
  },

  getRequests: () => {
    const stored = localStorage.getItem('mock_requests')
    if (!stored) {
      localStorage.setItem('mock_requests', JSON.stringify(mockStore.initialRequests))
      return mockStore.initialRequests
    }
    return JSON.parse(stored)
  },

  acceptRequest: (id) => {
    const requests = mockStore.getRequests()
    const connections = mockStore.getConnections()
    
    const request = requests.find(r => r.id === id)
    if (!request) return
    
    const newRequests = requests.filter(r => r.id !== id)
    const newConnection = { ...request, status: 'accepted', id: `mock-conn-${Date.now()}` }
    
    localStorage.setItem('mock_requests', JSON.stringify(newRequests))
    localStorage.setItem('mock_connections', JSON.stringify([...connections, newConnection]))
  },

  sendRequest: (userId) => {
    return true
  },

  getUsers: () => {
    return mockStore.initialUsers
  },

  // Admin & Chat Features
  getPendingUsers: () => {
    const stored = localStorage.getItem('mock_pending_users')
    if (!stored) {
      localStorage.setItem('mock_pending_users', JSON.stringify(mockStore.initialPendingUsers))
      return mockStore.initialPendingUsers
    }
    return JSON.parse(stored)
  },

  verifyUser: (userId) => {
    const users = mockStore.getPendingUsers()
    const updated = users.filter(u => u.id !== userId)
    localStorage.setItem('mock_pending_users', JSON.stringify(updated))
    return updated
  },

  rejectUser: (userId) => {
     // Same logic as verify for now, remove from list
    return mockStore.verifyUser(userId)
  },

  getMessages: () => {
    const stored = localStorage.getItem('mock_messages')
    if (!stored) {
      localStorage.setItem('mock_messages', JSON.stringify(mockStore.initialMessages))
      return mockStore.initialMessages
    }
    return JSON.parse(stored)
  },

  addMessage: (msg) => {
    const messages = mockStore.getMessages()
    const updated = [...messages, msg]
    localStorage.setItem('mock_messages', JSON.stringify(updated))
    return updated
  }
}
