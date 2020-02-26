//get elements once, no redundant DOM access
const navbar = document.getElementById('navbar');
const navItems = navbar.children;
const footerArrow = document.getElementById('footer-arrow');
const tolerance = 100;
var pages = getPages();
var pageScrollHeight = getPageScrollHeight();   //starting height of each page(sections) first not included
var footerChangeHeight = 100;

var enabledPageFooter = 1; //page nr of the enabled header
var enabledPageHeader = 1; //page nr of the enabled header

const projects =  document.getElementsByClassName("p4-project"); //page 4 projects
const indicators = document.getElementById('project-indicator').children;


//retreive sections from document
function getPages() {
  let pages = [...document.getElementsByTagName("section")];
  let removePage = -1; //for removing not displayed sections
  for (var i = 1; i < pages.length; i++) {
    if(pages[i].offsetHeight == 0) {
      removePage = i;
    }
  }
  if (removePage != -1) {
    pages.splice(removePage , 1);
  }
  console.log('amount of sections: ', pages.length);
  return pages;
}

//compute and returns a list of heights where each page starts
function getPageScrollHeight() {
  let pageScrollHeight = [];

  pageScrollHeight.push(0)
  for (var i = 1; i < pages.length; i++) {
    console.log('i=', i, ' page offset ',pages[i].offsetHeight);
    pageScrollHeight.push(pageScrollHeight[i-1]+pages[i-1].offsetHeight-tolerance); //40px tolerance to change more rapid
  }
  console.log('page scroll height',  pageScrollHeight);
  return pageScrollHeight;
}

//on window resized, compute scroll points
window.addEventListener('resize', () => {
  if (pageScrollHeight[1] != pages[1].offsetHeight) {  //if section size actually changed
    pages = getPages();
    pageScrollHeight = getPageScrollHeight();
  }
});

//event listener for changing navbar class, navbar is triggered on top of page
window.addEventListener('scroll', () => {
  if (this.scrollY < pageScrollHeight[1]) {
    toggleNavActive(1);

  } else if (this.scrollY >= pageScrollHeight[1] && this.scrollY < pageScrollHeight[2]) {
    toggleNavActive(2);

  } else if (this.scrollY >= pageScrollHeight[2] && this.scrollY < pageScrollHeight[3]) {
    toggleNavActive(3);

  } else if (this.scrollY >= pageScrollHeight[3] && this.scrollY < pageScrollHeight[4]) {
    toggleNavActive(4);

  } else if (this.scrollY >= pageScrollHeight[4] && this.scrollY < pageScrollHeight[5]) {
    toggleNavActive(5);

  } else if (this.scrollY >= pageScrollHeight[5]) {
    toggleNavActive(6);
  }

  //toggle fisrt page header and other page header
  if (this.scrollY < pageScrollHeight[1] && navbar.classList.contains('nav-page-other')) {
    navbar.classList.remove('nav-page-other');
    navbar.classList.add('nav-page-1');
    navItems[0].classList.add('nav-item-active-1');

  } else if (this.scrollY >= pageScrollHeight[1] && navbar.classList.contains('nav-page-1')) {
    navbar.classList.remove('nav-page-1');
    navbar.classList.add('nav-page-other');
    navItems[0].classList.remove('nav-item-active-1');
  }
});


function toggleNavActive(pageNr) {
  //checks if page even changed, prevents unnecessary computation,
  //leaving more cpu time for other tasks
  if (pageNr != enabledPageHeader) {
    //page changed
    enabledPageHeader = pageNr;
    resetActiveClass();

    if (pageNr != 1) {  // first page has separat active tag
        navItems[pageNr-1].classList.add('nav-item-active');
    }
  }
}

function resetActiveClass() {
  for (var i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove('nav-item-active')
  }
}

//event listener for changing footer, footer is triggered on bottom of page
// enabledPageFooter prevents changing classes when user is scrolling without changing page
window.addEventListener('scroll', () => {
  if (this.scrollY < footerChangeHeight && enabledPageFooter != 1) {
    toggleFooter(true);
    enabledPageFooter = 1;

  } else if (this.scrollY > footerChangeHeight && enabledPageFooter == 1) {
    toggleFooter(false);
    enabledPageFooter = 2;
  }
});

function toggleFooter(enableFirstPageFooter) {
  if (enableFirstPageFooter) {
    if (footerArrow.classList.contains('hide')) {
      footerArrow.classList.remove('hide');
    }
  } else {
    if (!footerArrow.classList.contains('hide')) {
      footerArrow.classList.add('hide');
    }
  }
}

function cycleProject(forwards) {
  active = findActiveProject();
  direction = forwards ? 1:-1;
  newActive = (active+direction+projects.length) % projects.length;
  //disable old
  projects[active].classList.add('hide');
  indicators[active].classList.remove('active-indicator');

  //enable new
  projects[newActive].classList.remove('hide');
  indicators[newActive].classList.add('active-indicator');

  document.getElementById('page-4').scrollIntoView();
}

function findActiveProject() {
  for (var i = 0; i < projects.length; i++) {
    if(!projects[i].classList.contains('hide'))
    return i;
  }
}
