import { Delete, Settings } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { createAppTheme } from '../theme'
import {
  formatDateInput,
  normalizeDateInput,
  parseDateInput,
} from '../../app/functions'
import {
  DEFAULT_EVENT_COLOR,
  MAX_LIFE_EXPECTANCY,
  MIN_LIFE_EXPECTANCY,
  useBaseContext,
} from '../../context/BaseContext'

/**
 * Positioned through sx rather than globals.css: MUI's ButtonBase sets
 * `position: relative` from a runtime stylesheet that outranks an
 * equal-specificity rule in a static file, which would drop both controls out
 * of the corners and into the flow below the calendar.
 */
const cornerControlSx = (side: 'left' | 'right') => ({
  position: 'fixed' as const,
  bottom: '0.75rem',
  [side]: '0.75rem',
  color: 'var(--ink-soft)',
  '&:hover': { color: 'var(--ink)' },
})

/**
 * A date field that shows YYYY-MM-DD regardless of browser locale, which
 * `type="date"` cannot: Chrome takes that format from the browser's own
 * language preference and ignores the element's `lang`.
 */
const DateField = ({
  label,
  value,
  onDraftChange,
  onSettle,
  size,
}: {
  label: string
  value: string
  onDraftChange: (next: string) => void
  onSettle: () => void
  size?: 'small' | 'medium'
}) => {
  const [focused, setFocused] = useState(false)
  // Only complain once they've stopped typing; a half-entered date is not yet
  // a mistake, and a field that is red from the first keystroke trains people
  // to ignore it.
  const invalid = !focused && value !== '' && parseDateInput(value) === null

  return (
    <TextField
      fullWidth
      size={size}
      label={label}
      placeholder='YYYY-MM-DD'
      InputLabelProps={{ shrink: true }}
      inputProps={{ inputMode: 'numeric' }}
      value={value}
      error={invalid}
      helperText={invalid ? 'Use YYYY-MM-DD' : undefined}
      onFocus={() => {
        setFocused(true)
      }}
      // Deliberately not reformatted keystroke by keystroke. Rewriting a
      // controlled value mid-edit renumbers the segments and throws the caret
      // to the end, and a fixed-width mask can't accept the single-digit month
      // in "2001-3-7". The value is tidied on blur instead.
      onChange={(e) => {
        onDraftChange(e.target.value)
      }}
      onBlur={() => {
        setFocused(false)
        onSettle()
      }}
    />
  )
}

