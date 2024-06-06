import os
import json
from datetime import datetime, timezone
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
import re
from dotenv import load_dotenv
import threading

# Load the API key from the environment variable
load_dotenv()
api_key = os.getenv('SUPERVENDOR_API_KEY')

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
    options.add_argument(
        f"user-data-dir={os.path.join(driver_path, 'profile')}")
    #options.add_argument("--headless")  # Ensure GUI is off
    driver = webdriver.Chrome(service=chrome_service, options=options)
    driver.implicitly_wait(1)

    return driver

def scrape_product_details(url, driver):
    driver.get(url)
    try:
        # Wait until the product title is present
        product_name = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "productTitle"))
        ).text.strip()

        brand = driver.find_element(By.ID, "bylineInfo").text.strip()
        brand = re.sub("Visit the ", "", brand, flags=re.IGNORECASE)
        brand = brand.replace(" Store", "")
        brand = brand.replace("Brand: ", "")
        image = driver.find_element(By.ID, "landingImage").get_attribute('src')
        rating = driver.find_element(By.ID, 'acrPopover').get_attribute('title').split()[0]
        price_whole = driver.find_element(By.CLASS_NAME, 'a-price-whole').text
        price_fraction = driver.find_element(By.CLASS_NAME, 'a-price-fraction').text
        price = f'{price_whole}.{price_fraction}'
        description_elements = driver.find_elements(By.CSS_SELECTOR, 'ul.a-unordered-list.a-vertical.a-spacing-mini li span.a-list-item')
        description = ' '.join([elem.text for elem in description_elements])
        product_name = product_name.replace(f'{brand} ', "").strip()
        delivery_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

        product = {
            "name": product_name,
            "brand": brand,
            "image": image,
            "rating": rating,
            "price": price,
            "description": description,
            "deliveryDate": delivery_date
        }
    except Exception as e:
        raise Exception(f"Error scraping product details: {e}")

    return product

def escape_single_quotes(s):
    """
    Escape single quotes in a string.
    """
    return s.replace("'", "''")

def generate_sql_insert(product, vendor_id):
    """
    Generate a one-line SQL INSERT statement for a product.
    """
    product_data = json.dumps(product, separators=(',', ':'))
    product_data = escape_single_quotes(product_data)  # Escape single quotes in the JSON string
    sql_statement = f"INSERT INTO product(vendor_id, data, active) VALUES ('{vendor_id}', '{product_data}', TRUE);"
    return sql_statement

def process_url(driver, product_url):
    try:
        product = scrape_product_details(product_url, driver)
        if (product['price'] == '.' or product['rating'] == ''):  # Skip products with no price
            return
        insert = generate_sql_insert(product, 'a4213cf8-c2e4-4424-8688-0907a6c58fd2')
        with open('products.sql', 'a') as f:
            f.write(insert + '\n')
        print(f"Product details for {product['name']} processed successfully!")
    except Exception as e:
        with open('error.log', 'a') as error_log:
            error_log.write(f"Failed to process URL {product_url}: {e}\n")
        print(f"Failed to process URL {product_url}: {e}")

def main():
    driver_path = r"C:\Users\Administrator\Downloads\chromedriver_win32"  # the folder, not the exe
    driver = create_driver(driver_path)

    with open('product_links.txt', 'r') as f:
        product_urls = [line.strip() for line in f.readlines()]

    for url in product_urls:
        try:
            process_url(driver, url)
        except:
            driver = create_driver(driver_path)
            continue

    driver.quit()

if __name__ == "__main__":
    main()
