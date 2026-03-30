import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException
from api.endpoints.crawl_log import update_log
from schemas.crawl_log import CrawlLogUpdate

def test_update_log_not_found():
    # Setup mock DB session
    db = MagicMock()

    # Mock the CRUD layer to return None (not found)
    with patch("api.endpoints.crawl_log.crud_crawl_log.update_crawl_log") as mock_update_log:
        mock_update_log.return_value = None

        # Prepare update data
        log_update = CrawlLogUpdate(status="completed")

        # Call the endpoint function directly and expect HTTPException
        with pytest.raises(HTTPException) as exc_info:
            update_log(log_id=999, log_update=log_update, db=db)

        # Verify the exception details
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Crawl log not found"

        # Verify the endpoint passed the correct parameters to the CRUD layer
        mock_update_log.assert_called_once_with(db=db, log_id=999, log_update=log_update)
