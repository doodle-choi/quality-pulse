import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function QualityPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-fade-in-up">
      <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
        <MaterialIcon name="speed" filled className="text-secondary !text-4xl" />
      </div>
      <h1 className="text-3xl font-black text-text mb-4">품질 지표 현황</h1>
      <p className="text-text-muted max-w-lg mx-auto font-medium">
        글로벌 서비스 접수 건들을 바탕으로 브랜드별, 카테고리별 불량률 및 주요 결함 유형을 정기적으로 모니터링하는 대시보드입니다. (추후 구현 예정)
      </p>
    </div>
  );
}
