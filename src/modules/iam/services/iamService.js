import api from '../../../shared/services/api'

const USE_MOCK = false

const mock = {
  rolesProfiles: async () => ({
    roles: ['SUPER_ADMIN','ADMIN','MANAGER','HR','FACULTY','MENTOR','EMPLOYEE','INTERVIEW_PANELIST','TRAINEE','APPLICANT','PLACEMENT','TRAINER','MANAGEMENT'],
    profiles: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER','INTERVIEW_PANELIST','PLACEMENT','TRAINEE','APPLICANT']
  }),
  listUsers: async () => ({
    items: [],
    total: 0
  })
}

const iamService = {
  async getRolesAndProfiles() {
    if (USE_MOCK) return mock.rolesProfiles()
    return api.get('/iam/roles-profiles')
  },
  async listUsers(params = {}) {
    if (USE_MOCK) return mock.listUsers()
    const query = new URLSearchParams(params).toString()
    const url = query ? `/iam/users?${query}` : '/iam/users'
    return api.get(url)
  },
  async createUser(payload) {
    return api.post('/iam/users', payload)
  },
  async updateUser(id, payload) {
    return api.put(`/iam/users/${id}`, payload)
  },
  async softDeleteUser(id) {
    return api.delete(`/iam/users/${id}?soft=true`)
  },
  async bulkUploadUsers(file) {
    const form = new FormData()
    form.append('file', file)
    return api.post('/iam/users/bulk', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default iamService
