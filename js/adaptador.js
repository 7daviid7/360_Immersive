document.addEventListener('DOMContentLoaded', () => {
  // Configuració inicial del cursor
  const cursor = document.querySelector('#cursor');
  let currentColor = '#001489';
  let currentSize = 0.08;
  let currentOpacity = 0.8;

  // Elements 3D
  const configButton = document.querySelector('#configButton');
  const configPanel = document.querySelector('#configPanel');
  const colorPicker = document.querySelector('#colorPicker');
  const sizeValue = document.querySelectorAll('.slider-value')[0];
  const opacityValue = document.querySelectorAll('.slider-value')[1];

  // Inicialitzar valors
  cursor.setAttribute('material', 'color', currentColor);
  cursor.setAttribute('radius', currentSize);
  cursor.setAttribute('material', 'opacity', currentOpacity);
  sizeValue.setAttribute('text', 'value', currentSize.toFixed(2));
  opacityValue.setAttribute('text', 'value', currentOpacity.toFixed(1));

  // Control del panell 3D
  configButton.addEventListener('click', () => 
  {
    if(isConfigButtonActive==false)return; 
    const isVisible = configPanel.getAttribute('visible');
    configPanel.setAttribute('visible', !isVisible);
  });

  // Control del color
  colorPicker.addEventListener('click', () => {
    currentColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    colorPicker.setAttribute('material', 'color', currentColor);
    cursor.setAttribute('material', 'color', currentColor);
  });

  // Control de mida
  function updateSize(operation) {
    currentSize = operation === '+' ? 
      Math.min(0.2, currentSize + 0.01) : 
      Math.max(0.05, currentSize - 0.01);
    
    cursor.setAttribute('radius', currentSize);
    sizeValue.setAttribute('text', 'value', currentSize.toFixed(2));
  }

  // Control d'opacitat
  function updateOpacity(operation) {
    currentOpacity = operation === '+' ? 
      Math.min(1, currentOpacity + 0.1) : 
      Math.max(0, currentOpacity - 0.1);
    
    cursor.setAttribute('material', 'opacity', currentOpacity);
    opacityValue.setAttribute('text', 'value', currentOpacity.toFixed(1));
  }

  // Assignar events als botons 3D
  document.querySelectorAll('.slider-plus').forEach((btn, index) => {
    btn.addEventListener('click', () => index === 0 ? updateSize('+') : updateOpacity('+'));
  });

  document.querySelectorAll('.slider-minus').forEach((btn, index) => {
    btn.addEventListener('click', () => index === 0 ? updateSize('-') : updateOpacity('-'));
  });

  // Gestió del mode VR
  document.querySelector('a-scene').addEventListener('enter-vr', () => {
    configPanel.setAttribute('visible', false);
  });

});