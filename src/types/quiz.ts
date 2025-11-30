export type QuestionType = "multiple_choice" | "true_false";

export interface QuizQuestion {
  id?: number;
  question: string;
  type: QuestionType;
  options?: string[];
  correct_answer: number | boolean;
  order?: number;
}

export interface Quiz {
  id?: number;
  module_id: number;
  questions: QuizQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface QuizForm {
  module_id: number;
  questions: QuizQuestion[];
}

