# Metalevel.tech Home Page


## Production build and run

```bash
cd app && npm i && npm run build
```

```bash
mv /var/www/html{,.old}
mv ./build /var/www/html
```

## Development deploy and run

```bash
cd app
npm install
npm start
```

The React's dev web server, by default, will listen at `http://localhost:3000`. So on WSL2 you can use the following script to forward WSL:3000 to WindowsHost:3000.

```
./scripts/wsl-win-port-proxy.vlan.sh 3000 3000
```

