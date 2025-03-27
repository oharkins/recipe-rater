import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads recipes from the service and handles the response
   */
  loadRecipes(): void {
    this.loading = true;
    this.error = null;
    
    this.recipeService.getRecipes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Recipe[]) => {
          this.recipes = data;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading recipes:', error);
          this.error = 'Failed to load recipes. Please try again later.';
          this.loading = false;
        }
      });
  }

  /**
   * Gets the first image URL from a recipe's prelude
   * @param recipe The recipe to get the image from
   * @returns The image URL or an empty string if no image is available
   */
  getRecipeImage(recipe: Recipe): string {
    return recipe?.prelude?.images?.[0]?.src || '';
  }

  /**
   * Formats the total time for display
   * @param recipe The recipe to get the time from
   * @returns Formatted time string or 'N/A' if no time is available
   */
  getDisplayTime(recipe: Recipe): string {
    if (!recipe?.totalTime?.amount || !recipe?.totalTime?.unit) {
      return 'N/A';
    }
    return `${recipe.totalTime.amount} ${recipe.totalTime.unit}`;
  }

  /**
   * Navigates to the recipe detail page
   * @param recipeId The ID of the recipe to view
   */
  viewRecipe(recipeId: string): void {
    this.router.navigate(['/recipes', recipeId]);
  }
} 