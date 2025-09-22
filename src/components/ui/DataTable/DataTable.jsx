import './DataTable.css'
import { DataGrid } from '@mui/x-data-grid'

export default function DataTable({ rows, columns, className = '', sx = {}, ...props }) {
	return (
		<div className={`datatable ${className}`}>
			<DataGrid
				rows={rows}
				columns={columns}
				disableRowSelectionOnClick
				sx={{
					border: '1px solid var(--divider-color, rgba(0,0,0,0.12))',
					backgroundColor: 'var(--bg-surface, #fff)',
					color: 'var(--text-primary, inherit)',
					'& .MuiDataGrid-columnHeaders': {
						backgroundColor: 'var(--bg-elevated, #f7f7f7)'
					},
					...sx
				}}
				{...props}
			/>
		</div>
	)
}

