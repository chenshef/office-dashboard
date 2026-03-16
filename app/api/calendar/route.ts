import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated or no access token' }, { status: 401 })
  }

  if (session.error === 'RefreshAccessTokenError') {
    return NextResponse.json({ error: 'Session expired — please sign in again', needsReauth: true }, { status: 401 })
  }

  try {
    // Current week: Sunday → Saturday
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    endOfWeek.setHours(23, 59, 59, 999)

    // Fetch calendar list
    const calsRes = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=50',
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    )

    if (!calsRes.ok) {
      const err = await calsRes.text()
      return NextResponse.json({ error: 'Failed to fetch calendar list', details: err }, { status: calsRes.status })
    }

    const calsData = await calsRes.json()
    const calendars = (calsData.items || []).filter((c: any) =>
      // Include primary + shared + subscribed calendars; skip irrelevant ones
      c.accessRole !== 'none'
    )

    // Fetch events for each calendar this week
    const allEvents: any[] = []
    for (const cal of calendars) {
      const eventsRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events` +
        `?timeMin=${startOfWeek.toISOString()}&timeMax=${endOfWeek.toISOString()}` +
        `&singleEvents=true&orderBy=startTime&maxResults=50`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      )
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        const events = (eventsData.items || []).map((e: any) => ({
          id: e.id,
          summary: e.summary || '(No title)',
          description: e.description || '',
          location: e.location || '',
          start: e.start?.dateTime || e.start?.date || '',
          end: e.end?.dateTime || e.end?.date || '',
          allDay: !e.start?.dateTime,
          calendarId: cal.id,
          calendarName: cal.summary,
          backgroundColor: cal.backgroundColor || '#2563eb',
          status: e.status,
        }))
        allEvents.push(...events)
      }
    }

    // Sort by start time
    allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    return NextResponse.json({
      events: allEvents,
      calendars: calendars.map((c: any) => ({ id: c.id, name: c.summary, color: c.backgroundColor })),
      weekStart: startOfWeek.toISOString(),
      weekEnd: endOfWeek.toISOString(),
      email: session.user?.email || '',
      fetchedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch calendar', message: err.message }, { status: 500 })
  }
}
