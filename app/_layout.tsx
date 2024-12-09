import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

export default function RootLayout() {
	return (
		<>
			<StatusBar style="auto" />
			<Stack
				screenOptions={{
          headerTitle: "Task Tracker",
          headerTintColor: "#fff",
					headerStyle: {
            backgroundColor: "#b802fb",
          },
          title: "Task Tracker",          
				}}
			/>
		</>
	);
}
