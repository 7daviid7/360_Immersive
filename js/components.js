// js/components.js
AFRAME.registerComponent('tutorial-button', {
    schema: {
        // Propietats visuals del botó
        src: { type: 'selector', default: '#tutorial' }, // Selector de la imatge per defecte del botó (assegura't de tenir-la a <a-assets>)
        hoverSrc: { type: 'selector', default: '#hoverTutorial'}, // Selector de la imatge al passar el ratolí (per efecte hover)
        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 1.2 },
        defaultOpacity: { type: 'number', default: 1 },
        
        // Propietats de lògica del tutorial
        manualPanelSelector: { type: 'selector', default: '#instruccions' }, // Selector del panell principal del manual
    },

    init: function() {
        console.log('Component tutorial-button inicialitzat a:', this.el.id); // Corregit el log per dir 'tutorial-button'

        const el = this.el; // L'entitat on s'adjunta aquest component
        const data = this.data; // Les dades del schema d'aquest component
        const clickSound=this.clickSound = document.querySelector('#click-sound');
        const manualPanelEl = data.manualPanelSelector; // Referència al panell del manual

        el.classList.add('interactive'); // Assegura que el cursor detecti el botó

        // --- 1. Obtenir referències als elements necessaris ---
       
        if (!manualPanelEl) {
            console.error("Component tutorial-button: El panell del manual especificat no es troba al DOM amb el selector:", data.manualPanelSelector);
            return; // Sortim si no trobem el manual
        }
        else 
        {
          console.log('Component tutorial-button: manualPanelEl és:', manualPanelEl);
        }
        
        // --- 2. Configurar la geometria i el material inicial del botó ---
        el.setAttribute('geometry', {
            primitive: 'plane',
            width: data.width,
            height: data.height
        });
        el.setAttribute('material', {
            src: data.src,
            shader: 'flat',
            opacity: data.defaultOpacity,
            alphaTest: 0.5,
            minFilter: 'nearest', // Per a quan la textura es veu de lluny (minificació)
            magFilter: 'nearest'  // Per a quan la textura es veu de prop (magnificació)
        });

        // --- 3. Afegir el Listener de Clic ---
        el.addEventListener('click', () => {
            console.log('Tutorial button clicked:', el.id);
            // Reproduir el so de clic si existeix
            if (clickSound) {
                clickSound.play();
            }
            // Cridar el mètode per mostrar la pantalla inicial del manual
            manualPanelEl.components['tutorial-interactiu'].showInitialScreen();
        });

        // --- 4. Afegir Listeners per Efectes de Hover (opcional, però millora UX) ---
        el.addEventListener('mouseenter', () => {
            el.setAttribute('material', 'src', data.hoverSrc); // Canvia a la imatge de hover
            //el.setAttribute('scale', '1.1 1.1 1.1'); // Escala una mica el botó per donar feedback
            // Opcional: canviar color si no uses imatges (o a més d'imatges)
            // el.setAttribute('color', '#0056b3'); // Un blau més fosc
        });

        el.addEventListener('mouseleave', () => {
            el.setAttribute('material', 'src', data.src); // Torna a la imatge per defecte
            //el.setAttribute('scale', '1 1 1'); // Restaura l'escala original
            // Opcional: restaurar color
            // el.setAttribute('color', '#007bff');
        });
    },
    // No necessitem mètodes com update, tick, remove, etc. per a aquest comportament bàsic
});

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
      hoverSrc: { type: 'selector', default: '#hoverInfo' }, // L'asset per a l'efecte hover (opcional, p.ex., #info-icon-hover)
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
      closeButton: { type: 'selector', default: '#closePanel-1' }, // Selector del botó de tancar dins del panell (p.ex., #infoPanel-hazard1 .close-button)
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

  // NOU COMPONENT: panel-close-button (Gestiona l'aparença i hover del botó de tancar del panell)
