import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskManager from '../TaskManager';

describe('TaskManager Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders TaskManager component', () => {
    render(<TaskManager />);
    expect(screen.getByText('Task Management System')).toBeInTheDocument();
  });

  test('adds a new task with all fields', () => {
    render(<TaskManager />);
    
    // Fill in task details
    const taskInput = screen.getByPlaceholderText('Enter new task...');
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    const prioritySelect = screen.getByRole('combobox', { name: /priority/i });
    const dateInput = screen.getByRole('date');
    
    fireEvent.change(taskInput, { target: { value: 'Test Task' } });
    fireEvent.change(categorySelect, { target: { value: 'Work' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    
    // Add task
    fireEvent.click(screen.getByText('Add Task'));

    // Verify task was added with correct details
    const taskElement = screen.getByText('Test Task');
    expect(taskElement).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText(/2024-12-31/)).toBeInTheDocument();
  });

  test('adds and manages subtasks', () => {
    render(<TaskManager />);
    
    // Create main task
    fireEvent.change(screen.getByPlaceholderText('Enter new task...'), { target: { value: 'Main Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Expand task details
    fireEvent.click(screen.getByText('Expand'));

    // Add subtask
    const subtaskInput = screen.getByPlaceholderText('Add subtask...');
    fireEvent.change(subtaskInput, { target: { value: 'Subtask 1' } });
    fireEvent.click(screen.getByText('Add'));

    // Verify subtask was added
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();

    // Complete subtask
    const subtaskCheckbox = screen.getAllByRole('checkbox')[1]; // First checkbox is main task
    fireEvent.click(subtaskCheckbox);

    // Verify progress bar updates
    expect(screen.getByText('100% Complete')).toBeInTheDocument();
  });

  test('adds and manages notes', () => {
    render(<TaskManager />);
    
    // Create main task
    fireEvent.change(screen.getByPlaceholderText('Enter new task...'), { target: { value: 'Task with Notes' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Expand task details
    fireEvent.click(screen.getByText('Expand'));

    // Add note
    const noteInput = screen.getByPlaceholderText('Add a note...');
    fireEvent.change(noteInput, { target: { value: 'Test note content' } });
    fireEvent.click(screen.getByText('Add Note'));

    // Verify note was added
    expect(screen.getByText('Test note content')).toBeInTheDocument();

    // Delete note
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.queryByText('Test note content')).not.toBeInTheDocument();
  });

  test('filters tasks by category', () => {
    render(<TaskManager />);
    
    // Add tasks with different categories
    const taskInput = screen.getByPlaceholderText('Enter new task...');
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    
    // Add Work task
    fireEvent.change(taskInput, { target: { value: 'Work Task' } });
    fireEvent.change(categorySelect, { target: { value: 'Work' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Add Personal task
    fireEvent.change(taskInput, { target: { value: 'Personal Task' } });
    fireEvent.change(categorySelect, { target: { value: 'Personal' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Filter by Work category
    const categoryFilter = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categoryFilter, { target: { value: 'Work' } });

    // Verify only Work task is visible
    expect(screen.getByText('Work Task')).toBeInTheDocument();
    expect(screen.queryByText('Personal Task')).not.toBeInTheDocument();
  });

  test('calculates and displays task progress correctly', () => {
    render(<TaskManager />);
    
    // Create task with subtasks
    fireEvent.change(screen.getByPlaceholderText('Enter new task...'), { target: { value: 'Progress Test Task' } });
    fireEvent.click(screen.getByText('Add Task'));
    fireEvent.click(screen.getByText('Expand'));

    // Add two subtasks
    const subtaskInput = screen.getByPlaceholderText('Add subtask...');
    
    fireEvent.change(subtaskInput, { target: { value: 'Subtask 1' } });
    fireEvent.click(screen.getByText('Add'));
    
    fireEvent.change(subtaskInput, { target: { value: 'Subtask 2' } });
    fireEvent.click(screen.getByText('Add'));

    // Complete one subtask
    const subtaskCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(subtaskCheckboxes[1]); // Complete first subtask

    // Verify progress is 50%
    expect(screen.getByText('50% Complete')).toBeInTheDocument();
  });

  test('supports undo/redo operations', () => {
    render(<TaskManager />);
    
    // Add a task
    fireEvent.change(screen.getByPlaceholderText('Enter new task...'), { target: { value: 'Undo Test Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Delete the task
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.queryByText('Undo Test Task')).not.toBeInTheDocument();

    // Undo deletion
    fireEvent.click(screen.getByText('Undo'));
    expect(screen.getByText('Undo Test Task')).toBeInTheDocument();

    // Redo deletion
    fireEvent.click(screen.getByText('Redo'));
    expect(screen.queryByText('Undo Test Task')).not.toBeInTheDocument();
  });

  test('persists tasks in localStorage', () => {
    const { rerender } = render(<TaskManager />);
    
    // Add a task
    fireEvent.change(screen.getByPlaceholderText('Enter new task...'), { target: { value: 'Persistent Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Simulate component remount
    rerender(<TaskManager />);

    // Verify task persists
    expect(screen.getByText('Persistent Task')).toBeInTheDocument();
  });

  test('handles overdue tasks correctly', () => {
    render(<TaskManager />);
    
    // Add task with past due date
    const taskInput = screen.getByPlaceholderText('Enter new task...');
    const dateInput = screen.getByRole('date');
    
    fireEvent.change(taskInput, { target: { value: 'Overdue Task' } });
    fireEvent.change(dateInput, { target: { value: '2020-01-01' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Verify overdue status
    const taskElement = screen.getByText('Overdue Task').closest('.task-item');
    expect(taskElement).toHaveClass('overdue');
  });
}); 