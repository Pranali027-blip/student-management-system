import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import './Attendance.css'

type AttendanceStatus = 'Present' | 'Absent' | 'Late'

type AttendanceRecord = {
  id: number
  name: string
  avatar: string
  color: string
  grade: string
  subject: string
  status: AttendanceStatus
  date: string
  time: string
}

const initialRecords: AttendanceRecord[] = [
  { id:1,  name:'Aarav Sharma',   avatar:'AS', color:'#6366f1', grade:'10th', subject:'Science',     status:'Present', date:'2024-01-18', time:'08:45 AM' },
  { id:2,  name:'Priya Mehta',    avatar:'PM', color:'#10b981', grade:'9th',  subject:'Mathematics', status:'Present', date:'2024-01-18', time:'08:50 AM' },
  { id:3,  name:'Rohan Patil',    avatar:'RP', color:'#f59e0b', grade:'11th', subject:'Commerce',    status:'Absent',  date:'2024-01-18', time:'--'       },
  { id:4,  name:'Sneha Kulkarni', avatar:'SK', color:'#8b5cf6', grade:'10th', subject:'Arts',        status:'Present', date:'2024-01-18', time:'08:42 AM' },
  { id:5,  name:'Dev Joshi',      avatar:'DJ', color:'#ec4899', grade:'12th', subject:'Science',     status:'Late',    date:'2024-01-18', time:'09:15 AM' },
  { id:6,  name:'Ananya Desai',   avatar:'AD', color:'#6366f1', grade:'9th',  subject:'Mathematics', status:'Present', date:'2024-01-18', time:'08:40 AM' },
  { id:7,  name:'Karan Nair',     avatar:'KN', color:'#f59e0b', grade:'11th', subject:'Commerce',    status:'Absent',  date:'2024-01-18', time:'--'       },
  { id:8,  name:'Ishita Rao',     avatar:'IR', color:'#10b981', grade:'12th', subject:'Arts',        status:'Present', date:'2024-01-18', time:'08:55 AM' },
  { id:9,  name:'Arjun Verma',    avatar:'AV', color:'#3b82f6', grade:'9th',  subject:'Science',     status:'Late',    date:'2024-01-18', time:'09:20 AM' },
  { id:10, name:'Meera Iyer',     avatar:'MI', color:'#ec4899', grade:'10th', subject:'Arts',        status:'Present', date:'2024-01-18', time:'08:38 AM' },
  { id:11, name:'Sahil Khan',     avatar:'SK', color:'#f59e0b', grade:'12th', subject:'Commerce',    status:'Absent',  date:'2024-01-18', time:'--'       },
  { id:12, name:'Pooja Nair',     avatar:'PN', color:'#8b5cf6', grade:'11th', subject:'Mathematics', status:'Present', date:'2024-01-18', time:'08:47 AM' },
]

const weekData = [
  { day: 'Mon', present: 10, absent: 1, late: 1 },
  { day: 'Tue', present: 9,  absent: 2, late: 1 },
  { day: 'Wed', present: 11, absent: 1, late: 0 },
  { day: 'Thu', present: 8,  absent: 3, late: 1 },
  { day: 'Fri', present: 10, absent: 0, late: 2 },
]

const PAGE_SIZE = 8

