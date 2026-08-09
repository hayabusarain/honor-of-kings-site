import pyautogui
import keyboard
import time
import json
import os

print("=== 半自動スクリーンショット撮影スクリプト ===")

config_path = os.path.join(os.path.dirname(__file__), 'screenshot_config.json')
if not os.path.exists(config_path):
    print("エラー: 先に calibration.py を実行して座標を記憶させてください。")
    exit(1)

with open(config_path, 'r', encoding='utf-8') as f:
    coords = json.load(f)

# 保存先ディレクトリの作成
save_dir = os.path.join(os.path.expanduser('~'), 'Desktop', 'screenshots')
os.makedirs(save_dir, exist_ok=True)
print(f"画像の保存先: {save_dir}\n")

print("【操作手順】")
print("1. BlueStacksで「キャラ選択画面」を開いてください。")
print("2. 最初のヒーローをクリックして詳細画面に入ってください。")
print("3. その状態でキーボードの「スペースキー」を押してください。")
print("4. スクリプトが自動で5枚の画像を撮影し、キャラ選択画面まで戻ります。")
print("5. 戻ったら、手動で次のヒーローをクリックし、また「スペースキー」を押してください。")
print("（※終了する場合は Ctrl+C を押すか、ターミナルを閉じてください）\n")

pyautogui.FAILSAFE = True
hero_count = 1

while True:
    print(f"[{hero_count}体目] ヒーロー詳細画面で「スペースキー」を押すと撮影を開始します...")
    
    # スペースキーが押されるまで待機
    keyboard.wait('space')
    print(f"[{hero_count}体目] 撮影開始...")
    prefix = f"hero_{hero_count:03d}"

    # 最初の画面（初期表示）を撮影するための待機（アニメーション完了待ち）
    print("  最初の画面を撮影するため3秒待機中...")
    time.sleep(3.0)
    
    # 0. 初期画面
    pyautogui.screenshot(os.path.join(save_dir, f"{prefix}_initial.png"))

    # 1. パッシブ
    pyautogui.click(x=coords['① パッシブのアイコン']['x'], y=coords['① パッシブのアイコン']['y'])
    time.sleep(0.5)
    pyautogui.screenshot(os.path.join(save_dir, f"{prefix}_passive.png"))

    # 2. スキル1
    pyautogui.click(x=coords['② スキル1のアイコン']['x'], y=coords['② スキル1のアイコン']['y'])
    time.sleep(0.5)
    pyautogui.screenshot(os.path.join(save_dir, f"{prefix}_skill1.png"))

    # 3. スキル2
    pyautogui.click(x=coords['③ スキル2のアイコン']['x'], y=coords['③ スキル2のアイコン']['y'])
    time.sleep(0.5)
    pyautogui.screenshot(os.path.join(save_dir, f"{prefix}_skill2.png"))

    # 4. スキル3
    pyautogui.click(x=coords['④ スキル3のアイコン']['x'], y=coords['④ スキル3のアイコン']['y'])
    time.sleep(0.5)
    pyautogui.screenshot(os.path.join(save_dir, f"{prefix}_skill3.png"))

    # 5. ステータス切替タブ
    pyautogui.click(x=coords['⑤ ステータスを開くための右側タブ']['x'], y=coords['⑤ ステータスを開くための右側タブ']['y'])
    time.sleep(0.5)

    # 6. ステータスボタン
    pyautogui.click(x=coords['⑥ ステータスボタン（タブを開いた後に出る）']['x'], y=coords['⑥ ステータスボタン（タブを開いた後に出る）']['y'])
    time.sleep(0.5)
    pyautogui.screenshot(os.path.join(save_dir, f"{prefix}_status.png"))

    # 7. ステータス閉じるボタン
    pyautogui.click(x=coords['⑦ ステータス画面の閉じる(X)ボタン']['x'], y=coords['⑦ ステータス画面の閉じる(X)ボタン']['y'])
    time.sleep(0.5)

    # 8. 戻るボタン
    pyautogui.click(x=coords['⑧ 左上の戻る(キャラ選択に戻る)ボタン']['x'], y=coords['⑧ 左上の戻る(キャラ選択に戻る)ボタン']['y'])
    time.sleep(1.0) # キャラ選択画面に戻るまでのロード待ち

    print(f"[{hero_count}体目] 完了！キャラ選択画面に戻りました。\n")
    hero_count += 1
    time.sleep(0.5) # 重複入力を防ぐ
