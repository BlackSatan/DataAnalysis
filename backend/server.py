import asyncio
import json
import websockets
import pca
import cluster
import numpy as np


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


async def consumer_handler(websocket, path):
    async for message in websocket:
        response = json.loads(message)
        type = response.get('type')
        if type == 'test':
            await websocket.send(json.dumps({
                'type': 'DataIs',
                'data': response.get('data')
            }))
        elif type == 'mgk':
            data = response.get('data')
            params = data.get('params')
            threshold = float(data.get('threshold')) / 100
            await websocket.send(json.dumps({
                'type': 'mgk',
                'data': pca.work(params, threshold)
            }, cls=NumpyEncoder))
        elif type == 'cluster':
            data = response.get('data')
            params = data.get('params')
            x = int(data.get('x'))
            y = int(data.get('y'))
            clusters = int(data.get('clusters'))
            distance = data.get('distance')
            await websocket.send(json.dumps({
                'type': 'cluster',
                'data': cluster.work(params, x, y, clusters, distance)
            }, cls=NumpyEncoder))
        else:
            await websocket.send(json.dumps({
                'type': 'error',
                'message': 'Unknown type'
            }))


start_server = websockets.serve(consumer_handler, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
