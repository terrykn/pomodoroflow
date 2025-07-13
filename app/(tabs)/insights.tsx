import { Text, View, Button, H5, Paragraph, YStack } from 'tamagui'
import { useRouter } from 'expo-router'

export default function TabInsightsScreen() {
  const isLoggedIn = true // Replace with your auth state
  const router = useRouter()

  const thisWeekTasks = [
    { name: 'Write Report', timeSpent: 90, date: '2025-07-13' },
    { name: 'Journaling', timeSpent: 42, date: '2025-07-13' },
    { name: 'Studying', timeSpent: 62, date: '2025-07-13' },
    { name: 'Read Book', timeSpent: 60, date: '2025-07-12' },
    { name: 'Write Report', timeSpent: 45, date: '2025-07-12' },
    { name: 'Mediation', timeSpent: 45, date: '2025-07-12' },
    { name: 'Plan Meeting', timeSpent: 30, date: '2025-07-11' },
  ]

  const lastWeekTasks = [
    { name: 'Read Book', timeSpent: 30, date: '2025-07-06' },
    { name: 'Write Report', timeSpent: 120, date: '2025-07-05' },
    { name: 'Design Slides', timeSpent: 60, date: '2025-07-04' },
    { name: 'Mediation', timeSpent: 45, date: '2025-07-4' },
  ]

  if (!isLoggedIn) {
    return (
      <View flex={1} items="center" justify="center" bg="$background">
        <H5>Login to track insights</H5>
        <Button onPress={() => router.push('/login')}>Login</Button>
      </View>
    )
  }

  return (
    <View flex={1} p="$4" bg="$background" justify="center">
      <YStack gap="$4">
        <H5>This Week's Activity</H5>
        {thisWeekTasks.map((item, index) => (
          <Paragraph key={`this-${index}`}>
            {item.date}: {item.name} - {item.timeSpent} min
          </Paragraph>
        ))}

        <H5>Last Week's Activity</H5>
        {lastWeekTasks.map((item, index) => (
          <Paragraph key={`last-${index}`}>
            {item.date}: {item.name} - {item.timeSpent} min
          </Paragraph>
        ))}
      </YStack>
    </View>
  )
}