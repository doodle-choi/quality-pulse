import os
import json
import logging
from pydantic import BaseModel, Field

logger = logging.getLogger("TriageAgent")

class AnalyzedIssue(BaseModel):
    title: str = Field(..., description="이슈의 핵심 요약 제목. (1줄)")
    brand: str = Field(..., description="제조사 브랜드 (예: Samsung, LG, Whirlpool). 모델 불명확 시 'Unknown'")
    product_category: str = Field(..., description="가전 제품군 (예: Refrigerator, Washer, Oven, Unknown)")
    severity: str = Field(..., description="위험도 (Critical, High, Medium, Low)")
    issue_type: str = Field(..., description="이슈 유형 (Recall, Quality, Safety, Service)")
    description: str = Field(..., description="이슈에 대한 간략한 상세 요약")
    region: str = Field(..., description="영향 지역 (예: USA, Europe, Global)")
    failed_component: str | None = Field(None, description="문제가 발생한 핵심 부품/소프트웨어 (예: Compressor Relay, Lithium-ion Battery, Door Latch). 불명확하면 null")
    root_cause: str | None = Field(None, description="근본 원인 기술적 요약 (예: Electrical Short Circuit, Thermal Runaway, Mechanical stress). 불명확하면 null")
    source_url: str = Field(default="N/A", description="출처 URL")
    published_at: str | None = Field(None, description="이슈의 공식 발표일 또는 발생일 (ISO 형식: YYYY-MM-DD). 본문에 날짜 정보가 없으면 null")


async def parse_markdown_with_llm(markdown_content: str, source_url: str = "N/A") -> list[AnalyzedIssue] | None:
    """
    특정 AI 벤더(OpenAI)에 종속되지 않도록 litellm을 활용하여
    상황과 예산에 맞게 'GPT-4o', 'Claude 3', 'Gemini' 등을 오갈 수 있는 확장형 Triage 구조입니다.
    """
    try:
        from litellm import acompletion
    except ImportError:
        logger.error("❌ litellm 패키지가 없습니다. `poetry add litellm`이 필요합니다.")
        return None

    model_name = os.getenv("LLM_MODEL", "gemini/gemini-flash-latest")
    if "gemini" in model_name and not model_name.startswith("gemini/"):
        model_name = f"gemini/{model_name}"
        
    prompt = f"""
    You are an expert HOME APPLIANCE quality and safety forensic engineer.
    Below is a raw markdown or JSON data extracted from a crawler target.

    CRITICAL RULE 0: The RAW TEXT may be in Korean, Japanese, or other languages. You MUST translate the extracted information into English.
    
    CRITICAL RULE 1: Extract ONLY incidents related to HOME APPLIANCES (e.g., Refrigerators, Washers, Dryers, Ovens, Dishwashers, Air Conditioners, Microwaves).
    DO NOT extract issues related to smartphones, tablets, TVs, monitors, or personal electronics.
    If the text does not contain any home appliance issues, you MUST return an empty array [].

    CRITICAL RULE 2: You MUST extract EVERY SINGLE DISTINCT INCIDENT found in the text as a separate JSON object. Do NOT summarize multiple distinct incidents into one. For example, if there are multiple distinct appliance recalls or issues in the text, your JSON array MUST contain separate objects for each. Be exhaustive.

    CRITICAL RULE 3: Act as a forensic engineer. Deeply analyze the text to identify the specific 'failed_component' (e.g., 'Compressor Relay', 'Heating Element') and the technical 'root_cause' (e.g., 'Electrical Short', 'Thermal Runaway'). Prioritize precise technical terms over marketing jargon.

    You MUST return the final answer as a VALID JSON ARRAY OF OBJECTS matching this schema exactly.
    Do NOT include markdown formatting or extra text outside the JSON array.

    SCHEMA:
    [
        {{
            "title": "concise title for incident 1",
            "brand": "Manufacturer (e.g. Samsung)",
            "product_category": "Appliance Type",
            "severity": "Critical / High / Medium / Low",
            "issue_type": "Recall / Quality / Safety / Service",
            "description": "3-sentence summary of incident 1",
            "region": "Country (e.g. USA)",
            "failed_component": "Specific failing part (or null)",
            "root_cause": "Technical root cause of failure (or null)",
            "source_url": "Extract the specific URL for this incident from the raw text. If not found, use: {source_url}",
            "published_at": "YYYY-MM-DD or null"
        }}
    ]

    RAW TEXT:
    {markdown_content}
    """

    if not any(k in os.environ for k in ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY"]):
         logger.warning(f"⚠️ LLM API Keys are missing in environment! Keys available: {[k for k in os.environ if 'API_KEY' in k]}")
         return None

    try:
        logger.info(f"🧠 Async LLM Triage Running... (Model: {model_name})")
        
        response = await acompletion(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        
        raw_text = response.choices[0].message.content
        clean_json_str = raw_text.replace("```json", "").replace("```", "").strip()
        
        # JSON parsing with some robustness
        try:
            parsed_json = json.loads(clean_json_str)
        except json.JSONDecodeError:
            # Try to find the array if there's surrounding text
            import re
            match = re.search(r"\[.*\]", clean_json_str, re.DOTALL)
            if match:
                parsed_json = json.loads(match.group())
            else:
                raise

        issues = [AnalyzedIssue(**item) for item in parsed_json]
        return issues
        
    except Exception as e:
        logger.error(f"❌ Async LLM Parsing failed for {source_url}: {e}")
        return None
