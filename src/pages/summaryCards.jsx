import React from 'react';
import { useSelector } from 'react-redux';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const SummaryCards = () => {
    const { employees, loading } = useSelector((state) => state.employees);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-36 bg-dark-700 rounded-xl animate-pulse"
                    ></div>
                ))}
            </div>
        );
    }

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp) => emp.isActive).length;
    const inactiveEmployees = employees.filter((emp) => !emp.isActive).length;
    const maleEmployees = employees.filter((emp) => emp.gender === 'Male').length;
    const femaleEmployees = employees.filter((emp) => emp.gender === 'Female').length;

    const cards = [
        {
            title: 'Total Employees',
            value: totalEmployees,
            icon: Users,
            color: 'from-primary-500 to-orange-500',
            bgColor: 'bg-primary-500/10',
            borderColor: 'border-primary-500/20',
            subtitle: `${maleEmployees}M / ${femaleEmployees}F`,
        },
        {
            title: 'Active Employees',
            value: activeEmployees,
            icon: UserCheck,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
            subtitle: `${totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(0) : 0}% of total`,
        },
        {
            title: 'Inactive Employees',
            value: inactiveEmployees,
            icon: UserX,
            color: 'from-red-500 to-pink-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/20',
            subtitle: `${totalEmployees > 0 ? ((inactiveEmployees / totalEmployees) * 100).toFixed(0) : 0}% of total`,
        },
        {
            title: 'Growth Rate',
            value: '+12%',
            icon: TrendingUp,
            color: 'from-purple-500 to-indigo-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            subtitle: 'This quarter',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        className={`card ${card.bgColor} border ${card.borderColor} hover:border-opacity-50 group`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-400 mb-1">
                                    {card.title}
                                </h3>
                                <p className="text-3xl font-display font-bold text-white mb-1">
                                    {card.value}
                                </p>
                                <p className="text-xs text-gray-500">{card.subtitle}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SummaryCards;
