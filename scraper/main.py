import json
import requests
from functools import reduce
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By

URLS = [
    "https://github.com/SimplifyJobs/Summer2024-Internships/blob/dev/README.md",
    "https://github.com/SimplifyJobs/Summer2024-Internships/blob/dev/README-Off-Season.md",
]

LANGUAGES = [
    " C ",
    " C++ ",
    " C# ",
    " Python ",
    " R ",
    " Javascript ",
    " Typescript ",
    " Java ",
    " Rust ",
    " PHP ",
    " Go ",
    " Perl ",
    " Swift ",
]

TECHNOLOGIES = [
    "Git",
    "HTML",
    "CSS",
    "jQuery",
    "React.js",
    "Next.js",
    "Vue.js",
    "Django",
    ".NET",
    "ASP.NET",
    "Spring Boot",
    "NoSQL",
    "MongoDB",
    "SQL",
    "Postgres",
    "MySQL",
    "Numpy",
    "Pandas",
    "MATLAB",
    "TCP/IP",
    "Data Structures & Algorithms",
    "REST APIs",
    "GraphQL",
    "AWS",
    "Microsoft Azure",
    "Docker",
    "Kubernetes",
    "DevOps",
    "Linux",
]


def run_scraper():
    data = {"info": []}

    for url in URLS:
        options = webdriver.FirefoxOptions()
        options.add_argument("--headless")

        driver = webdriver.Firefox(options=options)
        driver.get(url)

        valid_links = reduce(
            lambda acc, td: acc
            + list(
                filter(
                    lambda link: "https://simplify.jobs/p" in link,
                    map(
                        lambda a: a.get_attribute("href"),
                        td.find_elements(By.TAG_NAME, "a"),
                    ),
                )
            ),
            driver.find_elements(By.TAG_NAME, "td"),
            [],
        )

        for link in valid_links:
            page = requests.get(link)

            soup = BeautifulSoup(page.content, "html.parser")

            title = soup.find("div", class_="text-2xl font-semibold").text
            location = soup.find("div", class_="relative my-3").find("span").text

            x = soup.find_all("div", class_="mt-3 rounded-full p-2 bg-gray-100")
            y = soup.find_all("li")
            z = soup.find("div", class_="description").find_all("p")

            x.extend(y)
            x.extend(z)

            skills = set()

            for element in x:
                skills = skills.union(
                    set(filter(lambda e: e in element.text, LANGUAGES))
                )
                skills = skills.union(
                    set(filter(lambda e: e in element.text, TECHNOLOGIES))
                )

            data["info"].append(
                {
                    "title": title,
                    "location": location,
                    "skills": list(map(lambda x: x.strip(), skills)),
                }
            )

    return data


def main():
    data = run_scraper()

    with open("../client/data.json", "w+") as file:
        json.dump(data, file)


if __name__ == "__main__":
    main()
