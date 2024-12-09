import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	TouchableOpacity,
	Alert,
} from "react-native";
import { saveTasks, loadTasks } from "../lib/utils/storage";
import TaskItem from "./TaskItem";
import { Task } from "@/lib/types";
import { Picker } from "@react-native-picker/picker";
import { generateUId } from "@/lib/utils/id-generator";
import { LinearGradient } from "expo-linear-gradient";

type SortOption = "newest" | "oldest";

const TaskList: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [sortOption, setSortOption] = useState<SortOption>("newest");
	const [filterOption, setFilterOption] = useState<
		"all" | "completed" | "incomplete"
	>("all");
	const [isCollapsed, setIsCollapsed] = useState(true);

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

	const confirmClearAllTasks = () => {
		Alert.alert(
			"Confirm",
			"Are you sure you want to clear all tasks?",
			[
				{
					text: "Cancel",
					style: "cancel",
					isPreferred: true,
				},
				{
					text: "Clear all",
					style: "destructive",
					onPress: () => setTasks([]),
				},
			],
			{ cancelable: false }
		);
	};

	return (
		<View className="flex-1 p-4 bg-white">
			{/* Input */}
			<View className="bg-secondary/20 p-3 rounded-2xl border border-primary/50 mb-4">
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
								} as Task,
							]);
						}
						event.nativeEvent.text = "";
						(event.target as TextInput).clear();
					}}
					maxLength={45}
				/>
			</View>

			<View className="flex-row items-center justify-between mb-4 p-2 gap-2">
				<TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
					<Text className="text-primary">
						{isCollapsed ? "Show" : "Hide"} Sort/Filters
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						confirmClearAllTasks();
					}}
				>
					<Text className="text-red-500">Clear All</Text>
				</TouchableOpacity>
			</View>

			{/* Sorting and Filtering Controls */}

			{!isCollapsed && (
				<LinearGradient
					colors={["#b802fb", "#45caff"]}
					start={[0, 1]}
					end={[1, 0]}
					className="p-4 mb-2"
					style={{ borderRadius: 20 }}
				>
					<View className="flex-column justify-between mb-4 rounded-xl gap-4">
						<View>
							<Text className="text-white mb-1">Sort by:</Text>
							
						<View className="overflow-hidden rounded-xl">
						<Picker
							placeholder="Sort"
							selectedValue={sortOption}
							onValueChange={(itemValue: string) =>
								setSortOption(itemValue as SortOption)
							}
							style={{
								color: "white",
								backgroundColor: "#ffffff50",
							}}
						>
							<Picker.Item
								label="Newest"
								value="newest"
								style={{
									color: "#b802fb",
								}}
							/>
							<Picker.Item
								label="Oldest"
								value="oldest"
								style={{
									color: "#b802fb",
								}}
							/>
						</Picker>
						</View>
						</View>

						<View>
							<Text className="text-white mb-1">Filter:</Text>
						<View className="overflow-hidden rounded-xl">
						<Picker
							placeholder="Filter"
							selectedValue={filterOption}
							onValueChange={(itemValue) =>
								setFilterOption(itemValue)
							}
							style={{
								color: "white",
								backgroundColor: "#ffffff50",
							}}
						>
							<Picker.Item
								label="All"
								value="all"
								style={{
									color: "#b802fb",
								}}
							/>
							<Picker.Item
								label="Completed"
								value="completed"
								style={{
									color: "#b802fb",
								}}
							/>
							<Picker.Item
								label="Incomplete"
								value="incomplete"
								style={{
									color: "#b802fb",
								}}
							/>
						</Picker>
						</View>
						</View>
					</View>
				</LinearGradient>
			)}

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
			<Text className="text-base text-center text-primary opacity-80">
				Developed by Thabani Dev
			</Text>
		</View>
	);
};

export default TaskList;
