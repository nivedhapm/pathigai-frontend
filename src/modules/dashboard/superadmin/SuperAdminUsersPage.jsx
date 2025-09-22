import './SuperAdminUsersPage.css'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import DataTable from '../../../components/ui/DataTable/DataTable'
import FormField from '../../../components/ui/FormField/FormField'
import ActionButton from '../../../components/ui/ActionButton/ActionButton'
import AlertMessage from '../../../components/ui/AlertMessage/AlertMessage'
import ConfirmDialog from '../../../components/ui/ConfirmDialog/ConfirmDialog'
import FileUploader from '../../../components/ui/FileUploader/FileUploader'
import useUsers from '../../iam/hooks/useUsers'
import iamService from '../../iam/services/iamService'

const roleToProfiles = {
  INTERVIEW_PANELIST: ['INTERVIEW_PANELIST'],
  APPLICANT: ['APPLICANT'],
  TRAINEE: ['TRAINEE'],
  ADMIN: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER'],
  MANAGER: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER'],
  HR: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER'],
  FACULTY: ['ADMIN','MANAGEMENT','TRAINER'],
  MENTOR: ['TRAINER'],
  EMPLOYEE: ['PLACEMENT'],
}

export default function SuperAdminUsersPage() {
  const { users, total, loading, error, setQuery, createUser, deleteUser, bulkUpload, query } = useUsers()
  const [search, setSearch] = useState('')
  const [roles, setRoles] = useState([])
  const [profiles, setProfiles] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, id: null })
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', role: '', profile: '' })
  const [formError, setFormError] = useState('')
  const [uploadInfo, setUploadInfo] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setQuery((q) => ({ ...q, query: search })), 300)
    return () => clearTimeout(t)
  }, [search, setQuery])

  useEffect(() => {
    let isMounted = true
    iamService.getRolesAndProfiles().then((res) => {
      const r = res.roles || res?.data?.roles || []
      const p = res.profiles || res?.data?.profiles || []
      if (isMounted) {
        setRoles(r)
        setProfiles(p)
      }
    })
    return () => { isMounted = false }
  }, [])

  const allowedProfilesForRole = useMemo(() => {
    if (!form.role) return []
    return roleToProfiles[form.role] || []
  }, [form.role])

  const validateForm = useCallback(() => {
    if (!form.fullName || !form.email || !form.role || !form.profile) {
      return 'Please fill all required fields.'
    }
    if (allowedProfilesForRole.length && !allowedProfilesForRole.includes(form.profile)) {
      return `Selected role must map to one of: ${allowedProfilesForRole.join(', ')}`
    }
    return ''
  }, [form, allowedProfilesForRole])

  const onSubmitCreate = async () => {
    const v = validateForm()
    if (v) { setFormError(v); return }
    setFormError('')
    await createUser({ ...form })
    setCreateOpen(false)
    setForm({ fullName: '', email: '', phone: '', role: '', profile: '' })
  }

  const onBulkFiles = async (files) => {
    const f = files?.[0]
    if (!f) return
    const res = await bulkUpload(f)
    setUploadInfo(res)
  }

  const columns = useMemo(() => ([
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 160 },
    { field: 'profile', headerName: 'Profile', width: 180 },
    {
      field: 'actions', headerName: 'Actions', sortable: false, width: 140,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setConfirm({ open: true, id: params.row.id })}>Delete</Button>
        </Stack>
      )
    }
  ]), [])

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        mb: 3 
      }}>
        User Management
      </Typography>
      
      <section className="page-section">
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField size="small" label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
          <ActionButton variant="contained" onClick={() => setCreateOpen(true)}>Create User</ActionButton>
        </Stack>

        <Card>
          <CardContent>
            {error && <AlertMessage severity="error">{error.message}</AlertMessage>}
            <div style={{ height: 520, width: '100%' }}>
              <DataTable
                rows={users || []}
                columns={columns}
                getRowId={(r) => r.id || r.email}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={total}
                pageSizeOptions={[5, 10, 20, 50]}
                paginationModel={{ page: (query.page || 1) - 1, pageSize: query.size || 10 }}
                onPaginationModelChange={({ page, pageSize }) => setQuery((q) => ({ ...q, page: page + 1, size: pageSize }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Bulk Upload</Typography>
            <FileUploader onFiles={onBulkFiles} />
            {uploadInfo && <AlertMessage severity="success" className="mt-2">Upload complete.</AlertMessage>}
          </CardContent>
        </Card>
      </section>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          {formError && <AlertMessage severity="error">{formError}</AlertMessage>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormField label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextField select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value, profile: '' })} size="small">
              {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <TextField select label="Profile" value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} size="small">
              {(allowedProfilesForRole.length ? allowedProfilesForRole : profiles).map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} color="inherit">Cancel</Button>
          <ActionButton variant="contained" onClick={onSubmitCreate}>Create</ActionButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        title="Delete user?"
        content={<Typography>Are you sure you want to delete this user?</Typography>}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={async () => { await deleteUser(confirm.id); setConfirm({ open: false, id: null }) }}
      />
    </DashboardLayout>
  )
}
