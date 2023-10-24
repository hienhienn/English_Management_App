export interface Course {
  id?: string;
  courseTitle?: string;

  /**
   * @type int
   */
  price?: number;
  level?: string[];
}
export interface CreateCourse {
  courseTitle: string;
  /**
   * @type int
   */
  price?: number;
  level?: string[];
}

export interface UpdateCourse {
  courseTitle?: string;
  /**
   * @type int
   */
  price?: number;
  level?: string[];
}
