// import React, { useState, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// import '../styles/dashboard.css';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const Dashboard = () => {
//   const [timeRange, setTimeRange] = useState('weekly');
//   const [activeView, setActiveView] = useState('overview');

//   // Chart options for consistent styling
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: 'rgba(255, 255, 255, 0.8)',
//           font: {
//             family: "'Poppins', 'Segoe UI', sans-serif",
//             size: 11
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(15, 23, 42, 0.95)',
//         titleColor: 'rgba(255, 255, 255, 0.9)',
//         bodyColor: 'rgba(255, 255, 255, 0.8)',
//         borderColor: 'rgba(255, 255, 255, 0.2)',
//         borderWidth: 1,
//         cornerRadius: 8,
//         displayColors: true,
//       }
//     },
//     scales: {
//       x: {
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//           borderColor: 'rgba(255, 255, 255, 0.1)'
//         },
//         ticks: {
//           color: 'rgba(255, 255, 255, 0.7)',
//           font: {
//             family: "'Poppins', 'Segoe UI', sans-serif",
//             size: 10
//           }
//         }
//       },
//       y: {
//         grid: {
//           color: 'rgba(255, 255, 255, 0.1)',
//           borderColor: 'rgba(255, 255, 255, 0.1)'
//         },
//         ticks: {
//           color: 'rgba(255, 255, 255, 0.7)',
//           font: {
//             family: "'Poppins', 'Segoe UI', sans-serif",
//             size: 10
//           }
//         }
//       }
//     }
//   };

//   // Data for charts
//   const chartData = {
//     calls: {
//       labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//       datasets: [
//         {
//           label: 'Successful Calls',
//           data: [65, 78, 92, 81, 56, 55, 72],
//           backgroundColor: 'rgba(102, 126, 234, 0.8)',
//           borderColor: 'rgba(102, 126, 234, 1)',
//           borderWidth: 2,
//           borderRadius: 6,
//           borderSkipped: false,
//         },
//         {
//           label: 'Failed Calls',
//           data: [5, 8, 3, 6, 4, 7, 2],
//           backgroundColor: 'rgba(239, 68, 68, 0.8)',
//           borderColor: 'rgba(239, 68, 68, 1)',
//           borderWidth: 2,
//           borderRadius: 6,
//           borderSkipped: false,
//         }
//       ]
//     },
//     responseTime: {
//       labels: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'],
//       datasets: [
//         {
//           label: 'Response Time (ms)',
//           data: [1200, 800, 600, 550, 700, 900],
//           borderColor: 'rgba(118, 75, 162, 1)',
//           backgroundColor: 'rgba(118, 75, 162, 0.1)',
//           borderWidth: 3,
//           fill: true,
//           tension: 0.4,
//           pointBackgroundColor: 'rgba(118, 75, 162, 1)',
//           pointBorderColor: 'rgba(255, 255, 255, 1)',
//           pointBorderWidth: 2,
//           pointRadius: 4,
//         }
//       ]
//     },
//     agentDistribution: {
//       labels: ['Customer Support', 'Sales', 'Technical', 'General'],
//       datasets: [
//         {
//           data: [35, 28, 22, 15],
//           backgroundColor: [
//             'rgba(102, 126, 234, 0.8)',
//             'rgba(118, 75, 162, 0.8)',
//             'rgba(79, 172, 254, 0.8)',
//             'rgba(72, 187, 120, 0.8)'
//           ],
//           borderColor: [
//             'rgba(102, 126, 234, 1)',
//             'rgba(118, 75, 162, 1)',
//             'rgba(79, 172, 254, 1)',
//             'rgba(72, 187, 120, 1)'
//           ],
//           borderWidth: 2,
//           cutout: '70%'
//         }
//       ]
//     }
//   };

//   // Dashboard stats
//   const stats = [
//     {
//       title: 'Total Calls',
//       value: '1,247',
//       change: '+12%',
//       trend: 'up',
//       icon: 'fas fa-phone-alt',
//       color: 'rgba(102, 126, 234, 0.9)'
//     },
//     {
//       title: 'Success Rate',
//       value: '94.5%',
//       change: '+5%',
//       trend: 'up',
//       icon: 'fas fa-chart-line',
//       color: 'rgba(72, 187, 120, 0.9)'
//     },
//     {
//       title: 'Avg Duration',
//       value: '4:32',
//       change: '0%',
//       trend: 'neutral',
//       icon: 'fas fa-clock',
//       color: 'rgba(79, 172, 254, 0.9)'
//     },
//     {
//       title: 'Active Users',
//       value: '1.2K',
//       change: '+8%',
//       trend: 'up',
//       icon: 'fas fa-users',
//       color: 'rgba(118, 75, 162, 0.9)'
//     }
//   ];

