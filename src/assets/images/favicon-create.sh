#!/bin/bash
#convert -density 300 -define icon:auto-resize=256,128,96,64,48,32,16 -background none -bordercolor white -border 0 SVG/mlt.logo.svg favicon/favicon.ico
#convert -density 300 -define icon:auto-resize=64 -background none SVG/mlt.favicon.svg favicon/favicon.ico
# convert -density 300 -define icon:auto-resize=64 -background none SVG/mlt.favicon.svg favicon/favicon.ico
# convert -density 384 -background none SVG/mlt.favicon.icon.svg -resize 64 favicon/mlt.favicon.icon.ico
# convert -density 384 -background none SVG/mlt.favicon.svg -resize 64 favicon/favicon.ico
# convert -density 384 -background none SVG/mlt.favicon.circle.svg -resize 64 favicon/favicon.circle.ico

cp SVG/mlt.favicon.svg ../../../public/favicon.svg
convert -density 384 -background none SVG/mlt.favicon.svg -resize 64 ../../../public/favicon.ico
convert -density 384 -background none SVG/mlt.logo.svg -resize 192 ../../../public/logo192.png