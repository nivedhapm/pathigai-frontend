import './ActionButton.css'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export default function ActionButton({ loading = false, children, className = '', disabled, ...props }) {
	return (
		<Button
			className={`action-button ${className}`}
			disabled={disabled || loading}
			{...props}
		>
			{loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
			{children}
		</Button>
	)
}

