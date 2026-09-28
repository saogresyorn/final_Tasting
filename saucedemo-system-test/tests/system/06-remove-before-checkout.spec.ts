import { test, expect } from '@playwright/test';

test('ST-06: Remove Product ก่อน Checkout หน้า Overview ต้องเหลือสินค้าเพียง 1 รายการ', async ({ page }) => {
  // =====================================================
  // Login
  // =====================================================
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // =====================================================
  // Add 2 Products
  // =====================================================
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // =====================================================
  // ไปที่ Cart และ Remove 1 Product
  // =====================================================
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
  
  // ลบ Bike Light ออก
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // =====================================================
  // Checkout
  // =====================================================
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  // กรอกข้อมูลลูกค้า
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  await page.locator('#postal-code').fill('50000');
  await page.locator('[data-test="continue"]').click();

  // =====================================================
  // Verify Checkout Overview
  // =====================================================
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  
  // ตรวจสอบว่าในหน้า Overview เหลือสินค้าแค่ 1 รายการ
  await expect(page.locator('.cart_item')).toHaveCount(1);
  // ตรวจสอบว่าสินค้าที่เหลือคือ Backpack
  await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});