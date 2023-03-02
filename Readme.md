### To setup the project

```
cd BTP2
pip3 install virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

### To run the project

```
cd BTP2
source venv/bin/activate
python3 wsgi.py
```

### To update the requirements

```
pip freeze > requirements.txt
```

### To deactivate the virtual environment

```
deactivate
```

### To install IPFS on MacOS

```
brew install ipfs
ipfs init
ipfs daemon
```

### To install Ganache on MacOS

```
Download the app from https://www.trufflesuite.com/ganache
Deploy the contract on Ganache network
Update the contract ID in block.py
```

### To install packages of Next.js

- Install Node.js

```
brew install node
```

- Install Yarn

```
npm install -g yarn
yarn install
yarn dev
```
