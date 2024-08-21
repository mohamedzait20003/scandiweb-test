const backendDomain = "http://localhost:8000/graphql";

const SummaryApi = {
    Categories: {
        URL: `${backendDomain}`,
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
        URL: `${backendDomain}`,
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
        URL: `${backendDomain}`,
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
        URL: `${backendDomain}`,
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