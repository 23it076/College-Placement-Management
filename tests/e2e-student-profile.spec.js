/**
 * E2E test: Student profile edit flow
 * Prereqs: Backend (port 5000) and frontend (port 3000) running
 * Run: npx playwright test tests/e2e-student-profile.spec.js --reporter=line
 */

const { test, expect } = require('@playwright/test');

const uniqueEmail = `student-${Date.now()}@test.edu`;

test('full flow: signup -> profile -> edit -> save', async ({ page }) => {
    const report = { steps: [], failures: [], networkCalls: [] };

    page.on('request', (req) => {
        if (req.url().includes('/api/students/profile')) {
            report.networkCalls.push({
                type: 'request',
                method: req.method(),
                hasAuth: !!req.headers()['authorization'],
            });
        }
    });

    page.on('response', async (res) => {
        if (res.url().includes('/api/students/profile')) {
            let body = null;
            try {
                body = await res.json();
            } catch (_) {}
            report.networkCalls.push({
                type: 'response',
                method: res.request().method(),
                status: res.status(),
                body,
            });
        }
    });

    // 1) Navigate - will redirect to /login if not auth
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    report.steps.push('Navigated to http://localhost:3000/');

    if (page.url().includes('/login')) {
        await page.click('a[href="/register"]');
        await page.waitForURL('**/register');
    } else if (!page.url().includes('/register')) {
        await page.goto('http://localhost:3000/register');
    }

    report.steps.push('On register page');

    // Fill signup form using labels
    await page.getByLabel('Full Name').fill('Test Student');
    await page.getByLabel('Email Address').fill(uniqueEmail);
    await page.getByLabel('Department').fill('Computer Science');
    await page.getByLabel('CGPA').fill('8.75');
    await page.getByLabel(/Skills/).fill('React, Node.js, Python');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');

    report.steps.push('Filled signup form');

    await page.getByRole('button', { name: /Register|Creating/ }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const hasUser = await page.evaluate(() => {
        try {
            const u = JSON.parse(localStorage.getItem('user') || '{}');
            return !!u?.token;
        } catch (_) {
            return false;
        }
    });

    if (!hasUser) {
        const errText = await page.locator('[class*="red-500"]').first().textContent().catch(() => '');
        report.failures.push({
            step: 'Signup',
            error: 'JWT not in localStorage',
            onScreenError: errText,
        });
    } else {
        report.steps.push('JWT in localStorage');
    }

    // 2) Navigate to profile
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle' });
    report.steps.push('Navigated to /profile');

    await page.waitForSelector('h1:has-text("My Profile")', { timeout: 8000 });

    const hasError = await page.locator('.bg-red-500\\/10').isVisible();
    if (hasError) {
        const errText = await page.locator('.bg-red-500\\/10').textContent();
        report.failures.push({
            step: 'Load Profile',
            error: 'Profile failed to load',
            onScreenError: errText,
            network: report.networkCalls.filter((c) => c.type === 'response'),
        });
    } else {
        report.steps.push('Profile data loaded');
    }

    // 3) Edit Profile
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    report.steps.push('Clicked Edit Profile');

    await page.waitForTimeout(400);

    await page.getByLabel('Name').fill('Updated Student Name');
    await page.getByLabel('Email').fill(`updated-${uniqueEmail}`);
    await page.getByLabel('Department').fill('Information Technology');
    await page.getByLabel('CGPA').fill('9.2');
    await page.getByLabel(/Skills/).fill('React, Node.js, Python, MongoDB');
    await page.getByLabel(/Resume URL/).fill('https://example.com/resume.pdf');

    report.steps.push('Edited all fields');

    // 4) Save
    await page.getByRole('button', { name: 'Save Changes' }).click();
    report.steps.push('Clicked Save Changes');

    await page.waitForTimeout(2500);

    const saveErr = await page.locator('.bg-red-500\\/10').textContent().catch(() => '');
    if (saveErr) {
        report.failures.push({
            step: 'Save Profile',
            error: 'Save failed',
            onScreenError: saveErr.trim(),
            network: report.networkCalls.filter((c) => c.type === 'response'),
        });
    }

    const chipCount = await page.locator('.flex.flex-wrap.gap-2 span').count();
    if (chipCount > 0) report.steps.push('Skills shown as chips');

    // Report
    console.log('\n========== E2E REPORT: Student Profile Edit Flow ==========');
    console.log('Steps:', report.steps.join(' -> '));
    if (report.failures.length > 0) {
        console.log('\nFAILURES:');
        report.failures.forEach((f, i) => {
            console.log(`  ${i + 1}. ${f.step}: ${f.error}`);
            if (f.onScreenError) console.log('     On-screen:', f.onScreenError);
            f.network?.forEach((n) =>
                console.log(`     ${n.method} status=${n.status} body=${JSON.stringify(n?.body)}`)
            );
        });
    }
    console.log('\nProfile API:', JSON.stringify(report.networkCalls, null, 2));
    console.log('============================================================\n');

    expect(report.failures.length).toBe(0);
});
