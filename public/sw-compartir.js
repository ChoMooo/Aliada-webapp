/* Recibir lo que otra app comparte con Aliada (Android: Compartir → Aliada).
   El celular manda un formulario a ./compartir; acá lo guardamos un momento en el dispositivo
   y abrimos la app en "Cargar sin escribir", que lo lee y lo borra. Nada sale del celular. */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'POST' || !/\/compartir$/.test(url.pathname)) return;
  event.respondWith((async () => {
    try {
      const datos = await event.request.formData();
      const caja = await caches.open('aliada-compartido');
      for (const k of await caja.keys()) await caja.delete(k);
      const texto = ['title', 'text', 'url'].map((k) => datos.get(k)).filter((v) => typeof v === 'string' && v.trim()).join('\n');
      if (texto) await caja.put('texto', new Response(texto, { headers: { 'content-type': 'text/plain; charset=utf-8' } }));
      let i = 0;
      for (const f of datos.getAll('archivos')) {
        if (!f || typeof f === 'string' || !f.size) continue;
        await caja.put('archivo-' + i++, new Response(f, { headers: { 'content-type': f.type || 'application/octet-stream', 'x-nombre': encodeURIComponent(f.name || 'archivo') } }));
      }
    } catch (e) { /* si algo falla, igual abrimos la app */ }
    return Response.redirect(new URL('./?compartido=1', url).href, 303);
  })());
});
