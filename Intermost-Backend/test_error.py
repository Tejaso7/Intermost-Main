import requests
try:
    res = requests.get('http://localhost:8000/api/v1/countries/')
    import re
    matches = re.findall(r'<span class="fname">(.*?)</span>.*?<span class="line">(\d+)</span>.*?<span class="code">.*?<pre>(.*?)</pre>', res.text, re.DOTALL)
    for m in matches[-5:]:
        print(f"File {m[0]} line {m[1]}: {m[2].strip()}")
except Exception as e:
    print(e)
