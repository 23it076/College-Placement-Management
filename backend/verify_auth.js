const http = require('http');

const testApi = (path, method, data) => {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonData),
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsedBody = body ? JSON.parse(body) : {};
                    resolve({ statusCode: res.statusCode, body: parsedBody });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(jsonData);
        req.end();
    });
};

async function runTests() {
    console.log('--- Auth API Verification ---');

    try {
        // 1. Test Signup
        console.log('\n[1] Testing Signup...');
        const signupData = {
            name: 'Verification Student',
            email: `verify_${Date.now()}@example.com`,
            password: 'password123',
            department: 'Computer Science',
            cgpa: 9.5,
            skills: ['Testing', 'Verification'],
            role: 'student'
        };
        const signupRes = await testApi('/auth/signup', 'POST', signupData);
        console.log('Status:', signupRes.statusCode);
        console.log('Body:', signupRes.body);

        if (signupRes.statusCode === 201 && signupRes.body.token) {
            console.log('✅ Signup Successful');

            // 2. Test Login
            console.log('\n[2] Testing Login...');
            const loginData = {
                email: signupData.email,
                password: signupData.password
            };
            const loginRes = await testApi('/auth/login', 'POST', loginData);
            console.log('Status:', loginRes.statusCode);
            console.log('Body:', loginRes.body);

            if (loginRes.statusCode === 200 && loginRes.body.token) {
                console.log('✅ Login Successful');
            } else {
                console.log('❌ Login Failed');
            }
        } else {
            console.log('❌ Signup Failed');
        }

        // 3. Test Invalid Login
        console.log('\n[3] Testing Invalid Login...');
        const invalidLoginRes = await testApi('/auth/login', 'POST', {
            email: signupData.email,
            password: 'wrongpassword'
        });
        console.log('Status:', invalidLoginRes.statusCode);
        if (invalidLoginRes.statusCode === 401) {
            console.log('✅ Invalid Login handled correctly (401)');
        } else {
            console.log('❌ Invalid Login handled incorrectly');
        }

    } catch (error) {
        console.error('Test execution failed:', error.message);
    }
}

runTests();
