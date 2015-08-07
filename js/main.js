var app = (function (exports) {
    
    var
        SELECTORS = {
            projectsContainer: '.projects',
            project: '.project',
            projectImage: '.project__image',
            projectButtonContainer: '.btn-container', 
            projectTitle: '.project__title',
            projectSubtitle: '.project__subtitle',
            backgroundImgFloaterContainer: '.background-floaters',
            backgroundImgFloaters: '.background-floater'
        },                
    
        projectsContainerElem = document.querySelector(SELECTORS.projectsContainer),
        projectElem = projectsContainerElem.querySelector(SELECTORS.project),
        projectImageElem = projectElem.querySelector(SELECTORS.projectImage),
        projectTitleElem = projectElem.querySelector(SELECTORS.projectTitle),
        projectSubtitleElem = projectElem.querySelector(SELECTORS.projectSubtitle),
        projectButtonContainer = projectElem.querySelector(SELECTORS.projectButtonContainer),
        
        backgroundImageFloaterContainer =
            projectElem.querySelector(SELECTORS.backgroundImgFloaterContainer),
        
        backgroundImageFloaters = 
            backgroundImageFloaterContainer.querySelectorAll(SELECTORS.backgroundImgFloaters),
                
        
        projectImageBefore = curry(getPseudoBeforeVal)(projectImageElem),
        projectImageAfter = curry(getPseudoAfterVal)(projectImageElem),
        
        currentProjectClass,    
        
        masterTL,
        projectTL,
        
        TL_LABELS = {
            projectImageIn: 'imageIn',
            backgroundImgFloatersIn: 'floatersIn',
            projectTitleIn: 'titleIn',
            projectTitleGlideOut: 'titleGlideOut',
            projectImageGlideOut: 'imageGlideOut'
        },
        
        EASINGS = {
            viewSliding: Power4.easeInOut,
            glidingProjectElements: Linear.easeNone
        },
        
        projectTLOpts = {
            repeat: -1,
            repeatDelay: 2
        };
        
        
    
    function blurNonImageElems () {
        var tween = TweenMax.set(
            [
                projectTitleElem,
                projectSubtitleElem,
                projectButtonContainer,
                backgroundImageFloaters
            ],
            { autoAlpha: 0 }
        );
        return tween;
    }
    
    
    
    function slideInProjectImage () {
        var tween = TweenMax.fromTo(
            projectImageElem,
            0.4,
            {
                autoAlpha: 0, 
                xPercent: '-200'
            },
            {
                autoAlpha: 1,
                xPercent: '-10',  // don't move all the way to zero, b/c we'll add some slow-motion as well
                ease: EASINGS.viewSliding
            }
        );
        
        return tween;                                            
    }
    
    
    function bubbleInImageFloaters () {
        var tween = TweenMax.staggerFromTo(
            backgroundImageFloaters,
            0.3,
            {
                autoAlpha: 0,
                x: '-=10'
                //scale: 0
            },
            {
                autoAlpha: 1,
                x: 0,
                //scale: 1
                ease: EASINGS.viewSliding
            },
            0.02
        );
        return tween;        
    }
    
    
    function slideInProjectTitle () {
        var tween = TweenMax.fromTo(
            projectTitleElem,
            0.7,
            {autoAlpha: 0, xPercent: '-50'},
            {autoAlpha: 1, xPercent: '-5', ease: EASINGS.viewSliding}
        );
        return tween;        
    }
    
    function slideInProjectSubtitle () {
        var tween = TweenMax.fromTo(
            projectSubtitleElem,
            0.7,
            {autoAlpha: 0, xPercent: '-50'},
            {autoAlpha: 1, xPercent: '-2', ease: EASINGS.viewSliding}
        );
        return tween;
    }
    
    
    function glideProjectTitle () {
        var tween = TweenMax.to(
            projectTitleElem,
            2,
            {xPercent: '+=5', ease: EASINGS.glidingProjectElements}
        );
        return tween;
    }
    
    
    function glideProjectSubtitle () {
        var tween = TweenMax.to(
            projectSubtitleElem,
            2,
            {xPercent: '+=2', ease: EASINGS.glidingProjectElements}
        );
        return tween;
    }
    
    function glideProjectImage () {
        var tween = TweenMax.to(
            projectImageElem,
            3,
            {xPercent: '0', ease: EASINGS.glidingProjectElements}
        );
        return tween;
    }
    
    function glideBackgroundFloaters () {
        var tween = TweenMax.to(
            backgroundImageFloaterContainer,
            2,
            { x: '-5', ease: EASINGS.glidingProjectElements }
        );
        return tween;
    }
    
    function slideOutTitleAndSubTitle () {
        var tween = TweenMax.to(
            [projectTitleElem, projectSubtitleElem],
            0.5,
            {autoAlpha: 0, xPercent: '+=10', ease: EASINGS.viewSliding}
        );
        return tween;
    }
    
    function slideOutProjectImage () {
        var tween = TweenMax.to(
            projectImageElem,
            0.4,
            {autoAlpha: 0, xPercent: '+=80', ease: EASINGS.viewSliding}
        );
        return tween;
    }
    
    
    
    
    
    
    function slideInProjectElements () {        
        projectTL.add(blurNonImageElems());
        projectTL.add(slideInProjectImage());
        projectTL.add(TL_LABELS.projectImageIn);
        projectTL.add(bubbleInImageFloaters());
        projectTL.add(TL_LABELS.backgroundImgFloatersIn);
        projectTL.add(slideInProjectTitle());
        projectTL.add(slideInProjectSubtitle());
        projectTL.add(TL_LABELS.projectTitleIn);        
    }
    
    
    function slowlyGlideProjectElementsAround () {
        projectTL.add(glideProjectTitle());
        projectTL.add(glideProjectSubtitle());
        projectTL.add(TL_LABELS.projectTitleGlideOut);
        projectTL.add(glideProjectImage());
        projectTL.add(TL_LABELS.projectImageGlideOut);
        projectTL.add(glideBackgroundFloaters());
    }
    
    
    
    function slideOutProjectElements () {
        projectTL.add(slideOutTitleAndSubTitle());
        projectTL.add(slideOutProjectImage());
    }
    
    
    
    function animateProject () {            
        slideInProjectElements();
        slowlyGlideProjectElementsAround();
        slideOutProjectElements();
    }
    
    
    
    function init () {
        projectTL = new TimelineMax(projectTLOpts);
        currentProjectClass = projectElem.classList.item(1);
        
        animateProject();
    }
    
    
    return {
        init: init
    };
    
}(window));


window.addEventListener('DOMContentLoaded', app.init, false);