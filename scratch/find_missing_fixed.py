import json
with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

expected_heroes = [
    "Yuanliu Child (Tank)", "Yuanliu Child (Mage)", "Yuanliu Child (Marksman)", "Hou Yi", "Lian Po", "Milady", "Garo", "Daji", "Luban No.7", "Angela",
    "Xiao Qiao", "Zhao Yun", "Mozi", "Sun Shangxiang", "Zhuangzi", "Liu Shan", "Gao Jianli", "A Ke", "Zhong Wuyan", "Sun Bin",
    "Bai Qi", "Miyue", "Lu Bu", "Zhou Yu", "Xiahou Dun", "Zhen Ji", "Cao Cao", "Dian Wei", "Diaochan", "Fuzi",
    "Xiang Yu", "Guan Yu", "Consort Yu", "Han Xin", "Wang Zhaojun", "Lanling King", "Hua Mulan", "Zhang Fei", "Liu Bei", "Zhong Kui",
    "Li Bai", "Nezha", "Cheng Yaojin", "Zhang Liang", "Mai Shiranui", "Tachibana Ukyo", "Nakoruru", "Genghis Khan", "Yang Jian", "Nuwa",
    "Donghuang Taiyi", "Taiyi Zhenren", "Gan Jiang Mo Ye", "Guiguzi", "Ying Zheng", "Arthur", "Wukong", "Lumburr", "Marco Polo", "Mulan",
    "Kai", "Baili Shouyue", "Baili Xuance", "Su Lie", "Meng Qi", "Gongsun Li", "Yang Yuhuan", "Pei Qinhu", "Yi Xing", "Kuang Tie",
    "Yuan Ge", "Sun Ce", "Sima Yi", "Shen Mengxi", "Li Xin", "Shangguan Wan'er", "Zhu Bajie", "Chang'e", "Pan Gu",
    "Yao", "Yun Zhong Jun", "Dongfang Yao", "Ma Chao", "Xi Shi", "Lu Ban Da Shi", "Meng Ya", "Jing", "Agudo", "Charlotte",
    "Lan", "Si Kong Zhen", "Yun Ying", "Jin Chan", "Zhan Jiang", "Ge Ya", "Hai Yue", "Zhao Hua", "Yaria", "Heino", "Doria", "Da Qiao",
    "Fuzi", "Cai Wenji", "Gongsun Li", "Ming Shiyin", "Pei Qinhu", "Kuang Tie", "Yuan Ge", "Sun Ce", "Sima Yi", "Shen Mengxi",
    "Li Xin", "Shangguan Wan'er", "Zhu Bajie", "Chang'e", "Pan Gu", "Yao", "Yunzhongjun", "Dongfang Yao", "Ma Chao", "Xi Shi"
]

current_en_names = [h.get('name_en', '') for h in data]

missing_from_site = sorted(list(set([h for h in expected_heroes if h not in current_en_names])))
with open('scratch/missing_en_fixed.txt', 'w', encoding='utf-8') as out:
    out.write("\n".join(missing_from_site))
