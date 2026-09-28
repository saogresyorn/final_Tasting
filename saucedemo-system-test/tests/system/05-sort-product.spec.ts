import { test, expect } from '@playwright/test';

test('ST-05: Sort Product เรียงลำดับราคาสินค้าจากน้อยไปมาก (Low to High) ได้ถูกต้อง', async ({ page }) => {
  // =====================================================
  // Login
  // =====================================================
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // =====================================================
  // Select Price Low to High
  // =====================================================
  // เลือก dropdown การจัดเรียง โดย value 'lohi' หมายถึง Price (low to high)
  await page.locator('.product_sort_container').selectOption('lohi');

  // =====================================================
  // Verify prices are ascending
  // =====================================================
  // ดึงข้อความราคาทั้งหมดบนหน้าเว็บมาไว้ใน Array (เช่น ["$7.99", "$9.99", ...])
  const priceElements = await page.locator('.inventory_item_price').allInnerTexts();
  
  // แปลงจากข้อความให้กลายเป็นตัวเลขเพื่อใช้เปรียบเทียบ
  const prices = priceElements.map(price => parseFloat(price.replace('$', '')));

  // ตรวจสอบว่าราคาสินค้าเรียงลำดับจากน้อยไปมากจริงหรือไม่
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
  }
});