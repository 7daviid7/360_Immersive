document.addEventListener('DOMContentLoaded', () => {
  const scenes = ['#scene1', '#scene2', '#scene3'];
  let currentSceneIndex = 0;

  function showScene(index) {
      scenes.forEach((sceneID, idx) => {
          const sceneEl = document.querySelector(sceneID);
          if (sceneEl) {
               sceneEl.setAttribute('visible', idx == index);
          } else {
               console.log(`Element de l'escena no trobat: ${sceneID}`);
          }
      });
      currentSceneIndex = index;
  }
  // FEM LA FUNCIÓ DE CANVI D'ESCENA GLOBALMENT ACCESSIBLE
  window.changeScene = function(forward = true) {
      currentSceneIndex = forward
          ? (currentSceneIndex + 1) % scenes.length
          : (currentSceneIndex - 1 + scenes.length) % scenes.length;
      console.log('Canviant d\'escena...', currentSceneIndex, forward ? 'Endavant' : 'Enrere');
      showScene(currentSceneIndex);
  };
  showScene(currentSceneIndex);
});