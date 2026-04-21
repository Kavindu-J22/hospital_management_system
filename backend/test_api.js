const http = require('http');

const testApi = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTY3NDVmNzdhZGIyOWMwZjU0YTQyMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjgwMTExNn0.TWr9L2w2I4yWZanhGQWGY_AgGJ8Ay7i7mpIigHLJSXo';
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/rooms',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log("Status:", res.statusCode);
            if (res.statusCode === 200) {
                const parsed = JSON.parse(data);
                if (parsed.success) {
                  console.log("Success! Rooms length:", parsed.data.length);
                } else {
                  console.log("API returned error:", parsed);
                }
            } else {
                console.log("Response:", data);
            }
        });
    });

    req.on('error', error => console.error(error));
    req.end();
};

testApi();
