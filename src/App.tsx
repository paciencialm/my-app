import { Link } from 'react-router-dom'

function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6 md:p-10">
      <section className="w-full rounded-3xl border border-brand-500/20 bg-white/80 p-8 text-center shadow-sm md:p-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-500">Project</p>
        <h1 className="text-4xl font-extrabold text-brand-950 md:text-5xl">Welcome!</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-brand-950/75 md:text-base">
          Sample
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center rounded-xl px-8 py-4 text-xl font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: '#2C3947' }}
          to="/auth"
        >
          Get Started
        </Link>
      </section>
    </main>
  )
}

export default App


