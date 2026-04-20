import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import './Students.css'

type Student = {
  id: number
  name: string
  grade: string
  subject: string
  status: 'Active' | 'Inactive'
  score: number
  avatar: string
  color: string
}

const COLORS = ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ec4899','#3b82f6']
const PAGE_SIZE = 8

const initialStudents: Student[] = [
  { id: 1,  name: 'Aarav Sharma',   grade: '10th', subject: 'Science',     status: 'Active',   score: 92, avatar: 'AS', color: '#6366f1' },
  { id: 2,  name: 'Priya Mehta',    grade: '9th',  subject: 'Mathematics', status: 'Active',   score: 87, avatar: 'PM', color: '#10b981' },
  { id: 3,  name: 'Rohan Patil',    grade: '11th', subject: 'Commerce',    status: 'Inactive', score: 74, avatar: 'RP', color: '#f59e0b' },
  { id: 4,  name: 'Sneha Kulkarni', grade: '10th', subject: 'Arts',        status: 'Active',   score: 95, avatar: 'SK', color: '#8b5cf6' },
  { id: 5,  name: 'Dev Joshi',      grade: '12th', subject: 'Science',     status: 'Active',   score: 88, avatar: 'DJ', color: '#ec4899' },
  { id: 6,  name: 'Ananya Desai',   grade: '9th',  subject: 'Mathematics', status: 'Active',   score: 91, avatar: 'AD', color: '#6366f1' },
  { id: 7,  name: 'Karan Nair',     grade: '11th', subject: 'Commerce',    status: 'Inactive', score: 65, avatar: 'KN', color: '#f59e0b' },
  { id: 8,  name: 'Ishita Rao',     grade: '12th', subject: 'Arts',        status: 'Active',   score: 83, avatar: 'IR', color: '#10b981' },
  { id: 9,  name: 'Arjun Verma',    grade: '9th',  subject: 'Science',     status: 'Active',   score: 78, avatar: 'AV', color: '#3b82f6' },
  { id: 10, name: 'Meera Iyer',     grade: '10th', subject: 'Arts',        status: 'Active',   score: 89, avatar: 'MI', color: '#ec4899' },
  { id: 11, name: 'Sahil Khan',     grade: '12th', subject: 'Commerce',    status: 'Inactive', score: 60, avatar: 'SK', color: '#f59e0b' },
  { id: 12, name: 'Pooja Nair',     grade: '11th', subject: 'Mathematics', status: 'Active',   score: 93, avatar: 'PN', color: '#8b5cf6' },
]