//   const recentActivity = [
//     { action: 'Call Completed', agent: 'Customer Support', time: '2 mins ago', status: 'success' },
//     { action: 'New User', agent: 'Sales Assistant', time: '15 mins ago', status: 'info' },
//     { action: 'System Update', agent: 'Technical', time: '1 hour ago', status: 'warning' },
//     { action: 'Voice Model', agent: 'AI Core', time: '2 hours ago', status: 'success' }
//   ];

//   return (
//     <div className="dashboard-container">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-main">
//           <h1>Voice AI Dashboard</h1>
//           <p>Real-time analytics & performance metrics</p>
//         </div>
//         <div className="header-controls">
//           <div className="view-selector">
//             <button 
//               className={`view-btn ${activeView === 'overview' ? 'active' : ''}`}
//               onClick={() => setActiveView('overview')}
//             >
//               <i className="fas fa-chart-pie"></i>
//               Overview
//             </button>
//             <button 
//               className={`view-btn ${activeView === 'analytics' ? 'active' : ''}`}
//               onClick={() => setActiveView('analytics')}
//             >
//               <i className="fas fa-chart-bar"></i>
//               Analytics
//             </button>
//           </div>
//           <div className="time-selector">
//             <select 
//               value={timeRange} 
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="time-dropdown"
//             >
//               <option value="daily">Today</option>
//               <option value="weekly">This Week</option>
//               <option value="monthly">This Month</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid - Single Row */}
//       <div className="stats-row">
//         {stats.map((stat, index) => (
//           <div key={index} className="stat-card">
//             <div className="stat-icon" style={{ background: stat.color }}>
//               <i className={stat.icon}></i>
//             </div>
//             <div className="stat-content">
//               <h3>{stat.value}</h3>
//               <p>{stat.title}</p>
//               <div className={`stat-trend ${stat.trend}`}>
//                 <i className={`fas fa-arrow-${stat.trend === 'up' ? 'up' : stat.trend === 'down' ? 'down' : 'minus'}`}></i>
//                 <span>{stat.change}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts Grid */}
//       <div className="charts-grid">
//         {/* Call Volume Chart */}
//         <div className="chart-card large">
//           <div className="chart-header">
//             <h3>Call Volume Analytics</h3>
//             <div className="chart-actions">
//               <button className="btn-icon">
//                 <i className="fas fa-download"></i>
//               </button>
//             </div>
//           </div>
//           <div className="chart-container">
//             <Bar 
//               data={chartData.calls} 
//               options={{
//                 ...chartOptions,
//                 plugins: {
//                   ...chartOptions.plugins,
//                   title: {
//                     display: false
//                   }
//                 }
//               }} 
//             />
//           </div>
//         </div>

//         {/* Response Time Chart */}
//         <div className="chart-card">
//           <div className="chart-header">
//             <h3>Response Time</h3>
//           </div>
//           <div className="chart-container">
//             <Line 
//               data={chartData.responseTime} 
//               options={{
//                 ...chartOptions,
//                 plugins: {
//                   ...chartOptions.plugins,
//                   title: {
//                     display: false
//                   }
//                 }
//               }} 
//             />
//           </div>
//         </div>

//         {/* Agent Distribution */}
//         <div className="chart-card">
//           <div className="chart-header">
//             <h3>Agent Distribution</h3>
//           </div>
//           <div className="chart-container">
//             <Doughnut 
//               data={chartData.agentDistribution} 
//               options={{
//                 ...chartOptions,
//                 plugins: {
//                   ...chartOptions.plugins,
//                   legend: {
//                     position: 'bottom',
//                     labels: {
//                       color: 'rgba(255, 255, 255, 0.8)',
//                       font: {
//                         family: "'Poppins', 'Segoe UI', sans-serif",
//                         size: 10
//                       },
//                       padding: 15
//                     }
//                   }
//                 }
//               }} 
//             />
//           </div>
//         </div>

