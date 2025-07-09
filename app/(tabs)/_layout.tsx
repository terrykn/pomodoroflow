import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { ChartSpline, Music, Paintbrush, Timer } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
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
              <Button circular mr="$2">
                <Music />
              </Button>
              <Button circular mr="$4">
                <Paintbrush />
              </Button>
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
  )
}
