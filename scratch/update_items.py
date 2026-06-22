import os
import json

base_dir = r"c:\Users\81901\Desktop\ワイリフサイト"
output_dir = os.path.join(base_dir, "scratch", "extracted_items")

extracted_data = {
    "スクリーンショット (83)": {
        "item_name": "ラバドン デスキャップ",
        "gold": 3400,
        "stats": [
            "+100 魔力",
            "+7% 魔法防御貫通"
        ],
        "passives": [
            {
                "name": "オーバーキル",
                "description": "チャンピオンレベルに応じて魔力が20-45%増加する。"
            }
        ]
    },
    "スクリーンショット (89)": {
        "item_name": "アークエンジェル スタッフ",
        "gold": 2950,
        "stats": [
            "+35 魔力",
            "+7% 魔法防御貫通",
            "+500 最大マナ",
            "+20 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "畏怖",
                "description": "最大マナの1%にあたる魔力を獲得し、マナを消費するとその25%分のマナを回復する。"
            },
            {
                "name": "マナチャージ",
                "description": "マナを消費するたびに最大マナが18増加する。マナ増加が上限の700に達すると、「アークエンジェル スタッフ」を「セラフ エンブレイス」に変化させる。10秒間に最大3回まで発動する。"
            }
        ]
    },
    "スクリーンショット (95)": {
        "item_name": "バンシー ヴェール",
        "gold": 3000,
        "stats": [
            "+60 魔力",
            "+7% 魔法防御貫通",
            "+200 最大マナ",
            "+20 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "セーフガード",
                "description": "次に敵から受けるスキルをブロックするスペルシールドを獲得する。シールドが破壊されてから1秒間、受けるダメージを40%軽減する(クールダウン40秒)。"
            },
            {
                "name": "冷静",
                "description": "セーフガード中は魔力が20増加する。\n発動スキルを使って敵チャンピオンに魔法ダメージを与えるとセーフガードのクールダウンが4秒短縮される"
            }
        ]
    },
    "スクリーンショット (101)": {
        "item_name": "オセアヌス トライデント",
        "gold": 2600,
        "stats": [
            "+200 最大体力",
            "+75 魔力",
            "+7% 魔法防御貫通"
        ],
        "passives": [
            {
                "name": "リーサルウェポン",
                "description": "敵チャンピオンにスキルダメージを与えると3秒間、対象が獲得するあらゆるシールドの耐久値を低下させる。範囲スキルは(魔力の5% + 25)%(上限45%)、単体対象スキルは(魔力の5% + 40)%(上限60%)低下させる。「リーサルウェポン」の影響を受けていない敵にダメージを与えると、対象 of あらゆるシールドの耐久値を同じ値だけ低下させる。"
            }
        ]
    },
    "スクリーンショット (107)": {
        "item_name": "マリグナンス",
        "gold": 2900,
        "stats": [
            "+80 魔力",
            "+7% 魔法防御貫通",
            "+400 最大マナ",
            "+20 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "嘲り",
                "description": "アルティメットスキルのスキルヘイストが20増加する。"
            },
            {
                "name": "憎悪の霧",
                "description": "アルティメットスキルでチャンピオンにダメージを与えると、3秒間、その下の地面が燃えて対象に毎秒60 + 5%の魔法ダメージを与え、対象の魔法防御を10低下させる。炎上の効果範囲はダメージに応じて増加し、800ダメージ..."
            }
        ]
    },
    "スクリーンショット (113)": {
        "item_name": "エーテル ウィスプ",
        "gold": 950,
        "stats": [
            "+35 魔力"
        ],
        "passives": [
            {
                "name": "ウィスプ",
                "description": "移動速度 +5%"
            }
        ]
    },
    "スクリーンショット (119)": {
        "item_name": "久遠のカタリスト",
        "gold": 1100,
        "stats": [
            "+200 最大体力",
            "+300 最大マナ"
        ],
        "passives": [
            {
                "name": "久遠",
                "description": "敵チャンピオンから受けたダメージの15%にあたるマナを回復する。消費したマナの20%にあたる体力を回復する。1回の使用につき15体力が上限。"
            }
        ]
    },
    "スクリーンショット (125)": {
        "item_name": "ナッシャー タロン",
        "gold": 800,
        "stats": [],
        "passives": [
            {
                "name": "魔法の針",
                "description": "攻撃力が15または魔力が30増加する(アダプティブ)"
            }
        ]
    },
    "スクリーンショット (182)": {
        "item_name": "波打つ鱗",
        "gold": 1300,
        "stats": [
            "+40 物理防御"
        ],
        "passives": [
            {
                "name": "活性化",
                "description": "敵チャンピオンと戦闘中はスロウ耐性が20%増加する。"
            }
        ]
    },
    "スクリーンショット (188)": {
        "item_name": "実験的ヘクスプレート",
        "gold": 3000,
        "stats": [
            "+400 最大体力",
            "+35 攻撃力",
            "+20% 攻撃速度"
        ],
        "passives": [
            {
                "name": "ヘクスチャージ",
                "description": "アルティメットスキルのスキルヘイストが20増加する。"
            },
            {
                "name": "オーバードライブ",
                "description": "アルティメットスキル使用後8秒間、攻撃速度が40%(遠隔チャンピオンは20%)、移動速度が20%(遠隔チャンピオンは10%)増加する(クールダウン30秒)。"
            }
        ]
    },
    "スクリーンショット (194)": {
        "item_name": "ガーディアン エンジェル",
        "gold": 3400,
        "stats": [
            "+40 攻撃力",
            "+40 物理防御"
        ],
        "passives": [
            {
                "name": "蘇生",
                "description": "体力がゼロになった際、対象指定不可の状態でその場に倒れて4秒間静止した後に、基本体力の50%と最大マナの30%を回復して復活する。(クールダウン210秒)"
            }
        ]
    },
    "スクリーンショット (200)": {
        "item_name": "ステラックの篭手",
        "gold": 3200,
        "stats": [
            "+400 最大体力"
        ],
        "passives": [
            {
                "name": "ヘビーハンド",
                "description": "基本攻撃力の50%を増加攻撃力として獲得。"
            },
            {
                "name": "ライフライン",
                "description": "自分の体力が35%未満になるダメージを受けると、75%増加体力の耐久値を持つシールドを獲得する。このシールドは5秒かけて減衰する。(クールダウン90秒)"
            },
            {
                "name": "ステラックの憤怒",
                "description": "「ライフライン」が発動すると自分のサイズが増加して8秒間行動妨害耐性30%を獲得する。"
            }
        ]
    },
    "スクリーンショット (206)": {
        "item_name": "三相の力",
        "gold": 3333,
        "stats": [
            "+333 最大体力",
            "+30 攻撃力",
            "+30% 攻撃速度",
            "+20 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "熱情",
                "description": "移動速度 +5%。"
            },
            {
                "name": "勇猛",
                "description": "通常攻撃が命中すると、2秒間、移動速度が20増加する。増加した移動速度はスタックしない。遠隔攻撃チャンピオンは効果量が半減する。"
            },
            {
                "name": "追撃",
                "description": "スキル使用後10秒以内に行う次の通常攻撃が基本攻撃力の200%にあたる追加物理ダメージを与える。(クールダウン1.5秒)\n建造物に対してはダメージが減少する。"
            }
        ]
    },
    "スクリーンショット (212)": {
        "item_name": "ファントム ダンサー",
        "gold": 2900,
        "stats": [
            "+20 攻撃力",
            "+25% クリティカル率",
            "+40% 攻撃速度"
        ],
        "passives": [
            {
                "name": "俊足",
                "description": "移動速度が5%増加する。"
            },
            {
                "name": "幽霊のワルツ",
                "description": "通常攻撃時効果で6秒間、通常攻撃の攻撃速度が25%、移動速度が7%増加する。ボーナスはスタックしない(クールダウン10秒、通常攻撃が敵に命中すると1秒短縮)。"
            }
        ]
    },
    "スクリーンショット (218)": {
        "item_name": "ナヴォリ クイックブレード",
        "gold": 2800,
        "stats": [
            "+25% クリティカル率",
            "+45% 攻撃速度",
            "+5% 移動速度"
        ],
        "passives": [
            {
                "name": "巧みな一撃",
                "description": "通常攻撃を行うと、通常スキルの残りクールダウンが15%短縮される。"
            }
        ]
    },
    "スクリーンショット (224)": {
        "item_name": "ケミパンク チェーンソード",
        "gold": 2800,
        "stats": [
            "+250 最大体力",
            "+45 攻撃力",
            "+15 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "懲罰",
                "description": "敵チャンピオンに物理ダメージを与えると、3秒間50%の「重傷」を付与する。"
            }
        ]
    },
    "スクリーンショット (230)": {
        "item_name": "ブラック クリーバー",
        "gold": 3000,
        "stats": [
            "+400 最大体力",
            "+40 攻撃力",
            "+20 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "切断",
                "description": "チャンピオンに物理ダメージを与えると、その対象の物理防御を6秒間、6%低下させる。4スタックで24%低下させる。"
            },
            {
                "name": "追跡",
                "description": "敵に物理ダメージを与えると移動速度が20増加する。「切断」を4スタック付与した敵チャンピオンに向かって移動すると移動速度が40増加する。遠隔攻撃チャンピオンは数値が半減する。"
            }
        ]
    },
    "スクリーンショット (236)": {
        "item_name": "女神の涙",
        "gold": 900,
        "stats": [
            "+300 最大マナ",
            "+10 スキルヘイスト"
        ],
        "passives": [
            {
                "name": "畏怖",
                "description": "マナを消費すると、その10%分のマナが回復する。"
            },
            {
                "name": "マナチャージ",
                "description": "マナを消費するたびに最大マナが7増加する。増加マナは700が上限。10秒間に最大3回まで発動する。「女神の涙」アイテムは同時に1つしか所持できない。"
            }
        ]
    },
    "スクリーンショット (242)": {
        "item_name": "ナッシャー タロン",
        "gold": 800,
        "stats": [],
        "passives": [
            {
                "name": "魔法の針",
                "description": "攻撃力が15または魔力が30増加する(アダプティブ)"
            }
        ]
    },
    "スクリーンショット (248)": {
        "item_name": "エクスキューショナー コーリング",
        "gold": 800,
        "stats": [
            "+15 攻撃力"
        ],
        "passives": [
            {
                "name": "強打",
                "description": "敵チャンピオンに物理ダメージを与えると、3秒間40%の「重傷」を付与する。"
            }
        ]
    },
    "スクリーンショット (254)": {
        "item_name": "ジャウリム フィスト",
        "gold": 1200,
        "stats": [
            "+200 最大体力",
            "+15 攻撃力"
        ],
        "passives": []
    },
    "スクリーンショット 2026-05-31 015721": {
        "item_name": "セレイテッド ダーク",
        "gold": 800,
        "stats": [
            "+20 攻撃力"
        ],
        "passives": [
            {
                "name": "尖鋭",
                "description": "物理防御貫通 +8。"
            }
        ]
    }
}

for filename_key, new_data in extracted_data.items():
    filename = f"{filename_key}.json"
    file_path = os.path.join(output_dir, filename)
    
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            existing_data = {}
            
        # Merge gold. Keep existing fields if they exist and match, but update with new OCR details if needed.
        # However, the user said "ファイルが既に存在する場合は、gold フィールドを追加・修正して上書き（またはマージ）してください。"
        # We will merge by updating the existing dict with new_data, ensuring gold is added/updated.
        existing_data["gold"] = new_data["gold"]
        
        # If existing has other details but missing something, merge them.
        # We can update other fields if they are missing or empty in existing.
        for k, v in new_data.items():
            if k not in existing_data or not existing_data[k]:
                existing_data[k] = v
            elif k == "passives" and len(existing_data["passives"]) == len(new_data["passives"]):
                # If passives length matches, let's make sure the content is optimal (use the more descriptive one or keep existing)
                pass
                
        final_data = existing_data
        print(f"Merged gold into existing file: {filename}")
    else:
        final_data = new_data
        print(f"Created new file: {filename}")
        
    # Write back
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

print("Done processing all items.")
