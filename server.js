const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = 3000;

// Middleware để parse JSON request
app.use(express.json());
app.use(cors());
// Danh sách tài khoản mẫu
const users = [
    { id: 1, email: 'user1@example.com', password: 'password123' },
    { id: 2, email: 'user2@example.com', password: 'password456' },
    { id: 3, email: 'quan', password: 'quan' }
];
let products = [
    {
        "id": "1",
        "smart": [
            {
                "id": "1",
                "image": " ../assets/Data/smart1.png?raw=true",
                "title": "iPhone",
                "price": "$899",
                "category": "Best Sales"
            },
            {
                "id": "2",
                "image": " ../assets/Data/smart2.png?raw=true",
                "title": "SamSung",
                "price": "$898",
                "category": "Best Matched"
            },
            {
                "id": "3",
                "image": " ../assets/Data/smart3.png?raw=true",
                "title": "Xiaomi",
                "price": "$897",
                "category": "Popular"
            },
            {
                "id": "4",
                "image": " ../assets/Data/smart4.png?raw=true",
                "title": "Pixel",
                "price": "$1,099",
                "category": "Best Sales"
            },
            {
                "id": "5",
                "image": " ../assets/Data/smart5.png?raw=true",
                "title": "Oppo",
                "price": "$666",
                "category": "Best Matched"
            },
            {
                "id": "6",
                "image": " ../assets/Data/smart6.png?raw=true",
                "title": "Redmi",
                "price": "$555",
                "category": "Best Matched"
            }
        ],
        "id": "2",
        "ipad": [
            {
                "id": "1",
                "image": " ../assets/Data/ipad1.png?raw=true",
                "title": "iPad Pro 1",
                "price": "$1,799",
                "category": "Best Sales"
            },
            {
                "id": "2",
                "image": " ../assets/Data/ipad2.png?raw=true",
                "title": "iPad Pro 2",
                "price": "$1,222",
                "category": "Best Matched"
            },
            {
                "id": "3",
                "image": " ../assets/Data/ipad3.png?raw=true",
                "title": "iPad Pro 3",
                "price": "$1,345",
                "category": "Popular"
            },
            {
                "id": "4",
                "image": " ../assets/Data/ipad4.png?raw=true",
                "title": "iPad Pro 4",
                "price": "$999",
                "category": "Best Sales"
            },
            {
                "id": "5",
                "image": " ../assets/Data/ipad5.png?raw=true",
                "title": "iPad Pro 5",
                "price": "$1,245",
                "category": "Best Sales"
            },
            {
                "id": "6",
                "image": " ../assets/Data/ipad6.png?raw=true",
                "title": "iPad Pro 6",
                "price": "$744",
                "category": "Best Sales"
            }
        ],
        "id": "3",
        "macbook": [
            {
                "id": "1",
                "image": " ../assets/Data/macbook1.png?raw=true",
                "title": "MacBook Pro 1",
                "price": "$509",
                "category": "Best Sales"
            },
            {
                "id": "2",
                "image": " ../assets/Data/macbook2.png?raw=true",
                "title": "MacBook Pro 2",
                "price": "$492",
                "category": "Best Matched"
            },
            {
                "id": "3",
                "image": " ../assets/Data/macbook3.png?raw=true",
                "title": "MacBook Pro 3",
                "price": "$738",
                "category": "Popular"
            },
            {
                "id": "4",
                "image": " ../assets/Data/macbook4.png?raw=true",
                "title": "MacBook Pro 4",
                "price": "$956",
                "category": "Best Sales"
            },
            {
                "id": "5",
                "image": " ../assets/Data/macbook5.png?raw=true",
                "title": "MacBook Pro 5",
                "price": "$495",
                "category": "Best Sales"
            },
            {
                "id": "6",
                "image": " ../assets/Data/macbook4.png?raw=true",
                "title": "MacBook Pro 6",
                "price": "$145",
                "category": "Best Sales"
            }
        ]
    }

];
// Endpoint đăng nhập
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra thông tin đăng nhập
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});
app.get('/api/donuts', (req, res) => {
    res.json(users);
});
// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
app.get('/products', (req, res) => {
    res.json(products);
});