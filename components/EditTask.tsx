import { ChevronDown, CirclePlus, Pen, Trash, Check, Plus } from "@tamagui/lucide-icons"
import { BlurView } from "expo-blur"
import { useState } from "react"
import { Keyboard, TouchableWithoutFeedback } from "react-native"
import { Button, H5, Input, Paragraph, Sheet, XStack, YStack, ScrollView } from "tamagui"
import { Task } from "app/(tabs)" // Ensure this is correctly imported

const INITIAL_TASK: Task = {
    name: '',
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    rounds: 4,
}

type EditTaskProps = {
    selectedTask: Task | null
    setSelectedTask: (task: Task | null) => void
    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function EditTask({ selectedTask, setSelectedTask, tasks, setTasks }: EditTaskProps) {
    const [open, setOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)
    const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
    const [newTask, setNewTask] = useState<Task>(INITIAL_TASK)

    const handleDeletePress = (taskName: string) => {
        if (confirmingDelete === taskName) {
            setTasks((prev) => prev.filter((t) => t.name !== taskName))
            setConfirmingDelete(null)
            if (selectedTask?.name === taskName) {
                setSelectedTask(null)
            }
        } else {
            setConfirmingDelete(taskName)
        }
    }

    const handleCreatePress = () => {
        const trimmed = newTask.name.trim()
        if (!trimmed || tasks.find((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return

        setTasks([...tasks, { ...newTask, name: trimmed }])
        setNewTask(INITIAL_TASK)
        setCreateOpen(false)
    }

    return (
        <>
            {/* Trigger button */}
            <BlurView intensity={50} tint="dark" style={{ borderRadius: 16, overflow: "hidden" }}>
                <Button
                    chromeless
                    bg="rgba(255, 255, 255, 0.02)"
                    borderRadius={16}
                    onPress={() => setOpen(true)}
                    size={42}
                    px={16}
                >
                    <XStack items="center" gap="$2">
                        <Paragraph>{selectedTask?.name}</Paragraph>
                        <Pen size={14} />
                    </XStack>
                </Button>
            </BlurView>

            {/* Main task selector modal */}
            <Sheet open={open} onOpenChange={setOpen} snapPoints={[90]} dismissOnSnapToBottom modal>
                <Sheet.Overlay />
                <Sheet.Handle />
                <YStack p="$4" gap="$3">
                    <H5>Edit Task</H5>

                    {/* Create New Task Button */}
                    <Button borderRadius="$6" onPress={() => setCreateOpen(true)}>
                        <Plus /> New Task
                    </Button>

                    <Paragraph>Select a task for this session.</Paragraph>

                    {/* Task list */}
                    <ScrollView width="100%" maxHeight="60%">
                        <YStack gap="$2">
                            {tasks.map((task) => (
                                <XStack key={task.name} justify="space-between" width="100%">
                                    <Button
                                        onPress={() => {
                                            setSelectedTask(task)
                                            setConfirmingDelete(null)
                                        }}
                                        borderColor="$black4"
                                        borderWidth={1}
                                        borderRadius="$6"
                                        items="center"
                                        themeInverse={selectedTask?.name === task.name}
                                        variant={selectedTask?.name === task.name ? "active" : "outlined"}
                                        width="83%"
                                        justify="flex-start"
                                    >
                                        <Paragraph>{task.name}</Paragraph>
                                    </Button>

                                    <Button
                                        borderRadius="$6"
                                        variant="outlined"
                                        borderColor="$black4"
                                        borderWidth={1}
                                        p={12}
                                        onPress={() => handleDeletePress(task.name)}
                                    >
                                        {confirmingDelete === task.name ? (
                                            <Check color="$green8" />
                                        ) : (
                                            <Trash color="$red7" />
                                        )}
                                    </Button>
                                </XStack>
                            ))}
                        </YStack>
                    </ScrollView>

                    {/* Close Button */}
                    <Button
                        self="center"
                        size="$5"
                        circular
                        onPress={() => setOpen(false)}
                        variant="outlined"
                        borderWidth={1}
                        borderColor="$black4"
                        mt="$4"
                    >
                        <ChevronDown />
                    </Button>
                </YStack>
            </Sheet>

            {/* Create Task Modal */}
            <Sheet open={createOpen} onOpenChange={setCreateOpen} snapPoints={[90]} dismissOnSnapToBottom modal>
                <Sheet.Overlay />
                <Sheet.Handle />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView>
                        <YStack p="$4" gap="$2">
                            <H5>Create New Task</H5>

                            <Input
                                borderRadius="$6"
                                placeholder="Enter task name..."
                                value={newTask.name}
                                onChangeText={(text) =>
                                    setNewTask((prev) => ({ ...prev, name: text }))
                                }
                            />

                            {/* Focus Minutes */}
                            <XStack width="100%">
                                <Paragraph>Focus</Paragraph>
                            </XStack>
                            <XStack gap="$2" mb="$4" items="center">
                                <Input
                                    keyboardType="numeric"
                                    value={String(newTask.focusMinutes)}
                                    onChangeText={(val) =>
                                        setNewTask((prev) => ({
                                            ...prev,
                                            focusMinutes: isNaN(parseInt(val)) ? 0 : parseInt(val),
                                        }))
                                    }
                                    borderRadius="$6"
                                />
                                {[25, 45].map((opt) => (
                                    <Button
                                        key={opt}
                                        onPress={() =>
                                            setNewTask((prev) => ({ ...prev, focusMinutes: opt }))
                                        }
                                        size="$4"
                                        borderRadius="$6"
                                        borderWidth={1}
                                        borderColor="$black4"
                                        themeInverse={newTask.focusMinutes === opt}
                                        variant={newTask.focusMinutes === opt ? "active" : "outlined"}
                                    >
                                        <Paragraph>{opt} minutes</Paragraph>
                                    </Button>
                                ))}
                            </XStack>

                            {/* Short Break */}
                            <Paragraph>Short Break</Paragraph>
                            <XStack gap="$2" mb="$4" items="center">
                                <Input
                                    keyboardType="numeric"
                                    value={String(newTask.shortBreakMinutes)}
                                    onChangeText={(val) =>
                                        setNewTask((prev) => ({
                                            ...prev,
                                            shortBreakMinutes: isNaN(parseInt(val)) ? 0 : parseInt(val),
                                        }))
                                    }
                                    borderRadius="$6"
                                />
                                {[5, 10].map((opt) => (
                                    <Button
                                        key={opt}
                                        onPress={() =>
                                            setNewTask((prev) => ({ ...prev, shortBreakMinutes: opt }))
                                        }
                                        size="$4"
                                        borderRadius="$6"
                                        borderWidth={1}
                                        borderColor="$black4"
                                        themeInverse={newTask.shortBreakMinutes === opt}
                                        variant={newTask.shortBreakMinutes === opt ? "active" : "outlined"}
                                    >
                                        <Paragraph>{opt} minutes</Paragraph>
                                    </Button>
                                ))}
                            </XStack>

                            {/* Long Break */}
                            <Paragraph>Long Break</Paragraph>
                            <XStack gap="$2" mb="$4" items="center">
                                <Input
                                    keyboardType="numeric"
                                    value={String(newTask.longBreakMinutes)}
                                    onChangeText={(val) =>
                                        setNewTask((prev) => ({
                                            ...prev,
                                            longBreakMinutes: isNaN(parseInt(val)) ? 0 : parseInt(val),
                                        }))
                                    }
                                    borderRadius="$6"
                                />
                                {[15, 30].map((opt) => (
                                    <Button
                                        key={opt}
                                        onPress={() =>
                                            setNewTask((prev) => ({ ...prev, longBreakMinutes: opt }))
                                        }
                                        size="$4"
                                        borderRadius="$6"
                                        borderWidth={1}
                                        borderColor="$black4"
                                        themeInverse={newTask.longBreakMinutes === opt}
                                        variant={newTask.longBreakMinutes === opt ? "active" : "outlined"}
                                    >
                                        <Paragraph>{opt} minutes</Paragraph>
                                    </Button>
                                ))}
                            </XStack>

                            {/* Rounds */}
                            <Paragraph>Rounds to Long Break</Paragraph>
                            <XStack gap="$2" mb="$4" items="center">
                                <Input
                                    keyboardType="numeric"
                                    value={String(newTask.rounds)}
                                    onChangeText={(val) => {
                                        const num = parseInt(val)
                                        if (!isNaN(num) && num >= 1 && num <= 12) {
                                            setNewTask((prev) => ({ ...prev, rounds: num }))
                                        }
                                    }}
                                    borderRadius="$6"
                                />
                                {[4, 6, 8].map((opt) => (
                                    <Button
                                        key={opt}
                                        onPress={() =>
                                            setNewTask((prev) => ({ ...prev, rounds: opt }))
                                        }
                                        size="$4"
                                        borderRadius="$6"
                                        borderWidth={1}
                                        borderColor="$black4"
                                        themeInverse={newTask.rounds === opt}
                                        variant={newTask.rounds === opt ? "active" : "outlined"}
                                    >
                                        <Paragraph>{opt}</Paragraph>
                                    </Button>
                                ))}
                            </XStack>

                            {/* Action Buttons */}
                            <XStack justifyContent="flex-end" mt="$2" gap="$2">
                                <Button onPress={() => setCreateOpen(false)} variant="outlined">
                                    Cancel
                                </Button>
                                <Button onPress={handleCreatePress}>
                                    Create
                                </Button>
                            </XStack>
                        </YStack>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </Sheet>
        </>
    )
}