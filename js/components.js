//FLETXA.
AFRAME.registerComponent('arrow-button', {
  schema: {
      src: { type: 'selector', default: '#arrow' },
      hoverSrc: { type: 'selector', default: '#arrowEfect' },
      width: { type: 'number', default: 0.4 },
      height: { type: 'number', default: 0.4 },
      defaultOpacity: { type: 'number', default: 0.7 }
  },
  init: function () {
      console.log('Component arrow-button inicialitzat a:', this.el.id); // <-- AFEGEIX AQUEST LOG
      const el = this.el;
      const data = this.data;

      el.classList.add('interactive');
      const clickSound=this.clickSound = document.querySelector('#click-sound');
      el.setAttribute('geometry', {
          primitive: 'plane',
          width: data.width,
          height: data.height
      });
      el.setAttribute('material', {
          src: data.src,
          shader: 'flat',
          opacity: data.defaultOpacity,
          alphaTest: 0.5 // Important per a imatges transparents
      });
      // el.classList.add('clickable'); // No estrictament necessari amb el selector 'objects' del raycaster

      // Canvi d’imatge al passar el cursor
      el.addEventListener('mouseenter', () => {
          el.setAttribute('material', 'src', data.hoverSrc);
          // Opcional: Pots afegir aquí el so de "hover" si en tens un

      });

      el.addEventListener('mouseleave', () => {
          el.setAttribute('material', 'src', data.src);
      });

      // *** LISTENER PER DETECTAR EL CLIC I CRIDAR LA FUNCIÓ DE NAVEGACIÓ GLOBAL ***
      el.addEventListener('click', () => {
          console.log('Clic detectat a la fletxa amb ID:', el.id);

          // Determina si és fletxa endavant o enrere basant-te en l'ID
          const isForward = el.id.startsWith('forward-arrow');

          // Cridar la funció de canvi d'escena global (window.changeScene)
          // Ens assegurem que existeix abans de cridar-la per evitar errors
          if (window.changeScene) {
               window.changeScene(isForward);
               // Reprodueix el so de clic. El so també es mou aquí.
               if (clickSound) {
                    clickSound.play();
               }
          } else {
               console.error("Error: La funció window.changeScene no està definida. Assegura't que js/navegacio.js es carrega correctament abans de js/components.js i que window.changeScene es defineix.");
          }
      });
      // ****************************************************************************
  }
});


AFRAME.registerComponent('info-hotspot', {
    schema: {
      // Propietats visuals per a l'icono (similar a arrow-button)
      src: { type: 'selector', default:'#info' }, // L'asset de la icona normal (p.ex., #info-icon)
      hoverSrc: { type: 'selector' }, // L'asset per a l'efecte hover (opcional, p.ex., #info-icon-hover)
      width: { type: 'number', default: 0.5 }, // Mida de l'icono
      height: { type: 'number', default: 0.5 },
      defaultOpacity: { type: 'number', default: 1.0 },
  
      // Propietat per enllaçar amb el panell d'informació
      targetPanel: { type: 'selector', default: '#infoPanel-hazard1' } // Selector de l'entitat del panell a obrir (#infoPanel-hazard1, etc.)
    },
  
    init: function () {
      const el = this.el; // L'entitat on s'aplica el component (l'a-plane de l'icono)
      const data = this.data; // Les dades de l'esquema
  
      console.log('Component info-hotspot inicialitzat a:', el.id, ' -> Panell:', data.targetPanel); // Log d'inicialització
  
      // Configura la geometria i el material de l'icono usant les dades de l'esquema
      el.setAttribute('geometry', {
        primitive: 'plane',
        width: data.width,
        height: data.height
      });
  
      el.setAttribute('material', {
        src: data.src, // Utilitza l'asset de la icona normal definit a l'HTML o esquema
        shader: 'flat',
        opacity: data.defaultOpacity,
        transparent: true, // Normalment les icones SVG tenen transparència
        alphaTest: 0.5 // Important per a imatges transparents
      });
  
      // AFEGEIX LA CLASSE 'interactive' DES DEL JS
      el.classList.add('interactive');
  
      // Buscar l'entitat del panell (fer-ho a l'init)
      const targetPanelEl = data.targetPanel;
  
      if (!targetPanelEl) {
        console.error(`info-hotspot: [${el.id}] No s'ha trobat el panell amb selector "${data.targetPanel}". Aquest hotspot no funcionarà.`);
      } else {
        // --- Lògica de Hover (Mouse Enter/Leave) ---
        const defaultSrc = data.src; // Guardem la src original
  
        el.addEventListener('mouseenter', () => {
          console.log('MOUSE ENTER on Hotspot:', el.id);
          if (data.hoverSrc) {
            el.setAttribute('material', 'src', data.hoverSrc);
            // Opcional: so de hover si en tens
          }
        });
  
        el.addEventListener('mouseleave', () => {
          console.log('MOUSE LEAVE on Hotspot:', el.id);
          el.setAttribute('material', 'src', defaultSrc);
        });
        // --- Fi Lògica de Hover ---
  
        // --- Lògica de Clic ---
        el.addEventListener('click', () => {
          console.log('Clic a Hotspot:', el.id, '-> Obrint panell:', data.targetPanel);
          if (targetPanelEl.components['info-panel']) {
            targetPanelEl.components['info-panel'].toggle();
  
            // Opcional: Reprodueix un so de clic
            const clickSound = document.querySelector('#click-sound');
            if (clickSound) {
              clickSound.currentTime = 0;
              clickSound.play();
            }
          } else {
            console.error(`info-hotspot: L'entitat panell "${data.targetPanel}" (trobada per ${el.id}) no té el component 'info-panel'. Assegura't que l'entitat panell té l'atribut info-panel.`);
          }
        });
        // --- Fi Lògica de Clic ---
      }
    }
    // No cal mètode update o tick per a aquest component simple
  });
  
  //TEXT
  AFRAME.registerComponent('info-panel', {
    schema: {
      closeButton: { type: 'selector', }, // Selector del botó de tancar dins del panell (p.ex., #infoPanel-hazard1 .close-button)
      visible: { type: 'boolean', default: false } // Controlar la visibilitat inicial
    },
  
    init: function () {
      const el = this.el; // L'entitat del panell (l'a-entity contenidora)
      const data = this.data;
  
      console.log('Component info-panel inicialitzat a:', el.id); // Log d'inicialització
  
      // Buscar el botó de tancar (fer-ho a l'init)
      const closeButtonEl = data.closeButton
  
      if (!closeButtonEl) {
        console.warn(`info-panel: [${el.id}] No s'ha trobat el botó de tancar amb selector "${data.closeButton}". El panell no es podrà tancar amb el botó.`);
      } else {
        // Afegir listener de clic al botó de tancar
        closeButtonEl.addEventListener('click', () => {
          console.log('Clic a Tancar Panell:', el.id);
          this.toggle(); // <--- Cridar el mètode toggle d'aquest mateix component
        });
      }
  
      // Establir la visibilitat inicial segons l'esquema
      el.setAttribute('visible', data.visible);
    },
  
    // Mètode per alternar la visibilitat del panell (cridat des de info-hotspot o el botó de tancar)
    toggle: function () {
      const el = this.el;
      const currentVisible = el.getAttribute('visible');
      console.log(`Alternant visibilitat de ${el.id} de ${currentVisible} a ${!currentVisible}`);
      el.setAttribute('visible', !currentVisible);
  
      // Opcional: Reprodueix un so en obrir/tancar el panell si en tens
      // const panelSound = document.querySelector('#panel-toggle-sound');
      // if (panelSound) { panelSound.play(); }
    }
  });
  