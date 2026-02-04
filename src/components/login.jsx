import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from '../redux/slices/authSlice';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error: authError } = useSelector((state) => state.auth);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setError('');

        // Simulate API delay
        setTimeout(() => {
            const result = dispatch(login(data.email, data.password));

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || authError);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-5">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="bg-dark-800/80 backdrop-blur-xl border border-dark-600 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-orange-500 rounded-full mb-6 shadow-lg shadow-primary-500/30">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                            Employee Portal
                        </h1>
                        <p className="text-gray-400">Sign in to manage your team</p>
                    </div>

                    {/* Error Message */}
                    {(error || authError) && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 animate-slide-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error || authError}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    className={`input-field pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    disabled={loading}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className={`input-field pl-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                    disabled={loading}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 pt-6 border-t border-dark-600">
                        <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
                            <p className="text-sm font-semibold text-primary-400 mb-3">Demo Credentials:</p>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Email:</span>
                                    <span>admin@example.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">Password:</span>
                                    <span>admin123</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
