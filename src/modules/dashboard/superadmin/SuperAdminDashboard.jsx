import { Typography, Box } from '@mui/material'
import { BarChart3, Calendar, Activity, Users, TrendingUp, Clock } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardCard from '../components/DashboardCard/DashboardCard'
import MasonryLayout from '../components/MasonryLayout/MasonryLayout'
import './SuperAdminDashboard.css'

export default function SuperAdminDashboard() {
	return (
		<DashboardLayout>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" sx={{ 
					fontWeight: 600, 
					color: 'var(--text-primary)',
					mb: 1 
				}}>
					Super Admin Dashboard
				</Typography>
				<Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
					Welcome to your command center. Monitor and manage all platform activities.
				</Typography>
			</Box>

			{/* Dashboard Cards */}
			<MasonryLayout columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }} spacing={3}>

				{/* Analytics Chart - Large Card */}
				<DashboardCard title="Student Performance" className="chart-card">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '300px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<BarChart3 size={48} />
						<Typography variant="body1">Performance analytics will be displayed here</Typography>
						<Typography variant="caption">Chart integration coming soon</Typography>
					</Box>
				</DashboardCard>

				{/* Calendar Widget */}
				<DashboardCard title="Calendar">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '250px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Calendar size={48} />
						<Typography variant="body1">Calendar widget</Typography>
						<Typography variant="caption">Schedule management coming soon</Typography>
					</Box>
				</DashboardCard>

				{/* Activity Feed */}
				<DashboardCard title="Recent Activity">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '200px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Activity size={48} />
						<Typography variant="body1">Activity feed will show here</Typography>
						<Typography variant="caption">Real-time updates coming soon</Typography>
					</Box>
				</DashboardCard>

				{/* Quick Actions */}
				<DashboardCard title="Quick Actions">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '180px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Users size={48} />
						<Typography variant="body1">Quick action buttons</Typography>
						<Typography variant="caption">Shortcuts coming soon</Typography>
					</Box>
				</DashboardCard>

				{/* Additional Cards for better masonry effect */}
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
						<TrendingUp size={48} />
						<Typography variant="body1">System monitoring</Typography>
						<Typography variant="caption">Health metrics coming soon</Typography>
					</Box>
				</DashboardCard>

				<DashboardCard title="Notifications">
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						justifyContent: 'center',
						height: '160px',
						flexDirection: 'column',
						gap: 2,
						color: 'var(--text-secondary)'
					}}>
						<Clock size={48} />
						<Typography variant="body1">Latest updates</Typography>
						<Typography variant="caption">Notification center coming soon</Typography>
					</Box>
				</DashboardCard>
			</MasonryLayout>
		</DashboardLayout>
	)
}

