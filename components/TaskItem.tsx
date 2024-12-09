import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Task } from "@/lib/types";

type TaskItemProps = {
	task: Task;
	onToggleComplete: (id: string) => void;
	onDelete: (id: string) => void;
};

const TaskItem = ({ task, onToggleComplete, onDelete }: TaskItemProps) => {
	return (
		<View className="items-center justify-between p-4 bg-white rounded-lg mb-2">
			<TouchableOpacity
				onPress={() => onToggleComplete(task.id)}
				className="flex-1 mb-2"
			>
				<Text
					className={`text-lg ${
						task.completed
							? "line-through text-gray-400"
							: "text-black"
					}`}
				>
					{task.title}
				</Text>
			</TouchableOpacity>

			<View className="flex-1 w-full py-2 flex-row items-center justify-between">
				<Text className="text-gray-500 text-xs">
					{task.createdAt.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}, {task.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				</Text>
				<TouchableOpacity
					onPress={() => onDelete(task.id)}
					className="bg-red-500 p-2 rounded w-20 items-center justify-center"
				>
					<Text className="text-white">Delete</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default TaskItem;
