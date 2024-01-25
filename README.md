# Bad Kids Shop

# Your Next.js Project

Brief description of your Next.js project.

## Environment Variables

### Setting up Environment Variables

1. Create a `.env.local` file in the root of your project.

   ```plaintext
   // .env.local

   NEXT_PUBLIC_API_URL=https://api.example.com
   NEXT_PUBLIC_API_KEY=your-api-key


## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
  - [Setting up Environment Variables](#setting-up-environment-variables)
  - [Accessing Environment Variables](#accessing-environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

List any software or tools that need to be installed before running the project.

- [Node.js](https://nodejs.org/) (version x.x.x)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (choose one)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/leapwallet/bad-kids-shop.git
   ```

2. Navigate to the project directory:

   ```bash
   cd bad-kids-shop
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

## Environment Variables

Optional environament variables

```env
NEXT_PUBLIC_NODE_REST_ENDPOINT= // get from https://chains.cosmos.directory/stargaze
NEXT_PUBLIC_NODE_RPC_ENDPOINT= // get from https://chains.cosmos.directory/stargaze
NEXT_PUBLIC_STARGAZE_GRAPHQL_ENDPOINT= // https://graphql.mainnet.stargaze-apis.com/graphql

NEXT_PUBLIC_STARGAZE_MARKET_CONTRACT= //stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl
NEXT_PUBLIC_BAD_KIDS_COLLECTION_ID= //stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420
```

Mandatory environment variables for Social login support, connect with [capsule](https://usecapsule.com)

```
NEXT_PUBLIC_CAPSULE_KEY= 
NEXT_PUBLIC_CAPSULE_ENV=
```

Mandatory environment variable for wallet connect

```
NEXT_PUBLIC_WC_PROJECT_ID= 
```

### Setting up Environment Variables

1. Create a `.env.local` file in the root of your project.

   ```plaintext
   // .env.local

   NEXT_PUBLIC_NODE_REST_ENDPOINT=
   NEXT_PUBLIC_NODE_RPC_ENDPOINT=
   NEXT_PUBLIC_STARGAZE_GRAPHQL_ENDPOINT=
   NEXT_PUBLIC_STARGAZE_MARKET_CONTRACT=
   NEXT_PUBLIC_BAD_KIDS_COLLECTION_ID=

   
   NEXT_PUBLIC_WC_PROJECT_ID=
   NEXT_PUBLIC_CAPSULE_KEY= 
   NEXT_PUBLIC_CAPSULE_ENV=
  ```

## Usage

Explain how to run the project locally and any additional steps needed.

```bash
npm run dev
# or
yarn dev
```

This will start the development server, and you can view the app at `http://localhost:3000` in your browser.

## Contributing

Explain how others can contribute to your project. Include information about pull requests, issue reporting, coding standards, etc.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

## License

This project is licensed under the [License Name] - see the [LICENSE.MIT](LICENSE.MIT) file for details.