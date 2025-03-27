import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, tap } from 'rxjs';
import { Recipe } from '../models/recipe.model';

interface ApiResponse {
  recipes: Recipe[];
  page: number;
  pages: number;
  totalRecipes: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api/recipes';

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    console.log('Fetching recipes from:', this.apiUrl);
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
      }),
      map(response => {
        if (!response || !response.recipes) {
          console.warn('No recipes received from API');
          return [];
        }
        console.log('Processed recipes:', response.recipes);
        return response.recipes;
      }),
      catchError(error => {
        console.error('Error fetching recipes:', error);
        return [];
      })
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<{ recipe: Recipe }>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Single recipe response:', response)),
      map(response => response.recipe),
      catchError(error => {
        console.error('Error fetching recipe:', error);
        throw error;
      })
    );
  }
} 