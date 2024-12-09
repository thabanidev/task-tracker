import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TaskItem from "@/components/TaskItem";
import { Task } from "@/lib/types";

describe('TaskItem Component', () => {
	const mockTask: Task = {
		id: '1',
		title: 'Test Task',
		completed: false,
		createdAt: new Date()
	};

	const mockOnToggleCompleted = jest.fn();
	const mockOnDelete = jest.fn();

	it('renders task title correctly', () => {
		const { getByText } = render(
			<TaskItem 
			task={mockTask}
			onToggleComplete={mockOnToggleCompleted}
			onDelete={mockOnDelete} />
		);

		expect(getByText('Test Task')).toBeTruthy();
	});

	it('calls onToggleComplete when task is pressed', () => {
		const { getByText } = render(
			<TaskItem 
			task={mockTask}
			onToggleComplete={mockOnToggleCompleted}
			onDelete={mockOnDelete} />
		);

		fireEvent.click(getByText('Test Task'));
		expect(mockOnToggleCompleted).toHaveBeenCalledWith('1');
	});
});