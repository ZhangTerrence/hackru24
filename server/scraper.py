import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By

LANGUAGES = [
    "C",
    "C++",
    "C#",
    "Python",
    "Javascript",
    "Typescript",
    "Java",
    "Rust",
    "PHP",
    "Go",
    "Perl",
]


def run_scraper():
    url = "https://github.com/SimplifyJobs/Summer2024-Internships/blob/dev/README.md"

    options = webdriver.FirefoxOptions()
    options.add_argument("--headless")

    driver = webdriver.Firefox(options=options)
    driver.get(url)

    data = {"info": []}

    tds = driver.find_elements(By.TAG_NAME, "td")
    for td in tds:
        links = td.find_elements(By.TAG_NAME, "a")
        for link in links:
            link_href = link.get_attribute("href")
            if "https://simplify.jobs/p" in link_href:
                page = requests.get(link_href)

                soup = BeautifulSoup(page.content, "html.parser")

                title = soup.find("div", class_="text-2xl font-semibold").text
                location = soup.find("div", class_="relative my-3").find("span").text

                skills = set()

                listElements = soup.find_all("li")
                for listElement in listElements:
                    [skills.add(s) for s in LANGUAGES if s in listElement.text]

                data["info"].append(
                    {"title": title, "location": location, "skills": list(skills)}
                )

    return data
