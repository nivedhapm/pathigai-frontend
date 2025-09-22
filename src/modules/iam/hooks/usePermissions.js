export default function usePermissions() {
	const validateRoleProfile = (role, profile) => {
		if (!role || !profile) return false

		const fixed = {
			INTERVIEW_PANELIST: ['INTERVIEW_PANELIST'],
			APPLICANT: ['APPLICANT'],
			TRAINEE: ['TRAINEE']
		}
		if (fixed[role] && fixed[role].includes(profile)) return true

		const flexibleMap = {
			ADMIN: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER'],
			MANAGER: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER'],
			HR: ['SUPER_ADMIN','ADMIN','MANAGEMENT','TRAINER'],
			FACULTY: ['ADMIN','MANAGEMENT','TRAINER'],
			MENTOR: ['TRAINER'],
			EMPLOYEE: ['PLACEMENT']
		}
		return (flexibleMap[role] || []).includes(profile)
	}

	return { validateRoleProfile }
}

