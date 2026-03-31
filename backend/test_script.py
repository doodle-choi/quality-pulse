import sys
sys.path.append('backend')
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.issue import Base, Issue
from schemas.issue import IssueCreate
from crud.issue import create_issue, create_issues
import random
import string

# Create a minimal SQLite database for testing
engine = create_engine('sqlite:///:memory:', echo=False)
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)

def generate_random_issue(title_prefix="Issue"):
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    return IssueCreate(
        title=f"{title_prefix} {random_str}",
        description="A test issue",
        brand="TestBrand",
        product_category="TestCategory",
        severity="High",
        issue_type="Quality",
        source_url="http://example.com"
    )

def test_single_insert_performance():
    db = SessionLocal()

    # Generate 1000 issues
    issues_to_create = [generate_random_issue(f"SingleInsert-{i}") for i in range(1000)]

    start_time = time.time()
    for issue_data in issues_to_create:
        create_issue(db, issue_data)
    end_time = time.time()

    time_taken = end_time - start_time
    print(f"Time taken to insert 1000 issues one by one (create_issue): {time_taken:.4f} seconds")

    # Try inserting the SAME 1000 issues one by one (checking duplicates)
    start_time_dups = time.time()
    for issue_data in issues_to_create:
        create_issue(db, issue_data)
    end_time_dups = time.time()

    time_taken_dups = end_time_dups - start_time_dups
    print(f"Time taken to check and skip 1000 existing issues (create_issue): {time_taken_dups:.4f} seconds")
    db.close()

def test_bulk_insert_performance():
    db = SessionLocal()

    # Generate 1000 issues
    issues_to_create = [generate_random_issue(f"BulkInsert-{i}") for i in range(1000)]

    start_time = time.time()
    create_issues(db, issues_to_create)
    end_time = time.time()

    time_taken = end_time - start_time
    print(f"Time taken to bulk insert 1000 issues (create_issues): {time_taken:.4f} seconds")

    # Try inserting the SAME 1000 issues in bulk (checking duplicates)
    start_time_dups = time.time()
    create_issues(db, issues_to_create)
    end_time_dups = time.time()

    time_taken_dups = end_time_dups - start_time_dups
    print(f"Time taken to check and skip 1000 existing issues in bulk (create_issues): {time_taken_dups:.4f} seconds")

    db.close()

if __name__ == "__main__":
    test_single_insert_performance()
    print("-" * 40)
    test_bulk_insert_performance()
