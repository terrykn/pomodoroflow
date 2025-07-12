import { ChevronDown } from "@tamagui/lucide-icons"
import { Button, Paragraph, XStack, YStack, H5, Sheet } from "tamagui"

const MUSIC_OPTIONS = [
  { label: "None", value: null },
  { label: "Lo-fi", value: "night-lofi" },
  { label: "Soothing", value: "soothing-instrumental" },
  { label: "Ocean", value: "ocean-waves" },
  { label: "Rain", value: "rain" },
  { label: "Night Forest", value: "night-forest" },
  { label: "Morning Forest", value: "morning-forest" },
]

export default function MusicSheet({
  open,
  onOpenChange,
  focusMusic,
  breakMusic,
  setFocusMusic,
  setBreakMusic,
}) {
  return (
    <Sheet snapPoints={[90]} open={open} onOpenChange={onOpenChange} dismissOnSnapToBottom modal>
      <Sheet.Overlay />
      <Sheet.Handle />
      <YStack p="$4" gap="$4">
        <H5>Select Focus Music</H5>
        <XStack flexWrap="wrap" gap="$2">
          {MUSIC_OPTIONS.map((opt) => (
            <Button
              key={`focus-${opt.value ?? "none"}`}
              onPress={() => setFocusMusic(opt.value)}
              width="48%"
              size="$4"
              borderRadius="$6"
              borderWidth={1}
              borderColor="$black4"
              themeInverse={focusMusic === opt.value}
              variant={focusMusic === opt.value ? "active" : "outlined"}
            >
              <Paragraph>{opt.label}</Paragraph>
            </Button>
          ))}
        </XStack>

        <H5 mt="$4">Select Break Music</H5>
        <XStack flexWrap="wrap" gap="$2">
          {MUSIC_OPTIONS.map((opt) => (
            <Button
              key={`break-${opt.value ?? "none"}`}
              onPress={() => setBreakMusic(opt.value)}
              width="48%"
              size="$4"
              borderRadius="$6"
              borderWidth={1}
              borderColor="$black4"
              themeInverse={breakMusic === opt.value}
              variant={breakMusic === opt.value ? "active" : "outlined"}
            >
              <Paragraph>{opt.label}</Paragraph>
            </Button>
          ))}
        </XStack>
        <Button
          self="center"
          size="$5"
          circular
          onPress={() => onOpenChange(false)}
          variant="outlined"
          borderWidth={1}
          borderColor="$black4"
          mt="$4"
        >
          <ChevronDown />
        </Button>
      </YStack>
    </Sheet>
  )
}
