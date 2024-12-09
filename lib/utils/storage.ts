import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const STORAGE_KEY = 'TASK_TRACKER_TASKS';

export const saveTasks = async (tasks: Task[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks', error);
    }
};

export const loadTasks = async (): Promise<Task[]> => {
    try {
        const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
        return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
        console.error('Error loading tasks', error);
        return [];
    }
};

export const clearTasks = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing tasks', error);
    }
};