import AsyncStorage from '@react-native-async-storage/async-storage'
import { Task } from 'app/(tabs)'

export const STORAGE_KEYS = {
    SELECTED_TASK: 'selectedTask',
    TASKS: 'tasks',
    FOCUS_MUSIC: 'focusMusic',
    BREAK_MUSIC: 'breakMusic',
}

export async function saveToStorage<T>(key: string, value: T) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error('Save error:', e)
    }
}

export async function loadFromStorage<T>(key: string): Promise<T | null> {
    try {
        const raw = await AsyncStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
    } catch (e) {
        console.error('Load error:', e)
        return null
    }
}