/**
 * ----------------------------------------
 * Important functions
 * ----------------------------------------
 */

function fadeOut(targetElement, duration = 300) {
  let currentHeight = targetElement.clientHeight;
  targetElement.style.transition = `opacity ${duration / 1000}s ease-in-out`;
  targetElement.style.overflow = 'hidden';
  targetElement.style.opacity = 0;

  setTimeout(() => {
    let intervalId = setInterval(function() {
      //console.log(currentHeight);
      currentHeight -= (currentHeight / (duration / 15)); // Adjust the divisor for animation speed
      if (currentHeight >= 0.6) {
        targetElement.style.height = currentHeight + 'px';
      } else {
        clearInterval(intervalId);
        targetElement.removeAttribute('style');
        targetElement.style.display = 'none';
      }
    }, 15); // Adjust the interval time for the animation speed
  }, duration / 2);
}

function fadeIn(targetElement, duration = 300) {
  targetElement.style.transition = `opacity ${duration / 1000}s ease-in-out`;
  targetElement.style.overflow = 'hidden';
  targetElement.style.display = 'block'; // Show the element initially

  const elementHeight = targetElement.clientHeight;
  targetElement.style.height = '0';
  targetElement.style.opacity = 0;

  setTimeout(() => {
    let currentOpacity = 0;
    let currentHeight = 0;
    let intervalId = setInterval(function() {
      currentOpacity += 1 / (duration / 15); // Adjust divisor for animation speed
      currentHeight += elementHeight / (duration / 15); // Adjust divisor for animation speed
      if (currentOpacity <= 1) {
        targetElement.style.opacity = currentOpacity;
        targetElement.style.height = currentHeight + 'px';
      } else {
        clearInterval(intervalId);
        targetElement.style.opacity = 1;
        targetElement.style.height = 'auto'; // Set back to auto after animation completes
      }
    }, 15); // Adjust the interval time for the animation speed
  }, duration / 2);
}



// Checks if elements are in a any hidden container
function isElementOrAncestorHidden(element) {
  var currentElement = element;

  while (currentElement !== null && currentElement !== document) {
      if (window.getComputedStyle(currentElement).display === 'none' || window.getComputedStyle(currentElement).opacity === '0') {
          return true;
      }
      currentElement = currentElement.parentNode;
  }
  return false;
}


function handleSingleAccordion (element , contentHolder,callback = false){
    let accodionContent = element.querySelector(contentHolder);
    if(element.classList.contains('active')){
      accodionContent.style.maxHeight = accodionContent.scrollHeight + "px";
    }else{
      accodionContent.style.maxHeight = 0;
    }

    if (typeof callback === 'function') {
       let  func =  callback(accodionContent);
    }
}

// Handles closing element
function hideElementByForAttribute(clickedElement) {
// Check if the clicked element has a 'for' attribute
let forAttribute = clickedElement.getAttribute('for');

if (forAttribute) {
  // Find the element with the corresponding ID
  let targetElement = document.getElementById(forAttribute);

  // Check if the target element exists and hide it
  if (targetElement) {
    //targetElement.classList.add('hidden-element');
    fadeOut(targetElement,150);
    //targetElement.style.display = 'none';
  }
}
}

