import { Text, View, Button, H5 } from 'tamagui'
import { useRouter } from 'expo-router'

export default function TabInsightsScreen() {
  const isLoggedIn = false // Replace with your auth state
  const router = useRouter()

  if (!isLoggedIn) {
    return (
      <View flex={1} items="center" justify="center" bg="$background">
        <H5>Login to track insights</H5>
        <Button onPress={() => router.push('/login')}>Login</Button>
      </View>
    )
  }

  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <Text fontSize={20} color="$blue10">
        Tab Two
      </Text>
    </View>
  )
}