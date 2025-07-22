# Marking Criterias Module

## Overview

The Marking Criterias module allows administrators to configure assessment criteria that will be used across all games for evaluating student performance.

## Features

- View all existing marking criteria
- Add new marking criteria
- Edit existing marking criteria
- Delete marking criteria

## Components

- **MarkingCriterias.jsx**: Main page component that handles the criteria management
- **CriteriaItem.jsx**: Reusable component for displaying individual criteria with edit/delete functionality

## API Endpoints

- `GET /api/v1/criteria`: Retrieves all criteria
- `POST /api/v1/criteria`: Creates a new criterion
- `PUT /api/v1/criteria/:id`: Updates an existing criterion
- `DELETE /api/v1/criteria/:id`: Deletes a criterion

## How it works

1. The page loads and fetches all existing criteria from the backend
2. Users can add new criteria through the form on the left
3. Existing criteria are displayed on the right with options to edit or delete
4. When editing, the criteria text field becomes editable inline
5. Deletion requires confirmation through a modal dialog

## Future Improvements

- Add ability to group criteria by game type
- Add weighting or importance level for different criteria
- Support for rich text formatting in criteria descriptions
- Import/export functionality for criteria sets
