import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteEmployee,
    toggleEmployeeStatus,
    setSearchQuery,
    setGenderFilter,
    setStatusFilter,
    selectFilteredEmployees,
} from '../redux/slices/employeesSlice';
import { Search, Filter, Printer, Edit2, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

const EmployeeList = ({ onEdit }) => {
    const dispatch = useDispatch();
    const filteredEmployees = useSelector(selectFilteredEmployees);
    const { loading, error, filters } = useSelector((state) => state.employees);
    const { searchQuery, genderFilter, statusFilter } = filters;

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            dispatch(deleteEmployee(id));
        }
    };

    const handleToggleStatus = (employee) => {
        dispatch(
            toggleEmployeeStatus({
                id: employee.id,
                currentStatus: employee.isActive,
                employeeData: employee,
            })
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        const headers = ['Employee ID', 'Full Name', 'Gender', 'Date of Birth', 'State', 'Status'];
        const csvData = filteredEmployees.map((emp) => [
            emp.id,
            emp.fullName,
            emp.gender,
            format(new Date(emp.dateOfBirth), 'MM/dd/yyyy'),
            emp.state,
            emp.isActive ? 'Active' : 'Inactive',
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `employees_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="h-16 bg-dark-700 rounded-lg mb-6"></div>
                <div className="h-96 bg-dark-700 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border-red-500/50 bg-red-500/10 text-center py-8">
                <div className="text-red-400 text-xl font-semibold mb-2">Error Loading Employees</div>
                <p className="text-gray-400">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in">
            {/* Filters Header */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        className="input-field pl-12 w-full"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-2 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg min-w-[140px]">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={genderFilter}
                            onChange={(e) => dispatch(setGenderFilter(e.target.value))}
                            className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer flex-1"
                        >
                            <option value="all">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg min-w-[140px]">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                            className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer flex-1"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button
                        onClick={handleExport}
                        className="p-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-400 hover:bg-dark-600 hover:text-primary-400 transition-all duration-300"
                        title="Export CSV"
                    >
                        <Download className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handlePrint}
                        className="no-print p-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-400 hover:bg-dark-600 hover:text-primary-400 transition-all duration-300"
                        title="Print"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Table */}
            {filteredEmployees.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No employees found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-dark-600">
                        <table className="w-full">
                            <thead className="bg-dark-900 border-b-2 border-dark-600">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Employee ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Profile
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Gender
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Date of Birth
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        State
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="no-print px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-dark-700 divide-y divide-dark-600">
                                {filteredEmployees.map((employee, index) => (
                                    <tr
                                        key={employee.id}
                                        className="hover:bg-primary-500/5 transition-colors duration-200 animate-slide-in"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-md text-xs font-mono font-semibold">
                                                {employee.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={employee.profileImage}
                                                alt={employee.fullName}
                                                className="w-12 h-12 rounded-full border-2 border-dark-600 hover:border-primary-500 transition-all duration-300 hover:scale-110"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-white">{employee.fullName}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {employee.gender}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {format(new Date(employee.dateOfBirth), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {employee.state}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(employee)}
                                                className={`no-print px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 ${employee.isActive
                                                    ? 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20'
                                                    : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                                                    }`}
                                            >
                                                {employee.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                            <span className="print-only">
                                                {employee.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="no-print px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onEdit(employee)}
                                                    className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/20 hover:scale-110 transition-all duration-300"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:scale-110 transition-all duration-300"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-dark-600">
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-bold text-primary-400">{filteredEmployees.length}</span>{' '}
                            employee{filteredEmployees.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmployeeList;
