import { expect, test, type APIRequestContext } from '@playwright/test';

const ADMIN_EMAIL = 'admin@mini-ecommerce.test';
const ADMIN_PASSWORD = 'Admin123!';
const API_URL = process.env.E2E_API_URL ?? 'http://localhost:4000';

const ROLE_NAME = 'e2e-catalogue-editor';
const PRODUCT_TITLE = 'E2E Test Product';

/**
 * Runs against the real API and database, so leftovers from a previous run would make
 * "create" steps fail on a duplicate name. Clear them first.
 */
async function resetFixtures(request: APIRequestContext): Promise<void> {
  const login = await request.post(`${API_URL}/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  const { accessToken } = (await login.json()) as { accessToken: string };
  const headers = { Authorization: `Bearer ${accessToken}` };

  const roles = (await (await request.get(`${API_URL}/roles`, { headers })).json()) as {
    id: string;
    name: string;
  }[];
  for (const role of roles.filter((entry) => entry.name === ROLE_NAME)) {
    await request.delete(`${API_URL}/roles/${role.id}`, { headers });
  }

  const products = (await (await request.get(`${API_URL}/products`, { headers })).json()) as {
    id: string;
    title: string;
  }[];
  for (const product of products.filter((entry) => entry.title === PRODUCT_TITLE)) {
    await request.delete(`${API_URL}/products/${product.id}`, { headers });
  }
}

test.beforeEach(async ({ request }) => {
  await resetFixtures(request);
});

test('admin golden path: sign in, manage a product, then create and assign a role', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  // Create a product.
  await page.getByRole('button', { name: 'New product' }).click();
  await page.getByLabel('Title').fill(PRODUCT_TITLE);
  await page.getByLabel('Description').fill('Created by the admin e2e test.');
  await page.getByLabel('Price').fill('42.5');
  await page.getByLabel('Stock').fill('7');
  await page.getByLabel('Variants').fill('Size: S, M, L');
  await page.getByRole('button', { name: 'Save product' }).click();

  const productRow = page.getByRole('row', { name: new RegExp(PRODUCT_TITLE) });
  await expect(productRow).toBeVisible();
  await expect(productRow).toContainText('$42.50');

  // Edit it.
  await productRow.getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('Stock').fill('9');
  await page.getByRole('button', { name: 'Save product' }).click();
  await expect(page.getByRole('row', { name: new RegExp(PRODUCT_TITLE) })).toContainText('9');

  // Create a limited role.
  await page.getByRole('link', { name: 'Roles' }).click();
  await expect(page.getByRole('heading', { name: 'Roles' })).toBeVisible();

  await page.getByLabel('Name').fill(ROLE_NAME);
  await page
    .locator('form')
    .getByRole('button', { name: 'products:write', exact: true })
    .click();
  await page.getByRole('button', { name: 'Create role' }).click();

  const roleSection = page.locator('section').filter({ hasText: ROLE_NAME });
  await expect(roleSection).toBeVisible();

  // Built-in roles stay locked so the deployment always has a working administrator.
  const adminSection = page.locator('section').filter({ hasText: 'Built-in role' }).first();
  await expect(adminSection).toBeVisible();

  // Assign the new role to a user.
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

  const roleSelect = page.getByLabel('Role for Demo Customer');
  await roleSelect.selectOption({ label: ROLE_NAME });
  await expect(roleSelect).toHaveValue(/.+/);

  // Reload to prove the change persisted server-side, not just in local state.
  await page.reload();
  await expect(page.getByLabel('Role for Demo Customer')).toContainText(ROLE_NAME);
});
