import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileCheck, Building2, Rocket, Users, ChevronRight, Zap, GraduationCap, TrendingUp, Moon, Sun, Crown, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Layout.css';

export default function Layout() {
    const navigate = useNavigate();
    const { currentPersonaId, switchPersona, viewMode, setViewMode } = useApp();
    const [isDark, setIsDark] = useState(false);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const userNav = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/student', icon: GraduationCap, label: 'Finance Manager' },
        { path: '/wallet', icon: Wallet, label: 'My Wallet', pro: true },
        { path: '/investments', icon: TrendingUp, label: 'Investments', pro: true },
        { path: '/insights', icon: BarChart3, label: 'AI Accountant' },
        { path: '/passport', icon: FileCheck, label: 'Trust Passport' },
        { path: '/simulator', icon: Zap, label: 'Future Simulator' },
    ];

    // Mobile navigation - subset of most important items
    const mobileNav = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/wallet', icon: Wallet, label: 'Wallet' },
        { path: '/student', icon: GraduationCap, label: 'Finance' },
        { path: '/passport', icon: FileCheck, label: 'Passport' },
        { path: '/insights', icon: BarChart3, label: 'AI' },
    ];

    const demoPersonas = [
        { id: 'responsible-student', name: 'Scholarship Student', avatar: '🎓' },
        { id: 'volatile-freelancer', name: 'Student w/ Loans', avatar: '💸' },
        { id: 'perfect-payer', name: 'Graduated Alumni', avatar: '⭐' },
    ];

    const handleDemoMode = () => {
        switchPersona('responsible-student');
        navigate('/');
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <span>C</span>
                    </div>
                    <span className="logo-text">Credence</span>
                    <span className="pro-badge">PRO</span>
                </div>

                {/* View Mode Toggle */}
                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'user' ? 'active' : ''}`}
                        onClick={() => setViewMode('user')}
                    >
                        <Users size={16} />
                        User View
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'business' ? 'active' : ''}`}
                        onClick={() => setViewMode('business')}
                    >
                        <Building2 size={16} />
                        Business View
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {viewMode === 'user' ? (
                        <>
                            <span className="nav-section">Menu</span>
                            {userNav.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    end={item.path === '/'}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                    {item.pro && <Crown size={14} className="pro-icon" />}
                                </NavLink>
                            ))}
                        </>
                    ) : (
                        <>
                            <span className="nav-section">Business Portal</span>
                            <NavLink to="/business" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Building2 size={20} />
                                <span>Applicant Review</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Persona Selector (Demo) */}
                <div className="persona-section">
                    <span className="nav-section">Select Persona</span>
                    <div className="persona-list">
                        {demoPersonas.map((persona) => (
                            <button
                                key={persona.id}
                                className={`persona-item ${currentPersonaId === persona.id ? 'active' : ''}`}
                                onClick={() => switchPersona(persona.id)}
                            >
                                <span className="persona-avatar">{persona.avatar}</span>
                                <div className="persona-info">
                                    <span className="persona-name">{persona.name}</span>
                                </div>
                                {currentPersonaId === persona.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="sidebar-footer">
                    {/* Theme Toggle */}
                    <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button className="demo-btn" onClick={handleDemoMode}>
                        <Rocket size={18} />
                        Reset Demo
                    </button>
                    <p className="tagline">Built for the credit invisible.</p>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav">
                {mobileNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/'}
                    >
                        <item.icon size={22} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

