# ============================================================================
# Student Name: Trần Hiển Vinh
# Student ID: CE190881
# Class: SE1910
# Course: SBA301 - Integrate Single Page Application with Spring Boot
# ============================================================================
import subprocess
import time
import os
import sys
import io
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

WORKSPACE = r"d:\KY7\SBA301\SBA"
A3_DIR = os.path.join(WORKSPACE, "A3TranHienVinh_SE1910")
A3_SCREENSHOTS = os.path.join(A3_DIR, "screenshots")
os.makedirs(A3_SCREENSHOTS, exist_ok=True)

def wait_for_url(url, timeout=40):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(url, timeout=2)
            if r.status_code < 500:
                print(f"  [OK] {url} is up (status: {r.status_code})")
                return True
        except Exception:
            pass
        time.sleep(1.5)
    print(f"  [TIMEOUT] {url} did not respond within {timeout}s")
    return False

def kill_process_tree(proc):
    if proc:
        try:
            subprocess.run(f"taskkill /PID {proc.pid} /T /F", shell=True, capture_output=True)
        except Exception:
            pass

def capture_ass3():
    print("\n=======================================================")
    print(">>> STARTING ASSIGNMENT 03 (FUMiniHotel) SERVICES")
    print("=======================================================")
    
    backend_jar = os.path.join(A3_DIR, "backend", "target", "A3TranHienVinh_SE1910-0.0.1-SNAPSHOT.jar")
    print(f"Starting Backend: {backend_jar}")
    be_proc = subprocess.Popen(["java", "-jar", backend_jar], cwd=os.path.join(A3_DIR, "backend"))
    
    frontend_dir = os.path.join(A3_DIR, "frontend")
    print(f"Starting Frontend in: {frontend_dir}")
    fe_proc = subprocess.Popen(["npm.cmd", "run", "dev"], cwd=frontend_dir)
    
    try:
        print("Waiting for Backend (http://localhost:8080/api/rooms/public)...")
        wait_for_url("http://localhost:8080/api/rooms/public", 40)
        
        print("Waiting for Frontend (http://localhost:5174)...")
        wait_for_url("http://localhost:5174", 25)
        
        time.sleep(2)
        print("\n>>> Launching Browser for Assignment 03 Screenshots...")
        with sync_playwright() as p:
            browser = p.chromium.launch(channel="msedge", headless=True)
            context = browser.new_context(viewport={"width": 1440, "height": 900})
            page = context.new_page()
            
            # 1. Public Home
            print("1. Capturing Public Home Room Catalog...")
            page.goto("http://localhost:5174/")
            page.wait_for_selector(".navbar")
            time.sleep(2)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "01_A3_Public_HomePage.png"), full_page=True)
            
            # 2. Login Page
            print("2. Capturing Login Page with Quick Fills...")
            page.goto("http://localhost:5174/login")
            page.wait_for_selector("form")
            time.sleep(1.5)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "02_A3_LoginPage.png"))
            
            # 3. Register Page
            print("3. Capturing Register Page...")
            page.goto("http://localhost:5174/register")
            page.wait_for_selector("form")
            time.sleep(1.5)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "03_A3_RegisterPage.png"), full_page=True)
            
            # 4. Customer Login & Online Booking
            print("4. Customer Login & Online Booking (an.nguyen@fuminhotel.com / @1)...")
            page.goto("http://localhost:5174/login")
            page.wait_for_selector("form")
            page.fill("input[type='email']", "an.nguyen@fuminhotel.com")
            page.fill("input[type='password']", "@1")
            page.click("button[type='submit']")
            time.sleep(2.5)
            
            page.goto("http://localhost:5174/book")
            page.wait_for_selector("input[type='checkbox'], .card", timeout=12000)
            time.sleep(2)
            cbs = page.locator("input[type='checkbox']")
            count = cbs.count()
            if count > 0:
                cbs.nth(0).check()
            if count > 1:
                cbs.nth(1).check()
            time.sleep(1.5)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "04_A3_Customer_OnlineBooking.png"), full_page=True)
            
            # 5. Click Booking to show Confirmation Modal
            print("5. Capturing Booking Confirmation...")
            btn_book = page.locator("button:has-text('Xác nhận đặt phòng'), button:has-text('Đặt Phòng'), button:has-text('Confirm')").first
            if btn_book.is_visible():
                btn_book.click()
                time.sleep(1.5)
                page.screenshot(path=os.path.join(A3_SCREENSHOTS, "05_A3_Customer_BookingConfirmed_Modal.png"))
                btn_ok = page.locator(".modal button:has-text('Xác nhận'), .modal button:has-text('Đóng'), .modal .btn-close").first
                if btn_ok.is_visible():
                    btn_ok.click()
                    time.sleep(1)
            
            # 6. Customer My Bookings
            print("6. Capturing Customer My Bookings...")
            page.goto("http://localhost:5174/my-bookings")
            time.sleep(2)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "06_A3_Customer_MyBookings.png"), full_page=True)
            
            # 7. Customer Profile
            print("7. Capturing Customer Profile & Password Change...")
            page.goto("http://localhost:5174/profile")
            time.sleep(2)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "07_A3_Customer_Profile.png"), full_page=True)
            
            # 8. Staff Login & Room Management
            print("8. Capturing Staff Rooms Management (staff@fuminhotel.com / @1)...")
            page.goto("http://localhost:5174/login")
            page.evaluate("() => { localStorage.clear(); window.location.reload(); }")
            time.sleep(1.5)
            page.wait_for_selector("form")
            page.fill("input[type='email']", "staff@fuminhotel.com")
            page.fill("input[type='password']", "@1")
            page.click("button[type='submit']")
            time.sleep(2)
            page.wait_for_selector("table", timeout=12000)
            time.sleep(2)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "08_A3_Staff_RoomsManagement.png"), full_page=True)
            
            # 9. Staff Add Room Modal
            print("9. Capturing Staff Add Room Modal...")
            btn_add_room = page.locator("button:has-text('Thêm Phòng Mới'), button:has-text('Thêm'), button:has-text('Add')").first
            if btn_add_room.is_visible():
                btn_add_room.click()
                time.sleep(1.5)
                page.screenshot(path=os.path.join(A3_SCREENSHOTS, "09_A3_Staff_AddRoom_Modal.png"))
                btn_close = page.locator(".modal .btn-close, .modal button:has-text('Hủy'), .modal button:has-text('Close')").first
                if btn_close.is_visible():
                    btn_close.click()
                    time.sleep(0.5)
            
            # 10. Staff Customers Management
            print("10. Capturing Staff Customers Management...")
            page.goto("http://localhost:5174/staff/customers")
            page.wait_for_selector("table", timeout=12000)
            time.sleep(2)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "10_A3_Staff_CustomersManagement.png"), full_page=True)
            
            # 11. Staff Bookings Report
            print("11. Capturing Staff Bookings Report...")
            page.goto("http://localhost:5174/staff/bookings")
            page.wait_for_selector("table", timeout=12000)
            time.sleep(2)
            page.screenshot(path=os.path.join(A3_SCREENSHOTS, "11_A3_Staff_BookingsReport.png"), full_page=True)
            
            browser.close()
            print(">>> Completed all Assignment 03 screenshots successfully!")
    finally:
        print("Stopping Assignment 03 services...")
        kill_process_tree(fe_proc)
        kill_process_tree(be_proc)
        time.sleep(3)

if __name__ == "__main__":
    capture_ass3()
