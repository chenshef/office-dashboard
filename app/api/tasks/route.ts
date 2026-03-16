import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated or no access token' }, { status: 401 })
  }

  try {
    // Fetch all task lists
    const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })

    if (!listsRes.ok) {
      const err = await listsRes.text()
      return NextResponse.json({ error: 'Failed to fetch task lists', details: err }, { status: listsRes.status })
    }

    const listsData = await listsRes.json()
    const taskLists = listsData.items || []

    // Fetch tasks from each list
    const allTasks: any[] = []
    for (const list of taskLists) {
      const tasksRes = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?showCompleted=false&showHidden=false`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      )
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        const tasks = (tasksData.items || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          notes: t.notes || '',
          due: t.due || null,
          status: t.status,
          updated: t.updated,
          listName: list.title,
          listId: list.id,
        }))
        allTasks.push(...tasks)
      }
    }

    return NextResponse.json({
      lists: taskLists.map((l: any) => ({ id: l.id, title: l.title })),
      tasks: allTasks,
      fetchedAt: new Date().toISOString(),
      email: session.user?.email || '',
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch tasks', message: err.message }, { status: 500 })
  }
}
