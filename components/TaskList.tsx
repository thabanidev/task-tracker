import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { saveTasks, loadTasks } from "../lib/utils/storage";
import TaskItem from "./TaskItem";
import { Task } from "@/lib/types";
import { Picker } from "@react-native-picker/picker";
import { generateUId } from "@/lib/utils/id-generator";

type SortOption = "newest" | "oldest";

const TaskList: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [sortOption, setSortOption] = useState<SortOption>("newest");
	const [filterOption, setFilterOption] = useState<
		"all" | "completed" | "incomplete"
	>("all");

	useEffect(() => {
		// Load tasks from storage on component mount
		const fetchTasks = async () => {
			const savedTasks = await loadTasks();
			setTasks(savedTasks);
		};
		fetchTasks();
	}, []);

	useEffect(() => {
		// Save tasks whenever they change
		saveTasks(tasks);

		if (tasks.length !== 0) {
			// Apply filtering and sorting
			let result = [...tasks];

			// Filter
			if (filterOption === "completed") {
				result = result.filter((task) => task.completed);
			} else if (filterOption === "incomplete") {
				result = result.filter((task) => !task.completed);
			}

			result = result.map((task) => ({
				...task,
				createdAt: new Date(task.createdAt),
			}));

			// Sort
			switch (sortOption) {
				case "newest":
					result.sort(
						(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
					);
					break;
				case "oldest":
					result.sort(
						(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
					);
					break;
			}

			setFilteredTasks(result);
		}
	}, [tasks, sortOption, filterOption]);

	const toggleTaskCompletion = (id: string) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const deleteTask = (id: string) => {
		setTasks(tasks.filter((task) => task.id !== id));
	};

	return (
		<View className="flex-1 p-4 bg-gray-100">
			{/* Sorting and Filtering Controls */}
			<View className=" flex-column justify-between mb-4 bg-white shadow p-4 rounded-lg gap-4">
				<View className="flex-auto bg-gray-100 rounded-lg p-4">
					<Text className="font-semibold">Sort By:</Text>
					<Picker
						selectedValue={sortOption}
						onValueChange={(itemValue: string) =>
							setSortOption(itemValue as SortOption)
						}
					>
						<Picker.Item label="Newest" value="newest" />
						<Picker.Item label="Oldest" value="oldest" />
					</Picker>
				</View>

				<View className="flex-auto bg-gray-100 rounded-lg p-4">
					<Text className="font-semibold">Filter:</Text>
					<Picker
						selectedValue={filterOption}
						onValueChange={(itemValue) =>
							setFilterOption(itemValue)
						}
					>
						<Picker.Item label="All" value="all" />
						<Picker.Item label="Completed" value="completed" />
						<Picker.Item label="Incomplete" value="incomplete" />
					</Picker>
				</View>
			</View>

			{/* Input */}
			<View className="bg-white p-4 rounded-lg mb-4">
				<TextInput
					placeholder="Add a task..."
					onSubmitEditing={(event) => {
						const title = event.nativeEvent.text;
						if (title) {
							setTasks([
								...tasks,
								{
									id: generateUId(),
									title,
									completed: false,
									createdAt: new Date(),
								},
							]);
						}
						event.nativeEvent.text = "";
					}}
				/>
			</View>

			<View className="flex-row items-center justify-end mb-4 p-2">
				<TouchableOpacity onPress={() => setTasks([])}>
					<Text className="text-red-500">Clear All</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={filteredTasks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TaskItem
						task={item}
						onToggleComplete={toggleTaskCompletion}
						onDelete={deleteTask}
					/>
				)}
				ListEmptyComponent={() => (
					<View className="items-center justify-center mt-10">
						<Text className="text-gray-500">
							No tasks match your filter.
						</Text>
					</View>
				)}
			/>
		</View>
	);
};

export default TaskList;
