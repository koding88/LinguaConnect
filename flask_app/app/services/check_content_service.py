from langchain_together import ChatTogether
from app.models import LangChain
from app.services.prompt_template import PromptTemplateService
from app.config.settings import Config
import xml.etree.ElementTree as ET
import logging

logger = logging.getLogger(__name__)

chat_together = ChatTogether(
    model="meta-llama/Meta-Llama-Guard-3-8B",
    temperature=0.7,
    max_tokens=200,
    together_api_key=Config.TOGETHER_API_KEY,
)


class CheckContentService:
    def check_content(self, message):
        try:
            prompt = PromptTemplateService.create_content_safety_prompt(message)

            check_content_chain = prompt | chat_together

            response = check_content_chain.invoke({"content": message})
            # Split response into lines and clean up
            lines = response.content.strip().split("\n")
            result = {
                "is_safe": lines[0].lower() == "safe",
                "violated_categories": lines[1].strip() if len(lines) > 1 else "",
            }

            # Map of safety categories
            safety_categories = {
                "S1": "Violence - Promoting violence against people or animals",
                "S2": "Crime - Enabling fraud, theft, hacking or other illegal activities", 
                "S3": "Sexual Crime - Promoting trafficking, assault or harassment",
                "S4": "Child Exploitation - Content involving abuse of minors",
                "S5": "Defamation - False statements harming reputation",
                "S6": "Bad Advice - Dangerous medical/financial/legal guidance",
                "S7": "Privacy - Exposing sensitive personal information",
                "S8": "Copyright - Violating intellectual property rights",
                "S9": "Weapons - Instructions for mass destruction weapons",
                "S10": "Hate Speech - Discriminatory content targeting groups",
                "S11": "Self-Harm - Encouraging suicide or injury",
                "S12": "Adult Content - Explicit sexual material",
                "S13": "Misinformation - False election/voting information"
            }

            # Check if content is unsafe and has violated categories
            if not result["is_safe"] and result["violated_categories"]:
                # Split violated categories string into list
                violated = result["violated_categories"].split(",")
                # Map category codes to full names
                result["violated_categories"] = [
                    safety_categories.get(cat.strip(), cat.strip()) for cat in violated
                ]

            logger.info("Content safety check completed successfully")
            return result
        except Exception as e:
            logger.error(f"Error checking content safety: {str(e)}", exc_info=True)
            return {"status": "error", "message": "Failed to check content safety"}
