
export interface CourseLessonTopic {
  name: string;
}

export interface CourseLesson {
  id: string;
  lessonTitle: string;
  topics: string[]; // Array of topic names
}

export interface CourseModule {
  id: string;
  moduleTitle: string;
  moduleDescription: string;
  lessons: CourseLesson[];
}

export interface UserCourseData {
  id: string;
  title: string;
  description: string;
  skills: string;
  knowledge: string;
  passions: string;
  niche: string;
  modules: CourseModule[];
  createdAt: string;
}
