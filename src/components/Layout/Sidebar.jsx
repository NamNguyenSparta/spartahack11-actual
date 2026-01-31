import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileCheck, ShieldCheck, Wallet, CreditCard, PiggyBank, GraduationCap, Receipt, TrendingUp, Settings, HelpCircle, Bell, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

export default function Sidebar() {
    const { currentPersona } = useApp();

    const mainNav = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/cards', icon: CreditCard, label: 'Cards' },
        { path: '/investments', icon: TrendingUp, label: 'Investments' },
        { path: '/loans', icon: PiggyBank, label: 'Loans & Aid' },
        { path: '/student-plan', icon: GraduationCap, label: 'Student Plan' },
        { path: '/subscriptions', icon: Receipt, label: 'Subscriptions' },
    ];

    const trustNav = [
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/passport', icon: FileCheck, label: 'Passport' },
        { path: '/verify', icon: ShieldCheck, label: 'Verification' },
    ];

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <Wallet size={22} />
                </div>
                <span className="logo-text">Credence</span>
            </div>

            {/* User Profile Card */}
            <div className="user-card">
                <div className="user-avatar">{currentPersona.avatar}</div>
                <div className="user-info">
                    <span className="user-name">{currentPersona.name}</span>
                    <span className="user-type">{currentPersona.type}</span>
                </div>
                <button className="notification-btn">
                    <Bell size={18} />
                    <span className="notification-dot" />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-section-title">Menu</span>
                    {mainNav.map((item) => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Trust Score</span>
                    {trustNav.map((item) => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="nav-section">
                    <span className="nav-section-title">Support</span>
                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={20} /><span>Settings</span>
                    </NavLink>
                    <NavLink to="/help" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <HelpCircle size={20} /><span>Help Center</span>
                    </NavLink>
                </div>
            </nav>

            {/* Upgrade Card */}
            <div className="upgrade-card">
                <div className="upgrade-icon">✨</div>
                <h4>Go Premium</h4>
                <p>Unlock all features & higher limits</p>
                <button className="btn btn-primary btn-sm w-full">Upgrade Now</button>
            </div>
        </aside>
    );
}
