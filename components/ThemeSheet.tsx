import { Sheet, Button, YStack, H5, XStack, Paragraph, ListItem } from "tamagui"

const FONTS = [
  { label: "Monospace", value: "monospace" },
  { label: "Cherry Cream Soda", value: "CherryCreamSoda" },
  { label: "Jersey 15", value: "Jersey15" },
  { label: "Saira Stencil One", value: "SairaStencilOne" },
  { label: "Spicy Rice", value: "SpicyRice" },
  { label: "WDXL", value: "WDXL" },
]

export default function ThemeSheet({
  open,
  onOpenChange,
  fontFamily,
  setFontFamily,
}) {
  return (
    <>
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
              <Paragraph fontFamily={font.value as any}>{font.label}</Paragraph>
            </ListItem>
          ))}
        </YStack>
      </Sheet>
    </>
  )
}