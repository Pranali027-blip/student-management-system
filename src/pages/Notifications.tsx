import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import './Notifications.css'

type Notif = {
  id: number
  type: 'exam' | 'event' | 'attendance' | 'finance' | 'general'
  title: string
  message: string
  time: string
  read: boolean
}

const initialNotifs: Notif[] = [
  { id:1,  type:'exam',       title:'Exam Schedule Updated',         message:'Mathematics final exam has been rescheduled to Feb 15, Hall A at 10:00 AM.',         time:'2 min ago',   read:false },
  { id:2,  type:'attendance', title:'Low Attendance Alert',          message:'Student Riya Sharma has attendance below 75% in Physics. Please review.',             time:'15 min ago',  read:false },
  { id:3,  type:'event',      title:'New Event Added',               message:'Science Exhibition 2024 has been added to the calendar on Feb 15.',                   time:'1 hr ago',    read:false },
  { id:4,  type:'finance',    title:'Invoice Payment Received',      message:'Payment of $1,200 received from student ID #4521 for term fees.',                     time:'2 hrs ago',   read:false },
  { id:5,  type:'exam',       title:'Result Published',              message:'Mid-term results for English Literature (ENG-103) have been published.',              time:'5 hrs ago',   read:true  },
  { id:6,  type:'general',    title:'System Maintenance Notice',     message:'The portal will be under maintenance on Sunday 2:00 AM – 4:00 AM. Plan accordingly.', time:'1 day ago',   read:true  },
  { id:7,  type:'attendance', title:'Attendance Report Ready',       message:'Monthly attendance report for January 2024 is ready to download.',                    time:'1 day ago',   read:true  },
  { id:8,  type:'event',      title:'Event Reminder',                message:'School Live Concert Choir is tomorrow at 6:00 PM. 60 tickets sold so far.',           time:'2 days ago',  read:true  },
  { id:9,  type:'finance',    title:'Expense Report Generated',      message:'Weekly expense report has been generated. Total expense this week: $33,456.',         time:'2 days ago',  read:true  },
  { id:10, type:'general',    title:'New Teacher Onboarded',         message:'Ms. Priya Nair has joined as a Chemistry teacher. Welcome her to the team!',          time:'3 days ago',  read:true  },
  { id:11, type:'exam',       title:'Exam Hall Allotment Done',      message:'Hall allotments for Physics (PHY-102) on Feb 12 have been finalized.',                time:'3 days ago',  read:true  },
  { id:12, type:'attendance', title:'Holiday Marked',                message:'Jan 26 has been marked as a national holiday. Attendance auto-updated.',              time:'4 days ago',  read:true  },
]

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  exam:       { icon:'🗓️', color:'#6366f1', bg:'#eef2ff' },
  event:      { icon:'🎉', color:'#f59e0b', bg:'#fef3c7' },
  attendance: { icon:'📅', color:'#10b981', bg:'#dcfce7' },
  finance:    { icon:'💰', color:'#8b5cf6', bg:'#f3e8ff' },
  general:    { icon:'🔔', color:'#64748b', bg:'#f1f5f9' },
}

const FILTERS = ['All', 'Unread', 'Exam', 'Attendance', 'Event', 'Finance', 'General']

