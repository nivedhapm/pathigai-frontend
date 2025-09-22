import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

export default function ConfirmDialog({ open, title = 'Confirm', content, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
	return (
		<Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			{content && <DialogContent>{content}</DialogContent>}
			<DialogActions>
				<Button onClick={onCancel} color="inherit">{cancelText}</Button>
				<Button onClick={onConfirm} variant="contained" color="primary">{confirmText}</Button>
			</DialogActions>
		</Dialog>
	)
}

