import { Search, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Header.css';

export default function Header({ title, subtitle }) {
    const { currentPersona, personas, switchPersona, demoMode, judgeView, toggleJudgeView } = useApp();

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-titles">
                    <h1 className="header-title">{title}</h1>
                    {subtitle && <p className="header-subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="header-right">
                {demoMode && (
                    <div className="persona-selector">
                        <span className="selector-label">Persona:</span>
                        <select value={currentPersona.id} onChange={(e) => switchPersona(e.target.value)} className="persona-select">
                            {Object.values(personas).map((p) => (
                                <option key={p.id} value={p.id}>{p.name} - {p.description}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="select-arrow" />
                    </div>
                )}

                <button className={`judge-view-btn ${judgeView ? 'active' : ''}`} onClick={toggleJudgeView}>
                    {judgeView ? '👨‍⚖️ Judge View ON' : '👁️ Judge View'}
                </button>

                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>
            </div>
        </header>
    );
}
