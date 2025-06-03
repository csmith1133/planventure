import { Logout, Settings } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/hf_finfreshq_logo.png';
import { formMenuItems } from '../data/formMenuItems';
import { projects } from '../data/projects';
import PurchaseRequestModal from './forms/PurchaseRequestModal';
import './Navbar.css';

export default function Navbar() {
  // Replace multiple dropdown states with single state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [userInitial, setUserInitial] = useState('?');
  const navigate = useNavigate();
  const projectsDropdownRef = useRef<HTMLDivElement>(null);
  const formsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setUserInitial('?');
      return;
    }

    try {
      axios.get('http://localhost:5000/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.email) {
          setUserInitial(response.data.email[0].toUpperCase());
        }
      })
      .catch(err => {
        console.error('Failed to fetch user details:', err);
        setUserInitial('?');
      });

    } catch (e) {
      console.error('Token parsing error:', e);
      setUserInitial('?');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdown === 'projects' && 
          projectsDropdownRef.current && 
          !projectsDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (activeDropdown === 'forms' && 
          formsDropdownRef.current && 
          !formsDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Simplified handlers
  const handleMouseEnter = (menu: string) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);
  
  const handleLinkClick = (callback: () => void) => {
    setActiveDropdown(null);
    callback();
  };

  const handleProjectClick = (viewPath: string | undefined, isExternal: boolean) => {
    setActiveDropdown(null);
    if (!viewPath) return;
    
    if (isExternal) {
      window.open(viewPath, '_blank');
    } else {
      navigate(viewPath);
    }
  };
  const handleLogout = () => {
    localStorage.clear(); // Clear all storage
    window.location.href = '/login'; // Force page reload and redirect
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" style={{ height: 40 }} />
        </Link>
        
        <div className="navbar-center">
          <Link to="/dashboard" onClick={() => setActiveDropdown(null)} className={activeDropdown === '/dashboard' ? 'active' : ''}>
            Home
          </Link>
          <div 
            className="nav-item"
            onMouseEnter={() => handleMouseEnter('projects')}
            onMouseLeave={handleMouseLeave}
            ref={projectsDropdownRef}
          >
            <span className="nav-button">Projects</span>
            <div className={`forms-flyout ${activeDropdown === 'projects' ? 'active' : ''}`}>
              <div className="forms-content">
                <div className="forms-grid">
                  {projects
                    .filter(project => !project.documentationOnly)
                    .map(project => (
                    <div key={project.id} className="form-item">
                      <div className="form-main">
                        <div className="form-info">
                          <div className="form-name">{project.title}</div>
                          <div className="form-description">{project.description}</div>
                        </div>
                        <div className="form-actions">
                          <button 
                            onClick={() => handleLinkClick(() => project.url ? handleProjectClick(project.url, !!project.isExternal) : null)}
                            className="action-button"
                          >
                            {project.isExternal ? 'Open External' : 'Open Project'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div 
            className="nav-item"
            onMouseEnter={() => handleMouseEnter('forms')}
            onMouseLeave={handleMouseLeave}
            ref={formsDropdownRef}
          >
            <span className="nav-button">Forms</span>
            <div className={`forms-flyout ${activeDropdown === 'forms' ? 'active' : ''}`}>
              <div className="forms-content">
                <div className="forms-grid">
                  {formMenuItems.map(form => (
                    <div key={form.id} className="form-item">
                      <div className="form-main">
                        <div className="form-info">
                          <div className="form-name">{form.name}</div>
                          <div className="form-description">{form.description}</div>
                        </div>
                        <div className="form-actions">
                          <button 
                            onClick={() => {
                              setActiveDropdown(null); // Close dropdown first
                              navigate(form.viewPath);
                            }}
                            className="action-link"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              setActiveDropdown(null); // Close dropdown first
                              setShowPurchaseModal(true);
                            }}
                            className="action-button"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Link to="/reports">Reports</Link>
          <Link to="/analytics">Analytics</Link>
          <Link 
            to="/documentation" 
            onClick={() => setActiveDropdown(null)}
            className={activeDropdown === '/documentation' ? 'active' : ''}
          >
            Documentation
          </Link>
        </div>

        <div className="navbar-right">
          <div 
            className="user-menu-container"
            onMouseEnter={() => handleMouseEnter('user')}
            onMouseLeave={handleMouseLeave}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'grey.300',
                color: '#232323',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              {userInitial}
            </Avatar>
            <div className={`user-menu-dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
              <div className="user-menu-item" onClick={() => console.log('Settings clicked')}>
                <Settings sx={{ fontSize: 20 }} />
                <span>Settings</span>
              </div>
              <div className="divider" />
              <div className="user-menu-item" onClick={handleLogout}>
                <Logout sx={{ fontSize: 20, color: '#d32f2f', '&:hover': { color: '#b71c1c' } }} />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PurchaseRequestModal
        open={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </nav>
  );
}