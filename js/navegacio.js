document.addEventListener('DOMContentLoaded', () => {
    const scenes = ['#scene1', '#scene2', '#scene3'];
    let currentSceneIndex = 0;

    function showScene(index) {
      scenes.forEach((sceneID, idx) => {
        document.querySelector(sceneID).setAttribute('visible', idx === index);
      });
      currentSceneIndex = index;
      const configButton = document.querySelector('#configButton');
      if(currentSceneIndex==1)
      {
        
      }
      else if(currentSceneIndex==2)
      {
        configButton.setAttribute('visible', false);
      }
      else if (currentSceneIndex==3) 
      {
        configButton.setAttribute('visible', false);
      }
    }

    function changeScene(forward = true) {
      currentSceneIndex = forward
        ? (currentSceneIndex + 1) % scenes.length
        : (currentSceneIndex - 1 + scenes.length) % scenes.length;
      showScene(currentSceneIndex);
    }

    // Assignació automàtica de listeners
    document.querySelectorAll('[id^="forward-arrow"]').forEach(arrow => {
      arrow.addEventListener('click', () => {
        changeScene(true);
        document.querySelector('#click-sound').play();
      });
    });

    document.querySelectorAll('[id^="back-arrow"]').forEach(arrow => {
      arrow.addEventListener('click', () => {
        changeScene(false);
        document.querySelector('#click-sound').play();
      });
    });
    showScene(currentSceneIndex);
  });