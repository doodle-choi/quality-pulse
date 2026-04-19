import sys
import os

# 백엔드 경로를 시스템 경로에 추가하여 모듈 참조 가능하게 함
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.user import User

def seed_admin_user():
    db: Session = SessionLocal()
    try:
        admin_id = "CORP\\suasd.choi"
        
        # 이미 존재하는지 확인
        existing_user = db.query(User).filter(User.domain_id == admin_id).first()
        if existing_user:
            print(f"ℹ️ User {admin_id} already exists.")
            return

        # 신규 관리자 생성
        new_admin = User(
            domain_id=admin_id,
            full_name="Seonguk Choi",
            role="ADMIN",
            is_active=True
        )
        
        db.add(new_admin)
        db.commit()
        print(f"✅ Successfully seeded admin user: {admin_id}")
        
    except Exception as e:
        print(f"❌ Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin_user()
