## Enhanced OAuth with Biometrics(Face Recognition)

OAuth is an open standard for access delegation, commonly used as a way for Internet users to grant websites or applications access to their information on other websites but without giving them the passwords.
Here, we add a layer of face recognition to Oauth.

## Purpose 
To ensure that the third party request is indeed genuine and not an automated request coming from a script or elsewhere. Thus, third party clients will now ask for users’ face. Username / Password based logins present in Oauth authorization will now be replaced with FaceID, thereby giving no chance for phishing attacks.

## Packages Used
face-api.js (for Face Recog.)
jsonwebtoken (for JWT access token)


## For Backend : To run Node.Js(Express)

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/rvram2000/BiOAuth.git
cd Backend
```

```bash
npm install
```

## Running 

To start the express server, run the following

```bash
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.


## For Frontend : To run react app

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3080](http://localhost:3080) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.


