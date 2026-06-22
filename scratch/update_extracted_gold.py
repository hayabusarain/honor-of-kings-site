import os
import json

# Gold price mapping for the screenshots
gold_mapping = {
    81: 2800,  # ロッド オブ エイジス
    82: 2800,  # ロッド オブ エイジス
    83: 2800,  # ロッド オブ エイジス
    84: 2800,  # ロッド オブ エイジス
    85: 2800,  # ロッド オブ エイジス
    86: 2800,  # ロッド オブ エイジス
    87: 2800,  # ロッド オブ エイジス
    88: 2800,  # リッチ ベイン
    89: 2950,  # アークエンジェル スタッフ
    90: 2950,  # セラフ エンブレイス
    91: 2950,  # セラフ エンブレイス
    92: 2800,  # ナッシャー トゥース
    93: 2900,  # インフィニティ オーブ
    94: 2900,  # インフィニティ オーブ
    95: 3000,  # バンシー クラウン
    96: 3000,  # バンシー クラウン
    97: 2800,  # コズミック ドライブ
    98: 2800,  # コズミック ドライブ
    99: 3200,  # リフトメーカー
}

directory = r"C:\Users\81901\Desktop\ワイリフサイト\scratch\extracted_items"

for num, gold in gold_mapping.items():
    filename = f"スクリーンショット ({num}).json"
    filepath = os.path.join(directory, filename)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Update gold field
            data['gold'] = gold
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {filename} with gold: {gold}")
        except Exception as e:
            print(f"Error updating {filename}: {e}")
    else:
        print(f"File not found: {filename}")
