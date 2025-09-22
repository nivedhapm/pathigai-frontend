import './AlertMessage.css'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

export default function AlertMessage({ severity = 'info', title, children, onClose, dismissible = true, className = '' }) {
	const [open, setOpen] = useState(true)
	if (!open) return null
	const handleClose = () => {
		setOpen(false)
		onClose && onClose()
	}
	return (
		<Alert
			className={`alert-message ${className}`}
			severity={severity}
			action={dismissible ? (
				<IconButton size="small" color="inherit" onClick={handleClose}>
					<CloseIcon fontSize="inherit" />
				</IconButton>
			) : null}
		>
			{title && <AlertTitle>{title}</AlertTitle>}
			{children}
		</Alert>
	)
}

