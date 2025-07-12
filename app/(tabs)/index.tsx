import { useState, useEffect } from 'react'
import { YStack, Button, XStack, Paragraph } from 'tamagui'
import Countdown from 'components/Countdown'
import MusicSheet from 'components/MusicSheet'
import ThemeSheet from 'components/ThemeSheet'
import { Music, Paintbrush, Settings2 } from '@tamagui/lucide-icons'
import TimerSettingSheet from 'components/TimerSettingSheet'
import { LiquidGauge } from 'react-native-liquid-gauge'

import { useWindowDimensions } from 'react-native'

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

  const [progress, setProgress] = useState(0)
  const { width, height } = useWindowDimensions()

  return (
    <>
      {/* Liquid Gauge Background */}
      <YStack
        bg="$background"
        items="center"
        justify="center"
        z={-2}
        height={height}
        width={width}
        position="absolute"
      >
          <LiquidGauge
            height={height+70}
            width={height+70}
            value={progress * 100}
            config={{
              minValue: 0,
              maxValue: 100,
              circleThickness: 0,
              circleFillGap: 0,
              circleColor: 'transparent',
              waveHeight: 0.04,
              waveCount: 3,
              waveRiseTime: 2000,
              waveAnimateTime: 5000,
              waveRise: true,
              waveHeightScaling: true,
              waveAnimate: true,
              waveColor: 'rgba(0, 63, 188, 0.59)',
              waveOffset: 0.2,
              textVertPosition: 0.5,
              textSize: 0,
              valueCountUp: false,
              textSuffix: '',
              textColor: 'white',
              waveTextColor: 'white',
              toFixed: 0,
            }}
          />
      </YStack>

      {/* Rest of the UI on top of the Liquid Gauge */}
      <XStack pt="$9" bg="transparent" position="absolute" r={0}>
        <Button circular bg="transparent" onPress={() => setMusicOpen(true)}><Music /></Button>
        <Button circular bg="transparent" onPress={() => setThemeOpen(true)}><Paintbrush /></Button>
        <Button circular bg="transparent" onPress={() => setTimerSettingOpen(true)} mr="$4"><Settings2 /></Button>
      </XStack>

      <YStack flex={1} items="center" justify="center" gap="$6" bg="transparent">
        <Countdown
          focusMinutes={focusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          rounds={rounds}
          focusMusic={focusMusic}
          breakMusic={breakMusic}
          onProgressChange={setProgress}
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
