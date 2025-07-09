import { useState } from 'react'
import { YStack, XStack, Label, Input } from 'tamagui'
import Countdown from 'components/Countdown'

const DEFAULT = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  rounds: 4,
}

export default function TabFocusScreen() {
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT.focusMinutes)
  const [shortBreakMinutes, setShortBreakMinutes] = useState(DEFAULT.shortBreakMinutes)
  const [longBreakMinutes, setLongBreakMinutes] = useState(DEFAULT.longBreakMinutes)
  const [rounds, setRounds] = useState(DEFAULT.rounds)
  const fontFamily = 'monospace'

  return (
    <YStack flex={1} items="center" justify="center" gap="$6" px="$10" pt="$5" bg="$background">
      <Countdown
        focusMinutes={focusMinutes}
        shortBreakMinutes={shortBreakMinutes}
        longBreakMinutes={longBreakMinutes}
        rounds={rounds}
        fontFamily={fontFamily}
      />
    </YStack>
  )
}