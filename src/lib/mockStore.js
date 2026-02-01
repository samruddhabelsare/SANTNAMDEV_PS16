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

  // Methods
  getPosts: () => {
    const stored = localStorage.getItem('mock_posts')
    if (!stored) {
      localStorage.setItem('mock_posts', JSON.stringify(mockStore.initialPosts))
      return mockStore.initialPosts
    }
    return JSON.parse(stored)
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
    // This is simplified, usually we'd check if request exists
    const requests = mockStore.getRequests() // In real app, this would modify 'sent' requests
    // For demo, we'll just toast success in the UI coponent
    return true
  },

  getUsers: () => {
    return mockStore.initialUsers
  }
}