AFRAME.registerComponent('close-button', {
    schema: {
        // Propietats visuals per a la icona de tancar
        src: { type: 'selector', default: '#exit'}, // Asset de la icona normal (p.ex., #close-icon)
        hoverSrc: { type: 'selector', default: '#hoverExit'}, // Asset per a l'efecte hover (opcional, p.ex., #close-icon-hover)
        width: { type: 'number', default: 0.15 }, // Mida del botó
        height: { type: 'number', default: 0.15 },
        defaultOpacity: { type: 'number', default: 1.0 } // Opacitat
    },
    init: function () {
        const el = this.el; // L'entitat on s'aplica (l'a-plane del botó)
        const data = this.data;

        console.log('Component panel-close-button inicialitzat a:', el.id || 'entitat sense id'); // Log d'inicialització

        // Configura geometria i material del botó utilitzant les dades de l'esquema
        el.setAttribute('geometry', { primitive: 'plane', width: data.width, height: data.height });
        el.setAttribute('material', {
            src: data.src, // Utilitza l'asset de la icona normal
            shader: 'flat',
            opacity: data.defaultOpacity,
            transparent: true,
            alphaTest: 0.5
        });

        // Assegura que l'entitat és interactiva (si no ho és ja per la classe 'interactive' a l'HTML)
        // Tot i que posarem la classe a l'HTML, afegir-la aquí garanteix que hi sigui si s'usa el component
        el.classList.add('interactive');

        // Lògica de Hover (si s'ha definit hoverSrc)
        const defaultSrc = data.src; // Guardem la src original
        if (data.hoverSrc) {
            el.addEventListener('mouseenter', () => {
                 el.setAttribute('material', 'src', data.hoverSrc);
            });
            el.addEventListener('mouseleave', () => {
                 el.setAttribute('material', 'src', defaultSrc); // Tornar a la src original
            });
        }

        // NOTA IMPORTANT: La lògica per TANCAR el panell (el listener de clic que crida toggle())
        // NO VA AQUÍ. Aquesta lògica l'afegirà el component info-panel (que busca aquest botó).
        // Aquest component només s'encarrega de l'APARENÇA i el HOVER del botó.
    }
});

