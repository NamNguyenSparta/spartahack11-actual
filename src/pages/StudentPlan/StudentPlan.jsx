import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line, ComposedChart, Area } from 'recharts';
import { GraduationCap, Calendar, Target, TrendingUp, BookOpen, Home, Coffee, Car, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Header from '../../components/Layout/Header';
import './StudentPlan.css';

const yearlyPlan = [
    {
        year: 'Year 1',
        label: 'Freshman',
        tuition: 12500,
        housing: 9600,
        books: 900,
        food: 3600,
        transport: 1200,
        personal: 2400,
        total: 30200,
        aid: 9895,
        loans: 12500,
        gap: 7805,
    },
    {
        year: 'Year 2',
        label: 'Sophomore',
        tuition: 12875,
        housing: 9888,
        books: 850,
        food: 3800,
        transport: 1300,
        personal: 2600,
        total: 31313,
        aid: 9895,
        loans: 14000,
        gap: 7418,
    },
    {
        year: 'Year 3',
        label: 'Junior',
        tuition: 13261,
        housing: 8500,
        books: 800,
        food: 4000,
        transport: 1400,
        personal: 2800,
        total: 30761,
        aid: 9895,
        loans: 15000,
        gap: 5866,
    },
    {
        year: 'Year 4',
        label: 'Senior',
        tuition: 13659,
        housing: 8755,
        books: 700,
        food: 4200,
        transport: 1500,
        personal: 3000,
        total: 31814,
        aid: 9895,
        loans: 8500,
        gap: 13419,
    },
];

const monthlyBudget = [
    { month: 'Sep', budget: 2200, actual: 2150, savings: 50 },
    { month: 'Oct', budget: 2200, actual: 2380, savings: -180 },
    { month: 'Nov', budget: 2200, actual: 2100, savings: 100 },
    { month: 'Dec', budget: 2500, actual: 2650, savings: -150 },
    { month: 'Jan', budget: 2200, actual: 2050, savings: 150 },
    { month: 'Feb', budget: 2200, actual: 0, savings: 0 },
];

const currentExpenses = [
    { category: 'Housing', icon: Home, amount: 800, budget: 800, color: '#ec4899' },
    { category: 'Food & Dining', icon: Coffee, amount: 320, budget: 350, color: '#8b5cf6' },
    { category: 'Transportation', icon: Car, amount: 110, budget: 120, color: '#06b6d4' },
    { category: 'Books & Supplies', icon: BookOpen, amount: 85, budget: 100, color: '#10b981' },
    { category: 'Personal', icon: DollarSign, amount: 215, budget: 200, color: '#f59e0b' },
];

const milestones = [
    { id: 1, title: 'Complete FAFSA', date: '2025-10-01', status: 'completed' },
    { id: 2, title: 'Accept Financial Aid', date: '2025-12-15', status: 'completed' },
    { id: 3, title: 'Pay Tuition Balance', date: '2026-01-15', status: 'completed' },
    { id: 4, title: 'Apply for Scholarships', date: '2026-03-01', status: 'upcoming' },
    { id: 5, title: 'Summer Job Search', date: '2026-04-01', status: 'upcoming' },
    { id: 6, title: 'Renew FAFSA', date: '2026-10-01', status: 'future' },
];

export default function StudentPlan() {
    const [selectedYear, setSelectedYear] = useState(0);
    const currentYear = yearlyPlan[selectedYear];

    return (
        <>
            <Header title="Student Financial Plan" subtitle="Your 4-year education budget timeline" />
            <div className="page-content">
                <div className="student-plan-layout">
                    {/* 4-Year Timeline Chart */}
                    <div className="card timeline-card">
                        <div className="card-header">
                            <h3><Calendar size={18} /> 4-Year Cost Timeline</h3>
                            <div className="year-selector">
                                {yearlyPlan.map((year, idx) => (
                                    <button
                                        key={year.year}
                                        className={`year-btn ${selectedYear === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedYear(idx)}
                                    >
                                        {year.year}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="timeline-chart">
                            <ResponsiveContainer width="100%" height={260}>
                                <ComposedChart data={yearlyPlan}>
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12 }} />
                                    <Legend />
                                    <Bar dataKey="total" name="Total Cost" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                                    <Line type="monotone" dataKey="aid" name="Financial Aid" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                                    <Line type="monotone" dataKey="loans" name="Loans" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Year Details */}
                    <div className="year-details">
                        <div className="card year-breakdown">
                            <div className="card-header">
                                <h3><GraduationCap size={18} /> {currentYear.year}: {currentYear.label}</h3>
                            </div>
                            <div className="breakdown-grid">
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Tuition & Fees</span>
                                    <span className="breakdown-value">${currentYear.tuition.toLocaleString()}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Housing</span>
                                    <span className="breakdown-value">${currentYear.housing.toLocaleString()}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Books & Supplies</span>
                                    <span className="breakdown-value">${currentYear.books.toLocaleString()}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Food & Meal Plan</span>
                                    <span className="breakdown-value">${currentYear.food.toLocaleString()}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Transportation</span>
                                    <span className="breakdown-value">${currentYear.transport.toLocaleString()}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Personal Expenses</span>
                                    <span className="breakdown-value">${currentYear.personal.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="breakdown-summary">
                                <div className="summary-row total">
                                    <span>Total Cost</span>
                                    <span>${currentYear.total.toLocaleString()}</span>
                                </div>
                                <div className="summary-row aid">
                                    <span>- Financial Aid</span>
                                    <span>-${currentYear.aid.toLocaleString()}</span>
                                </div>
                                <div className="summary-row loans">
                                    <span>- Loans</span>
                                    <span>-${currentYear.loans.toLocaleString()}</span>
                                </div>
                                <div className="summary-row gap">
                                    <span>Funding Gap</span>
                                    <span>${currentYear.gap.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Budget Tracker */}
                        <div className="card monthly-tracker">
                            <div className="card-header">
                                <h3><Target size={18} /> Monthly Budget Tracker</h3>
                            </div>
                            <div className="expense-bars">
                                {currentExpenses.map((exp) => (
                                    <div key={exp.category} className="expense-row">
                                        <div className="expense-info">
                                            <div className="expense-icon" style={{ background: `${exp.color}15`, color: exp.color }}>
                                                <exp.icon size={16} />
                                            </div>
                                            <span className="expense-name">{exp.category}</span>
                                        </div>
                                        <div className="expense-bar-wrap">
                                            <div className="expense-bar">
                                                <div
                                                    className="expense-fill"
                                                    style={{
                                                        width: `${Math.min(100, (exp.amount / exp.budget) * 100)}%`,
                                                        background: exp.amount > exp.budget ? '#f43f5e' : exp.color
                                                    }}
                                                />
                                            </div>
                                            <div className="expense-amounts">
                                                <span>${exp.amount}</span>
                                                <span className="budget-amount">/ ${exp.budget}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Milestones & Alerts */}
                    <div className="milestones-section">
                        <div className="card milestones-card">
                            <div className="card-header">
                                <h3>📅 Financial Milestones</h3>
                            </div>
                            <div className="milestones-list">
                                {milestones.map((milestone) => (
                                    <div key={milestone.id} className={`milestone-item ${milestone.status}`}>
                                        <div className="milestone-icon">
                                            {milestone.status === 'completed' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                        </div>
                                        <div className="milestone-info">
                                            <span className="milestone-title">{milestone.title}</span>
                                            <span className="milestone-date">{new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <span className={`milestone-status ${milestone.status}`}>{milestone.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card savings-card">
                            <div className="savings-header">
                                <TrendingUp size={24} />
                                <div>
                                    <h4>On Track!</h4>
                                    <p>Your spending is 3% under budget this semester</p>
                                </div>
                            </div>
                            <div className="savings-chart">
                                <ResponsiveContainer width="100%" height={120}>
                                    <BarChart data={monthlyBudget} barGap={4}>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Tooltip formatter={(v) => `$${v}`} contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }} />
                                        <Bar dataKey="budget" name="Budget" fill="#e5e5e5" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
