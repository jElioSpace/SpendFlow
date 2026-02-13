
export interface GroceryItem {
  id: string;
  name: string;
  note?: string;
  category?: string; // AI categorized for display in list
  estimated_price?: number;
  actual_price?: number;
  purchased_at?: number;
  is_purchased: boolean;
  created_at: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  category_id: string;
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: number;
  category_id: string;
  note?: string;
  linked_grocery_id?: string;
}

export interface SmartSuggestion {
  name: string;
  reason: string;
}

export type AppView = 'expenses' | 'list' | 'reports' | 'settings';
export type Language = 'en' | 'mm';
