from unittest.mock import MagicMock
from crud.issue import get_issues
from models.issue import Issue

def test_get_issues_pagination():
    # Setup mock DB session
    db = MagicMock()

    # Mock the query chain: db.query(Issue).order_by(...).offset(...).limit(...).all()
    query = db.query.return_value
    order_by = query.order_by.return_value
    offset = order_by.offset.return_value
    limit = offset.limit.return_value
    limit.all.return_value = ["issue1", "issue2"]

    # Call the function with specific skip and limit
    res = get_issues(db, skip=10, limit=5)

    # Assertions
    db.query.assert_called_once_with(Issue)
    # We can't easily check the argument to order_by since it's an expression,
    # but we can check that it was called.
    assert order_by.offset.called
    order_by.offset.assert_called_with(10)
    offset.limit.assert_called_with(5)
    assert res == ["issue1", "issue2"]

def test_get_issues_pagination_defaults():
    db = MagicMock()
    query = db.query.return_value
    order_by = query.order_by.return_value
    offset = order_by.offset.return_value
    limit = offset.limit.return_value

    get_issues(db)

    # Verify default values (skip=0, limit=100)
    order_by.offset.assert_called_with(0)
    offset.limit.assert_called_with(100)
