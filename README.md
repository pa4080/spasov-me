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
* U; dev: [A Guide to Query Strings with React Router](https://ui.dev/react-router-query-strings)
* CSS-Tricks: [A Complete Guide to calc() in CSS](https://css-tricks.com/a-complete-guide-to-calc-in-css/)
* React Router Web Docs: [Scroll Restoration](https://v5.reactrouter.com/web/guides/scroll-restoration)
* Parallax at GitHub: [jsPDF](https://github.com/parallax/jsPDF)
* Stack Overflow: [Generate pdf from HTML in div using Javascript](https://stackoverflow.com/q/18191893/6543935)
* NPM: [Old Browser Detector](https://www.npmjs.com/package/old-browser-detector)
* Stack Overflow: [React app not working in Internet Explorer 11](https://stackoverflow.com/questions/56421417/react-app-not-working-in-internet-explorer-11)