from backend.config import settings
from fastapi import HTTPException
import yagmail

class EmailSender:
    def __init__(self):
        try:
            self.username = settings.YAGMAIL_USER
            self.password = settings.YAGMAIL_PASS
            self.yag = yagmail.SMTP(self.username, self.password)
        except Exception as e:
            error_message = "Error initializing Yagmail: {}".format(str(e))
            raise HTTPException(status_code=400, detail=error_message)

    def send_email(self, to, subject, content):
        try:
            self.yag.send(to, subject, contents=[content])
        except Exception as e:
            error_message = "Error sending email: {}".format(str(e))
            raise HTTPException(status_code=400, detail=error_message)
