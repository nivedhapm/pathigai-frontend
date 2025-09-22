import './UserManage.css'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import iamService from '../../services/iamService'

const UserManage = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    if (!userId) return
    iamService.getUser(userId).then(data => {
      setUser(data)
      setForm({ name: data?.name || '', email: data?.email || '' })
    })
  }, [userId])

  const save = async () => {
    await iamService.updateUser(userId, form)
  }

  if (!userId) return <Typography>No user selected</Typography>

  return (
    <Box className="iam-user-manage">
      <Typography variant="h6" mb={2}>Manage User</Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Box display="flex" gap={1}>
              <Button variant="contained" onClick={save}>Save</Button>
              <Button variant="outlined" color="error" onClick={() => iamService.deleteUser(userId)}>Delete</Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserManage
