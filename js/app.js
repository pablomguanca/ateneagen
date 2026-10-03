(() => {
  const CLAVE = 'generador-propuestas-v1';
  const LOGO_MAX_ARCHIVO = 5 * 1024 * 1024;
  const LOGO_MAX_LINK = 40000;
  const PREFIJO = '#p=';

  const MODALIDADES = {
    unico: { cantidad: 'Cantidad', precio: 'Precio' },
    mensual: { cantidad: 'Cantidad', precio: 'Precio por mes' },
    hora: { cantidad: 'Horas', precio: 'Tarifa por hora' }
  };

  const ICONO_SUMAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg>';
  const ICONO_SUMADO = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';

  const FUENTES_TITULOS = [
    'Bebas Neue', 'Playfair Display', 'Poppins', 'Oswald', 'Raleway',
    'Inter', 'DM Sans', 'Space Grotesk', 'Outfit', 'Sora', 'Archivo Black'
  ];
  const FUENTES_CUERPO = [
    'Montserrat', 'Inter', 'Open Sans', 'Lato', 'Source Sans 3',
    'DM Sans', 'Nunito', 'Work Sans', 'Rubik', 'IBM Plex Sans'
  ];

  const TEMAS = {
    'elegante-oscuro': {
      nombre: 'Elegante oscuro', acento: '#C9A84C', modo: 'oscuro',
      fondo: '#06060A', fondo2: '#0E0E18', superficie: '#1A1A2E', superficieBorde: '#2A2A44',
      texto: '#F0EBE0', textoApagado: '#9E9688', textoTenue: '#5F5B66',
      fuenteTitulos: 'Bebas Neue', fuenteCuerpo: 'Montserrat'
    },
    'corporativo': {
      nombre: 'Corporativo', acento: '#2563EB', modo: 'claro',
      fondo: '#FFFFFF', fondo2: '#F8FAFC', superficie: '#E2E8F0', superficieBorde: '#CBD5E1',
      texto: '#0F172A', textoApagado: '#64748B', textoTenue: '#94A3B8',
      fuenteTitulos: 'Inter', fuenteCuerpo: 'Inter'
    },
    'moderno': {
      nombre: 'Moderno', acento: '#8B5CF6', modo: 'oscuro',
      fondo: '#0F172A', fondo2: '#1E293B', superficie: '#334155', superficieBorde: '#475569',
      texto: '#E2E8F0', textoApagado: '#94A3B8', textoTenue: '#64748B',
      fuenteTitulos: 'Space Grotesk', fuenteCuerpo: 'Inter'
    },
    'calido': {
      nombre: 'Cálido', acento: '#B45309', modo: 'claro',
      fondo: '#FFFBEB', fondo2: '#FEF3C7', superficie: '#F3E8D0', superficieBorde: '#E5D5B5',
      texto: '#292524', textoApagado: '#78716C', textoTenue: '#A8A29E',
      fuenteTitulos: 'Playfair Display', fuenteCuerpo: 'Lato'
    },
    'minimalista': {
      nombre: 'Minimalista', acento: '#18181B', modo: 'claro',
      fondo: '#FAFAFA', fondo2: '#F5F5F5', superficie: '#E5E5E5', superficieBorde: '#D4D4D4',
      texto: '#171717', textoApagado: '#737373', textoTenue: '#A3A3A3',
      fuenteTitulos: 'DM Sans', fuenteCuerpo: 'DM Sans'
    }
  };

  const uid = () => Math.random().toString(36).slice(2, 10);

  const hoyISO = () => {
    const d = new Date();
    const z = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  };

  const LISTAS = {
    objetivos: { ruta: 'objetivos', nombre: 'objetivo', nuevo: () => ({ id: uid(), texto: '' }) },
    servicios: { ruta: 'servicios', nombre: 'servicio', nuevo: () => ({ id: uid(), nombre: '', modalidad: 'unico', cantidad: 1, precio: 0, descripcion: '', entregables: '', opcional: false }) },
    etapas: { ruta: 'etapas', nombre: 'etapa', nuevo: () => ({ id: uid(), nombre: '', duracion: '', descripcion: '' }) },
    pagos: { ruta: 'inversion.pagos', nombre: 'pago', nuevo: () => ({ id: uid(), concepto: '', porcentaje: 0 }) }
  };

  const vacio = () => ({
    emisor: { nombre: '', rol: '', email: '', telefono: '', web: '', presentacion: '', logo: '' },
    cliente: { nombre: '', empresa: '', cargo: '' },
    propuesta: { titulo: '', numero: '', fecha: hoyISO(), validez: 15 },
    contexto: '',
    objetivos: [],
    servicios: [],
    etapas: [],
    inversion: { moneda: 'USD', descuento: 0, impuestoNombre: 'IVA', impuesto: 0, pagos: [] },
    condiciones: '',
    proximosPasos: '',
    opciones: { firmas: true, credito: true },
    tema: { preset: 'elegante-oscuro', acento: '#C9A84C', fuenteTitulos: 'Bebas Neue', fuenteCuerpo: 'Montserrat' }
  });

  const ejemplo = () => ({
    emisor: {
      nombre: 'Martina Ríos',
      rol: 'Diseño de marca y desarrollo web',
      email: 'hola@martinarios.com',
      telefono: '+54 9 11 5555-0142',
      web: 'martinarios.com',
      presentacion: 'Hace seis años diseño marcas y tiendas online para negocios independientes. Trabajo con pocos clientes a la vez para poder seguir cada proyecto de cerca, desde la primera reunión hasta el día del lanzamiento.',
      logo: ''
    },
    cliente: { nombre: 'Gastón Peralta', empresa: 'Almacén Botánico', cargo: 'Fundador' },
    propuesta: { titulo: 'Nueva identidad y tienda online', numero: 'P-2026-014', fecha: hoyISO(), validez: 15 },
    contexto: 'Almacén Botánico vende plantas, macetas y accesorios desde hace tres años en su local de Palermo. Casi todas las ventas pasan por el mostrador, y los pedidos que llegan por Instagram se toman a mano, por mensaje directo.\n\nLa marca se armó rápido al abrir y hoy no acompaña el crecimiento: el logo no se lee en tamaños chicos y cada pieza de comunicación se ve distinta.',
    objetivos: [
      { id: uid(), texto: 'Tener una identidad coherente en el local, las redes y el packaging.' },
      { id: uid(), texto: 'Vender online con stock, pagos y envíos resueltos, sin tomar pedidos a mano.' },
      { id: uid(), texto: 'Lanzar la tienda antes de las fiestas de fin de año.' }
    ],
    servicios: [
      { id: uid(), nombre: 'Diagnóstico y estrategia de marca', modalidad: 'unico', cantidad: 1, precio: 450, descripcion: 'Una sesión de trabajo juntos y un análisis de tu competencia y tus clientes para definir cómo tiene que verse y hablar la marca.', entregables: 'Documento de estrategia\nMapa de competidores\nTono de voz y mensajes clave', opcional: false },
      { id: uid(), nombre: 'Identidad visual', modalidad: 'unico', cantidad: 1, precio: 1200, descripcion: 'Un sistema visual pensado para funcionar igual de bien en el cartel del local, en Instagram y en la etiqueta de una maceta.', entregables: 'Logo y versiones reducidas\nPaleta de colores y tipografías\nPlantillas para redes sociales\nManual de marca en PDF', opcional: false },
      { id: uid(), nombre: 'Tienda online', modalidad: 'unico', cantidad: 1, precio: 2400, descripcion: 'Tienda con catálogo, carrito, pagos con tarjeta y transferencia, y envíos configurados. Queda lista para que cargues productos sin ayuda.', entregables: 'Diseño y desarrollo de la tienda\nCarga inicial de hasta 60 productos\nConfiguración de pagos y envíos\nCapacitación de una hora', opcional: false },
      { id: uid(), nombre: 'Fotografía de producto', modalidad: 'hora', cantidad: 8, precio: 45, descripcion: 'Sesión en el local, con fondo neutro y luz controlada, para el catálogo de la tienda.', entregables: 'Fotos editadas en alta resolución\nVersiones recortadas para la tienda', opcional: false },
      { id: uid(), nombre: 'Mantenimiento y contenido', modalidad: 'mensual', cantidad: 1, precio: 380, descripcion: 'Actualizaciones de la tienda, soporte y publicaciones mensuales para redes con la nueva identidad.', entregables: 'Soporte por mail y WhatsApp\nOcho piezas para redes por mes\nReporte mensual de ventas y visitas', opcional: false },
      { id: uid(), nombre: 'Campaña de lanzamiento', modalidad: 'unico', cantidad: 1, precio: 650, descripcion: 'Anuncios en Instagram durante las dos primeras semanas de la tienda para llevar visitas desde el primer día. La inversión en anuncios se paga aparte, directo a la plataforma.', entregables: 'Estrategia y piezas de la campaña\nConfiguración y seguimiento de anuncios\nInforme de resultados', opcional: true },
      { id: uid(), nombre: 'Packaging de marca', modalidad: 'unico', cantidad: 1, precio: 520, descripcion: 'Diseño de bolsas, etiquetas y tarjetas de agradecimiento con la nueva identidad, listos para imprenta.', entregables: 'Tres piezas de packaging\nArchivos listos para imprimir', opcional: true }
    ],
    etapas: [
      { id: uid(), nombre: 'Descubrimiento', duracion: '1 semana', descripcion: 'Reunión inicial, análisis de la competencia y definición de la estrategia.' },
      { id: uid(), nombre: 'Identidad visual', duracion: '3 semanas', descripcion: 'Primera propuesta, dos rondas de ajustes y entrega del manual de marca.' },
      { id: uid(), nombre: 'Tienda online', duracion: '4 semanas', descripcion: 'Diseño, desarrollo, sesión de fotos y carga de productos.' },
      { id: uid(), nombre: 'Lanzamiento', duracion: '1 semana', descripcion: 'Pruebas finales, publicación de la tienda y capacitación.' }
    ],
    inversion: {
      moneda: 'USD',
      descuento: 0,
      impuestoNombre: 'IVA',
      impuesto: 0,
      pagos: [
        { id: uid(), concepto: 'Al aceptar la propuesta', porcentaje: 40 },
        { id: uid(), concepto: 'Al entregar la identidad visual', porcentaje: 30 },
        { id: uid(), concepto: 'Al publicar la tienda', porcentaje: 30 }
      ]
    },
    condiciones: 'Cada entrega incluye dos rondas de cambios. Las rondas adicionales se cotizan aparte.\nLos plazos corren desde el primer pago y la recepción de los materiales necesarios: textos, fotos y accesos.\nEl dominio, el hosting y la plataforma de la tienda quedan a nombre del cliente y se abonan por separado.\nEl servicio mensual se contrata por un mínimo de tres meses y se cancela con 30 días de aviso.\nCon el pago completo, todos los archivos finales pasan a ser del cliente.',
    proximosPasos: 'Aceptar la propuesta desde este link.\nAbonar el primer pago para reservar la fecha de inicio.\nAgendar la reunión de descubrimiento de la primera semana.',
    opciones: { firmas: true, credito: true },
    tema: { preset: 'elegante-oscuro', acento: '#C9A84C', fuenteTitulos: 'Bebas Neue', fuenteCuerpo: 'Montserrat' }
  });

  const $ =(sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const obtener = (obj, ruta) => ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const asignar = (obj, ruta, valor) => {
    const claves = ruta.split('.');
    const ultima = claves.pop();
    const destino = claves.reduce((o, k) => (o[k] ??= {}), obj);
    destino[ultima] = valor;
  };

  const numero = v => {
    const n = parseFloat(String(v ?? '').replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const texto = v => (typeof v === 'string' ? v : v == null ? '' : String(v));

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const lineas = t => texto(t).split('\n').map(l => l.replace(/^[\s\-•*·]+/, '').trim()).filter(Boolean);

  const parrafos = t => texto(t)
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

  const dinero = (n, moneda) => {
    const decimales = Math.round(n * 100) % 100 !== 0 ? 2 : 0;
    try {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda, minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n);
    } catch {
      return `${moneda} ${n.toFixed(decimales)}`;
    }
  };

  const cantidadTexto = n => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(n);

  const desdeISO = iso => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return null;
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d);
  };

  const fechaLarga = fecha => (fecha ? fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

  const normalizar = datos => {
    const base = vacio();
    const d = datos && typeof datos === 'object' ? datos : {};
    const lista = (arr, nuevo) => (Array.isArray(arr) ? arr.filter(x => x && typeof x === 'object').map(x => ({ ...nuevo(), ...x, id: x.id || uid() })) : []);
    const limpiar = (obj, molde) => Object.fromEntries(Object.entries(molde).map(([k, v]) => [k, typeof v === 'string' ? texto(obj?.[k] ?? v) : (obj?.[k] ?? v)]));
    const n = {
      emisor: limpiar(d.emisor, base.emisor),
      cliente: limpiar(d.cliente, base.cliente),
      propuesta: limpiar(d.propuesta, base.propuesta),
      contexto: texto(d.contexto),
      objetivos: lista(d.objetivos, LISTAS.objetivos.nuevo),
      servicios: lista(d.servicios, LISTAS.servicios.nuevo),
      etapas: lista(d.etapas, LISTAS.etapas.nuevo),
      inversion: { ...limpiar(d.inversion, base.inversion), pagos: lista(d.inversion?.pagos, LISTAS.pagos.nuevo) },
      condiciones: texto(d.condiciones),
      proximosPasos: texto(d.proximosPasos),
      opciones: { ...base.opciones, ...(d.opciones || {}) },
      tema: { ...base.tema, ...(d.tema && typeof d.tema === 'object' ? d.tema : {}) }
    };
    if (!TEMAS[n.tema.preset]) n.tema.preset = 'elegante-oscuro';
    n.servicios.forEach(s => {
      ['nombre', 'descripcion', 'entregables'].forEach(k => { s[k] = texto(s[k]); });
      if (!MODALIDADES[s.modalidad]) s.modalidad = 'unico';
    });
    n.objetivos.forEach(o => { o.texto = texto(o.texto); });
    n.etapas.forEach(e => ['nombre', 'duracion', 'descripcion'].forEach(k => { e[k] = texto(e[k]); }));
    n.inversion.pagos.forEach(p => { p.concepto = texto(p.concepto); });
    if (!/^data:image\//.test(n.emisor.logo)) n.emisor.logo = '';
    return n;
  };

  const cargarGuardado = () => {
    try {
      const crudo = localStorage.getItem(CLAVE);
      return crudo ? normalizar(JSON.parse(crudo)) : null;
    } catch {
      return null;
    }
  };

  let estado = vacio();
  let seleccion = new Set();
  let esCliente = false;
  let vista = 'escritorio';
  let imprimiendo = false;

  const totalServicio = s => numero(s.cantidad) * numero(s.precio);
  const servicioConContenido = s => s.nombre.trim() || numero(s.precio) > 0;
  const cuenta = s => !s.opcional || seleccion.has(s.id);

  const calcular = () => {
    let inicial = 0;
    let mensual = 0;
    estado.servicios.forEach(s => {
      if (!cuenta(s)) return;
      if (s.modalidad === 'mensual') mensual += totalServicio(s);
      else inicial += totalServicio(s);
    });
    const descuento = Math.min(Math.max(numero(estado.inversion.descuento), 0), 100) / 100;
    const impuesto = Math.max(numero(estado.inversion.impuesto), 0) / 100;
    const bloque = base => {
      const desc = base * descuento;
      const neto = base - desc;
      const imp = neto * impuesto;
      return { base, desc, imp, total: neto + imp };
    };
    return { inicial: bloque(inicial), mensual: bloque(mensual), descuento, impuesto };
  };

  const vigencia = () => {
    const fecha = desdeISO(estado.propuesta.fecha);
    const dias = Math.max(0, Math.round(numero(estado.propuesta.validez)));
    if (!fecha || !dias) return { fecha, vence: null, restantes: null, vencida: false };
    const vence = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const restantes = Math.round((vence - hoy) / 86400000);
    return { fecha, vence, restantes, vencida: restantes < 0 };
  };

  const digitosWhatsApp = () => estado.emisor.telefono.replace(/\D/g, '');

  const enlaceWhatsApp = mensaje => {
    const d = digitosWhatsApp();
    return d.length >= 8 ? `https://wa.me/${d}?text=${encodeURIComponent(mensaje)}` : '';
  };

  const enlaceEmail = (asunto, mensaje) => {
    const mail = estado.emisor.email.trim();
    return mail ? `mailto:${mail}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}` : '';
  };

  const nombreEmisor = () => estado.emisor.nombre.trim();
  const tituloPropuesta = () => estado.propuesta.titulo.trim() || 'la propuesta';

  const mensajeConsulta = () => `Hola${nombreEmisor() ? ` ${nombreEmisor().split(' ')[0]}` : ''}, tengo una consulta sobre la propuesta «${tituloPropuesta()}».`;

  const enlaceConsulta = () => enlaceWhatsApp(mensajeConsulta()) || enlaceEmail(`Consulta sobre ${tituloPropuesta()}`, mensajeConsulta());

  const elAviso = $('#aviso');
  let temporizadorAviso;
  const avisar = (mensaje, ms = 4200) => {
    elAviso.textContent = mensaje;
    elAviso.classList.add('aviso--visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => elAviso.classList.remove('aviso--visible'), ms);
  };

  let temporizadorGuardado;
  let avisoCupo = false;
  const guardarLuego = () => {
    if (esCliente) return;
    clearTimeout(temporizadorGuardado);
    temporizadorGuardado = setTimeout(() => {
      const elEstado = $('#estado-guardado');
      try {
        localStorage.setItem(CLAVE, JSON.stringify(estado));
        elEstado.textContent = 'Cambios guardados en este navegador.';
      } catch {
        elEstado.textContent = 'No se pudo guardar en este navegador. Usá «Guardar borrador» para no perder los cambios.';
        if (!avisoCupo) {
          avisoCupo = true;
          avisar('No se pudo guardar en este navegador. Descargá el borrador para no perder los cambios.');
        }
      }
    }, 400);
  };

  const plantillaControles = $('#tpl-controles');

  const actualizarItemServicio = (nodo, s) => {
    const modo = MODALIDADES[s.modalidad] || MODALIDADES.unico;
    $('[data-etiqueta-cantidad]', nodo).textContent = modo.cantidad;
    $('[data-etiqueta-precio]', nodo).textContent = modo.precio;
    const sufijo = s.modalidad === 'mensual' ? ' por mes' : '';
    $('[data-subtotal]', nodo).textContent = dinero(totalServicio(s), estado.inversion.moneda) + sufijo;
    nodo.classList.toggle('item--opcional', !!s.opcional);
  };

  const renderLista = nombre => {
    const conf = LISTAS[nombre];
    const contenedor = $(`.lista[data-lista="${nombre}"]`);
    const plantilla = $(`#tpl-${nombre}`);
    const arr = obtener(estado, conf.ruta);
    const nodos = arr.map((item, i) => {
      const nodo = plantilla.content.firstElementChild.cloneNode(true);
      nodo.dataset.indice = i;
      $$('[data-item]', nodo).forEach(el => {
        const v = item[el.dataset.item];
        if (el.type === 'checkbox') el.checked = !!v;
        else el.value = v ?? '';
      });
      const orden = $('[data-orden]', nodo);
      if (orden) orden.textContent = i + 1;
      const controles = $('[data-controles]', nodo);
      controles.append(plantillaControles.content.cloneNode(true));
      const [subir, bajar, quitar] = controles.children;
      subir.disabled = i === 0;
      bajar.disabled = i === arr.length - 1;
      subir.setAttribute('aria-label', `Subir ${conf.nombre} ${i + 1}`);
      bajar.setAttribute('aria-label', `Bajar ${conf.nombre} ${i + 1}`);
      quitar.setAttribute('aria-label', `Quitar ${conf.nombre} ${i + 1}`);
      if (nombre === 'servicios') actualizarItemServicio(nodo, item);
      return nodo;
    });
    contenedor.replaceChildren(...nodos);
  };

  const renderListas = () => Object.keys(LISTAS).forEach(renderLista);

  const actualizarSubtotales = () => {
    $$('.lista[data-lista="servicios"] > .item').forEach(nodo => {
      const s = estado.servicios[Number(nodo.dataset.indice)];
      if (s) actualizarItemServicio(nodo, s);
    });
  };

  const actualizarAvisoPagos = () => {
    const el = $('#aviso-pagos');
    const pagos = estado.inversion.pagos;
    const suma = Math.round(pagos.reduce((t, p) => t + numero(p.porcentaje), 0) * 100) / 100;
    el.hidden = !pagos.length || suma === 100;
    if (!el.hidden) el.textContent = `Los porcentajes suman ${cantidadTexto(suma)}%. Ajustalos para que lleguen a 100%.`;
  };

  const actualizarLogo = () => {
    const logo = estado.emisor.logo;
    const vistaLogo = $('#logo-vista');
    vistaLogo.hidden = !logo;
    if (logo) vistaLogo.src = logo;
    else vistaLogo.removeAttribute('src');
    $('#logo-quitar').hidden = !logo;
    $('#logo-texto').textContent = logo ? 'Cambiar logo' : 'Subir logo';
  };

  const llenarFormulario = () => {
    $$('[data-campo]').forEach(el => {
      const v = obtener(estado, el.dataset.campo);
      if (el.type === 'checkbox') el.checked = !!v;
      else el.value = v ?? '';
    });
    actualizarLogo();
    renderListas();
    llenarTemaEditor();
  };

  const vacioHTML = t => `<span class="doc__vacio">${esc(t)}</span>`;

  const servicioHTML = (s, moneda, web) => {
    const precio = numero(s.precio);
    const cantidad = numero(s.cantidad);
    let modo = 'Pago único';
    if (s.modalidad === 'mensual') modo = cantidad === 1 ? 'por mes' : `${cantidadTexto(cantidad)} × ${dinero(precio, moneda)} por mes`;
    else if (s.modalidad === 'hora') modo = `${cantidadTexto(cantidad)} h × ${dinero(precio, moneda)}`;
    else if (cantidad !== 1) modo = `${cantidadTexto(cantidad)} × ${dinero(precio, moneda)}`;
    const sumado = s.opcional && seleccion.has(s.id);
    if (sumado && !web) modo += ', sumado por el cliente';
    const entregables = lineas(s.entregables);
    const boton = web && s.opcional
      ? `<button type="button" class="servicio__sumar" data-accion="sumar" data-id="${esc(s.id)}" aria-pressed="${sumado}">${sumado ? `${ICONO_SUMADO} Sumado a la propuesta` : `${ICONO_SUMAR} Sumar a la propuesta`}</button>`
      : '';
    return `
      <div class="servicio">
        <div class="servicio__cabecera">
          <h3 class="servicio__nombre">${s.nombre.trim() ? esc(s.nombre) : vacioHTML('Servicio sin nombre')}</h3>
          <p class="servicio__precio">${dinero(totalServicio(s), moneda)}<span class="servicio__modo">${esc(modo)}</span></p>
        </div>
        ${s.descripcion.trim() ? `<p class="servicio__desc">${esc(s.descripcion.trim()).replace(/\n/g, '<br>')}</p>` : ''}
        ${entregables.length ? `<ul class="doc-lista">${entregables.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${boton}
      </div>`;
  };

  const filasResumen = (b, c, sufijo = '') => {
    const filas = [];
    const m = estado.inversion.moneda;
    if (c.descuento > 0 || c.impuesto > 0) filas.push(['Subtotal', dinero(b.base, m)]);
    if (c.descuento > 0) filas.push([`Descuento (${cantidadTexto(c.descuento * 100)}%)`, `−${dinero(b.desc, m)}`]);
    if (c.impuesto > 0) filas.push([`${estado.inversion.impuestoNombre.trim() || 'Impuestos'} (${cantidadTexto(c.impuesto * 100)}%)`, dinero(b.imp, m)]);
    return `
      <dl class="resumen__filas">
        ${filas.map(([a, v]) => `<div class="resumen__fila"><dt>${esc(a)}</dt><dd>${v}</dd></div>`).join('')}
        <div class="resumen__fila resumen__fila--total"><dt>Total</dt><dd>${dinero(b.total, m)}${sufijo ? `<span class="resumen__sufijo"> ${sufijo}</span>` : ''}</dd></div>
      </dl>`;
  };

  const textoRestantes = n => (n === 0 ? 'Vence hoy' : n === 1 ? 'Queda 1 día' : `Quedan ${n} días`);

  const barraClienteHTML = (c, vig) => {
    const m = estado.inversion.moneda;
    if (c.inicial.base <= 0 && c.mensual.base <= 0) return '';
    let etiqueta;
    let monto;
    let extra = '';
    if (c.inicial.base > 0) {
      etiqueta = c.mensual.base > 0 ? 'Inversión inicial' : 'Inversión total';
      monto = dinero(c.inicial.total, m);
      if (c.mensual.base > 0) extra = `+ ${dinero(c.mensual.total, m)} por mes`;
    } else {
      etiqueta = 'Servicio mensual';
      monto = dinero(c.mensual.total, m);
      extra = 'por mes';
    }
    const consulta = enlaceConsulta();
    const accion = vig.vencida
      ? (consulta ? `<a class="boton boton--primario" href="${esc(consulta)}" target="_blank" rel="noopener" data-enlace-cliente>Pedir una actualización</a>` : '')
      : `<button type="button" class="boton boton--primario" data-accion="aceptar">Aceptar propuesta</button>`;
    return `
      <div class="barra-cliente">
        <div>
          <span class="barra-cliente__etiqueta">${etiqueta}</span>
          <span class="barra-cliente__monto">${monto}</span>
          ${extra ? `<span class="barra-cliente__extra">${extra}</span>` : ''}
        </div>
        ${accion}
      </div>`;
  };

  const cierreHTML = vig => {
    const consulta = enlaceConsulta();
    const emisor = nombreEmisor();
    if (vig.vencida) {
      return `
        <div class="cierre">
          <p class="cierre__titulo">Esta propuesta venció</p>
          <p class="cierre__texto">Los valores y plazos pueden haber cambiado. Pedile ${emisor ? `a ${esc(emisor)} ` : ''}una versión actualizada.</p>
          ${consulta ? `<div class="cierre__acciones"><a class="boton boton--primario boton--grande" href="${esc(consulta)}" target="_blank" rel="noopener" data-enlace-cliente>Pedir una actualización</a></div>` : ''}
        </div>`;
    }
    return `
      <div class="cierre">
        <p class="cierre__titulo">¿Avanzamos?</p>
        <p class="cierre__texto">Al aceptar se abre un mensaje con el resumen de lo que elegiste${emisor ? `, listo para mandárselo a ${esc(emisor)}` : ''}.</p>
        <div class="cierre__acciones">
          <button type="button" class="boton boton--primario boton--grande" data-accion="aceptar">Aceptar propuesta</button>
          ${consulta ? `<a class="boton boton--secundario boton--grande" href="${esc(consulta)}" target="_blank" rel="noopener" data-enlace-cliente>Hacer una consulta</a>` : ''}
        </div>
      </div>`;
  };

  let observador;
  const OBS_SEL = '.bloque, .resumen, .cierre, .pie, .doc-aviso';
  const HIJO_SEL = '.servicio, .etapa';
  const observarElementos = raiz => {
    if (observador) observador.disconnect();
    const todos = raiz.querySelectorAll(`${OBS_SEL}, ${HIJO_SEL}`);
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      todos.forEach(el => el.classList.add('visible'));
      return;
    }
    const scrollRoot = esCliente ? null : raiz.closest('.visor');
    observador = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.querySelectorAll(HIJO_SEL).forEach((h, i) => {
            h.style.transitionDelay = `${i * 0.08}s`;
            h.classList.add('visible');
          });
          observador.unobserve(entry.target);
        }
      });
    }, { root: scrollRoot, rootMargin: '0px 0px 300px 0px', threshold: 0.01 });
    const viewH = scrollRoot ? scrollRoot.clientHeight : window.innerHeight;
    const rootTop = scrollRoot ? scrollRoot.getBoundingClientRect().top : 0;
    const targets = raiz.querySelectorAll(OBS_SEL);
    let delay = 0;
    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      const enVista = rect.top - rootTop < viewH;
      if (enVista) {
        el.style.transitionDelay = `${delay}s`;
        delay += 0.07;
        el.querySelectorAll(HIJO_SEL).forEach((h, i) => {
          h.style.transitionDelay = `${delay + i * 0.08}s`;
        });
      }
      observador.observe(el);
    });
  };

  const hexARgb = hex => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };

  const rgbAHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

  const mezclar = (hex, blanco, t) => {
    const [r, g, b] = hexARgb(hex);
    const f = blanco ? 255 : 0;
    return rgbAHex(r + (f - r) * t, g + (f - g) * t, b + (f - b) * t);
  };

  const conAlpha = (hex, a) => { const [r, g, b] = hexARgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; };

  const luminancia = hex => { const [r, g, b] = hexARgb(hex).map(v => v / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

  const fuentesEnUso = new Set();
  const cargarFuente = nombre => {
    if (fuentesEnUso.has(nombre)) return;
    fuentesEnUso.add(nombre);
    const pesos = nombre === 'Bebas Neue' || nombre === 'Archivo Black' ? '400' : '400;500;700';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(nombre)}:wght@${pesos}&display=swap`;
    document.head.append(link);
  };

  const aplicarTema = doc => {
    const t = estado.tema;
    const preset = TEMAS[t.preset] || TEMAS['elegante-oscuro'];
    const acento = t.acento || preset.acento;
    const esClaro = preset.modo === 'claro';

    doc.style.setProperty('--negro', preset.fondo);
    doc.style.setProperty('--negro-2', preset.fondo2);
    doc.style.setProperty('--superficie', preset.superficie);
    doc.style.setProperty('--superficie-borde', preset.superficieBorde);
    doc.style.setProperty('--marfil', preset.texto);
    doc.style.setProperty('--marfil-apagado', preset.textoApagado);
    doc.style.setProperty('--marfil-tenue', preset.textoTenue);

    doc.style.setProperty('--dorado', acento);
    doc.style.setProperty('--dorado-claro', mezclar(acento, true, 0.3));
    doc.style.setProperty('--dorado-papel', mezclar(acento, false, 0.2));
    doc.style.setProperty('--dorado-tenue', conAlpha(acento, 0.32));
    doc.style.setProperty('--dorado-fondo', conAlpha(acento, 0.1));

    const ft = t.fuenteTitulos || preset.fuenteTitulos;
    const fc = t.fuenteCuerpo || preset.fuenteCuerpo;
    cargarFuente(ft);
    cargarFuente(fc);
    doc.style.setProperty('--fuente-display', `'${ft}', 'Georgia', serif`);
    doc.style.setProperty('--fuente-texto', `'${fc}', 'Helvetica Neue', Arial, sans-serif`);

    if (esClaro) {
      const portadaBg = mezclar(acento, false, 0.7);
      const portadaTexto = luminancia(portadaBg) > 0.4 ? '#111111' : '#F5F5F0';
      doc.style.setProperty('--portada-fondo', portadaBg);
      doc.style.setProperty('--portada-texto', portadaTexto);
      doc.style.setProperty('--portada-acento', mezclar(acento, true, 0.15));
      doc.style.setProperty('--portada-apagado', conAlpha(portadaTexto, 0.55));
      doc.style.setProperty('--portada-borde', conAlpha(acento, 0.25));
      doc.style.setProperty('--portada-linea', conAlpha(portadaTexto, 0.18));
      doc.style.setProperty('--portada-acento-claro', mezclar(acento, true, 0.3));

      doc.style.setProperty('--papel', preset.fondo);
      doc.style.setProperty('--tinta', preset.texto);
      doc.style.setProperty('--tinta-suave', preset.textoApagado);
      doc.style.setProperty('--tinta-tenue', preset.textoTenue);
      doc.style.setProperty('--linea-papel', preset.superficie);
    } else {
      doc.style.removeProperty('--portada-fondo');
      doc.style.removeProperty('--portada-texto');
      doc.style.removeProperty('--portada-acento');
      doc.style.removeProperty('--portada-apagado');
      doc.style.removeProperty('--portada-borde');
      doc.style.removeProperty('--portada-linea');
      doc.style.removeProperty('--portada-acento-claro');
    }
  };

  const renderDocumento = () => {
    const web = !imprimiendo && (esCliente || vista !== 'pdf');
    const doc = $('#documento');
    doc.classList.toggle('doc--web', web);
    aplicarTema(doc);
    const s = estado;
    const m = s.inversion.moneda;
    const c = calcular();
    const e = s.emisor;
    const cl = s.cliente;
    const p = s.propuesta;
    const vig = vigencia();
    const destinatario = cl.empresa.trim() || cl.nombre.trim();

    const marca = e.logo
      ? `<img class="portada__logo" src="${esc(e.logo)}" alt="${esc(e.nombre || 'Logo')}">`
      : `<span class="portada__marca">${e.nombre.trim() ? esc(e.nombre) : vacioHTML('Tu marca')}</span>`;

    const meta = [];
    if (cl.nombre.trim() || cl.empresa.trim()) {
      const sec = [cl.cargo.trim(), cl.empresa.trim() && cl.nombre.trim() ? cl.empresa.trim() : ''].filter(Boolean).join(', ');
      meta.push(['Preparada para', `${esc(cl.nombre.trim() || cl.empresa.trim())}${sec ? `<span>${esc(sec)}</span>` : ''}`]);
    }
    if (e.nombre.trim()) meta.push(['Preparada por', `${esc(e.nombre)}${e.rol.trim() ? `<span>${esc(e.rol)}</span>` : ''}`]);
    if (vig.fecha) meta.push(['Fecha', esc(fechaLarga(vig.fecha))]);
    if (vig.vence) {
      if (web && vig.vencida) meta.push(['Venció el', esc(fechaLarga(vig.vence))]);
      else {
        const urgente = web && vig.restantes !== null && vig.restantes <= 30 ? `<span class="portada__urgente">${textoRestantes(vig.restantes)}</span>` : '';
        meta.push(['Válida hasta', `${esc(fechaLarga(vig.vence))}${urgente}`]);
      }
    }

    const portada = `
      <section class="portada" aria-label="Portada">
        <div class="portada__superior">
          ${marca}
          ${p.numero.trim() ? `<p class="portada__numero">Propuesta ${esc(p.numero)}</p>` : ''}
        </div>
        <div class="portada__centro">
          <p class="portada__para">${destinatario ? `Propuesta para ${esc(destinatario)}` : 'Propuesta comercial'}</p>
          <h1 class="portada__titulo">${p.titulo.trim() ? esc(p.titulo) : vacioHTML('Título de la propuesta')}</h1>
          <hr class="portada__regla">
        </div>
        ${meta.length ? `<dl class="portada__meta">${meta.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>` : ''}
      </section>`;

    const bloques = [];

    if (e.presentacion.trim()) {
      bloques.push({ titulo: e.nombre.trim() ? `Sobre ${e.nombre.trim()}` : 'Quién presenta esta propuesta', html: parrafos(e.presentacion) });
    }

    if (s.contexto.trim()) bloques.push({ titulo: 'El punto de partida', html: parrafos(s.contexto) });

    const objetivos = s.objetivos.filter(o => o.texto.trim());
    if (objetivos.length) {
      bloques.push({ titulo: 'Qué queremos lograr', html: `<ul class="doc-lista">${objetivos.map(o => `<li>${esc(o.texto.trim())}</li>`).join('')}</ul>` });
    }

    const incluidos = s.servicios.filter(x => !x.opcional && servicioConContenido(x));
    const opcionales = s.servicios.filter(x => x.opcional && servicioConContenido(x));
    if (incluidos.length || opcionales.length) {
      let html = incluidos.map(x => servicioHTML(x, m, web)).join('');
      if (opcionales.length) {
        const [primero, ...resto] = opcionales;
        const nota = web
          ? 'No están incluidos en la inversión. Sumá los que quieras y el total se actualiza en el momento.'
          : 'No están incluidos en la inversión, salvo los que figuran como sumados. Se pueden agregar en cualquier momento del proyecto.';
        html += `
          <div class="doc-grupo">
            <h3 class="doc-subtitulo">Para sumar, si querés</h3>
            <p class="doc-nota">${nota}</p>
            ${servicioHTML(primero, m, web)}
          </div>
          ${resto.map(x => servicioHTML(x, m, web)).join('')}`;
      }
      bloques.push({ titulo: 'Qué incluye la propuesta', html });
    }

    const etapas = s.etapas.filter(x => x.nombre.trim() || x.descripcion.trim() || x.duracion.trim());
    if (etapas.length) {
      bloques.push({
        titulo: 'Cómo vamos a trabajar',
        html: `<ol class="etapas">${etapas.map((x, i) => `
          <li class="etapa">
            <span class="etapa__num" aria-hidden="true">${i + 1}</span>
            <div>
              <p class="etapa__nombre">${x.nombre.trim() ? esc(x.nombre) : vacioHTML('Etapa sin nombre')}</p>
              ${x.descripcion.trim() ? `<p class="etapa__desc">${esc(x.descripcion.trim())}</p>` : ''}
            </div>
            <p class="etapa__duracion">${esc(x.duracion.trim())}</p>
          </li>`).join('')}</ol>`
      });
    }

    if (c.inicial.base > 0 || c.mensual.base > 0) {
      const columnas = [];
      if (c.inicial.base > 0) columnas.push(`<div><h3 class="resumen__titulo">${c.mensual.base > 0 ? 'Inversión inicial' : 'Inversión total'}</h3>${filasResumen(c.inicial, c)}</div>`);
      if (c.mensual.base > 0) columnas.push(`<div><h3 class="resumen__titulo">Servicio mensual</h3>${filasResumen(c.mensual, c, 'por mes')}</div>`);
      let html = `<div class="resumen">${columnas.join('')}</div>`;
      const pagos = s.inversion.pagos.filter(x => x.concepto.trim() || numero(x.porcentaje) > 0);
      if (pagos.length && c.inicial.total > 0) {
        html += `<h3 class="doc-subtitulo">Forma de pago</h3>
          <table class="pagos">
            <thead><tr><th scope="col">Momento</th><th scope="col" class="pagos__num">Porcentaje</th><th scope="col" class="pagos__num">Monto</th></tr></thead>
            <tbody>${pagos.map(x => `<tr><td>${x.concepto.trim() ? esc(x.concepto) : vacioHTML('Pago sin descripción')}</td><td class="pagos__num">${cantidadTexto(numero(x.porcentaje))}%</td><td class="pagos__num">${dinero(c.inicial.total * numero(x.porcentaje) / 100, m)}</td></tr>`).join('')}</tbody>
          </table>`;
        if (c.mensual.base > 0) html += '<p class="doc-nota">El servicio mensual se factura por mes adelantado, desde que empieza ese servicio.</p>';
      }
      bloques.push({ titulo: 'Inversión', html });
    }

    const condiciones = lineas(s.condiciones);
    if (condiciones.length) {
      bloques.push({ titulo: 'Condiciones', html: `<ul class="doc-lista">${condiciones.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` });
    }

    const pasos = lineas(s.proximosPasos);
    const firmas = !web && s.opciones.firmas;
    if (pasos.length || firmas || web) {
      let html = pasos.length ? `<ol class="pasos">${pasos.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';
      if (web) html += cierreHTML(vig);
      if (firmas) {
        const quienCliente = cl.nombre.trim() || cl.empresa.trim() || 'Cliente';
        const quienEmisor = e.nombre.trim() || 'Responsable de la propuesta';
        html += `
          <div class="firmas">
            <div class="firma__linea"><p class="firma__quien">${esc(quienCliente)}</p><p class="firma__datos">Firma, aclaración y fecha</p></div>
            <div class="firma__linea"><p class="firma__quien">${esc(quienEmisor)}</p><p class="firma__datos">Firma, aclaración y fecha</p></div>
          </div>`;
      }
      bloques.push({ titulo: pasos.length ? 'Próximos pasos' : (web ? 'Siguiente paso' : 'Aceptación'), html });
    }

    const contactos = [];
    if (e.email.trim()) contactos.push(web ? `<a href="mailto:${esc(e.email.trim())}" data-enlace-cliente>${esc(e.email.trim())}</a>` : esc(e.email.trim()));
    if (e.telefono.trim()) contactos.push(esc(e.telefono.trim()));
    if (e.web.trim()) {
      const url = /^https?:\/\//i.test(e.web.trim()) ? e.web.trim() : `https://${e.web.trim()}`;
      contactos.push(web ? `<a href="${esc(url)}" target="_blank" rel="noopener" data-enlace-cliente>${esc(e.web.trim())}</a>` : esc(e.web.trim()));
    }
    const pie = `
      <footer class="pie">
        ${e.nombre.trim() ? `<span class="pie__nombre">${esc(e.nombre)}</span>` : ''}
        ${contactos.map(x => `<span>${x}</span>`).join('')}
        ${web ? '<button type="button" class="pie__pdf" data-accion="pdf">Descargar en PDF</button>' : ''}
        ${s.opciones.credito ? '<span class="pie__credito">Propuesta armada con la plantilla de AteneaGen</span>' : ''}
      </footer>`;

    const aviso = web && vig.vencida ? `<p class="doc-aviso">Esta propuesta venció el ${esc(fechaLarga(vig.vence))}. Los valores pueden haber cambiado.</p>` : '';

    const cuerpo = `
      <div class="cuerpo">
        ${aviso}
        ${bloques.length ? bloques.map((b, i) => `
          <section class="bloque">
            <span class="bloque__num" aria-hidden="true">${i + 1}</span>
            <div class="bloque__contenido">
              <h2 class="bloque__titulo">${esc(b.titulo)}</h2>
              ${b.html}
            </div>
          </section>`).join('') : '<p class="doc-nota">Completá las secciones del editor para armar el cuerpo de la propuesta.</p>'}
        ${pie}
      </div>`;

    doc.innerHTML = portada + cuerpo + (web ? barraClienteHTML(c, vig) : '');
    if (web) observarElementos(doc);
  };

  let renderPendiente = false;
  const actualizar = () => {
    if (renderPendiente) return;
    renderPendiente = true;
    requestAnimationFrame(() => {
      renderPendiente = false;
      renderDocumento();
      actualizarSubtotales();
      actualizarAvisoPagos();
      guardarLuego();
    });
  };

  const leerValor = el => {
    if (el.type === 'checkbox') return el.checked;
    if (el.dataset.tipo === 'numero') return numero(el.value);
    return el.value;
  };

  const alEditar = ev => {
    const el = ev.target;
    if (el.dataset.campo) {
      asignar(estado, el.dataset.campo, leerValor(el));
      actualizar();
      return;
    }
    if (el.dataset.item) {
      const nodo = el.closest('[data-indice]');
      const lista = el.closest('.lista');
      if (!nodo || !lista) return;
      const item = obtener(estado, LISTAS[lista.dataset.lista].ruta)[Number(nodo.dataset.indice)];
      if (!item) return;
      item[el.dataset.item] = leerValor(el);
      if (el.dataset.item === 'opcional' && !el.checked) seleccion.delete(item.id);
      actualizar();
    }
  };

  const formulario = $('#formulario');
  formulario.addEventListener('input', alEditar);
  formulario.addEventListener('change', alEditar);
  formulario.addEventListener('submit', ev => ev.preventDefault());

  const llenarTemaEditor = () => {
    const t = estado.tema;
    $$('.tema-card').forEach(el => el.classList.toggle('tema-card--activo', el.dataset.tema === t.preset));
    const acento = $('#tema-acento');
    const ft = $('#tema-fuente-titulos');
    const fc = $('#tema-fuente-cuerpo');
    if (acento) acento.value = t.acento || TEMAS[t.preset]?.acento || '#C9A84C';
    if (ft) ft.value = t.fuenteTitulos || TEMAS[t.preset]?.fuenteTitulos || 'Bebas Neue';
    if (fc) fc.value = t.fuenteCuerpo || TEMAS[t.preset]?.fuenteCuerpo || 'Montserrat';
  };

  const contenedorTemas = $('#temas-grid');
  if (contenedorTemas) {
    contenedorTemas.addEventListener('click', ev => {
      const card = ev.target.closest('.tema-card');
      if (!card) return;
      const id = card.dataset.tema;
      const preset = TEMAS[id];
      if (!preset) return;
      estado.tema.preset = id;
      estado.tema.acento = preset.acento;
      estado.tema.fuenteTitulos = preset.fuenteTitulos;
      estado.tema.fuenteCuerpo = preset.fuenteCuerpo;
      llenarTemaEditor();
      actualizar();
    });
  }

  const temaAcento = $('#tema-acento');
  if (temaAcento) {
    temaAcento.addEventListener('input', ev => {
      estado.tema.acento = ev.target.value;
      actualizar();
    });
  }

  const temaFT = $('#tema-fuente-titulos');
  if (temaFT) {
    temaFT.addEventListener('change', ev => {
      estado.tema.fuenteTitulos = ev.target.value;
      actualizar();
    });
  }

  const temaFC = $('#tema-fuente-cuerpo');
  if (temaFC) {
    temaFC.addEventListener('change', ev => {
      estado.tema.fuenteCuerpo = ev.target.value;
      actualizar();
    });
  }

  const dialogo = $('#dialogo');
  const confirmar = ({ titulo, texto: cuerpo, aceptar }) => {
    if (typeof dialogo.showModal !== 'function') return Promise.resolve(window.confirm(`${titulo}\n\n${cuerpo}`));
    $('#dialogo-titulo').textContent = titulo;
    $('#dialogo-texto').textContent = cuerpo;
    $('#dialogo-confirmar').textContent = aceptar;
    dialogo.returnValue = '';
    dialogo.showModal();
    return new Promise(res => dialogo.addEventListener('close', () => res(dialogo.returnValue === 'aceptar'), { once: true }));
  };

  const reemplazarEstado = nuevo => {
    estado = nuevo;
    seleccion = new Set();
    llenarFormulario();
    actualizar();
  };

  const nombreArchivo = () => {
    const base = [estado.propuesta.numero, estado.cliente.empresa || estado.cliente.nombre].map(x => texto(x).trim()).filter(Boolean).join(' ');
    return (base || 'propuesta').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
  };

  const guardarBorrador = () => {
    const blob = new Blob([JSON.stringify({ version: 1, ...estado }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `${nombreArchivo()}.json`;
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    avisar('Borrador guardado. Abrilo cuando quieras con «Abrir borrador».');
  };

  const campoBorrador = $('#campo-borrador');
  campoBorrador.addEventListener('change', () => {
    const archivo = campoBorrador.files[0];
    campoBorrador.value = '';
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        reemplazarEstado(normalizar(JSON.parse(lector.result)));
        avisar('Borrador abierto.');
      } catch {
        avisar('Ese archivo no es un borrador válido. Elegí un .json guardado desde este generador.');
      }
    };
    lector.onerror = () => avisar('No se pudo leer el archivo. Probá de nuevo.');
    lector.readAsText(archivo);
  });

  const leerComoDataURL = archivo => new Promise((res, rej) => {
    const lector = new FileReader();
    lector.onload = () => res(lector.result);
    lector.onerror = rej;
    lector.readAsDataURL(archivo);
  });

  const reducirLogo = async archivo => {
    const original = await leerComoDataURL(archivo);
    if (archivo.type === 'image/svg+xml' && original.length < 20000) return original;
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = original;
    });
    const anchoMax = 360;
    const altoMax = 140;
    const escala = Math.min(1, anchoMax / (img.naturalWidth || anchoMax), altoMax / (img.naturalHeight || altoMax));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.max(1, Math.round((img.naturalWidth || anchoMax) * escala));
    lienzo.height = Math.max(1, Math.round((img.naturalHeight || altoMax) * escala));
    lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
    const png = lienzo.toDataURL('image/png');
    const webp = lienzo.toDataURL('image/webp', 0.86);
    return webp.startsWith('data:image/webp') && webp.length < png.length ? webp : png;
  };

  const campoLogo = $('#campo-logo');
  campoLogo.addEventListener('change', async () => {
    const archivo = campoLogo.files[0];
    campoLogo.value = '';
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      avisar('El logo tiene que ser una imagen PNG, JPG, SVG o WebP.');
      return;
    }
    if (archivo.size > LOGO_MAX_ARCHIVO) {
      avisar('El logo pesa más de 5 MB. Usá una versión más liviana.');
      return;
    }
    try {
      estado.emisor.logo = await reducirLogo(archivo);
      actualizarLogo();
      actualizar();
    } catch {
      avisar('No se pudo leer la imagen. Probá con otra.');
    }
  });

  const aBase64Url = bytes => {
    let binario = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const desdeBase64Url = cadena => {
    let b64 = cadena.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binario = atob(b64);
    return Uint8Array.from(binario, ch => ch.charCodeAt(0));
  };

  const comprimir = async contenido => {
    const datos = new TextEncoder().encode(contenido);
    if (typeof CompressionStream !== 'function') return `j${aBase64Url(datos)}`;
    const flujo = new Blob([datos]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return `z${aBase64Url(new Uint8Array(await new Response(flujo).arrayBuffer()))}`;
  };

  const descomprimir = async codigo => {
    const tipo = codigo[0];
    const bytes = desdeBase64Url(codigo.slice(1));
    if (tipo === 'j') return new TextDecoder().decode(bytes);
    if (tipo === 'z') {
      const flujo = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return new Response(flujo).text();
    }
    throw new Error('Formato desconocido');
  };

  const datosParaLink = () => {
    const sinId = arr => arr.map(({ id, ...resto }) => resto);
    const logoEntra = estado.emisor.logo.length <= LOGO_MAX_LINK;
    return {
      logoOmitido: !!estado.emisor.logo && !logoEntra,
      datos: {
        v: 1,
        ...estado,
        emisor: { ...estado.emisor, logo: logoEntra ? estado.emisor.logo : '' },
        objetivos: sinId(estado.objetivos),
        servicios: sinId(estado.servicios),
        etapas: sinId(estado.etapas),
        inversion: { ...estado.inversion, pagos: sinId(estado.inversion.pagos) }
      }
    };
  };

  let linkActual = '';

  const abrirCompartir = async () => {
    const tieneContenido = estado.propuesta.titulo.trim() || estado.servicios.some(servicioConContenido);
    if (!tieneContenido) {
      avisar('Cargá al menos el título y un servicio antes de compartir la propuesta.');
      return;
    }
    const { datos, logoOmitido } = datosParaLink();
    try {
      linkActual = `${location.href.split('#')[0]}${PREFIJO}${await comprimir(JSON.stringify(datos))}`;
    } catch {
      avisar('No se pudo generar el link. Probá de nuevo.');
      return;
    }
    $('#enlace-propuesta').value = linkActual;
    $('#compartir-abrir').href = linkActual;
    const saludo = estado.cliente.nombre.trim() ? `Hola ${estado.cliente.nombre.trim().split(' ')[0]}!` : 'Hola!';
    const mensaje = `${saludo} Te comparto la propuesta${estado.propuesta.titulo.trim() ? ` «${estado.propuesta.titulo.trim()}»` : ''}. Desde el link podés ver todo el detalle, sumar opcionales y aceptarla: ${linkActual}`;
    $('#compartir-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    $('#compartir-nativo').hidden = typeof navigator.share !== 'function';
    const avisos = [];
    if (location.protocol === 'file:') avisos.push('Estás usando el generador desde un archivo de tu compu, así que este link solo abre acá. Publicá el generador en una web (Vercel, Netlify, tu hosting) y el link le va a funcionar a cualquiera.');
    if (logoOmitido) avisos.push('Tu logo es demasiado pesado para viajar en el link, así que no se incluye. Probá con un SVG o un PNG más simple.');
    if (!digitosWhatsApp() && !estado.emisor.email.trim()) avisos.push('No cargaste WhatsApp ni email: tu cliente va a poder aceptar, pero solo copiando el mensaje de confirmación.');
    const elAvisoCompartir = $('#compartir-aviso');
    elAvisoCompartir.hidden = !avisos.length;
    elAvisoCompartir.textContent = avisos.join(' ');
    $('#dialogo-compartir').showModal();
  };

  const copiar = async contenido => {
    try {
      await navigator.clipboard.writeText(contenido);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = contenido;
      area.setAttribute('readonly', '');
      area.className = 'visualmente-oculto';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    }
  };

  const mensajeAceptacion = () => {
    const c = calcular();
    const m = estado.inversion.moneda;
    const sumados = estado.servicios.filter(s => s.opcional && seleccion.has(s.id) && servicioConContenido(s)).map(s => s.nombre.trim());
    const emisor = nombreEmisor();
    const lineasMsg = [`Hola${emisor ? ` ${emisor.split(' ')[0]}` : ''}! Acepto la propuesta${estado.propuesta.numero.trim() ? ` ${estado.propuesta.numero.trim()}` : ''} «${tituloPropuesta()}».`];
    if (c.inicial.total > 0) lineasMsg.push(`${c.mensual.base > 0 ? 'Inversión inicial' : 'Inversión total'}: ${dinero(c.inicial.total, m)}`);
    if (c.mensual.total > 0) lineasMsg.push(`Servicio mensual: ${dinero(c.mensual.total, m)} por mes`);
    if (sumados.length) lineasMsg.push(`Sumé: ${sumados.join(', ')}.`);
    if (estado.cliente.nombre.trim()) lineasMsg.push(estado.cliente.nombre.trim());
    return { texto: lineasMsg.join('\n'), c, sumados };
  };

  const abrirAceptar = () => {
    if (!esCliente) {
      avisar('Así lo ve tu cliente. En el link, este botón le abre un mensaje para confirmarte la propuesta.');
      return;
    }
    const { texto: mensaje, c, sumados } = mensajeAceptacion();
    const m = estado.inversion.moneda;
    const filas = [];
    if (c.inicial.total > 0) filas.push([c.mensual.base > 0 ? 'Inversión inicial' : 'Inversión total', dinero(c.inicial.total, m)]);
    if (c.mensual.total > 0) filas.push(['Servicio mensual', `${dinero(c.mensual.total, m)} por mes`]);
    if (sumados.length) filas.push(['Sumaste', sumados.join(', ')]);
    $('#aceptar-resumen').innerHTML = filas.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('');
    $('#aceptar-resumen').hidden = !filas.length;
    const wa = enlaceWhatsApp(mensaje);
    const mail = enlaceEmail(`Acepto la propuesta ${estado.propuesta.numero.trim() || tituloPropuesta()}`.trim(), mensaje);
    const elWa = $('#aceptar-whatsapp');
    const elMail = $('#aceptar-email');
    elWa.hidden = !wa;
    elMail.hidden = !mail;
    if (wa) elWa.href = wa;
    if (mail) elMail.href = mail;
    $('#aceptar-copiar').hidden = !!(wa || mail);
    const emisor = nombreEmisor();
    $('#aceptar-texto').textContent = wa || mail
      ? `Se abre un mensaje${emisor ? ` para ${emisor}` : ''} con este resumen, listo para enviar.`
      : `Copiá el mensaje y mandáselo${emisor ? ` a ${emisor}` : ''} por donde suelan hablar.`;
    $('#dialogo-aceptar').showModal();
  };

  const app = $('#app');
  const cambiarPestana = previa => {
    app.classList.toggle('app--previa', previa);
    $$('.pestana').forEach(t => t.setAttribute('aria-selected', String((t.dataset.accion === 'ver-previa') === previa)));
  };

  const cambiarVista = nueva => {
    vista = nueva;
    const escenario = $('#escenario');
    ['escritorio', 'celular', 'pdf'].forEach(v => escenario.classList.toggle(`visor__escenario--${v}`, v === nueva));
    $$('.segmento').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === nueva)));
    $('#visor-nota').textContent = nueva === 'pdf'
      ? 'Versión para imprimir. Los saltos de página se ajustan solos.'
      : 'Así ve tu cliente la propuesta cuando abre el link.';
    renderDocumento();
  };

  const botonMenu = $('[data-accion="menu"]');
  const panelMenu = $('#menu-panel');
  const abrirMenu = abrir => {
    panelMenu.hidden = !abrir;
    botonMenu.setAttribute('aria-expanded', String(abrir));
  };

  document.addEventListener('click', ev => {
    if (!panelMenu.hidden && !ev.target.closest('#menu')) abrirMenu(false);
    const enlaceCliente = ev.target.closest('[data-enlace-cliente]');
    if (enlaceCliente && !esCliente) {
      ev.preventDefault();
      avisar('Así lo ve tu cliente. En el link, este enlace le abre una conversación con vos.');
    }
  });

  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && !panelMenu.hidden) {
      abrirMenu(false);
      botonMenu.focus();
    }
  });

  window.addEventListener('beforeprint', () => {
    imprimiendo = true;
    renderDocumento();
  });

  window.addEventListener('afterprint', () => {
    imprimiendo = false;
    renderDocumento();
  });

  const descargarPDF = () => {
    const tituloOriginal = document.title;
    document.title = nombreArchivo();
    window.addEventListener('afterprint', () => { document.title = tituloOriginal; }, { once: true });
    avisar('Elegí «Guardar como PDF» como destino y desactivá «Encabezados y pies de página».', 7000);
    setTimeout(() => window.print(), 350);
  };

  const enfocarUltimo = nombre => {
    const ultimo = $(`.lista[data-lista="${nombre}"] > :last-child`);
    const campo = ultimo && $('input, textarea', ultimo);
    if (campo) campo.focus();
  };

  document.addEventListener('click', async ev => {
    const boton = ev.target.closest('[data-accion]');
    if (!boton) return;
    const accion = boton.dataset.accion;

    if (accion === 'menu') {
      abrirMenu(panelMenu.hidden);
      return;
    }
    if (boton.closest('#menu-panel')) abrirMenu(false);

    if (['subir', 'bajar', 'quitar'].includes(accion)) {
      const nodo = boton.closest('[data-indice]');
      const nombre = boton.closest('.lista').dataset.lista;
      const arr = obtener(estado, LISTAS[nombre].ruta);
      const i = Number(nodo.dataset.indice);
      const j = accion === 'subir' ? i - 1 : i + 1;
      if (accion === 'quitar') arr.splice(i, 1);
      else {
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      renderLista(nombre);
      if (accion !== 'quitar') {
        const destino = $(`.lista[data-lista="${nombre}"] > [data-indice="${j}"] [data-accion="${accion}"]`);
        if (destino && !destino.disabled) destino.focus();
      }
      actualizar();
      return;
    }

    switch (accion) {
      case 'agregar': {
        const nombre = boton.dataset.lista;
        obtener(estado, LISTAS[nombre].ruta).push(LISTAS[nombre].nuevo());
        renderLista(nombre);
        enfocarUltimo(nombre);
        actualizar();
        break;
      }
      case 'sumar': {
        const id = boton.dataset.id;
        if (seleccion.has(id)) seleccion.delete(id);
        else seleccion.add(id);
        renderDocumento();
        const nuevo = $(`.servicio__sumar[data-id="${CSS.escape(id)}"]`);
        if (nuevo) nuevo.focus({ preventScroll: true });
        break;
      }
      case 'aceptar':
        abrirAceptar();
        break;
      case 'copiar-aceptacion':
        avisar(await copiar(mensajeAceptacion().texto) ? 'Mensaje copiado. Pegalo en tu chat o mail.' : 'No se pudo copiar. Probá de nuevo.');
        break;
      case 'compartir':
        abrirCompartir();
        break;
      case 'copiar-link':
        if (await copiar(linkActual)) {
          boton.textContent = 'Copiado';
          setTimeout(() => { boton.textContent = 'Copiar link'; }, 2000);
        } else {
          $('#enlace-propuesta').select();
          avisar('No se pudo copiar automáticamente. El link quedó seleccionado para que lo copies.');
        }
        break;
      case 'compartir-nativo':
        try {
          await navigator.share({ title: estado.propuesta.titulo.trim() || 'Propuesta', url: linkActual });
        } catch {}
        break;
      case 'vista':
        cambiarVista(boton.dataset.vista);
        break;
      case 'quitar-logo':
        estado.emisor.logo = '';
        actualizarLogo();
        actualizar();
        break;
      case 'ejemplo':
        if (await confirmar({ titulo: '¿Cargar la propuesta de ejemplo?', texto: 'Reemplaza lo que cargaste. Si querés conservarlo, guardá un borrador antes.', aceptar: 'Cargar ejemplo' })) {
          reemplazarEstado(ejemplo());
          avisar('Ejemplo cargado. Cambiá los datos por los de tu proyecto.');
        }
        break;
      case 'vaciar':
        if (await confirmar({ titulo: '¿Empezar una propuesta en blanco?', texto: 'Se borra lo que cargaste. Si querés conservarlo, guardá un borrador antes.', aceptar: 'Empezar en blanco' })) {
          const nuevo = vacio();
          nuevo.emisor = { ...estado.emisor };
          reemplazarEstado(nuevo);
          avisar('Propuesta en blanco. Tus datos de contacto se mantienen.');
        }
        break;
      case 'guardar-borrador':
        guardarBorrador();
        break;
      case 'abrir-borrador':
        campoBorrador.click();
        break;
      case 'pdf':
        descargarPDF();
        break;
      case 'ver-editor':
        cambiarPestana(false);
        break;
      case 'ver-previa':
        cambiarPestana(true);
        break;
    }
  });

  const iniciarCliente = async () => {
    esCliente = true;
    document.body.classList.add('modo-cliente');
    try {
      const datos = JSON.parse(await descomprimir(location.hash.slice(PREFIJO.length)));
      estado = normalizar(datos);
      const destinatario = estado.cliente.empresa.trim() || estado.cliente.nombre.trim();
      document.title = [estado.propuesta.titulo.trim() || 'Propuesta', destinatario ? `para ${destinatario}` : ''].filter(Boolean).join(' ');
      renderDocumento();
    } catch {
      $('#documento').innerHTML = `
        <div class="doc-error">
          <div>
            <h1>No pudimos abrir esta propuesta</h1>
            <p>El link llegó incompleto o se cortó al copiarlo. Pedile a quien te lo mandó que lo comparta de nuevo.</p>
          </div>
        </div>`;
    }
  };

  const iniciarEditor = () => {
    estado = cargarGuardado() || ejemplo();
    llenarFormulario();
    renderDocumento();
    actualizarAvisoPagos();
  };

  // ----------------------------------------------------------
  // Auth flow
  // ----------------------------------------------------------

  const authPantalla   = $('#auth-pantalla');
  const authForm       = $('#auth-form');
  const authGoogle     = $('#auth-google');
  const authErrorG     = $('#auth-error-google');
  const authError      = $('#auth-error');
  const authSubmit     = $('#auth-submit');
  const authSubmitText = authSubmit?.querySelector('.auth__submit-texto');
  const authSpinner    = authSubmit?.querySelector('.auth__spinner');
  const authNombre     = $('#auth-nombre');
  const authEmail      = $('#auth-email');
  const authPass       = $('#auth-pass');
  const menuUsuario    = $('#menu-usuario');
  let authModo = 'login';

  const mostrarErrorAuth = (el, msg) => {
    if (!el) return;
    const MENSAJES = {
      'auth/user-not-found':          'No hay cuenta con ese email.',
      'auth/wrong-password':          'Contraseña incorrecta.',
      'auth/invalid-credential':      'Email o contraseña incorrectos.',
      'auth/email-already-in-use':    'Ya existe una cuenta con ese email.',
      'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email':           'El email no es válido.',
      'auth/too-many-requests':       'Demasiados intentos. Esperá un momento.',
      'auth/popup-closed-by-user':    '',
      'auth/cancelled-popup-request': ''
    };
    const texto = MENSAJES[msg?.code] ?? MENSAJES[msg?.message] ?? (typeof msg === 'string' ? msg : 'Ocurrió un error. Intentá de nuevo.');
    if (!texto) { el.hidden = true; return; }
    el.textContent = texto;
    el.hidden = false;
  };

  const setAuthCargando = (cargando) => {
    if (authSubmit) authSubmit.disabled = cargando;
    if (authGoogle) authGoogle.disabled = cargando;
    if (authSubmitText) authSubmitText.textContent = cargando ? 'Cargando...' : (authModo === 'login' ? 'Iniciar sesión' : 'Crear cuenta');
    if (authSpinner) authSpinner.hidden = !cargando;
  };

  if (authPantalla && window.AteneaDB) {
    // Tabs login/registro
    authPantalla.querySelectorAll('[data-auth-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        authModo = tab.dataset.authTab === 'registro' ? 'registro' : 'login';
        authPantalla.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.toggle('auth__tab--activo', t === tab));
        const campoNombre = authPantalla.querySelector('.auth__campo--nombre');
        if (campoNombre) campoNombre.hidden = authModo === 'login';
        if (authSubmitText) authSubmitText.textContent = authModo === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
        if (authPass) authPass.autocomplete = authModo === 'login' ? 'current-password' : 'new-password';
        if (authError) authError.hidden = true;
      });
    });

    // Toggle password visibility
    authPantalla.querySelectorAll('[data-auth-toggle-pass]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!authPass) return;
        const show = authPass.type === 'password';
        authPass.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
      });
    });

    // Google sign-in (redirect — no popup)
    authGoogle.addEventListener('click', () => {
      setAuthCargando(true);
      if (authErrorG) authErrorG.hidden = true;
      AteneaDB.auth.signInGoogle().catch(e => {
        mostrarErrorAuth(authErrorG, e);
        setAuthCargando(false);
      });
    });

    // Email form submit
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = authEmail?.value.trim();
      const pass  = authPass?.value;
      if (!email || !pass) return;
      setAuthCargando(true);
      if (authError) authError.hidden = true;
      try {
        if (authModo === 'registro') {
          await AteneaDB.auth.signUp(email, pass, authNombre?.value.trim());
        } else {
          await AteneaDB.auth.signIn(email, pass);
        }
      } catch (e) {
        mostrarErrorAuth(authError, e);
      } finally {
        setAuthCargando(false);
      }
    });
  }

  // Cerrar sesión desde menú
  document.querySelector('[data-accion="cerrar-sesion"]')?.addEventListener('click', async () => {
    if (window.AteneaDB) {
      await AteneaDB.auth.signOut();
      location.reload();
    }
  });

  // ----------------------------------------------------------
  // Init
  // ----------------------------------------------------------

  const esClienteLink = location.hash.startsWith(PREFIJO);

  if (esClienteLink) {
    iniciarCliente();
  } else if (window.AteneaDB) {
    authPantalla.hidden = false;
    document.body.classList.add('auth-activo');
    let editorIniciado = false;
    AteneaDB.auth.onAuthChange(user => {
      if (user) {
        authPantalla.hidden = true;
        document.body.classList.remove('auth-activo');
        if (menuUsuario) menuUsuario.textContent = user.displayName || user.email;
        if (!editorIniciado) { editorIniciado = true; iniciarEditor(); }
      } else {
        authPantalla.hidden = false;
        document.body.classList.add('auth-activo');
      }
    });
  } else {
    iniciarEditor();
  }

  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith(PREFIJO) || esCliente) location.reload();
  });
})();
