import './FormField.css'
import TextField from '@mui/material/TextField'

export default function FormField({ className = '', ...props }) {
	return (
		<TextField
			className={`form-field ${className}`}
			fullWidth
			size="small"
			{...props}
		/>
	)
}

