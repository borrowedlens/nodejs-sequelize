const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-details', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false,
        // activeProduct: true, // For handlebars
        // productCss: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user
        .createProduct({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
        })
        .then((result) => {
            console.log('exports.postAddProduct -> result', result);
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postAddProduct -> err', err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user
        .getProducts({ where: { id: prodId } })
        .then((products) => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/product-details', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                edit: editMode,
                product: product,
            });
        })
        .catch((err) => {
            console.log('exports.getEditProduct -> err', err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(id)
        .then((product) => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            return product.save();
        })
        .then((result) => {
            console.log('exports.postEditProduct -> result', result);
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postEditProduct -> err', err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findByPk(id)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postDeleteProduct -> err', err);
        });
};

exports.getProductList = (req, res, next) => {
    req.user.getProducts()
        .then((products) => {
            res.render('admin/product-list', {
                prods: products,
                docTitle: 'Product-list: Admin',
                path: '/admin/product-list',
            });
        })
        .catch((err) => {
            console.log('exports.getProductList -> err', err);
        });
};
