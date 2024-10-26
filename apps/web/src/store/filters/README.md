# Task Filtering System

## Overview

The Task Filtering System allows you to filter tasks based on various conditions, including simple and complex logic, such as `AND`/`OR` combinations, array checks, and more. This README provides detailed documentation on how to use the filtering system.

## Table of Contents

1. [FilterCondition Type](#filtercondition-type)
2. [FilterResponse](#filterresponse)
3. [checkCondition Function](#checkcondition-function)
4. [parseFilter Function](#parsefilter-function)
5. [Filter Store API](#filter-store-api)
    - [setCurrentFilter](#setcurrentfilter)
    - [setShowSaveForm](#setshowsaveform)
    - [addFilter](#addfilter)
    - [clearFilter](#clearfilter)
    - [removeFilter](#removefilter)
    - [saveFilter](#savefilter)
    - [getSavedFilters](#getsavedfilters)
    - [updateSavedFilter](#updatesavedfilter)
    - [deleteSavedFilter](#deletesavedfilter)
    - [filterTasks](#filtertasks)
    - [customFilter](#customfilter)
    - [mergeFilters](#mergefilters)

## FilterCondition Type

The `FilterCondition` type defines the structure of an individual filtering condition. It includes the field to be filtered, the value to filter against, and the operator to use.

```typescript
type FilterCondition = {
  field: keyof Task; // The field in the Task object to filter on
  value: FilterValue | Label[]; // The value to compare against (can be a single value or an array for array operations)
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'arrayIncludesAll' | 'arrayIncludesAny'; // The comparison operator
};
```

### Supported Operators

- **`equals`**: Checks if the field equals the specified value.
- **`contains`**: Checks if the string field contains the specified substring.
- **`greaterThan`**: Checks if the numeric field is greater than the specified value.
- **`lessThan`**: Checks if the numeric field is less than the specified value.
- **`arrayIncludesAll`**: Checks if an array field includes all specified values.
- **`arrayIncludesAny`**: Checks if an array field includes any of the specified values.

## FilterResponse

The `FilterResponse` is used to describe the structure of data returned from the API.

```typescript
interface FilterResponse = {
  comment: FilterCondition[] | null; // Can either be an array of FilterCondition objects or null
  message?: string;        // May contain a message
  variant: "default" | "destructive"; // Type of toast to display
}
```

## checkCondition Function

The `checkCondition` function evaluates whether a given task meets a specific filtering condition.

```typescript
function checkCondition(task: Task, condition: FilterCondition): boolean {
  const taskValue = task[condition.field];

  switch (condition.operator) {
    case 'equals':
      return taskValue === condition.value;
    case 'contains':
      return typeof taskValue === 'string' && typeof condition.value === 'string' && taskValue.includes(condition.value);
    case 'greaterThan':
      return typeof taskValue === 'number' && typeof condition.value === 'number' && taskValue > condition.value;
    case 'lessThan':
      return typeof taskValue === 'number' && typeof condition.value === 'number' && taskValue < condition.value;
    case 'arrayIncludesAll':
      return (
        Array.isArray(taskValue) &&
        Array.isArray(condition.value) &&
        (condition.value as Label[]).every((val) => (taskValue as Label[]).includes(val))
      );
    case 'arrayIncludesAny':
      return (
        Array.isArray(taskValue) &&
        Array.isArray(condition.value) &&
        (condition.value as Label[]).some((val) => (taskValue as Label[]).includes(val))
      );
    default:
      return false;
  }
}
```

## parseFilter Function

The `parseFilter` function takes a SavedFilterType object as input and returns a SavedFilter object with parsed filter conditions. This function ensures that filter conditions are consistently structured for further use in filtering logic.

```typescript
parseFilter(newFilter: SavedFilterType): SavedFilter {
  const parsedFilter: SavedFilter = {
    ...newFilter,
    filter:
      (newFilter.filter
        ?.map((condition) =>
          typeof condition === "string"
            ? (JSON.parse(condition) as FilterCondition)
            : condition,
        )
        .filter((condition) => condition !== null) as FilterCondition[]) || [],
  };
```

## Filter Store API

### `setCurrentFilter`

Updates the `currentFilters` state with a new array of filter conditions. It sets the active filter criteria that will be applied to tasks.

```typescript
setCurrentFilter: (filter: FilterCondition[]) => void;
```

### `setShowSaveForm`

Sets the `showSaveForm` state, which controls the visibility of a form for saving filters. The `input` parameter is a boolean that shows or hides the form.

```typescript
setShowSaveForm: (input: boolean) => void;
```

### `addFilter`

Adds a new filter condition to `currentFilters` or updates an existing condition if one for the specified field already exists. Ensures that each field has only one condition, updating the condition if necessary.

```typescript
addFilter: (filter: FilterCondition) => void;
```

### `clearFilter`

Clears the current filters and filter types, effectively resetting the applied filters to their default (empty) state.

```typescript
clearFilter: () => void;
```

### `removeFilter`

Removes a filter condition based on the specified `field` from the current filters, ensuring only relevant filter conditions remain active.

```typescript
removeFilter: (field: string) => void;
```

### `saveFilter`

Asynchronously saves a new filter to the database, assigning it a unique identifier. Adds the saved filter to the list of `savedFilters`, returning a response that includes a success or failure message.

```typescript
saveFilter: (filter: Partial<SavedFilter>) => Promise<FilterResponse>;
```

### `getSavedFilters`

Fetches saved filters for a specific group based on `groupId`. Updates `savedFilters` state with parsed filters, returning them in an array.

```typescript
getSavedFilters: (groupId: string) => Promise<SavedFilter[]>;
```

### `updateSavedFilter`

Updates an existing saved filter (identified by `filterId`) in the database. Replaces the outdated filter with the updated version in `savedFilters` and returns a response with a message about the update's success or failure.

```typescript
updateSavedFilter: (
    filterId: string,
    filter: Partial<SavedFilter>,
  ) => Promise<FilterResponse>;
```

### `deleteSavedFilter`

Deletes a saved filter by `filterId` from the database. If successful, it clears the `currentFilters` to remove any reliance on the deleted filter.

```typescript
deleteSavedFilter: (filterId: string) => Promise<void>;
```

### `filterTasks`

Filters the provided `tasks` array based on the active `currentFilters`. It returns only those tasks that meet all filter conditions.

```typescript
filterTasks: (tasks: Task[]) => Task[];
```

### `customFilter`

Applies a custom array of `filters` to the provided `tasks` array. Returns tasks that match all specified conditions in `filters`.

```typescript
customFilter: (tasks: Task[], filter: FilterCondition[]) => Task[];
```

### `mergeFilters`

Merges the `newFilters` array with existing filters from a saved filter (identified by `savedFilterId`). Ensures that any overlapping fields are updated with the new filter condition and returns the merged result as a unique array of filter conditions.

```typescript
mergeFilters: (
    newFilters: FilterCondition[],
    savedFilterId: string,
  ) => FilterCondition[];
```
