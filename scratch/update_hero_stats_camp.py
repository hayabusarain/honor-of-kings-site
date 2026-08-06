import json

# User payload data
user_payload = {
    "code": 0,
    "msg": "Success",
    "data": {
        "filter": {
            "branchFilter": [],
            "tabFilter": [],
            "eventList": []
        },
        "title": "ヒーロー|heroInfo,Tier|tRank,勝率|winRate,出現率|showRate,バトル禁止|banRate",
        "updateTime": "20260731",
        "sortField": 0,
        "sortType": 0,
        "list": [
            {
                "heroId": 507,
                "banRate": 0.03933,
                "showRate": 0.0257,
                "winRate": 0.5387345,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 507,
                    "heroName": "李信",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/mWSBbpVr.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/JTriceYO.jpg"
                },
                "position": 0
            },
            {
                "heroId": 109,
                "banRate": 0.02975,
                "showRate": 0.0249,
                "winRate": 0.514334,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 109,
                    "heroName": "妲己",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/dYxuS6IA.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/ZykGnmmQ.jpg"
                },
                "position": 1
            },
            {
                "heroId": 517,
                "banRate": 0.048699997,
                "showRate": 0.014900001,
                "winRate": 0.49820033,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 517,
                    "heroName": "大司命",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/ue6KY05b.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/YqcFJ41J.jpg"
                },
                "position": 3
            },
            {
                "heroId": 142,
                "banRate": 0.023260001,
                "showRate": 0.025099998,
                "winRate": 0.5175559,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 142,
                    "heroName": "アンジェラ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/wjaExUFU.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/izLCVkoR.jpg"
                },
                "position": 1
            },
            {
                "heroId": 519,
                "banRate": 0.028670002,
                "showRate": 0.0177,
                "winRate": 0.47804865,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 519,
                    "heroName": "白龍",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/OzH2TSZN.jpg",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/UZ5YiCXf.jpg"
                },
                "position": 2
            },
            {
                "heroId": 631,
                "banRate": 0.052759998,
                "showRate": 0.005,
                "winRate": 0.5174495,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 631,
                    "heroName": "フロレンティーノ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/skJXGWLF.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/VF7hX3Fj.jpg"
                },
                "position": 0
            },
            {
                "heroId": 156,
                "banRate": 0.04353,
                "showRate": 0.0075999997,
                "winRate": 0.5012374,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 156,
                    "heroName": "張良",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/cNugkXGO.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/fdFhQKXR.jpg"
                },
                "position": 1
            },
            {
                "heroId": 169,
                "banRate": 0.00152,
                "showRate": 0.0285,
                "winRate": 0.49955,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 169,
                    "heroName": "后羿",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/S5isJokI.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/F6qt6L7k.jpg"
                },
                "position": 2
            },
            {
                "heroId": 504,
                "banRate": 0.01527,
                "showRate": 0.0192,
                "winRate": 0.48180747,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 504,
                    "heroName": "ミレディ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/orlOit3f.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/IJ9g10Xb.jpg"
                },
                "position": 1
            },
            {
                "heroId": 152,
                "banRate": 0.00533,
                "showRate": 0.020100001,
                "winRate": 0.5119352,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 152,
                    "heroName": "王昭君",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/lhZtGJlg.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/WLZjhplG.jpg"
                },
                "position": 1
            },
            {
                "heroId": 112,
                "banRate": 0.00239,
                "showRate": 0.0207,
                "winRate": 0.5136826,
                "tRank": 0,
                "heroInfo": {
                    "heroId": 112,
                    "heroName": "魯班7号",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/0VBMiUN5.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/W4zZnmCS.jpg"
                },
                "position": 2
            },
            {
                "heroId": 184,
                "banRate": 0.01703,
                "showRate": 0.012399999,
                "winRate": 0.5044946,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 184,
                    "heroName": "蔡文姫",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/kQXkW7ab.png",
                    "heroCareer": "サポート",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/OBQuO6qy.jpg"
                },
                "position": 4
            },
            {
                "heroId": 521,
                "banRate": 0.020200001,
                "showRate": 0.0097,
                "winRate": 0.4913758,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 521,
                    "heroName": "溟月",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/iIdXNhQ5.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/sGIzRFXF.jpg"
                },
                "position": 1
            },
            {
                "heroId": 126,
                "banRate": 0.00406,
                "showRate": 0.0172,
                "winRate": 0.5309922,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 126,
                    "heroName": "夏侯惇",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/23rrkYYy.png",
                    "heroCareer": "タンク/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/FNYwEHVp.jpg"
                },
                "position": 0
            },
            {
                "heroId": 132,
                "banRate": 0.00262,
                "showRate": 0.017900001,
                "winRate": 0.49304503,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 132,
                    "heroName": "マルコ・ポーロ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/48d8GxkP.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/QiHtTgGt.jpg"
                },
                "position": 2
            },
            {
                "heroId": 159,
                "banRate": 0.00429,
                "showRate": 0.017,
                "winRate": 0.45900607,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 159,
                    "heroName": "ドリア",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/tfvb3IJf.png",
                    "heroCareer": "サポート",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/8qorhn89.jpg"
                },
                "position": 4
            },
            {
                "heroId": 108,
                "banRate": 0.00902,
                "showRate": 0.0145,
                "winRate": 0.49371478,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 108,
                    "heroName": "墨子",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/Za4OlJ6t.png",
                    "heroCareer": "メイジ/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Zd3zwNba.jpg"
                },
                "position": 1
            },
            {
                "heroId": 155,
                "banRate": 0.00187,
                "showRate": 0.017900001,
                "winRate": 0.5154148,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 155,
                    "heroName": "エリン",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/joVNQWhw.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/xt0c43KZ.jpg"
                },
                "position": 2
            },
            {
                "heroId": 172,
                "banRate": 0.0044799997,
                "showRate": 0.0156000005,
                "winRate": 0.509511,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 172,
                    "heroName": "チーシャ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/lkU98jAV.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/sfz2ijEz.jpg"
                },
                "position": 0
            },
            {
                "heroId": 106,
                "banRate": 0.00144,
                "showRate": 0.0168,
                "winRate": 0.48566595,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 106,
                    "heroName": "小喬",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/paTVVlNq.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/zcwILxiZ.jpg"
                },
                "position": 1
            },
            {
                "heroId": 187,
                "banRate": 0.0197,
                "showRate": 0.0075000003,
                "winRate": 0.48588288,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 187,
                    "heroName": "東皇太一",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/PRcq49iS.png",
                    "heroCareer": "サポート/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/lEyx6O3p.jpg"
                },
                "position": 4
            },
            {
                "heroId": 174,
                "banRate": 0.0019400001,
                "showRate": 0.015800001,
                "winRate": 0.51584524,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 174,
                    "heroName": "虞美人",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/Ku5RzFmQ.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/TqIPGNjr.jpg"
                },
                "position": 2
            },
            {
                "heroId": 635,
                "banRate": 0.02143,
                "showRate": 0.006,
                "winRate": 0.5128107,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 635,
                    "heroName": "ロリアン",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/UDiFFfId.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/u24NcxID.jpg"
                },
                "position": 1
            },
            {
                "heroId": 167,
                "banRate": 0.00362,
                "showRate": 0.014900001,
                "winRate": 0.5012374,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 167,
                    "heroName": "孫悟空",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/Go3mMeu4.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/QIVMI1Pj.jpg"
                },
                "position": 3
            },
            {
                "heroId": 505,
                "banRate": 0.01186,
                "showRate": 0.0104,
                "winRate": 0.48106822,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 505,
                    "heroName": "瑶",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/uHnzeJbu.png",
                    "heroCareer": "サポート",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/jCyFHGBK.jpg"
                },
                "position": 4
            },
            {
                "heroId": 111,
                "banRate": 0.00075,
                "showRate": 0.0156000005,
                "winRate": 0.48383263,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 111,
                    "heroName": "孫尚香",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/BmY46Zgb.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Spp0Zwej.jpg"
                },
                "position": 2
            },
            {
                "heroId": 193,
                "banRate": 0.0014000001,
                "showRate": 0.015199999,
                "winRate": 0.5066203,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 193,
                    "heroName": "カイザー",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/xUdtJiLO.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/MUNGLxW8.jpg"
                },
                "position": 0
            },
            {
                "heroId": 508,
                "banRate": 0.00258,
                "showRate": 0.0139,
                "winRate": 0.5377354,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 508,
                    "heroName": "伽羅",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/g0jHNDf6.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Lfx9VhTp.jpg"
                },
                "position": 2
            },
            {
                "heroId": 547,
                "banRate": 0.00131,
                "showRate": 0.0145,
                "winRate": 0.53136444,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 547,
                    "heroName": "ルアンナ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/znRnu3kt.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/I04GXrAz.jpg"
                },
                "position": 2
            },
            {
                "heroId": 166,
                "banRate": 0.00115,
                "showRate": 0.0142,
                "winRate": 0.4955054,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 166,
                    "heroName": "アーサー",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/YTBrsBIg.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/amfNYinj.jpg"
                },
                "position": 0
            },
            {
                "heroId": 179,
                "banRate": 0.00624,
                "showRate": 0.0114,
                "winRate": 0.53274363,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 179,
                    "heroName": "女媧",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/E39kxNsD.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/m2oCcjm4.jpg"
                },
                "position": 1
            },
            {
                "heroId": 190,
                "banRate": 0.0021199998,
                "showRate": 0.0132,
                "winRate": 0.4987626,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 190,
                    "heroName": "孔明",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/XDnXeq3x.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/bMrvtoIE.jpg"
                },
                "position": 1
            },
            {
                "heroId": 528,
                "banRate": 0.00466,
                "showRate": 0.0118,
                "winRate": 0.48308343,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 528,
                    "heroName": "瀾",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/02i6M2YK.png",
                    "heroCareer": "アサシン/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/xLDNlCY8.jpg"
                },
                "position": 3
            },
            {
                "heroId": 537,
                "banRate": 0.00323,
                "showRate": 0.0125,
                "winRate": 0.48577437,
                "tRank": 1,
                "heroInfo": {
                    "heroId": 537,
                    "heroName": "デーヴァラ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/default/MagzAk8i.png",
                    "heroCareer": "ファイター/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/default/bAO1cYJ5.jpg"
                },
                "position": 0
            },
            {
                "heroId": 577,
                "banRate": 0.00827,
                "showRate": 0.0097,
                "winRate": 0.4799145,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 577,
                    "heroName": "少司縁",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/Qdvu6qgO.png",
                    "heroCareer": "サポート/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/aduptfKy.jpg"
                },
                "position": 4
            },
            {
                "heroId": 121,
                "banRate": 0.00798,
                "showRate": 0.0089,
                "winRate": 0.51116633,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 121,
                    "heroName": "ミーユエ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/eHvcCJb0.png",
                    "heroCareer": "メイジ/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/pEygZQ9Z.jpg"
                },
                "position": 0
            },
            {
                "heroId": 129,
                "banRate": 0.00311,
                "showRate": 0.0109,
                "winRate": 0.518721,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 129,
                    "heroName": "典韋",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/y6IMFSlI.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/7TA19KxF.jpg"
                },
                "position": 3
            },
            {
                "heroId": 105,
                "banRate": 0.00137,
                "showRate": 0.0117,
                "winRate": 0.52439326,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 105,
                    "heroName": "廉頗",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/csLOp1dL.png",
                    "heroCareer": "タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Ex2aJZvB.jpg"
                },
                "position": 0
            },
            {
                "heroId": 113,
                "banRate": 0.00981,
                "showRate": 0.0067000003,
                "winRate": 0.48872364,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 113,
                    "heroName": "荘子",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/UZC54GWu.png",
                    "heroCareer": "サポート/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/uVQvGtpv.jpg"
                },
                "position": 4
            },
            {
                "heroId": 123,
                "banRate": 0.00147,
                "showRate": 0.0107,
                "winRate": 0.4875172,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 123,
                    "heroName": "呂布",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/dXLF2kE7.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/WbDySARi.jpg"
                },
                "position": 0
            },
            {
                "heroId": 130,
                "banRate": 0.00173,
                "showRate": 0.0098,
                "winRate": 0.50011253,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 130,
                    "heroName": "宮本武蔵",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/jgvSlz3u.png",
                    "heroCareer": "ファイター/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/vPYOOxP5.jpg"
                },
                "position": 3
            },
            {
                "heroId": 175,
                "banRate": 0.00369,
                "showRate": 0.0087,
                "winRate": 0.49910003,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 175,
                    "heroName": "鐘馗",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/wRGzV266.png",
                    "heroCareer": "サポート/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Vvtmn5Ne.jpg"
                },
                "position": 4
            },
            {
                "heroId": 584,
                "banRate": 0.00049,
                "showRate": 0.010199999,
                "winRate": 0.5174495,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 584,
                    "heroName": "元流の子（マークスマン）",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/WuG07My1.jpeg",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/SEhYI41B.jpg"
                },
                "position": 2
            },
            {
                "heroId": 191,
                "banRate": 0.00386,
                "showRate": 0.0084,
                "winRate": 0.48905376,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 191,
                    "heroName": "大喬",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/IEPtzR5z.png",
                    "heroCareer": "サポート/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/0yjyCa1W.jpg"
                },
                "position": 4
            },
            {
                "heroId": 171,
                "banRate": 0.00227,
                "showRate": 0.009000001,
                "winRate": 0.4837254,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 171,
                    "heroName": "張飛",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/w0QS7N1L.png",
                    "heroCareer": "サポート/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/jeOWLTy0.jpg"
                },
                "position": 4
            },
            {
                "heroId": 545,
                "banRate": 0.00033,
                "showRate": 0.0096,
                "winRate": 0.52018994,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 545,
                    "heroName": "アレッシオ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/nnafEHV0.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/sLENRyQJ.jpg"
                },
                "position": 2
            },
            {
                "heroId": 127,
                "banRate": 0.00035000002,
                "showRate": 0.0094,
                "winRate": 0.50213695,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 127,
                    "heroName": "甄姫",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/gqPEOybC.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/M7R2duVl.jpg"
                },
                "position": 1
            },
            {
                "heroId": 107,
                "banRate": 0.00033,
                "showRate": 0.009099999,
                "winRate": 0.5186154,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 107,
                    "heroName": "趙雲",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/9xqbsAQC.png",
                    "heroCareer": "ファイター/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/xUSaF8jZ.jpg"
                },
                "position": 3
            },
            {
                "heroId": 114,
                "banRate": 0.00098,
                "showRate": 0.0087,
                "winRate": 0.49707648,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 114,
                    "heroName": "劉禅",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/i8WMjP6d.png",
                    "heroCareer": "サポート/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/oMH9g4NU.jpg"
                },
                "position": 4
            },
            {
                "heroId": 196,
                "banRate": 0.00096000003,
                "showRate": 0.0087,
                "winRate": 0.5012374,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 196,
                    "heroName": "百里守約",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/4bUKKH66.png",
                    "heroCareer": "マークスマン/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Cyg0kdSd.jpg"
                },
                "position": 2
            },
            {
                "heroId": 173,
                "banRate": 0.00033,
                "showRate": 0.009000001,
                "winRate": 0.50213695,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 173,
                    "heroName": "李元芳",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/6dGNjKTe.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/SkVL7iz6.jpg"
                },
                "position": 2
            },
            {
                "heroId": 116,
                "banRate": 0.007,
                "showRate": 0.0053,
                "winRate": 0.5134649,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 116,
                    "heroName": "阿軻",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/IUMPYUy4.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/hERiaWpd.jpg"
                },
                "position": 3
            },
            {
                "heroId": 503,
                "banRate": 0.00073,
                "showRate": 0.0085,
                "winRate": 0.47282952,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 503,
                    "heroName": "バイロン",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/F3A0JkoT.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/6jvtUvQY.jpg"
                },
                "position": 0
            },
            {
                "heroId": 510,
                "banRate": 0.00033,
                "showRate": 0.0086,
                "winRate": 0.4854493,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 510,
                    "heroName": "孫策",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/Te1nmDGP.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/uUnbXnK9.jpg"
                },
                "position": 0
            },
            {
                "heroId": 133,
                "banRate": 0.00017,
                "showRate": 0.0084,
                "winRate": 0.5159527,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 133,
                    "heroName": "仁傑",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/XTSDAJkR.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/xIM3ebjC.jpg"
                },
                "position": 2
            },
            {
                "heroId": 563,
                "banRate": 0.00129,
                "showRate": 0.0077,
                "winRate": 0.47702459,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 563,
                    "heroName": "ハイノ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/YO6iwLAg.jpg",
                    "heroCareer": "メイジ/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/mTftREQF.jpg"
                },
                "position": 1
            },
            {
                "heroId": 153,
                "banRate": 0.00601,
                "showRate": 0.0052,
                "winRate": 0.49371478,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 153,
                    "heroName": "蘭陵王",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/hwk1ad6d.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/ocoIb1PU.jpg"
                },
                "position": 3
            },
            {
                "heroId": 110,
                "banRate": 0.0003,
                "showRate": 0.0077,
                "winRate": 0.5131381,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 110,
                    "heroName": "カルラ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/default/h6UHy1TN.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/default/2hPdkfbG.jpg"
                },
                "position": 1
            },
            {
                "heroId": 199,
                "banRate": 0.00248,
                "showRate": 0.0066,
                "winRate": 0.46466652,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 199,
                    "heroName": "公孫離",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/hF8AFVqh.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/ExRaPXMt.jpg"
                },
                "position": 2
            },
            {
                "heroId": 148,
                "banRate": 0.00069,
                "showRate": 0.0074,
                "winRate": 0.5037095,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 148,
                    "heroName": "太公望",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/km2HzQ71.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Zv8Vx9x6.jpg"
                },
                "position": 1
            },
            {
                "heroId": 135,
                "banRate": 0.00035000002,
                "showRate": 0.0072999997,
                "winRate": 0.50840205,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 135,
                    "heroName": "項羽",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/FLyy9J46.png",
                    "heroCareer": "タンク/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/lu0CZbns.jpg"
                },
                "position": 0
            },
            {
                "heroId": 538,
                "banRate": 0.00054000004,
                "showRate": 0.0071,
                "winRate": 0.533738,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 538,
                    "heroName": "ユンエイ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/diRuUQDV.png",
                    "heroCareer": "ファイター/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/6b0IrGYV.jpg"
                },
                "position": 3
            },
            {
                "heroId": 137,
                "banRate": 0.0013,
                "showRate": 0.0067000003,
                "winRate": 0.53154993,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 137,
                    "heroName": "司馬懿",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/sU3BsR6P.png",
                    "heroCareer": "アサシン/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/jmBX2Gi8.jpg"
                },
                "position": 3
            },
            {
                "heroId": 646,
                "banRate": 0.00092,
                "showRate": 0.0069,
                "winRate": 0.5182984,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 646,
                    "heroName": "バタフライ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/FPq2P4ew.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/yiAUErJL.jpg"
                },
                "position": 3
            },
            {
                "heroId": 523,
                "banRate": 0.00266,
                "showRate": 0.0059,
                "winRate": 0.5155225,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 523,
                    "heroName": "西施",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/MjBadKpJ.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Doxu6Oq3.jpg"
                },
                "position": 1
            },
            {
                "heroId": 536,
                "banRate": 0.00049,
                "showRate": 0.0069,
                "winRate": 0.4931566,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 536,
                    "heroName": "シャルロット",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/iIwO0Kwk.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/6oVEfw6S.jpg"
                },
                "position": 0
            },
            {
                "heroId": 177,
                "banRate": 0.00070000003,
                "showRate": 0.0066,
                "winRate": 0.5028112,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 177,
                    "heroName": "蒼",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/default/sJURXorM.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Ajn4d263.jpg"
                },
                "position": 2
            },
            {
                "heroId": 141,
                "banRate": 0.00075,
                "showRate": 0.0066,
                "winRate": 0.4817016,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 141,
                    "heroName": "貂蝉",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/qFBebEbk.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/tiAH3o12.jpg"
                },
                "position": 1
            },
            {
                "heroId": 157,
                "banRate": 0.0011,
                "showRate": 0.0063,
                "winRate": 0.48054257,
                "tRank": 2,
                "heroInfo": {
                    "heroId": 157,
                    "heroName": "不知火舞",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/4jaM0F19.png",
                    "heroCareer": "アサシン/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/1gYFx4kN.jpg"
                },
                "position": 1
            },
            {
                "heroId": 542,
                "banRate": 0.0017200001,
                "showRate": 0.0058,
                "winRate": 0.53471774,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 542,
                    "heroName": "ハロルド",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/m8aOqFQE.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/CBT9NFLe.jpg"
                },
                "position": 3
            },
            {
                "heroId": 558,
                "banRate": 0.00044,
                "showRate": 0.0064999997,
                "winRate": 0.4960661,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 558,
                    "heroName": "影",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/ioDVAbAf.jpg",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/WZl2T51I.jpg"
                },
                "position": 0
            },
            {
                "heroId": 197,
                "banRate": 0.00026,
                "showRate": 0.0063,
                "winRate": 0.5117158,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 197,
                    "heroName": "棋星",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/RLA5jvBk.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/KSprHoFS.jpg"
                },
                "position": 1
            },
            {
                "heroId": 514,
                "banRate": 0.00031,
                "showRate": 0.0061999997,
                "winRate": 0.5014623,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 514,
                    "heroName": "アレン",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/Ek9OHopQ.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/RML4OrEQ.jpg"
                },
                "position": 0
            },
            {
                "heroId": 131,
                "banRate": 0.00164,
                "showRate": 0.0055,
                "winRate": 0.51444244,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 131,
                    "heroName": "李白",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/k3w1wjDA.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/gi5uliqF.jpg"
                },
                "position": 3
            },
            {
                "heroId": 146,
                "banRate": 0.0019200001,
                "showRate": 0.0054,
                "winRate": 0.46563682,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 146,
                    "heroName": "ルナ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/hz3BqNue.png",
                    "heroCareer": "ファイター/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/peB9CpiC.jpg"
                },
                "position": 3
            },
            {
                "heroId": 640,
                "banRate": 0.00289,
                "showRate": 0.0048,
                "winRate": 0.49337977,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 640,
                    "heroName": "アネット",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/49o0xBua.png",
                    "heroCareer": "サポート/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/TqKWnzQm.jpg"
                },
                "position": 4
            },
            {
                "heroId": 581,
                "banRate": 0.00058,
                "showRate": 0.0057,
                "winRate": 0.4845852,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 581,
                    "heroName": "元流の子（タンク）",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/jbrX5mQc.jpeg",
                    "heroCareer": "タンク/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/IhExpUrR.jpg"
                },
                "position": 0
            },
            {
                "heroId": 119,
                "banRate": 0.00092,
                "showRate": 0.0054,
                "winRate": 0.4979755,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 119,
                    "heroName": "扁鵲",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/YmpeG9H2.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/IzGNO4gH.jpg"
                },
                "position": 1
            },
            {
                "heroId": 556,
                "banRate": 0.00037,
                "showRate": 0.0056000003,
                "winRate": 0.52559334,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 556,
                    "heroName": "アタ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/eafz1moy.png",
                    "heroCareer": "タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/VLdAOWEU.jpg"
                },
                "position": 0
            },
            {
                "heroId": 162,
                "banRate": 0.00047,
                "showRate": 0.0053,
                "winRate": 0.50928956,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 162,
                    "heroName": "ナコルル",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/H9WAmWdN.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/XVz3ScF3.jpg"
                },
                "position": 3
            },
            {
                "heroId": 524,
                "banRate": 0.00011,
                "showRate": 0.0050999997,
                "winRate": 0.54239297,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 524,
                    "heroName": "蒙牙",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/vhBTA9jh.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/8pdEvIFf.jpg"
                },
                "position": 2
            },
            {
                "heroId": 534,
                "banRate": 0.00021,
                "showRate": 0.005,
                "winRate": 0.5356826,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 534,
                    "heroName": "啓",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/ionwVFtV.png",
                    "heroCareer": "サポート/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/X6bMcS9I.jpg"
                },
                "position": 4
            },
            {
                "heroId": 522,
                "banRate": 0.00034,
                "showRate": 0.0048,
                "winRate": 0.50829095,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 522,
                    "heroName": "曜",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/xw0HrvxD.png",
                    "heroCareer": "ファイター/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/9FEMfGL6.jpg"
                },
                "position": 3
            },
            {
                "heroId": 582,
                "banRate": 0.00043000001,
                "showRate": 0.0047,
                "winRate": 0.5140086,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 582,
                    "heroName": "元流の子（メイジ）",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/hero/head_128-128/66xErXNs.jpeg",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/cv4BFURQ.jpg"
                },
                "position": 1
            },
            {
                "heroId": 182,
                "banRate": 0.00077,
                "showRate": 0.0044,
                "winRate": 0.4975259,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 182,
                    "heroName": "干将・莫耶",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/ui5UKQex.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/BTzGuX2M.jpg"
                },
                "position": 1
            },
            {
                "heroId": 501,
                "banRate": 0.00026,
                "showRate": 0.0046,
                "winRate": 0.5072894,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 501,
                    "heroName": "明世隠",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/ubeT1R84.png",
                    "heroCareer": "サポート",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/8kII7n12.jpg"
                },
                "position": 4
            },
            {
                "heroId": 192,
                "banRate": 0.00015,
                "showRate": 0.0046,
                "winRate": 0.5107259,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 192,
                    "heroName": "黄忠",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/LNECT7PW.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/P3i4l8r8.jpg"
                },
                "position": 2
            },
            {
                "heroId": 124,
                "banRate": 0.00013999999,
                "showRate": 0.0045000003,
                "winRate": 0.51670283,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 124,
                    "heroName": "周瑜",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/kqkpA18w.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/6qGtxWOJ.jpg"
                },
                "position": 1
            },
            {
                "heroId": 115,
                "banRate": 0.00043000001,
                "showRate": 0.0043,
                "winRate": 0.50851315,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 115,
                    "heroName": "漸離",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/QWFCuWNn.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/HPC78m98.jpg"
                },
                "position": 1
            },
            {
                "heroId": 533,
                "banRate": 0.00029,
                "showRate": 0.0043,
                "winRate": 0.5159527,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 533,
                    "heroName": "アグド",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/TYN9rh81.png",
                    "heroCareer": "マークスマン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/sLRXwXQN.jpg"
                },
                "position": 3
            },
            {
                "heroId": 117,
                "banRate": 0.00032,
                "showRate": 0.0042,
                "winRate": 0.5086242,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 117,
                    "heroName": "鐘無艶",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/D1f9UN1O.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/ByB0avrN.jpg"
                },
                "position": 0
            },
            {
                "heroId": 513,
                "banRate": 0.00052,
                "showRate": 0.0041,
                "winRate": 0.48469302,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 513,
                    "heroName": "上官婉児",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/zyA68GFr.png",
                    "heroCareer": "メイジ/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/vW5q3aT6.jpg"
                },
                "position": 1
            },
            {
                "heroId": 139,
                "banRate": 0.00049,
                "showRate": 0.0039999997,
                "winRate": 0.51498324,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 139,
                    "heroName": "孔子",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/UhQkVUBi.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/4jij0DvI.jpg"
                },
                "position": 0
            },
            {
                "heroId": 176,
                "banRate": 0.00013,
                "showRate": 0.0042,
                "winRate": 0.49730116,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 176,
                    "heroName": "楊貴妃",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/r97AVgaV.png",
                    "heroCareer": "メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/LF6Nz3Dc.jpg"
                },
                "position": 1
            },
            {
                "heroId": 180,
                "banRate": 0.00043000001,
                "showRate": 0.0039999997,
                "winRate": 0.5180866,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 180,
                    "heroName": "ナタク",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/WDh84DWg.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/NP5clJQ1.jpg"
                },
                "position": 0
            },
            {
                "heroId": 564,
                "banRate": 0.00049,
                "showRate": 0.0039000001,
                "winRate": 0.47032505,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 564,
                    "heroName": "姫小満",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/FsGXCnH1.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/bh6aZMH5.jpg"
                },
                "position": 0
            },
            {
                "heroId": 140,
                "banRate": 0.00087,
                "showRate": 0.0036,
                "winRate": 0.46414354,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 140,
                    "heroName": "関羽",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/V5e2k18Z.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/tSx2ERbX.jpg"
                },
                "position": 0
            },
            {
                "heroId": 128,
                "banRate": 0.00065,
                "showRate": 0.0036,
                "winRate": 0.50695497,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 128,
                    "heroName": "ファーティフ",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/default/6IY77h7c.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/default/j14kiNfY.jpg"
                },
                "position": 0
            },
            {
                "heroId": 178,
                "banRate": 0.00026,
                "showRate": 0.0037,
                "winRate": 0.5040461,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 178,
                    "heroName": "楊戩",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/LntokS4z.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/LiaY1Ak1.jpg"
                },
                "position": 0
            },
            {
                "heroId": 120,
                "banRate": 0.00040000002,
                "showRate": 0.0035,
                "winRate": 0.5090679,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 120,
                    "heroName": "白起",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/uY7c38Tt.png",
                    "heroCareer": "タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/aknBlGMI.jpg"
                },
                "position": 0
            },
            {
                "heroId": 168,
                "banRate": 0.00022,
                "showRate": 0.0035,
                "winRate": 0.547569,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 168,
                    "heroName": "ラプール",
                    "heroIcon": "https://camp.honorofkings.com/camp/admin/default/AuWJ7G0J.png",
                    "heroCareer": "サポート/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/default/9bajUtDY.jpg"
                },
                "position": 4
            },
            {
                "heroId": 163,
                "banRate": 0.00019,
                "showRate": 0.0036,
                "winRate": 0.50134987,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 163,
                    "heroName": "橘右京",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/8e9WRFgL.png",
                    "heroCareer": "アサシン/ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/2mct7rWz.jpg"
                },
                "position": 3
            },
            {
                "heroId": 189,
                "banRate": 0.0028300001,
                "showRate": 0.0022,
                "winRate": 0.52429265,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 189,
                    "heroName": "鬼谷子",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/AXjJlMvi.png",
                    "heroCareer": "サポート",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/aQiegaok.jpg"
                },
                "position": 4
            },
            {
                "heroId": 125,
                "banRate": 0.00049999997,
                "showRate": 0.0033,
                "winRate": 0.48149016,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 125,
                    "heroName": "元歌",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/en5o11rK.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Tbfq2NY0.jpg"
                },
                "position": 0
            },
            {
                "heroId": 154,
                "banRate": 0.00027999998,
                "showRate": 0.0033,
                "winRate": 0.5040461,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 154,
                    "heroName": "ムーラン",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/p4dfuWXS.png",
                    "heroCareer": "ファイター/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/mKedCKPI.jpg"
                },
                "position": 0
            },
            {
                "heroId": 531,
                "banRate": 0.00103,
                "showRate": 0.003,
                "winRate": 0.45783725,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 531,
                    "heroName": "鏡",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/HVRw4cpB.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/oCCtEU9x.jpg"
                },
                "position": 3
            },
            {
                "heroId": 118,
                "banRate": 0.00027999998,
                "showRate": 0.0033,
                "winRate": 0.48872364,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 118,
                    "heroName": "孫臏",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/1zkBQ1l1.png",
                    "heroCareer": "サポート/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/vguCwOnf.jpg"
                },
                "position": 4
            },
            {
                "heroId": 170,
                "banRate": 0.00035000002,
                "showRate": 0.0032000002,
                "winRate": 0.5174495,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 170,
                    "heroName": "劉備",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/argPlTxR.png",
                    "heroCareer": "ファイター",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/Uvn9VDp3.jpg"
                },
                "position": 3
            },
            {
                "heroId": 149,
                "banRate": 0.00032,
                "showRate": 0.0032000002,
                "winRate": 0.49910003,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 149,
                    "heroName": "劉邦",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/bVHGeH45.png",
                    "heroCareer": "タンク/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/PsRv1GG0.jpg"
                },
                "position": 0
            },
            {
                "heroId": 150,
                "banRate": 0.00052,
                "showRate": 0.0027,
                "winRate": 0.49093208,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 150,
                    "heroName": "韓信",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/QTcSGEgM.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/LisGz9JI.jpg"
                },
                "position": 3
            },
            {
                "heroId": 502,
                "banRate": 0.00063,
                "showRate": 0.0023,
                "winRate": 0.51138633,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 502,
                    "heroName": "タイガー",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/XlRczGYM.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/3q1zTt6E.jpg"
                },
                "position": 3
            },
            {
                "heroId": 198,
                "banRate": 0.00015,
                "showRate": 0.0023,
                "winRate": 0.53807044,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 198,
                    "heroName": "モンキ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/Ym7KcrIW.png",
                    "heroCareer": "ファイター/メイジ",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/w1wO6DKd.jpg"
                },
                "position": 3
            },
            {
                "heroId": 195,
                "banRate": 0.00027999998,
                "showRate": 0.0021,
                "winRate": 0.5231791,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 195,
                    "heroName": "百里玄策",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/keW8Hfo0.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/mD5CDPk0.jpg"
                },
                "position": 3
            },
            {
                "heroId": 506,
                "banRate": 0.000050000002,
                "showRate": 0.0019999999,
                "winRate": 0.5127014,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 506,
                    "heroName": "雲中君",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/bwygx1aS.png",
                    "heroCareer": "アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/6EEUjz9u.jpg"
                },
                "position": 3
            },
            {
                "heroId": 134,
                "banRate": 0.00016,
                "showRate": 0.0018,
                "winRate": 0.5110563,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 134,
                    "heroName": "達磨",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/9u997w0x.png",
                    "heroCareer": "ファイター/タンク",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/UCNANDbr.jpg"
                },
                "position": 0
            },
            {
                "heroId": 183,
                "banRate": 0.0004,
                "showRate": 0.00070000003,
                "winRate": 0.5366325,
                "tRank": 3,
                "heroInfo": {
                    "heroId": 183,
                    "heroName": "アテナ",
                    "heroIcon": "https://camp.honorofkings.com/social/game/src/image_hero_head_128*128/BEh6QC3Q.png",
                    "heroCareer": "ファイター/アサシン",
                    "heroCover": "https://camp.honorofkings.com/camp/admin/hero/skin/cover_1250-326/BTfAVTQF.jpg"
                },
                "position": 3
            }
        ]
    }
}

