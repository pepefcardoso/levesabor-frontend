import type { Metadata } from 'next';
import type { DietaryTag } from '@/types/recipe';
import { getRecipes } from '@/lib/api/recipe';
import { RecipesPageClient } from '@/components/RecipePageClient';


export const metadata: Metadata = {
  title: 'Receitas | Leve Sabor',
  description: 'Explore centenas de receitas deliciosas e inclusivas, com filtros para todas as suas necessidades.',
};

interface RecipesPageProps {
  searchParams: {
    sortBy?: 'recent' | 'rating' | 'time' | 'difficulty';
    filters?: DietaryTag | DietaryTag[];
  }
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const filters = typeof searchParams.filters === 'string' ? [searchParams.filters] : searchParams.filters;

  const initialRecipes = await getRecipes({
    sortBy: searchParams.sortBy,
    filters: filters,
    page: 1,
    limit: 9,
  });

  return (
    <div className="bg-background">
      <main>
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Nossas Receitas</h1>
            <p className="text-lg text-muted-foreground">Encontre o prato perfeito para qualquer ocasião.</p>
          </div>
        </section>
        <RecipesPageClient
          initialRecipes={initialRecipes}
          initialSortBy={searchParams.sortBy}
        />
      </main>
    </div>
  );
}