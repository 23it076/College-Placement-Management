const http = require('http');

const testApi = (path, method, data, token) => {
    return new Promise((resolve, reject) => {
        const jsonData = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (jsonData) {
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

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
        if (jsonData) req.write(jsonData);
        req.end();
    });
};

async function runTests() {
    try {
        console.log('\n[1] Testing Signup...');
        const signupData = {
            name: 'Bug Hunter',
            email: `bug_${Date.now()}@example.com`,
            password: 'password123',
            department: 'CS',
            cgpa: 9.0,
            skills: ['Debugging'],
            role: 'student'
        };
        const signupRes = await testApi('/auth/signup', 'POST', signupData);
        console.log('Signup Status:', signupRes.statusCode);
        
        const token = signupRes.body.token;
        if (!token) {
            console.log('Failed to get token');
            return;
        }

        console.log('\n[2] Testing Profile Update...');
        const updateData = {
            name: 'Bug Hunter Fixed',
            skills: ['Debugging', 'Testing']
        };
        const updateRes = await testApi('/students/profile', 'PUT', updateData, token);
        console.log('Update Status:', updateRes.statusCode);
        console.log('Update Body:', JSON.stringify(updateRes.body, null, 2));

    } catch (error) {
        console.error('Test execution failed:', error.message);
    }
}

runTests();
