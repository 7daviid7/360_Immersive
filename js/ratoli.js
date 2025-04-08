const cursor = document.querySelector("#cursor");
let isConfigButtonActive = true;
// Configuració inicial segons el dispositiu
if (AFRAME.utils.device.checkHeadsetConnected()) {
// Mode VR: Cursor apunta amb el moviment del cap
cursor.setAttribute("cursor", "rayOrigin", "entity");
cursor.setAttribute("cursor", "fuseTimeout", "1500"); // Temps per a fusió (opcional)
} else {
// Mode ordinador: Cursor segueix el ratolí
cursor.setAttribute("cursor", "rayOrigin", "mouse");
cursor.setAttribute("cursor", "fuse", "false"); // Desactiva el temps d'espera

const configButton = document.querySelector('#configButton');
configButton.setAttribute('visible', false);
isConfigButtonActive = false;
}

// Actualitza quan s'entra/surt de VR
document.querySelector("a-scene").addEventListener("enter-vr", () => {
cursor.setAttribute("cursor", "rayOrigin", "entity");
configButton.setAttribute('visible', true);
isConfigButtonActive=true; 
});

document.querySelector("a-scene").addEventListener("exit-vr", () => {
cursor.setAttribute("cursor", "rayOrigin", "mouse");
isConfigButtonActive=false;
configButton.setAttribute('visible', false);
});

//AMAGAR EL CURSOR. 
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector("#cursor");
    const scene = document.querySelector("a-scene");
  
    // Funció per amagar/mostrar el cursor
    const updateCursorVisibility = () => {
      if (scene.is("vr-mode")) {
        cursor.setAttribute("visible", true);  // Mostra en VR
      } else {
        cursor.setAttribute("visible", false); // Amaga en ordinador
      }
    };
  
    // Actualitza quan canvia el mode VR
    scene.addEventListener("enter-vr", updateCursorVisibility);
    scene.addEventListener("exit-vr", updateCursorVisibility);
  
    // Comprova l'estat inicial
    updateCursorVisibility();
  });