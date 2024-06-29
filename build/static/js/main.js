//-----vars---------------------------------------
const header = document.querySelector(".h2o-header");
const overlay = document.querySelector("[data-overlay]");
const mobileMenu = document.querySelector(".h2o-mobile-menu");
const burgers = document.querySelectorAll(".h2o-burger");
const accParrent = [...document.querySelectorAll("[data-accordion-init]")];
const htmlEl = document.documentElement;
const bodyEl = document.body;
const slotsSliders = document.querySelectorAll('.h2o-slots-slider');
const infoSliders = document.querySelectorAll('.h2o-info-slider');
const paySliders = document.querySelectorAll('.h2o-pay-slider');
//------------------------------------------------

//----customFunction------------------------------
const toggleCustomClass = (item, customClass = "active") => {
  item.classList.toggle(customClass);
};

const toggleClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.toggle(customClass);
  });
};

const removeClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.remove(customClass);
  });
};

const addCustomClass = (item, customClass = "active") => {
  item.classList.add(customClass);
};

const addClassInArray = (arr, customClass) => {
  arr.forEach((item) => {
    item.classList.add(customClass);
  });
}

const removeCustomClass = (item, customClass = "active") => {
  item.classList.remove(customClass);
};

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;

  htmlEl.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  bodyEl.style.paddingRight = paddingOffset;
  bodyEl.classList.add("dis-scroll");
  bodyEl.dataset.position = pagePosition;
  bodyEl.style.top = `-${pagePosition}px`;
};

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const body = document.body;
  const pagePosition = parseInt(bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  bodyEl.style.paddingRight = "0px";

  bodyEl.style.top = "auto";
  bodyEl.classList.remove("dis-scroll");
  window.scroll({
    top: pagePosition,
    left: 0,
  });
};

const elementHeight = (el, variableName) => {
  if(el) {
    function initListener(){
      const elementHeight = el.offsetHeight;
      document.querySelector(':root').style.setProperty(`--${variableName}`, `${elementHeight}px`);
    }
    window.addEventListener('DOMContentLoaded', initListener)
    window.addEventListener('resize', initListener)
  }
}
//------------------------------------------------

//----accordion----------------------------------
window.addEventListener("DOMContentLoaded", () => {
  accParrent &&
    accParrent.map(function (accordionParrent) {
      if (accordionParrent) {
        let multipleSetting = false;
        let breakpoinSetting = false;
        let defaultOpenSetting;

        if (
          accordionParrent.dataset.single &&
          accordionParrent.dataset.breakpoint
        ) {
          multipleSetting = accordionParrent.dataset.single; // true - включает сингл аккордион
          breakpoinSetting = accordionParrent.dataset.breakpoint; // брейкпоинт сингл режима (если он true)
        }

        const getAccordions = function (dataName = "[data-id]") {
          return accordionParrent.querySelectorAll(dataName);
        };

        const accordions = getAccordions();
        let openedAccordion = null;

        const closeAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = 0;
          removeCustomClass(accordion, className);
        };

        const openAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = accordion.scrollHeight + "px";
          addCustomClass(accordion, className);
        };

        const toggleAccordionButton = function (button, className = "active") {
          toggleCustomClass(button, className);
        };

        const checkIsAccordionOpen = function (accordion) {
          return accordion.classList.contains("active");
        };

        const accordionClickHandler = function (e) {
          e.preventDefault();
          let curentDataNumber = this.dataset.id;

          toggleAccordionButton(this);
          const accordionContent = accordionParrent.querySelector(
            `[data-content="${curentDataNumber}"]`
          );
          const isAccordionOpen = checkIsAccordionOpen(accordionContent);

          if (isAccordionOpen) {
            closeAccordion(accordionContent);
            openedAccordion = null;
          } else {
            if (openedAccordion != null) {
              const mobileSettings = () => {
                let containerWidth = document.documentElement.clientWidth;
                if (
                  containerWidth <= breakpoinSetting &&
                  multipleSetting === "true"
                ) {
                  closeAccordion(openedAccordion);
                  toggleAccordionButton(
                    accordionParrent.querySelector(
                      `[data-id="${openedAccordion.dataset.content}"]`
                    )
                  );
                }
              };

              window.addEventListener("resize", () => {
                mobileSettings();
              });
              mobileSettings();
            }

            openAccordion(accordionContent);
            openedAccordion = accordionContent;
          }
        };

        const activateAccordion = function (accordions, handler) {
          for (const accordion of accordions) {
            accordion.addEventListener("click", handler);
          }
        };
        const accordionDefaultOpen = (currentId) => {
          const defaultOpenContent = accordionParrent.querySelector(
            `[data-content="${currentId}"]`
          );
          const defaultOpenButton = accordionParrent.querySelector(
            `[data-id="${currentId}"]`
          );
          openedAccordion = defaultOpenContent;

          toggleAccordionButton(defaultOpenButton);
          openAccordion(defaultOpenContent);
        };

        if (accordionParrent.dataset.default) {
          defaultOpenSetting = accordionParrent.dataset.default; // получает id аккордиона который будет открыт по умолчанию
          accordionDefaultOpen(defaultOpenSetting);
        }

        activateAccordion(accordions, accordionClickHandler);
      }
    });
});

