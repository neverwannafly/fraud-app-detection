
# coding: utf-8

# In[2]:

import re
import time
from bs4 import BeautifulSoup
import sys, io
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.proxy import *
import typing
import json
import pprint

# @author Vishal Pal <vishalpal1999@gmail.com>

# Modify it according to your requirements

no_of_reviews = 1000

non_bmp_map = dict.fromkeys(range(0x10000, sys.maxunicode + 1), 0xfffd)
driver = webdriver.Chrome(r"E:\google-play-crawler\chromedriver.exe")

def get_reviews(app_id, page=1) -> typing.List[dict]:
    wait = WebDriverWait(driver, 10)
    reviews = [{}]
    url = ("https://play.google.com/store/apps/details?id={appId}&showAllReviews=true".format(appId=app_id))
    driver.get(url)

    time.sleep(5) # wait for dom to be ready
    for i in range(1,8):
        driver.execute_script('window.scrollTo(0, document.body.scrollHeight-500);') # scroll to load other reviews
        time.sleep(1)
    pages = driver.page_source

    soup_expatistan = BeautifulSoup(pages, "html.parser")

    expatistan_table = soup_expatistan.find("h1", class_="AHFaub")

    print("App Name: ", expatistan_table.string)
    expand_pages = soup_expatistan.findAll("div", class_="d15Mdf")
    # print(expand_pages)

    counter = 1
    for expand_page in expand_pages:
        #expand_page = expand_page.encode(sys.stdout.encoding, errors='replace')
        #expand_page = expand_page.decode("utf-8")

        # try:
        title = None
        author = expand_page.findAll("span", class_="X43Kjb")[0].text.encode(sys.stdout.encoding, errors='replace')
        author = author.decode("latin1")
        # print("Review Date: ", expand_page.findAll("span", class_="p2TkOb")[0].text.encode(sys.stdout.encoding, errors='replace').decode("utf-8"))
        rating = expand_page.find("div", class_="pf5lIe").find_next()['aria-label'];
        rating = rating.split('(')[0]
        rating = ''.join(x for x in rating if x.isdigit())
        rating = int(rating)
        content=str(expand_page.findAll("div", class_="UD7Dzf")[0].text.encode(sys.stdout.encoding, errors='replace').decode("latin1"))
        string = author+app_id+content
        reviewId = hash(string+str(len(string)))
        voteCount=int(expand_page.findAll("div", class_="jUL89d y92BAb")[0].text.encode(sys.stdout.encoding, errors='replace').decode("latin1"))
        counter+=1
        if counter % 40 == 0:
            page+=1
        reviews += [{
            "reviewId": reviewId,
            "title": title,
            "author": author,
            "rating": rating,
            "content": content,
            "voteCount": voteCount,
            "page": page
        }]
        # except Exception:
            #driver.quit()
            #return reviews
    driver.quit()
    return reviews

app_id = sys.argv[1]
if app_id is None:
    sys.stdout.write(json.dumps({ "success": False }))

reviews = get_reviews(app_id)
sys.stdout.write(json.dumps({
    "success": True,
    "reviews": reviews,
}))

print(len(reviews))
pprint.pprint(reviews)

# Append your app store urls here
# urls = [""]

# for url in urls:




    




