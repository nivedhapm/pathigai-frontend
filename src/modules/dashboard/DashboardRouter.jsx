import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../shared/services/authService'

const routeByProfile = (profile) => {
	switch (profile) {
		case 'SUPER_ADMIN':
			return '/dashboard/superadmin'
		case 'ADMIN':
			return '/dashboard/admin'
		case 'MANAGEMENT':
			return '/dashboard/management'
		case 'TRAINER':
			return '/dashboard/trainer'
		case 'INTERVIEW_PANELIST':
			return '/dashboard/interview-panelist'
		case 'PLACEMENT':
			return '/dashboard/placement'
		case 'TRAINEE':
			return '/dashboard/trainee'
		case 'APPLICANT':
			return '/unauthorized'
		default:
			return '/unauthorized'
	}
}

export default function DashboardRouter() {
	const navigate = useNavigate()

	const normalizeProfile = (raw) => {
		if (!raw) return undefined
		let v = String(raw).toUpperCase().trim()
		if (v.startsWith('ROLE_')) v = v.slice(5)
		// Map common synonyms/roles to profiles
		const map = {
			ADMINISTRATION: 'ADMIN',
			MANAGER: 'MANAGEMENT',
			HR: 'MANAGEMENT',
			FACULTY: 'TRAINER',
			MENTOR: 'TRAINER',
			EMPLOYEE: 'PLACEMENT'
		}
		return map[v] || v
	}

	useEffect(() => {
		const checkAuthAndRoute = async () => {
			const token = authService.getAuthToken()
			const refreshToken = authService.getRefreshToken()
			
			if (!token && !refreshToken) {
				console.log('No tokens found, redirecting to login')
				navigate('/login', { replace: true })
				return
			}

			// If we have tokens, check if we need to refresh
			let isAuthenticated = false
			
			try {
				// Initialize auth state (handles token refresh if needed)
				isAuthenticated = await authService.initializeAuth()
				console.log('Dashboard auth check result:', isAuthenticated)
			} catch (error) {
				console.error('Dashboard auth initialization failed:', error)
				isAuthenticated = false
			}
			
			if (!isAuthenticated) {
				console.log('Authentication failed, redirecting to login')
				navigate('/login', { replace: true })
				return
			}

			// Get updated token after potential refresh
			const currentToken = authService.getAuthToken()
			
			// Resolve profile: from stored user first, then JWT claims
			const user = authService.getCurrentUser()
			let profile = normalizeProfile(user?.profile)
			
			if (!profile && currentToken) {
				try {
					const payload = JSON.parse(atob(currentToken.split('.')[1]))
					profile = normalizeProfile(
						payload?.profile || payload?.primary_profile || payload?.role || 
						(Array.isArray(payload?.authorities) ? payload.authorities[0] : undefined)
					)
					console.log('Profile from JWT:', profile)
				} catch (e) {
					console.warn('Failed to parse JWT for profile', e)
				}
			}

			const route = routeByProfile(profile)
			console.log('Routing to:', route, 'for profile:', profile)
			navigate(route, { replace: true })
		}

		checkAuthAndRoute()
	}, [navigate])

	return null
}