//----burger------------------------------------
const mobileMenuHandler = function (overlay, mobileMenu, burgers) {
  burgers.forEach((burger) => {
    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCustomClass(header, "active");
      toggleCustomClass(mobileMenu);
      toggleClassInArray(burgers);
      toggleCustomClass(overlay);
      burger.classList.contains("active") ? disableScroll() : enableScroll();
    });
  });
};

const hideMenuHandler = function (overlay, mobileMenu, burgers) {
  removeCustomClass(mobileMenu);
  removeClassInArray(burgers);
  removeCustomClass(header, "active");
  removeCustomClass(overlay);
  enableScroll();
};

if (overlay) {
  mobileMenuHandler(overlay, mobileMenu, burgers);
  overlay.addEventListener("click", function (e) {
    e.target.classList.contains("h2o-overlay")
      ? hideMenuHandler(overlay, mobileMenu, burgers)
      : null;
  });
}

//----stickyHeader------------------------------
let lastScroll = 0;
const defaultOffset = 40;

function stickyHeaderFunction(breakpoint){
  let containerWidth = document.documentElement.clientWidth;
  if (containerWidth > `${breakpoint}`) {
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('sticky');

    window.addEventListener('scroll', () => {
        if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
            addCustomClass(header, "sticky")
        }
        else if(scrollPosition() < defaultOffset){
            removeCustomClass(header, "sticky")
        }

        lastScroll = scrollPosition();
    })
  }
}

stickyHeaderFunction(320);
elementHeight(header, "header-height");
//------replaceEl-------------------------------

  const sidebar = document.querySelector('.h2o-sidebar'),
        sideBarParent = document.querySelector('.h2o-main-inner'),
        sideBarParentMob = document.querySelector('.h2o-first-section');
 
 const replaceElementsFunction = (
   element,
   parentDesktop,
   parentMobile,
   breakpoint,
   firstRule,
   lastRule
 ) => {
   let containerWidth = document.documentElement.clientWidth;
 
   if (element) {
     if (containerWidth <= `${breakpoint}`) {
       parentMobile.insertAdjacentElement(`${firstRule}`, element);
     }
     if (containerWidth > `${breakpoint}`) {
       parentDesktop.insertAdjacentElement(`${lastRule}`, element);
     }
   }
 };
 
 window.addEventListener("resize", () => {
     replaceElementsFunction(
      sidebar,
      sideBarParent,
      sideBarParentMob,
       1024,
       "afterend",
       "beforeend"
     )
 });
 window.addEventListener("DOMContentLoaded", () => {
     replaceElementsFunction(
      sidebar,
      sideBarParent,
      sideBarParentMob,
       1024,
     "afterend",
     "beforeend"
     )
 });
