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
<div class="space-y-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div class="font-bold text-gray-800">Original Text</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{original_text}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div class="font-bold text-yellow-500">Analysis</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{analysis}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="font-bold text-green-500">Corrected Text</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{corrected_text}</p>
        </div>
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
