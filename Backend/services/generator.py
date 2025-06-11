from google.genai import types
import base64
from typing import Optional, List, Dict
import json
from google import genai
from google.genai.types import GenerateContentConfig
from PIL import Image

class CyberGenerator:

    def __init__(self, api_key: Optional[str] = None):

        self.api_key = api_key

        self.client = genai.Client(api_key=self.api_key)


    def cyber_free_image(self, path: str) -> str:


        # load your source image
        img = Image.open(path)

        # generate content
        response = self.client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[
                # first element: a text prompt
                """create a image that is provided you from cyber bulying content and just remove remove the cyber bulying content from image just and dont need to change the image anything else""",
                # second element: the image bytes
                img
            ],
            config=types.GenerateContentConfig(
                response_modalities=["Text", "Image"]
            ),
        )
        data = None
        for part in response.candidates[0].content.parts:
            # Skip parts with text content.
            if part.text is not None:
                continue
            elif part.inline_data is not None:
                mime = part.inline_data.mime_type
                data = part.inline_data.data
                # If data is a base64 string, decode it.
                if isinstance(data, str):
                    data = base64.b64decode(data)
                return data
        return data



    def cyber_free_text(self, text: str) -> str:

        prompt = f"""You are an expert agent to analyze the provide to remove the allcyberbulying words and if there is no cyer bullying words then dont need tochange 
        Changing Text:
        {text}
        Generate the output according to provided format in json format:
        {{'text': write text here changing text}}

        """
        response = self.client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json'
            }
        )

        return json.loads(response.text)


    def detect_cyberbulying_img(self, path, text):
        img = Image.open(path)


        prompt = f"""You are an expert agent to analyze the provide image if there is any cyber bulying then answer yes in output if there is not cyber bulying then answer no and also detect the cyberbulying from the provided text
        Text:
        {text}

        Generate the output according to provided format in json format:
        {{'cyberbulying': write yes if cyberberbulying other no,
        "suggestion": write suggestion 10 words,
        "cyberbulying_type": classify cuberbulying in one word only
        }}

        """
        response = self.client.models.generate_content(
            model='gemini-2.0-flash',
            contents=[prompt, img],
            config={
                'response_mime_type': 'application/json'
            }
        )

        return json.loads(response.text)

    def detect_cyberbulying(self, text):

        prompt = f"""You are an expert agent to analyze the provided text if there is any cyber bulying then answer yes in output if there is not cyber bulying then answer no and also detect the cyberbulying from the provided text
        Text:
        {text}

        Generate the output according to provided format in json format:
        {{'cyberbulying': write yes if cyberberbulying other no,
        "suggestion": write suggestion 10 words,
        "cyberbulying_type": classify cuberbulying in one word only
        }}

        """
        response = self.client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json'
            }
        )

        return json.loads(response.text)






