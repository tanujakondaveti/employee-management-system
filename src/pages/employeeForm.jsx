import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addEmployee, updateEmployee } from '../redux/slices/employeesSlice';
import { X, Upload, Save, User } from 'lucide-react';

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
];

const EmployeeForm = ({ employee, onClose }) => {
    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState('');
    const [imageError, setImageError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: employee?.fullName || '',
            gender: employee?.gender || 'Male',
            dateOfBirth: employee?.dateOfBirth || '',
            state: employee?.state || 'California',
            isActive: employee?.isActive !== undefined ? employee.isActive : true,
            profileImage: employee?.profileImage || '',
        },
    });

    useEffect(() => {
        if (employee?.profileImage) {
            setImagePreview(employee.profileImage);
        }
    }, [employee]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Image size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setValue('profileImage', reader.result);
                setImageError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // If no custom image, use a placeholder
            const finalData = {
                ...data,
                profileImage: data.profileImage ||
                    `https://i.pravatar.cc/150?img=${data.gender === 'Male' ? '12' : '5'}`,
            };

            if (employee) {
                await dispatch(updateEmployee({ id: employee.id, data: finalData }));
            } else {
                await dispatch(addEmployee(finalData));
            }

            onClose();
        } catch (error) {
            console.error('Error saving employee:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateAge = (value) => {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();

        if (age < 18) return 'Employee must be at least 18 years old';
        if (age > 100) return 'Please enter a valid date of birth';
        return true;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-dark-800 border-b border-dark-600 px-8 py-6 flex items-center justify-between z-10">
                    <h2 className="text-3xl font-display font-bold gradient-text">
                        {employee ? 'Edit Employee' : 'Add New Employee'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 hover:rotate-90 transition-all duration-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                    {/* Image Section */}
                    <div className="mb-8 flex flex-col items-center gap-4 p-6 bg-dark-700 border border-dark-600 rounded-xl">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-500 bg-dark-900 flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <User className="w-12 h-12" />
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}
                        </div>

                        <label className="btn-primary cursor-pointer flex items-center gap-2 text-sm">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        {imageError && (
                            <p className="text-sm text-red-400">{imageError}</p>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                className={`input-field ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                                {...register('fullName', {
                                    required: 'Full name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Gender and DOB Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Gender <span className="text-red-400">*</span>
                                </label>
                                <select
                                    className="input-field"
                                    {...register('gender')}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Date of Birth <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-field ${errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    {...register('dateOfBirth', {
                                        required: 'Date of birth is required',
                                        validate: validateAge,
                                    })}
                                />
                                {errors.dateOfBirth && (
                                    <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth.message}</p>
                                )}
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                State <span className="text-red-400">*</span>
                            </label>
                            <select
                                className={`input-field ${errors.state ? 'border-red-500 focus:ring-red-500' : ''}`}
                                {...register('state', { required: 'State is required' })}
                            >
                                <option value="">Select a state</option>
                                {US_STATES.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            {errors.state && (
                                <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>
                            )}
                        </div>

                        {/* Active Status */}
                        <div>
                            <label className="flex items-center gap-3 p-4 bg-dark-700 border border-dark-600 rounded-lg cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded bg-dark-600 border-dark-500 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                                    {...register('isActive')}
                                />
                                <span className="text-white font-medium">Active Employee</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-dark-600 flex gap-3 justify-end sticky bottom-0 bg-dark-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {employee ? 'Update Employee' : 'Add Employee'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;
