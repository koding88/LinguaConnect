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
<div class="translation-result">
    <div class="section original-text">
        <div class="heading" style="font-weight: bold; color: #2c3e50; margin-bottom: 10px;">Original Text:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{original_text}"</div>
    </div>

    <div class="section translated-text">
        <div class="heading" style="font-weight: bold; color: #2980b9; margin-bottom: 10px;">Translated Text:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">"{translated_text}"</div>
    </div>

    <div class="section explanation">
        <div class="heading" style="font-weight: bold; color: #27ae60; margin-bottom: 10px;">Explanation:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">{explanation}</div>
    </div>

    <div class="section context-analysis">
        <div class="heading" style="font-weight: bold; color: #8e44ad; margin-bottom: 10px;">Context Analysis:</div>
        <div class="content" style="margin-bottom: 15px; padding: 8px; background: #f8f9fa; border-radius: 4px;">{context_analysis}</div>
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

            print("Prompt content: ", content)

            translate_chain = prompt | chat_together

            response = translate_chain.invoke({
                "context": context,
                "sentence": content,
                "language": language
            })

            # Handle AIMessage response type
            if isinstance(response, AIMessage):
                response = response.content

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
