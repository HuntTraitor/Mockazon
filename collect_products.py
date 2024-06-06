import os
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def scroll_to_bottom(driver):
    """Scroll to the bottom of the page to load more products."""
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height


def create_driver(driver_path):
    """
    Create and configure a Selenium WebDriver.

    Parameters:
    - driver_path (str): The path to the ChromeDriver executable.

    Returns:
    - webdriver.Chrome: An instance of Chrome WebDriver.
    """
    chrome_service = ChromeService(
        executable_path=os.path.join(driver_path, "chromedriver.exe"))
    options = webdriver.ChromeOptions()
    #options.add_argument("--headless")  # Ensure GUI is off
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(
        f"user-data-dir={os.path.join(driver_path, 'profile')}")
    driver = webdriver.Chrome(service=chrome_service, options=options)

    return driver


def get_product_links(driver, url, file):  
    driver.get(url)  
    product_links = set()  
  
    while True:  
        # Scroll and load all products on the current page  
        while True:  
            initial_product_count = len(driver.find_elements(By.CSS_SELECTOR, 'div.p13n-desktop-grid a.a-link-normal'))  
            scroll_to_bottom(driver)  
            time.sleep(4)  # Wait for products to load  
            new_product_count = len(driver.find_elements(By.CSS_SELECTOR, 'div.p13n-desktop-grid a.a-link-normal'))  
            if new_product_count == initial_product_count:  
                break  
  
        # Get product links within the p13n-desktop-grid class div  
        grid_divs = driver.find_elements(By.CSS_SELECTOR, 'div.p13n-desktop-grid')  
        for grid_div in grid_divs:  
            products = grid_div.find_elements(By.CSS_SELECTOR, 'a.a-link-normal')  
            for product in products:  
                link = product.get_attribute('href')  
                if link and "/dp/" in link:  
                    product_links.add(link)  
  
        # Check for the next page  
        try:  
            next_button = driver.find_element(By.CSS_SELECTOR, 'li.a-last a')  
            next_button.click()  
            time.sleep(4)  
        except:  
            break  
  
    with open(file, 'a') as f:  
        for link in product_links:  
            f.write(link + '\n')  
    print(f"Saved {len(product_links)} links from {url}") 


def main():
    # the folder, not the exe
    driver_path = r"C:\Users\Administrator\Downloads\chromedriver_win32"
    driver = create_driver(driver_path)
    best_sellers_url = 'https://www.amazon.com/Best-Sellers/zgbs/ref=zg_bsms_tab_bs'
    driver.get(best_sellers_url)

    # Wait for the departments to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, 'div._p13n-zg-nav-tree-all_style_zg-browse-root__-jwNv'))
    )

    # Get all department links
    department_elements = driver.find_elements(
        By.CSS_SELECTOR, 'div._p13n-zg-nav-tree-all_style_zg-browse-item__1rdKf a')
    department_links = [elem.get_attribute(
        'href') for elem in department_elements]

    # File to save product links
    output_file = 'product_links.txt'
    if os.path.exists(output_file):
        os.remove(output_file)

    # Iterate through each department and get product links
    for link in department_links:
        get_product_links(driver, link, output_file)

    driver.quit()
    print("All product links saved successfully!")


if __name__ == "__main__":
    main()
