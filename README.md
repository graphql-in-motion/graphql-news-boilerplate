# GraphQL News  
This repository serves as the boilerplate for the GraphQL API that we'll construct together in [GraphQL in Motion](https://livevideo.manning.com/course/32/graphql-in-motion)

### Check node version should be more that 8.0
```
node -v
```

### Installation
```sh
git clone https://github.com/graphql-in-motion/graphql-news.git
cd graphql-news
npm i -g yarn
yarn install
```  
### create server
create a new folder, "server", that will contain the source of our API. Then, from there, let's go ahead and create a new "index.js" file in the server folder


### Running the Server
```sh
yarn start
```
### open in the browser

http://localhost:4000/graphql

### add nodemo
```
yarn add nodemon
```
```
"dev" : "nodemon --exec babel-node ./server/index.js"
```
```
yarn dev
```