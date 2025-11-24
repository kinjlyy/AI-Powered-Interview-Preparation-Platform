// Dashboard Application JavaScript

// Application data
const dashboardData = {
  projects: {
    total: 6,
    completed: 2
  },
  tasks: {
    total: 132,
    completed: 28
  },
  members: {
    total: 8,
    completed: 2
  },
  productivity: {
    percentage: 76,
    increase: 26
  },
  activeProjects: [
    {
      name: "Website Redesign",
      date: "Jan 30, 2025",
      progress: 65,
      status: "On Track",
      assigned: ["JD", "SA"]
    },
    {
      name: "Marketing Campaign",
      date: "Feb 15, 2025",
      progress: 20,
      status: "Delayed",
      assigned: ["JD", "MK", "RL"]
    },
    {
      name: "Mobile App Development",
      date: "Mar 1, 2025",
      progress: 45,
      status: "At Risk",
      assigned: ["SA", "MK"]
    },
    {
      name: "Customer Portal Upgrade",
      date: "Feb 15, 2025",
      progress: 89,
      status: "On Track",
      assigned: ["JD", "RL"]
    },
    {
      name: "Product Launch",
      date: "Jan 25, 2025",
      progress: 100,
      status: "Completed",
      assigned: ["SA", "MK", "RL"]
    }
  ],
  allProjects: [
    {
      name: "Website Redesign",
      date: "Jan 30, 2025",
      progress: 65,
      status: "On Track",
      assigned: ["JD", "SA"]
    },
    {
      name: "Marketing Campaign",
      date: "Feb 15, 2025",
      progress: 20,
      status: "Delayed",
      assigned: ["JD", "MK", "RL"]
    },
    {
      name: "Mobile App Development",
      date: "Mar 1, 2025",
      progress: 45,
      status: "At Risk",
      assigned: ["SA", "MK"]
    },
    {
      name: "Customer Portal Upgrade",
      date: "Feb 15, 2025",
      progress: 89,
      status: "On Track",
      assigned: ["JD", "RL"]
    },
    {
      name: "Product Launch",
      date: "Jan 25, 2025",
      progress: 100,
      status: "Completed",
      assigned: ["SA", "MK", "RL"]
    },
    {
      name: "E-commerce Integration",
      date: "Mar 20, 2025",
      progress: 30,
      status: "On Track",
      assigned: ["MK", "RL"]
    },
    {
      name: "API Development",
      date: "Apr 5, 2025",
      progress: 15,
      status: "On Track",
      assigned: ["JD", "SA", "MK"]
    },
    {
      name: "Security Audit",
      date: "Feb 28, 2025",
      progress: 75,
      status: "On Track",
      assigned: ["SA", "RL"]
    }
  ],
  taskProgress: {
    overall: 64,
    completed: 8,
    inProgress: 12,
    upComing: 14
  }
};

// State management
let showingAllProjects = false;

// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
const navItems = document.querySelectorAll('.nav-item');
const projectsTableBody = document.getElementById('projectsTableBody');
const aiAssistant = document.getElementById('aiAssistant');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeMobileMenu();
  populateProjectsTable();
  initializeProgressAnimations();
  initializeAIAssistant();
  initializeHoverEffects();
  initializeRevealAnimations();
  initializeViewAllButton();
});

// Navigation functionality
function initializeNavigation() {
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all items
      navItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Add click animation
      link.style.transform = 'scale(0.95)';
      setTimeout(() => {
        link.style.transform = '';
      }, 150);
      
      // Close mobile menu if open
      closeMobileMenu();
      
      // Simulate section switching (in a real app, this would load different content)
      const section = item.getAttribute('data-section');
      showNotification(`Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)} section`, 'info');
    });
  });
}

