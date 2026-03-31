import pytest
import asyncio
from unittest.mock import patch, MagicMock
import httpx
from backend import seed_data

@pytest.mark.asyncio
async def test_seed():
    # Mocking httpx.AsyncClient.post
    mock_post = MagicMock()
    mock_response = MagicMock()
    mock_response.status_code = 200

    # Needs to return a mock response that can be awaited
    async def mock_post_async(*args, **kwargs):
        return mock_response

    mock_post.side_effect = mock_post_async

    # We mock the client context manager as well
    class MockClient:
        async def __aenter__(self):
            self.post = mock_post
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

    with patch("httpx.AsyncClient", return_value=MockClient()):
        await seed_data.seed()

    assert mock_post.call_count == len(seed_data.SEED_DATA)