//---------------------------------------------------
slotsSliders && slotsSliders.forEach(function(slotsSlider){
  new Splide( slotsSlider, {
    type       : 'loop',
    speed      : 1800,
    pagination : true,
    arrows     : true,
    perPage    : 3,
    gap        : 20,
    autoplay   : true,
    interval   : 2500,
    breakpoints: {
      1024: {
        perPage: 2,
      },
      576: {
        perPage: 1,
      },
    },
  } ).mount(); 
});

infoSliders && infoSliders.forEach(function(infoSlider){
  const slider = infoSlider.querySelector('.splide');

  var splide = new Splide( slider, {
    type       : 'loop',
    speed      : 1000,
    pagination : false,
    arrows     : false, 
    perPage    : 2,
    gap        : 20,
    interval   : 2500,
    breakpoints: {
      1024: {
        perPage: 2,
      },
      768: {
        perPage: 1,
      },
    },
  } ).mount(); 

  var totalSlides = splide.Components.Elements.slides.length;
  document.getElementById('totalSlides').textContent = totalSlides;

  splide.on('move', function (newIndex) {
    document.getElementById('currentSlide').textContent = newIndex + 1;
  });

  document.getElementById('prevSlide').addEventListener('click', function () {
    splide.go('-1');
  });

  document.getElementById('nextSlide').addEventListener('click', function () {
    splide.go('+1');
  });



});

paySliders && paySliders.forEach(function(paySlider){
  new Splide( paySlider, {
    type       : 'loop',
    speed      : 1800,
    pagination : false,
    arrows     : true,
    perPage    : 3,
    gap        : 10,
    autoplay   : true,
    interval   : 5000,
  } ).mount(); 
});
//-----------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.h2o-rating-card');
  const reviewCards = document.querySelectorAll('.h2o-rewiev-card');
  const bestCards = document.querySelectorAll('.h2o-best-card');

  cards && cards.forEach(function(card) {
    const toggleButton = card.querySelector('.h2o-rating-card__toggle');
    const details = card.querySelector('.h2o-rating-card__details');
    const content = card.querySelector('.h2o-rating-card__content');
  
    toggleButton && toggleButton.addEventListener('click', function() {
      if (details.style.height && details.style.height !== '0px') {
        details.style.height = '0';
        removeCustomClass(toggleButton, 'rotate');
        removeCustomClass(content, 'active');
      } else {
        details.style.height = details.scrollHeight + 'px';
        addCustomClass(toggleButton, 'rotate');
        addCustomClass(content, 'active');
      }
    });
  });

  reviewCards && reviewCards.forEach(function(card){
    const front = card.querySelector('.h2o-rewiev-card__front');
    const back = card.querySelector('.h2o-rewiev-card__back')
    const btns = card.querySelectorAll('.h2o-rewiev-card__info');

    btns.forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        toggleCustomClass(front, 'active');
        toggleCustomClass(back, 'active');
      })
    })
  })

  bestCards && bestCards.forEach(card => {
    const toggleBlock = card.querySelector('.h2o-best-card__hide');
    const toggleButton = card.querySelector('.h2o-best-card__show-btn');

    toggleButton.addEventListener('click', function() {
        if (toggleBlock.classList.contains('open')) {
            toggleBlock.style.height = toggleBlock.scrollHeight + 'px';
            toggleBlock.offsetHeight; 
            toggleBlock.style.height = '0';
            setTimeout(() => {
                removeCustomClass(toggleBlock, 'open');
            }, 500);
            removeCustomClass(toggleButton, 'open');
        } else {
            toggleBlock.style.height = toggleBlock.scrollHeight + 'px';
            addCustomClass(toggleBlock, 'open');
            setTimeout(() => {
                toggleBlock.style.height = 'auto';
            }, 500);
            addCustomClass(toggleButton, 'open');
        }
    });
});
});

//-----------------------------------------------------
const navLinks = document.querySelectorAll('.h2o-nav a');

if (navLinks.length > 0) {
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}
