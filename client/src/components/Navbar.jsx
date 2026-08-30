import React from 'react';
import Button from './Button';
import { Kanban, Plus, Search, Filter, User, LogOut } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({
  boardName = 'Group Project Alpha — Sprint 1',
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onOpenAddModal,
  currentUser,
  onLogout,
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left: Brand / Logo & Board Title */}
        <div className="navbar-left">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <Kanban size={22} className="logo-icon" />
            </div>
            <span className="brand-name">CollabBoard</span>
          </div>

          <div className="navbar-divider"></div>

          <div className="board-info">
            <span className="board-badge">REST API CONNECTED</span>
            <h1 className="board-title">{boardName}</h1>
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
