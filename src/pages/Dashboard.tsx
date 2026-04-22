import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const YEARS = [2023, 2024, 2025, 2026]

function buildCalendar(month: number, year: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

const chartPaths: Record<string, { blue: string; blueFill: string; green: string; greenFill: string }> = {
  'This Month': {
    blue:      "M0,80 C40,60 80,100 120,70 C160,40 200,90 240,55 C280,20 320,75 360,50 C400,25 450,60 500,40",
    blueFill:  "M0,80 C40,60 80,100 120,70 C160,40 200,90 240,55 C280,20 320,75 360,50 C400,25 450,60 500,40 L500,130 L0,130 Z",
    green:     "M0,100 C40,90 80,110 120,95 C160,80 200,100 240,85 C280,70 320,95 360,80 C400,65 450,85 500,70",
    greenFill: "M0,100 C40,90 80,110 120,95 C160,80 200,100 240,85 C280,70 320,95 360,80 C400,65 450,85 500,70 L500,130 L0,130 Z",
  },
  'Last Month': {
    blue:      "M0,90 C40,70 80,110 120,80 C160,50 200,95 240,65 C280,35 320,80 360,60 C400,40 450,70 500,55",
    blueFill:  "M0,90 C40,70 80,110 120,80 C160,50 200,95 240,65 C280,35 320,80 360,60 C400,40 450,70 500,55 L500,130 L0,130 Z",
    green:     "M0,105 C40,95 80,115 120,100 C160,85 200,105 240,90 C280,75 320,100 360,88 C400,72 450,90 500,78",
    greenFill: "M0,105 C40,95 80,115 120,100 C160,85 200,105 240,90 C280,75 320,100 360,88 C400,72 450,90 500,78 L500,130 L0,130 Z",
  },
}

const initialEvents = [
  { date:'3',  day:'Wed', color:'#6366f1', title:'School Live Concert Choir', sub:'Charity Event 2024',    sold:'60/650'  },
  { date:'28', day:'Fri', color:'#10b981', title:'The Story Of Danau Toba',   sub:'Musical Drama',         sold:'120/300' },
  { date:'15', day:'Mon', color:'#f59e0b', title:'Science Exhibition 2024',   sub:'Annual Event',          sold:'200/500' },
]

const newEventInit = { title: '', sub: '', date: '', sold: '', color: '#6366f1' }

const financeData = {
  Weekly:  { income: '$4,69,244',   expense: '$33,456'   },
  Monthly: { income: '$18,74,320',  expense: '$1,12,800' },
}

function Dashboard() {
  const navigate = useNavigate()
  const today = new Date()

  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const calWeeks = buildCalendar(calMonth, calYear)

  const [chartPeriod, setChartPeriod] = useState('This Month')

  const [events, setEvents] = useState(initialEvents)
  const [showEventModal, setShowEventModal] = useState(false)
  const [newEvent, setNewEvent] = useState(newEventInit)

  const [financeTab, setFinanceTab] = useState<'Weekly' | 'Monthly'>('Weekly')

  function handleAddEvent() {
    if (!newEvent.title || !newEvent.date) return alert('Please fill title and date.')
    const d = new Date(newEvent.date)
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    setEvents([...events, {
      date:  String(d.getDate()),
      day:   days[d.getDay()],
      color: newEvent.color,
      title: newEvent.title,
      sub:   newEvent.sub,
      sold:  newEvent.sold || '0/100',
    }])
    setNewEvent(newEventInit)
    setShowEventModal(false)
  }

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
          <li className="dash-nav-item active" onClick={() => navigate('/')}>
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
            <div className="dash-user-name">Pranali Bagilgekar </div>
            <div className="dash-user-role">Teacher</div>
          </div>
        </div>
      </div>

      <div className="dash-main">

        <div className="dash-topbar">
          <div>
            <h1 className="dash-page-title">Dashboard</h1>
            <p className="dash-page-sub">Hi Pranali! Welcome to Edu-Center Dashboard.</p>
          </div>
        </div>

        <div className="dash-top-row">
          <div className="dash-stats-grid">
            <div className="dash-stat-card card-blue">
              <div>
                <div className="dash-stat-num">6,825</div>
                <div className="dash-stat-label">Total Students</div>
                <div className="dash-stat-change positive">↑ 0.5% than last month</div>
              </div>
              <div className="dash-stat-icon">👨‍🎓</div>
            </div>
            <div className="dash-stat-card card-green">
              <div>
                <div className="dash-stat-num">654</div>
                <div className="dash-stat-label">Total Teachers</div>
                <div className="dash-stat-change negative">↓ 3% than last month</div>
              </div>
              <div className="dash-stat-icon">👩‍🏫</div>
            </div>
            <div className="dash-stat-card card-orange">
              <div>
                <div className="dash-stat-num">656</div>
                <div className="dash-stat-label">Events</div>
                <div className="dash-stat-change positive">↑ 8% than last month</div>
              </div>
              <div className="dash-stat-icon">🎉</div>
            </div>
            <div className="dash-stat-card card-purple">
              <div>
                <div className="dash-stat-num">1,397</div>
                <div className="dash-stat-label">Invoice Status</div>
                <div className="dash-stat-change positive">↑ 2% than last month</div>
              </div>
              <div className="dash-stat-icon">📄</div>
            </div>
          </div>

          <div className="dash-promo-banner">
            <div className="dash-promo-text">
              <h2>Upcoming Exams<br />Are Near!</h2>
              <p>View schedules, rooms & timetables for all exams.</p>
              <button className="dash-btn-white" onClick={() => navigate('/exam')}>View Exam Schedule →</button>
            </div>
            <div className="dash-promo-illustration">📝</div>
          </div>
        </div>

        <div className="dash-mid-row">

          <div className="dash-card dash-chart-card">
            <div className="dash-card-header">
              <h3>School Performance</h3>
              <div className="dash-chart-legend">
                <span className="legend-dot blue"></span> Students
                <span className="legend-dot green" style={{marginLeft:'12px'}}></span> Teachers
                <select
                  className="dash-select"
                  value={chartPeriod}
                  onChange={e => setChartPeriod(e.target.value)}
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
            </div>
            <div className="dash-chart-area">
              <svg viewBox="0 0 500 130" preserveAspectRatio="none" style={{width:'100%',height:'130px'}}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d={chartPaths[chartPeriod].blueFill}  fill="url(#blueGrad)"/>
                <path d={chartPaths[chartPeriod].blue}      fill="none" stroke="#6366f1" strokeWidth="2.5"/>
                <path d={chartPaths[chartPeriod].greenFill} fill="url(#greenGrad)"/>
                <path d={chartPaths[chartPeriod].green}     fill="none" stroke="#10b981" strokeWidth="2.5"/>
              </svg>
              <div className="dash-chart-labels">
                {['Week 01','Week 02','Week 03','Week 04','Week 05','Week 06','Week 07','Week 08','Week 09','Week 10'].map(w => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-card dash-events-card">
            <div className="dash-card-header">
              <h3>Upcoming Events</h3>
              <span className="dash-view-more" onClick={() => navigate('/exam')}>View more →</span>
            </div>
            <div className="dash-event-list">
              {events.slice(0, 3).map((e, i) => (
                <div className="dash-event-item" key={i}>
                  <div className="dash-event-date" style={{background: e.color + '18', color: e.color}}>
                    <div className="dash-event-num">{e.date}</div>
                    <div className="dash-event-day">{e.day}</div>
                  </div>
                  <div className="dash-event-info">
                    <div className="dash-event-title">{e.title}</div>
                    <div className="dash-event-sub">{e.sub}</div>
                    <div className="dash-event-sold">Ticket Sold: {e.sold}</div>
                  </div>
                  <div className="dash-event-dot" style={{background: e.color}}></div>
                </div>
              ))}
            </div>
            <button
              className="dash-btn-primary"
              style={{width:'100%', marginTop:'12px'}}
              onClick={() => setShowEventModal(true)}
            >+ New Events</button>
          </div>
        </div>

        <div className="dash-bottom-row">

          <div className="dash-card dash-calendar-card">
            <div className="dash-card-header">
              <h3>School Event Calendar</h3>
              <div style={{display:'flex', gap:'8px'}}>
                <select
                  className="dash-select"
                  value={calMonth}
                  onChange={e => setCalMonth(Number(e.target.value))}
                >
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <select
                  className="dash-select"
                  value={calYear}
                  onChange={e => setCalYear(Number(e.target.value))}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <table className="dash-cal-table">
              <thead>
                <tr>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <th key={d}>{d}</th>)}</tr>
              </thead>
              <tbody>
                {calWeeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((d, di) => {
                      const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                      const isWeekend = di >= 5
                      const isEmpty = !d
                      return (
                        <td key={di} className={isToday ? 'cal-today' : isWeekend ? 'cal-weekend' : isEmpty ? 'cal-empty' : ''}>
                          {d || ''}
                          {[3,9,23].includes(d!)  && <div className="cal-dot" style={{background:'#6366f1'}}></div>}
                          {[15,28].includes(d!)   && <div className="cal-dot" style={{background:'#10b981'}}></div>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-card dash-finance-card">
            <div className="dash-card-header">
              <h3>School Finance</h3>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <span
                  className={`dash-toggle-btn ${financeTab === 'Monthly' ? 'active-toggle' : ''}`}
                  onClick={() => setFinanceTab('Monthly')}
                >Monthly</span>
                <span
                  className={`dash-toggle-btn ${financeTab === 'Weekly' ? 'active-toggle' : ''}`}
                  onClick={() => setFinanceTab('Weekly')}
                >Weekly</span>
              </div>
            </div>
            <div className="dash-finance-stats">
              <div className="dash-finance-stat">
                <div className="dash-finance-icon">↗</div>
                <div>
                  <div className="dash-finance-label">Income</div>
                  <div className="dash-finance-amount">{financeData[financeTab].income}</div>
                </div>
              </div>
              <div className="dash-finance-stat">
                <div className="dash-finance-icon expense-icon">↘</div>
                <div>
                  <div className="dash-finance-label">Expense</div>
                  <div className="dash-finance-amount">{financeData[financeTab].expense}</div>
                </div>
              </div>
            </div>
            <div className="dash-finance-chart">
              {financeTab === 'Weekly' ? (
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{width:'100%',height:'80px'}}>
                  <path d="M0,60 C30,40 60,70 90,45 C120,20 150,55 180,35 C210,15 240,50 270,30 C285,20 295,35 300,25" fill="none" stroke="#10b981" strokeWidth="2"/>
                  <path d="M0,65 C30,55 60,70 90,60 C120,50 150,65 180,55 C210,45 240,60 270,50 C285,45 295,55 300,50" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                </svg>
              ) : (
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{width:'100%',height:'80px'}}>
                  <path d="M0,50 C25,30 50,60 75,35 C100,10 125,45 150,25 C175,5 200,40 225,20 C250,5 275,30 300,15" fill="none" stroke="#10b981" strokeWidth="2"/>
                  <path d="M0,60 C25,50 50,65 75,55 C100,45 125,60 150,52 C175,44 200,58 225,48 C250,38 275,52 300,44" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                </svg>
              )}
              <div className="dash-chart-labels">
                {financeTab === 'Weekly'
                  ? ['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => <span key={d}>{d}</span>)
                  : ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map(d => <span key={d}>{d}</span>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEventModal && (
        <div className="exam-modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="exam-modal" onClick={e => e.stopPropagation()}>
            <div className="exam-modal-header">
              <h3>Add New Event</h3>
              <button className="exam-modal-close" onClick={() => setShowEventModal(false)}>✕</button>
            </div>
            <div className="exam-modal-body">
              <div className="exam-form-grid">
                <div className="exam-form-group" style={{gridColumn:'1/-1'}}>
                  <label>Event Title *</label>
                  <input
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g. Annual Sports Day"
                  />
                </div>
                <div className="exam-form-group">
                  <label>Sub Title</label>
                  <input
                    value={newEvent.sub}
                    onChange={e => setNewEvent({...newEvent, sub: e.target.value})}
                    placeholder="e.g. Annual Event"
                  />
                </div>
                <div className="exam-form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="exam-form-group">
                  <label>Ticket Sold</label>
                  <input
                    value={newEvent.sold}
                    onChange={e => setNewEvent({...newEvent, sold: e.target.value})}
                    placeholder="e.g. 50/200"
                  />
                </div>
                <div className="exam-form-group">
                  <label>Color</label>
                  <select
                    value={newEvent.color}
                    onChange={e => setNewEvent({...newEvent, color: e.target.value})}
                  >
                    <option value="#6366f1">Indigo</option>
                    <option value="#10b981">Green</option>
                    <option value="#f59e0b">Amber</option>
                    <option value="#ef4444">Red</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="exam-modal-footer">
              <button className="dash-btn-outline" onClick={() => setShowEventModal(false)}>Cancel</button>
              <button className="dash-btn-primary" onClick={handleAddEvent}>+ Add Event</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard