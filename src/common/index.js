export const backendDomain = process.env.REACT_APP_BACKEND_DOMAIN;

const SummaryApi = {
    Categories: {
        Query:`
            {
                categories {
                id
                name  
                }
            }
        `
    },
    AllProducts:{
        Query: `
            query getAllProducts {
                Products {
                Id
                name
                inStock
                description
                brand
                gallery {
                    id
                    image_url
                }
                price {
                    id
                    amount
                    currency_label
                    currency_symbol
                }
                AttributeSets {
                    Id
                    name
                    type
                    Items {
                    id
                    name
                    value
                    }
                }
                }
            }
        `
    },
    CategoryProducts: {
        Query: `
            query getProducts($category_name: String!) {
                Products(category_name: $category_name) {
                    Id
                    name
                    inStock
                    description
                    brand
                    gallery {
                        id
                        image_url
                    }
                    price {
                        id
                        amount
                        currency_label
                        currency_symbol
                    }
                    AttributeSets {
                        Id
                        name
                        type
                        Items {
                        id
                        name
                        value
                        }
                    }
                }
            }
        `
    },
    OrderMake: {
        Mutation: `
            mutation CreateOrder($order: OrderInput!) {
                createOrder(order: $order) {
                    status
                    message
                }
            }
        `
    }
};

export default SummaryApi;