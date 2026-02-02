### Prerequisites

NPM / Yarn and Node.js installed

### .env

In the server > .env file, you can find some information. Please use your own API key for future use, as this key may not work in the future.

```
BRAINTREE_MERCHANT_ID=your_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
```

### 🔑 Getting Braintree API Keys

To enable payment functionality, you need to configure your own Braintree API credentials.

#### Steps to get your Braintree API keys

1. Go to the official Braintree website
2. Create a **free Sandbox account** 
3. After logging in, navigate to:  
   **Account → Settings → API → API Keys**
4. Click **“Generate New API Key”** if none exists.
5. Copy your credentials:
   - **Merchant ID**
   - **Public Key**
   - **Private Key**
6. Add them to your `.env` file (inside the `server` folder):

   ```bash
   BRAINTREE_MERCHANT_ID=your_merchant_id_here
   BRAINTREE_PUBLIC_KEY=your_public_key_here
   BRAINTREE_PRIVATE_KEY=your_private_key_here
   ```

### Installing

Installing NPM modules on both client and server folders

Execute these commands from the project directory

```
cd client && npm install
```

```
cd server && npm install
```

### Running the app

Open a terminal on server directory

```
npm run start:dev
```

and open another terminal on client directory

```
npm run start
```

Access the web app at http://localhost:3000/
