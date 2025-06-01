
export interface CourseLessonTopic {
  name: string;
}

export interface CourseLesson {
  id: string;
  lessonTitle: string;
  topics: string[]; // Array of topic names
}

export interface CourseModule {
  id:string;
  moduleTitle: string;
  moduleDescription: string;
  lessons: CourseLesson[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  link?: string; // Optional link to a relevant section in the dashboard/course
}

export interface UserCourseData {
  id: string;
  title: string;
  description: string;
  skills: string;
  knowledge: string;
  passions: string;
  niche: string;
  language: string; // Added language field
  modules: CourseModule[];
  checklist?: ChecklistItem[]; // Added checklist
  createdAt: string;
}

