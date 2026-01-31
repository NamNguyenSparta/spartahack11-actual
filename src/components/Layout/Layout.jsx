import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileCheck, Building2, Rocket, Users, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Layout.css';

export default function Layout() {
    const navigate = useNavigate();
    const { currentPersona, personas, switchPersona, viewMode, toggleViewMode } = useApp();

    const userNav = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/insights', icon: BarChart3, label: 'Insights' },
        { path: '/passport', icon: FileCheck, label: 'Trust Passport' },
    ];

    const handleDemoMode = () => {
        switchPersona('responsibleStudent');
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
                </div>

                {/* View Mode Toggle */}
                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'user' ? 'active' : ''}`}
                        onClick={() => viewMode !== 'user' && toggleViewMode()}
                    >
                        <Users size={16} />
                        User View
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'business' ? 'active' : ''}`}
                        onClick={() => viewMode !== 'business' && toggleViewMode()}
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
                    <span className="nav-section">Demo Persona</span>
                    <div className="persona-list">
                        {Object.entries(personas).map(([id, persona]) => (
                            <button
                                key={id}
                                className={`persona-item ${currentPersona.id === persona.id ? 'active' : ''}`}
                                onClick={() => switchPersona(id)}
                            >
                                <span className="persona-avatar">{persona.avatar}</span>
                                <div className="persona-info">
                                    <span className="persona-name">{persona.name}</span>
                                </div>
                                {currentPersona.id === persona.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Demo Mode Button */}
                <div className="sidebar-footer">
                    <button className="demo-btn" onClick={handleDemoMode}>
                        <Rocket size={18} />
                        Demo Mode
                    </button>
                    <p className="tagline">Built for the credit invisible.</p>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
