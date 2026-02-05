import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { LogOut, UserPlus, User } from 'lucide-react';

const Header = ({ onAddEmployee }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-800/80 backdrop-blur-xl border-b border-dark-600 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-20 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-r from-primary-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text hidden sm:block">
                            EmployeeHub
                        </span>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Add Employee Button */}
                        <button
                            onClick={onAddEmployee}
                            className="btn-primary flex items-center gap-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                        >
                            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Add Employee</span>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-400">{user?.role}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 sm:p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-105"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
