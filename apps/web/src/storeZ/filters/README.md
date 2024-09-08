# Task Filtering System

## Overview

The Task Filtering System allows you to filter tasks based on various conditions, including simple and complex logic, such as `AND`/`OR` combinations, array checks, and more. This README provides detailed documentation on how to use the filtering system, including examples of simple, medium, and advanced use cases.

## Table of Contents

1. [FilterCondition Type](#filtercondition-type)
2. [TaskFilter Type](#taskfilter-type)
3. [checkCondition Function](#checkcondition-function)
4. [filterTasks Function](#filtertasks-function)
5. [Usage Examples](#usage-examples)
    - [Easy Example](#easy-example)
    - [Medium Example](#medium-example)
    - [Advanced Example](#advanced-example)
    - [Label Matching Example](#label-matching-example)

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

## TaskFilter Type

The `TaskFilter` type represents a complete filter, including the logic (`AND`/`OR`) and an array of conditions.

```typescript
type TaskFilter = {
  logic: 'AND' | 'OR'; // The logical operator to combine conditions
  conditions: FilterCondition[]; // An array of conditions to apply
};
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

## filterTasks Function

The `filterTasks` function applies a `TaskFilter` to an array of tasks and returns the tasks that match the filter.

```typescript
function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter((task) => {
    return filter.logic === 'AND'
      ? filter.conditions.every((condition) => checkCondition(task, condition))
      : filter.conditions.some((condition) => checkCondition(task, condition));
  });
}
```

## Usage Examples

### Easy Example

**Scenario**: Filter tasks with `HIGH` priority.

```typescript
const easyFilter: TaskFilter = {
  logic: 'AND',
  conditions: [
    {
      field: 'priority',
      value: Priority.HIGH,
      operator: 'equals',
    },
  ],
};

const easyFilteredTasks = filterTasks(tasks, easyFilter);
console.log(easyFilteredTasks);
```

### Medium Example

**Scenario**: Filter tasks assigned to `John Doe` that are due before `September 5th, 2024`.

```typescript
const mediumFilter: TaskFilter = {
  logic: 'AND',
  conditions: [
    {
      field: 'assigneeName',
      value: 'John Doe',
      operator: 'equals',
    },
    {
      field: 'dueDate',
      value: new Date('2024-09-05'),
      operator: 'lessThan',
    },
  ],
};

const mediumFilteredTasks = filterTasks(tasks, mediumFilter);
console.log(mediumFilteredTasks);
```

### Advanced Example

**Scenario**: Filter tasks with `HIGH` priority assigned to either `John Doe` or `Jane Doe`, OR tasks due before `September 5th, 2024`, belonging to "Team One", AND that include both `"Bug"` and `"Feature"` labels.

```typescript
const advancedFilter: TaskFilter = {
  logic: 'AND',
  conditions: [
    {
      field: 'priority',
      value: Priority.HIGH,
      operator: 'equals',
    },
    {
      logic: 'OR',
      conditions: [
        {
          field: 'assigneeName',
          value: 'John Doe',
          operator: 'equals',
        },
        {
          field: 'assigneeName',
          value: 'Jane Doe',
          operator: 'equals',
        },
        {
          logic: 'AND',
          conditions: [
            {
              field: 'dueDate',
              value: new Date('2024-09-05'),
              operator: 'lessThan',
            },
            {
              field: 'Team',
              value: 'Team One',
              operator: 'equals',
            },
          ],
        },
      ],
    },
    {
      field: 'labels',
      value: ['Bug', 'Feature'],
      operator: 'arrayIncludesAll',
    },
  ],
};

const advancedFilteredTasks = filterTasks(tasks, advancedFilter);
console.log(advancedFilteredTasks);
```

### Label Matching Example

**Scenario**: Filter tasks with labels that include any of `"Bug"`, `"Refactor"`, or `"Improvement"`.

```typescript
const labelFilter: TaskFilter = {
  logic: 'AND',
  conditions: [
    {
      field: 'labels',
      value: ['Bug', 'Refactor', 'Improvement'],
      operator: 'arrayIncludesAny',
    },
  ],
};

const labelFilteredTasks = filterTasks(tasks, labelFilter);
console.log(labelFilteredTasks);
```
