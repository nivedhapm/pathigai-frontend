import { useEffect, useState } from 'react'
import iamService from '../../iam/services/iamService'

export default function useRoles() {
	const [roles, setRoles] = useState([])
	const [profiles, setProfiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		let mounted = true
		setLoading(true)
		iamService.getRolesAndProfiles()
			.then(res => {
				if (!mounted) return
				setRoles(res.roles || [])
				setProfiles(res.profiles || [])
			})
			.catch(err => { if (mounted) setError(err) })
			.finally(() => { if (mounted) setLoading(false) })
		return () => { mounted = false }
	}, [])

	return { roles, profiles, loading, error }
}

