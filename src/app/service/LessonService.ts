import axios from "axios";
import { serverApi } from "../../lib/types/config";
import { Lesson,LessonInquiry} from "../../lib/types/lesson";

class LessonService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  // Barcha mahsulotlarni olish
  public async getLessons(input: LessonInquiry): Promise<Lesson[]> {
    try {
      let url = `${this.path}/lesson/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      console.log("API path:", this.path);
      if (input.lessonCollection)
        url += `&lessonCollecti=${input.lessonCollection}`;

      if (input.search) url += `&search=${input.search}`;

      const result = await axios.get(url);
      console.log("getLesson response:", result);
      return result.data;
    } catch (err) {
      console.error("getProducts Error:", err);
      throw err;
    }
  }

  // Bitta mahsulotni ID bo'yicha olish
  public async getLesson(lessonId: string): Promise<Lesson> {
    try {
      const url = `${this.path}/lesson/${lessonId}`;
      console.log("Request URL:", url);

      // Agar serverga cookie yuborish kerak bo'lsa withCredentials:true
      const result = await axios.get(url, { withCredentials: true });
      console.log("getLesson response:", result);
      return result.data;
    } catch (err) {
      console.error("getProduct Error:", err);
      throw err;
    }
  }
}

export default LessonService;
