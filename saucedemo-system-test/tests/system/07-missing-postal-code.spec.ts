import { test, expect } from '@playwright/test';

test('ST-07: Checkout Validation ไม่อนุญาตให้ทำรายการต่อหากไม่กรอก Postal Code', async ({ page }) => {
  // =====================================================
  // Login
  // =====================================================
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // =====================================================
  // Add Product & Go to Checkout
  // =====================================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // =====================================================
  // กรอก First Name + Last Name แต่ "ไม่กรอก Postal Code"
  // =====================================================
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  // จงใจข้ามการกรอก postal code เพื่อตรวจ Validation
  
  await page.locator('[data-test="continue"]').click();

  // =====================================================
  // Verify Expected Result
  // =====================================================
  // ระบบต้องแสดงข้อความ Error แจ้งเตือนเรื่อง Postal Code
  await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  
  // ต้องยังคงอยู่ในหน้า checkout-step-one
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});