import pyautogui
import keyboard
import time
import json
import os

print("=== ブルースタックス スクリーンショット キャリブレーション (改訂版) ===")
print("マウスカーソルを目的のボタンに合わせて、キーボードの『s』キーを押してください。")
print("---------------------------------------------------------------")

points = [
    "① パッシブのアイコン",
    "② スキル1のアイコン",
    "③ スキル2のアイコン",
    "④ スキル3のアイコン",
    "⑤ ステータスを開くための右側タブ",
    "⑥ ステータスボタン（タブを開いた後に出る）",
    "⑦ ステータス画面の閉じる(X)ボタン",
    "⑧ 左上の戻る(キャラ選択に戻る)ボタン"
]

coordinates = {}

for p in points:
    print(f"【{p}】の上にマウスを移動し、「s」キーを押してください...")
    while True:
        if keyboard.is_pressed('s'):
            x, y = pyautogui.position()
            coordinates[p] = {"x": x, "y": y}
            print(f" -> 記録しました！ ({x}, {y})")
            time.sleep(0.5) # 重複入力を防ぐ
            break
        time.sleep(0.05)

# Save to a config file
config_path = os.path.join(os.path.dirname(__file__), 'screenshot_config.json')
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(coordinates, f, ensure_ascii=False, indent=2)

print("\nキャリブレーション完了！")
print(f"座標データを保存しました: {config_path}")
print("続いて auto_screenshot.py を実行してください。")
