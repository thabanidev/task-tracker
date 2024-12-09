import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Task } from "@/lib/types";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import Animated, {
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";

type TaskItemProps = {
	task: Task;
	onToggleComplete: (id: string) => void;
	onDelete: (id: string) => void;
};

const TaskItem = ({ task, onToggleComplete, onDelete }: TaskItemProps) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: withSpring(task.completed ? 0.95 : 1),
				},
			],
			opacity: withTiming(task.completed ? 0.6 : 1),
		};
	});

	const confirmDelete = () => {
		Alert.alert(
			"Delete Task",
			`Are you sure you want to delete "${task.title}"?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => onDelete(task.id),
				},
			]
		);
	};

	return (
		<Animated.View style={animatedStyle}>
			<LinearGradient
				colors={["#b802fb", "#45caff"]}
				start={[0, 1]}
				end={[1, 0]}
				className="p-4 mb-2"
				style={{ borderRadius: 20 }}
			>
				<View className="justify-between overflow-hidden">
					<View className="flex-row items-center rounded-xl bg-white/40 mb-4 p-2 gap-2">
						<TouchableOpacity
							onPress={() => onToggleComplete(task.id)}
						>
							<MaterialIcons
								name={
									task.completed
										? "check-box"
										: "check-box-outline-blank"
								}
								size={32}
								color="white"
							/>
						</TouchableOpacity>
						<Text
							className={`text-lg text-wrap break-words w-3/4 ${
								task.completed
									? "line-through text-gray-200"
									: "text-white "
							}`}
						>
							{task.title}
						</Text>
					</View>

					<View className="flex-1 w-full flex-row items-center justify-between">
						<Text className="text-gray-100 text-sm bg-white/40 py-3 px-4 rounded-xl">
							{task.createdAt.toLocaleDateString([], {
								day: "2-digit",
								month: "short",
								year: "numeric",
							})}
							,{" "}
							{task.createdAt.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
						<TouchableOpacity
							onPress={() => confirmDelete()}
							className="bg-red-500/90 py-3 px-4 rounded-xl w-20 items-center justify-center"
						>
							<Text className="text-white">Delete</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		</Animated.View>
	);
};

export default TaskItem;
