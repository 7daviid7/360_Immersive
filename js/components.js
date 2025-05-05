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



// Si tens altres components en aquest arxiu, continuarien aquí a sota...