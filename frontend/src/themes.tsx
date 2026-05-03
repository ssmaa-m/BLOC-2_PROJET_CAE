import { createTheme } from '@mui/material/styles';
import { ZoomTransition } from './components/ZoomTransition';
import { Check, ChevronDown, Xmark } from '@gravity-ui/icons';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { SafeCalendarIcon } from './components/SafeCalendarIcon';

declare module '@mui/material/styles' {
  interface TypeBackground {
    s0: string;
    s1: string;
    s2: string;
    s3: string;
    s4: string;
  }
  interface PaletteColor {
    secondary?: string;
  }
  interface SimplePaletteColorOptions {
    secondary?: string;
  }
  interface BreakpointOverrides {
    desktop: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsSizeOverrides {
    large: true;
    'extra-large': true;
  }
  interface ChipPropsVariantOverrides {
    active: true;
    text: true;
  }
  interface ChipPropsColorOverrides {
    inverse: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    text: true;
    'text-alt': true;
  }
}

declare module '@mui/material/Alert' {
  interface AlertPropsSizeOverrides {
    small: true;
  }
}

declare module '@mui/material/Alert' {
  interface AlertProps {
    size?: 'small' | 'medium' | 'large' | string;
    align?: 'left' | 'center' | 'right' | string;
  }
}

const surfaceLevels = {
  s0: '#050505',
  s1: '#0E0E0E',
  s2: '#161616',
  s3: '#1C1C1C',
  s4: '#262626',
};

const primaryColor = '#0088F6';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      desktop: 1152,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CE59B',
    },
    warning: {
      main: '#F5B664',
    },
    error: {
      main: '#EF7D7D',
      secondary: '#DF3C3D',
    },
    divider: '#303030',
    background: {
      ...surfaceLevels,
      default: surfaceLevels.s0,
      paper: surfaceLevels.s1,
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8C8C8C',
    },
  },
  typography: {
    fontFamily: [
      '"Google Sans"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.8125rem',
      lineHeight: '3.375rem',
      fontWeight: '500',
    },
    h2: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      letterSpacing: '0',
      fontWeight: '500',
    },
    h3: {
      fontSize: '1.375rem',
      lineHeight: '1.75rem',
      letterSpacing: '0',
      fontWeight: '500',
    },
    h4: {
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
      letterSpacing: '0.15%',
      fontWeight: '500',
    },
    h5: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      letterSpacing: '0.1%',
      fontWeight: '500',
    },
    h6: {
      fontSize: '0.6875rem',
      lineHeight: '1rem',
      letterSpacing: '0.5%',
      fontWeight: '500',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      letterSpacing: '0.25%',
      fontWeight: 'normal',
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0.25%',
      fontWeight: 'normal',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none',
          color: '#FFFFFF',
          fontSize: '0.875rem',
          lineHeight: 'calc(1.25 * 0.875rem)',
          fontWeight: 500,
          '& .MuiFormLabel-asterisk': {
            color: '#DF3C3D',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {},
      variants: [
        {
          props: { color: 'primary' },
          style: {
            color: '#FFFFFF',
          },
        },
        {
          props: { color: 'secondary' },
          style: {
            color: '#8C8C8C',
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          textTransform: 'none',
          fontWeight: '700',
          boxShadow: 'none',
          height: '2rem',
          padding: '0 1rem',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          color: '#FFFFFF',
          '&:hover': {
            background: `color-mix(in srgb, ${primaryColor} 60%, #FFFFFF 40%)`,
          },
          '&:active': {
            background: `color-mix(in srgb, ${primaryColor} 40%, #FFFFFF 60%)`,
          },
        },
        containedSecondary: {
          backgroundColor: surfaceLevels.s3,
          color: '#FFFFFF',
          '&:hover': {
            background: `color-mix(in srgb, ${surfaceLevels.s3} 92%, #FFFFFF 8%)`,
          },
          '&:active': {
            background: `color-mix(in srgb, ${surfaceLevels.s3} 88%, #FFFFFF 12%)`,
          },
        },
        text: {
          color: '#FFFFFF',
          '&:hover': {
            background: 'color-mix(in srgb, #FFFFFF 8%, transparent)',
          },
          '&:active': {
            background: 'color-mix(in srgb, #FFFFFF 12%, transparent)',
          },
        },
        sizeSmall: {
          height: '1.75rem',
          padding: '0 0.75rem',
        },
        startIcon: {
          marginRight: '0.25rem',
          marginLeft: '-0.25rem',
        },
        endIcon: {
          marginLeft: '0.25rem',
          marginRight: '-0.25rem',
        },
      },
    },
    MuiChip: {
      defaultProps: {
        deleteIcon: <Xmark width="0.75rem" height="0.75rem" />,
      },
      styleOverrides: {
        root: {
          background: surfaceLevels.s3,
          width: 'fit-content',
          textTransform: 'none',
          fontWeight: '600',
          fontSize: '0.875rem',
          borderRadius: '0.5rem',
          flexShrink: 0,
          '& .MuiChip-label': {
            padding: '0',
          },
        },
        sizeMedium: {
          height: '1.75rem',
          borderRadius: '100rem',
          padding: '0 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.5rem',
          '& .MuiSvgIcon-root': {
            width: '1rem',
            height: '1rem',
            marginRight: '0.25rem',
          },
        },
        sizeSmall: {
          height: '1.5rem',
          borderRadius: '100rem',
          padding: '0 0.75rem',
          fontSize: '0.6875rem',
          lineHeight: '1.5rem',
          '& .MuiSvgIcon-root': {
            width: '0.75rem',
            height: '0.75rem',
            marginRight: '0.125rem',
          },
        },
        deleteIcon: {
          width: '1.125rem',
          height: '1.125rem',
          marginLeft: '0.5rem',
          marginRight: '-0.25rem',
          color: '#8C8C8C',
          '&:hover': {
            color: '#FFFFFF',
          },
        },
        avatar: {
          width: '1.5rem',
          height: '1.5rem',
          marginLeft: '-0.25rem',
          marginRight: '0.5rem',
        },
        icon: {
          width: '1.5rem',
          height: '1.5rem',
          marginLeft: '-0.25rem',
          marginRight: '0.5rem',
          color: '#FFFFFF',
        },
        colorPrimary: {
          background: `color-mix(in srgb, ${primaryColor} 10%, ${surfaceLevels.s3})`,
          color: primaryColor,
        },
        colorSuccess: {
          background: `color-mix(in srgb, #4CE59B 10%, ${surfaceLevels.s3})`,
          color: '#4CE59B',
        },
        colorWarning: {
          background: `color-mix(in srgb, #F5B664 10%, ${surfaceLevels.s3})`,
          color: '#F5B664',
        },
        colorSecondary: {
          background: `color-mix(in srgb, #8C8C8C 10%, ${surfaceLevels.s3})`,
          color: '#8C8C8C',
        },
      },
      variants: [
        {
          props: { size: 'large' },
          style: {
            height: '2.75rem',
            borderRadius: '0.75rem',
            padding: '0 0.75rem',
          },
        },
        {
          props: { size: 'extra-large' },
          style: {
            height: '3rem',
            borderRadius: '0.75rem',
            padding: '0 1rem',
          },
        },
        {
          props: { variant: 'active' },
          style: {
            border: `2px solid ${primaryColor}`,
            color: primaryColor + ' !important',
          },
        },
        {
          props: { color: 'inverse' },
          style: {
            background: '#FFFFFF',
            color: '#050505',
            '& .MuiSvgIcon-root': {
              color: '#050505',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            padding: '0 0.5rem',
            background: 'none',
            color: '#FFFFFF',
            '& .MuiSvgIcon-root': {
              color: '#FFFFFF',
            },
          },
        },
      ],
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          height: '100%',
          '& .MuiTabs-list': {
            height: '100%',
          },
          '& .MuiTabs-flexContainer': {
            height: '100%',
          },
        },
        indicator: {
          backgroundColor: '#FFFFFF',
          height: '2px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: '0 1rem',
          minWidth: '0',
          height: '100%',
          color: '#FFFFFF',
          fontWeight: '600',
          fontSize: '1rem',
          textTransform: 'none',
          disableRipple: true,
          '&.Mui-selected': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'medium',
        color: 'text',
      },
      styleOverrides: {
        sizeLarge: {
          width: '5rem',
          height: '3rem',
          borderRadius: '0.25rem',
        },
        sizeMedium: {
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: '1.125rem',
        },
        sizeSmall: {
          width: '2rem',
          height: '2rem',
          borderRadius: '0.75rem',
        },
        colorPrimary: {
          color: '#FFFFFF',
          background: surfaceLevels.s3,
          '&:hover': {
            background: `color-mix(in srgb, ${surfaceLevels.s3} 92%, #FFFFFF 8%)`,
          },
          '&:active': {
            background: `color-mix(in srgb, ${surfaceLevels.s3} 88%, #FFFFFF 12%)`,
          },
        },
        colorSecondary: {
          color: '#FFFFFF',
          background: surfaceLevels.s3,
          transition: 'opacity .2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: `color-mix(in srgb, ${surfaceLevels.s3} 92%, #FFFFFF 8%)`,
          },
          '&:active': {
            background: `color-mix(in srgb, ${surfaceLevels.s3} 88%, #FFFFFF 12%)`,
          },
          '&:disabled': {
            opacity: 0.5,
            background: surfaceLevels.s3,
          },
        },
      },
      variants: [
        {
          props: { color: 'text' },
          style: {
            color: '#FFFFFF',
            '&:hover': {
              background: 'color-mix(in srgb, #FFFFFF 8%, transparent)',
            },
            '&:active': {
              background: 'color-mix(in srgb, #FFFFFF 12%, transparent)',
            },
          },
        },
        {
          props: { color: 'text-alt' },
          style: {
            color: '#8C8C8C',
            '&:hover': {
              background: 'color-mix(in srgb, #FFFFFF 8%, transparent)',
              color: '#FFFFFF',
            },
            '&:active': {
              background: 'color-mix(in srgb, #FFFFFF 12%, transparent)',
              color: '#FFFFFF',
            },
          },
        },
        {
          props: { size: 'small', color: 'secondary' },
          style: {
            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem',
            },
          },
        },
      ],
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          border: '1px solid #303030 !important',
          '& .MuiSvgIcon-root': {
            color: '#8C8C8C',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          '& input::placeholder': {
            color: '#8C8C8C',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          fontSize: '0.75rem',
          margin: '0.375rem 0.25rem 0',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          position: 'relative',
          '& .MuiButtonBase-root': {
            color: '#8C8C8C',
            height: '2rem',
            width: '2rem',
            marginRight: '-0.375rem',
          },
          '& .MuiInputBase-root': {
            borderRadius: '0.75rem',
            backgroundColor: surfaceLevels.s3,
          },
          '& .MuiInputBase-input': {
            height: '2.25rem',
            padding: '0 0.75rem',
            fontWeight: 'Medium',
            fontSize: '0.875rem',
            color: '#FFFFFF',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderColor: primaryColor,
            borderWidth: '0',
            borderStyle: 'solid',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderWidth: '2px',
            },
          '& input::placeholder': {
            color: '#8C8C8C',
            opacity: 0.75,
          },
          '& textarea': {
            lineHeight: '1.25rem',
            padding: '0 0.75rem !important',
            fontSize: '1rem',
            color: '#FFFFFF',
            '&::placeholder': {
              color: '#8C8C8C',
              opacity: 0.75,
            },
          },
          '& .MuiInputBase-multiline': {
            padding: '0.5rem 0',
          },
          '& input[type="password"]': {
            fontFamily: 'monospace',
            letterSpacing: '0.25rem',
            '&::placeholder': {
              letterSpacing: '0.25%',
              fontFamily: [
                '"Google Sans"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
              ].join(','),
            },
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: '#8C8C8C',
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },
      styleOverrides: {
        root: {
          backgroundColor: surfaceLevels.s3,
        },
        wave: {
          '&::after': {
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.5, 1)',
          },
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        TransitionComponent: ZoomTransition,
      },
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            borderRadius: '1.5rem',
            background: surfaceLevels.s1,
            backgroundImage: 'none',
            // width: '25rem',
            maxWidth: '25rem',
            // border: '1px solid #303030',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '2rem 1rem 0.25rem',
          textAlign: 'center',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '1rem',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '1rem',
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        clearIcon: <Xmark />,
        popupIcon: <ChevronDown />,
        ChipProps: {
          deleteIcon: <Xmark />,
        },
      },
      styleOverrides: {
        root: {
          '&.Mui-focused:has(.MuiChip-root) .MuiAutocomplete-input:not(:placeholder-shown)':
            {
              minWidth: '5rem !important',
              padding: '0 0.25rem !important',
            },
          '&:has(.MuiChip-root) .MuiOutlinedInput-root': {
            paddingLeft: '0.625rem',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            backgroundColor: surfaceLevels.s3,
            padding: '0.5rem 2.5rem 0.5rem 0.75rem',
            minHeight: '2.25rem',
            flexWrap: 'wrap',
            gap: '0.375rem',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '2px solid',
              borderColor: primaryColor,
            },
            '& .MuiAutocomplete-input': {
              padding: '0 !important',
              height: '1.25rem',
              fontSize: '0.875rem',
              color: '#FFFFFF',
              boxSizing: 'border-box',
              minWidth: '0',
              flex: 1,
            },
            '& .MuiChip-root': {
              margin: 0,
              width: 'fit-content',
              height: '1.25rem',
              borderRadius: '100rem',
              padding: '0 0.5rem',
              background: surfaceLevels.s4,
              color: '#FFFFFF',
              gap: '0.25rem',
              pointerEvents: 'none',
              '& .MuiChip-avatar': {
                marginRight: 0,
                width: '1rem',
                height: '1rem',
              },
              '& .MuiChip-deleteIconSmall': {
                width: '0.75rem',
                height: '0.75rem',
                marginRight: '-0.25rem',
                marginLeft: '0',
                pointerEvents: 'auto',
                cursor: 'pointer',
              },
            },
          },
          '& .MuiButtonBase-root': {
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '0.5rem',
          },
          '& .MuiAutocomplete-endAdornment': {
            minWidth: '2rem',
            width: 'fit-content',
            top: '50%',
            right: '0.125rem !important',
            transform: 'translateY(-50%)',
            '& .MuiButtonBase-root': {
              borderRadius: '100rem',
              '&:last-child': {
                marginRight: '0',
                color: '#8C8C8C',
              },
            },
          },
        },
        popper: {
          '&[data-popper-placement*="bottom"] .MuiAutocomplete-paper': {
            marginTop: '0.375rem',
          },
          '&[data-popper-placement*="top"] .MuiAutocomplete-paper': {
            marginBottom: '0.375rem',
          },
        },
        paper: {
          borderRadius: '1.25rem',
          backgroundColor: surfaceLevels.s2,
          border: '1px solid #303030',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backgroundImage: 'none',
        },
        listbox: {
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          '& .MuiAutocomplete-option': {
            borderRadius: '0.75rem',
            padding: '0.25rem 0.5rem',
            minHeight: '2.5rem',
            '&[aria-selected="true"]': {
              background: 'none',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M13.3333 4L5.99999 11.3333L2.66666 8' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              },
            },
            '&.Mui-focused, &.Mui-focusVisible, &[aria-selected="true"].Mui-focused, &[aria-selected="true"].Mui-focusVisible':
              {
                backgroundColor: surfaceLevels.s3,
              },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '1rem',
          backgroundColor: surfaceLevels.s2,
          border: '1px solid #303030',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backgroundImage: 'none',
          margin: '0.375rem',
        },
        list: {
          padding: '0.375rem',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          gap: '0.625rem',
          borderRadius: '0.5rem',
          padding: '0.375rem 0.75rem',
          minHeight: '2.25rem',
          backgroundColor: 'transparent',
          transition: 'background-color 0.2s',
          '&:hover, &.Mui-focusVisible, &.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: surfaceLevels.s3,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '0.5rem 4.25rem 0.5rem 1.5rem',
        },
      },
    },
    MuiListItemSecondaryAction: {
      styleOverrides: {
        root: {
          right: '1.5rem',
          color: '#FFFFFF',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          padding: '0 0.25rem',
          width: 'fit-content',
          height: 'fit-content',
          minWidth: '0.875rem',
          minHeight: '0.875rem',
          lineHeight: '0.875rem',
          fontSize: '0.6875rem',
          fontWeight: 'bold',
        },
      },
      variants: [
        {
          props: { overlap: 'circular' },
          style: {
            '& .MuiBadge-badge': {
              top: '12.5%',
              right: '12.5%',
            },
          },
        },
      ],
    },
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          success: <Check />,
        },
      },
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          alignItems: 'center',
          fontSize: '0.75rem',
          lineHeight: '1.15rem',
          letterSpacing: '0.1%',
          fontWeight: 'medium',
        },
        action: {
          padding: '0 0 0 1rem',
        },
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            padding: '0 1rem',
            marginBottom: '-1rem',
          },
        },
        {
          props: { align: 'center' },
          style: {
            justifyContent: 'center',
            '& .MuiAlert-message': {
              textAlign: 'center',
            },
          },
        },
      ],
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: '0.375rem',
          '& .MuiSwitch-track': {
            borderRadius: '100rem',
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
        icon: <span className="custom-checkbox" />,
        checkedIcon: (
          <span className="custom-checkbox custom-checkbox--checked">
            <Check />
          </span>
        ),
      },
      styleOverrides: {
        root: {
          padding: '0.375rem',
          '& .custom-checkbox': {
            width: '16px',
            height: '16px',
            border: '2px solid #303030',
            borderRadius: '0.25rem',
            backgroundColor: 'transparent',
            transition: 'all 0.15s ease',
            position: 'relative',
          },
          '& .custom-checkbox--checked': {
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            '& svg': {
              minWidth: '16px',
              minHeight: '16px',
              display: 'block',
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: surfaceLevels.s1,
          color: '#FFFFFF',
          borderRadius: '1.5rem',
          padding: '0.25rem 0.75rem',
          border: '1px solid',
          borderColor: '#252525',
        },
        arrow: {
          color: '#252525',
        },
      },
    },
    MuiDatePicker: {
      defaultProps: {
        slots: { openPickerIcon: SafeCalendarIcon },
        sx: (theme) => ({
          '& .MuiPickersSectionList-root': {
            height: '2.25rem',
            padding: '0',
            alignItems: 'center',
          },
          '& .MuiPickersInputBase-root': {
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            letterSpacing: '0.25%',
            backgroundColor: theme.palette.background.s3,
          },
          '& .MuiPickersOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiButtonBase-root': {
            width: '2rem',
            height: '2rem',
            color: theme.palette.text.secondary,
          },
          '& .MuiInputAdornment-root': {
            '& svg': {
              fontSize: '1rem',
            },
          },
        }),
      },
    },
    MuiDateTimePicker: {
      defaultProps: {
        slots: { openPickerIcon: SafeCalendarIcon },
        sx: (theme) => ({
          '& .MuiPickersSectionList-root': {
            height: '2.25rem',
            padding: '0',
            alignItems: 'center',
          },
          '& .MuiPickersInputBase-root': {
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            letterSpacing: '0.25%',
            backgroundColor: theme.palette.background.s3,
          },
          '& .MuiPickersOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiButtonBase-root': {
            width: '2rem',
            height: '2rem',
            color: theme.palette.text.secondary,
          },
          '& .MuiInputAdornment-root': {
            '& svg': {
              fontSize: '1rem',
            },
          },
        }),
      },
    },
  },
});

export const ModalScrollSx = {
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2rem',
    zIndex: 10,
    background: `linear-gradient(to bottom, ${theme.palette.background.s1}, transparent)`,
    pointerEvents: 'none',
    opacity: 0,
  },
  '&[data-scrollTop="true"]::before': {
    opacity: 1,
  },
  '&::after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2rem',
    zIndex: 10,
    background: `linear-gradient(to top, ${theme.palette.background.s1}, transparent)`,
    pointerEvents: 'none',
    opacity: 0,
  },
  '&[data-scrollBottom="true"]::after': {
    opacity: 1,
  },
};
