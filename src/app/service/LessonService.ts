import axios from "axios";
import { serverApi } from "../../lib/types/config.ts";
import { Lesson, LessonInquiry } from "../../lib/types/lesson.ts";

class LessonService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getLessons(input: LessonInquiry): Promise<Lesson[]> {
    try {
      let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;

      if (input.lessonCollection) {
        url += `&lessonCollection=${input.lessonCollection}`;
      }

      if (input.search) {
        url += `&search=${input.search}`;
      }

      console.log("GET Lessons URL:", url);
      const result = await axios.get(url);
      console.log("getLessons response:", result.data);
      return result.data;
    } catch (err) {
      console.error("getLessons Error:", err);
      throw err;
    }
  }

  public async getLesson(lessonId: string): Promise<Lesson> {
    try {
      const url = `${this.path}/product/${lessonId}`;
      console.log("GET Lesson URL:", url);

      const result = await axios.get(url, { withCredentials: true });
      console.log("getLesson response:", result.data);
      return result.data;
    } catch (err) {
      console.error("getLesson Error:", err);
      throw err;
    }
  }
}

export default LessonService;