function headerPopUpToggleHandler(triggerElement){
  // create the clicked event
  triggerElement.addEventListener('click', function (event) {
    closeAllSiblings();
    // Prevent the click from immediately hiding the dropdown
    event.stopPropagation();
    let el = event.currentTarget;

    toggleExpanded(triggerElement);
    focusOnFirstMenuElement();

    if(el.getAttribute('aria-expanded') == 'false'){
      el.focus();
    };


  });

  let targetElement = getTargetEl(); 
  let menuItems  = targetElement.querySelectorAll('[role="menuitem"], button , a');
  let menu = event.currentTarget;

  // add eventlister for keyups
  if(getTargetEl()){
    getTargetEl().addEventListener('keyup', event =>{

      //console.log(event.key);
      //for excape key
      if(event.key == 'Escape'){
        triggerElement.setAttribute('aria-expanded','false');
        triggerElement.focus();
      }

      if(event.key == "ArrowDown" || event.key == "ArrowRight"){
        // get the current focused element
        let focusedLink = menu.querySelector('[role="menuitem"]:focus');
        menuItems.forEach((item , index) =>{
          if(focusedLink == item ){
            nextItem = menuItems[index + 1];
            if(nextItem){
              nextItem.focus();
            }else{
              menuItems[0].focus();
            }
          }
        })

      }

      if(event.key == "ArrowUp" || event.key == "ArrowLeft"){
        // get the current focused element
        let focusedLink = menu.querySelector('[role="menuitem"]:focus');
        menuItems.forEach((item , index) =>{
          if(focusedLink == item ){
            previousItem = menuItems[index - 1];
            if(previousItem){
              previousItem.focus();
            }else{
              menuItems[menuItems.length - 1].focus();
            }
          }
        })

      }

    })
  }

  function toggleExpanded(el){
    if(el.hasAttribute('aria-expanded')){
      if(el.getAttribute('aria-expanded') == 'false'){
          el.setAttribute('aria-expanded','true');
      }else{
          el.setAttribute('aria-expanded','false');
      }
    }
  }

  // Hide dropdown when clicking outside of it
  document.addEventListener('click', function (event) {
    var target = event.target;
    let targetElement = getTargetEl();



    if(targetElement){
      if (!targetElement.contains(target)) {
        if(triggerElement.hasAttribute('aria-expanded')){
          triggerElement.setAttribute('aria-expanded','false');
        }
      }
    }
  });

  function closeAllSiblings (){
    let siblings = triggerElement.parentNode.querySelectorAll('button[aria-expanded]');
    if(siblings && siblings.length){
      siblings.forEach( btn =>{
        if(btn !== triggerElement){
          btn.setAttribute('aria-expanded','false');
        }
      })
    }
  }

  function getTargetEl(){
    if(triggerElement.hasAttribute('aria-controls') && document.getElementById(triggerElement.getAttribute('aria-controls'))){
      return document.getElementById(triggerElement.getAttribute('aria-controls'));
    }
    return false
  }

  // focus on first menu element
  function focusOnFirstMenuElement(){
    let targetElement = getTargetEl();
    if(targetElement && targetElement.hasAttribute('role')){
      let targetElementRole = targetElement.attributes['role'].value;

      //get menu items
      //let menuItems = targetElement.querySelectorAll('[role="menuitem"]');
      if(menuItems && menuItems.length){
        // focus on the first item
        menuItems[0].focus();
      }
    }
  }

}

