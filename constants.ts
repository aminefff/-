
import { MoneyTier, Question, User } from './types';

export const ADMIN_EMAIL = "ghouila681@gmail.com";
export const ADMIN_PASS = "Raidanta100$";

export const MONEY_LADDER: MoneyTier[] = [
  { level: 15, amount: "1,000,000", value: 1000000, isSafeHaven: true },
  { level: 14, amount: "500,000", value: 500000, isSafeHaven: false },
  { level: 13, amount: "250,000", value: 250000, isSafeHaven: false },
  { level: 12, amount: "125,000", value: 125000, isSafeHaven: false },
  { level: 11, amount: "64,000", value: 64000, isSafeHaven: false },
  { level: 10, amount: "32,000", value: 32000, isSafeHaven: true },
  { level: 9, amount: "16,000", value: 16000, isSafeHaven: false },
  { level: 8, amount: "8,000", value: 8000, isSafeHaven: false },
  { level: 7, amount: "4,000", value: 4000, isSafeHaven: false },
  { level: 6, amount: "2,000", value: 2000, isSafeHaven: false },
  { level: 5, amount: "1,000", value: 1000, isSafeHaven: true },
  { level: 4, amount: "500", value: 500, isSafeHaven: false },
  { level: 3, amount: "300", value: 300, isSafeHaven: false },
  { level: 2, amount: "200", value: 200, isSafeHaven: false },
  { level: 1, amount: "100", value: 100, isSafeHaven: false },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "ما هي عاصمة المملكة العربية السعودية؟",
    options: ["جدة", "الرياض", "الدمام", "مكة المكرمة"],
    correctAnswerIndex: 1,
    prize: "100",
    difficulty: 'easy',
    subject: "ثقافة عامة",
    chapter: "الجغرافيا",
    lesson: "العواصم"
  },
  {
    id: 2,
    text: "كم عدد ألوان قوس قزح؟",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 2,
    prize: "200",
    difficulty: 'easy',
    subject: "ثقافة عامة",
    chapter: "العلوم",
    lesson: "الضوء"
  },
  {
    id: 3,
    text: "ما هو الحيوان الذي يُلقب بسفينة الصحراء؟",
    options: ["الحصان", "الفيل", "الجمل", "الأسد"],
    correctAnswerIndex: 2,
    prize: "300",
    difficulty: 'easy',
    subject: "ثقافة عامة",
    chapter: "الأحياء",
    lesson: "الحيوانات"
  },
  {
    id: 4,
    text: "أي كوكب هو الأقرب للشمس؟",
    options: ["عطارد", "الزهرة", "الأرض", "المريخ"],
    correctAnswerIndex: 0,
    prize: "500",
    difficulty: 'easy',
    subject: "ثقافة عامة",
    chapter: "الفلك",
    lesson: "المجموعة الشمسية"
  },
  {
    id: 5,
    text: "ما هي أكبر قارة في العالم من حيث المساحة؟",
    options: ["أفريقيا", "آسيا", "أوروبا", "أمريكا الشمالية"],
    correctAnswerIndex: 1,
    prize: "1,000",
    difficulty: 'medium',
    subject: "ثقافة عامة",
    chapter: "الجغرافيا",
    lesson: "القارات"
  },
  {
    id: 6,
    text: "ما هو العنصر الكيميائي الذي رمزه O؟",
    options: ["الذهب", "الفضة", "الأكسجين", "الحديد"],
    correctAnswerIndex: 2,
    prize: "2,000",
    difficulty: 'medium',
    subject: "ثقافة عامة",
    chapter: "الكيمياء",
    lesson: "العناصر"
  },
  {
    id: 7,
    text: "في أي عام انتهت الحرب العالمية الثانية؟",
    options: ["1940", "1945", "1950", "1939"],
    correctAnswerIndex: 1,
    prize: "4,000",
    difficulty: 'medium',
    subject: "ثقافة عامة",
    chapter: "التاريخ",
    lesson: "الحروب العالمية"
  },
  {
    id: 8,
    text: "من هو مؤلف سلسلة هاري بوتر؟",
    options: ["ج. ك. رولينغ", "ستيفن كينغ", "أجاثا كريستي", "دان براون"],
    correctAnswerIndex: 0,
    prize: "8,000",
    difficulty: 'medium',
    subject: "ثقافة عامة",
    chapter: "الأدب",
    lesson: "الروايات"
  },
  {
    id: 9,
    text: "ما هو أسرع حيوان بري في العالم؟",
    options: ["الأسد", "الغزال", "الفهد", "النمر"],
    correctAnswerIndex: 2,
    prize: "16,000",
    difficulty: 'medium',
    subject: "ثقافة عامة",
    chapter: "الأحياء",
    lesson: "الحيوانات"
  },
  {
    id: 10,
    text: "كم عدد قلوب الأخطبوط؟",
    options: ["1", "2", "3", "4"],
    correctAnswerIndex: 2,
    prize: "32,000",
    difficulty: 'hard',
    subject: "ثقافة عامة",
    chapter: "الأحياء",
    lesson: "البحريات"
  },
  {
    id: 11,
    text: "ما هو أطول نهر في العالم؟",
    options: ["نهر الأمازون", "نهر النيل", "نهر المسيسيبي", "نهر يانغتسي"],
    correctAnswerIndex: 1,
    prize: "64,000",
    difficulty: 'hard',
    subject: "ثقافة عامة",
    chapter: "الجغرافيا",
    lesson: "الأنهار"
  },
  {
    id: 12,
    text: "من هو مخترع المصباح الكهربائي؟",
    options: ["نيكولا تيسلا", "ألكسندر جراهام بيل", "توماس إديسون", "أينشتاين"],
    correctAnswerIndex: 2,
    prize: "125,000",
    difficulty: 'hard',
    subject: "ثقافة عامة",
    chapter: "الفيزياء",
    lesson: "الاختراعات"
  },
  {
    id: 13,
    text: "ما هي الدولة التي تقع بالكامل داخل دولة إيطاليا؟",
    options: ["سان مارينو", "موناكو", "ليختنشتاين", "أندورا"],
    correctAnswerIndex: 0,
    prize: "250,000",
    difficulty: 'hard',
    subject: "ثقافة عامة",
    chapter: "الجغرافيا",
    lesson: "الدول"
  },
  {
    id: 14,
    text: "كم عدد عظام جسم الإنسان البالغ؟",
    options: ["200", "206", "210", "215"],
    correctAnswerIndex: 1,
    prize: "500,000",
    difficulty: 'hard',
    subject: "ثقافة عامة",
    chapter: "الأحياء",
    lesson: "جسم الإنسان"
  },
  {
    id: 15,
    text: "في أي مدينة تقع حدائق بابل المعلقة (تاريخياً)؟",
    options: ["بغداد", "الموصل", "الحلة", "البصرة"],
    correctAnswerIndex: 2,
    prize: "1,000,000",
    difficulty: 'hard',
    subject: "ثقافة عامة",
    chapter: "التاريخ",
    lesson: "العجائب"
  },
];
