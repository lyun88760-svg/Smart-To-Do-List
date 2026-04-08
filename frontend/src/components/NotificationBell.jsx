import { useState } from 'react';
import { useTask } from '../context/TaskContext';

export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useTask();
  const [show, setShow] = useState(false);

  return (
    <div className="notification-bell">
      <button onClick={() => setShow(!show)} className="bell-btn">
        🔔
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </button>

      {show && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <span>提醒</span>
            {notifications.length > 0 && (
              <button onClick={markAllNotificationsRead}>全部已读</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="no-notifications">暂无新提醒</p>
          ) : (
            <ul className="notification-list">
              {notifications.map(n => (
                <li key={n.id} className="notification-item">
                  <span>{n.message}</span>
                  <button onClick={() => markNotificationRead(n.id)}>×</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
