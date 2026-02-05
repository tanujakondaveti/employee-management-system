import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../redux/slices/employeesSlice';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.employees);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setShowForm(true);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEmployee(null);
    };

    return (
        <div className="min-h-screen bg-dark-900">
            <Header onAddEmployee={handleAddEmployee} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                        Employee Management
                    </h1>
                    <p className="text-gray-400 text-lg">Manage your team efficiently</p>
                </div>

                <SummaryCards />

                <EmployeeList onEdit={handleEditEmployee} />

                {showForm && (
                    <EmployeeForm
                        employee={editingEmployee}
                        onClose={handleCloseForm}
                    />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
