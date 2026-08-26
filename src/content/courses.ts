// No specific course names, providers, or certificates were supplied — per the
// "do not invent certificates" rule, this stays an empty, clearly-labelled
// placeholder until Hafzal provides real entries. Add real courses to this
// array in the same shape and they will appear automatically.

export interface Course {
  name: string;
  provider: string;
  topics: string[];
  date?: string;
  certificateUrl?: string;
}

export const courses: Course[] = [];

export const coursesPlaceholder =
  "Course and certification history is being finalized and will be added here.";
