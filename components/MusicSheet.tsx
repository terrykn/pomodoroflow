import { Sheet, Button, YStack, H5, XStack, Paragraph, ListItem } from "tamagui"
import { Music } from "@tamagui/lucide-icons"

const MUSIC_OPTIONS = [
  { label: "None", value: null },
  { label: "Morning Forest", value: "morning-forest" },
  { label: "Night Forest", value: "night-forest" },
  { label: "Ocean Waves", value: "ocean-waves" },
  { label: "Rain", value: "rain" },
  { label: "Soothing Instrumental", value: "soothing-instrumental" },
]

export default function MusicSheet({ open, onOpenChange, focusMusic, breakMusic, setFocusMusic, setBreakMusic }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} snapPoints={[80]} dismissOnSnapToBottom modal>
      <Sheet.Overlay />
      <Sheet.Handle />
      <YStack p="$4" gap="$4">
        <H5>Select Focus Music</H5>
        <XStack flexWrap="wrap" gap="$2">
          {MUSIC_OPTIONS.map(opt => (
            <ListItem
              key={`focus-${opt.value}`}
              onPress={() => setFocusMusic(opt.value)}
              bg={focusMusic === opt.value ? "$blue3" : "transparent"}
            >
              <Paragraph>{opt.label}</Paragraph>
            </ListItem>
          ))}
        </XStack>
        <H5 mt="$4">Select Break Music</H5>
        <XStack flexWrap="wrap" gap="$2">
          {MUSIC_OPTIONS.map(opt => (
            <ListItem
              key={`break-${opt.value}`}
              onPress={() => setBreakMusic(opt.value)}
              bg={breakMusic === opt.value ? "$green3" : "transparent"}
            >
              <Paragraph>{opt.label}</Paragraph>
            </ListItem>
          ))}
        </XStack>
      </YStack>
    </Sheet>
  )
}