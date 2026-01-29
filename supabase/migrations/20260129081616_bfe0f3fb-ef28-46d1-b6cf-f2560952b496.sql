-- Drop the existing check constraint and add a new one that includes all types
ALTER TABLE public.program_form_questions 
DROP CONSTRAINT IF EXISTS program_form_questions_question_type_check;

ALTER TABLE public.program_form_questions 
ADD CONSTRAINT program_form_questions_question_type_check 
CHECK (question_type IN ('text', 'phone', 'select', 'radio', 'checkbox', 'multi_text', 'multiple_choice'));