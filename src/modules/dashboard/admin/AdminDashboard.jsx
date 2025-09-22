import { Typography, Box } from '@mui/material'
import { Users, BookOpen, Settings, Activity } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardCard from '../components/DashboardCard/DashboardCard'
import MasonryLayout from '../components/MasonryLayout/MasonryLayout'
import './AdminDashboard.css'

export default function AdminDashboard() {
	return (
		<DashboardLayout>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" sx={{ 
					fontWeight: 600, 
					color: 'var(--text-primary)',
					mb: 1 
				}}>
					Admin Dashboard
				</Typography>
				<Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
					Manage platform operations and oversee administrative tasks.
				</Typography>
			</Box>

			<MasonryLayout columns={{ xs: 1, sm: 2, md: 2, lg: 3 }} spacing={3}>
				<DashboardCard title="User Statistics">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '200px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Users size={48} />
						<Typography variant="body1">User analytics coming soon</Typography>
					</Box>
				</DashboardCard>

				<DashboardCard title="Training Programs">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '180px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<BookOpen size={48} />
						<Typography variant="body1">Program management coming soon</Typography>
					</Box>
				</DashboardCard>

				<DashboardCard title="System Health">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '220px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Activity size={48} />
						<Typography variant="body1">System monitoring coming soon</Typography>
					</Box>
				</DashboardCard>

				<DashboardCard title="Settings">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '160px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Settings size={48} />
						<Typography variant="body1">Admin settings coming soon</Typography>
					</Box>
				</DashboardCard>
			</MasonryLayout>
		</DashboardLayout>
	)
}

