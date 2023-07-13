import { Settings } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useBaseContext } from '../../context/BaseContext'

export const SettingsDialog = (isOpen: boolean) => {
  const { birthdate, setBirthdate, lifeExpectancy, setLifeExpectancy } =
    useBaseContext()

  const [showSettings, setShowSettings] = useState(false)
  const handleClose = () => {
    setShowSettings(false)
  }
  return (
    <>
      <IconButton
        onClick={() => {
          setShowSettings(!showSettings)
        }}
        style={{ position: 'fixed', bottom: 0, right: 0 }}
      >
        <Settings color='secondary' />
      </IconButton>
      <Dialog open={showSettings} onClose={handleClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Grid sx={{ mt: 1 }} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type='date'
                fullWidth
                label='Birthdate'
                value={birthdate.toISOString().split('T')[0]}
                onChange={(e) => {
                  setBirthdate(new Date(e.target.value))
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='number'
                fullWidth
                label='Life expectancy'
                value={lifeExpectancy}
                onChange={(e) => {
                  setLifeExpectancy(Number(e.target.value))
                }}
                // min={1}
                // max={111}
                inputProps={{
                  min: 1,
                  max: 111,
                }}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
