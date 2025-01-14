const theme = {
  // Layout
  layout: {
    // Note: media queries can't be used with CSS variables
    // TODO: this is a placeholder - will review BPs with UX
    breakpoints: {
      lg: '48em'
    }
  },
  // Generic
  colors: {
    textPrimary: 'var(--colors-text-primary)',
    textSecondary: 'var(--colors-text-secondary)',
    textTertiary: 'var(--colors-text-tertiary)',
    bgPrimary: 'var(--colors-bg-primary)',
    warn: `var(--colors-shared-red)`
  },
  font: {
    primary: 'var(--fonts-primary)'
  },
  fontWeight: {
    light: 'var(--font-weights-light)',
    book: 'var(--font-weights-book)',
    medium: 'var(--font-weights-medium)',
    semibold: 'var(--font-weights-semibold)',
    bold: 'var(--font-weights-bold)',
    extrabold: 'var(--font-weights-extrabold)'
  },
  text: {
    xs: 'var(--text-xs)',
    s: 'var(--text-s)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    xl2: 'var(--text-2xl)',
    xl3: 'var(--text-3xl)',
    xl4: 'var(--text-4xl)',
    xl5: 'var(--text-5xl)',
    xl6: 'var(--text-6xl)'
  },
  lineHeight: {
    base: 'var(--line-height-base)',
    s: 'var(--line-height-s)',
    lg: 'var(--line-height-lg)',
    xl: 'var(--line-height-xl)'
  },
  spacing: {
    spacing0: 'var(--spacing-0)',
    spacing1: 'var(--spacing-1)',
    spacing2: 'var(--spacing-2)',
    spacing3: 'var(--spacing-3)',
    spacing4: 'var(--spacing-4)',
    spacing5: 'var(--spacing-5)',
    spacing6: 'var(--spacing-6)',
    spacing8: 'var(--spacing-8)',
    spacing10: 'var(--spacing-10)',
    spacing12: 'var(--spacing-12)',
    spacing28: 'var(--spacing-28)'
  },
  rounded: {
    sm: 'var(--rounded-sm)',
    rg: 'var(--rounded-rg)',
    md: 'var(--rounded-md)',
    lg: 'var(--rounded-lg)',
    xl: 'var(--rounded-xl)',
    full: 'var(--rounded-full)'
  },
  border: {
    default: '1px solid var(--colors-border)'
  },
  outline: {
    default: '2px solid var(--colors-border)'
  },
  boxShadow: {
    default: 'var(--box-shadow-default)'
  },
  // Components
  input: {
    color: 'var(--colors-input-text)',
    background: 'var(--colors-input-background)',
    default: {
      border: '1px solid var(--colors-input-default-border)'
    },
    hover: {
      border: '1px solid var(--colors-input-hover-border)'
    },
    focus: {
      border: '1px solid var(--colors-input-focus-border)',
      boxShadow: '0 0 0 1px var(--colors-input-focus-border)'
    },
    error: {
      color: 'var(--colors-error-dark)',
      border: '1px solid var(--colors-error-dark)'
    },
    disabled: {
      color: 'var(--colors-input-disabled-text)',
      border: '1px solid var(--colors-input-disabled-border)'
    },
    helperText: {
      error: {
        color: 'var(--colors-error-dark)'
      }
    },
    small: {
      text: 'var(--text-s)'
    },
    medium: {
      text: 'var(--text-base)'
    },
    large: {
      text: 'var(--text-5xl)'
    },
    overflow: {
      large: {
        text: 'var(--text-2xl)',
        height: '4.6875rem'
      }
    }
  },
  card: {
    bg: 'var(--colors-card-bg)',
    secondaryBg: 'var(--colors-card-secondary-bg)'
  },
  cta: {
    primary: {
      bg: 'var(--colors-cta-primary)',
      bgHover: 'var(--colors-cta-primary-hover)',
      text: 'var(--colors-cta-primary-text)'
    },
    secondary: {
      bg: 'var(--colors-cta-secondary)',
      text: 'var(--colors-cta-secondary-text)'
    },
    outlined: {
      text: 'var(--colors-cta-outlined-text)',
      border: '1px solid var(--colors-cta-outlined-border)',
      bgHover: 'var(--colors-cta-outlined-hover)'
    },
    text: {
      text: 'var(--colors-cta-text-text)',
      bgHover: 'var(--colors-cta-text-hover)'
    },
    small: {
      padding: 'var(--spacing-2)',
      text: 'var(--text-xs)',
      lineHeight: 'var(--line-height-s)'
    },
    medium: {
      padding: 'var(--spacing-3) var(--spacing-10)',
      text: 'var(--text-base)',
      lineHeight: 'var(--line-height-base)'
    },
    large: {
      padding: 'var(--spacing-4) var(--spacing-12)',
      text: 'var(--text-lg)',
      lineHeight: 'var(--line-height-lg)'
    }
  },
  table: {
    border: '1px solid var(--colors-table-border)',
    header: {
      bg: 'var(--color-table-header-row-bg)'
    },
    row: {
      odd: {
        bg: 'var(--colors-table-odd-row-bg)'
      },
      even: {
        bg: 'var(--colors-table-even-row-bg)'
      },
      bgHover: 'var(--colors-table-row-hover-bg)'
    }
  },
  alert: {
    status: {
      error: 'var(--colors-error)',
      warning: 'var(--colors-warning)',
      success: 'var(--colors-success-darker)'
    },
    bg: {
      error: 'var(--colors-error-20)',
      warning: 'var(--colors-warning-light-20)',
      success: 'var(--colors-success-20)'
    }
  },
  transition: {
    default: 'var(--transitions-default)',
    duration: {
      duration100: 100,
      duration150: 150,
      duration250: 250
    }
  },
  tabs: {
    bg: 'var(--colors-tabs-bg)',
    color: 'var(--colors-tabs-text)',
    active: {
      color: 'var(--colors-tabs-active-color)',
      bg: 'var(--colors-tabs-active-bg)'
    },
    border: '1px solid var(--colors-border)',
    small: {
      wrapper: {
        padding: 'var(--spacing-1) var(--spacing-2)'
      },
      tab: {
        padding: 'var(--spacing-1) var(--spacing-4)',
        text: 'var(--text-xs)',
        fontWeight: 'var(--font-weights-book)'
      },
      selection: {
        padding: 'var(--spacing-1)'
      }
    },
    medium: {
      wrapper: {
        padding: 'var(--spacing-1) var(--spacing-2)'
      },
      tab: {
        padding: 'var(--spacing-2) var(--spacing-6)',
        text: 'var(--text-s)',
        fontWeight: 'var(--font-weights-book)'
      },
      selection: {
        padding: 'var(--spacing-1)'
      }
    },
    large: {
      wrapper: {
        padding: 'var(--spacing-2) var(--spacing-3)'
      },
      tab: {
        padding: 'var(--spacing-3) var(--spacing-8)',
        text: 'var(--text-base)',
        fontWeight: 'var(--font-weights-medium)'
      },
      selection: {
        padding: 'var(--spacing-2)'
      }
    }
  },
  meter: {
    bar: {
      status: {
        error: 'var(--colors-meter-bar-error-color)',
        warning: 'var(--colors-meter-bar-warning-color)',
        success: 'var(--colors-meter-bar-success-color)'
      },
      primary: {
        bg: `linear-gradient(270deg, 
          var(--colors-meter-bar-success-color) 0%, 
          var(--colors-meter-bar-warning-color) 50%, 
          var(--colors-meter-bar-error-color) 100%)`
      },
      secondary: {
        bg: 'var(--colors-neutral-lighter-grey)'
      },
      height: '10px',
      radius: 'var(--rounded-full)',
      indicator: {
        border: {
          left: '8px solid transparent',
          right: '8px solid transparent',
          bottom: '8px solid var(--colors-meter-bar-indicator-color)'
        },
        color: 'var(--colors-meter-bar-indicator-color)',
        primary: {
          marginTop: '12px'
        },
        secondary: {
          marginTop: '4px'
        }
      },
      separator: {
        color: 'var(--colors-meter-bar-separator-color)'
      }
    }
  },
  spinner: {
    determinate: {
      color: 'var(--colors-cta-primary)',
      bg: 'var(--colors-cta-secondary)'
    },
    indeterminate: {
      primary: {
        color: 'var(--colors-indeterminate-primary-color)',
        bg: 'var(--colors-indeterminate-primary-bg)'
      },
      secondary: {
        color: 'var(--colors-indeterminate-secondary-color)',
        bg: 'var(--colors-indeterminate-secondary-bg)'
      },
      outlined: {
        color: 'var(--colors-indeterminate-outlined-color)',
        bg: 'var(--colors-indeterminate-outlined-bg)'
      },
      text: {
        color: 'var(--colors-indeterminate-outlined-color)',
        bg: 'var(--colors-indeterminate-outlined-bg)'
      }
    }
  },
  progress: {
    circle: {
      mask: 'var(--color-progress-circle-mask)',
      fill: 'var(--color-progress-circle-fill)'
    }
  },
  overlay: {
    placement: {
      transform: '6px'
    },
    bg: 'var(--colors-neutral-black-30)'
  },
  transaction: {
    status: {
      color: {
        error: 'var(--colors-error)',
        warning: 'var(--colors-warning-light)',
        success: 'var(--colors-success)'
      },
      bg: {
        error: 'var(--colors-error-20)',
        warning: 'var(--colors-warning-light-20)',
        success: 'var(--colors-success-20)'
      }
    }
  },
  coinIcon: {
    small: {
      width: '2.625rem'
    },
    medium: {
      width: '3.755rem'
    },
    large: {
      width: '5.625rem'
    }
  },
  modal: {
    maxWidth: '32rem',
    maxHeight: 'calc(100vh - var(--spacing-12))',
    zIndex: 2,
    underlay: {
      zIndex: 1,
      bg: 'var(--colors-neutral-black-60)'
    }
  },
  switch: {
    unchecked: {
      bg: 'var(--colors-switch-unchecked-bg)'
    },
    checked: {
      bg: 'var(--colors-switch-checked-bg)'
    },
    indicator: {
      bg: 'var(--colors-switch-indicator-bg)'
    }
  },
  tooltip: {
    bg: 'var(--colors-tooltip-bg)',
    offset: '3px',
    tip: {
      bg: 'var(--colors-tooltip-tip-bg)',
      width: '5px'
    }
  },
  divider: {
    bg: 'var(--colors-border)'
  }
};

type ComponentLibraryTheme = typeof theme;

export { theme };
export type { ComponentLibraryTheme };
