import os
import json
import logging
from pydantic import BaseModel, Field
from typing import List, Optional

logger = logging.getLogger("TriageAgent")

class AnalyzedIssue(BaseModel):
    title: str = Field(..., description="이슈의 핵심 요약 제목. (1줄)")
    brand: str = Field(..., description="제조사 브랜드 (예: Samsung, LG, Whirlpool). 모델 불명확 시 'Unknown'")
    product_category: str = Field(..., description="가전 제품군 (예: Refrigerator, Washer, Oven, Unknown)")
    severity: str = Field(..., description="위험도 (Critical, High, Medium, Low)")
    issue_type: str = Field(..., description="이슈 유형 (Recall, Quality, Safety, Service)")
    description: str = Field(..., description="이슈에 대한 간략한 상세 요약")
    region: str = Field(..., description="영향 지역 (예: USA, Europe, Global)")
    source_url: str = Field(default="N/A", description="출처 URL")


def parse_markdown_with_llm(markdown_content: str, source_url: str = "N/A") -> Optional[List[AnalyzedIssue]]:
    """
    특정 AI 벤더(OpenAI)에 종속되지 않도록 litellm을 활용하여
    상황과 예산에 맞게 'GPT-4o', 'Claude 3', 'Gemini' 등을 오갈 수 있는 확장형 Triage 구조입니다.
    `LLM_MODEL` 환경변수를 통해 컨트롤합니다. (기본값: gpt-4o-mini)
    """
    try:
        from litellm import completion
    except ImportError:
        logger.error("❌ litellm 패키지가 없습니다. `poetry add litellm`이 필요합니다.")
        return None

    # 환경변수 기반 범용 모델 감지
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=True)
    
    model_name = os.getenv("LLM_MODEL", "gpt-4o-mini")
    if "gemini" in model_name and not model_name.startswith("gemini/"):
        model_name = f"gemini/{model_name}"
        
    # 일부 LLM은 Structured Outputs(JSON 모드)를 미지원하므로
    # 완벽한 호환성을 위해 Prompt 자체에서 엄격한 JSON 배열 구조를 강제합니다.
    prompt = f"""
    You are an expert HOME APPLIANCE quality and safety intelligence analyst.
    Below is a strongly compressed raw markdown extracted from a crawler target.
    
    CRITICAL RULE: Extract ONLY incidents related to HOME APPLIANCES (e.g., Refrigerators, Washers, Dryers, Ovens, Dishwashers, Air Conditioners, Microwaves).
    DO NOT extract issues related to smartphones, tablets, TVs, monitors, or personal electronics.
    If the text does not contain any home appliance issues, you MUST return an empty array [].
    
    You MUST return the final answer as a VALID JSON ARRAY OF OBJECTS matching this schema exactly.
    Do NOT include markdown formatting or extra text outside the JSON array.
    
    SCHEMA:
    [
        {{
            "title": "concise title",
            "brand": "Manufacturer (e.g. Samsung)",
            "product_category": "Appliance Type",
            "severity": "Critical / High / Medium / Low",
            "issue_type": "Recall / Quality / Safety / Service",
            "description": "3-sentence summary",
            "region": "Country (e.g. USA)",
            "source_url": "{source_url}"
        }}
    ]

    RAW TEXT:
    {markdown_content[:4000]}
    """

    # 키가 설정되어 있지 않다면 안전장치로 None 반환 (Mock으로 대체되도록 유도)
    if "OPENAI_API_KEY" not in os.environ and "ANTHROPIC_API_KEY" not in os.environ and "GEMINI_API_KEY" not in os.environ:
         logger.warning("⚠️ LLM API 키(OpenAI, Claude, Gemini 등)가 없어 작동할 수 없습니다.")
         return None

    try:
        logger.info(f"🧠 Universal LLM 분류 가동 중... (선택 모델: {model_name})")
        
        response = completion(
            model=model_name,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.0
        )
        
        raw_text = response.choices[0].message.content
        # Markdown 코드 블록(```json 등)이 섞여있을 수 있으므로 클린업
        clean_json_str = raw_text.replace("```json", "").replace("```", "").strip()
        
        parsed_json = json.loads(clean_json_str)
        issues = [AnalyzedIssue(**item) for item in parsed_json]
        
        return issues
        
    except Exception as e:
        logger.exception(f"❌ Universal LLM Parsing failed: {e}")
        return None
