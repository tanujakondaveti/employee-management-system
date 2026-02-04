import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            // Persist to localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            // Clear localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        },
        restoreAuth: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreAuth } = authSlice.actions;

// Thunk for login
export const login = (email, password) => (dispatch) => {
    dispatch(loginStart());

    // Mock authentication
    const mockUsers = [
        { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'Administrator' },
        { email: 'user@example.com', password: 'user123', name: 'Regular User', role: 'User' },
    ];

    const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
    );

    if (foundUser) {
        const userData = { email: foundUser.email, name: foundUser.name, role: foundUser.role };
        dispatch(loginSuccess(userData));
        return { success: true };
    } else {
        dispatch(loginFailure('Invalid email or password'));
        return { success: false, error: 'Invalid email or password' };
    }
};

export default authSlice.reducer;