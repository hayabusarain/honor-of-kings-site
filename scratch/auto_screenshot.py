import os
import time
import subprocess
from datetime import datetime

# =====================================================
# 設定部分（一部座標はユーザーから取得済み）
# =====================================================
COORD_FIRST_CHAMP = (0, 0)    # 1. 一覧の「一番左上のチャンピオン」 (今回は手動で最初のキャラを開いた状態から始めるので使いません)
COORD_NEXT_CHAMP = (1517, 668)     # 2. 「次のチャンピオンへ」進む右矢印（＞）
COORD_CLOSE_POPUP = (636, 516)     # 3. スキルポップアップを閉じるための余白タップ位置
COORD_TABLE_BTN = (1519, 95)       # 4. レベル別詳細（三）ボタン
COORD_TEXT_BTN = (1446, 98)        # 5. テキスト詳細（T）ボタン

# 各スキルの座標 (パッシブ, スキル1, スキル2, スキル3, ウルト)
SKILL_COORDS = [
    (145, 506),
    (233, 506),
    (320, 506),
    (412, 502),
    (499, 499)
]

TOTAL_CHAMPIONS = 160         # 全チャンピオン数 (本番用)
ADB_PATH = r"C:\Program Files\BlueStacks_nxt\HD-adb.exe" # BlueStacks専用のADB

def adb_command(cmd):
    """ADBコマンドを実行する"""
    # 複数デバイスエラーを防ぐためにターゲットを明示し、エラーも表示させる
    full_cmd = f'"{ADB_PATH}" -s 127.0.0.1:5555 {cmd}'
    result = subprocess.run(full_cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ADB Error: {result.stderr.strip()} (Command: {cmd})")
    return result

def adb_tap(x, y):
    """指定した座標をタップする"""
    adb_command(f"shell input tap {x} {y}")
    time.sleep(1.0) # タップ後の待機時間

def adb_screenshot(filename):
    """スクリーンショットを撮影してPCに保存する"""
    # 一旦エミュレーター内に保存
    temp_path = f"/sdcard/{filename}"
    adb_command(f"shell screencap -p {temp_path}")
    
    # PCにプル（ダウンロード）
    save_dir = os.path.join(os.path.dirname(__file__), "screenshots")
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    local_path = os.path.join(save_dir, filename)
    adb_command(f"pull {temp_path} {local_path}")
    
    # エミュレーター内の画像を削除
    adb_command(f"shell rm {temp_path}")
    print(f"✅ Saved screenshot: {local_path}")

def main():
    print("🚀 ワイルドリフト全自動スクショスクレイピングを開始します...")
    
    # ADB接続確認
    print("▶ ADBに接続しています...")
    # "-s" 無しで単に connect コマンドを実行するための特別な呼び出し
    subprocess.run(f'"{ADB_PATH}" connect 127.0.0.1:5555', shell=True)
    time.sleep(1)
    
    # 1. 最初のチャンピオンを開く (ユーザーが手動で一覧を開いた状態からスタート)
    print("▶ 1人目のチャンピオンを開きます")
    adb_tap(*COORD_FIRST_CHAMP)
    time.sleep(2.0)
    
    # 全キャラループ
    for i in range(TOTAL_CHAMPIONS):
        champ_number = i + 1
        print(f"📸 {champ_number}人目のチャンピオンを撮影中...")
        
        # 5つのスキルを順番にタップしてスクショ
        skill_names = ["passive", "skill1", "skill2", "skill3", "ult"]
        for j, coord in enumerate(SKILL_COORDS):
            adb_tap(*coord)
            time.sleep(0.5) # スキル切り替えアニメーション待ち
            
            # まずテキスト状態を確実に開く(パッシブ以外も念のためTを押す)
            adb_tap(*COORD_TEXT_BTN)
            time.sleep(0.5)
            
            # テキスト版のスクショ
            filename_text = f"champ_{champ_number:03d}_{skill_names[j]}_text.png"
            adb_screenshot(filename_text)
            time.sleep(0.5)
            
            # パッシブスキル以外はレベル詳細(表)も撮影する
            if j > 0:
                # 表ボタン（三）を押す
                adb_tap(*COORD_TABLE_BTN)
                time.sleep(0.5)
                
                # 表版のスクショ
                filename_table = f"champ_{champ_number:03d}_{skill_names[j]}_table.png"
                adb_screenshot(filename_table)
                time.sleep(0.5)
        
        # ウルトのポップアップが出たままになっているので、余白をタップして閉じる
        print("▶ ポップアップを閉じます")
        adb_tap(*COORD_CLOSE_POPUP)
        time.sleep(1.0)
        
        # 次のキャラへ
        print("▶ 次のチャンピオンへ...")
        adb_tap(*COORD_NEXT_CHAMP)
        time.sleep(2.0) # 画面切り替えの待機

    print("🎉 全キャラクターの全スキル撮影が完了しました！")

if __name__ == "__main__":
    main()
