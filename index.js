const express = require('express');
const path = require('path');

require('dotenv').config()


const adminRoutes = require('./routes/admin/index.route');
const clientRouters = require("./routes/clients/index.route")

const variableConfig = require("./config/variable");

const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const database = require('./config/database');
const app = express();
const port = 3000;

//Cấu hình view engine Pug

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Cấu hình thư mục public để chứa CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, 'public')));
// Tạo biến toàn cục trong file PUG
app.locals.pathAdmin = variableConfig.pathAdmin;
// Tạo biến toàn cục trong các file backend
global.pathAdmin = variableConfig.pathAdmin;

//Cho phép gửi data dạng json
app.use(express.json());
// Sử dụng cookie-parser
app.use(cookieParser('SVACIIWQBC'));

app.use(session({ cookie: { maxAge: 60000 } })); // Thời gian sống (tối đa) của cookie
app.use(flash());

//thiết lập đường dẫn
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);

app.use("/", clientRouters)

app.listen(port, () => {
  console.log(`Website đang chạy tại http://localhost:${port}`);
});


