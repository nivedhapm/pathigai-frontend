import { useCallback, useEffect, useMemo, useState } from 'react'
import iamService from '../../iam/services/iamService'

export default function useUsers(initialQuery = {}) {
	const [users, setUsers] = useState([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [query, setQuery] = useState({ page: 1, size: 10, ...initialQuery })

	const fetchUsers = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await iamService.listUsers(query)
			setUsers(res.items || res.data || [])
			setTotal(res.total || 0)
		} catch (e) {
			setError(e)
		} finally {
			setLoading(false)
		}
	}, [query])

	useEffect(() => { fetchUsers() }, [fetchUsers])

	const createUser = useCallback(async (payload) => {
		await iamService.createUser(payload)
		await fetchUsers()
	}, [fetchUsers])

	const updateUser = useCallback(async (id, payload) => {
		await iamService.updateUser(id, payload)
		await fetchUsers()
	}, [fetchUsers])

	const deleteUser = useCallback(async (id) => {
		await iamService.softDeleteUser(id)
		await fetchUsers()
	}, [fetchUsers])

	const bulkUpload = useCallback(async (file) => {
		await iamService.bulkUploadUsers(file)
		await fetchUsers()
	}, [fetchUsers])

	const state = useMemo(() => ({ users, total, loading, error, query }), [users, total, loading, error, query])

	return { ...state, setQuery, fetchUsers, createUser, updateUser, deleteUser, bulkUpload }
}

