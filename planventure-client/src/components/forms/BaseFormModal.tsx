import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface BaseFormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  formId: string;
  showOverlay: boolean;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;  // Add new prop
  subtitle?: string;  // Optional subtitle
  children: ReactNode;
}

export function BaseFormModal({
  open,
  onClose,
  title,
  formId,
  showOverlay,
  submitting,
  onSubmit,
  resetForm,  // Add to destructuring
  subtitle,
  children
}: BaseFormModalProps) {
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open}
      onClose={handleClose}  // Update to use new handler
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',  // Prevent dialog level scroll
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: 'grey.400',  // Override blue outline
            },
            '&:hover fieldset': {
              borderColor: 'grey.400',  // Override hover outline
            }
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: 'grey.700'  // Override blue label
          },
          // Updated autofill styles
          '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
            '-webkit-box-shadow': 'none',
            '-webkit-text-fill-color': '#000',
            'transition': 'background-color 5000s ease-in-out 0s',
            'background-color': 'transparent !important'
          }
        }
      }}
    >
      {/* Success overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#009646',
          transform: showOverlay ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 1s ease-in-out',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          color: 'white',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Helvetica Neue", sans-serif',
          lineHeight: 1.2
        }}
      >
        {title}<br />Submitted!
      </div>
      
      <DialogTitle>
        {title}
        {subtitle && (
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 1,
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 400 
            }}
          >
            {subtitle}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent 
        dividers 
        sx={{ 
          p: 3,
          overflowY: 'auto',
          flex: '1 1 auto',
          borderBottom: 'none',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
          '&:active::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <form id={formId} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {children}
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ 
        p: 0,
        m: 0,
        display: 'flex',  // Changed from grid to flex
        position: 'relative',
        borderTop: 'none',
        '& .MuiButton-root': {
          flex: 1,  // Make buttons take equal space
          m: 0,    // Remove margin
          p: 2,    // Add padding
          '&:focus': {
            outline: 'none'  // Remove focus outline
          }
        }
      }}>
        <Button 
          type="button"
          onClick={handleClose}  // Update to use new handler
          sx={{ 
            fontSize: '0.875rem',
            border: 'none',
            borderRadius: 0,
            bgcolor: 'grey.300',
            color: '#232323',
            justifyContent: 'flex-start',
            fontWeight: 'bold',     // <--- add this line
            pl: 4,
            '&:focus': {
              outline: 'none'
            },
            '&:hover': {
              bgcolor: 'grey.300'
            }
          }}
        >
          CANCEL
        </Button>
        <Button 
          type="submit"
          form={formId}
          variant="contained"
          disabled={submitting}
          sx={{ 
            fontSize: '0.875rem',
            border: 'none',
            borderRadius: 0,
            fontWeight: 'bold',  // <--- add this line
            bgcolor: '#009646',
            justifyContent: 'flex-end',
            pr: 4,
            '&:focus': {
              outline: 'none'
            },
            '&:hover': {
              bgcolor: '#009646'
            }
          }}
        >
          {submitting ? 'Submitting...' : 'SUBMIT'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
