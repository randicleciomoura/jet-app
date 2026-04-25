const highlights = [
  'React + TypeScript',
  'Tailwind CSS',
  'Offline-first',
  'Schema-driven UI',
];

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Jet App</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Base do sistema low-code offline-first
            </h1>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Etapa 2
          </span>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Esta interface inicial valida o frontend mínimo da plataforma. O foco agora
              e subir a base React, organizar o projeto para evolucao incremental e
              manter o caminho aberto para schema-driven UI, persistencia local e sync.
            </p>

            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Proximos passos</p>
            <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
              <li>1. Estruturar biblioteca inicial de componentes.</li>
              <li>2. Ligar React Hook Form e Zod.</li>
              <li>3. Preparar estado global com Zustand.</li>
              <li>4. Evoluir para renderizacao por schema.</li>
            </ul>
          </aside>
        </div>

        <footer className="border-t border-white/10 pt-6 text-sm text-slate-400">
          Frontend mínimo pronto para evoluir em etapas pequenas.
        </footer>
      </section>
    </main>
  );
}

export default App;
