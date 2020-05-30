const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/ErrorController');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const ItemsCart = require('./models/items-cart');
const Order = require('./models/order');
const ItemsOrder = require('./models/items-order');

const app = express();

/* For handlebars */

// app.engine('hbs', expressHbs({ layoutsDir: 'views/hbs/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// Or app.engine('handlebars', expressHbs({ layoutsDir: '/views/hbs/layouts', defaultLayout: 'main-layout'})); => looks for only .handlebars files

app.set('view engine', 'ejs');
app.set('views', 'views/ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log('err', err);
        });
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRouter);
app.use('/', errorController.get404Error);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: ItemsCart });
Product.belongsToMany(Cart, { through: ItemsCart });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: ItemsOrder });
Product.belongsToMany(Order, { through: ItemsOrder });

sequelize
    .sync()
    // .sync({ force: true })
    .then(() => {
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user) {
            return User.create({ name: 'Vivek', email: 'test@test.com' });
        }
        return user;
    })
    .then((user) => {
        user.getCart().then((cart) => {
            if (!cart) {
                return user.createCart();
            }
        });
    })
    .then((cart) => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log('err', err);
    });
