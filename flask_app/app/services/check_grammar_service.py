from pydantic import BaseModel, Field
from app.services.prompt_template import PromptTemplateService
from app.config.settings import Config
from langchain_together import ChatTogether
from typing import List
import logging
from langchain.output_parsers.openai_tools import JsonOutputKeyToolsParser
from app.models import LangChain

logger = logging.getLogger(__name__)

chat_together = LangChain().chat_together

class check_grammar(BaseModel):
    """Check the grammar of the given text and provide suggestions for improvement."""

    original_text: str = Field(..., description="The original text to check for grammar mistakes.")
    is_correct: bool = Field(..., description="Indicates whether the text is grammatically correct.")
    analysis: dict = Field(..., description="An analysis of the text's must be grammar, spelling, and semantics. Explain the mistakes in detail.")
    corrected_text: str = Field(..., description="A corrected version of the text that addresses all grammar, spelling, and semantic issues.")

class CheckGrammarService:
    HTML_TEMPLATE = """
<div class="grammar-check-result">
    <div class="section original-text">
        <div class="heading" style="font-weight: bold; color: #2c3e50; margin-bottom: 10px;">Original Text:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{original_text}"</div>
    </div>

    <div class="section analysis">
        <div class="heading" style="font-weight: bold; color: #e67e22; margin-bottom: 10px;">Analysis:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">{analysis}</div>
    </div>

    <div class="section corrected-text">
        <div class="heading" style="font-weight: bold; color: #27ae60; margin-bottom: 10px;">Corrected Text:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{corrected_text}"</div>
    </div>
</div>"""

    @staticmethod
    def grammar_check(text: str):
        prompt = PromptTemplateService.create_grammar_prompt(text)

        llm_with_tool = chat_together.bind_tools(
            [check_grammar],
            tool_choice="check_grammar",
        )
        output_parser = JsonOutputKeyToolsParser(key_name="check_grammar", first_tool_only=True)
        grammar_check_chain = prompt | llm_with_tool | output_parser

        try:
            response = grammar_check_chain.invoke({"text": text})

            if response is None:
                logger.error("Response is None. This might be due to an issue with the API or parsing.")
                return "I'm sorry, but I couldn't process that text. It might be too short, contain only numbers, or consist of random characters. Could you please provide a proper sentence or paragraph in English for me to check?"

            return CheckGrammarService.format_grammar_check(response)
        except Exception as e:
            logger.error(f"Error during grammar check: {str(e)}")
            return None

    @staticmethod
    def format_grammar_check(response):
        try:
            if isinstance(response, str):
                response = eval(response)

            analysis_text = ""
            for key, value in response.get("analysis", {}).items():
                if value:
                    analysis_text += f"<strong>{key.capitalize()}:</strong> {value}<br>"

            formatted_response = {
                "original_text": response.get("original_text", ""),
                "analysis": analysis_text,
                "corrected_text": response.get("corrected_text", "")
            }

            if not all(key in formatted_response for key in ["original_text", "analysis", "corrected_text"]):
                logger.warning("Some expected fields are missing in the response")

            return CheckGrammarService.HTML_TEMPLATE.format(**formatted_response)

        except Exception as e:
            logger.error(f"Error during response formatting: {str(e)}")
            return None
