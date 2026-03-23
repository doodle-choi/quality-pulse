import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.issue import Issue

def seed_database():
    db: Session = SessionLocal()
    
    # 중복 시드(Seed) 방지
    if db.query(Issue).count() > 0:
        print("✅ Database is already seeded. No action taken.")
        db.close()
        return

    dummy_issues = [
        Issue(
            title="Samsung Slide-In Electric Ranges — Fire Hazard",
            brand="Samsung",
            product_category="레인지/쿡탑",
            severity="Critical",
            issue_type="Recall",
            summary="전면 노브가 사람이나 반려동물에 의해 우발적으로 켜져 화재가 발생할 수 있습니다. 300건 이상의 사고가 보고되었습니다.",
            region="USA",
            source_url="https://www.cpsc.gov/Recalls"
        ),
        Issue(
            title="LG Refrigerator Linear Compressor Defect",
            brand="LG",
            product_category="냉장고",
            severity="High",
            issue_type="Quality",
            summary="리니어 컴프레서 결함으로 인해 예고 없이 냉각 기능이 정지되는 프리징 불량 집단소송 건입니다.",
            region="USA",
            source_url="https://topclassactions.com/"
        ),
        Issue(
            title="Whirlpool Top-Load Washer Drain Pump Error",
            brand="Whirlpool",
            product_category="세탁기",
            severity="Medium",
            issue_type="Service",
            summary="배수 펌프가 멈추지 않고 계속 돌아가며 압력 센서 오류를 뱉어내는 결함으로, 제어보드 교체가 필요합니다.",
            region="Global",
            source_url="https://www.whirlpool.com/"
        ),
        Issue(
            title="GE Bottom Freezer Refrigerators Handle Detachment",
            brand="GE(Haier)",
            product_category="냉장고",
            severity="High",
            issue_type="Safety",
            summary="냉동고 서랍을 당길 때 핸들이 떨어져 나가면서 낙상(Fall) 사고를 유발할 수 있습니다. 71건 보고됨.",
            region="USA",
            source_url="https://www.cpsc.gov/Recalls"
        )
    ]
    
    db.add_all(dummy_issues)
    db.commit()
    print(f"🎉 Successfully seeded {len(dummy_issues)} mock issues into the database!")
    db.close()

if __name__ == "__main__":
    seed_database()
