import urllib3
import requests
import re
import os

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

base_urls = [
    "http://intermost.eu",
    "https://intermost.eu",
    "http://www.intermost.eu",
    "https://www.intermost.eu"
]

def try_fetch(url):
    try:
        r = requests.get(url, verify=False, timeout=10)
        if r.status_code == 200:
            return r.text
    except Exception as e:
        pass
    return None

def extract_data(html, url, out):
    out.write(f"\n=========================================\n")
    out.write(f"SCRAPED PAGE: {url}\n")
    out.write(f"=========================================\n")
    
    # 1. Find all youtube links
    out.write("\n--- YOUTUBE LINKS ---\n")
    yt_pattern = r'(https?://(?:www\.)?(?:youtube\.com|youtu\.be|img\.youtube\.com)/[^\s\'"<>]+)'
    yt_links = set(re.findall(yt_pattern, html))
    for link in yt_links:
        out.write(f"Found YT link: {link}\n")
            
    # 2. Extract potential testimonials / quotes
    out.write("\n--- TESTIMONIALS / TEXT BLOCKS ---\n")
    text_blocks = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
    for block in text_blocks:
        clean = re.sub(r'<[^>]+>', '', block).strip()
        if len(clean) > 30:
            out.write(f"- {clean}\n\n")
            
    # 3. Find all internal links
    out.write("\n--- INTERNAL LINKS ---\n")
    href_pattern = r'href=["\']([^"\']+)["\']'
    links = set(re.findall(href_pattern, html))
    internal_links = []
    for link in links:
        if link.startswith('/') or 'intermost.eu' in link:
            out.write(f"Link: {link}\n")
            internal_links.append(link)
            
    return internal_links

# Fetch homepage first
html_content = None
chosen_url = None
for url in base_urls:
    html_content = try_fetch(url)
    if html_content:
        chosen_url = url
        break

output_path = r"scratch\scrape_results.txt"
with open(output_path, "w", encoding="utf-8") as out:
    if html_content:
        internal_links = extract_data(html_content, chosen_url, out)
        
        # Now try to scrape some common subpages if found in internal links
        scraped_subpages = set()
        for link in internal_links:
            clean_link = link.strip()
            if not clean_link or clean_link == '/' or clean_link.startswith('#'):
                continue
            
            sub_url = clean_link
            if clean_link.startswith('/'):
                sub_url = chosen_url.rstrip('/') + clean_link
            
            if sub_url not in scraped_subpages:
                scraped_subpages.add(sub_url)
                sub_html = try_fetch(sub_url)
                if sub_html:
                    extract_data(sub_html, sub_url, out)
        
        print(f"Scrape completed. Results saved to: {output_path}")
    else:
        print("Could not fetch any version of intermost.eu")
        out.write("Could not fetch any version of intermost.eu\n")
