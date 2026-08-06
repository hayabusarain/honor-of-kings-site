# -*- coding: utf-8 -*-
import os
import json

logs_dir = r'C:\Users\81901\.gemini\antigravity\brain'
subagents = [
    '87eac98f-a24d-483c-8576-7c030059ace7',
    '8af9b7bc-238b-482c-8c29-6a300cd51e0d',
    '2ebaf23b-ba8b-4a0b-a29b-9c82d6bcc7e8',
    '81bd4780-cd17-49d6-86b2-020b2590cb0d',
    'bc58a38a-8175-467e-ad2d-89189a7eac44',
    'ad31139d-3796-4072-bb5b-66704df5683b',
    '319babfa-a9e7-48a1-83a7-512e15a09e8d',
    'f6cbc22f-a188-4a8d-841c-1227ef43ccc5',
    '26a2cdf0-64cb-4fbd-b20f-208411686c53',
    '1dbe3e14-23d6-481a-890b-355331d196fd',
    '5f8b71bf-8ca9-408c-82e5-4660efbbf485'
]

results = []

for sub_id in subagents:
    transcript_path = os.path.join(logs_dir, sub_id, '.system_generated', 'logs', 'transcript_full.jsonl')
    if os.path.exists(transcript_path):
        with open(transcript_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for line in reversed(lines):
                try:
                    data = json.loads(line)
                    if data.get('type') == 'PLANNER_RESPONSE' or data.get('type') == 'TOOL_RESPONSE':
                        content = data.get('content', '')
                        if '```json' in content:
                            json_str = content.split('```json')[1].split('```')[0].strip()
                            results.append(json.loads(json_str))
                            break
                        elif data.get('tool_calls'):
                            for tc in data['tool_calls']:
                                if tc.get('function_name') == 'send_message':
                                    msg = tc.get('arguments', {}).get('Message', '')
                                    if '```json' in msg:
                                        json_str = msg.split('```json')[1].split('```')[0].strip()
                                        results.append(json.loads(json_str))
                                        break
                                    elif '{' in msg:
                                        results.append(json.loads(msg[msg.find('{'):msg.rfind('}')+1]))
                                        break
                except Exception as e:
                    pass

print(f'Extracted {len(results)} items.')
with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\raw_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
