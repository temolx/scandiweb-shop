import { gql } from '@apollo/client';

const LOAD_ITEMS = gql`
query {
    Product {
        id
        name
        inStock
        gallery
        description
        category
        attributes
        prices
        brand
    }
}
`;
