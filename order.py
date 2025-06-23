import requests

cookies = {
    'api_uid': 'CkCbyGhYxoWfNgBWhn2/Ag==',
    '_nano_fp': 'XpmyX0EYl0Tyn0X8nT_afz50rgEh6_a1MhDD8sq0',
    'x-hng': 'lang=zh-CN&domain=mms.pinduoduo.com',
    'rckk': 'b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5',
    '_bee': 'b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5',
    'ru1k': '85a1ea21-9b2d-4521-95f7-be3f6e087fbe',
    '_f77': '85a1ea21-9b2d-4521-95f7-be3f6e087fbe',
    'ru2k': '6b4cd938-2608-42a4-b06a-abea5b81c6cd',
    '_a42': '6b4cd938-2608-42a4-b06a-abea5b81c6cd',
    'PASS_ID': '1-jU2qzxuhPQVKVgkKos9mweIqxETpfKqw7l7Odkd6Xb0U9kE8AgfPWdAjeMmjCeg1qrJue/MuuZ1Sbb0WsEV1Kw_865884519_162927425',
    'mms_b84d1838': '3616,108,3523,3660,3614,3447,3613,3604,3589,3594,3599,3603,3605,3621,3622,3588,3254,3532,3642,3474,3475,3477,3479,810,820,3482,1202,1203,1204,1205,3417',
    'x-visit-time': '1750648490207',
    'JSESSIONID': 'E5229F6529B6A5847CAF5003C34FEDA1',
}

headers = {
    'authority': 'mms.pinduoduo.com',
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'anti-content': '0asWfxUeM_Ve4KpSnAyFMEXXFLBgJtGBAWxEcU4qC4mudEHwY4iVovdMsrB8HqzFRgCbyX7qv4LV7FQL8PVJuayUEvUFB3-LMui0twrM01eHa01XImGXgR9A4Gd03eowXICLplXNYkQZK-nmj5M9Q-fdnik-VT1tvYT7lb2L7-nUjUR9WMkd9ikjMYSkfVl1Tu9LE-nAjSQ9WMsdXAkSV61_vaJ76L4LWOOMJD9LBOOUb6y9IkXX0R9i6qM4qaiQy6LYHgO2ilS7kL4LdnOCN0ypkDWEp0L2nO3PtyPeIYkYuMVngNcjvPRKLpFKlZtEYNJcj5oP0no1dwC5TppNJTjnGfYvGvkcfGhAEfeYChmJvTQqn0n8l09jl04YlUPJl0g7lCwJld9Ynd4YldeacwqKngZVhz_W6s5k7k-PzlsoMiRz7kQdItRIkL2VFebyQdNNMPsox9swani98OsKP4k5mz4ZkMf1KfUwvsQDSZIFSAM5mL1OmMWOkM4ZHA65tRTUFfQkSDIVScIuSDR1KfY_Z6P_ekBZSKBPtVwSf577fwfjAtVgzBw7x-Zb2Ikex2pM7uwekgEg1RezMzIvfdhMMg7S8UKMR65e-suDl22cnKf4HZ0fquGTdlTCbBgurkYvIzr_M_sCS5DEr1dWgDWFm3UhIJcqSomBtCTQor-r97BBbaTMfV9va0ecn5wqeOG',
    'cache-control': 'max-age=0',
    'content-type': 'application/json',
    # 'cookie': 'api_uid=CkCbyGhYxoWfNgBWhn2/Ag==; _nano_fp=XpmyX0EYl0Tyn0X8nT_afz50rgEh6_a1MhDD8sq0; x-hng=lang=zh-CN&domain=mms.pinduoduo.com; rckk=b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5; _bee=b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5; ru1k=85a1ea21-9b2d-4521-95f7-be3f6e087fbe; _f77=85a1ea21-9b2d-4521-95f7-be3f6e087fbe; ru2k=6b4cd938-2608-42a4-b06a-abea5b81c6cd; _a42=6b4cd938-2608-42a4-b06a-abea5b81c6cd; PASS_ID=1-jU2qzxuhPQVKVgkKos9mweIqxETpfKqw7l7Odkd6Xb0U9kE8AgfPWdAjeMmjCeg1qrJue/MuuZ1Sbb0WsEV1Kw_865884519_162927425; mms_b84d1838=3616,108,3523,3660,3614,3447,3613,3604,3589,3594,3599,3603,3605,3621,3622,3588,3254,3532,3642,3474,3475,3477,3479,810,820,3482,1202,1203,1204,1205,3417; x-visit-time=1750648490207; JSESSIONID=E5229F6529B6A5847CAF5003C34FEDA1',
    'etag': 'b5YkbF5lopu0OzGU4aLv7vqzaHocq1n5',
    'origin': 'https://mms.pinduoduo.com',
    'referer': 'https://mms.pinduoduo.com/orders/list?msfrom=mms_sidenav',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
}

json_data = {
    'orderType': 1,
    'afterSaleType': 1,
    'remarkStatus': -1,
    'urgeShippingStatus': -1,
    'groupStartTime': 1742872488,
    'groupEndTime': 1750648488,
    'pageNumber': 1,
    'pageSize': 20,
    'sortType': 10,
    'mobile': '',
}

response = requests.post(
    'https://mms.pinduoduo.com/mangkhut/mms/recentOrderList',
    cookies=cookies,
    headers=headers,
    json=json_data,
)

print(response.json())

# Note: json_data will not be serialized by requests
# exactly as it was in the original request.
#data = '{"orderType":1,"afterSaleType":1,"remarkStatus":-1,"urgeShippingStatus":-1,"groupStartTime":1742872488,"groupEndTime":1750648488,"pageNumber":1,"pageSize":20,"sortType":10,"mobile":""}'
#response = requests.post('https://mms.pinduoduo.com/mangkhut/mms/recentOrderList', cookies=cookies, headers=headers, data=data)