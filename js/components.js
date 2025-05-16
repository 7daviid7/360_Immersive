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
            magFilter: 'nearest',  // Per a quan la textura es veu de prop (magnificació)
            side: 'double'
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
          alphaTest: 0.5, // Important per a imatges transparents
          side: 'double'
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
        alphaTest: 0.5, // Important per a imatges transparents
        side: 'double'
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

AFRAME.registerComponent('adaptive-close-button', {
  schema: {
    baseScale: {type: 'vec3', default: {x: 1, y: 1, z: 1}},
    hoverScale: {type: 'vec3', default: {x: 1.1, y: 1.1, z: 1.1}},
    duration: {type: 'int', default: 200}
  },

  init: function () {
    const el = this.el;
    const base = this.data.baseScale;
    const hover = this.data.hoverScale;
    const duration = this.data.duration;

    // Apliquem animacions amb atributs d'A-Frame
    el.setAttribute('animation__mouseenter', {
      property: 'scale',
      to: `${hover.x} ${hover.y} ${hover.z}`,
      startEvents: 'mouseenter',
      dur: duration
    });

    el.setAttribute('animation__mouseleave', {
      property: 'scale',
      to: `${base.x} ${base.y} ${base.z}`,
      startEvents: 'mouseleave',
      dur: duration
    });

    // Inicialitza amb la mida base
    el.setAttribute('scale', base);
  },

  update: function () {
    const hover = this.data.hoverScale;
    const base = this.data.baseScale;
    const duration = this.data.duration;

    this.el.setAttribute('animation__mouseenter', {
        property: 'scale',
        to: `${hover.x} ${hover.y} ${hover.z}`,
        startEvents: 'mouseenter',
        dur: duration
    });

    this.el.setAttribute('animation__mouseleave', {
        property: 'scale',
        to: `${base.x} ${base.y} ${base.z}`,
        startEvents: 'mouseleave',
        dur: duration
    });

    this.el.setAttribute('scale', base);
    }
});



