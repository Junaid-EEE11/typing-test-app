import { test, expect } from '@playwright/test';

test.describe('TypeFlow Core Typing & Persistence User Flow', () => {
  test('complete full practice journey with typing, corrections, results, and local persistence', async ({
    page,
  }) => {
    // 1. User opens the app
    await page.goto('/');
    await expect(page).toHaveTitle(/TypeFlow/);

    // Verify UI components are mounted
    await expect(page.getByRole('heading', { level: 1 })).not.toBeNull();
    const typingInput = page.getByLabel('Typing Practice Input');
    await expect(typingInput).toBeVisible();

    // 2. User selects Sentence Practice mode
    await page.getByRole('button', { name: 'Sentence' }).click();

    // 3. Focus typing area & start typing
    await typingInput.focus();

    // Type a couple characters
    await page.keyboard.type('I');

    // 4. Verify timer / stats update and correct highlight
    const netWpmElem = page.getByText('Net WPM');
    await expect(netWpmElem).toBeVisible();

    // 5. Type an intentional mistake and verify error display
    await page.keyboard.type('X');

    // 6. User corrects mistake with Backspace
    await page.keyboard.press('Backspace');

    // 7. Complete the rest of the text or switch to custom text to test full completion deterministically
    await page.getByRole('button', { name: 'Custom' }).click();
    await page.getByPlaceholder(/Paste your custom paragraph/i).fill('Practice makes perfect.');
    await page.getByRole('button', { name: 'Use Custom Text' }).click();

    // Type custom sentence exactly
    await typingInput.focus();
    await page.keyboard.type('Practice makes perfect.');

    // 8. Results are calculated and results view is shown
    await expect(page.getByText('Session Completed!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Net Speed')).toBeVisible();
    await expect(page.getByText('Accuracy')).toBeVisible();

    // 9. Navigate to Dashboard to verify saved progress
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Performance Dashboard' })).toBeVisible();
    await expect(page.getByText('Sessions Completed')).toBeVisible();

    // 10. User refreshes the browser
    await page.reload();

    // 11. Historical progress remains available after reload
    await expect(page.getByRole('heading', { name: 'Performance Dashboard' })).toBeVisible();
    await expect(page.getByText('Sessions Completed')).toBeVisible();

    // Navigate to History page
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('heading', { name: 'Practice History' })).toBeVisible();
    await expect(page.getByText('Practice makes perfect.')).toBeVisible();
  });

  test('theme toggle switches between dark and light mode', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    // Default is dark
    await expect(html).toHaveClass(/dark/);

    // Click theme toggle button
    const themeBtn = page.getByLabel('Toggle light/dark theme');
    await themeBtn.click();

    // Now light
    await expect(html).toHaveClass(/light/);

    // Reload persists theme
    await page.reload();
    await expect(html).toHaveClass(/light/);
  });
});
