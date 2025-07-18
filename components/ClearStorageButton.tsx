import React from 'react'
import { Button, Text, YStack, AlertDialog } from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ClearStorageButton() {
  const [open, setOpen] = React.useState(false)

  const handleClear = async () => {
    try {
      await AsyncStorage.clear()
      console.log('Storage cleared.')
      setOpen(false)
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }

  return (
    <Button onPress={() => handleClear()}>
      Clear Storage
    </Button>
  )
}
