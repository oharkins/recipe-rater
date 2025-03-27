import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { Subject, takeUntil } from 'rxjs';
import { SafePipe } from '../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
  standalone: true,
  imports: [CommonModule, SafePipe]
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe | null = null;
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.loadRecipe(params['id']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecipe(id: string): void {
    this.loading = true;
    this.error = null;
    
    this.recipeService.getRecipeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recipe: Recipe) => {
          this.recipe = recipe;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading recipe:', error);
          this.error = 'Failed to load recipe. Please try again later.';
          this.loading = false;
        }
      });
  }

  formatTime(time: { amount: number; unit: string } | undefined): string {
    if (!time) return '';
    return `${time.amount} ${time.unit}`;
  }

  formatIngredient(ingredient: { item: string; amount?: number; unit?: string }): string {
    if (ingredient.amount && ingredient.unit) {
      return `${ingredient.amount} ${ingredient.unit} ${ingredient.item}`;
    }
    return ingredient.item;
  }

  getDifficultyClass(difficulty: string | undefined): string {
    switch (difficulty) {
      case 'beginner':
        return 'badge-success';
      case 'intermediate':
        return 'badge-warning';
      case 'advanced':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}