function monitorKeyboardMovement (el){

    function getFocusAbleElements(){
      let focusAbles = el.querySelectorAll(':scope  a , :scope  button , :scope  input');
      var visibleFocusables = [];

      focusAbles.forEach(element => {
        if(!isElementOrAncestorHidden(element)){
          visibleFocusables.push(element);
        }
      });

      return visibleFocusables;
    }

  el.addEventListener('keyup', event =>{
    event.stopPropagation();

    let focusedElement = el.querySelector('*:focus');
    let isInMenu = false;
    if(focusedElement){
      isInMenu = focusedElement.closest('[role="menu"]') || focusedElement.closest('.act-as-menu');
    }

    if(isInMenu){
      //console.log('in menu');
      return;
    }

    let visibleFocusables = getFocusAbleElements();

    if(focusedElement){

          if(event.key == 'Escape' && !isInMenu){

            if(!document.activeElement.hasAttribute('aria-expanded')){
              document.activeElement.blur();
            }
            let expandedArias = document.querySelectorAll('[aria-expanded="true"]');
            if(expandedArias && expandedArias.length){
              expandedArias.forEach(aria => {
                aria.setAttribute('aria-expanded' , 'false');
              })
            }
          }

          if(event.key == "ArrowDown" || event.key == "ArrowRight"){
            if(visibleFocusables  && visibleFocusables.length && focusedElement){

              visibleFocusables.forEach((item , index) =>{
                if(focusedElement == item ){
                  nextItem = visibleFocusables[index + 1];
                  if(nextItem){
                    nextItem.focus();
                  }else{
                    visibleFocusables[0].focus();
                  }
                }
              })

            }

          }

          if(event.key == "ArrowUp" || event.key == "ArrowLeft"){

            if(visibleFocusables  && visibleFocusables.length && focusedElement){

              visibleFocusables.forEach((item , index) =>{
                if(focusedElement == item ){
                  previousItem = visibleFocusables[index - 1];
                  if(previousItem){
                    previousItem.focus();
                  }else{
                    visibleFocusables[visibleFocusables.length - 1].focus();
                  }
                }
              })

            }

          }

    }

  })
}


 /**
 * ----------------------------------------
 * important variables
 * ----------------------------------------
 */
    let setups = document.getElementsByClassName('config-steps')[0].querySelectorAll('.config-step');
    let toggleSetupGuide = document.getElementById('toggle-store-config');
    let setupGuide = document.getElementById('store-config-guide');
    let setupSummary = setupGuide.querySelector('.overview');
    let setupAccordion = setupGuide.querySelector('.config-steps');
    let accordionTitles = document.getElementsByClassName('store-config')[0].querySelectorAll('.config-step .step-header .step-title');
    let readerPolite = document.querySelector('#reader-polite');
    let readerAssertive = document.querySelector('#reader-assertive');
  //




  document.addEventListener('DOMContentLoaded', function() {

    // Handle keyboard movement on body
    monitorKeyboardMovement(document.querySelector('body'));

    // get buttons with button popups and menu navigation
    let hasPopups = document.querySelectorAll('[aria-haspopup="true"]');
    if(hasPopups && hasPopups.length){
      hasPopups.forEach(btn => {
        headerPopUpToggleHandler(btn);
      })
    }

    // Handling closing card
    let cardCloseButtons = document.querySelectorAll('.card-close');
    cardCloseButtons.forEach(element => {
        element.addEventListener("click", (event)=>{
        hideElementByForAttribute(event.currentTarget);
        readerPolite.ariaLabel = 'card closed!';
        })
    });




    // Handle setup guide toggle click event
    if(toggleSetupGuide){

      function handleSetupguideOverview (setupGuide){
        let overview = ' Reading overview. '  + setupGuide.querySelector('.overview #setup-description').textContent + ' ' + document.querySelectorAll('.config-steps>.config-step .step-header .step-state.selected').length + ' of ' + document.querySelectorAll('.config-steps>.config-step').length + ' steps completed.';

          if(setupGuide){
            if(!setupGuide.classList.contains('active')){
              readerPolite.ariaLabel = 'Setup Guide accordion closed, press enter to open Setup Guide accordion.' + overview;
            }else{
              readerPolite.ariaLabel = 'Setup Guide accordion open, press enter to close Setup Guide accordion.' + overview;
            }
          }
      }

        toggleSetupGuide.addEventListener('click', event => {

          let setupGuide = event.target.closest('.store-config');
          setupGuide.classList.toggle('active');

          if(setupGuide.classList.contains('active')){
            setupGuide.classList.add('wait');
            updateConfigContainer();
            updateAllAccordion();

          }else{
            updateConfigContainer();

          }



          handleSetupguideOverview(setupGuide);
        });

        toggleSetupGuide.addEventListener('focus', event => {
          let setupGuide = event.target.closest('.store-config');
          handleSetupguideOverview(setupGuide);
        })
    }

    // Select an empty element once setup guide is toggled
    setupGuide.querySelector('.config-container').addEventListener('transitionend', event =>{

      setupGuide.classList.remove('wait');
      if(setupGuide.classList.contains('active')){
        //updateAllAccordion();
        // Runs only when the target transition is the config-container
        if(event.target === event.currentTarget){
          // Focusing on first uncheck checkbox
          let firstUncheckedItem = setupGuide.querySelector('.step-state:not(.selected)');
          if(firstUncheckedItem){
            //firstUncheckedItem.focus(); 
            //commented out because of screen readers
          }
        }
      }
    })



    // Setup Accordion


    function updateAllAccordion (){
        if(setups){
          setups.forEach(setup => {
            handleSingleAccordion(setup , '.step-details .step-content');
            setTimeout(()=>{
              handleSingleAccordion(setup , '.step-details .step-content',(div)=>{
                div.addEventListener('transitionend', ()=>{
                  handleSingleAccordion(setup , '.step-details .step-content');
                })
              });

            },100)
          });
        }
    }

    function updateConfigContainer(){
      handleSingleAccordion(setupGuide , '.config-container');
      setTimeout(() => {
        handleSingleAccordion(setupGuide , '.config-container');
        setTimeout(() => {
          handleSingleAccordion(setupGuide , '.config-container');
        }, 100);

      }, 100);
    }


      // Function to reset all accordion states
     function resetAllAccordion (){
         let titles = accordionTitles;
         titles.forEach(titleBtn => {
           let setupDiv = titleBtn.closest('.config-step');
           if(setupDiv){
               setupDiv.classList.remove('active')
           }
         })
     }


    // click Event listener for accordion title click
    accordionTitles.forEach(titleBtn => {

        titleBtn.addEventListener('click',event =>{

          // Reset all accordions 
          resetAllAccordion ();

          let setupDiv = titleBtn.closest('.config-step');
          if (setupDiv) {
              setupDiv.classList.add('active');
              handleAccordionTitleFocus(titleBtn);
          }

          // Update all state
          updateAllAccordion();

        });


    })

    function handleAccordionTitleFocus(titleBtn){
      //get accordion container
      let setupDiv = titleBtn.closest('.config-step');
      if(setupDiv){
        // determine container state
        if(setupDiv.classList.contains('active')){
          readerPolite.ariaLabel = titleBtn.textContent + ' Accordion Open, reading content. ' + setupDiv.querySelector('.step-content p').textContent.replace('Learn more' , '');
        }else{
          readerPolite.ariaLabel = 'Press Enter key to Dropdown ' + titleBtn.textContent + ' accordion.';
        }

      }

    }

    //Focus event listeners for accordion title
    accordionTitles.forEach(titleBtn => {
      titleBtn.addEventListener('focus',event =>{
        //get state of accordion
        handleAccordionTitleFocus(event.target);
      });
    })




    // Handle Clicking on icon
    let allCheckButtons = document.querySelectorAll('.config-step .step-header .step-state');

   function updateCheckBtnState(el){
      let setupDiv = el.closest('.config-step');
      // handle aria-checked
      if(el.classList.contains('selected')){
        el.setAttribute('aria-checked' , "true");
      }else{
        el.setAttribute('aria-checked','false');
      }


      if(el.classList.contains('loading')){
        readerPolite.ariaLabel = "processing.";
      }

      if(el.classList.contains('selected')){
        readerPolite.ariaLabel = setupDiv.querySelector('.step-title').textContent +" Checked!, Press enter to uncheck."
      }

      if(el.classList.contains('loading-backwards')){
        readerPolite.ariaLabel = "processing."
      }

      if(el.classList.contains('default')){
        readerPolite.ariaLabel = setupDiv.querySelector('.step-title').textContent + " Unchecked!, press enter to check."
      }
    }

    // Handling Clicked state
    allCheckButtons.forEach((checkBtn)=>{
        checkBtn.addEventListener('click', event => {
        let el = event.currentTarget;
        if(el){
            if(el.classList.contains('default') || (!el.classList.contains('default') && !el.classList.contains('selected') && !el.classList.contains('loading-backwards'))){
            el.classList.remove('default');
            el.classList.add('loading');
            }
            if(el.classList.contains('selected')){
            el.classList.remove('selected');
            el.classList.add('loading-backwards');
            }
        }

        updateCheckBtnState(el);
        updateAllAccordion();
        updateSetupSummary();
        });

    })

    // Handle animation end
    allCheckButtons.forEach((checkBtn)=>{
        checkBtn.addEventListener('animationend', event => {
        let el = event.currentTarget;

        if(el.classList.contains('loading')){
            el.classList.remove('loading');
            el.classList.add('selected');
        }

        if(el.classList.contains('selected')){
            resetAllAccordion ();
            let setupDiv = el.closest('.config-step');
            let nextSibling = setupDiv.nextElementSibling;
            let previousSibling = setupDiv.previousElementSibling;
            let setupToSelect = null;

            // Logic to select the next or previous setup
            if(nextSibling && nextSibling.querySelector('.step-header .step-state:not(.selected)')){
                let checker = nextSibling.querySelector('.step-header .step-state:not(.selected)');
                if(checker){
                    setupToSelect = checker.closest('.config-step');
                }
                } else if(previousSibling && previousSibling.querySelector('.step-header .step-state:not(.selected)')){
                    let checker = previousSibling.querySelector('.step-header .step-state:not(.selected)');
                    if(checker){
                        setupToSelect = checker.closest('.config-step');
                    }
                } else {
                    let uncheckedSiblings = document.getElementsByClassName('config-steps')[0].querySelectorAll('.step-header .step-state:not(.selected)');
                    if(uncheckedSiblings.length){
                        setupToSelect = uncheckedSiblings[0].closest('.config-step');
                    } else {
                        setupToSelect = setupDiv;
                }
            }


            // Select the setup and handle accordion
            if (setupToSelect) {
              setupToSelect.classList.add('active');
              updateAllAccordion();

              // focus on the check box of the next item
              let checkBtn = setupToSelect.querySelector('.step-state');
              if(checkBtn){
                //checkBtn.focus();
              }
            }
        }

        if(el.classList.contains('loading-backwards')){
          el.classList.remove('loading-backwards');
          el.classList.add('default');
        }

        if(el.classList.contains('default')){
          let setupDiv = el.closest('.config-step');
          resetAllAccordion ();
          if (setupDiv) {
            setupDiv.classList.add('active');
            updateAllAccordion();
          }
        }

        updateCheckBtnState(el);

        updateSetupSummary();
        })
    })


    // Accordion Summary
    function updateSetupSummary () {
        let allAccordion = document.querySelectorAll('.config-steps>.config-step');
        let allCompletedAccordion = document.querySelectorAll('.config-steps>.config-step .step-header .step-state.selected');

        // Set summary values
        document.getElementById('completed-steps').innerHTML = allCompletedAccordion.length;
        document.getElementById('total-steps').innerHTML = allAccordion.length;

        let percentCompletion = (allCompletedAccordion.length / allAccordion.length) * 100;

        let progressBar = document.querySelector('.store-config>.overview .progress-tracker .progress-indicator');

        // Update progress bar
        progressBar.style.setProperty('width', percentCompletion + '%', 'important');
    }

    // Allow for smooth transitions
    setups.forEach(setup =>{

      setup.querySelector('.step-content').addEventListener('transitionstart',event => {
        event.stopPropagation();
        if(event.target.classList.contains('step-content')){
          //updateConfigContainer();
          if(!setupGuide.classList.contains('wait')){
            setupGuide.querySelector('.config-container').style.maxHeight = "max-content";
          }
        }
      })

      setup.querySelector('.step-content').addEventListener('transitionend',event => {
        event.stopPropagation();
        if(event.target.classList.contains('step-content')){
          setTimeout(()=>{
            updateConfigContainer();
          },50)
        }
      })
    })


    // Do necessary updates on page load
    updateAllAccordion();
    updateSetupSummary();
    updateConfigContainer();





    // Do necessary updates on page resize
    window.addEventListener('resize', function() {
      updateAllAccordion();
      updateSetupSummary();
      updateConfigContainer();
    });



  });




