import { useState } from 'react'
import { Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { ChartSpline, Music, Paintbrush, Timer } from '@tamagui/lucide-icons'
import MusicSheet from 'components/MusicSheet'
import ThemeSheet from 'components/ThemeSheet'

export default function TabLayout() {
  const theme = useTheme()

  const [musicOpen, setMusicOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [fontFamily, setFontFamily] = useState('monospace')
  const [focusMusic, setFocusMusic] = useState(null)
  const [breakMusic, setBreakMusic] = useState(null)

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.red10.val,
          tabBarStyle: {
            backgroundColor: theme.background.val,
            borderTopColor: theme.borderColor.val,
          },
          headerStyle: {
            backgroundColor: theme.background.val,
            borderBottomColor: theme.borderColor.val,
          },
          headerTintColor: theme.color.val,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Focus',
            tabBarIcon: ({ color }) => <Timer color={color as any} />,
            headerTitle: () => null,
            headerRight: () => (
              <>
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
              </>
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color }) => <ChartSpline color={color as any} />,
            headerTitle: () => null,
          }}
        />
      </Tabs>
    </>
  )
}
