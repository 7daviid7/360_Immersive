//fletxes. 
AFRAME.registerComponent('arrow-button', {
    schema: {
      src: { type: 'selector', /*default: '#arrow'*/},
      width: { type: 'number', default: 0.5 },
      height: { type: 'number', default: 0.5 },
      defaultOpacity: { type: 'number', default: 0.9 }
    },
    init: function () {
      // Configura la geometria i el material
      this.el.setAttribute('geometry', {
        primitive: 'plane',
        width: this.data.width,
        height: this.data.height
      });
      this.el.setAttribute('material', {
        src: this.data.src,
        shader: 'flat',
        opacity: this.data.defaultOpacity,
        alphaTest: 0.5
      });
      this.el.classList.add('clickable');
  
      // Animació al passar el cursor per sobre
      this.el.setAttribute('animation__mouseenter', {
        property: 'scale',
        to: '0.7 0.7 0.7',
        startEvents: 'mouseenter',
        dur: 200
      });
      // Animació al treure el cursor
      this.el.setAttribute('animation__mouseleave', {
        property: 'scale',
        to: '0.5 0.5 0.5',
        startEvents: 'mouseleave',
        dur: 200
      });
    }
  });

  //seleccio de cursor.
  AFRAME.registerComponent('config-panel', {
    schema: {
      visible: { type: 'boolean', default: false },
      position: { type: 'vec3', default: { x: 0, y: 2.5, z: -3 } }
    },
    init: function () {
      const panel = this.el;
      // Aplica la posició i visibilitat del panell
      panel.setAttribute('position', this.data.position);
      panel.setAttribute('visible', this.data.visible);
      
      // Injecta el contingut del panell
      panel.innerHTML = `
        <!-- Fons del panell -->
        <a-box position="0 0 0" width="3" height="2" depth="0.1" color="#333" opacity="0.95"></a-box>
        
        <!-- Secció Color -->
        <a-entity position="-1.2 0.7 0.1" text="value: Color; align: center; width: 1.5; color: white; font-size: 0.08"></a-entity>
        <a-entity id="colorPicker" position="-1.2 0.3 0.1" 
                  geometry="primitive: circle; radius: 0.2"
                  material="color: #001489; shader: flat"
                  class="clickable"
                  animation__hover="property: scale; to: 1.1 1.1 1.1; startEvents: mouseenter; dur: 200"
                  animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200">
        </a-entity>
  
        <!-- Secció Mida -->
        <a-entity position="0 0.7 0.1" text="value: Mida; align: center; width: 1.5; color: white; font-size: 0.08"></a-entity>
        <a-entity position="0 0.3 0.1">
            <a-entity class="slider-minus clickable" position="-0.4 0 0"
                    geometry="primitive: circle; radius: 0.15"
                    material="color: #666; shader: flat"
                    text="value: -; align: center; width: 0.5; color: white"
                    animation__hover="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                    animation__click="property: material.color; to: #444; startEvents: click; dur: 200">
            </a-entity>
            
            <a-entity class="slider-value" position="0 0 0" 
                    text="value: 0.08; align: center; width: 1.0; color: white"></a-entity>
            
            <a-entity class="slider-plus clickable" position="0.4 0 0"
                    geometry="primitive: circle; radius: 0.15"
                    material="color: #666; shader: flat"
                    text="value: +; align: center; width: 0.5; color: white"
                    animation__hover="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                    animation__click="property: material.color; to: #444; startEvents: click; dur: 200">
            </a-entity>
        </a-entity>
  
        <!-- Secció Opacitat -->
        <a-entity position="1.2 0.7 0.1" text="value: Opacitat; align: center; width: 1.5; color: white; font-size: 0.08"></a-entity>
        <a-entity position="1.2 0.3 0.1">
            <a-entity class="slider-minus clickable" position="-0.4 0 0"
                    geometry="primitive: circle; radius: 0.15"
                    material="color: #666; shader: flat"
                    text="value: -; align: center; width: 0.5; color: white"
                    animation__hover="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                    animation__click="property: material.color; to: #444; startEvents: click; dur: 200">
            </a-entity>
            
            <a-entity class="slider-value" position="0 0 0" 
                    text="value: 0.8; align: center; width: 1.0; color: white"></a-entity>
            
            <a-entity class="slider-plus clickable" position="0.4 0 0"
                    geometry="primitive: circle; radius: 0.15"
                    material="color: #666; shader: flat"
                    text="value: +; align: center; width: 0.5; color: white"
                    animation__hover="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
                    animation__click="property: material.color; to: #444; startEvents: click; dur: 200">
            </a-entity>
        </a-entity>
      `;
    },
    
    update: function () {
      // Actualitza la visibilitat si la propietat canvia
      this.el.setAttribute('visible', this.data.visible);
    }
  });

  AFRAME.registerComponent('config-button', {
    schema: {
      target: { type: 'selector' } // el selector del panell de configuració
    },
    init: function () {
      const el = this.el;
      const target = this.data.target;
  
      // Quan es fa clic, es canvia la visibilitat del panell
      el.addEventListener('click', function () {
        if (target) {
          const current = target.getAttribute('visible');
          target.setAttribute('visible', !current);
        }
      });
    }
  });
  