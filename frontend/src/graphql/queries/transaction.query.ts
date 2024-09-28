import {gql} from "@apollo/client"

export const GET_TRANSACTIONS =gql`

query GetTransactions{
    transactions{
     _id
    userId
    description
    paymentType
    category
    amount
    date
    location
    }
}
`