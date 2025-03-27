export interface Time {
  amount: number;
  unit: string;
}

export interface Image {
  src: string;
  description?: string;
}

export interface Video {
  youtube?: string;
}

export interface Ingredient {
  item: string;
  amount?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export interface Equipment {
  item: string;
}

export interface Step {
  description: string;
  ingredients?: Ingredient[];
  equipment?: Equipment[];
  prepTime?: Time;
  cookTime?: Time;
  images?: Image[];
  optional?: boolean;
}

export interface Section {
  name: string;
  steps: Step[];
}

export interface Nutrition {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Prelude {
  description: string;
  images?: Image[];
  videos?: Video[];
}

export interface Rating {
  _id?: string;
  userId?: string;
  recipeId?: string;
  rating: number;
  timestamp?: Date;
}

export interface User {
  _id: string;
  name: string;
}

export interface Recipe {
  _id?: string;
  author: string;
  recipe: string;
  source?: string;
  spec: string;
  tags: string;
  servings: number;
  yield?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cuisine?: string;
  dietaryRestrictions?: Array<
    | 'vegetarian'
    | 'vegan'
    | 'gluten-free'
    | 'dairy-free'
    | 'nut-free'
    | 'kosher'
    | 'halal'
    | 'keto'
    | 'paleo'
    | 'low-carb'
  >;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  totalTime?: Time;
  storage?: string;
  nutrition?: Nutrition;
  allIngredients?: Ingredient[];
  allEquipment?: Equipment[];
  prelude?: Prelude;
  preheat?: number;
  steps?: Step[];
  sections?: Section;
  ratings?: Rating[];
  createdBy?: User;
  averageRating?: number;
  createdAt?: Date;
  updatedAt?: Date;
} 