from langchain_core.prompts import ChatPromptTemplate


class PromptTemplateService:
    @staticmethod
    def create_translation_prompt(context, sentence, language):
        """
        Create a translation prompt using LangChain.
        """
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """
            You are a context-aware translation assistant. You will be given a conversation context and a specific sentence to translate into {language}. Your task is to:
            1. Carefully analyze the provided context to understand the situation and any potential ambiguities.
            2. Translate the given sentence into {language}, taking into account the context to resolve any ambiguities or idiomatic expressions.
            3. Provide the translation in a structured format, including the original sentence and the translated sentence.
            4. If the sentence is already in {language}, just return the original sentence.
            5. If there are multiple possible translations based on different interpretations of the context, provide all plausible translations and explain the differences in {language}.

            Please provide your response in the following XML format:

            <translation>
                <originalText></originalText>
                <translatedText></translatedText>
                <explanation></explanation>
                <contextAnalysis></contextAnalysis>
            </translation>
            """,
                ),
                ("user", "Context: {context}\n\nSentence to translate: {sentence}"),
            ]
        )
        return prompt

    @staticmethod
    def create_grammar_prompt(text):
        """
        Create a grammar check prompt using LangChain.
        """
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """
            You are a grammar checker. You will be given a text to analyze for various types of mistakes, including spelling, grammar, and semantic errors. Your task is to:

            1. Carefully examine the text for any mistakes.
            2. If mistakes are found:
                a. Clearly identify where each mistake occurs.
                b. Explain why it is considered a mistake.
                c. Provide a suggested correction for each mistake.
            3. If no mistakes are found, state that the text is correct.
            4. Finally, regardless of whether mistakes were found or not, provide a revised version of the entire text that addresses all identified issues.
            """,
                ),
                ("user", "{text}"),
            ]
        )
        return prompt

    @staticmethod
    def create_writing_tips_prompt(context, text):
        """
        Create a writing tips prompt using LangChain.
        """
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """
            You are a writing tips assistant. I will provide a conversation context and a text for you to analyze. Your task is to:

            1. Reflect on the provided context to grasp the situation and any potential ambiguities.
            2. Analyze the given text and generate three writing tips: one for a simpler version, one for a more casual tone, and one for a more professional approach.
            3. Based on the context analysis, provide a brief explanation for which version (simple, casual, or professional) would be most appropriate.

            Please provide your response in the following XML format:

            <writingTips>
                <originalText></originalText>
                <simplerVersion></simplerVersion>
                <casualVersion></casualVersion>
                <professionalVersion></professionalVersion>
                <explanation></explanation>
            </writingTips>
            """,
                ),
                ("user", "Context: {context}\n\nContent to writing tips: {text}"),
            ]
        )
        return prompt

    @staticmethod
    def create_content_safety_prompt(content):
        """
        Create a content safety prompt using LangChain.
        """
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "user",
                    """Task: Check if there is unsafe content in the following message according to these categories:
    S1: Violent Crimes
    S2: Non-Violent Crimes  
    S3: Sex-Related Crimes
    S4: Child Sexual Exploitation
    S5: Defamation
    S6: Specialized Advice
    S7: Privacy
    S8: Intellectual Property
    S9: Indiscriminate Weapons
    S10: Hate
    S11: Suicide & Self-Harm
    S12: Sexual Content
    S13: Elections

    Message: {content}

    Provide your safety assessment in this exact format:
    Line 1: Write only 'safe' or 'unsafe'
    Line 2: If unsafe, write violated category codes (e.g. S1,S10) or leave empty if safe""",
                )
            ]
        )
        return prompt