function Notifications() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState(initialNotifs)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const unreadCount = notifs.filter(n => !n.read).length

  const filtered = notifs.filter(n => {
    const matchFilter =
      filter === 'All'    ? true :
      filter === 'Unread' ? !n.read :
      n.type === filter.toLowerCase()
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function markRead(id: number) {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }

  function deleteNotif(id: number) {
    setNotifs(notifs.filter(n => n.id !== id))
  }

  function clearAll() {
    setNotifs([])
  }

  return (
    <div className="dash-app">

      {/* SIDEBAR */}
      <div className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-icon">🎓</div>
          <div>
            <div className="dash-logo-title">Edu-Center</div>
            <div className="dash-logo-sub">School Dashboard</div>
          </div>
        </div>

        <div className="dash-nav-section">Main Menu</div>
        <ul className="dash-nav">
          <li className="dash-nav-item" onClick={() => navigate('/')}>
            <span className="dash-nav-icon">⊞</span> Dashboard
          </li>
          <li className="dash-nav-item" onClick={() => navigate('/students')}>
            <span className="dash-nav-icon">👨‍🎓</span> Students
          </li>
          <li className="dash-nav-item" onClick={() => navigate('/attendance')}>
            <span className="dash-nav-icon">📅</span> Attendance
          </li>
          <li className="dash-nav-item" onClick={() => navigate('/exam')}>
            <span className="dash-nav-icon">🗓️</span> Exam
          </li>
          <li className="dash-nav-item active">
    <span className="dash-nav-icon">🗓️</span> Notifications
  </li>
  </ul>

        <div className="dash-sidebar-banner">
          <div className="dash-banner-emoji">🔔</div>
          <p>Stay updated with all school activities!</p>
        </div>

        <div className="dash-sidebar-user">
          <div className="dash-user-avatar">HS</div>
          <div>
            <div className="dash-user-name">Halima Selina</div>
            <div className="dash-user-role">Teacher</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="dash-main">

        {/* TOPBAR */}
        <div className="dash-topbar">
          <div>
            <h1 className="dash-page-title">Notifications</h1>
            <p className="dash-page-sub">
              You have <strong style={{color:'#6366f1'}}>{unreadCount} unread</strong> notification{unreadCount !== 1 ? 's' : ''}.
            </p>
          </div>
          <div style={{display:'flex', gap:'10px'}}>
            {unreadCount > 0 && (
              <button className="dash-btn-outline" onClick={markAllRead}>✓ Mark all read</button>
            )}
            {notifs.length > 0 && (
              <button className="dash-btn-primary" onClick={clearAll}>🗑 Clear all</button>
            )}
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="notif-stats-grid">
          <div className="dash-stat-card card-blue">
            <div>
              <div className="dash-stat-num">{notifs.length}</div>
              <div className="dash-stat-label">Total</div>
              <div className="dash-stat-change positive">All notifications</div>
            </div>
            <div className="dash-stat-icon">🔔</div>
          </div>
          <div className="dash-stat-card card-orange">
            <div>
              <div className="dash-stat-num">{unreadCount}</div>
              <div className="dash-stat-label">Unread</div>
              <div className="dash-stat-change positive">Needs attention</div>
            </div>
            <div className="dash-stat-icon">📭</div>
          </div>
          <div className="dash-stat-card card-green">
            <div>
              <div className="dash-stat-num">{notifs.filter(n => n.read).length}</div>
              <div className="dash-stat-label">Read</div>
              <div className="dash-stat-change positive">Already seen</div>
            </div>
            <div className="dash-stat-icon">✅</div>
          </div>
          <div className="dash-stat-card card-purple">
            <div>
              <div className="dash-stat-num">{notifs.filter(n => n.type === 'exam').length}</div>
              <div className="dash-stat-label">Exam Alerts</div>
              <div className="dash-stat-change positive">Exam related</div>
            </div>
            <div className="dash-stat-icon">🗓️</div>
          </div>
        </div>

        {/* NOTIFICATION LIST CARD */}
        <div className="dash-card">
          <div className="dash-card-header" style={{flexWrap:'wrap', gap:'12px'}}>
            <h3>All Notifications</h3>
            <div className="notif-toolbar">
              <input
                className="exam-search"
                placeholder="🔍  Search notifications..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="notif-filter-tabs">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`exam-filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >{f}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="notif-list">
            {filtered.length === 0 ? (
              <div className="notif-empty">
                <div style={{fontSize:'48px', marginBottom:'12px'}}>🔕</div>
                <p>No notifications found.</p>
              </div>
            ) : filtered.map(n => {
              const cfg = typeConfig[n.type]
              return (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? 'notif-unread' : ''}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="notif-icon" style={{background: cfg.bg, color: cfg.color}}>
                    {cfg.icon}
                  </div>
                  <div className="notif-content">
                    <div className="notif-top">
                      <span className="notif-title">{n.title}</span>
                      <span className="notif-type-badge" style={{background: cfg.bg, color: cfg.color}}>
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                      </span>
                    </div>
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">🕐 {n.time}</span>
                  </div>
                  <div className="notif-actions">
                    {!n.read && (
                      <div className="notif-dot" title="Unread"></div>
                    )}
                    <button
                      className="notif-del-btn"
                      onClick={e => { e.stopPropagation(); deleteNotif(n.id) }}
                      title="Delete"
                    >✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications