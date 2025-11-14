# Stox Simulator Frontend

A full stack web app where users can practice stock trading with virtual money, track their portfolio, and see how their investments grow over time in a safe, interactive environment.

[Backend repository](https://github.com/katarina-andrews/stox-simulator-api)

[Live url](https://d39alz2z3bo4kk.cloudfront.net)

## Author

- Katarina Andrews

## Features

### Authentication

- Log in / Sign up with AWS Cognito.
- Users are authenticated using JWT tokens for secure access.

### Stock Section

- Displays a list of stocks from seed data.
- **Each stock shows:**
    - Name
    - Ticker Symbol
    - Price
    - Change Percentage
- Includes a Buy button to purchase stocks and add them to the portfolio.

### Portfolio Section
- **Add Cash:** Users can deposit virtual money into their portfolio.
- **View Transactions:** Access a complete history of buys and sells.
- **Portfolio Overview:**
    - Cash Balance
    - Holding Value (total value of owned stocks)
    - Total Portfolio Value (cash + holdings)
- **Holdings Section:**
    - Displays stocks owned by the user.
    - **Each holding shows:**
        - Ticker Symbol
        - Number of Shares
        - Price per Share
        - Change Percentage
- Includes a Sell button to liquidate stocks.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, AWS Lambda
- **Database:** DynamoDB
- **Authentication:** AWS Cognito (JWT)
- **Deployment:** AWS API Gateway, S3, CloudFront