AFRAME.registerComponent('tutorial-interactiu', {
    schema: {
        toleranciaAngular: {type: 'number', default: 5}, // Tolerància en graus per a la rotació
        targetRotationStep1: {type: 'number', default: 90}, // Graus per al pas 1 (girar a la dreta)
        targetRotationStep2: {type: 'number', default: -90}, // Graus per al pas 2 (girar a l'esquerra, relatiu)
        targetClickObjectSelector: {type: 'selector', default: '#myInteractiveObject'},// Selector de l'objecte que s'ha de clicar al pas 3
        targetSoundSelector: {type: 'selector', default: '#so-celebracio'}
    },

    init: function () {
        // --- Referències als Elements HTML del Manual (Existents) ---
        this.manualPanelEl = this.el;
        this.initialScreenEl = this.manualPanelEl.querySelector('#manual-initial-screen');
        this.tutorialStepsEl = this.manualPanelEl.querySelector('#manual-tutorial-steps');
        this.startButtonEl = this.manualPanelEl.querySelector('#start-tutorial-button');
        this.closeButtonEl = this.manualPanelEl.querySelector('#close-manual-button');
        this.instructionTextEl = this.manualPanelEl.querySelector('#instruction-text');
        this.completionSoundEl =this.data.targetSoundSelector; 
    
        

        // --- Noves Propietats per a la Lògica del Tutorial ---
        this.tutorialActive = false; // Indica si el tutorial està en mode interactiu
        this.currentStep = 0;       // 0 = inactiu, 1 = girar dreta, 2 = girar esquerra, 3 = clicar objecte, etc.
        this.initialCameraYaw = 0;  // Guarda la rotació Y de la càmera a l'inici d'un pas de rotació
        this.clickObjectOriginalColor = ''; // Per restaurar el color original de l'objecte després d'il·luminar-lo

        //agafem la càmera. 
        this.cameraEl = document.querySelector('a-camera');
                    
                  
        //this.cameraEl = this.el.sceneEl.camera.el;
        if (!this.cameraEl) {
              console.error("tutorial-interactiu: La càmera ([a-camera]) encara no s'ha trobat al mètode play. Revisa la definició de la càmera a l'HTML o el moment de càrrega del script.");
        } 
        else {
          console.log("tutorial-interactiu: Càmera trobada amb èxit");
        }

        this.timeSinceLastCheck = 0;

        // --- Listeners d'Esdeveniments per als Botons (Existents) ---
        if (this.startButtonEl) {
            this.startButtonEl.addEventListener('click', () => {
                this.startTutorial();
            });
        } else { console.error("Botó 'Iniciar Tutorial' no trobat!"); }

        if (this.closeButtonEl) {
            this.closeButtonEl.addEventListener('click', () => {
                console.log('Clic detectat al butto de tencar:', this.closeButtonEl.id);
                this.closeManual();
            });
        } else { console.error("Botó 'Tancar' no trobat!"); }

        // --- Configuració Inicial al Carregar el Component (Existents) ---
        this.showInitialScreen(); // Mostrem la pantalla inicial al carregar
    },

    // El mètode 'tick' es crida a cada frame si el component està actiu
    // Mètode tick amb limitació manual
    tick: function (time, timeDelta) {
        // Només actuem si el tutorial està actiu i la càmera existeix
        if (!this.tutorialActive || !this.cameraEl) return;

        // Acumulem el temps des de l'última comprovació
        this.timeSinceLastCheck += timeDelta;

        const radY = this.cameraEl.object3D.rotation.y;
        let currentYaw = radY * (180 / Math.PI);
       
        currentYaw = (currentYaw % 360 + 360) % 360;
        
        let deltaYaw = 0; // Variable per guardar la diferència d'angle per al pas actual
        let progress = 0;
        let targetDelta = 0;

        switch (this.currentStep) {
            case 1: // Pas 1: Girar 45 graus a la dreta
                targetDelta = this.data.targetRotationStep1; // 45°
                deltaYaw = currentYaw - this.initialCameraYaw;
                // Ajustar l'angle per manejar el desbordament de 360/0 graus (si cal per la normalització de delta)
                if (deltaYaw > 180) deltaYaw -= 360;
                if (deltaYaw < -180) deltaYaw += 360;

                // Càlcul del progrés cap a 45° dreta
                progress = THREE.MathUtils.clamp(deltaYaw / targetDelta, 0, 1); // Clamp entre 0 i 1 (només positiu)

                this.instructionTextEl.setAttribute('value',
                    `PAS 1: Gira la vista ${targetDelta}° cap a l'esquerre. (Actual: ${Math.round(deltaYaw)}° / Objectiu: ${targetDelta}°)`);

                // Actualització de la barra de progrés
                if (this.progressBarFillEl) {
                     this.progressBarFillEl.setAttribute('scale', `${progress} 1 1`);
                     // Opcional: Posa el percentatge al text també
                     // this.instructionTextEl.setAttribute('value', `${this.instructionTextEl.getAttribute('value')} (${Math.round(progress * 100)}%)`);
                }
                break;

            case 2: // Pas 2: Girar 90 graus a l'esquerra
                targetDelta = this.data.targetRotationStep2; // -90°
                deltaYaw = currentYaw - this.initialCameraYaw;
                 // Ajustar l'angle per manejar el desbordament de 360/0 graus (si cal)
                if (deltaYaw > 180) deltaYaw -= 360;
                if (deltaYaw < -180) deltaYaw += 360;

                // Càlcul del progrés cap a 90° esquerra
                progress = THREE.MathUtils.clamp(Math.abs(deltaYaw) / Math.abs(targetDelta), 0, 1); // Clamp entre 0 i 1 (només negatiu, per això abs)

                this.instructionTextEl.setAttribute('value',
                    `PAS 2: Ara, gira la vista ${Math.abs(targetDelta)}° cap a la dreta. (Actual: ${Math.round(deltaYaw)}° / Objectiu: ${targetDelta}°)`);

                 // Actualització de la barra de progrés
                 if (this.progressBarFillEl) {
                      this.progressBarFillEl.setAttribute('scale', `${progress} 1 1`);
                      // Opcional: Posa el percentatge al text també
                     // this.instructionTextEl.setAttribute('value', `${this.instructionTextEl.getAttribute('value')} (${Math.round(progress * 100)}%)`);
                 }
                break;

            case 3: // Pas 3: Clicar l'objecte - NO hi ha progrés de rotació aquí
                 progress = 0; // El progrés de rotació és 0 en aquest pas
                 this.instructionTextEl.setAttribute('value', `PAS 3: Fes clic a l'objecte il·luminat.`);
                 // La barra de progrés ja s'haurà amagat a setupStep
                 break;

            default: // Altres passos o inactiu
                progress = 0; // No hi ha progrés en altres estats
                // La barra de progrés ja s'haurà amagat a setupStep o closeManual
                break;
        }

        //DQ: Només per optimització. 
        // --- Comprovació de Completació del Pas (Només cada interval) ---
        const checkInterval = 50; // Mil·lisegons
        if (this.timeSinceLastCheck < checkInterval) {
            return; // No s'ha complert l'interval, sortim
        }
        this.timeSinceLastCheck -= checkInterval; // Reiniciem el comptador

        // --- Lògica de Comprovació (Això només s'executa cada checkInterval) ---
        switch (this.currentStep) {
            case 1: // Pas 1: Girar a la dreta
                 // 'deltaYaw' ja s'ha calculat abans
                 // Comprovem si el delta actual és prou a prop de l'objectiu (45)
                if (Math.abs(deltaYaw - targetDelta) < this.data.toleranciaAngular) {
                    console.log("Pas 1 completat: Rotació a la dreta.");
                    this.nextStep();
                }
                break;

            case 2: // Pas 2: Girar a l'esquerra
                // 'deltaYaw' ja s'ha calculat abans
                 // Comprovem si el delta actual és prou a prop de l'objectiu (-90)
                if (Math.abs(deltaYaw - targetDelta) < this.data.toleranciaAngular) {
                    console.log("Pas 2 completat: Rotació a l'esquerra.");
                    this.nextStep();
                }
                break;
            // El Pas 3 (clic) es comprova al listener handleTargetClick, no aquí.
        }
    },
    // --- Mètodes de Control del Manual (Existents) ---
    showInitialScreen: function() {
        console.log("Mostrant pantalla inicial del manual.");
        this.initialScreenEl.setAttribute('visible', true);
        this.tutorialStepsEl.setAttribute('visible', false);
        this.manualPanelEl.setAttribute('visible', true);
        this.manualPanelEl.setAttribute('scale', '1 1 1'); // Restaura l'escala
        this.closeButtonEl.setAttribute('visible', true);
        this.closeButtonEl.setAttribute('position', '1.2 -1 0.01');         
        this.closeButtonEl.setAttribute('adaptive-close-button', {
        baseScale: {x: 1, y: 1, z: 1},
        hoverScale: {x: 1.1, y: 1.1, z: 1.1},
        duration: 100
        });

        this.startButtonEl.setAttribute('scale', '1 1 1');
        this.startButtonEl.setAttribute('visible', true); 
        this.data.targetClickObjectSelector.setAttribute('scale', '0 0 0')
        // Assegurem-nos que el tutorial està inactiu quan mostrem la pantalla inicial
        this.tutorialActive = false;
        this.currentStep = 0;
        this.instructionTextEl.setAttribute('value', ''); // Buidar el text d'instrucció
        this.removeStepListeners(); // Netejar qualsevol listener de pas actiu
    },

    startTutorial: function() {
        console.log("Iniciant tutorial interactiu...");
        this.tutorialActive = true; // Activem el mode interactiu
        this.currentStep = 1;       // Comencem pel primer pas real
        
        this.startButtonEl.setAttribute('scale', '0 0 0'); 
        this.startButtonEl.setAttribute('visible', false);
        this.initialScreenEl.setAttribute('visible', false);
        this.tutorialStepsEl.setAttribute('visible', true);
        this.closeButtonEl.setAttribute('position', '2.2 1.4 0.01');
        this.closeButtonEl.setAttribute('adaptive-close-button', {
        baseScale: {x: 0.310, y: 0.840, z: 1},
        hoverScale: {x: 0.341, y: 0.924, z: 1} // per exemple, una mica més gran que baseScale
        });

        this.setupStep(this.currentStep); // Configurarem el primer pas
    },

    closeManual: function() {
        console.log("Tancant manual...");
        this.manualPanelEl.setAttribute('visible', false);
        this.manualPanelEl.setAttribute('scale', '0 0 0'); // Escala a 0 per amagar-lo completament
        this.tutorialActive = false;
        this.currentStep = 0;
        this.removeStepListeners(); // Netejar qualsevol listener de pas actiu
        if (window.setSence) { // Assegura't que la funció existeix abans de cridar-la
            window.setSence();
        } else {
            console.warn("La funció window.setSence() no està definida.");
        }
    },

    finishTutorial: function() {
        console.log("Tutorial interactiu completat!");
        if (this.instructionTextEl) {
            this.instructionTextEl.setAttribute('value', 'Tutorial completat! Ja pots navegar per l\'oficina.');
        }

        this.tutorialActive = false;
        this.currentStep = 100; // O un estat com 'finished'

        this.removeStepListeners(); // Netejar qualsevol listener de pas actiu

        // Tancar automàticament després de 3 segons
        setTimeout(() => {
            this.closeManual();
        }, 3000);
    },

    // --- NOU MÈTODE: setupStep ---
    setupStep: function(stepNumber) {
        console.log("Configurant pas del tutorial:", stepNumber);
        this.removeStepListeners(); // Neteja els listeners dels passos anteriors

        switch (stepNumber) {
            case 1: // Pas 1: Girar a la dreta
                // Guardem la rotació inicial de la càmera en aquest moment
                this.initialCameraYaw = THREE.MathUtils.radToDeg(this.cameraEl.components.rotation.data.y);
                console.log('setupStep(1): Guardant rotació inicial (initialCameraYaw) com a:', this.initialCameraYaw);
                this.instructionTextEl.setAttribute('value', `PAS 1: Gira la vista 45° cap a la dreta.`);
                break;

            case 2: // Pas 2: Girar a l'esquerra
                // Guardem la rotació inicial de la càmera per a aquest nou gir relatiu
                this.initialCameraYaw = THREE.MathUtils.radToDeg(this.cameraEl.components.rotation.data.y);
                this.instructionTextEl.setAttribute('value', `PAS 2: Ara, gira la vista 90° cap a l'esquerra.`);
                break;

            case 3: // Pas 3: Clicar un objecte
                this.targetClickObject = this.data.targetClickObjectSelector;
                if(!this.targetClickObject)
                {
                    console.log("ERROR. "); 
                }
                else {console.log("targetClickobject inicialitzat amb: ", this.targetClickObject)}
                if (this.targetClickObject) {
                    // Guardem el color original per restaurar-lo després
                    this.clickObjectOriginalColor = this.targetClickObject.getAttribute('material', 'color') || this.targetClickObject.getAttribute('color');

                    // Il·luminar l'objecte objectiu
                    this.targetClickObject.setAttribute('scale', '1 1 1')
                    this.targetClickObject.setAttribute('material', 'color', '#00ff00'); // Verd brillant
                    this.targetClickObject.setAttribute('material', 'emissive', '#00ff00'); // Fes-lo brillar
                    this.targetClickObject.setAttribute('material', 'emissiveIntensity', 0.5);

                    this.instructionTextEl.setAttribute('value', `PAS 3: Fes clic a l'objecte il·luminat.`);
                    // Afegeix el listener de clic només a l'objecte objectiu
                    this.targetClickObject.addEventListener('click', this.handleTargetClick.bind(this));
                } else {
                    console.error("tutorial-interactiu: L'objecte a clicar per al pas 3 no s'ha trobat amb el selector:", this.data.targetClickObjectSelector);
                    // Si l'objecte no existeix, salta aquest pas
                    this.nextStep();
                }
                break;

            case 4: // Pas final: Tutorial completat
                this.finishTutorial();
                break;

            default:
                console.warn("tutorial-interactiu: Pas del tutorial desconegut:", stepNumber);
                this.finishTutorial();
                break;
        }
    },

    nextStep: function() {   
    console.log("Passant al següent pas. Actual:", this.currentStep);
    
    // Guarda el pas actual abans d'incrementar-lo
    const completedStep = this.currentStep;

    // Reprodueix el so de completació
    if (this.completionSoundEl) {
        this.completionSoundEl.components.sound.stopSound()
        this.completionSoundEl.components.sound.playSound();
    } else {
        console.warn("No es pot reproduir el so de completació. Entitat o component sound no trobat.");
    }

    // Si acabem de completar el pas 1 o 2, reseteja la càmera
    if ((completedStep === 1 || completedStep === 2) && this.cameraEl) {
        console.log("Resetejant la càmera a 0,0,0");
        
        // Guarda l'estat dels controls
        const lookEnabled = this.cameraEl.hasAttribute('look-controls');
        const wasdEnabled = this.cameraEl.hasAttribute('wasd-controls');
        
        // Desactiva temporalment els controls
        if (lookEnabled) this.cameraEl.removeAttribute('look-controls');
        if (wasdEnabled) this.cameraEl.removeAttribute('wasd-controls');
        
        // Reseteja la rotació
        this.cameraEl.setAttribute('rotation', {x: 0, y: 0, z: 0});
        
        // Força l'actualització de la matriu
        this.el.sceneEl.object3D.updateMatrixWorld(true);
        
        // Restaura els controls després d'un petit retard
        setTimeout(() => {
            if (lookEnabled) this.cameraEl.setAttribute('look-controls', '');
            if (wasdEnabled) this.cameraEl.setAttribute('wasd-controls', '');
        }, 100);
    }

    // Incrementa el pas i configura el següent
    this.currentStep++;
    this.setupStep(this.currentStep);
},

    // --- NOU MÈTODE: handleTargetClick ---
    // Listener per quan es clica l'objecte objectiu al pas 3
    handleTargetClick: function() {
        console.log("Objectiu clicat! Pas 3 completat.");
        // Restaura l'aparença original de l'objecte
        if (this.targetClickObject) {
            this.targetClickObject.setAttribute('material', 'color', this.clickObjectOriginalColor);
            this.targetClickObject.setAttribute('material', 'emissive', '#000000'); // Apagar l'emissió
            // És crucial eliminar el listener per evitar múltiples crides
            this.targetClickObject.removeEventListener('click', this.handleTargetClick);
        }
        this.nextStep(); // Passa al següent pas (que serà el final)
    },

    // --- NOU MÈTODE: removeStepListeners ---
    // Neteja els listeners específics del pas actiu
    removeStepListeners: function() {
        if (this.targetClickObject) {
            this.targetClickObject.removeEventListener('click', this.handleTargetClick);
            // Si el tutorial es tanca mentre l'objecte estava il·luminat, restaura el seu color
            if (this.clickObjectOriginalColor) {
                this.targetClickObject.setAttribute('material', 'color', this.clickObjectOriginalColor);
                this.targetClickObject.setAttribute('material', 'emissive', '#000000');
            }
            this.targetClickObject = null;
        }
    },

    // Mètode remove del component (per netejar-ho tot si el component és desenganxat de l'entitat)
    remove: function() {
        this.removeStepListeners(); // Netejar qualsevol listener de pas actiu
        // Per als listeners de botons (startButtonEl, closeButtonEl), com que estan definits amb arrow functions directament,
        // la neteja de memòria es gestiona automàticament amb la destrucció del component.
    }
});

