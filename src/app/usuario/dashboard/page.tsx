'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Newspaper, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { getAuthenticatedUserProfile } from '@/lib/api/user';
import { getMyRecipes } from '@/lib/api/recipe';
import { getMyPosts } from '@/lib/api/blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types/user';
import { Recipe } from '@/types/recipe';
import { Post } from '@/types/blog';

export default function UserDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Dashboard | Leve Sabor';

        const fetchData = async () => {
            try {
                const [userData, myRecipesResponse, myPostsResponse] = await Promise.all([
                    getAuthenticatedUserProfile(),
                    getMyRecipes({ page: 1, limit: 3 }),
                    getMyPosts({ page: 1, limit: 3 }),
                ]);

                setUser(userData);
                setRecentRecipes(myRecipesResponse.data);
                setRecentPosts(myPostsResponse.data);
            } catch (error) {
                console.error("Falha ao carregar dados do dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">Não foi possível carregar os dados do usuário.</h2>
                <p className="text-muted-foreground">Por favor, <Link href="/auth/login" className="text-primary underline">faça o login</Link> novamente.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                        Bem-vindo(a), {user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground">O que vamos criar hoje?</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild><Link href="/usuario/receitas/nova"><Plus className="h-4 w-4 mr-2" />Nova Receita</Link></Button>
                    <Button asChild variant="secondary"><Link href="/usuario/artigos/novo"><Plus className="h-4 w-4 mr-2" />Novo Artigo</Link></Button>
                </div>
            </div>

            <Separator />

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Suas Receitas Recentes</CardTitle>
                        <CardDescription>As últimas receitas que você criou.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentRecipes.length > 0 ? (
                            recentRecipes.map(recipe => (
                                <div key={`recipe-${recipe.id}`} className="flex items-center">
                                    <Avatar className="h-9 w-9 hidden sm:flex"><AvatarImage src={recipe.image?.url} alt={recipe.title} /><AvatarFallback><ChefHat /></AvatarFallback></Avatar>
                                    <div className="ml-4 space-y-1"><p className="text-sm font-medium leading-none">{recipe.title}</p></div>
                                    <Link href={`/usuario/receitas/editar/${recipe.id}`} className="ml-auto font-medium text-sm text-primary hover:underline">Editar</Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground py-4 text-center">Você ainda não criou nenhuma receita.</p>
                        )}
                        <Button variant="outline" className="w-full mt-4" asChild>
                            <Link href="/usuario/receitas">Ver todas as suas receitas <ArrowRight className="h-4 w-4 ml-2" /></Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Seus Artigos Recentes</CardTitle>
                        <CardDescription>Os últimos artigos que você publicou.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentPosts.length > 0 ? (
                            recentPosts.map(post => (
                                <div key={`post-${post.id}`} className="flex items-center">
                                    <Avatar className="h-9 w-9 hidden sm:flex"><AvatarImage src={post.image?.url} alt={post.title} /><AvatarFallback><Newspaper /></AvatarFallback></Avatar>
                                    <div className="ml-4 space-y-1"><p className="text-sm font-medium leading-none">{post.title}</p></div>
                                    <Link href={`/usuario/artigos/editar/${post.id}`} className="ml-auto font-medium text-sm text-primary hover:underline">Editar</Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground py-4 text-center">Você ainda não publicou nenhum artigo.</p>
                        )}
                        <Button variant="outline" className="w-full mt-4" asChild>
                            <Link href="/usuario/artigos">Ver todos os seus artigos <ArrowRight className="h-4 w-4 ml-2" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}