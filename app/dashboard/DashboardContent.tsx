'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function DashboardContent({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState('inbox')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── NAV ── */}
      <nav>
        <div className="nav-inner">
          <div className="logo-name">Chen Sheffer</div>
          <div className="nav-links">
            <button className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>Inbox</button>
            <button className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>Calendar</button>
            <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
            <button className={`tab-btn ${activeTab === 'notebooks' ? 'active' : ''}`} onClick={() => setActiveTab('notebooks')}>Notebooks</button>
            <button className={`tab-btn ${activeTab === 'gmail' ? 'active' : ''}`} onClick={() => setActiveTab('gmail')}>Gmail</button>
            <button className="month-pill">📅 April 2026</button>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition ml-4"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* ── SUBBARS ── */}
      <div className="subbar" style={{ display: activeTab === 'inbox' ? 'block' : 'none' }}>
        <div className="subbar-inner">
          <span className="sub-label">📅 Events</span>
          <span className="hol">No events today</span>
          <span className="hol red">Passover · Apr 1-9</span>
        </div>
      </div>

      <div className="subbar" style={{ display: activeTab === 'calendar' ? 'block' : 'none' }}>
        <div className="subbar-inner">
          <span className="sub-label">✡️ Holidays</span>
          <span className="hol">Pesach I · Apr 2</span>
          <span className="hol">Yom HaShoah · Apr 14</span>
          <span className="hol">Yom HaZikaron · Apr 21</span>
          <span className="hol">Yom HaAtzmaut · Apr 22</span>
        </div>
      </div>

      <div className="subbar" style={{ display: activeTab === 'tasks' ? 'block' : 'none' }}>
        <div className="subbar-inner">
          <span className="sub-label">✅ Google Tasks</span>
          <span className="hol">{userEmail} · Live</span>
          <span className="hol">WORK list · 10 active tasks</span>
          <span className="hol">Home-TASKS · 2 tasks</span>
        </div>
      </div>

      <div className="subbar" style={{ display: activeTab === 'notebooks' ? 'block' : 'none' }}>
        <div className="subbar-inner">
          <span className="sub-label">📓 Notebooks</span>
          <span className="hol">OneNote · {userEmail}</span>
          <span className="hol">OneDrive · 491 GB Used</span>
        </div>
      </div>

      <div className="subbar" style={{ display: activeTab === 'gmail' ? 'block' : 'none' }}>
        <div className="subbar-inner">
          <span className="sub-label">✉️ Gmail</span>
          <span className="hol">Gmail · {userEmail} · Live · 10 recent · 201 total</span>
        </div>
      </div>

      <div className="page">
        {/* ── TAB: INBOX ── */}
        <div className={`tab-section ${activeTab === 'inbox' ? 'visible' : ''}`}>
          <div className="stats">
            <div className="stat"><div className="stat-icon si-blue">📧</div><div className="stat-info"><div className="stat-value">10</div><div className="stat-label">New Emails</div></div></div>
            <div className="stat"><div className="stat-icon si-teal">🛡️</div><div className="stat-info"><div className="stat-value">3</div><div className="stat-label">Security Alerts</div></div></div>
            <div className="stat"><div className="stat-icon si-amber">💼</div><div className="stat-info"><div className="stat-value">5</div><div className="stat-label">Job Applications</div></div></div>
            <div className="stat"><div className="stat-icon si-red">🗞️</div><div className="stat-info"><div className="stat-value">2</div><div className="stat-label">News Updates</div></div></div>
          </div>

          <section>
            <div className="sec-head">
              <div className="sec-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
                Inbox — Priority View
              </div>
              <div className="sec-title">Recent Activity. <span>Latest updates.</span></div>
              <div className="sec-sub">Showing most relevant items from Gmail and security logs</div>
            </div>

            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '42px' }}>#</th>
                    <th style={{ width: '46px' }}></th>
                    <th>Sender / Subject</th>
                    <th style={{ width: '380px' }}>Preview</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th style={{ width: '80px' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="n">1</td>
                    <td><div className="av av-blue">SA</div></td>
                    <td><span className="subj-title">Seeking Alpha</span><span className="subj-sub">Market Update: Top 3 Stocks</span></td>
                    <td className="prev">Summary of today's market movers and potential buys...</td>
                    <td><span className="dt-main">Mar 16</span><div className="dt-time">10:45 AM</div></td>
                    <td><span className="pill pill-blue">News</span></td>
                  </tr>
                  {/* ... more rows can be added here if needed ... */}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── TAB: CALENDAR ── */}
        <div className={`tab-section ${activeTab === 'calendar' ? 'visible' : ''}`}>
          <div className="stats">
            <div className="stat"><div className="stat-icon si-blue">📅</div><div className="stat-info"><div className="stat-value">12</div><div className="stat-label">Total Events</div></div></div>
            <div className="stat"><div className="stat-icon si-violet">🎯</div><div className="stat-info"><div className="stat-value">4</div><div className="stat-label">High Priority</div></div></div>
            <div className="stat"><div className="stat-icon si-teal">👥</div><div className="stat-info"><div className="stat-value">6</div><div className="stat-label">Meetings</div></div></div>
            <div className="stat"><div className="stat-icon si-amber">⭐</div><div className="stat-info"><div className="stat-value">2</div><div className="stat-label">Workshops</div></div></div>
          </div>

          <section>
            <div className="sec-head">
              <div className="sec-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Google Calendar
              </div>
              <div className="sec-title">April 2026. <span>Full Schedule.</span></div>
            </div>

            <div className="cal-grid">
              <div className="cal-head">Sun</div><div className="cal-head">Mon</div><div className="cal-head">Tue</div><div className="cal-head">Wed</div><div className="cal-head">Thu</div><div className="cal-head">Fri</div><div className="cal-head">Sat</div>
              {/* Simplified grid for now */}
              {[...Array(30)].map((_, i) => (
                <div key={i} className="cal-day">
                  <div className="cal-num">{i + 1}</div>
                  {i === 15 && <div className="cal-chip cc-blue">Meeting</div>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── TAB: TASKS ── */}
        <div className={`tab-section ${activeTab === 'tasks' ? 'visible' : ''}`}>
          <div className="stats">
            <div className="stat"><div className="stat-icon si-blue">✅</div><div className="stat-info"><div className="stat-value">10</div><div className="stat-label">Work Tasks</div></div></div>
            <div className="stat"><div className="stat-icon si-amber">🏠</div><div className="stat-info"><div className="stat-value">2</div><div className="stat-label">Home Tasks</div></div></div>
            <div className="stat"><div className="stat-icon si-red">🔥</div><div className="stat-info"><div className="stat-value">3</div><div className="stat-label">Overdue</div></div></div>
            <div className="stat"><div className="stat-icon si-green">✨</div><div className="stat-info"><div className="stat-value">5</div><div className="stat-label">Completed</div></div></div>
          </div>

          <section>
            <div className="sec-head">
              <div className="sec-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Google Tasks
              </div>
              <div className="sec-title">Task List. <span>To Do.</span></div>
            </div>

            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '36px' }}>#</th>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="n">1</td>
                    <td><span className="subj-title">Review Server Licenses</span></td>
                    <td><span className="pill pill-orange">Pending</span></td>
                    <td><span className="pill pill-red">High</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── TAB: NOTEBOOKS ── */}
        <div className={`tab-section ${activeTab === 'notebooks' ? 'visible' : ''}`}>
          <div className="stats">
            <div className="stat"><div className="stat-icon si-violet">📓</div><div className="stat-info"><div className="stat-value">3</div><div className="stat-label">Notebooks</div></div></div>
            <div className="stat"><div className="stat-icon si-teal">☁️</div><div className="stat-info"><div className="stat-value">491 GB</div><div className="stat-label">OneDrive Used</div></div></div>
          </div>

          <section>
            <div className="sec-head">
              <div className="sec-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                OneNote — Live
              </div>
              <div className="sec-title">Your Notebooks. <span>Last 3.</span></div>
            </div>

            <div className="notes-grid">
              <div className="note-card">
                <div className="note-num">Notebook · 01</div>
                <div className="note-title">chen's Notebook</div>
                <div className="note-body">Active project details and Malam Team notes.</div>
                <div className="note-footer"><span>Today</span><span style={{ color: 'var(--blue)' }}>OneDrive</span></div>
              </div>
            </div>
          </section>
        </div>

        {/* ── TAB: GMAIL ── */}
        <div className={`tab-section ${activeTab === 'gmail' ? 'visible' : ''}`}>
          <div className="stats">
            <div className="stat"><div className="stat-icon si-blue">📧</div><div className="stat-info"><div className="stat-value">10</div><div className="stat-label">Recent Emails</div></div></div>
            <div className="stat"><div className="stat-icon si-green">💼</div><div className="stat-info"><div className="stat-value">8</div><div className="stat-label">Work Emails</div></div></div>
          </div>

          <section>
            <div className="sec-head">
              <div className="sec-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
                Gmail — Live
              </div>
              <div className="sec-title">Recent Correspondence. <span>Inbox.</span></div>
            </div>

            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '42px' }}>#</th>
                    <th>Subject</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="n">1</td>
                    <td><span className="subj-title">Acme Corp Security Review</span></td>
                    <td>Mar 14</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-txt">{userEmail} · Live data · March 16, 2026</div>
          <div className="footer-txt">Office Dashboard · office.chensheffer.com</div>
        </div>
      </footer>
    </div>
  )
}
