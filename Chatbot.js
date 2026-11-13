/* ==========================================================
   ColorLive - Chatbot de ayuda
   - Funciona solo con el navegador (sin servidor ni claves).
   - Responde sobre categorías, cómo encargar y contacto.
   - Lo que no esté configurado (precios, tiempos...) lo deriva
     a WhatsApp, así nunca inventa datos del negocio.
   ========================================================== */

(function () {
  'use strict';

  
  var CONFIG = {
    artista: 'Alex',
    whatsapp: '573006226846',          
    whatsappVisible: '300 622 6846',
    instagramUsuario: '@colorlive.insta',
    instagramUrl: 'https://www.instagram.com/colorlive.insta?rpxt=MW1ta3VwbmQ5YXNjNg%3D%3D',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61596037323924',

    // Ejemplos: precios: 'Desde $50.000 según el tamaño y el detalle.'
    precios: 'Desde $50.000 hasta $100.000 según el tamaño y el detalle. Para más información ingresa al whatsapp mediante el siguiente enlace.',
    tiempos: '',
    tamanos: 'A6, A5, A4, A3,',
    pagos: '',
    envios: '',
    horario: ''
  };

  /* ------------------------------------------------------
     Utilidades
     ------------------------------------------------------ */

  function norm(t) {
    return String(t)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function waUrl(mensaje) {
    var base = 'https://wa.me/' + CONFIG.whatsapp;
    return mensaje ? base + '?text=' + encodeURIComponent(mensaje) : base;
  }

  function enlaceWA(texto, mensaje) {
    return { t: texto, href: waUrl(mensaje), tipo: 'whatsapp' };
  }

  var ENLACE_FB = { t: 'Facebook ColorLive', href: CONFIG.facebookUrl, tipo: 'facebook' };

  var ENLACE_IG = { t: 'Instagram ' + CONFIG.instagramUsuario, href: CONFIG.instagramUrl, tipo: 'instagram' };

  var CHIPS_BASE = ['Ver categorías', '¿Cómo encargo?', 'Precios', 'Tiempos de entrega', 'Contacto'];

  function conDato(dato, sinDato, enlaceMsg, enlaceTxt) {
    return {
      texto: [dato || sinDato],
      enlaces: [enlaceWA(enlaceTxt || 'Preguntar por WhatsApp', enlaceMsg)],
      chips: CHIPS_BASE
    };
  }

  /* ------------------------------------------------------
     Respuestas (intenciones)
     "claves": palabras que activan la respuesta (sin tildes).
     Coincide al inicio de cada palabra: "precio" -> "precios".
     ------------------------------------------------------ */

  var INTENCIONES = [
    {
      id: 'pokemon',
      claves: ['pokemon', 'pikachu', 'pokebola', 'ash', 'charmander', 'eevee'],
      resp: function () {
        return {
          texto: ['¡Pokémon! Elige tu Pokémon favorito y dale vida a tu aventura a través del arte.'],
          enlaces: [enlaceWA('Pedir mi dibujo Pokémon', 'Hola, quiero encargar un dibujo de Pokémon.')],
          chips: ['Ver categorías', '¿Cómo encargo?', 'Precios']
        };
      }
    },
    {
      id: 'ninja',
      claves: ['ninja', 'naruto', 'konoha', 'shinobi', 'sasuke', 'kakashi', 'hokage'],
      resp: function () {
        return {
          texto: ['Descubre tu camino ninja y dale vida a tu ninja favorito.'],
          enlaces: [enlaceWA('Pedir mi dibujo ninja', 'Hola, quiero encargar un dibujo de mi ninja favorito.')],
          chips: ['Ver categorías', '¿Cómo encargo?', 'Precios']
        };
      }
    },
    {
      id: 'zodiaco',
      claves: ['zodiaco', 'caballero', 'caballeros', 'saint seiya', 'seiya', 'cosmos', 'cdz', 'pegaso', 'athena', 'atenea'],
      resp: function () {
        return {
          texto: ['Despierta tu cosmos y elige al caballero que representa tu espíritu guerrero.'],
          enlaces: [enlaceWA('Pedir mi dibujo del Zodiaco', 'Hola, quiero encargar un dibujo de Caballeros del Zodiaco.')],
          chips: ['Ver categorías', '¿Cómo encargo?', 'Precios']
        };
      }
    },
    {
      id: 'dragonball',
      claves: ['dragon', 'dragonball', 'goku', 'vegeta', 'dbz', 'saiyan', 'saiyajin'],
      resp: function () {
        return {
          texto: ['Libera tu poder y elige a tu guerrero favorito del universo Dragon Ball Z.'],
          enlaces: [enlaceWA('Pedir mi dibujo Dragon Ball', 'Hola, quiero encargar un dibujo de Dragon Ball Z.')],
          chips: ['Ver categorías', '¿Cómo encargo?', 'Precios']
        };
      }
    },
    {
      id: 'otro',
      claves: ['otro anime', 'otro personaje', 'one piece', 'luffy', 'mi personaje', 'mi anime', 'no esta', 'no aparece', 'favorito', 'demon slayer', 'jujutsu', 'my hero'],
      resp: function () {
        return {
          texto: [
            'La idea es que elijas tu personaje favorito de anime y lo conviertas en una obra de arte con diseño exclusivo y personalizado.',
            'Cuéntale a ' + CONFIG.artista + ' cuál es tu personaje y él te dice cómo lo haría.'
          ],
          enlaces: [enlaceWA('Contarle mi personaje', 'Hola, quiero un dibujo de otro personaje de anime.')],
          chips: ['Ver categorías', '¿Cómo encargo?']
        };
      }
    },
    {
      id: 'categorias',
      claves: ['categoria', 'catalogo', 'opciones', 'que dibujan', 'que hacen', 'que ofrecen', 'que venden', 'personajes', 'anime', 'galeria', 'estilos', 'trabajos', 'ejemplos'],
      resp: function () {
        return {
          texto: [
            'En ColorLive creamos ilustraciones personalizadas de tu personaje de anime favorito. Estas son las categorías:',
            '• Pokémon\n• Ninja\n• Caballeros del Zodiaco\n• Dragon Ball Z',
            '¿Cuál te interesa?'
          ],
          enlaces: [],
          chips: ['Pokémon', 'Ninja', 'Caballeros del Zodiaco', 'Dragon Ball Z', 'Otro personaje']
        };
      }
    },
    {
      id: 'encargar',
      claves: ['encargar', 'encargo', 'pedir', 'pedido', 'comprar', 'ordenar', 'solicitar', 'quiero un dibujo', 'quiero uno', 'como hago', 'como funciona', 'proceso', 'pasos', 'reservar'],
      resp: function () {
        return {
          texto: [
            'Es muy fácil:',
            '1. Elige tu personaje favorito (Pokémon, ninja, Caballeros del Zodiaco, Dragon Ball Z u otro anime).\n2. Escríbenos por WhatsApp contándonos tu idea.\n3. ' + CONFIG.artista + ' te responde con los detalles de tu dibujo.'
          ],
          enlaces: [enlaceWA('Hacer mi pedido por WhatsApp', 'Hola, quiero encargar un dibujo.')],
          chips: ['Precios', 'Tiempos de entrega', 'Ver categorías']
        };
      }
    },
    {
      id: 'precios',
      claves: ['precio', 'cuesta', 'cuanto vale', 'cuanto cuesta', 'cuanto cobran', 'valor', 'costo', 'tarifa', 'cotiz', 'presupuesto', 'barato', 'caro'],
      resp: function () {
        return conDato(
          CONFIG.precios,
          'Para darte un precio exacto, ' + CONFIG.artista + ' necesita saber qué personaje quieres. Escríbele por WhatsApp y te responde.',
          'Hola, quiero cotizar un dibujo.',
          'Pedir cotización'
        );
      }
    },
    {
      id: 'tiempos',
      claves: ['cuanto tarda', 'tarda', 'demora', 'tiempo', 'entrega', 'cuando llega', 'plazo', 'dias', 'semanas', 'urgente', 'rapido'],
      resp: function () {
        return conDato(
          CONFIG.tiempos,
          'El tiempo de entrega lo confirma ' + CONFIG.artista + ' cuando te responda por WhatsApp.',
          'Hola, ¿en cuánto tiempo me entregarían un dibujo?',
          'Preguntar por tiempos'
        );
      }
    },
    {
      id: 'envios',
      claves: ['envio', 'envian', 'enviar', 'domicilio', 'ciudad', 'recoger', 'despacho', 'mandan', 'llega a', 'pais', 'internacional'],
      resp: function () {
        return conDato(
          CONFIG.envios,
          'Los detalles de envío o entrega se coordinan directamente por WhatsApp.',
          'Hola, quiero saber cómo sería el envío de mi dibujo.',
          'Preguntar por envíos'
        );
      }
    },
    {
      id: 'pagos',
      claves: ['pago', 'pagar', 'transferencia', 'efectivo', 'tarjeta', 'abono', 'anticipo', 'metodos'],
      resp: function () {
        return conDato(
          CONFIG.pagos,
          'Las formas de pago las acuerdas directamente con ' + CONFIG.artista + ' por WhatsApp.',
          'Hola, quiero saber las formas de pago.',
          'Preguntar por pagos'
        );
      }
    },
    {
      id: 'tamanos',
      claves: ['tamano', 'medidas', 'marco', 'papel', 'tecnica', 'material', 'a color', 'blanco y negro', 'lapiz', 'tinta', 'digital', 'formato'],
      resp: function () {
        return conDato(
          CONFIG.tamanos,
          'Cuéntale a ' + CONFIG.artista + ' por WhatsApp lo que tienes en mente (personaje, tamaño, si lo quieres a color o en blanco y negro) y te orienta.',
          'Hola, quiero saber de tamaños y técnicas disponibles.',
          'Preguntar por tamaños'
        );
      }
    },
    {
      id: 'horario',
      claves: ['horario', 'atienden', 'disponible', 'abierto', 'a que hora', 'responden'],
      resp: function () {
        return conDato(
          CONFIG.horario,
          'Escríbenos por WhatsApp cuando quieras: ' + CONFIG.artista + ' te responde en cuanto pueda.',
          'Hola, tengo una consulta.',
          'Escribir por WhatsApp'
        );
      }
    },
    {
      id: 'contacto',
      claves: ['contacto', 'contactar', 'whatsapp', 'wasap', 'telefono', 'numero', 'celular', 'instagram', 'insta', 'facebook', 'face', 'redes', 'escribir', 'hablar', 'llamar', 'correo'],
      resp: function () {
        return {
          texto: [
            'Puedes hablar con ' + CONFIG.artista + ' por WhatsApp al ' + CONFIG.whatsappVisible + ' o seguirnos en Instagram (' + CONFIG.instagramUsuario + ') y Facebook.'
          ],
          enlaces: [enlaceWA('Escribir por WhatsApp', 'Hola, tengo una consulta.'), ENLACE_IG, ENLACE_FB],
          chips: ['¿Cómo encargo?', 'Ver categorías']
        };
      }
    },
    {
      id: 'quien',
      claves: ['quien', 'quienes', 'colorlive', 'artista', 'sobre ustedes', 'que es', 'alex', 'acerca'],
      resp: function () {
        return {
          texto: [
            'ColorLive es un espacio de arte sin límites: dibujos únicos y personalizados que capturan la esencia de la expresión artística.',
            'Puedes elegir tus personajes favoritos y convertirlos en obras de arte.'
          ],
          enlaces: [],
          chips: ['Ver categorías', '¿Cómo encargo?', 'Contacto']
        };
      }
    },
    {
      id: 'gracias',
      claves: ['gracias', 'chao', 'adios', 'hasta luego', 'bye', 'listo', 'perfecto', 'genial', 'excelente', 'vale'],
      resp: function () {
        return {
          texto: ['¡Con mucho gusto! Si quieres tu dibujo, escríbenos por WhatsApp. ¡Que tengas un día lleno de color! 🎨'],
          enlaces: [enlaceWA('Escribir por WhatsApp', 'Hola, quiero encargar un dibujo.')],
          chips: CHIPS_BASE
        };
      }
    },
    {
      id: 'saludo',
      claves: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'ayuda', 'ayudame', 'menu', 'inicio'],
      resp: function () {
        return {
          texto: ['¡Hola! Cuéntame, ¿qué te gustaría saber?'],
          enlaces: [],
          chips: CHIPS_BASE
        };
      }
    }
  ];

  var FALLBACK = function () {
    return {
      texto: [
        'No estoy seguro de haber entendido 🤔 Puedes elegir una opción de abajo o escribirle directamente a ' + CONFIG.artista + ' por WhatsApp.'
      ],
      enlaces: [enlaceWA('Escribir por WhatsApp', 'Hola, tengo una consulta.')],
      chips: CHIPS_BASE
    };
  };

  var BIENVENIDA = {
    texto: [
      '¡Hola! Soy el asistente de ColorLive 🎨',
      'Puedo contarte sobre nuestros dibujos personalizados de anime y cómo hacer tu pedido. ¿Qué quieres saber?'
    ],
    enlaces: [],
    chips: CHIPS_BASE
  };

  // Frases de los botones -> intención directa
  var ATAJOS = {
    'ver categorias': 'categorias',
    'como encargo': 'encargar',
    'precios': 'precios',
    'tiempos de entrega': 'tiempos',
    'contacto': 'contacto',
    'pokemon': 'pokemon',
    'ninja': 'ninja',
    'caballeros del zodiaco': 'zodiaco',
    'dragon ball z': 'dragonball',
    'otro personaje': 'otro'
  };

  /* ------------------------------------------------------
     Motor de coincidencias
     ------------------------------------------------------ */

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  var reCache = {};
  function reClave(clave) {
    if (!reCache[clave]) {
      reCache[clave] = new RegExp('(^|\\s)' + escapeRe(clave));
    }
    return reCache[clave];
  }

  function buscarIntencion(texto) {
    var t = norm(texto);
    if (!t) return null;

    if (ATAJOS[t]) {
      for (var a = 0; a < INTENCIONES.length; a++) {
        if (INTENCIONES[a].id === ATAJOS[t]) return INTENCIONES[a];
      }
    }

    var mejor = null;
    var mejorPuntos = 0;
    for (var i = 0; i < INTENCIONES.length; i++) {
      var puntos = 0;
      var claves = INTENCIONES[i].claves;
      for (var j = 0; j < claves.length; j++) {
        if (reClave(claves[j]).test(t)) puntos += claves[j].indexOf(' ') > -1 ? 2 : 1;
      }
      // El saludo solo gana si no hay nada más específico
      if (INTENCIONES[i].id === 'saludo' || INTENCIONES[i].id === 'gracias') puntos = puntos * 0.5;
      if (puntos > mejorPuntos) {
        mejorPuntos = puntos;
        mejor = INTENCIONES[i];
      }
    }
    return mejor;
  }

  /* ------------------------------------------------------
     Interfaz
     ------------------------------------------------------ */

  var reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  var ICONO_CHAT =
    '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">' +
    '<path d="M5 6.5h22a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5H15l-6.5 5v-5H5A2.5 2.5 0 0 1 2.5 21V9A2.5 2.5 0 0 1 5 6.5z" fill="#fff" stroke="#17120e" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<circle cx="10" cy="15" r="1.9" fill="#ee3a22"/><circle cx="16" cy="15" r="1.9" fill="#ffb000"/><circle cx="22" cy="15" r="1.9" fill="#1b94dc"/>' +
    '</svg>';

  function iniciar() {
    if (document.querySelector('.chat-toggle')) return;

    /* --- Botón flotante --- */
    var toggle = el('button', 'chat-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Abrir chat de ayuda');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'chat-panel');
    toggle.innerHTML = ICONO_CHAT;

    var saludo = el('div', 'chat-saludo', '¿Te ayudo a elegir tu dibujo?');
    saludo.hidden = true;

    /* --- Panel --- */
    var panel = el('section', 'chat-panel');
    panel.id = 'chat-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat de ayuda de ColorLive');

    var cabecera = el('div', 'chat-cabecera');
    var titulos = el('div', 'chat-titulos');
    titulos.appendChild(el('span', 'chat-titulo', 'ColorLive'));
    titulos.appendChild(el('span', 'chat-lema', 'arte sin límites'));
    var cerrar = el('button', 'chat-cerrar', '×');
    cerrar.type = 'button';
    cerrar.setAttribute('aria-label', 'Cerrar chat');
    cabecera.appendChild(titulos);
    cabecera.appendChild(cerrar);

    var registro = el('div', 'chat-registro');
    registro.setAttribute('role', 'log');
    registro.setAttribute('aria-live', 'polite');
    registro.setAttribute('aria-label', 'Conversación');

    var chips = el('div', 'chat-chips');

    var form = el('form', 'chat-form');
    form.setAttribute('autocomplete', 'off');
    var etiqueta = el('label', 'chat-sr', 'Escribe tu pregunta');
    etiqueta.setAttribute('for', 'chat-entrada');
    var entrada = el('input', 'chat-entrada');
    entrada.type = 'text';
    entrada.id = 'chat-entrada';
    entrada.placeholder = 'Escribe tu pregunta…';
    entrada.maxLength = 200;
    var enviar = el('button', 'chat-enviar', 'Enviar');
    enviar.type = 'submit';
    form.appendChild(etiqueta);
    form.appendChild(entrada);
    form.appendChild(enviar);

    panel.appendChild(cabecera);
    panel.appendChild(registro);
    panel.appendChild(chips);
    panel.appendChild(form);

    document.body.appendChild(panel);
    document.body.appendChild(saludo);
    document.body.appendChild(toggle);

    /* --- Funciones de la conversación --- */

    var yaSaludo = false;
    var pendiente = null;

    function bajar() {
      registro.scrollTop = registro.scrollHeight;
    }

    function mensaje(autor, lineas, enlaces) {
      var m = el('div', 'chat-msg chat-' + autor);
      (Array.isArray(lineas) ? lineas : [lineas]).forEach(function (linea) {
        m.appendChild(el('p', 'chat-linea', linea));
      });
      if (enlaces && enlaces.length) {
        var caja = el('div', 'chat-enlaces');
        enlaces.forEach(function (e) {
          var a = el('a', 'chat-enlace chat-enlace-' + e.tipo, e.t);
          a.href = e.href;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          caja.appendChild(a);
        });
        m.appendChild(caja);
      }
      registro.appendChild(m);
      bajar();
    }

    function ponerChips(lista) {
      chips.textContent = '';
      (lista || CHIPS_BASE).forEach(function (txt) {
        var b = el('button', 'chat-chip', txt);
        b.type = 'button';
        b.addEventListener('click', function () {
          preguntar(txt);
        });
        chips.appendChild(b);
      });
    }

    function responder(r) {
      mensaje('bot', r.texto, r.enlaces);
      ponerChips(r.chips);
    }

    function preguntar(texto) {
      texto = String(texto).trim();
      if (!texto) return;
      mensaje('user', texto);
      chips.textContent = '';

      var intencion = buscarIntencion(texto);
      var respuesta = intencion ? intencion.resp() : FALLBACK();

      if (pendiente) clearTimeout(pendiente);
      var puntos = el('div', 'chat-msg chat-bot chat-escribiendo');
      puntos.setAttribute('aria-hidden', 'true');
      puntos.innerHTML = '<span></span><span></span><span></span>';
      registro.appendChild(puntos);
      bajar();

      pendiente = setTimeout(function () {
        if (puntos.parentNode) puntos.parentNode.removeChild(puntos);
        responder(respuesta);
        pendiente = null;
      }, reducirMovimiento ? 0 : 550);
    }

    /* --- Abrir / cerrar --- */

    function abrir() {
      panel.hidden = false;
      saludo.hidden = true;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar chat de ayuda');
      toggle.classList.add('chat-abierto');
      if (!yaSaludo) {
        yaSaludo = true;
        responder(BIENVENIDA);
      }
      try { sessionStorage.setItem('cl-chat-visto', '1'); } catch (e) { /* sin almacenamiento */ }
      setTimeout(function () { entrada.focus(); }, 50);
    }

    function cerrarPanel() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir chat de ayuda');
      toggle.classList.remove('chat-abierto');
    }

    toggle.addEventListener('click', function () {
      if (panel.hidden) abrir(); else { cerrarPanel(); }
    });

    cerrar.addEventListener('click', function () {
      cerrarPanel();
      toggle.focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        cerrarPanel();
        toggle.focus();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var texto = entrada.value;
      entrada.value = '';
      preguntar(texto);
    });

    /* --- Globo de saludo (una vez por visita) --- */

    var visto = false;
    try { visto = sessionStorage.getItem('cl-chat-visto') === '1'; } catch (e) { /* sin almacenamiento */ }

    if (!visto) {
      setTimeout(function () {
        if (panel.hidden) saludo.hidden = false;
      }, 3500);
      setTimeout(function () {
        saludo.hidden = true;
      }, 12500);
    }

    saludo.addEventListener('click', abrir);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();