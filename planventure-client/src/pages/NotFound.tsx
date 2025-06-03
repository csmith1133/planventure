import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HFLogo = () => (
  <svg 
    width="min(18vw, 340px)" 
    height="min(18vw, 340px)" 
    viewBox="0 0 602 478" 
    fill="#96DC14" 
    style={{ 
      transform: 'translateY(-8px)',
      margin: '0 8px'
    }}
  >
    <path d="M602.5408,86.1364049 C608.10727,95.7149667 608.230029,107.517369 602.864,117.209816 C583.728916,146.965487 575.125619,182.286918 578.432,217.51708 L578.432,217.449828 C585.0144,316.101423 530.0064,419.649571 429.8912,477.94384 C329.776,536.234908 212.6432,532.808282 130.2624,478.276896 L130.2624,478.34735 C101.316151,458.033914 66.397179,448.026056 31.0944,449.925571 C20.0149295,449.789938 9.82210969,443.836493 4.25481707,434.249048 C-1.31247555,424.661603 -1.43476739,412.851374 3.9328,403.150528 C23.0618887,373.392888 31.6574056,338.071015 28.3424,302.843264 L28.3424,302.913718 C21.7952,204.262123 76.8032,100.723583 176.9184,42.4677423 C277.0336,-15.7913006 394.1664,-12.3999018 476.5472,42.1314847 C505.500072,62.4374804 540.420886,72.4403878 575.7248,70.540454 C586.779768,70.6662458 596.958609,76.5861707 602.5408,86.1364049" />
  </svg>
);

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '1rem',  // Reduced from 2rem
        bgcolor: '#fff',
        height: 'fit-content',  // Add this to prevent stretching
        mt: 12  // Add margin-top instead of large padding
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mb: 2,
        fontSize: 'min(24rem, max(6rem, 18vw))',
        fontWeight: 800,
        color: '#232323',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        padding: 0, // Remove padding
      }}>
        4<HFLogo />4
      </Box>
      <Typography variant="h4" sx={{ 
        mb: 1.5, // Reduced from 2
        color: '#666', 
        fontWeight: 600,
        fontSize: 'clamp(1.2rem, 2vw, 2.5rem)',
        padding: 1,
      }}>
        Oops! Looks like this page is on a lunch break
      </Typography>
      <Typography variant="body1" sx={{ 
        mb: 3, // Reduced from 4
        color: '#666', 
        fontSize: 'clamp(0.9rem, 1.3vw, 1.2rem)',
        padding: 1,
      }}>
        We searched high and low in our kitchen, but this page seems to have been eaten!
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/dashboard')}
        sx={{
          bgcolor: '#009646',
          '&:hover': { bgcolor: '#008840' },
          px: 'clamp(3rem, 5vw, 8rem)',
          py: .75,
          fontSize: 'clamp(1rem, 1.5vw, 2rem)',
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}
