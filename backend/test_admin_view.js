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
        console.log('\n[1] Testing Admin Login...');
        // We know from seed.js that admin@college.edu / adminpassword exists
        const loginData = {
            email: 'admin@college.edu',
            password: 'adminpassword'
        };
        const loginRes = await testApi('/auth/login', 'POST', loginData);
        console.log('Admin Login Status:', loginRes.statusCode);

        const token = loginRes.body.token;
        if (!token) {
            console.log('Failed to get admin token');
            return;
        }

        console.log('\n[2] Fetching Students List...');
        const studentsRes = await testApi('/students', 'GET', null, token);
        console.log('Fetch Students Status:', studentsRes.statusCode);

        if (studentsRes.body.length > 0) {
            const studentId = studentsRes.body[0]._id;
            console.log(`\n[3] Testing Get Student by ID (${studentId})...`);
            const detailsRes = await testApi(`/students/${studentId}`, 'GET', null, token);
            console.log('Get Details Status:', detailsRes.statusCode);
            console.log('Student Name:', detailsRes.body.name);

            if (detailsRes.statusCode === 200 && detailsRes.body.name) {
                console.log('✅ Admin View Student Details Successful');
            } else {
                console.log('❌ Admin View Student Details Failed');
            }
        } else {
            console.log('No students found to test view details');
        }

    } catch (error) {
        console.error('Test execution failed:', error.message);
    }
}

runTests();
