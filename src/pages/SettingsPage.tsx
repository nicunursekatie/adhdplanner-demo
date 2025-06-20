import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import AISettings from '../components/settings/AISettings';
import { DuplicateCleanupLocal } from '../components/settings/DuplicateCleanupLocal';
import { Download, Upload, Trash2, AlertCircle, Brain, ChevronDown, ChevronUp, Tag, Plus, Edit2, X, Clock, Eye, Users } from 'lucide-react';
import { Category } from '../types';

const SettingsPage: React.FC = () => {
  const { exportData, importData, resetData, initializeSampleData, categories, addCategory, updateCategory, deleteCategory, settings, updateSettings } = useAppContext();
  
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#6366f1');
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [showTimeManagement, setShowTimeManagement] = useState(false);
  const [showVisualPreferences, setShowVisualPreferences] = useState(false);
  const [showDuplicateCleanup, setShowDuplicateCleanup] = useState(false);
  
  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmanager-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    setImportModalOpen(true);
    setImportFile(null);
    setImportError(null);
    setImportSuccess(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
      setImportError(null);
    }
  };
  
  const handleImportData = () => {
    if (!importFile) {
      setImportError('Please select a file to import');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = importData(content);
        
        if (result) {
          setImportSuccess(true);
          setImportError(null);
          
          // Close modal after success
          setTimeout(() => {
            setImportModalOpen(false);
          }, 2000);
        } else {
          setImportError('Failed to import data. Make sure the file is a valid TaskManager export.');
        }
      } catch (error) {
        setImportError('Invalid file format. Please select a valid JSON file.');
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading the file');
    };
    
    reader.readAsText(importFile);
  };
  
  const handleResetClick = () => {
    setResetModalOpen(true);
  };
  
  const handleResetConfirm = () => {
    resetData();
    setResetModalOpen(false);
  };
  
  const handleLoadSampleData = () => {
    initializeSampleData();
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor('#6366f1');
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryColor(category.color);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryName.trim(),
        color: categoryColor,
        updatedAt: new Date().toISOString()
      });
    } else {
      addCategory({
        name: categoryName.trim(),
        color: categoryColor
      });
    }

    setCategoryModalOpen(false);
    setCategoryName('');
    setCategoryColor('#6366f1');
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDeleteCategoryId(categoryId);
  };

  const confirmDeleteCategory = () => {
    if (deleteCategoryId) {
      deleteCategory(deleteCategoryId);
      setDeleteCategoryId(null);
    }
  };
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white rounded-lg shadow-sm p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your data and preferences</p>
        </div>
      </div>
      
      {/* Data Management */}
      <Card title="Data Management">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-500">
                Download all your tasks, projects, and categories as a JSON file
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Download size={16} />}
              className="mt-2 md:mt-0"
              onClick={handleExportData}
            >
              Export
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Import Data</h3>
              <p className="text-sm text-gray-500">
                Import previously exported data into TaskManager
              </p>
            </div>
            <Button
              variant="secondary"
              icon={<Upload size={16} />}
              className="mt-2 md:mt-0"
              onClick={handleImportClick}
            >
              Import
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Sample Data</h3>
              <p className="text-sm text-gray-500">
                Load sample tasks, projects, and categories for demonstration
              </p>
            </div>
            <Button
              variant="secondary"
              className="mt-2 md:mt-0"
              onClick={handleLoadSampleData}
            >
              Load Samples
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Clear Demo Data</h3>
              <p className="text-sm text-gray-500">
                Clear all demo data for a fresh demonstration (cannot be undone)
              </p>
            </div>
            <Button
              variant="danger"
              icon={<Trash2 size={16} />}
              className="mt-2 md:mt-0"
              onClick={() => {
                if (confirm('Clear all demo data? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Clear Demo
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Reset Data</h3>
              <p className="text-sm text-gray-500">
                Delete all data and start fresh (cannot be undone)
              </p>
            </div>
            <Button
              variant="danger"
              icon={<Trash2 size={16} />}
              className="mt-2 md:mt-0"
              onClick={handleResetClick}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>
      
      {/* AI Settings */}
      <Card>
        <div 
          className="cursor-pointer"
          onClick={() => setShowAISettings(!showAISettings)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">AI Task Breakdown</h2>
            </div>
            {showAISettings ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Configure AI-powered task breakdown for ADHD
          </p>
        </div>
        
        {showAISettings && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <AISettings />
          </div>
        )}
      </Card>
      
      {/* Category Management */}
      <Card>
        <div 
          className="cursor-pointer"
          onClick={() => setShowCategories(!showCategories)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Tag className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Categories</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{categories.length} categories</span>
              {showCategories ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Organize your tasks with custom categories
          </p>
        </div>
        
        {showCategories && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={handleAddCategory}
                className="w-full"
              >
                Add Category
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Duplicate Cleanup */}
      <Card>
        <div 
          className="cursor-pointer"
          onClick={() => setShowDuplicateCleanup(!showDuplicateCleanup)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-amber-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Duplicate Cleanup</h2>
            </div>
            {showDuplicateCleanup ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Find and remove duplicate tasks, projects, and categories
          </p>
        </div>
        
        {showDuplicateCleanup && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <DuplicateCleanupLocal />
          </div>
        )}
      </Card>
      
      {/* Time Management Settings */}
      <Card>
        <div 
          className="cursor-pointer"
          onClick={() => setShowTimeManagement(!showTimeManagement)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Time Management</h2>
            </div>
            {showTimeManagement ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Configure time-related settings for better ADHD management
          </p>
        </div>
        
        {showTimeManagement && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Buffer Time Between Tasks
              </label>
              <select
                value={settings.timeManagement.defaultBufferTime}
                onChange={(e) => updateSettings({
                  timeManagement: {
                    ...settings.timeManagement,
                    defaultBufferTime: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0">No buffer</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Automatically add transition time between scheduled tasks
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.timeManagement.timeBlindnessAlerts}
                  onChange={(e) => updateSettings({
                    timeManagement: {
                      ...settings.timeManagement,
                      timeBlindnessAlerts: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Time Blindness Alerts</span>
              </label>
              <p className="mt-1 ml-7 text-sm text-gray-500">
                Get periodic reminders of the current time
              </p>
            </div>

            {settings.timeManagement.timeBlindnessAlerts && (
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Frequency
                </label>
                <select
                  value={settings.timeManagement.timeBlindnessInterval}
                  onChange={(e) => updateSettings({
                    timeManagement: {
                      ...settings.timeManagement,
                      timeBlindnessInterval: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every hour</option>
                  <option value="120">Every 2 hours</option>
                </select>
              </div>
            )}

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.timeManagement.autoAdjustEstimates}
                  onChange={(e) => updateSettings({
                    timeManagement: {
                      ...settings.timeManagement,
                      autoAdjustEstimates: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-adjust Time Estimates</span>
              </label>
              <p className="mt-1 ml-7 text-sm text-gray-500">
                Learn from your actual task completion times
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Getting Ready Time for Appointments
              </label>
              <select
                value={settings.timeManagement.gettingReadyTime}
                onChange={(e) => updateSettings({
                  timeManagement: {
                    ...settings.timeManagement,
                    gettingReadyTime: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Add preparation time before appointments automatically
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Visual Preferences */}
      <Card>
        <div 
          className="cursor-pointer"
          onClick={() => setShowVisualPreferences(!showVisualPreferences)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Visual Preferences</h2>
            </div>
            {showVisualPreferences ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Customize the appearance for better focus
          </p>
        </div>
        
        {showVisualPreferences && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={settings.visual.fontSize}
                onChange={(e) => updateSettings({
                  visual: {
                    ...settings.visual,
                    fontSize: e.target.value as 'small' | 'medium' | 'large'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout Density
              </label>
              <select
                value={settings.visual.layoutDensity}
                onChange={(e) => updateSettings({
                  visual: {
                    ...settings.visual,
                    layoutDensity: e.target.value as 'compact' | 'comfortable' | 'spacious'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Adjust spacing between elements
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.visual.reduceAnimations}
                  onChange={(e) => updateSettings({
                    visual: {
                      ...settings.visual,
                      reduceAnimations: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Reduce Animations</span>
              </label>
              <p className="mt-1 ml-7 text-sm text-gray-500">
                Minimize motion for less distraction
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.visual.highContrast}
                  onChange={(e) => updateSettings({
                    visual: {
                      ...settings.visual,
                      highContrast: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
              </label>
              <p className="mt-1 ml-7 text-sm text-gray-500">
                Increase contrast for better visibility
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Colors
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">High:</span>
                  <input
                    type="color"
                    value={settings.visual.customPriorityColors.high}
                    onChange={(e) => updateSettings({
                      visual: {
                        ...settings.visual,
                        customPriorityColors: {
                          ...settings.visual.customPriorityColors,
                          high: e.target.value
                        }
                      }
                    })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm font-mono text-gray-600">
                    {settings.visual.customPriorityColors.high}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">Medium:</span>
                  <input
                    type="color"
                    value={settings.visual.customPriorityColors.medium}
                    onChange={(e) => updateSettings({
                      visual: {
                        ...settings.visual,
                        customPriorityColors: {
                          ...settings.visual.customPriorityColors,
                          medium: e.target.value
                        }
                      }
                    })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm font-mono text-gray-600">
                    {settings.visual.customPriorityColors.medium}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">Low:</span>
                  <input
                    type="color"
                    value={settings.visual.customPriorityColors.low}
                    onChange={(e) => updateSettings({
                      visual: {
                        ...settings.visual,
                        customPriorityColors: {
                          ...settings.visual.customPriorityColors,
                          low: e.target.value
                        }
                      }
                    })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm font-mono text-gray-600">
                    {settings.visual.customPriorityColors.low}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* About */}
      <Card title="About TaskManager">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            TaskManager is a personal productivity app that helps you organize your tasks, projects, and daily schedule.
          </p>
          <p className="text-sm text-gray-600">
            Version 1.0.0
          </p>
        </div>
      </Card>
      
      {/* Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Data"
      >
        <div className="space-y-4">
          {!importSuccess ? (
            <>
              <p className="text-gray-600">
                Select a TaskManager export file (.json) to import. This will add the data to your existing data.
              </p>
              
              <div className="mt-4">
                <input
                  type="file"
                  accept=".json"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={handleFileChange}
                />
              </div>
              
              {importError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{importError}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setImportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImportData}
                  disabled={!importFile}
                >
                  Import
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Import Successful</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your data has been imported successfully.
              </p>
            </div>
          )}
        </div>
      </Modal>
      
      {/* Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Data"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Warning: This action cannot be undone</p>
              <p className="text-sm">All your tasks, projects, and categories will be permanently deleted.</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Consider exporting your data before resetting if you might want to restore it later.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleResetConfirm}
            >
              Reset All Data
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter category name"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={categoryColor}
                onChange={(e) => setCategoryColor(e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <div
                className="w-24 h-10 rounded-md border border-gray-300 flex items-center justify-center text-sm font-mono"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryColor}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveCategory}
              disabled={!categoryName.trim()}
            >
              {editingCategory ? 'Save' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">This action cannot be undone</p>
              <p className="text-sm">Tasks with this category will still exist but won't have this category.</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Are you sure you want to delete this category?
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteCategoryId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteCategory}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Check icon for success message
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

export default SettingsPage;