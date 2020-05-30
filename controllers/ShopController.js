const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Home',
                path: '/',
            });
        })
        .catch((err) => {
            console.log('exports.getIndex -> err', err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/products', {
                prods: products,
                docTitle: 'Products',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log('exports.getIndex -> err', err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                docTitle: 'Product Details',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log('exports.getProduct -> err', err);
        });
    /* Alternate using 'where' and findAll() */
    // Product.findAll({ where: { id: prodId }}).then(products => {
    //     res.render('shop/product-detail', {
    //         product: products[0],
    //         docTitle: 'Product Details',
    //         path: '/products',
    //     });
    // }).catch(err => {
    //     console.log("exports.getProduct -> err", err)
    // })
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts();
        })
        .then((products) => {
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products: products,
            });
        })
        .catch((err) => {
            console.log('exports.getCart -> err', err);
        });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart, quantity;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            quantity = 1;
            if (product) {
                console.log('exports.postCart -> product', product);
                quantity = product.itemsCart.quantity + 1;
                return product;
                // product.getItemsCart().then((itemsCart) => {}).catch(err => {console.log(err)})
            }
            return Product.findByPk(productId);
        })
        .then((product) => {
            return fetchedCart.addProduct(product, {
                through: { quantity: quantity },
            });
        })
        .then((product) => {
            console.log('exports.postCart -> product', product);
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deleteCartItem = (req, res, next) => {
    const id = req.body.productId;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: id } });
        })
        .then((products) => {
            let product = products[0];
            return product.itemsCart.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
        .then((orders) => {
            res.render('shop/orders', {
                docTitle: 'Cart',
                path: '/orders',
                orders: orders,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            req.user
                .createOrder()
                .then((order) => {
                    return order.addProducts(
                        products.map((product) => {
                            product.itemsOrder = {
                                quantity: product.itemsCart.quantity,
                            };
                            // product.itemsCart.destroy();
                            return product;
                        })
                    );
                })
                .then((result) => {
                    fetchedCart.setProducts(null);
                    res.redirect('orders');
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout',
    });
};
