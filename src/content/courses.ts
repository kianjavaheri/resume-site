// The coursework behind each degree.
//
// This lives in content/ rather than in components/Education.tsx for the reason
// `works` moved out of Projects.tsx: there are two consumers now — the course
// grid and the command palette's search index — and two copies of sixteen
// course codes would drift.

export type Course = { code: string; name: string }

export const cseCourses: Course[] = [
  { code: 'CSE 310', name: 'Data Structures & Algorithms' },
  { code: 'CSE 330', name: 'Operating Systems' },
  { code: 'CSE 340', name: 'Principles of Programming Languages' },
  { code: 'CSE 355', name: 'Intro to Theoretical Computer Science' },
  { code: 'CSE 434', name: 'Computer Networks' },
  { code: 'CSE 445', name: 'Distributed Software Development' },
  { code: 'CSE 446', name: 'Software Integration & Engineering' },
  { code: 'CSE 460', name: 'Software Analysis and Design' },
  { code: 'CSE 463', name: 'Human Computer Interaction' },
  { code: 'CSE 464', name: 'Software QA and Testing' },
  { code: 'CSE 471', name: 'Intro to Artificial Intelligence' },
]

export const ecnCourses: Course[] = [
  { code: 'ECN 306', name: 'Survey of International Economics' },
  { code: 'ECN 416', name: 'Game Theory & Economic Behavior' },
  { code: 'ECN 423', name: 'Economics of Education' },
  { code: 'ECN 425', name: 'Introduction to Econometrics' },
  { code: 'ECN 445', name: 'Environmental Economics' },
]

// The degree label each block is rendered under, so the search index can say
// which list a course came from without naming the two arrays a second time.
export const courseGroups: { label: string; courses: Course[] }[] = [
  { label: 'Computer Science', courses: cseCourses },
  { label: 'Economics', courses: ecnCourses },
]
