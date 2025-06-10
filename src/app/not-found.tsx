import Link from 'next/link';

// Em Next.js, a página 404 é um Server Component por padrão.
// Hooks como `useLocation` e `useEffect` não são necessários aqui.
// O log do caminho não encontrado já é feito automaticamente pelo Next.js no terminal do servidor.

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! A página que você está procurando não existe.
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 text-lg font-semibold rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
        >
          Retornar à Página Inicial
        </Link>
      </div>
    </div>
  );
}