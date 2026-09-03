import React, { useState } from 'react';
import Button from './Button';
import { Kanban, Plus, Search, Filter, User, LogOut, ChevronDown, FolderPlus, Database } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({
  projects = [],
  selectedProject,
  onSelectProject,
  onOpenNewProjectModal,
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onOpenAddModal,
  currentUser,
  onLogout,
}) {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left: Brand / Logo & Project Selector */}
        <div className="navbar-left">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <Kanban size={22} className="logo-icon" />
            </div>
            <span className="brand-name">CollabBoard</span>
          </div>

          <div className="navbar-divider"></div>

          {/* Multiple Project Selector Dropdown */}
          <div className="project-selector-wrapper" style={{ position: 'relative' }}>
            <div
              className="project-selector-btn"
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              title="Click to switch or create projects"
            >
              <div
                className="project-color-dot"
                style={{ backgroundColor: selectedProject?.color || '#6366f1' }}
              />
              <div className="project-meta">
                <div className="project-badge-row">
                  <span className="board-badge atlas-badge">
                    <Database size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    MONGODB ATLAS
                  </span>
                </div>
                <h1 className="board-title project-title-text">
                  {selectedProject?.name || 'Project Alpha'}
                  <ChevronDown size={14} className="dropdown-arrow" />
                </h1>
              </div>
            </div>

            {projectDropdownOpen && (
              <div className="project-dropdown-menu">
                <div className="dropdown-header">
                  <span>Switch Project ({projects.length})</span>
                </div>
                <div className="dropdown-list">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className={`dropdown-item ${selectedProject?.id === proj.id ? 'active' : ''}`}
                      onClick={() => {
                        onSelectProject(proj);
                        setProjectDropdownOpen(false);
                      }}
                    >
                      <div
                        className="project-item-dot"
                        style={{ backgroundColor: proj.color || '#6366f1' }}
                      />
                      <div className="dropdown-item-info">
                        <span className="dropdown-item-name">{proj.name}</span>
                        {proj.description && (
                          <span className="dropdown-item-desc">{proj.description.slice(0, 45)}...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button
                    className="create-project-btn"
                    onClick={() => {
                      setProjectDropdownOpen(false);
                      onOpenNewProjectModal();
                    }}
                  >
                    <FolderPlus size={14} />
                    <span>+ New Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search & Filter Controls */}
        <div className="navbar-center">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-box">
            <Filter size={15} className="filter-icon" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="navbar-right">
          <Button variant="primary" icon={Plus} onClick={() => onOpenAddModal('todo')}>
            Add Task
          </Button>

          <div className="user-profile-wrapper" title={currentUser ? currentUser.email : 'User'}>
            <div
              className="user-avatar"
              style={{ backgroundColor: currentUser?.avatarColor || '#10b981' }}
            >
              {currentUser ? currentUser.name.charAt(0) : <User size={18} />}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser ? currentUser.name : 'Sandeepa'}</span>
              <span className="user-role">{currentUser ? currentUser.role || 'Member' : 'Student'}</span>
            </div>
            {onLogout && (
              <button
                className="card-action-btn delete-btn"
                onClick={onLogout}
                title="Logout"
                style={{ marginLeft: '0.4rem' }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
