from unittest.mock import MagicMock, patch
from api.endpoints.issue import read_issues

def test_read_issues_pagination():
    # Setup mock DB session
    db = MagicMock()

    # Mock the CRUD layer
    with patch("api.endpoints.issue.crud_issue.get_issues") as mock_get_issues:
        mock_get_issues.return_value = ["issue1", "issue2"]

        # Call the endpoint function directly
        res = read_issues(skip=20, limit=10, db=db)

        # Verify the endpoint passes the correct parameters to the CRUD layer
        mock_get_issues.assert_called_once_with(db, skip=20, limit=10)
        assert res == ["issue1", "issue2"]

def test_read_issues_pagination_defaults():
    db = MagicMock()

    with patch("api.endpoints.issue.crud_issue.get_issues") as mock_get_issues:
        # Call with default parameters
        read_issues(db=db)

        # Verify default values (skip=0, limit=100) are passed
        mock_get_issues.assert_called_once_with(db, skip=0, limit=100)
