from pydantic import BaseModel, Field
from app.services.prompt_template import PromptTemplateService
from app.config.settings import Config
from langchain_together import ChatTogether
from typing import List
import logging
from langchain.output_parsers.openai_tools import JsonOutputKeyToolsParser
from app.models import LangChain
import xml.etree.ElementTree as ET

logger = logging.getLogger(__name__)

chat_together = LangChain().chat_together

class WritingTipsService:
    HTML_TEMPLATE = """
<div class="writing-tips-result">
    <div class="section original-text">
        <div class="heading" style="font-weight: bold; color: #2c3e50; margin-bottom: 10px;">Original Text:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{original_text}"</div>
    </div>

    <div class="section simpler-version">
        <div class="heading" style="font-weight: bold; color: #27ae60; margin-bottom: 10px;">Simpler Version:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{simpler_version}"</div>
    </div>

    <div class="section casual-version">
        <div class="heading" style="font-weight: bold; color: #e67e22; margin-bottom: 10px;">Casual Version:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{casual_version}"</div>
    </div>

    <div class="section professional-version">
        <div class="heading" style="font-weight: bold; color: #2980b9; margin-bottom: 10px;">Professional Version:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{professional_version}"</div>
    </div>

    <div class="section explanation">
        <div class="heading" style="font-weight: bold; color: #8e44ad; margin-bottom: 10px;">Recommendation:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">{explanation}</div>
    </div>
</div>"""

    @staticmethod
    def generate_writing_tips(conversation: List[dict], text: str):
        prompt = PromptTemplateService.create_writing_tips_prompt(conversation, text)
        writing_tips_chain = prompt | chat_together

        try:
            response = writing_tips_chain.invoke({
                "context": conversation,
                "text": text
            })

            if response is None:
                logger.error("Response is None. This might be due to an issue with the API or parsing.")
                return "I apologize, but I couldn't process that text. Please provide a proper sentence or paragraph in English for me to analyze."

            return WritingTipsService.format_writing_tips(response)
        except Exception as e:
            logger.error(f"Error during writing tips generation: {str(e)}")
            return None

    @staticmethod
    def format_writing_tips(response):
        try:
            if isinstance(response, str):
                root = ET.fromstring(response)
            else:
                root = ET.fromstring(response.content)

            formatted_response = {
                "original_text": root.find('originalText').text,
                "simpler_version": root.find('simplerVersion').text,
                "casual_version": root.find('casualVersion').text,
                "professional_version": root.find('professionalVersion').text,
                "explanation": root.find('explanation').text
            }

            if not all(key in formatted_response for key in ["original_text", "simpler_version", "casual_version", "professional_version", "explanation"]):
                logger.warning("Some expected fields are missing in the response")

            return WritingTipsService.HTML_TEMPLATE.format(**formatted_response)

        except Exception as e:
            logger.error(f"Error during response formatting: {str(e)}")
            return None
