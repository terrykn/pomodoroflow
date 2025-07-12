import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { ChartSpline, Timer } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.white1.val,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color }) => <Timer color={color as any} />,
          headerShown: false,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <ChartSpline color={color as any} />,
          headerShown: false,
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  )
}