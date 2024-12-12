from typing import List, Union, Dict, Optional
import logging
from app.models import LangChain
from app.services.prompt_template import PromptTemplateService
from app.config.settings import Config
import xml.etree.ElementTree as ET
import json
from langchain.schema import AIMessage

logger = logging.getLogger(__name__)

chat_together = LangChain().chat_together

class TranslateService:
    REQUIRED_FIELDS = ['original_text', 'translated_text', 'explanation', 'context_analysis']
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
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <div class="font-bold text-blue-600">Translated Text</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{translated_text}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="font-bold text-green-500">Explanation</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{explanation}</p>
        </div>
    </div>

    <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div class="font-bold text-purple-600">Context Analysis</div>
        </div>
        <div class="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <p class="text-gray-700 text-justify whitespace-pre-wrap text-sm">{context_analysis}</p>
        </div>
    </div>
</div>"""

    @staticmethod
    def translate_sentence(conversation: List[str], content: str, language: str) -> Optional[Dict]:
        """
        Translate a sentence using conversation context and target language.

        Args:
            conversation: List of previous conversation messages
            content: Text to translate
            language: Target language for translation

        Returns:
            Optional[Dict]: Translation response or None if translation fails
        """
        try:
            logger.info(f"Creating translation prompt for content: {content} to language: {language}")
            context = "\n".join(conversation) if conversation else ""
            prompt = PromptTemplateService.create_translation_prompt(context, content, language)

            translate_chain = prompt | chat_together

            response = translate_chain.invoke({
                "context": context,
                "sentence": content,
                "language": language
            })

            # Handle AIMessage response type
            if isinstance(response, AIMessage):
                response = response.content
                print(response)

            logger.info("Translation completed successfully")

            response_error = "I'm sorry, but I couldn't translate that text. It appears to be empty, contain only numbers, or be too short. Please provide a proper sentence or paragraph to translate."

            try:
                if response is None:
                    return response_error

                # Format and validate translation
                formatted_translation = TranslateService.format_translation_response(response)
                if formatted_translation is None:
                    logger.error("Failed to format translation response")
                    return "I'm sorry, but I couldn't translate that text. It appears to be empty, contain only numbers, or be too short. Please provide a proper sentence or paragraph to translate."

                logger.info("Successfully formatted translation response")
                return formatted_translation

            except Exception as e:
                logger.error(f"Error processing translation response: {str(e)}", exc_info=True)
                return None

        except Exception as e:
            logger.error(f"Error during translation: {str(e)}")
            return None

    @staticmethod
    def format_translation_response(response: Union[str, Dict]) -> Optional[str]:
        """
        Format the translation response into a structured HTML format.

        Args:
            response: Translation response to format

        Returns:
            Optional[str]: Formatted HTML string or None if formatting fails
        """
        if not response:
            logger.warning("Received empty response to format")
            return None

        try:
            # Extract content from XML response
            if isinstance(response, str):
                root = ET.fromstring(response)
            else:
                root = ET.fromstring(response)

            original_text = root.find('originalText').text
            translated_text = root.find('translatedText').text
            explanation = root.find('explanation').text
            context_analysis = root.find('contextAnalysis').text

            response_error = "I'm sorry, but I couldn't translate that text. It appears to be empty, contain only numbers, or be too short. Please provide a proper sentence or paragraph to translate."

            if translated_text == "None" or translated_text is None:
                return response_error

            return TranslateService.HTML_TEMPLATE.format(
                original_text=original_text,
                translated_text=translated_text,
                explanation=explanation,
                context_analysis=context_analysis
            )

        except Exception as e:
            logger.error(f"Error formatting translation response: {str(e)}")
            return None

    @staticmethod
    def _parse_response(response: Union[str, Dict]) -> Optional[Dict]:
        """Parse XML response into dictionary."""
        try:
            import xml.etree.ElementTree as ET
            if isinstance(response, str):
                root = ET.fromstring(response)
            else:
                root = ET.fromstring(response)

            return {
                'original_text': root.find('originalText').text,
                'translated_text': root.find('translatedText').text,
                'explanation': root.find('explanation').text,
                'context_analysis': root.find('contextAnalysis').text
            }
        except Exception as e:
            logger.error(f"Failed to parse XML response: {e}")
            return None

    @staticmethod
    def _validate_response_fields(response: Dict) -> bool:
        """Validate that response contains all required XML fields."""
        required_fields = ['original_text', 'translated_text', 'explanation', 'context_analysis']
        if not all(field in response for field in required_fields):
            logger.error("Response missing required XML fields")
            return False
        return True
