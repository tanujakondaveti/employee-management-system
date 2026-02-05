import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000/employees';

// Generate unique employee ID
const generateEmployeeId = () => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `EMP${randomNum}`;
};

// Async thunks
export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addEmployee = createAsyncThunk(
    'employees/addEmployee',
    async (employeeData, { rejectWithValue }) => {
        try {
            const newEmployee = {
                id: generateEmployeeId(),
                ...employeeData,
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee),
            });

            if (!response.ok) throw new Error('Failed to add employee');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update employee');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete employee');
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleEmployeeStatus = createAsyncThunk(
    'employees/toggleStatus',
    async ({ id, currentStatus, employeeData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...employeeData, isActive: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to toggle status');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    employees: [],
    loading: false,
    error: null,
    filters: {
        searchQuery: '',
        genderFilter: 'all',
        statusFilter: 'all',
    },
};

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.filters.searchQuery = action.payload;
        },
        setGenderFilter: (state, action) => {
            state.filters.genderFilter = action.payload;
        },
        setStatusFilter: (state, action) => {
            state.filters.statusFilter = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                searchQuery: '',
                genderFilter: 'all',
                statusFilter: 'all',
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch employees
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add employee
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update employee
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.employees.findIndex(emp => emp.id === action.payload.id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete employee
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(emp => emp.id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Toggle status
            .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
                const index = state.employees.findIndex(emp => emp.id === action.payload.id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(toggleEmployeeStatus.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { setSearchQuery, setGenderFilter, setStatusFilter, clearFilters } = employeesSlice.actions;

// Selectors
const selectEmployees = (state) => state.employees.employees;
const selectFilters = (state) => state.employees.filters;

export const selectFilteredEmployees = createSelector(
    [selectEmployees, selectFilters],
    (employees, filters) => {
        const { searchQuery, genderFilter, statusFilter } = filters;

        return employees.filter((emp) => {
            const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGender = genderFilter === 'all' || emp.gender === genderFilter;
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && emp.isActive) ||
                (statusFilter === 'inactive' && !emp.isActive);

            return matchesSearch && matchesGender && matchesStatus;
        });
    }
);

export default employeesSlice.reducer;