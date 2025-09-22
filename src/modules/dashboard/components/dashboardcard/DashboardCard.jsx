import { Box, Typography, IconButton } from '@mui/material'
import { MoreVertical } from 'lucide-react'
import './DashboardCard.css'

const DashboardCard = ({ 
  title, 
  children, 
  actions = null,
  height = 'auto',
  className = '',
  loading = false 
}) => {
  return (
    <Box
      className={`dashboard-card ${className}`}
      sx={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: 3,
        boxShadow: 'var(--shadow-sm)',
        height: height,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Card Header */}
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
            paddingBottom: 1,
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            {title}
          </Typography>
          
          {actions || (
            <IconButton
              size="small"
              sx={{
                color: 'var(--text-secondary)',
                '&:hover': {
                  backgroundColor: 'var(--bg-hover)'
                }
              }}
            >
              <MoreVertical size={16} />
            </IconButton>
          )}
        </Box>
      )}

      {/* Card Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: 'var(--text-secondary)'
            }}
          >
            <Typography variant="body2">Loading...</Typography>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  )
}

export default DashboardCard
