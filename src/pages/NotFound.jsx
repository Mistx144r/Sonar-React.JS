export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-b from-zinc-900 to-bg-background">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Página não encontrada...</p>
      <a
        href="/home"
        className="px-6 py-3 font-bold bg-purple-500 text-white rounded-2xl hover:scale-105 active:scale-100 transition-all shadow-xl"
      >
        Voltar para Home
      </a>
    </div>
  );
}
