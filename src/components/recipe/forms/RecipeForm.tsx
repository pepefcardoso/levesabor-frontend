'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Recipe, RecipeDifficultyEnum } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { createRecipe, updateRecipe } from '@/lib/api/recipe';
import { RecipeFormBasicInfo } from './RecipeFormBasicInfo';
import { RecipeFormImage } from './RecipeFormImage';
import { RecipeFormDiets } from './RecipeFormDiets';
import { RecipeFormIngredients } from './RecipeFormIngredients';
import { RecipeFormSteps } from './RecipeFormSteps';

const recipeSchema = z.object({
  title: z.string().min(5, "O título precisa ter pelo menos 5 caracteres."),
  description: z.string().min(20, "A descrição precisa de pelo menos 20 caracteres."),
  time: z.coerce.number().min(1, "O tempo de preparo é obrigatório."),
  portion: z.coerce.number().min(1, "O número de porções é obrigatório."),
  difficulty: z.nativeEnum(RecipeDifficultyEnum, { required_error: "Selecione a dificuldade." }),
  category_id: z.string().min(1, "Selecione uma categoria."),
  diets: z.array(z.number()).min(1, "Selecione pelo menos uma dieta."),
  ingredients: z.array(z.object({
    id: z.number().optional(),
    name: z.string().min(2, "O nome do ingrediente é obrigatório."),
    quantity: z.string().min(1, "A quantidade é obrigatória."),
    unit_id: z.string().min(1, "Selecione uma unidade."),
  })).min(1, "Adicione pelo menos um ingrediente."),
  steps: z.array(z.object({
    id: z.number().optional(),
    description: z.string().min(10, "Cada passo precisa ser mais detalhado."),
  })).min(1, "Adicione pelo menos um passo."),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  action: 'create' | 'update';
}

export function RecipeForm({ initialData, action }: RecipeFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      time: initialData?.time || 0,
      portion: initialData?.portion || 1,
      difficulty: initialData?.difficulty,
      category_id: String(initialData?.category?.id || ''),
      diets: initialData?.diets?.map(d => d.id) || [],
      ingredients: initialData?.ingredients?.map(i => ({ id: i.id, name: i.name, quantity: String(i.quantity), unit_id: String(i.unit_id) })) || [{ name: '', quantity: '', unit_id: '' }],
      steps: initialData?.steps?.map(s => ({ id: s.id, description: s.description })) || [{ description: '' }],
    },
  });

  const { handleSubmit, control, register, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: RecipeFormData) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('time', String(data.time));
    formData.append('portion', String(data.portion));
    formData.append('difficulty', data.difficulty);
    formData.append('category_id', data.category_id);
    data.diets.forEach(id => formData.append('diets[]', String(id)));
    data.ingredients.forEach((ing, index) => {
      if (ing.id) formData.append(`ingredients[${index}][id]`, String(ing.id));
      formData.append(`ingredients[${index}][name]`, ing.name);
      formData.append(`ingredients[${index}][quantity]`, ing.quantity);
      formData.append(`ingredients[${index}][unit_id]`, ing.unit_id);
    });
    data.steps.forEach((step, index) => {
      if (step.id) formData.append(`steps[${index}][id]`, String(step.id));
      formData.append(`steps[${index}][description]`, step.description);
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (action === 'create') {
        await createRecipe(formData);
        toast.success("Receita criada com sucesso!");
      } else if (initialData?.id) {
        await updateRecipe(initialData.id, formData);
        toast.success("Receita atualizada com sucesso!");
      }
      router.push('/usuario/receitas');
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Ocorreu um erro.");
      } else {
        toast.error("Ocorreu um erro ao processar a receita.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RecipeFormBasicInfo control={control} register={register} errors={errors} />
      <RecipeFormImage initialImage={initialData?.image} onFileChange={setImageFile} />
      <RecipeFormDiets control={control} errors={errors} />
      <RecipeFormIngredients control={control} register={register} errors={errors} />
      <RecipeFormSteps control={control} register={register} errors={errors} />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {action === 'create' ? 'Publicar Receita' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
