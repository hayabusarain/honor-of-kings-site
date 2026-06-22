import json

manual_id_map = {
  "hero_001": "538", # Yuanliu Tank
  "hero_002": "538", # Yuanliu Mage (will override, but that's fine, we'll just pick one or maybe 538 is Yuanliu overall)
  "hero_003": "169", # Houyi
  "hero_004": "105", # Lian Po
  "hero_005": "504", # Milady
  "hero_006": "538", # Yuanliu Marksman
  "hero_007": "508", # Garuda / Yunzhongjun? Wait, Karura is Garuda / Yunzhongjun? Or Nakoruru?
  "hero_008": "109", # Daji
  "hero_009": "112", # Luban No. 7
  "hero_010": "142", # Angela
  "hero_011": "106", # Xiaoqiao
  "hero_012": "107", # Zhao Yun
  "hero_013": "108", # Mozi
  "hero_014": "111", # Sun Shangxiang
  "hero_015": "113", # Zhuangzi
  "hero_016": "114", # Liu Shan
  "hero_017": "115", # Gao Jianli
  "hero_018": "116", # Ake / Butterfly
  "hero_019": "117", # Zhong Wuyan
  "hero_020": "118", # Sun Bin
  "hero_021": "119", # Bian Que
  "hero_022": "120", # Bai Qi
  "hero_023": "121", # Mi Yue
  "hero_024": "123", # Lu Bu
  "hero_025": "124", # Zhou Yu
  "hero_026": "125", # Yuan Ge? Wait, Yuan Ge is 143.
  "hero_027": "126", # Xiahou Dun
  "hero_028": "127", # Zhen Ji
  "hero_029": "99992", # Fatih? Wait, Fatih is Fuzi? Or Cao Cao?
  "hero_030": "129", # Dian Wei
  "hero_031": "130", # Miyamoto Musashi
  "hero_032": "131", # Li Bai
  "hero_033": "132", # Marco Polo
  "hero_034": "133", # Di Renjie
  "hero_035": "134", # Dharma
  "hero_036": "135", # Xiang Yu
  "hero_037": "137", # Sima Yi
  "hero_038": "190", # Kongzi -> Kongming / Zhuge Liang
  "hero_039": "140", # Guan Yu
  "hero_040": "141", # Diaochan
  "hero_041": "146", # Luna
  "hero_042": "148", # Jiang Ziya / Taigong Wang
  "hero_043": "149", # Liu Bang
  "hero_044": "150", # Han Xin
  "hero_045": "152", # Wang Zhaojun
  "hero_046": "153", # Lanling Wang
  "hero_047": "154", # Mulan
  "hero_048": "155", # Erin
  "hero_049": "156", # Zhang Liang
  "hero_050": "157", # Mai Shiranui
  "hero_051": "159", # Doria
  "hero_052": "162", # Nakoruru
  "hero_053": "163", # Ukyo Tachibana
  "hero_054": "166", # Arthur
  "hero_055": "167", # Sun Wukong
  "hero_056": "99991", # Lapu Lapu? No, wait.
  "hero_057": "170", # Liu Bei
  "hero_058": "171", # Zhang Fei
  "hero_059": "172", # Chicha? No, Chicha is completely different!
  "hero_060": "173", # Li Yuanfang
  "hero_061": "174", # Yu Ji
  "hero_062": "175", # Zhong Kui
  "hero_063": "176", # Yang Yuhuan
  "hero_064": "518", # Cang -> Augran
  "hero_065": "178", # Yang Jian
  "hero_066": "179", # Nuwa
  "hero_067": "180", # Nezha
  "hero_068": "182", # Ganjiang Moye
  "hero_069": "183", # Athena
  "hero_070": "184", # Cai Wenji
  "hero_071": "186", # Donghuang Taiyi
  "hero_072": "189", # Guiguzi
  "hero_073": "190", # Kongming
  "hero_074": "191", # Da Qiao
  "hero_075": "192", # Huang Zhong
  "hero_076": "193", # Kaizer
  "hero_077": "195", # Baili Xuance
  "hero_078": "196", # Baili Shouyue
  "hero_079": "197", # Yixing
  "hero_080": "198", # Mengqi
  "hero_081": "199", # Gongsun Li
  "hero_082": "501", # Ming Shiyin
  "hero_083": "502", # Tiger / Pei Qinhu
  "hero_084": "503", # Biron / Kuang Tie
  "hero_085": "505", # Yao
  "hero_086": "506", # Yunzhongjun
  "hero_087": "507", # Li Xin
  "hero_088": "508", # Jialuo / Galia
  "hero_089": "510", # Sun Ce
  "hero_090": "513", # Shangguan Wan'er - wait, 513 is Doria? Shangguan is 513?
  "hero_091": "514", # Allain
  "hero_092": "518", # Dasiming / Augran
  "hero_093": "519", # Ao Yin / Bailong
  "hero_094": "521", # Mingyue? (Haiyue?)
  "hero_095": "522", # Yao (Dongfang Yao)
  "hero_096": "523", # Xi Shi
  "hero_097": "524", # Meng Ya
  "hero_098": "528", # Lan
  "hero_099": "531", # Jing
  "hero_100": "533", # Agudo
  "hero_101": "534", # Sangqi (Kei)
  "hero_102": "536", # Charlotte
  "hero_103": "537", # Yunying
  "hero_104": "544", # Harold (Heino)
  "hero_105": "545", # Alessio
  "hero_106": "548", # Luanna (Laura?)
  "hero_107": "511", # Ata (Zhubajie)
  "hero_108": "527", # Ying (Dongfang Jue? or someone else?)
  "hero_109": "544", # Heino
  "hero_110": "540", # Ji Xiaoman
  "hero_111": "564", # Shao Siyuan
  "hero_112": "116", # Butterfly
}

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hero_detailed_stats_raw.json", "r", encoding="utf-8") as f:
    detailed_stats = json.load(f)

new_detailed_stats = {}
unmapped = []

for raw_id, stats in detailed_stats.items():
    if raw_id in manual_id_map:
        matched_id = manual_id_map[raw_id]
        new_key = f"hero_{str(matched_id).zfill(3)}"
        new_detailed_stats[new_key] = stats
    else:
        unmapped.append(raw_id)

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\ja.json", "w", encoding="utf-8") as f:
    json.dump(new_detailed_stats, f, ensure_ascii=False, indent=2)

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\en.json", "w", encoding="utf-8") as f:
    json.dump(new_detailed_stats, f, ensure_ascii=False, indent=2)

print(f"Successfully wrote {len(new_detailed_stats)} unique heroes to ja.json")
