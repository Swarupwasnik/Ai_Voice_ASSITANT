import React from 'react';
import '../styles/call-history.css';

const CallHistory = () => {
  const callHistory = [
    { id: 1, date: '2025-01-15', time: '10:30 AM', duration: '4:32', status: 'Completed', customer: 'John Doe' },
    { id: 2, date: '2025-01-15', time: '09:15 AM', duration: '2:45', status: 'Completed', customer: 'Jane Smith' },
    { id: 3, date: '2025-01-14', time: '03:20 PM', duration: '6:12', status: 'Completed', customer: 'Mike Johnson' },
    { id: 4, date: '2025-01-14', time: '11:45 AM', duration: '1:23', status: 'Failed', customer: 'Sarah Wilson' },
    { id: 5, date: '2025-01-13', time: '02:10 PM', duration: '5:08', status: 'Completed', customer: 'David Brown' },
  ];

  return (
    <div className="call-history-page">
      <div className="page-header">
        <h1>Call History</h1>
        <p>View and manage your call records</p>
      </div>
      
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {callHistory.map((call) => (
              <tr key={call.id}>
                <td>{call.date}</td>
                <td>{call.time}</td>
                <td>{call.customer}</td>
                <td>{call.duration}</td>
                <td>
                  <span className={`status ${call.status.toLowerCase()}`}>
                    {call.status}
                  </span>
                </td>
                <td>
                  <button className="btn-view">View</button>
                  <button className="btn-download">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallHistory;