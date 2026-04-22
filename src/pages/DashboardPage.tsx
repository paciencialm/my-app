import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { emptyStudentForm, type Student, type StudentFormState } from '../types/student'
import Button from '../components/Button'

function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [appReady, setAppReady] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyStudentForm)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const isWrongUrl = supabaseUrl.includes('supabase.com/dashboard')

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [students],
  )

  const loadStudents = async () => {
    setStudentsLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setStudents(data ?? [])
    }

    setStudentsLoading(false)
  }

  useEffect(() => {
    const initializeSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setError(sessionError.message)
      } else if (!data.session) {
        navigate('/auth', { replace: true })
      } else {
        setSession(data.session)
        if (!isWrongUrl) {
          await loadStudents()
        }
      }

      setAppReady(true)
    }

    void initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!currentSession) {
        navigate('/auth', { replace: true })
        setStudents([])
        return
      }

      setSession(currentSession)
      if (!isWrongUrl) {
        void loadStudents()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isWrongUrl, navigate])

  const resetStudentForm = () => {
    setStudentForm(emptyStudentForm)
    setEditingId(null)
  }

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      setError(signOutError.message)
    } else {
      navigate('/auth', { replace: true })
    }
  }

  const handleStudentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)

    const payload = {
      first_name: studentForm.first_name.trim(),
      last_name: studentForm.last_name.trim(),
      email: studentForm.email.trim(),
      course: studentForm.course.trim(),
      year_level: Number(studentForm.year_level),
    }

    if (editingId) {
      const { error: updateError } = await supabase.from('students').update(payload).eq('id', editingId)

      if (updateError) {
        setError(updateError.message)
      } else {
        setMessage('Student updated successfully.')
        resetStudentForm()
        await loadStudents()
      }
    } else {
      const { error: insertError } = await supabase.from('students').insert(payload)

      if (insertError) {
        setError(insertError.message)
      } else {
        setMessage('Student added successfully.')
        resetStudentForm()
        await loadStudents()
      }
    }

    setBusy(false)
  }

  const handleEdit = (student: Student) => {
    setStudentForm({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      course: student.course,
      year_level: String(student.year_level),
    })
    setEditingId(student.id)
  }

  const handleDelete = async (id: string) => {
    setBusy(true)
    setError(null)
    setMessage(null)

    const { error: deleteError } = await supabase.from('students').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
    } else {
      setMessage('Student removed.')
      if (editingId === id) {
        resetStudentForm()
      }
      await loadStudents()
    }

    setBusy(false)
  }

  if (!appReady) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl p-6 md:p-10">
        <section className="rounded-2xl border border-brand-500/20 bg-white/80 p-6">Loading session...</section>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6 md:p-10">
      <header className="mb-8 rounded-2xl border border-brand-500/20 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-950 md:text-4xl">Students Dashboard</h1>
            <p className="mt-2 text-sm text-brand-950/70">Manage student records after login.</p>
          </div>
          <Link className="text-sm font-semibold text-brand-500 hover:underline" to="/">
            Home
          </Link>
        </div>
      </header>

      {isWrongUrl && (
        <section className="mb-6 rounded-2xl border border-amber-400/60 bg-amber-50 p-4 text-sm text-amber-900">
          You are using a Supabase dashboard URL. Set <code>VITE_SUPABASE_URL</code> to your API project URL.
        </section>
      )}

      {error && <section className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</section>}

      {message && (
        <section className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">{message}</section>
      )}

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-500/20 bg-white/80 p-4">
          <p className="text-sm text-brand-950/75">
            Logged in as <strong>{session?.user.email}</strong>
          </p>
          <Button onClick={handleSignOut} variant="secondary">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form className="space-y-3 rounded-2xl border border-brand-500/20 bg-white/80 p-5 shadow-sm" onSubmit={handleStudentSubmit}>
            <h2 className="text-xl font-bold text-brand-950">{editingId ? 'Edit Student' : 'Add Student'}</h2>
            <input
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="First name"
              value={studentForm.first_name}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, first_name: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="Last name"
              value={studentForm.last_name}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, last_name: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              type="email"
              placeholder="Email"
              value={studentForm.email}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              placeholder="Course"
              value={studentForm.course}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, course: event.target.value }))}
              required
            />
            <select
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              value={studentForm.year_level}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, year_level: event.target.value }))}
              required
            >
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
              <option value="5">Year 5</option>
            </select>

            <div className="flex gap-2">
              <Button disabled={busy || isWrongUrl} type="submit" variant="primary">
                {busy ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </Button>

              {editingId && (
                <Button onClick={resetStudentForm} type="button" variant="secondary">
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="rounded-2xl border border-brand-500/20 bg-white/80 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-950">Students</h2>
              <Button onClick={loadStudents} size="sm" variant="secondary">
                Refresh
              </Button>
            </div>

            {studentsLoading ? (
              <p className="text-sm text-brand-950/70">Loading students...</p>
            ) : sortedStudents.length === 0 ? (
              <p className="text-sm text-brand-950/70">No students yet. Add your first record.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-brand-500/20 text-left">
                      <th className="px-2 py-2">Name</th>
                      <th className="px-2 py-2">Email</th>
                      <th className="px-2 py-2">Course</th>
                      <th className="px-2 py-2">Year</th>
                      <th className="px-2 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((student) => (
                      <tr className="border-b border-brand-500/10" key={student.id}>
                        <td className="px-2 py-2">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-2 py-2">{student.email}</td>
                        <td className="px-2 py-2">{student.course}</td>
                        <td className="px-2 py-2">{student.year_level}</td>
                        <td className="px-2 py-2">
                          <div className="flex gap-2">
                            <Button onClick={() => handleEdit(student)} size="sm" variant="secondary">
                              Edit
                            </Button>
                            <Button disabled={busy} onClick={() => void handleDelete(student.id)} size="sm" variant="danger">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
