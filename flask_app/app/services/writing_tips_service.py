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
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div class="font-bold text-green-500">Simpler Version</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{simpler_version}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <div class="font-bold text-yellow-500">Casual Version</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{casual_version}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div class="font-bold text-blue-600">Professional Version</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{professional_version}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div class="font-bold text-purple-600">Recommendation</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{explanation}</p>
        </div>
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
