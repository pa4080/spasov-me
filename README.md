# Metalevel.tech Home Page
This is a homepage template for https://metalevel.tech.

## Production build and run

```bash
cd app && npm i && npm run build
```

```bash
mv /var/www/html{,.bak}
mv ./build /var/www/html
```

In my case I'm using the following script to sync a build, created on my dev machine to the remote production server.

```
npm run build-to-remote <passphrase>
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

## References

* PedroTech at YouTube: [React Router V6 Tutorial](https://youtu.be/UjHT_NKR_gU)