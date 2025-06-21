// Full cleaned version of AppContext.tsx
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, Project, Category, DailyPlan, WhatNowCriteria, JournalEntry, AppSettings } from '../types';
import { WorkSchedule, WorkShift, ShiftType, DEFAULT_SHIFTS } from '../types/WorkSchedule';
import * as localStorage from '../utils/localStorage';
import { generateId, createSampleData, recommendTasks as recommendTasksUtil } from '../utils/helpers';
import { getTodayString, formatDateString, extractDateFromText } from '../utils/dateUtils';

const AppContext = createContext(undefined);

const UNDO_WINDOW = 5000;

const DEFAULT_SETTINGS = {
  timeManagement: {
    defaultBufferTime: 15,
    timeBlindnessAlerts: false,
    timeBlindnessInterval: 60,
    autoAdjustEstimates: false,
    gettingReadyTime: 30
  },
  visual: {
    fontSize: 'medium',
    layoutDensity: 'comfortable',
    reduceAnimations: false,
    highContrast: false,
    customPriorityColors: {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    }
  }
};

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dailyPlans, setDailyPlans] = useState([]);
  const [workSchedule, setWorkSchedule] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadData = () => {
      try {
        let loadedTasks = [];
        let loadedProjects = [];
        let loadedCategories = [];
        let loadedWorkSchedule = null;
        let loadedJournalEntries = [];
        let loadedSettings = null;

        try {
          loadedTasks = localStorage.getTasks();
        } catch {}

        try {
          loadedProjects = localStorage.getProjects();
        } catch {}

        try {
          loadedCategories = localStorage.getCategories();
        } catch {}

        // dailyPlans intentionally skipped

        try {
          loadedWorkSchedule = localStorage.getWorkSchedule();
        } catch {}

        try {
          loadedJournalEntries = localStorage.getJournalEntries();
        } catch {}

        try {
          loadedSettings = localStorage.getSettings();
        } catch {}

        setTasks(loadedTasks);
        setProjects(loadedProjects);
        setCategories(loadedCategories);
        // setDailyPlans intentionally skipped
        setWorkSchedule(loadedWorkSchedule);
        setJournalEntries(loadedJournalEntries);
        if (loadedSettings) setSettings(loadedSettings);

        const hasData =
          loadedTasks.length > 0 ||
          loadedProjects.length > 0 ||
          loadedCategories.length > 0;

        setIsDataInitialized(hasData);
      } catch {
        setTasks([]);
        setProjects([]);
        setCategories([]);
        setDailyPlans([]);
        setWorkSchedule(null);
        setJournalEntries([]);
        setIsDataInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Methods
  const addTask = useCallback((task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    localStorage.saveTasks(newTasks);
  }, [tasks]);

  const updateTask = useCallback((updatedTask: Task) => {
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(newTasks);
    localStorage.saveTasks(newTasks);
  }, [tasks]);

  const deleteTask = useCallback((taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    localStorage.saveTasks(newTasks);
  }, [tasks]);

  const addProject = useCallback((project: Project) => {
    const newProjects = [...projects, project];
    setProjects(newProjects);
    localStorage.saveProjects(newProjects);
  }, [projects]);

  const updateProject = useCallback((updatedProject: Project) => {
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    localStorage.saveProjects(newProjects);
  }, [projects]);

  const deleteProject = useCallback((projectId: string) => {
    const newProjects = projects.filter(p => p.id !== projectId);
    setProjects(newProjects);
    localStorage.saveProjects(newProjects);
  }, [projects]);

  const addCategory = useCallback((category: Category) => {
    const newCategories = [...categories, category];
    setCategories(newCategories);
    localStorage.saveCategories(newCategories);
  }, [categories]);

  const updateCategory = useCallback((updatedCategory: Category) => {
    const newCategories = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
    setCategories(newCategories);
    localStorage.saveCategories(newCategories);
  }, [categories]);

  const deleteCategory = useCallback((categoryId: string) => {
    const newCategories = categories.filter(c => c.id !== categoryId);
    setCategories(newCategories);
    localStorage.saveCategories(newCategories);
  }, [categories]);

  const exportData = useCallback(() => {
    return localStorage.exportData();
  }, []);

  const importData = useCallback((data: string) => {
    const success = localStorage.importData(data);
    if (success) {
      // Reload data
      setTasks(localStorage.getTasks());
      setProjects(localStorage.getProjects());
      setCategories(localStorage.getCategories());
      setDailyPlans(localStorage.getDailyPlans());
      setWorkSchedule(localStorage.getWorkSchedule());
      setJournalEntries(localStorage.getJournalEntries());
    }
    return success;
  }, []);

  const resetData = useCallback(() => {
    localStorage.resetData();
    setTasks([]);
    setProjects([]);
    setCategories([]);
    setDailyPlans([]);
    setWorkSchedule(null);
    setJournalEntries([]);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const initializeSampleData = useCallback(() => {
    const sampleData = createSampleData();
    setTasks(sampleData.tasks);
    setProjects(sampleData.projects);
    setCategories(sampleData.categories);
    localStorage.saveTasks(sampleData.tasks);
    localStorage.saveProjects(sampleData.projects);
    localStorage.saveCategories(sampleData.categories);
  }, []);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.saveSettings(newSettings);
  }, []);

  const needsWeeklyReview = useCallback(() => {
    return localStorage.needsWeeklyReview();
  }, []);

  return (
    <AppContext.Provider value={{
      tasks,
      projects,
      categories,
      dailyPlans,
      workSchedule,
      journalEntries,
      isLoading,
      isDataInitialized,
      settings,
      addTask,
      updateTask,
      deleteTask,
      addProject,
      updateProject,
      deleteProject,
      addCategory,
      updateCategory,
      deleteCategory,
      exportData,
      importData,
      resetData,
      initializeSampleData,
      updateSettings,
      needsWeeklyReview,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};