AFRAME.registerComponent('tutorial-interactiu', {
  schema: {
      // Tolerància angular per detectar la rotació (en graus)
      toleranciaAngular: {type: 'number', default: 5}
      // Pots afegir altres propietats aquí si cal (p.ex. duració del feedback)
  },

  init: function () {
      // --- Referències als Elements HTML del Manual ---
      this.manualPanelEl = this.el; // L'entitat <a-entity id="instruccions"> a la qual està adjunt el component

      // Referències a les dues "pantalles" principals dins del manual
      this.initialScreenEl = this.manualPanelEl.querySelector('#manual-initial-screen');
      this.tutorialStepsEl = this.manualPanelEl.querySelector('#manual-tutorial-steps');

      // Referències als botons
      this.startButtonEl = this.manualPanelEl.querySelector('#start-tutorial-button');
      this.closeButtonEl = this.manualPanelEl.querySelector('#close-manual-button'); // Usem el mateix botó "Tancar" per a les dues pantalles

      // Referència al text on mostrarem les instruccions dinàmiques
      this.instructionTextEl = this.manualPanelEl.querySelector('#instruction-text');


      // --- Configuració Inicial al Carregar el Component ---
      this.showInitialScreen(); // Mostrem la pantalla inicial

      // --- Listeners d'Esdeveniments per als Botons de la Pantalla Inicial ---
      if (this.startButtonEl) {
           this.startButtonEl.addEventListener('click', this.startTutorial.bind(this) );
      } else { console.error("Botó 'Iniciar Tutorial' no trobat!"); }

      if (this.closeButtonEl) {
          this.closeButtonEl.addEventListener('click', () => {
            console.log('Clic detectat al butto de tencar:', this.closeButtonEl.id);
            this.closeManual(); 

        });
      } else { console.error("Botó 'Tancar' no trobat!"); }


      // TODO: Si teniu botons "Anterior"/"Següent" o "Començar" dins de la pantalla de passos,
      // haureu d'afegir els seus listeners *després* de mostrar la pantalla de passos,
      // o assegurar-vos que només s'activen quan el tutorialActive sigui true i el pas correcte.

  },
  showInitialScreen: function() {
      console.log("Mostrant pantalla inicial del manual.");
      // Mostrem només la pantalla inicial i amaguem la de passos
      this.initialScreenEl.setAttribute('visible', true);
      this.tutorialStepsEl.setAttribute('visible', false);

      // Assegura't que el panell principal #instruccions sigui visible
      this.manualPanelEl.setAttribute('visible', true);
      this.manualPanelEl.setAttribute('scale', '1 1 1');

      // Assegura't que les guies visuals del món estiguin ocultes en aquest esta

       // Posiciona el botó de tancar on toqui a la pantalla inicial
       // Si el tens dins de manual-initial-screen, la posició ja seria local.
       // Si el tens fora, gestiona aquí la seva posició/visibilitat.
       // En l'HTML suggerit, el closeButton està dins d'initial-screen, així que ja es mostra amb ell.
       // No obstant això, el tornarem a fer visible aquí per si de cas i ajustem la posició si cal.
       this.closeButtonEl.setAttribute('visible', true);
       // Exemple de posició dins del contenidor manual-content-container
       this.closeButtonEl.setAttribute('position', '0 -1 0.01');
  },

  startTutorial: function() {
      console.log("Iniciant tutorial interactiu...");
      this.tutorialActive = true; // Activem el mode interactiu
      this.currentStep = 1; // Comencem pel primer pas interactiu real (el pas de girar 45)

      // Ocultem la pantalla inicial
      this.initialScreenEl.setAttribute('visible', false);
      // Mostrem la pantalla dels passos del tutorial
      this.tutorialStepsEl.setAttribute('visible', true);

      // Ajustem la posició del botó de tancar per a la pantalla de passos si cal
       this.closeButtonEl.setAttribute('position', '2.2 1.4 0.01'); // Exemple de posició per a la pantalla de passos

      // Iniciem la configuració visual i objectiu per al primer pas
      this.setupStep(this.currentStep);
  },

  closeManual: function() {
      console.log("Tancant manual...");
      this.manualPanelEl.setAttribute('visible', false); // Amaguem tot el panell principal
      this.manualPanelEl.setAttribute('scale', '0 0 0');
      this.tutorialActive = false; // Desactivem el mode interactiu del tick
      this.currentStep = 0; // Reset l'estat a l'inicial/inactiu

      // TODO: Reset l'estat de l'escena si cal (p.ex. tornar a l'escena 1 si no hi som, reset rotació?)
      // També podríem voler mostrar de nou la pantalla inicial per si el tornen a obrir
      // Preparem la pantalla inicial per a la propera vegada que s'obri
       window.setSence(); 
  },

   finishTutorial: function() {
       console.log("Tutorial interactiu completat!");
       // TODO: Mostrar un missatge final a la pantalla de passos
       if (this.instructionTextEl) {
           this.instructionTextEl.setAttribute('value', 'Tutorial completat! Ja pots navegar per l\'oficina.');
       }


       // Decidir què fer al final:
       // 1. Deixar el missatge final i el botó de tancar actiu.
       // 2. Tancar el manual automàticament després d'uns segons.
       // 3. Mostrar un botó "Tornar a l'Oficina".

       // Exemple 2: Tancar automàticament després de 3 segons
       setTimeout(() => {
           this.closeManual();
       }, 3000);

       this.tutorialActive = false; // Ja no comprovem passos al tick
       this.currentStep = 100; // Un número alt o un estat com 'finished' per indicar que ha acabat
   },

});