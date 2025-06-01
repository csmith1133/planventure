import { Check as CheckIcon } from '@mui/icons-material';
import { MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { documentation } from '../data/documentation';
import { projects } from '../data/projects';
import './Documentation.css';

export default function Documentation() {
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project');
  const [selectedProject, setSelectedProject] = useState<string>(
    projectParam && projects.find(p => p.id === projectParam) 
      ? projectParam 
      : projects[0].id
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProject]);

  const handleProjectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProject(event.target.value as string);
  };

  const currentProject = projects.find(p => p.id === selectedProject);
  const currentDoc = documentation[selectedProject];

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>{currentProject?.title} Documentation</h1>
        <div className="documentation-selector">
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            variant="outlined"
            sx={{
              minWidth: 200,
              backgroundColor: 'white',
              boxShadow: 'none',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Helvetica Neue", sans-serif',
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ddd'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ddd'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ddd'
              },
              '& .MuiSelect-select': {
                padding: '8px 14px',
                textAlign: 'left'
              }
            }}
            renderValue={(selected) => {
              const project = projects.find(p => p.id === selected);
              return project?.title;
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  marginTop: '8px',
                  '& .MuiMenuItem-root': {
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Helvetica Neue", sans-serif',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    textAlign: 'left',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }
                  }
                }
              }
            }}
          >
            {projects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.title}
                {project.id === selectedProject && (
                  <CheckIcon sx={{ ml: 1, fontSize: 16, color: '#666' }} />
                )}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="documentation-layout">
        <nav className="documentation-sidebar">
          <div className="sidebar-section">
            <h3>Overview</h3>
            <button onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">Overview</button>
            <button onClick={() => document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">Setup</button>
            <button onClick={() => document.getElementById('usage')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">Usage</button>
            <button onClick={() => document.getElementById('api')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">API Reference</button>
          </div>

          <div className="sidebar-section">
            <h3>API Endpoints</h3>
            <button onClick={() => document.getElementById('create-request')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">Create Request</button>
            <button onClick={() => document.getElementById('view-requests')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">View Requests</button>
            <button onClick={() => document.getElementById('update-request')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-link">Update Request</button>
            <div className="sidebar-subsection">
              <button onClick={() => document.getElementById('status-codes')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-sublink">Status Codes</button>
              <button onClick={() => document.getElementById('error-handling')?.scrollIntoView({ behavior: 'smooth' })} className="sidebar-sublink">Error Handling</button>
            </div>
          </div>
        </nav>

        <main className="documentation-main">
          <h1>{currentProject?.title}</h1>
          <p>{currentProject?.description}</p>
          
          {currentDoc && (
            <>
              <section id="overview">
                <h2>Overview</h2>
                <p>{currentDoc.overview}</p>
              </section>

              <section id="setup">
                <h2>Setup</h2>
                <p>{currentDoc.setup}</p>
              </section>

              <section id="usage">
                <h2>Usage</h2>
                <p>{currentDoc.usage}</p>
              </section>

              {currentDoc.api && (
                <section id="api">
                  <h2>API Reference</h2>
                  {currentDoc.api.endpoints.map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <h3>{endpoint.method} {endpoint.path}</h3>
                      <p>{endpoint.description}</p>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
