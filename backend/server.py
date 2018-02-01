import asyncio
import json
import websockets

async def consumer_handler(websocket, path):
    async for message in websocket:
        response = json.loads(message)
        print(response)
        if response.get('type') == 'test':
            await websocket.send(json.dumps({
                'type': 'DataIs',
                'data': response.get('data')
            }))
        else:
            await websocket.send(json.dumps({
                'type': 'error',
                'message': 'Unknown type'
            }))


start_server = websockets.serve(consumer_handler, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
