import { useState } from 'react'
import { YStack, Button, XStack } from 'tamagui'
import Countdown from 'components/Countdown'
import MusicSheet from 'components/MusicSheet'
import ThemeSheet from 'components/ThemeSheet'
import { Music, Paintbrush } from '@tamagui/lucide-icons'

const DEFAULT = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  rounds: 4,
  fontFamily: 'monospace',
  focusMusic: null,
  breakMusic: null,
}

export default function TabFocusScreen() {
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT.focusMinutes)
  const [shortBreakMinutes, setShortBreakMinutes] = useState(DEFAULT.shortBreakMinutes)
  const [longBreakMinutes, setLongBreakMinutes] = useState(DEFAULT.longBreakMinutes)
  const [rounds, setRounds] = useState(DEFAULT.rounds)
  const [fontFamily, setFontFamily] = useState(DEFAULT.fontFamily)
  const [focusMusic, setFocusMusic] = useState(DEFAULT.focusMusic)
  const [breakMusic, setBreakMusic] = useState(DEFAULT.breakMusic)

  const [musicOpen, setMusicOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)

  return (
    <>
      <XStack pt="$9" bg="$background" position="absolute" z={10} r={0}>
        <Button circular mr="$2" onPress={() => setMusicOpen(true)}><Music /></Button>
        <Button circular mr="$4" onPress={() => setThemeOpen(true)}><Paintbrush /></Button>
      </XStack>
      <YStack flex={1} items="center" justify="center" gap="$6" pt="$10" bg="$background">
        <Countdown
          focusMinutes={focusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          rounds={rounds}
          fontFamily={fontFamily}
          focusMusic={focusMusic}
          breakMusic={breakMusic}
        />
        <MusicSheet
          open={musicOpen}
          onOpenChange={setMusicOpen}
          focusMusic={focusMusic}
          breakMusic={breakMusic}
          setFocusMusic={setFocusMusic}
          setBreakMusic={setBreakMusic}
        />
        <ThemeSheet
          open={themeOpen}
          onOpenChange={setThemeOpen}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
        />
      </YStack>
    </>

  )
}