# Position mapping
POS_MAP = {
    0: "CLASH",
    1: "MID",
    2: "FARM",
    3: "JUNGLE",
    4: "ROAM"
}

# Tier mapping
TIER_MAP = {
    0: "S+",
    1: "S",
    2: "A",
    3: "B",
    4: "C"
}

# Load existing hero_stats_camp.json
with open('src/data/hero_stats_camp.json', 'r', encoding='utf-8') as f:
    existing_data = json.load(f)

updated_count = 0

for item in user_payload['data']['list']:
    hid = str(item['heroId'])
    jp_name = item['heroInfo']['heroName']
    wr = round(item['winRate'] * 100, 2)
    pr = round(item['showRate'] * 100, 2)
    br = round(item['banRate'] * 100, 2)
    tier = TIER_MAP.get(item['tRank'], "B")
    lane = POS_MAP.get(item['position'], "MID")
    
    existing_data[hid] = {
        "jpName": jp_name,
        "tier": tier,
        "lane": lane,
        "win_rate": wr,
        "pick_rate": pr,
        "ban_rate": br
    }
    updated_count += 1

print(f"Updated {updated_count} heroes in hero_stats_camp.json!")

with open('src/data/hero_stats_camp.json', 'w', encoding='utf-8') as f:
    json.dump(existing_data, f, ensure_ascii=False, indent=2)

print("Saved src/data/hero_stats_camp.json successfully!")
