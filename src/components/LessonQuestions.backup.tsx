import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { LessonQuestion } from '../types';
import { getFeedbackFromGPT } from '../api/chat-gpt';
import { useAuth } from '../contexts/AuthContext';

interface StudentState {
  input: string;
  submitted: boolean;
  feedback: string;
  loading: boolean;
  error: string | null;
}

// 备份文件：原有的5个问题系统，已被InteractiveDialogue替代
const LessonQuestions: React.FC = () => {
  const { id: lesson_id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleAnswers, setVisibleAnswers] = useState<{ [id: string]: boolean }>({});
  const [studentState, setStudentState] = useState<{ [id: string]: StudentState }>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!lesson_id) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('lesson_questions')
        .select('*')
        .eq('lesson_id', lesson_id)
        .order('created_at', { ascending: true });
      if (error) {
        setError('Failed to load questions.');
        setQuestions([]);
      } else {
        setQuestions(data || []);
        setVisibleAnswers({});
        setStudentState({});
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [lesson_id]);

  const toggleAnswer = (id: string) => {
    setVisibleAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id: string, e: ChangeEvent<HTMLTextAreaElement>) => {
    setStudentState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        input: e.target.value,
        submitted: false,
        feedback: '',
        loading: false,
        error: null,
      },
    }));
  };

  const handleSubmit = (question: string, id: string, reference: string) => async (e: FormEvent) => {
    e.preventDefault();
    const input = studentState[id]?.input || '';
    setStudentState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        submitted: true,
        loading: true,
        error: null,
      },
    }));

    try {
      const feedback = await getFeedbackFromGPT(question, input, reference);
      setStudentState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          feedback,
          loading: false,
        },
      }));

      // 写入 student_answers 表
      if (user && user.id && lesson_id) {
        const { error } = await supabase.from('student_answers').insert([
          {
            lesson_id: lesson_id as string,
            question_id: id,
            user_id: user.id,
            student_input: input,
            gpt_feedback: feedback,
          }
        ]);
        if (!error) {
          console.log('✅ saved to supabase');
        } else {
          console.error('❌ failed to save to supabase:', error.message);
        }
      }
    } catch (err) {
      setStudentState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          feedback: 'Failed to get feedback from GPT.',
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Loading questions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded my-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded my-4 text-gray-600">
        No questions found for this lesson.
      </div>
    );
  }

  return (
    <div className="space-y-6 my-6">
      {questions.map((q) => (
        <div key={q.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="mb-2 text-blue-700 font-semibold">Q: {q.question}</div>
          <button
            onClick={() => toggleAnswer(q.id)}
            className="mt-2 mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {visibleAnswers[q.id] ? 'Hide Reference Answer' : 'Show Reference Answer'}
          </button>
          {visibleAnswers[q.id] && (
            <div className="text-gray-800 mt-3 border-t pt-3">A: {q.answer}</div>
          )}

          {/* Student answer input */}
          <form onSubmit={handleSubmit(q.question, q.id, q.answer)} className="mt-4">
            <label htmlFor={`student-answer-${q.id}`} className="block text-gray-700 mb-2">Your Answer:</label>
            <textarea
              id={`student-answer-${q.id}`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
              rows={3}
              value={studentState[q.id]?.input || ''}
              onChange={(e) => handleInputChange(q.id, e)}
              disabled={studentState[q.id]?.submitted}
              placeholder="Type your answer here..."
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                disabled={studentState[q.id]?.submitted || !(studentState[q.id]?.input || '').trim()}
              >
                Submit Answer
              </button>
              {studentState[q.id]?.submitted && (
                <button
                  type="button"
                  onClick={() => setStudentState((prev) => ({
                    ...prev,
                    [q.id]: {
                      input: '',
                      submitted: false,
                      feedback: '',
                      loading: false,
                      error: null,
                    },
                  }))}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </form>

          {/* Show feedback and comparison after submit */}
          {studentState[q.id]?.submitted && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Your Answer:</span>
                <div className="text-gray-800 mt-1 p-2 bg-white rounded border-l-4 border-blue-400 whitespace-pre-line">{studentState[q.id]?.input}</div>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Reference Answer:</span>
                <div className="text-gray-800 mt-1 p-2 bg-white rounded border-l-4 border-gray-400 whitespace-pre-line">{q.answer}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">GPT Feedback:</span>
                {studentState[q.id]?.loading ? (
                  <div className="mt-2 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-700">Getting feedback from GPT...</span>
                  </div>
                ) : studentState[q.id]?.error ? (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                    {studentState[q.id]?.error}
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-green-800 font-medium">
                    {studentState[q.id]?.feedback}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonQuestions; 