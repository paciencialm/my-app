import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Button from '../components/Button'

type AuthMode = 'login' | 'register'

function AuthPage() {
  const navigate = useNavigate()

  const getRecoveryState = () => {
    const url = new URL(window.location.href)
    const searchParams = url.searchParams
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))

    const recoveryType = searchParams.get('type') ?? hashParams.get('type')
    const tokenHash = searchParams.get('token_hash') ?? hashParams.get('token_hash')
    const authCode = searchParams.get('code')
    const hasAccessToken = hashParams.has('access_token') || searchParams.has('access_token')

    const isRecovery = recoveryType === 'recovery' || !!tokenHash || !!authCode || hasAccessToken

    return {
      recoveryType,
      tokenHash,
      authCode,
      isRecovery,
    }
  }

  const recoveryState = getRecoveryState()
  const { isRecovery } = recoveryState

  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isResetFlow, setIsResetFlow] = useState(isRecovery)
  const [authReady, setAuthReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)
  const [resetCooldown, setResetCooldown] = useState(0)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [skipDashboardRedirect, setSkipDashboardRedirect] = useState(false)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const isWrongUrl = supabaseUrl.includes('supabase.com/dashboard')

  useEffect(() => {
    let mounted = true

    const initializeAuthState = async () => {
      setAuthReady(false)

      try {
        const currentRecovery = getRecoveryState()

        if (currentRecovery.isRecovery) {
          setIsResetFlow(true)
          setError(null)
          setMessage(null)

          if (currentRecovery.recoveryType === 'recovery' && currentRecovery.tokenHash) {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              type: 'recovery',
              token_hash: currentRecovery.tokenHash,
            })

            if (verifyError) {
              if (!mounted) return
              setError('This reset link is invalid or expired. Request a new one.')
              setIsResetFlow(false)
              setAuthReady(true)
              return
            }
          }

          if (currentRecovery.authCode) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(currentRecovery.authCode)

            if (exchangeError) {
              if (!mounted) return
              setError('This reset link is invalid or expired. Request a new one.')
              setIsResetFlow(false)
              setAuthReady(true)
              return
            }
          }

          if (!mounted) return
          setIsResetFlow(true)
          setAuthReady(true)
          return
        }

        const { data } = await supabase.auth.getSession()

        if (!mounted) return

        if (data.session && !skipDashboardRedirect) {
          navigate('/dashboard', { replace: true })
          return
        }

        setAuthReady(true)
      } catch {
        if (!mounted) return
        setError('Something went wrong while checking your authentication state.')
        setAuthReady(true)
      }
    }

    void initializeAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetFlow(true)
        setError(null)
        setMessage(null)
        setAuthReady(true)
        return
      }

      if (event === 'SIGNED_IN' && !getRecoveryState().isRecovery) {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [navigate, skipDashboardRedirect])

  useEffect(() => {
    if (resetCooldown <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setResetCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [resetCooldown])

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)

    if (authMode === 'register') {
      const { data, error: registerError } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
      })

      if (registerError) {
        setError(registerError.message)
      } else if (data.session) {
        navigate('/dashboard', { replace: true })
      } else {
        setMessage('Registration successful. You can log in now.')
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      })

      if (loginError) {
        setError(loginError.message)
      } else {
        navigate('/dashboard', { replace: true })
      }
    }

    setBusy(false)
  }

  const handleForgotPassword = async () => {
    if (!authEmail.trim()) {
      setError('Enter your email first so we can send a reset link.')
      return
    }

    if (resetCooldown > 0) {
      setMessage(`Please wait ${resetCooldown}s before sending another reset link.`)
      setError(null)
      return
    }

    setResetBusy(true)
    setError(null)
    setMessage(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(authEmail.trim(), {
      redirectTo: `${window.location.origin}/auth`,
    })

    if (resetError) {
      if (resetError.message.toLowerCase().includes('rate limit')) {
        setError(null)
        setMessage('Too many requests. Please wait about a minute, then try again.')
        setResetCooldown(300)
      } else {
        setError(resetError.message)
      }
    } else {
      setMessage('Password reset link sent. Check your email inbox.')
      setShowForgotPassword(false)
      setResetCooldown(60)
    }

    setResetBusy(false)
  }

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      setBusy(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.')
      setBusy(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      await supabase.auth.signOut()
      setSkipDashboardRedirect(true)
      setIsResetFlow(false)
      setNewPassword('')
      setConfirmNewPassword('')
      setAuthMode('login')
      setMessage('Password updated successfully. Please log in with your new password.')
    }

    setBusy(false)
  }

  if (!authReady) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6 md:p-10">
        <section className="w-full max-w-md rounded-2xl border border-brand-500/20 bg-white/80 p-6 shadow-sm">
          <p className="text-sm text-brand-950/80">Loading...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6 md:p-10">
      <section className="w-full max-w-md rounded-2xl border border-brand-500/20 bg-white/80 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-brand-950">
            {isResetFlow ? 'Reset Password' : authMode === 'login' ? 'Log In' : 'Register'}
          </h1>
          <Link className="flex items-center text-sm font-semibold text-brand-500 hover:underline" to="/">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>

        {isWrongUrl && (
          <section className="mb-4 rounded-xl border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-900">
            Set <code>VITE_SUPABASE_URL</code> to the API project URL, not the dashboard URL.
          </section>
        )}

        {error && <section className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</section>}
        {message && (
          <section className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </section>
        )}

        {isResetFlow ? (
          <form className="space-y-3" onSubmit={handleUpdatePassword}>
            <p className="text-sm text-brand-950/80">Set your new password below.</p>
            <input
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              minLength={6}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password"
              required
              type="password"
              value={newPassword}
            />
            <input
              className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
              minLength={6}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              placeholder="Confirm new password"
              required
              type="password"
              value={confirmNewPassword}
            />
            <Button disabled={busy || isWrongUrl} fullWidth size="lg" type="submit" variant="primary">
              {busy ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        ) : (
          <>
            <div className="mb-4 flex gap-2">
              <Button
                onClick={() => setAuthMode('login')}
                size="md"
                type="button"
                variant={authMode === 'login' ? 'primary' : 'secondary'}
              >
                Log In
              </Button>
              <Button
                onClick={() => setAuthMode('register')}
                size="md"
                type="button"
                variant={authMode === 'register' ? 'primary' : 'secondary'}
              >
                Register
              </Button>
            </div>

            <form className="space-y-3" onSubmit={handleAuth}>
              <input
                className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
                onChange={(event) => setAuthEmail(event.target.value)}
                placeholder="Email"
                required
                type="email"
                value={authEmail}
              />
              <input
                className="w-full rounded-lg border border-brand-500/30 px-3 py-2 outline-none focus:border-brand-500"
                minLength={6}
                onChange={(event) => setAuthPassword(event.target.value)}
                placeholder="Password"
                required
                type="password"
                value={authPassword}
              />
              <Button disabled={busy || isWrongUrl} fullWidth size="lg" type="submit" variant="primary">
                {busy ? 'Please wait...' : authMode === 'register' ? 'Create Account' : 'Log In'}
              </Button>
            </form>

            {authMode === 'login' && (
              <div className="mt-3">
                {!showForgotPassword ? (
                  <button
                    className="text-sm font-semibold text-brand-500 hover:underline"
                    onClick={() => {
                      setShowForgotPassword(true)
                      setError(null)
                      setMessage(null)
                    }}
                    type="button"
                  >
                    Forgot password?
                  </button>
                ) : (
                  <div className="rounded-xl border border-brand-500/30 bg-white/60 p-3">
                    <p className="mb-2 text-sm text-brand-950/80">Send a password reset link to your email.</p>
                    <div className="flex gap-2">
                      <Button
                        disabled={resetBusy || isWrongUrl || resetCooldown > 0}
                        onClick={() => void handleForgotPassword()}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        {resetBusy ? 'Sending...' : resetCooldown > 0 ? `Resend in ${resetCooldown}s` : 'Send Reset Link'}
                      </Button>
                      <Button onClick={() => setShowForgotPassword(false)} size="sm" type="button" variant="ghost">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default AuthPage