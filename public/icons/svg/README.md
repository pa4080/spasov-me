# Resources

* [Free QR code generator: `https://qr.io/`](https://qr.io/)
* [Free AI QR code generator: `https://openart.ai/apps/ai_qrcode`](https://openart.ai/apps/ai_qrcode)

## Convert command

The following command is used to minimize the AI generated QR code's JPG files.

```bash
for i in *jpg; do convert "$i" \
-sampling-factor 4:2:0 \
-strip \
-quality 85 \
-interlace Plane \
-gaussian-blur 0.05 \
-colorspace RGB \
"jpg/${i}"; done  
```

* Source: <https://dev.to/feldroy/til-strategies-for-compressing-jpg-files-with-imagemagick-5fn9>
