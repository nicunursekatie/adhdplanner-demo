# ADHD Planner Demo

This is a demonstration version of the ADHD Planner app with Supabase connectivity removed for local-only operation.

## Changes Made for Demo

- **Removed Supabase Integration**: All database connectivity has been disabled
- **Local Storage Only**: Data is stored in browser localStorage
- **No Personal Data**: Demo version has been cleaned of any personal information
- **Demo Data Clearing**: Added "Clear Demo Data" button in Settings

## Running the Demo

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173` (or next available port).

## Demo Features

- Task management with priorities and categories
- Project planning and breakdown
- Calendar integration
- Weekly review system
- Planning tools (backward planning, daily planner)
- Time management features
- Data import/export

## For Demonstration

1. **Clear Demo Data**: Go to Settings → Data Management → "Clear Demo Data"
2. **Load Sample Data**: Use "Load Samples" button to populate with demo content
3. **Export/Import**: Test data portability features

## Note

This demo version uses localStorage only. All data will be lost when clearing browser data.