function getAvatar(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const emptyForm = { name: '', grade: '9th', subject: 'Science', status: 'Active' as 'Active' | 'Inactive', score: '' }

function Students() {
  const navigate = useNavigate()

  const [students, setStudents]         = useState<Student[]>(initialStudents)
  const [search, setSearch]             = useState('')
  const [gradeFilter, setGradeFilter]   = useState('All Grades')
  const [currentPage, setCurrentPage]   = useState(1)

  // modals
  const [showAddModal, setShowAddModal]     = useState(false)
  const [viewStudent, setViewStudent]       = useState<Student | null>(null)
  const [editStudent, setEditStudent]       = useState<Student | null>(null)

  const [form, setForm]     = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})

  // ── FILTER ──
  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase())
    const matchGrade = gradeFilter === 'All Grades' || s.grade === gradeFilter
    return matchSearch && matchGrade
  })

  // ── PAGINATION ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(currentPage, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function goToPage(p: number) {
    if (p >= 1 && p <= totalPages) setCurrentPage(p)
  }

  // reset to page 1 when filter changes
  function handleSearch(val: string) { setSearch(val); setCurrentPage(1) }
  function handleGrade(val: string)  { setGradeFilter(val); setCurrentPage(1) }

  // ── VALIDATE ──
  function validate(f: typeof emptyForm) {
    const e: Record<string, string> = {}
    if (!f.name.trim()) e.name = 'Name is required'
    else if (f.name.trim().split(' ').length < 2) e.name = 'Enter full name (first & last)'
    const sc = Number(f.score)
    if (!f.score) e.score = 'Score is required'
    else if (isNaN(sc) || sc < 0 || sc > 100) e.score = 'Score must be 0–100'
    return e
  }

  // ── ADD ──
  function handleAdd() {
    const e = validate(form)
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const color = COLORS[students.length % COLORS.length]
    setStudents(prev => [{
      id: Date.now(),
      name: form.name.trim(),
      grade: form.grade,
      subject: form.subject,
      status: form.status,
      score: Number(form.score),
      avatar: getAvatar(form.name),
      color,
    }, ...prev])
    setForm(emptyForm); setErrors({})
    setShowAddModal(false); setCurrentPage(1)
  }

  // ── EDIT OPEN ──
  function openEdit(s: Student) {
    setEditStudent(s)
    setEditForm({ name: s.name, grade: s.grade, subject: s.subject, status: s.status, score: String(s.score) })
    setEditErrors({})
  }

  // ── EDIT SAVE ──
  function handleEditSave() {
    const e = validate(editForm)
    if (Object.keys(e).length > 0) { setEditErrors(e); return }
    setStudents(prev => prev.map(s =>
      s.id === editStudent!.id
        ? { ...s, name: editForm.name.trim(), grade: editForm.grade, subject: editForm.subject, status: editForm.status, score: Number(editForm.score), avatar: getAvatar(editForm.name) }
        : s
    ))
    setEditStudent(null)
  }

  // ── DELETE ──
  function handleDelete(id: number) {
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  // ── SHARED FORM FIELDS ──
  function FormFields({ f, setF, errs }: { f: typeof emptyForm, setF: (v: typeof emptyForm) => void, errs: Record<string,string> }) {
    return (
      <>
        <div className="stu-form-group">
          <label>Full Name</label>
          <input type="text" placeholder="e.g. Aarav Sharma" value={f.name}
            onChange={e => setF({ ...f, name: e.target.value })}
            className={errs.name ? 'input-error' : ''} />
          {errs.name && <span className="stu-error">{errs.name}</span>}
        </div>
        <div className="stu-form-row">
          <div className="stu-form-group">
            <label>Grade</label>
            <select value={f.grade} onChange={e => setF({ ...f, grade: e.target.value })}>
              <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
            </select>
          </div>
          <div className="stu-form-group">
            <label>Subject</label>
            <select value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })}>
              <option>Science</option><option>Mathematics</option><option>Commerce</option><option>Arts</option>
            </select>
          </div>
        </div>
        <div className="stu-form-row">
          <div className="stu-form-group">
            <label>Score (0–100)</label>
            <input type="number" placeholder="e.g. 85" min="0" max="100" value={f.score}
              onChange={e => setF({ ...f, score: e.target.value })}
              className={errs.score ? 'input-error' : ''} />
            {errs.score && <span className="stu-error">{errs.score}</span>}
          </div>
          <div className="stu-form-group">
            <label>Status</label>
            <select value={f.status} onChange={e => setF({ ...f, status: e.target.value as 'Active' | 'Inactive' })}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </>
    )
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
          <li className="dash-nav-item active">
            <span className="dash-nav-icon">👨‍🎓</span> Students
          </li>
         <li className="dash-nav-item" onClick={() => navigate('/attendance')}>
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
            <div className="dash-user-name">Halima Selina</div>
            <div className="dash-user-role">Teacher</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="dash-main">

        <div className="dash-topbar">
          <div>
            <h1 className="dash-page-title">Students</h1>
            <p className="dash-page-sub">Manage and track all enrolled students.</p>
          </div>
          <div className="dash-topbar-right">
            <button className="dash-btn-primary" onClick={() => { setShowAddModal(true); setForm(emptyForm); setErrors({}) }}>
              + Add Student
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="dash-stats-grid">
          <div className="dash-stat-card card-blue">
            <div>
              <div className="dash-stat-num">{students.length}</div>
              <div className="dash-stat-label">Total Students</div>
              <div className="dash-stat-change positive">↑ 0.5% than last month</div>
            </div>
            <div className="dash-stat-icon">👨‍🎓</div>
          </div>
          <div className="dash-stat-card card-green">
            <div>
              <div className="dash-stat-num">{students.filter(s => s.status === 'Active').length}</div>
              <div className="dash-stat-label">Active Students</div>
              <div className="dash-stat-change positive">↑ 1.2% than last month</div>
            </div>
            <div className="dash-stat-icon">✅</div>
          </div>
          <div className="dash-stat-card card-orange">
            <div>
              <div className="dash-stat-num">{students.filter(s => s.status === 'Inactive').length}</div>
              <div className="dash-stat-label">Inactive Students</div>
              <div className="dash-stat-change negative">↓ 0.8% than last month</div>
            </div>
            <div className="dash-stat-icon">⏸️</div>
          </div>
          <div className="dash-stat-card card-purple">
            <div>
              <div className="dash-stat-num">
                {students.length > 0 ? Math.round(students.reduce((a, s) => a + s.score, 0) / students.length) : 0}%
              </div>
              <div className="dash-stat-label">Avg. Score</div>
              <div className="dash-stat-change positive">↑ 3% than last month</div>
            </div>
            <div className="dash-stat-icon">🏆</div>
          </div>
        </div>

        {/* TABLE + SIDE */}
        <div className="stu-content-row">
          <div className="dash-card stu-table-card">
            <div className="dash-card-header">
              <h3>All Students</h3>
              <div className="stu-table-controls">
                <input type="text" placeholder="🔍  Search..." className="stu-search"
                  value={search} onChange={e => handleSearch(e.target.value)} />
                <select className="dash-select" value={gradeFilter} onChange={e => handleGrade(e.target.value)}>
                  <option>All Grades</option>
                  <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="stu-empty">
                <div style={{ fontSize: '40px' }}>🔍</div>
                <p>No students found for "<strong>{search}</strong>"</p>
              </div>
            ) : (
              <table className="stu-table">
                <thead>
                  <tr>
                    <th>#</th><th>Student</th><th>Grade</th><th>Subject</th>
                    <th>Score</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, i) => (
                    <tr key={s.id}>
                      <td className="stu-td-muted">{String((safePage - 1) * PAGE_SIZE + i + 1).padStart(2, '0')}</td>
                      <td>
                        <div className="stu-name-cell">
                          <div className="stu-avatar" style={{ background: s.color + '22', color: s.color }}>{s.avatar}</div>
                          <span className="stu-name">{s.name}</span>
                        </div>
                      </td>
                      <td><span className="stu-grade-pill">{s.grade}</span></td>
                      <td className="stu-td-muted">{s.subject}</td>
                      <td>
                        <div className="stu-score-row">
                          <div className="stu-score-track">
                            <div className="stu-score-fill" style={{
                              width: `${s.score}%`,
                              background: s.score >= 90 ? '#10b981' : s.score >= 75 ? '#6366f1' : '#f59e0b'
                            }} />
                          </div>
                          <span className="stu-score-num">{s.score}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`stu-badge ${s.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className="stu-actions">
                          <button className="stu-action-btn view-btn" title="View"
                            onClick={() => setViewStudent(s)}>👁</button>
                          <button className="stu-action-btn edit-btn" title="Edit"
                            onClick={() => openEdit(s)}>✏️</button>
                          <button className="stu-action-btn del-btn" title="Delete"
                            onClick={() => handleDelete(s.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* PAGINATION */}
            <div className="stu-pagination">
              <span className="stu-page-info">
                Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} students
              </span>
              <div className="stu-page-btns">
                <button className="stu-page-btn" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`stu-page-btn ${p === safePage ? 'active-page' : ''}`}
                    onClick={() => goToPage(p)}>{p}</button>
                ))}
                <button className="stu-page-btn" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>›</button>
              </div>
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="stu-side-panel">
            <div className="dash-card stu-side-card">
              <div className="dash-card-header">
                <h3>Top Performers</h3>
                <span className="dash-view-more">This Month</span>
              </div>
              <div className="stu-performer-list">
                {[...students].filter(s => s.status === 'Active').sort((a, b) => b.score - a.score).slice(0, 4).map((s, i) => (
                  <div className="stu-performer-item" key={s.id}>
                    <div className="stu-performer-rank" style={{
                      background: i === 0 ? '#fef3c7' : i === 1 ? '#f1f5f9' : i === 2 ? '#fce7f3' : '#f0fdf4',
                      color: i === 0 ? '#d97706' : i === 1 ? '#64748b' : i === 2 ? '#db2777' : '#16a34a'
                    }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </div>
                    <div className="stu-avatar" style={{ background: s.color + '22', color: s.color, width: '32px', height: '32px', fontSize: '11px' }}>
                      {s.avatar}
                    </div>
                    <div className="stu-performer-info">
                      <div className="stu-performer-name">{s.name}</div>
                      <div className="stu-performer-grade">{s.grade} · {s.subject}</div>
                    </div>
                    <div className="stu-performer-score" style={{ color: s.color }}>{s.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-card stu-side-card">
              <div className="dash-card-header"><h3>Subject Breakdown</h3></div>
              <div className="stu-subject-list">
                {[
                  { name: 'Science', color: '#6366f1', pct: 78 },
                  { name: 'Mathematics', color: '#10b981', pct: 65 },
                  { name: 'Commerce', color: '#f59e0b', pct: 52 },
                  { name: 'Arts', color: '#ec4899', pct: 38 },
                ].map(sub => (
                  <div className="stu-subject-item" key={sub.name}>
                    <div className="stu-subject-top">
                      <span className="stu-subject-name">{sub.name}</span>
                      <span className="stu-subject-count">{students.filter(s => s.subject === sub.name).length} students</span>
                    </div>
                    <div className="stu-subject-track">
                      <div className="stu-subject-fill" style={{ width: `${sub.pct}%`, background: sub.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD MODAL ── */}
      {showAddModal && (
        <div className="stu-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="stu-modal" onClick={e => e.stopPropagation()}>
            <div className="stu-modal-header">
              <h2>Add New Student</h2>
              <button className="stu-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="stu-modal-body">
              <FormFields f={form} setF={setForm} errs={errors} />
            </div>
            <div className="stu-modal-footer">
              <button className="dash-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="dash-btn-primary" onClick={handleAdd}>Add Student</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewStudent && (
        <div className="stu-modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="stu-modal" onClick={e => e.stopPropagation()}>
            <div className="stu-modal-header">
              <h2>Student Details</h2>
              <button className="stu-modal-close" onClick={() => setViewStudent(null)}>✕</button>
            </div>
            <div className="stu-modal-body">
              <div className="stu-view-profile">
                <div className="stu-view-avatar" style={{ background: viewStudent.color + '22', color: viewStudent.color }}>
                  {viewStudent.avatar}
                </div>
                <div className="stu-view-name">{viewStudent.name}</div>
                <span className={`stu-badge ${viewStudent.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                  {viewStudent.status}
                </span>
              </div>
              <div className="stu-view-grid">
                <div className="stu-view-item">
                  <div className="stu-view-label">Grade</div>
                  <div className="stu-view-value">{viewStudent.grade}</div>
                </div>
                <div className="stu-view-item">
                  <div className="stu-view-label">Subject</div>
                  <div className="stu-view-value">{viewStudent.subject}</div>
                </div>
                <div className="stu-view-item">
                  <div className="stu-view-label">Score</div>
                  <div className="stu-view-value" style={{ color: viewStudent.score >= 90 ? '#10b981' : viewStudent.score >= 75 ? '#6366f1' : '#f59e0b' }}>
                    {viewStudent.score} / 100
                  </div>
                </div>
                <div className="stu-view-item">
                  <div className="stu-view-label">Performance</div>
                  <div className="stu-view-value">
                    {viewStudent.score >= 90 ? '🏆 Excellent' : viewStudent.score >= 75 ? '👍 Good' : '⚠️ Needs Improvement'}
                  </div>
                </div>
              </div>
              <div className="stu-view-bar-label">Score Progress</div>
              <div className="stu-score-track" style={{ height: '10px', borderRadius: '999px' }}>
                <div className="stu-score-fill" style={{
                  width: `${viewStudent.score}%`,
                  background: viewStudent.score >= 90 ? '#10b981' : viewStudent.score >= 75 ? '#6366f1' : '#f59e0b',
                  height: '100%', borderRadius: '999px'
                }} />
              </div>
            </div>
            <div className="stu-modal-footer">
              <button className="dash-btn-outline" onClick={() => setViewStudent(null)}>Close</button>
              <button className="dash-btn-primary" onClick={() => { setViewStudent(null); openEdit(viewStudent) }}>Edit Student</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editStudent && (
        <div className="stu-modal-overlay" onClick={() => setEditStudent(null)}>
          <div className="stu-modal" onClick={e => e.stopPropagation()}>
            <div className="stu-modal-header">
              <h2>Edit Student</h2>
              <button className="stu-modal-close" onClick={() => setEditStudent(null)}>✕</button>
            </div>
            <div className="stu-modal-body">
              <FormFields f={editForm} setF={setEditForm} errs={editErrors} />
            </div>
            <div className="stu-modal-footer">
              <button className="dash-btn-outline" onClick={() => setEditStudent(null)}>Cancel</button>
              <button className="dash-btn-primary" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Students