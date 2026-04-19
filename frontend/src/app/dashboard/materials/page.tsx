import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function MaterialsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-fade-in-up">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
        <MaterialIcon name="inventory_2" filled className="text-primary !text-4xl" />
      </div>
      <h1 className="text-3xl font-black text-text mb-4">서비스 자재 현황</h1>
      <p className="text-text-muted max-w-lg mx-auto font-medium">
        현재 서비스 엔지니어들이 보유 중인 부품 및 자재의 실시간 재고 현황과 소요 예측 데이터를 분석하는 대시보드입니다. (추후 구현 예정)
      </p>
    </div>
  );
}