function Attendance() {
  const navigate = useNavigate()

  const [records, setRecords]         = useState<AttendanceRecord[]>(initialRecords)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [editId, setEditId]           = useState<number | null>(null)
  const [editStatus, setEditStatus]   = useState<AttendanceStatus>('Present')
  const [showEditModal, setShowEditModal] = useState(false)

 
  const filtered = records.filter(r => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.grade.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(currentPage, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearch(v: string) { setSearch(v); setCurrentPage(1) }
  function handleFilter(v: string) { setStatusFilter(v); setCurrentPage(1) }
  function goToPage(p: number) { if (p >= 1 && p <= totalPages) setCurrentPage(p) }

  
  function quickToggle(id: number, status: AttendanceStatus) {
    setRecords(prev => prev.map(r =>
      r.id === id ? { ...r, status, time: status === 'Absent' ? '--' : status === 'Late' ? '09:10 AM' : '08:45 AM' } : r
    ))
  }

 
  function openEdit(r: AttendanceRecord) {
    setEditId(r.id)
    setEditStatus(r.status)
    setShowEditModal(true)
  }

  function saveEdit() {
    setRecords(prev => prev.map(r =>
      r.id === editId ? {
        ...r,
        status: editStatus,
        time: editStatus === 'Absent' ? '--' : editStatus === 'Late' ? '09:10 AM' : '08:45 AM'
      } : r
    ))
    setShowEditModal(false)
  }

  const present = records.filter(r => r.status === 'Present').length
  const absent  = records.filter(r => r.status === 'Absent').length
  const late    = records.filter(r => r.status === 'Late').length
  const total   = records.length
  const pct     = Math.round((present / total) * 100)

  return (
    <div className="dash-app">

     
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
          <li className="dash-nav-item active">
            <span className="dash-nav-icon">📅</span> Attendance
          </li>
          <li className="dash-nav-item" onClick={() => navigate('/exam')}>
  <span className="dash-nav-icon">🗓️</span> Exam
</li>
          <li className="dash-nav-item" onClick={() => navigate('/notifications')}>
  <span className="dash-nav-icon">🔔</span> Notifications
</li>
        </ul>
        <div className="dash-sidebar-banner">
          <div className="dash-banner-emoji">📚</div>
          <p>Track student progress easily!</p>
        </div>
        <div className="dash-sidebar-user">
          <div className="dash-user-avatar">HS</div>
          <div>
            <div className="dash-user-name">Pranali Bagilgekar</div>
            <div className="dash-user-role">Teacher</div>
          </div>
        </div>
      </div>

      
      <div className="dash-main">

        
        <div className="dash-topbar">
          <div>
            <h1 className="dash-page-title">Attendance</h1>
            <p className="dash-page-sub">Track and manage daily student attendance.</p>
          </div>
          <div className="dash-topbar-right">
            <div className="att-date-badge">
  📅 {new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}
</div>
          </div>
        </div>

       
        <div className="dash-stats-grid">
          <div className="dash-stat-card card-blue">
            <div>
              <div className="dash-stat-num">{total}</div>
              <div className="dash-stat-label">Total Students</div>
              <div className="dash-stat-change positive">Today's class</div>
            </div>
            <div className="dash-stat-icon">👥</div>
          </div>
          <div className="dash-stat-card card-green">
            <div>
              <div className="dash-stat-num">{present}</div>
              <div className="dash-stat-label">Present Today</div>
              <div className="dash-stat-change positive">↑ {pct}% attendance</div>
            </div>
            <div className="dash-stat-icon">✅</div>
          </div>
          <div className="dash-stat-card card-orange">
            <div>
              <div className="dash-stat-num">{absent}</div>
              <div className="dash-stat-label">Absent Today</div>
              <div className="dash-stat-change negative">↓ {Math.round((absent/total)*100)}% of class</div>
            </div>
            <div className="dash-stat-icon">❌</div>
          </div>
          <div className="dash-stat-card card-purple">
            <div>
              <div className="dash-stat-num">{late}</div>
              <div className="dash-stat-label">Late Arrivals</div>
              <div className="dash-stat-change" style={{color:'#8b5cf6'}}>⏰ {Math.round((late/total)*100)}% of class</div>
            </div>
            <div className="dash-stat-icon">⏰</div>
          </div>
        </div>

       
        <div className="att-mid-row">

          
          <div className="dash-card att-donut-card">
            <div className="dash-card-header">
              <h3>Today's Overview</h3>
              <span className="dash-view-more">Jan 2024</span>
            </div>
            <div className="att-donut-wrap">
              <svg viewBox="0 0 140 140" width="140" height="140">
                
                <circle cx="70" cy="70" r="54" fill="none" stroke="#f0f0f8" strokeWidth="16"/>
               
                <circle cx="70" cy="70" r="54" fill="none" stroke="#10b981" strokeWidth="16"
                  strokeDasharray={`${(present/total)*339.3} 339.3`}
                  strokeLinecap="round" transform="rotate(-90 70 70)"/>
               
                <circle cx="70" cy="70" r="54" fill="none" stroke="#f59e0b" strokeWidth="16"
                  strokeDasharray={`${(late/total)*339.3} 339.3`}
                  strokeLinecap="round"
                  transform={`rotate(${-90 + (present/total)*360} 70 70)`}/>
                
                <circle cx="70" cy="70" r="54" fill="none" stroke="#ef4444" strokeWidth="16"
                  strokeDasharray={`${(absent/total)*339.3} 339.3`}
                  strokeLinecap="round"
                  transform={`rotate(${-90 + ((present+late)/total)*360} 70 70)`}/>
                <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1e1b4b">{pct}%</text>
                <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#9ca3af">Present</text>
              </svg>
              <div className="att-donut-legend">
                <div className="att-legend-item">
                  <div className="att-legend-dot" style={{background:'#10b981'}}></div>
                  <div>
                    <div className="att-legend-label">Present</div>
                    <div className="att-legend-val">{present} students</div>
                  </div>
                </div>
                <div className="att-legend-item">
                  <div className="att-legend-dot" style={{background:'#f59e0b'}}></div>
                  <div>
                    <div className="att-legend-label">Late</div>
                    <div className="att-legend-val">{late} students</div>
                  </div>
                </div>
                <div className="att-legend-item">
                  <div className="att-legend-dot" style={{background:'#ef4444'}}></div>
                  <div>
                    <div className="att-legend-label">Absent</div>
                    <div className="att-legend-val">{absent} students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="dash-card att-weekly-card">
            <div className="dash-card-header">
              <h3>Weekly Attendance</h3>
              <span className="dash-view-more">This Week</span>
            </div>
            <div className="att-bar-chart">
              {weekData.map(d => (
                <div className="att-bar-col" key={d.day}>
                  <div className="att-bars">
                    <div className="att-bar-wrap">
                      <div className="att-bar" style={{ height:`${(d.present/12)*100}%`, background:'#10b981' }}>
                        <span className="att-bar-tip">{d.present}</span>
                      </div>
                    </div>
                    <div className="att-bar-wrap">
                      <div className="att-bar" style={{ height:`${(d.late/12)*100}%`, background:'#f59e0b' }}>
                        <span className="att-bar-tip">{d.late}</span>
                      </div>
                    </div>
                    <div className="att-bar-wrap">
                      <div className="att-bar" style={{ height:`${(d.absent/12)*100}%`, background:'#ef4444' }}>
                        <span className="att-bar-tip">{d.absent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="att-bar-day">{d.day}</div>
                </div>
              ))}
            </div>
            <div className="att-bar-legend">
              <span><span className="att-bar-dot" style={{background:'#10b981'}}></span>Present</span>
              <span><span className="att-bar-dot" style={{background:'#f59e0b'}}></span>Late</span>
              <span><span className="att-bar-dot" style={{background:'#ef4444'}}></span>Absent</span>
            </div>
          </div>

          
          <div className="dash-card att-grade-card">
            <div className="dash-card-header">
              <h3>By Grade</h3>
            </div>
            <div className="att-grade-list">
              {['9th','10th','11th','12th'].map((g, gi) => {
                const gradeRecs  = records.filter(r => r.grade === g)
                const gradePresent = gradeRecs.filter(r => r.status === 'Present').length
                const gradePct   = gradeRecs.length > 0 ? Math.round((gradePresent / gradeRecs.length) * 100) : 0
                const colors = ['#6366f1','#10b981','#f59e0b','#ec4899']
                return (
                  <div className="att-grade-item" key={g}>
                    <div className="att-grade-left">
                      <div className="att-grade-badge" style={{background: colors[gi]+'22', color: colors[gi]}}>{g}</div>
                      <div>
                        <div className="att-grade-name">Grade {g}</div>
                        <div className="att-grade-sub">{gradeRecs.length} students</div>
                      </div>
                    </div>
                    <div className="att-grade-right">
                      <div className="att-grade-pct" style={{color: colors[gi]}}>{gradePct}%</div>
                      <div className="stu-score-track" style={{width:'60px'}}>
                        <div className="stu-score-fill" style={{width:`${gradePct}%`, background: colors[gi]}}/>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

       
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Attendance Register — Today</h3>
            <div className="stu-table-controls">
              <input type="text" placeholder="🔍  Search students..."
                className="stu-search" value={search}
                onChange={e => handleSearch(e.target.value)} />
              <select className="dash-select" value={statusFilter}
                onChange={e => handleFilter(e.target.value)}>
                <option>All</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="stu-empty">
              <div style={{fontSize:'40px'}}>🔍</div>
              <p>No records found for "<strong>{search}</strong>"</p>
            </div>
          ) : (
            <table className="stu-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Subject</th>
                  <th>Time In</th>
                  <th>Status</th>
                  <th>Quick Mark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr key={r.id}>
                    <td className="stu-td-muted">{String((safePage-1)*PAGE_SIZE+i+1).padStart(2,'0')}</td>
                    <td>
                      <div className="stu-name-cell">
                        <div className="stu-avatar" style={{background: r.color+'22', color: r.color}}>{r.avatar}</div>
                        <span className="stu-name">{r.name}</span>
                      </div>
                    </td>
                    <td><span className="stu-grade-pill">{r.grade}</span></td>
                    <td className="stu-td-muted">{r.subject}</td>
                    <td className="stu-td-muted">{r.time}</td>
                    <td>
                      <span className={`att-status-badge att-${r.status.toLowerCase()}`}>
                        {r.status === 'Present' ? '✓' : r.status === 'Absent' ? '✗' : '⏰'} {r.status}
                      </span>
                    </td>
                    <td>
                      <div className="att-quick-btns">
                        <button
                          className={`att-quick-btn ${r.status === 'Present' ? 'att-q-active-green' : 'att-q-green'}`}
                          onClick={() => quickToggle(r.id, 'Present')} title="Mark Present">P</button>
                        <button
                          className={`att-quick-btn ${r.status === 'Late' ? 'att-q-active-amber' : 'att-q-amber'}`}
                          onClick={() => quickToggle(r.id, 'Late')} title="Mark Late">L</button>
                        <button
                          className={`att-quick-btn ${r.status === 'Absent' ? 'att-q-active-red' : 'att-q-red'}`}
                          onClick={() => quickToggle(r.id, 'Absent')} title="Mark Absent">A</button>
                      </div>
                    </td>
                    <td>
                      <button className="stu-action-btn edit-btn" title="Edit"
                        onClick={() => openEdit(r)}>✏️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="stu-pagination">
            <span className="stu-page-info">
              Showing {filtered.length === 0 ? 0 : (safePage-1)*PAGE_SIZE+1}–{Math.min(safePage*PAGE_SIZE, filtered.length)} of {filtered.length} records
            </span>
            <div className="stu-page-btns">
              <button className="stu-page-btn" onClick={() => goToPage(safePage-1)} disabled={safePage===1}>‹</button>
              {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
                <button key={p} className={`stu-page-btn ${p===safePage ? 'active-page':''}`}
                  onClick={() => goToPage(p)}>{p}</button>
              ))}
              <button className="stu-page-btn" onClick={() => goToPage(safePage+1)} disabled={safePage===totalPages}>›</button>
            </div>
          </div>
        </div>
      </div>

      
      {showEditModal && (
        <div className="stu-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="stu-modal" onClick={e => e.stopPropagation()}>
            <div className="stu-modal-header">
              <h2>Update Attendance</h2>
              <button className="stu-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="stu-modal-body">
              <p style={{fontSize:'14px', color:'#6b7280', marginBottom:'16px'}}>
                Select the correct attendance status for this student.
              </p>
              <div className="att-status-picker">
                {(['Present','Late','Absent'] as AttendanceStatus[]).map(s => (
                  <div key={s}
                    className={`att-status-option ${editStatus === s ? 'att-status-selected' : ''}`}
                    style={{
                      borderColor: editStatus === s ? (s==='Present'?'#10b981':s==='Late'?'#f59e0b':'#ef4444') : '#e5e7eb',
                      background: editStatus === s ? (s==='Present'?'#d1fae5':s==='Late'?'#fef3c7':'#fee2e2') : '#f9fafb',
                    }}
                    onClick={() => setEditStatus(s)}>
                    <div className="att-status-icon">
                      {s === 'Present' ? '✅' : s === 'Late' ? '⏰' : '❌'}
                    </div>
                    <div className="att-status-opt-label" style={{
                      color: s==='Present'?'#065f46':s==='Late'?'#92400e':'#991b1b'
                    }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="stu-modal-footer">
              <button className="dash-btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="dash-btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance