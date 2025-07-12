import { useState } from 'react'
import { YStack, Button, XStack } from 'tamagui'
import Countdown from 'components/Countdown'
import MusicSheet from 'components/MusicSheet'
import ThemeSheet from 'components/ThemeSheet'
import { Music, Paintbrush, Settings2 } from '@tamagui/lucide-icons'
import TimerSettingSheet from 'components/TimerSettingSheet'

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
  const [focusMusic, setFocusMusic] = useState(DEFAULT.focusMusic)
  const [breakMusic, setBreakMusic] = useState(DEFAULT.breakMusic)

  const [musicOpen, setMusicOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [timerSettingOpen, setTimerSettingOpen] = useState(false)

  return (
    <>
      <XStack pt="$9" bg="$background" position="absolute" z={10} r={0}>
        <Button circular bg="transparent" onPress={() => setMusicOpen(true)}><Music /></Button>
        <Button circular bg="transparent" onPress={() => setThemeOpen(true)}><Paintbrush /></Button>
        <Button circular bg="transparent" onPress={() => setTimerSettingOpen(true)} mr="$4"><Settings2 /></Button>
      </XStack>
      <YStack flex={1} items="center" justify="center" gap="$6" pt="$10" bg="$background">
        <Countdown
          focusMinutes={focusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          rounds={rounds}
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
        />
        <TimerSettingSheet 
          open={timerSettingOpen}
          onOpenChange={setTimerSettingOpen}
          focusMinutes={focusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          rounds={rounds}
          setFocusMinutes={setFocusMinutes}
          setShortBreakMinutes={setShortBreakMinutes}
          setLongBreakMinutes={setLongBreakMinutes}
          setRounds={setRounds}
        />
      </YStack>
    </>

  )
}