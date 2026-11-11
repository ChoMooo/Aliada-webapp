# Lector de fotos (OCR)

Archivos de Tesseract.js (licencia Apache 2.0) y su modelo de español, alojados acá para que la lectura
de boletas funcione en el dispositivo, sin mandar la foto a ningún servidor.

- `worker.min.js`: tesseract.js 7
- `tesseract-core-*.wasm.js`: tesseract.js-core (el celular baja solo el que le sirve)
- `spa.traineddata.gz`: modelo de español (tessdata 4.0.0 best_int)

Se bajan la primera vez que alguien usa "Foto de una boleta" (unos 6 MB) y después quedan guardados.
Para actualizarlos: copiarlos de nuevo desde `node_modules` (ver package.json).
