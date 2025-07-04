import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { getFavoriteRecipes } from '@/lib/api/recipe.server';
import { UserFavoritesRecipesClient } from '@/components/recipe/UserFavoritesRecipesClient';
import { PageSkeleton } from '@/components/skeletons/PageSkeleton';

export const metadata: Metadata = {
    title: 'Receitas Favoritas | Leve Sabor',
    description: 'Acesse e gerencie suas receitas salvas para consultar quando quiser.',
};

interface PageProps {
    searchParams: {
        title?: string;
        category_id?: string;
    };
}

async function FavoritesLoader({ searchParams }: PageProps) {
    try {
        const paginatedResponse = await getFavoriteRecipes({
            title: searchParams.title,
            categoryId: searchParams.category_id,
        });
        const favoriteRecipes = paginatedResponse.data;

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">Receitas Favoritas</h1>
                        <p className="text-muted-foreground">Suas receitas salvas para consultar quando quiser.</p>
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                        <Heart className="h-5 w-5 mr-2 fill-current" />
                        <span>{paginatedResponse.meta.total} receitas salvas</span>
                    </div>
                </div>
                <UserFavoritesRecipesClient initialRecipes={favoriteRecipes} />
            </div>
        );
    } catch (error) {
        console.error("Falha ao carregar receitas favoritas:", error);
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-bold text-destructive">Ocorreu um Erro</h2>
                <p className="text-muted-foreground mt-2">Não foi possível carregar suas receitas favoritas. Tente novamente.</p>
            </div>
        );
    }
}

export default function UserFavoriteRecipesPage({ searchParams }: PageProps) {
    return (
        <div className="container mx-auto py-8">
            <Suspense
                key={JSON.stringify(searchParams)}
                fallback={<PageSkeleton layout="single-column" />}
            >
                <FavoritesLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
}