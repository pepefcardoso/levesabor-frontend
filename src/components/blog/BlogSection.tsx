import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/lib/api/blog';
import { BlogPostCard } from './BlogPostCard';
import { CardSkeleton } from '../skeletons/CardSkeleton';

const PostsSkeleton = () => (
  <>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </>
);

async function LatestPosts() {
  try {
    const paginatedResponse = await getPosts({
      sortBy: 'created_at',
      sortDirection: 'desc',
      limit: 3,
    });

    const posts = paginatedResponse.data;

    if (!posts || posts.length === 0) {
      return (
        <div className="col-span-3 text-center text-muted-foreground py-8">
          <p>Nenhum artigo encontrado no momento.</p>
        </div>
      );
    }

    return posts.map((post) => (
      <BlogPostCard key={post.id} post={post} />
    ));

  } catch (error) {
    console.error("Falha ao buscar posts para a seção do blog:", error);
    return (
      <div className="col-span-3 text-center text-destructive-foreground bg-destructive p-4 rounded-md">
        <p>Ocorreu um erro ao carregar os artigos. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }
}

const BlogSection = () => {
  return (
    <section className="py-16 bg-muted/50 dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Últimas do Nosso Blog
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fique por dentro das novidades, dicas e histórias inspiradoras do mundo da culinária inclusiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<PostsSkeleton />}>
            <LatestPosts />
          </Suspense>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/blog">Ver Todo o Blog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;