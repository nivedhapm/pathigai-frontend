import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import authService from '../../shared/services/authService'

const getUserProfile = () => {
	const user = authService.getCurrentUser()
	if (user?.profile) return user.profile
	try {
		const token = authService.getAuthToken()
		if (!token) return null
		const payload = JSON.parse(atob(token.split('.')[1]))
		return payload?.profile || null
	} catch {
		return null
	}
}

export default function ProtectedRoute({ allowedProfiles }) {
	const [isChecking, setIsChecking] = useState(true)
	const [isAuthed, setIsAuthed] = useState(false)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// First check if we have a valid session without network call
				const hasSession = authService.hasValidSession()
				
				if (!hasSession) {
					console.debug('No valid session found')
					setIsAuthed(false)
					setIsChecking(false)
					return
				}

				// Initialize auth state (may trigger token refresh)
				const authResult = await authService.initializeAuth()
				console.debug('Auth initialization result:', authResult)
				
				setIsAuthed(authResult)
			} catch (error) {
				console.error('Auth check failed:', error)
				setIsAuthed(false)
			} finally {
				setIsChecking(false)
			}
		}

		checkAuth()
	}, [])

	// Show loading state while checking authentication
	if (isChecking) {
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh',
				fontSize: '16px',
				color: '#666'
			}}>
				Checking authentication...
			</div>
		)
	}

	// Redirect to login if not authenticated
	if (!isAuthed) {
		console.debug('User not authenticated, redirecting to login')
		return <Navigate to="/login" replace />
	}

	// Check profile permissions if specified
	if (allowedProfiles && allowedProfiles.length > 0) {
		const profile = getUserProfile()
		if (!profile || !allowedProfiles.includes(profile)) {
			console.debug('User profile not allowed:', { profile, allowedProfiles })
			return <Navigate to="/unauthorized" replace />
		}
	}

	return <Outlet />
}
