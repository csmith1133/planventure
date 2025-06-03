import { Box, Container, Typography } from '@mui/material';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 2, px: 2, mt: 'auto', backgroundColor: 'primary.dark' }}>
        <Typography variant="body2" color="white" align="center">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}