export const SettingsDialog = () => {
  const {
    birthdate,
    setBirthdate,
    lifeExpectancy,
    setLifeExpectancy,
    lifeEvents,
    addLifeEvent,
    removeLifeEvent,
    isFirstVisit,
  } = useBaseContext()

  const [showSettings, setShowSettings] = useState(isFirstVisit)
  const [birthdateDraft, setBirthdateDraft] = useState(() =>
    formatDateInput(birthdate)
  )
  const [expectancyDraft, setExpectancyDraft] = useState(String(lifeExpectancy))
  const [eventDate, setEventDate] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventColor, setEventColor] = useState(DEFAULT_EVENT_COLOR)

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () => createAppTheme(prefersDark ? 'dark' : 'light'),
    [prefersDark]
  )

  useEffect(() => {
    setBirthdateDraft(formatDateInput(birthdate))
  }, [birthdate])

  useEffect(() => {
    setExpectancyDraft(String(lifeExpectancy))
  }, [lifeExpectancy])

  const settleBirthdate = () => {
    const normalized = normalizeDateInput(birthdateDraft)
    if (normalized) {
      setBirthdate(normalized)
      setBirthdateDraft(formatDateInput(normalized))
    } else if (birthdateDraft.trim() === '') {
      setBirthdateDraft(formatDateInput(birthdate))
    }
    // An unsalvageable entry is left in place rather than silently reverted,
    // so the error stays on screen instead of vanishing at the moment it
    // would have told them something.
  }

  const handleClose = () => {
    setShowSettings(false)
  }

  // Normalize rather than strict-parse, so "2010-6-15" can be added without
  // having to leave the field first.
  const parsedEventDate = normalizeDateInput(eventDate)
  const canAddEvent = parsedEventDate !== null && eventDescription.trim() !== ''

  const handleAddEvent = () => {
    if (!parsedEventDate || !canAddEvent) {
      return
    }

    addLifeEvent({
      date: parsedEventDate,
      description: eventDescription.trim(),
      color: eventColor,
    })
    setEventDate('')
    setEventDescription('')
  }

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        aria-label='Settings'
        className='corner-control'
        sx={cornerControlSx('right')}
        onClick={() => {
          setShowSettings(!showSettings)
        }}
      >
        <Settings fontSize='small' />
      </IconButton>
      <Dialog open={showSettings} onClose={handleClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent style={{ minWidth: 300 }}>
          <Grid sx={{ mt: 1 }} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DateField
                label='Birthdate'
                value={birthdateDraft}
                // Nothing is committed until the field settles. Committing per
                // keystroke would save the valid prefix of "1993-05-141"
                // before the last character arrived, so the entry would show an
                // error while having already replaced the birthdate.
                onDraftChange={setBirthdateDraft}
                onSettle={settleBirthdate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='number'
                fullWidth
                label='Life expectancy'
                value={expectancyDraft}
                onChange={(e) => {
                  setExpectancyDraft(e.target.value)
                  if (e.target.value !== '') {
                    setLifeExpectancy(Number(e.target.value))
                  }
                }}
                onBlur={() => {
                  setExpectancyDraft(String(lifeExpectancy))
                }}
                InputProps={{
                  inputProps: {
                    min: MIN_LIFE_EXPECTANCY,
                    max: MAX_LIFE_EXPECTANCY,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant='subtitle2' gutterBottom>
            Life events
          </Typography>
          <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12} sm={5}>
              <DateField
                label='Date'
                size='small'
                value={eventDate}
                onDraftChange={setEventDate}
                onSettle={() => {
                  const normalized = normalizeDateInput(eventDate)
                  if (normalized) {
                    setEventDate(formatDateInput(normalized))
                  }
                }}
              />
            </Grid>
            <Grid item xs={8} sm={5}>
              <TextField
                fullWidth
                size='small'
                label='Description'
                value={eventDescription}
                onChange={(e) => {
                  setEventDescription(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddEvent()
                  }
                }}
              />
            </Grid>
            <Grid item xs={4} sm={2}>
              <TextField
                type='color'
                fullWidth
                size='small'
                inputProps={{ 'aria-label': 'Event color' }}
                value={eventColor}
                onChange={(e) => {
                  setEventColor(e.target.value)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleAddEvent}
                disabled={!canAddEvent}
                size='small'
              >
                Add event
              </Button>
            </Grid>
          </Grid>

          {lifeEvents.length > 0 && (
            <List dense>
              {lifeEvents.map((event, i) => (
                <ListItem
                  key={`${formatDateInput(event.date)}-${i}`}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      edge='end'
                      aria-label={`Remove ${event.description}`}
                      onClick={() => {
                        removeLifeEvent(i)
                      }}
                    >
                      <Delete fontSize='small' />
                    </IconButton>
                  }
                >
                  {/* ListItemIcon rather than a bare span: it supplies the
                      gutter and vertical centring a list row needs, which the
                      .life-event-swatch rule alone doesn't. */}
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <span
                      aria-hidden='true'
                      className='life-event-swatch'
                      style={{ backgroundColor: event.color }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.description}
                    secondary={formatDateInput(event.date)}
                  />
                </ListItem>
              ))}
            </List>
          )}

          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <IconButton
        aria-label='View source on GitHub'
        className='corner-control'
        sx={cornerControlSx('left')}
        onClick={() => {
          window.open('https://github.com/shadoath/mementoMori')
        }}
      >
        <svg
          fill='currentColor'
          width='18'
          height='18'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 496 512'
        >
          <path d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z' />
        </svg>
      </IconButton>
    </ThemeProvider>
  )
}
