import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css']
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  constructor(private router: Router) {}

  /**
   * Navigates to the recipe detail page
   */
  navigateToDetail(): void {
    if (this.recipe._id) {
      this.router.navigate(['/recipes', this.recipe._id]);
    }
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
} 