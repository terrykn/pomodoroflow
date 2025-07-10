import { Sheet, Button, YStack, H5, XStack, Paragraph, ListItem } from "tamagui"
import { Paintbrush } from "@tamagui/lucide-icons"

const FONTS = [
  { label: "Monospace", value: "monospace" },
  { label: "Cherry Cream Soda", value: "CherryCreamSoda" },
  { label: "Jersey 15", value: "Jersey15" },
  { label: "Saira Stencil One", value: "SairaStencilOne" },
  { label: "Spicy Rice", value: "SpicyRice" }
]

export default function ThemeSheet({
  open,
  onOpenChange,
  fontFamily,
  setFontFamily,
}) {
  return (
    <>
      <Button circular mr="$4" onPress={() => onOpenChange(true)}>
        <Paintbrush />
      </Button>
      <Sheet open={open} onOpenChange={onOpenChange} snapPoints={[60]} dismissOnSnapToBottom modal>
        <Sheet.Overlay />
        <Sheet.Handle />
        <YStack p="$4" gap="$3">
          <H5>Select Timer Font</H5>
          {FONTS.map(font => (
            <ListItem
              key={font.value}
              onPress={() => {
                setFontFamily(font.value)
                onOpenChange(false)
              }}
              bg={fontFamily === font.value ? "$blue3" : "transparent"}
            >
              <Paragraph fontFamily={font.value}>{font.label}</Paragraph>
            </ListItem>
          ))}
        </YStack>
      </Sheet>
    </>
  )
}