//         {/* Performance Metrics */}
//         <div className="chart-card">
//           <div className="chart-header">
//             <h3>System Performance</h3>
//           </div>
//           <div className="performance-metrics">
//             <div className="metric">
//               <div className="metric-info">
//                 <span className="metric-label">Uptime</span>
//                 <span className="metric-value">99.8%</span>
//               </div>
//               <div className="metric-bar">
//                 <div className="metric-progress" style={{ width: '99.8%' }}></div>
//               </div>
//             </div>
//             <div className="metric">
//               <div className="metric-info">
//                 <span className="metric-label">Accuracy</span>
//                 <span className="metric-value">96.3%</span>
//               </div>
//               <div className="metric-bar">
//                 <div className="metric-progress" style={{ width: '96.3%' }}></div>
//               </div>
//             </div>
//             <div className="metric">
//               <div className="metric-info">
//                 <span className="metric-label">CPU Load</span>
//                 <span className="metric-value">42%</span>
//               </div>
//               <div className="metric-bar">
//                 <div className="metric-progress" style={{ width: '42%' }}></div>
//               </div>
//             </div>
//             <div className="metric">
//               <div className="metric-info">
//                 <span className="metric-label">Memory</span>
//                 <span className="metric-value">68%</span>
//               </div>
//               <div className="metric-bar">
//                 <div className="metric-progress" style={{ width: '68%' }}></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="chart-card">
//           <div className="chart-header">
//             <h3>Recent Activity</h3>
//           </div>
//           <div className="activity-list">
//             {recentActivity.map((activity, index) => (
//               <div key={index} className="activity-item">
//                 <div className="activity-icon">
//                   <i className={`fas fa-${activity.status === 'success' ? 'check-circle' : activity.status === 'warning' ? 'exclamation-triangle' : 'info-circle'}`}></i>
//                 </div>
//                 <div className="activity-content">
//                   <p className="activity-action">{activity.action}</p>
//                   <span className="activity-agent">{activity.agent}</span>
//                   <span className="activity-time">{activity.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="chart-card">
//           <div className="chart-header">
//             <h3>Quick Actions</h3>
//           </div>
//           <div className="quick-actions">
//             <button className="action-btn">
//               <i className="fas fa-robot"></i>
//               <span>Train AI</span>
//             </button>
//             <button className="action-btn">
//               <i className="fas fa-sliders-h"></i>
//               <span>Settings</span>
//             </button>
//             <button className="action-btn">
//               <i className="fas fa-download"></i>
//               <span>Export Data</span>
//             </button>
//             <button className="action-btn">
//               <i className="fas fa-users-cog"></i>
//               <span>Manage Agents</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import '../styles/dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [activeView, setActiveView] = useState('overview');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const statsRowRef = useRef(null);
  const chartsGridRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Chart options for consistent styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: "'Poppins', 'Segoe UI', sans-serif",
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Poppins', 'Segoe UI', sans-serif",
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Poppins', 'Segoe UI', sans-serif",
            size: 10
          }
        }
      }
    }
  };

  // Data for charts
  const chartData = {
    calls: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Successful Calls',
          data: [65, 78, 92, 81, 56, 55, 72],
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Failed Calls',
          data: [5, 8, 3, 6, 4, 7, 2],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    },
    responseTime: {
      labels: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'],
      datasets: [
        {
          label: 'Response Time (ms)',
          data: [1200, 800, 600, 550, 700, 900],
          borderColor: 'rgba(118, 75, 162, 1)',
          backgroundColor: 'rgba(118, 75, 162, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(118, 75, 162, 1)',
          pointBorderColor: 'rgba(255, 255, 255, 1)',
          pointBorderWidth: 2,
          pointRadius: 4,
        }
      ]
    },
    agentDistribution: {
      labels: ['Customer Support', 'Sales', 'Technical', 'General'],
      datasets: [
        {
          data: [35, 28, 22, 15],
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(79, 172, 254, 0.8)',
            'rgba(72, 187, 120, 0.8)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(79, 172, 254, 1)',
            'rgba(72, 187, 120, 1)'
          ],
          borderWidth: 2,
          cutout: '70%'
        }
      ]
    }
  };

  // Dashboard stats
  const stats = [
    {
      title: 'Total Calls',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: 'fas fa-phone-alt',
      color: 'rgba(102, 126, 234, 0.9)'
    },
    {
      title: 'Success Rate',
      value: '94.5%',
      change: '+5%',
      trend: 'up',
      icon: 'fas fa-chart-line',
      color: 'rgba(72, 187, 120, 0.9)'
    },
    {
      title: 'Avg Duration',
      value: '4:32',
      change: '0%',
      trend: 'neutral',
      icon: 'fas fa-clock',
      color: 'rgba(79, 172, 254, 0.9)'
    },
    {
      title: 'Active Users',
      value: '1.2K',
      change: '+8%',
      trend: 'up',
      icon: 'fas fa-users',
      color: 'rgba(118, 75, 162, 0.9)'
    }
  ];

  const recentActivity = [
    { action: 'Call Completed', agent: 'Customer Support', time: '2 mins ago', status: 'success' },
    { action: 'New User', agent: 'Sales Assistant', time: '15 mins ago', status: 'info' },
    { action: 'System Update', agent: 'Technical', time: '1 hour ago', status: 'warning' },
    { action: 'Voice Model', agent: 'AI Core', time: '2 hours ago', status: 'success' }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentSlide(prev => {
          const nextSlide = (prev + 1) % 3; // 3 slides: stats, charts1, charts2
          scrollToSlide(nextSlide);
          return nextSlide;
        });
      }, 5000); // Change slide every 5 seconds
    } else {
      clearInterval(autoScrollInterval.current);
    }

    return () => clearInterval(autoScrollInterval.current);
  }, [isAutoScrolling]);

  const scrollToSlide = (slideIndex) => {
    const elements = [
      statsRowRef.current,
      ...Array.from(chartsGridRef.current?.children || [])
    ].filter(Boolean);

    if (elements[slideIndex]) {
      elements[slideIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleCardClick = (index) => {
    setIsAutoScrolling(false);
    setCurrentSlide(index);
    scrollToSlide(index);
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % 3;
    setCurrentSlide(next);
    scrollToSlide(next);
    setIsAutoScrolling(false);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + 3) % 3;
    setCurrentSlide(prev);
    scrollToSlide(prev);
    setIsAutoScrolling(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-main">
          <h1>Voice AI Dashboard</h1>
          <p>Real-time analytics & performance metrics</p>
        </div>
        <div className="header-controls">
          <div className="view-selector">
            <button 
              className={`view-btn ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <i className="fas fa-chart-pie"></i>
              Overview
            </button>
            <button 
              className={`view-btn ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveView('analytics')}
            >
              <i className="fas fa-chart-bar"></i>
              Analytics
            </button>
          </div>
          <div className="time-selector">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-dropdown"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auto-scroll Controls */}
      <div className="scroll-controls">
        <button className="control-btn" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          className={`control-btn ${isAutoScrolling ? 'active' : ''}`}
          onClick={toggleAutoScroll}
        >
          <i className={`fas ${isAutoScrolling ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
        <button className="control-btn" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <span className="slide-indicator">
          Slide {currentSlide + 1} of 3
        </span>
      </div>

      {/* Stats Grid - Single Row */}
      <div 
        className="stats-row scroll-section" 
        ref={statsRowRef}
        onClick={() => handleCardClick(0)}
      >
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <div className={`stat-trend ${stat.trend}`}>
                <i className={`fas fa-arrow-${stat.trend === 'up' ? 'up' : stat.trend === 'down' ? 'down' : 'minus'}`}></i>
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid" ref={chartsGridRef}>
        {/* First Row of Charts */}
        <div className="charts-row scroll-section" onClick={() => handleCardClick(1)}>
          {/* Call Volume Chart */}
          <div className="chart-card large">
            <div className="chart-header">
              <h3>Call Volume Analytics</h3>
              <div className="chart-actions">
                <button className="btn-icon">
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>
            <div className="chart-container">
              <Bar 
                data={chartData.calls} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Response Time Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Response Time</h3>
            </div>
            <div className="chart-container">
              <Line 
                data={chartData.responseTime} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Second Row of Charts */}
        <div className="charts-row scroll-section" onClick={() => handleCardClick(2)}>
          {/* Agent Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Agent Distribution</h3>
            </div>
            <div className="chart-container">
              <Doughnut 
                data={chartData.agentDistribution} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                          family: "'Poppins', 'Segoe UI', sans-serif",
                          size: 10
                        },
                        padding: 15
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>System Performance</h3>
            </div>
            <div className="performance-metrics">
              <div className="metric">
                <div className="metric-info">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">99.8%</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-progress" style={{ width: '99.8%' }}></div>
                </div>
              </div>
              <div className="metric">
                <div className="metric-info">
                  <span className="metric-label">Accuracy</span>
                  <span className="metric-value">96.3%</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-progress" style={{ width: '96.3%' }}></div>
                </div>
              </div>
              <div className="metric">
                <div className="metric-info">
                  <span className="metric-label">CPU Load</span>
                  <span className="metric-value">42%</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-progress" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div className="metric">
                <div className="metric-info">
                  <span className="metric-label">Memory</span>
                  <span className="metric-value">68%</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-progress" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <i className={`fas fa-${activity.status === 'success' ? 'check-circle' : activity.status === 'warning' ? 'exclamation-triangle' : 'info-circle'}`}></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-agent">{activity.agent}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="action-btn">
                <i className="fas fa-robot"></i>
                <span>Train AI</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-sliders-h"></i>
                <span>Settings</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-download"></i>
                <span>Export Data</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-users-cog"></i>
                <span>Manage Agents</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;