import { Box } from '@mui/material'
import { Masonry } from '@mui/lab'
import './MasonryLayout.css'

const MasonryLayout = ({ children, columns = { xs: 1, sm: 2, md: 3, lg: 4 }, spacing = 3 }) => {
  return (
    <Box sx={{ width: '100%', minHeight: 'auto' }}>
      <Masonry
        columns={columns}
        spacing={spacing}
        sx={{
          margin: 0,
          '& .MuiMasonry-root': {
            margin: 0,
          }
        }}
      >
        {children}
      </Masonry>
    </Box>
  )
}

export default MasonryLayout