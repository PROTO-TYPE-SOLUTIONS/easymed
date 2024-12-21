from channels.generic.websocket import AsyncWebsocketConsumer
import json


'''
consumer opens up socket connection and sends notifs to inventory_notifications group members who's joined the
socket connection in this case, procurement officers and department heads
'''
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "inventory_notifications"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):
        message = event['message']
        print(f"WebSocket Consumer received message: {message}")

        await self.send(text_data=json.dumps({
            'message': message
        }))    