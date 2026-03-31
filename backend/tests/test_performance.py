import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sqlalchemy.dialects.postgresql import insert as pg_insert
from models.issue import Issue
from schemas.issue import IssueCreate
import random
import string

def test_sql_generation():
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    issue = IssueCreate(
        title=f"Issue {random_str}",
        description="A test issue",
        brand="TestBrand",
        product_category="TestCategory",
        severity="High",
        issue_type="Quality",
        source_url="http://example.com"
    )
    stmt = pg_insert(Issue).values(**issue.model_dump())
    stmt = stmt.on_conflict_do_nothing(index_elements=['title'])

    # Check if the generated SQL is correct
    print("Generated SQL:")
    print(str(stmt.compile()))

if __name__ == "__main__":
    test_sql_generation()