// View All button functionality
function initializeViewAllButton() {
  const viewAllButton = document.querySelector('.projects-section .btn--outline');
  if (viewAllButton) {
    viewAllButton.addEventListener('click', function() {
      showingAllProjects = !showingAllProjects;
      
      if (showingAllProjects) {
        this.textContent = 'View Less';
        populateProjectsTable(dashboardData.allProjects);
        showNotification('Showing all projects', 'info');
      } else {
        this.textContent = 'View All';
        populateProjectsTable(dashboardData.activeProjects);
        showNotification('Showing active projects only', 'info');
      }
      
      // Update section header
      const sectionHeader = document.querySelector('.projects-section .section-header h3');
      if (sectionHeader) {
        sectionHeader.textContent = showingAllProjects ? 'All Projects' : 'Active Projects';
      }
    });
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  sidebar.classList.toggle('active');
  mobileOverlay.classList.toggle('active');
  
  // Animate hamburger menu
  const spans = mobileMenuToggle.querySelectorAll('span');
  spans.forEach((span, index) => {
    if (sidebar.classList.contains('active')) {
      if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (index === 1) span.style.opacity = '0';
      if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      span.style.transform = '';
      span.style.opacity = '';
    }
  });
}

function closeMobileMenu() {
  sidebar.classList.remove('active');
  mobileOverlay.classList.remove('active');
  
  // Reset hamburger menu
  const spans = mobileMenuToggle.querySelectorAll('span');
  spans.forEach(span => {
    span.style.transform = '';
    span.style.opacity = '';
  });
}

// Populate projects table
function populateProjectsTable(projects = dashboardData.activeProjects) {
  const tbody = projectsTableBody;
  tbody.innerHTML = '';
  
  projects.forEach((project, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="project-name">${project.name}</div>
        <div class="project-date">${project.date}</div>
      </td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" data-progress="${project.progress}"></div>
          </div>
          <div class="progress-text">${project.progress}%</div>
        </div>
      </td>
      <td>
        <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
      </td>
      <td>
        <div class="assigned-avatars">
          ${project.assigned.map(user => `<div class="assigned-avatar">${user}</div>`).join('')}
        </div>
      </td>
      <td>
        <button class="action-menu" onclick="showActionMenu(${index}, '${project.name}')">⋮</button>
      </td>
    `;
    
    tbody.appendChild(row);
    
    // Animate row appearance
    setTimeout(() => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(20px)';
      row.style.transition = 'all 0.5s ease';
      
      requestAnimationFrame(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      });
    }, index * 100);
  });
  
  // Re-initialize progress animations for new rows
  initializeProgressAnimations();
}

// Progress bar animations
function initializeProgressAnimations() {
  const progressFills = document.querySelectorAll('.progress-fill');
  
  // Animate progress bars when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressFill = entry.target;
        const progress = progressFill.getAttribute('data-progress');
        
        setTimeout(() => {
          progressFill.style.width = progress + '%';
        }, 200);
      }
    });
  });
  
  progressFills.forEach(fill => {
    fill.style.width = '0%';
    observer.observe(fill);
  });
  
  // Animate circular progress
  animateCircularProgress();
}

function animateCircularProgress() {
  const progressCircle = document.querySelector('.progress-circle-large');
  if (progressCircle) {
    const percentage = dashboardData.taskProgress.overall;
    const degrees = (percentage / 100) * 360;
    
    setTimeout(() => {
      progressCircle.style.background = `conic-gradient(var(--color-primary) 0deg ${degrees}deg, var(--color-secondary) ${degrees}deg 360deg)`;
    }, 500);
  }
}

// AI Assistant functionality
function initializeAIAssistant() {
  const aiButton = document.querySelector('.ai-button');
  
  if (aiButton) {
    aiButton.addEventListener('click', function() {
      // Simulate AI assistant interaction
      this.textContent = 'Starting...';
      this.disabled = true;
      
      setTimeout(() => {
        showNotification('AI Assistant activated! Ready to help with your dashboard tasks.', 'success');
        this.textContent = 'Chat with AI';
        this.disabled = false;
      }, 2000);
    });
  }
  
  // Make AI widget draggable (optional enhancement)
  makeAIWidgetInteractive();
}

function makeAIWidgetInteractive() {
  const aiWidget = document.querySelector('.ai-widget');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  
  if (aiWidget) {
    aiWidget.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    // Touch events for mobile
    aiWidget.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('touchend', dragEnd);
  }
  
  function dragStart(e) {
    if (e.target.closest('.ai-button')) return;
    
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    
    if (e.target === aiWidget || aiWidget.contains(e.target)) {
      isDragging = true;
      aiWidget.style.cursor = 'grabbing';
    }
  }
  
  function dragMove(e) {
    if (isDragging) {
      e.preventDefault();
      
      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }
      
      xOffset = currentX;
      yOffset = currentY;
      
      aiWidget.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }
  
  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    aiWidget.style.cursor = 'grab';
  }
}

// Hover effects and interactions
function initializeHoverEffects() {
  // Stat cards hover effects
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    card.addEventListener('click', function() {
      // Add click animation and show details
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      }, 100);
      
      const cardType = this.classList[1].replace('stat-', '');
      showNotification(`Viewing ${cardType} details`, 'info');
    });
  });
  
  // Button hover effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Table row hover effects
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      const tableRows = document.querySelectorAll('.projects-table tbody tr');
      tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.01)';
        });
        
        row.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
        });
      });
    }, 1000);
  });
}

// Reveal animations on scroll
function initializeRevealAnimations() {
  const animatedElements = document.querySelectorAll('.stat-card, .task-progress-section, .teams-section, .budget-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
  });
}

// Action menu functionality
function showActionMenu(projectIndex, projectName) {
  const actions = ['Edit Project', 'View Details', 'Download Report', 'Archive', 'Delete'];
  
  // Create a simple context menu
  const menu = document.createElement('div');
  menu.className = 'action-menu-dropdown';
  menu.style.cssText = `
    position: fixed;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    padding: var(--space-8);
    z-index: 1000;
    min-width: 150px;
    animation: slideInUp 0.2s ease;
  `;
  
  actions.forEach(action => {
    const item = document.createElement('div');
    item.textContent = action;
    item.style.cssText = `
      padding: var(--space-8) var(--space-12);
      cursor: pointer;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      transition: all var(--duration-fast) var(--ease-standard);
      color: var(--color-text);
    `;
    
    // Special styling for delete action
    if (action === 'Delete') {
      item.style.color = 'var(--color-error)';
    }
    
    item.addEventListener('mouseenter', function() {
      this.style.background = 'var(--color-secondary)';
      this.style.transform = 'translateX(4px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.background = '';
      this.style.transform = 'translateX(0)';
    });
    
    item.addEventListener('click', function() {
      const actionType = action === 'Delete' ? 'error' : 'success';
      showNotification(`${action} action executed for "${projectName}"`, actionType);
      document.body.removeChild(menu);
    });
    
    menu.appendChild(item);
  });
  
  // Position menu at cursor
  document.addEventListener('mousemove', function positionMenu(e) {
    menu.style.left = Math.min(e.clientX + 10, window.innerWidth - 160) + 'px';
    menu.style.top = Math.min(e.clientY + 10, window.innerHeight - 200) + 'px';
    document.removeEventListener('mousemove', positionMenu);
  });
  
  document.body.appendChild(menu);
  
  // Remove menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function removeMenu(e) {
      if (!menu.contains(e.target)) {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
        document.removeEventListener('click', removeMenu);
      }
    });
  }, 100);
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: var(--space-16) var(--space-20);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    font-size: var(--font-size-sm);
    color: var(--color-text);
  `;
  
  // Apply type-specific styling
  if (type === 'success') {
    notification.style.borderLeftColor = 'var(--color-success)';
    notification.style.borderLeftWidth = '4px';
  } else if (type === 'error') {
    notification.style.borderLeftColor = 'var(--color-error)';
    notification.style.borderLeftWidth = '4px';
  } else if (type === 'info') {
    notification.style.borderLeftColor = 'var(--color-primary)';
    notification.style.borderLeftWidth = '4px';
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Responsive handlers
function handleResize() {
  const width = window.innerWidth;
  
  if (width > 768 && sidebar.classList.contains('active')) {
    closeMobileMenu();
  }
}

window.addEventListener('resize', handleResize);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Escape key to close mobile menu
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
  
  // Keyboard navigation for accessibility
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Debounce resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedResize = debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);

// Initialize tooltips for better UX
function initializeTooltips() {
  const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
  
  elementsWithTooltips.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const text = e.target.getAttribute('data-tooltip');
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  tooltip.style.cssText = `
    position: absolute;
    background: var(--color-charcoal-700);
    color: var(--color-gray-200);
    padding: var(--space-8) var(--space-12);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    white-space: nowrap;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  
  document.body.appendChild(tooltip);
  
  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
  tooltip.style.top = rect.bottom + 5 + 'px';
  
  requestAnimationFrame(() => {
    tooltip.style.opacity = '1';
  });
  
  e.target._tooltip = tooltip;
}

function hideTooltip(e) {
  if (e.target._tooltip) {
    document.body.removeChild(e.target._tooltip);
    delete e.target._tooltip;
  }
}

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize tooltips
initializeTooltips();