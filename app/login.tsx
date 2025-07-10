import { View, Text, Button } from 'tamagui'

export default function LoginScreen() {
  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <Text fontSize={20} color="$blue10">Login</Text>
      {/* Add your login form here */}
      <Button mt="$4">Sign in</Button>
    </View>
  )
}