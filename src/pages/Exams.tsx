import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Exam.css'
import './Dashboard.css'

const examsData = [
  { id: 1, subject: 'Mathematics', code: 'MATH-101', date: '2024-02-10', time: '10:00 AM', duration: '3 hrs', room: 'Hall A', students: 120, status: 'Upcoming', type: 'Final' },
  { id: 2, subject: 'Physics', code: 'PHY-102', date: '2024-02-12', time: '09:00 AM', duration: '3 hrs', room: 'Hall B', students: 98, status: 'Upcoming', type: 'Final' },
  { id: 3, subject: 'English Literature', code: 'ENG-103', date: '2024-01-28', time: '11:00 AM', duration: '2 hrs', room: 'Room 5', students: 75, status: 'Completed', type: 'Mid-Term' },
  { id: 4, subject: 'Computer Science', code: 'CS-104', date: '2024-01-20', time: '01:00 PM', duration: '3 hrs', room: 'Lab 1', students: 60, status: 'Completed', type: 'Mid-Term' },
  { id: 5, subject: 'Chemistry', code: 'CHEM-105', date: '2024-02-15', time: '10:00 AM', duration: '3 hrs', room: 'Hall C', students: 88, status: 'Upcoming', type: 'Final' },
  { id: 6, subject: 'History', code: 'HIS-106', date: '2024-02-05', time: '12:00 PM', duration: '2 hrs', room: 'Room 8', students: 55, status: 'Ongoing', type: 'Unit Test' },
]

const initialModal = { subject: '', code: '', date: '', time: '', duration: '', room: '', students: '', type: 'Final' }

function Exam() {
  const navigate = useNavigate()
  const [exams, setExams] = useState(examsData)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialModal)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = exams.filter(e => {
    const matchFilter = filter === 'All' || e.status === filter
    const matchSearch = e.subject.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total: exams.length,
    upcoming: exams.filter(e => e.status === 'Upcoming').length,
    ongoing: exams.filter(e => e.status === 'Ongoing').length,
    completed: exams.filter(e => e.status === 'Completed').length,
  }

  function handleAdd() {
    if (!form.subject || !form.date || !form.time || !form.room) return alert('Please fill all required fields.')
    const newExam = {
      id: Date.now(),
      subject: form.subject,
      code: form.code,
      date: form.date,
      time: form.time,
      duration: form.duration || '2 hrs',
      room: form.room,
      students: Number(form.students) || 0,
      status: 'Upcoming',
      type: form.type,
    }
    setExams([newExam, ...exams])
    setShowModal(false)
    setForm(initialModal)
  }

  function handleDelete(id: number) {
    setExams(exams.filter(e => e.id !== id))
    setDeleteId(null)
  }

  function statusClass(s: string) {
    if (s === 'Upcoming') return 'badge-upcoming'
    if (s === 'Ongoing') return 'badge-ongoing'
    return 'badge-completed'
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
          <li className="dash-nav-item active">
            <span className="dash-nav-icon">🗓️</span> Exam
          </li>
          <li className="dash-nav-item" onClick={() => navigate('/notifications')}>
            <span className="dash-nav-icon">🔔</span> Notifications
          </li>
        </ul>

        <div className="dash-sidebar-banner">
          <div className="dash-banner-emoji">📝</div>
          <p>Manage all exams easily from one place!</p>
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

        <div className="dash-topbar">
          <div>
            <h1 className="dash-page-title">Exam Schedule</h1>
            <p className="dash-page-sub">Manage and track all upcoming & past exams.</p>
          </div>
          <button className="dash-btn-primary" onClick={() => setShowModal(true)}>+ Schedule Exam</button>
        </div>

        <div className="exam-stats-grid">
          <div className="dash-stat-card card-blue">
            <div>
              <div className="dash-stat-num">{stats.total}</div>
              <div className="dash-stat-label">Total Exams</div>
              <div className="dash-stat-change positive">↑ All scheduled</div>
            </div>
            <div className="dash-stat-icon">🗓️</div>
          </div>
          <div className="dash-stat-card card-orange">
            <div>
              <div className="dash-stat-num">{stats.upcoming}</div>
              <div className="dash-stat-label">Upcoming</div>
              <div className="dash-stat-change positive">↑ Scheduled ahead</div>
            </div>
            <div className="dash-stat-icon">⏳</div>
          </div>
          <div className="dash-stat-card card-purple">
            <div>
              <div className="dash-stat-num">{stats.ongoing}</div>
              <div className="dash-stat-label">Ongoing</div>
              <div className="dash-stat-change positive">● Live now</div>
            </div>
            <div className="dash-stat-icon">🔴</div>
          </div>
          <div className="dash-stat-card card-green">
            <div>
              <div className="dash-stat-num">{stats.completed}</div>
              <div className="dash-stat-label">Completed</div>
              <div className="dash-stat-change positive">✓ Done</div>
            </div>
            <div className="dash-stat-icon">✅</div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>All Exams</h3>
            <div className="exam-toolbar">
              <input
                className="exam-search"
                placeholder="🔍  Search subject or code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="exam-filter-tabs">
                {['All', 'Upcoming', 'Ongoing', 'Completed'].map(f => (
                  <button
                    key={f}
                    className={`exam-filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >{f}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="exam-table-wrap">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Room</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} className="exam-empty">No exams found.</td></tr>
                ) : filtered.map((e, i) => (
                  <tr key={e.id}>
                    <td>{i + 1}</td>
                    <td><span className="exam-subject-name">{e.subject}</span></td>
                    <td><span className="exam-code">{e.code}</span></td>
                    <td>{e.type}</td>
                    <td>{e.date}</td>
                    <td>{e.time}</td>
                    <td>{e.duration}</td>
                    <td>{e.room}</td>
                    <td>{e.students}</td>
                    <td><span className={`exam-badge ${statusClass(e.status)}`}>{e.status}</span></td>
                    <td>
                      <button className="exam-del-btn" onClick={() => setDeleteId(e.id)} title="Delete">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD EXAM MODAL */}
      {showModal && (
        <div className="exam-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="exam-modal" onClick={e => e.stopPropagation()}>
            <div className="exam-modal-header">
              <h3>Schedule New Exam</h3>
              <button className="exam-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="exam-modal-body">
              <div className="exam-form-grid">
                <div className="exam-form-group">
                  <label>Subject *</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" />
                </div>
                <div className="exam-form-group">
                  <label>Code</label>
                  <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. MATH-101" />
                </div>
                <div className="exam-form-group">
                  <label>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="exam-form-group">
                  <label>Time *</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
                <div className="exam-form-group">
                  <label>Duration</label>
                  <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 hrs" />
                </div>
                <div className="exam-form-group">
                  <label>Room *</label>
                  <input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="e.g. Hall A" />
                </div>
                <div className="exam-form-group">
                  <label>Students</label>
                  <input type="number" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} placeholder="e.g. 100" />
                </div>
                <div className="exam-form-group">
                  <label>Exam Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Final</option>
                    <option>Mid-Term</option>
                    <option>Unit Test</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="exam-modal-footer">
              <button className="dash-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="dash-btn-primary" onClick={handleAdd}>+ Add Exam</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId !== null && (
        <div className="exam-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="exam-modal exam-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="exam-modal-header">
              <h3>Confirm Delete</h3>
              <button className="exam-modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="exam-modal-body">
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Are you sure you want to delete this exam? This action cannot be undone.</p>
            </div>
            <div className="exam-modal-footer">
              <button className="dash-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="dash-btn-primary" style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Exam