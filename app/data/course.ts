type Lesson = {
  name: string;
  description: string;
  slug: string;
  chapters: Chapter[];
};

type Chapter = {
  name: string;
  slug: string;
  teachings: Teaching[];
  exams: Exam[];
};

type Teaching = { videoId: string; duration: number };
type Exam = { videoId: string; duration: number };

const LESSONS: Lesson[] = [
  {
    name: "多項式",
    description:
      "多項式是代數學中的基礎概念，是由稱為未知數的變量和稱為係數的常數通過有限次加減法、乘法以及自然數冪次的乘方",
    slug: "polynomial",
    chapters: [
      {
        name: "主題一：多項式觀念",
        slug: "concept",
        teachings: [{ videoId: "1084688606", duration: 207 }],
        exams: [
          { videoId: "1084842713", duration: 302 },
          { videoId: "1084842872", duration: 218 },
        ],
      },
      {
        name: "主題二：多項式的運算 (除法原理與綜合除法)",
        slug: "division-synthetic",
        teachings: [{ videoId: "1084843003", duration: 300 }],
        exams: [
          { videoId: "1084843022", duration: 374 },
          { videoId: "1084843032", duration: 320 },
          { videoId: "1084843044", duration: 313 },
        ],
      },
      {
        name: "主題三：餘式定理與因式定理",
        slug: "remainder-and-factor-theorem",
        teachings: [{ videoId: "1084843728", duration: 96 }],
        exams: [
          { videoId: "1084843739", duration: 167 },
          { videoId: "1084843757", duration: 163 },
          { videoId: "1084843769", duration: 316 },
          { videoId: "1084843777", duration: 215 },
          { videoId: "1084843791", duration: 516 },
        ],
      },
      {
        name: "主題四：一次函數與二次函數",
        slug: "linear-and-quadratic-functions",
        teachings: [{ videoId: "1084844018", duration: 215 }],
        exams: [
          { videoId: "1084844033", duration: 273 },
          { videoId: "1084844045", duration: 312 },
          { videoId: "1084844065", duration: 381 },
          { videoId: "1084844087", duration: 252 },
        ],
      },
      {
        name: "主題五：二次多項式",
        slug: "quadratic-polynomials",
        teachings: [{ videoId: "1084844212", duration: 214 }],
        exams: [
          { videoId: "1084844228", duration: 246 },
          { videoId: "1084844244", duration: 630 },
        ],
      },
      {
        name: "主題六：二次不等式",
        slug: "quadratic-inequalities",
        teachings: [{ videoId: "1084844343", duration: 242 }],
        exams: [
          { videoId: "1084844366", duration: 192 },
          { videoId: "1084844386", duration: 146 },
        ],
      },
      {
        name: "主題七：高次多項式",
        slug: "higher-degree-polynomials",
        teachings: [{ videoId: "1084844564", duration: 158 }],
        exams: [
          { videoId: "1084844579", duration: 413 },
          { videoId: "1084844597", duration: 320 },
        ],
      },
    ],
  },
];

export { LESSONS };
export type { Lesson, Chapter };
