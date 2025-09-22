import { Link } from 'react-router-dom'

export default function Unauthorized() {
	return (
		<div style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '60vh',
			padding: '2rem'
		}}>
			<div className="form-box" style={{ maxWidth: 560 }}>
				<h2 style={{ marginBottom: 12 }}>Access Restricted</h2>
				<p style={{ marginBottom: 16 }}>
					Your account does not have access to dashboard resources. If you are an applicant,
					you cannot log in to the system. Please contact your administrator for assistance.
				</p>
				<div style={{ display: 'flex', gap: 15 }}>
					<Link to="/" className="btn-secondary">Back to Home</Link>
					<Link to="/login" className="btn-primary">Go to Login</Link>
				</div>
			</div>
		</div>
	)
}
