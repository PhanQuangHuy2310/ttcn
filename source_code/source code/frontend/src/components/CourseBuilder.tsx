import React, { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  materials: string[];
}

const CourseBuilder: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Chapter 1: Getting Started",
      materials: ["Introduction.pdf"],
    },
  ]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Course Syllabus Builder
        </h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
          Auto-Generate with AI
        </button>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
          >
            <h3 className="font-semibold text-gray-700">{lesson.title}</h3>
            <ul className="mt-2 ml-4 list-disc text-sm text-gray-500">
              {lesson.materials.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <button className="mt-2 text-xs text-purple-600 font-medium hover:underline">
              + Add Material
            </button>
          </div>
        ))}

        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-all font-medium">
          + Add New Lesson
        </button>
      </div>
    </div>
  );
};

export default CourseBuilder;
