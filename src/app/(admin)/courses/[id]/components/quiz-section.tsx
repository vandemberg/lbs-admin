"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Save, FileQuestion } from "lucide-react";
import { QuizQuestion, QuestionType } from "@/types/quiz";
import { toast } from "sonner";

interface QuizSectionProps {
  moduleId: number;
  moduleName: string;
}

export function QuizSection({ moduleId, moduleName }: QuizSectionProps) {
  const [questions, setQuestions] = useState<FileQuestionQuestion[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuizQuestion = {
      question: "",
      type,
      options: type === "multiple_choice" ? ["", "", ""] : undefined,
      correct_answer: type === "multiple_choice" ? 0 : false,
      order: questions.length + 1,
    };
    setQuestions([...questions, newQuestion]);
    setIsCreating(true);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    if (updated[questionIndex].options) {
      updated[questionIndex].options![optionIndex] = value;
    }
    setQuestions(updated);
  };

  const handleSave = () => {
    // TODO: Implementar salvamento via API
    toast.success("Questionário salvo com sucesso");
  };

  return (
    <div className="mt-8 rounded-lg bg-background p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-base font-semibold">Questionário do Módulo</h3>
        {questions.length === 0 ? (
          <Button
            onClick={() => addQuestion("multiple_choice")}
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            <FileQuestion className="h-4 w-4 mr-2" />
            Criar Questionário
          </Button>
        ) : (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Questionário
          </Button>
        )}
      </div>

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="rounded-lg border p-4"
            >
              <div className="flex items-start gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-grab" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">
                      {question.type === "multiple_choice"
                        ? "Pergunta: Múltipla Escolha"
                        : "Pergunta: Verdadeiro/Falso"}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-destructive/80 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    placeholder={
                      question.type === "multiple_choice"
                        ? "Digite a pergunta aqui..."
                        : "Digite a afirmação aqui..."
                    }
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(qIndex, "question", e.target.value)
                    }
                  />

                  {question.type === "multiple_choice" && (
                    <div className="space-y-3 pt-2">
                      {question.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={question.correct_answer === oIndex}
                            onChange={() =>
                              updateQuestion(qIndex, "correct_answer", oIndex)
                            }
                            className="h-5 w-5 rounded-full border-primary text-primary focus:ring-primary/30"
                          />
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            placeholder={`Opção ${oIndex + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...questions];
                          updated[qIndex].options?.push("");
                          setQuestions(updated);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Opção
                      </Button>
                    </div>
                  )}

                  {question.type === "true_false" && (
                    <div className="flex gap-6 pt-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${qIndex}-tf`}
                          checked={question.correct_answer === true}
                          onChange={() =>
                            updateQuestion(qIndex, "correct_answer", true)
                          }
                          className="h-5 w-5 rounded-full border-primary text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm font-medium">Verdadeiro</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${qIndex}-tf`}
                          checked={question.correct_answer === false}
                          onChange={() =>
                            updateQuestion(qIndex, "correct_answer", false)
                          }
                          className="h-5 w-5 rounded-full border-primary text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm font-medium">Falso</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-4 border-t pt-6">
            <Button
              variant="outline"
              onClick={() => addQuestion("multiple_choice")}
              className="border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Múltipla Escolha
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuestion("true_false")}
              className="border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Verdadeiro/Falso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

