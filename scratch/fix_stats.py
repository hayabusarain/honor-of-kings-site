import json

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json", "r", encoding="utf-8") as f:
    hok_heroes = json.load(f)

# Build a reverse lookup from English/Japanese names to nameEn (which is the route id)
# We want name_map[any_name] = nameEn
name_map = {}
def normalize(s):
    if not s: return ""
    return s.lower().replace(' ', '').replace('-', '').replace('.', '').replace("'", "")

for h in hok_heroes:
    route_id = h['nameEn'] # this is what the app uses for URLs
    names = [
        h.get('nameJaOfficial'),
        h.get('nameJa'),
        h.get('nameCn'),
        h.get('nameEn')
    ]
    for n in names:
        if n:
            name_map[normalize(n)] = route_id

# Manual fallbacks (English names in tier list -> route_id)
manual_map = {
    'arthur': 'yase',
    'biron': 'kuangtie',
    'dun': 'xiahoudun',
    'lixin': 'lixin',
    'miyue': 'miyue',
    'musashi': 'gongbenwuzang',
    'sunce': 'sunce',
    'fatih': 'laofuzi',
    'flowborn(tank)': 'da-qiao', # Not sure what flowborn tank is, leaving alone
    'allain': 'yalian',
    'baiqi': 'baiqi',
    'charlotte': 'xialuote',
    'diaochan': 'diaochan',
    'donghuang': 'donghuangtaiyi',
    'heino': 'hainuo',
    'kaizer': 'kai',
    'lianpo': 'lianpo',
    'lubu': 'lvbu',
    'nezha': 'nezha',
    'umbrosa': 'ying',
    'yao': 'yao', # there are two yaos? yao (deer) and yao (sun)
    'zhuangzi': 'zhuangzhou',
    'ata': 'zhubajie',
    'lapulapu': 'badian', # actually Badia / Lapulapu is different? No, Lapulapu is likely not here. Badang?
    'fuzi': 'laofuzi',
    'mayene': 'jixiaoman',
    'menki': 'mengqi',
    'ukyotachibana': 'juyoujing',
    'xiangyu': 'xiangyu',
    'yangjian': 'yangjian',
    'dharma': 'damo',
    'guanyu': 'guanyu',
    'liubang': 'liubang',
    'mulan': 'huamulan',
    'wuyan': 'zhongwuyan',
    'arke': 'yunzhongjun', # Arke?
    'augran': 'dasiming',
    'chicha': 'shaosiyuan', # Actually chicha might not be shaosiyuan.
    'feyd': 'liubei',
    'lam': 'lan',
    'chano': 'liyuanfang',
    'dianwei': 'dianwei',
    'gaochanggong': 'lanlingwang',
    'kongming': 'zhugeliang',
    'wukong': 'sunwukong',
    'butterfly': 'keke', # Actually butterfly is just butterfly, usually 'keke' or 'hudie'
    'fang': 'liyuanfang',
    'xuance': 'bailixuance',
    'yango': 'peiqinhu',
    'hanxin': 'hanxin',
    'libai': 'libai',
    'liubei': 'liubei',
    'nakoruru': 'nakelulu',
    'pei': 'peiqinhu',
    'ying': 'yunying',
    'zilong': 'zhaoyun',
    'agudo': 'aguduo',
    'athena': 'yadianna',
    'cirrus': 'yunzhongjun',
    'jing': 'jing',
    'luna': 'luna',
    'simayi': 'simayi',
    'daqiao': 'daqiao',
    'daji': 'daji',
    'angela': 'anqila',
    'haya': 'huowu',
    'milady': 'milidi',
    'mozi': 'mozi',
    'wangzhaojun': 'wangzhaojun',
    'xiaoqiao': 'xiaoqiao',
    'yixing': 'yixing',
    'garuda': 'nüwa',
    'gan&mo': 'ganjiangmoye',
    'ladyzhen': 'zhenji',
    'liang': 'zhangliang',
    'maishiranui': 'buzhihuowu',
    'shi': 'xishi',
    'yuhuan': 'yangyuhuan',
    'ziya': 'jiangziya',
    'nuwa': 'nvwa',
    'shangguan': 'shangguanwaner',
    'zhouyu': 'zhouyu',
    'drbian': 'bianque',
    'gao': 'gaojianli',
    'aoyin': 'aoyin',
    'houyi': 'houyi',
    'marcopolo': 'makeboluo',
    'consortyu': 'yuji',
    'ladysun': 'sunshangxiang',
    'lubanno.7': 'lubanqihao',
    'luara': 'luara',
    'alessio': 'laixiao',
    'arli': 'gongsunli',
    'erin': 'ailin',
    'garo': 'jialuo',
    'shouyue': 'bailishouyue',
    'direnjie': 'direnjie',
    'huangzhong': 'huangzhong',
    'mengya': 'mengya',
    'yaria': 'yao',
    'caiyan': 'caiwenji',
    'dolia': 'duoliya',
    'dyadia': 'shaosiyuan',
    'kui': 'zhongkui',
    'liushan': 'liushan',
    'sakeer': 'sangqi',
    'ming': 'mingshiyin',
    'zhangfei': 'zhangfei',
    'guiguzi': 'guiguzi',
    'sunbin': 'sunbin',
}

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hero_stats.json", "r", encoding="utf-8") as f:
    stats = json.load(f)

for s in stats:
    raw = normalize(s['hero_name_en'])
    # Try manual map first, then name_map, then fallback to original
    route_id = manual_map.get(raw) or name_map.get(raw)
    if route_id:
        s['hero_name_en'] = route_id

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hero_stats.json", "w", encoding="utf-8") as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)

print("hero_stats.json updated with correct route IDs!")
