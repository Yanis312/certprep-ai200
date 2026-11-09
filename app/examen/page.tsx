import { getExams } from "@/lib/exam";
import ExamClient from "@/components/ExamClient";

export default function ExamPage() {
  return <ExamClient exams={getExams()} />;
}
