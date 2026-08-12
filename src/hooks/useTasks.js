import { useState, useMemo } from 'react';
import { tasks as initialTasks } from '../data/tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const markTaskComplete = (taskId, remarks = '') => {
    updateTask(taskId, {
      status: 'Closed',
      completedAt: new Date().toISOString(),
      category: 'completed',
      completionRemarks: remarks,
    });
  };

  const reassignTask = (taskId, newOwner, newOwnerType) => {
    updateTask(taskId, {
      owner: newOwner,
      ownerType: newOwnerType,
    });
  };

  const changePriority = (taskId, newPriority) => {
    updateTask(taskId, { priority: newPriority });
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const selectAllTasks = (taskIds) => {
    setSelectedTasks(new Set(taskIds));
  };

  const clearSelection = () => {
    setSelectedTasks(new Set());
  };

  const bulkMarkComplete = (remarks = '') => {
    const now = new Date().toISOString();
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.has(task.id)
          ? { ...task, status: 'Closed', completedAt: now, category: 'completed', completionRemarks: remarks }
          : task
      )
    );
    clearSelection();
  };

  const bulkReassign = (newOwner, newOwnerType) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.has(task.id)
          ? { ...task, owner: newOwner, ownerType: newOwnerType }
          : task
      )
    );
    clearSelection();
  };

  const bulkChangePriority = (newPriority) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        selectedTasks.has(task.id)
          ? { ...task, priority: newPriority }
          : task
      )
    );
    clearSelection();
  };

  const summaryData = useMemo(() => {
    const openTasks = tasks.filter(task => task.status !== 'Closed');
    const closedToday = tasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt).toDateString();
      const today = new Date().toDateString();
      return completedDate === today;
    });

    const callbacks = tasks.filter(task => task.category === 'callback' && task.status !== 'Closed');
    const p0Tasks = tasks.filter(task => task.priority === 'P0' && task.status !== 'Closed');
    const p1Tasks = tasks.filter(task => {
      if (task.status === 'Closed') return false;
      const dueDate = new Date(task.dueAt);
      const today = new Date();
      const isToday = dueDate.toDateString() === today.toDateString();
      return task.priority === 'P1' && isToday;
    });

    return {
      callbacks: callbacks.length,
      p0Tasks: p0Tasks.length,
      p1Tasks: p1Tasks.length,
      openTasks: openTasks.length,
      closedToday: closedToday.length,
    };
  }, [tasks]);

  return {
    tasks,
    selectedTasks,
    summaryData,
    updateTask,
    markTaskComplete,
    reassignTask,
    changePriority,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    bulkMarkComplete,
    bulkReassign,
    bulkChangePriority,
  };
};