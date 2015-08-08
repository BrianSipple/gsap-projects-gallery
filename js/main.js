var app = (function (exports) {
    
    var
        SELECTORS = {
            projectsContainer: '.projects',
            project: '.project',
            projectImage: '.project__image',
            projectButtonContainer: '.btn-container', 
            projectButton: '.project__btn',
            projectButtonAreas: '.btn__area',
            projectButtonText: '.btn__text',
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
        projectButtonElem = projectButtonContainer.querySelector(SELECTORS.projectButton),
        projectButtonAreas = projectButtonContainer.querySelectorAll(SELECTORS.projectButtonAreas),
        projectButtonText = projectButtonContainer.querySelector(SELECTORS.projectButtonText),
        
        
        backgroundImageFloaterContainer =
            projectElem.querySelector(SELECTORS.backgroundImgFloaterContainer),
        
        backgroundImageFloaters = 
            backgroundImageFloaterContainer.querySelectorAll(SELECTORS.backgroundImgFloaters),
                
        
        projectImageBefore = curry(getPseudoBeforeVal)(projectImageElem),
        projectImageAfter = curry(getPseudoAfterVal)(projectImageElem),
        
        currentProjectClass,    
        
        masterTL,
        projectTL,
        projectsCTATL,   // projects Call-To-Action TL
        
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
        
        DURATIONS = {
            
        },
        
        projectTLOpts = {
            repeat: -1,
            repeatDelay: 2,
            paused: false
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
            5,
            {xPercent: '0', ease: EASINGS.glidingProjectElements}
        );
        return tween;
    }
    
    function glideBackgroundFloaters () {
        var tween = TweenMax.to(
            backgroundImageFloaterContainer,
            4.1,
            { x: '-5', ease: EASINGS.glidingProjectElements }
        );
        return tween;
    }
    
    function slideOutContentBelowImage () {
        var tween = TweenMax.to(
            [projectTitleElem, projectSubtitleElem, projectButtonContainer],
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
    
    
    function removeProjectSubtitle () {
        var tween = TweenMax.to(
            projectSubtitleElem,
            0.3,
            {autoAlpha: 0, yPercent: 100, ease: Back.easeOut}
        );
        return tween;
    }
    
    
    function slideDownButtonAreas () {
        var tween = TweenMax.staggerFrom(
            projectButtonAreas,
            0.3,
            {autoAlpha: 0, yPercent: -100, ease: Back.easeOut},
            0.1
        );
        return tween;
    }
    
    function bringInButtonText () {
        var tween = TweenMax.from(
            projectButtonText,
            0.3,
            { autoAlpha: 0, x: '-100%', ease: EASINGS.viewSliding }
        );
        return tween;
    }
        
    
    
    function slideInProjectElements () {        
        projectTL.add(blurNonImageElems());
        projectTL.add(slideInProjectImage());
        projectTL.addLabel(TL_LABELS.projectImageIn);
        projectTL.add(bubbleInImageFloaters(), '-=0.2');
        projectTL.addLabel(TL_LABELS.backgroundImgFloatersIn);
        projectTL.add(slideInProjectTitle(), '-=0.4');
        projectTL.add(slideInProjectSubtitle(), '-=0.5');
        projectTL.addLabel(TL_LABELS.projectTitleIn);  
    }
    

    /**
     * add Call-To-Action TL to the projects TL
     *
     */
    function callToAction () {
        projectsCTATL.set(projectButtonContainer, {autoAlpha: 1});
        projectsCTATL.add(removeProjectSubtitle());
        projectsCTATL.add(slideDownButtonAreas());
        projectsCTATL.add(bringInButtonText(), '-=0.2');
        projectTL.add(projectsCTATL, '+=2');
    }
    
        
    function slowlyGlideProjectElementsAround () {
        projectTL.add(glideProjectTitle(), (TL_LABELS.projectTitleIn + '-=0.1') );
        projectTL.add(glideProjectSubtitle(), (TL_LABELS.projectTitleIn + '-=0.2'));
        projectTL.addLabel(TL_LABELS.projectTitleGlideOut);
        projectTL.add(glideProjectImage(), TL_LABELS.projectImageIn);
        projectTL.addLabel(TL_LABELS.projectImageGlideOut);
        projectTL.add(glideBackgroundFloaters(), TL_LABELS.backgroundImgFloatersIn);
    }
    
        
    function slideOutProjectElements () {
        projectTL.add(slideOutContentBelowImage(), TL_LABELS.projectTitleGlideOut);
        projectTL.add(slideOutProjectImage(), TL_LABELS.projectTitleGlideOut);
    }
    
    
        
    
    
    function animateProject () {            
        slideInProjectElements();
        callToAction();
        slowlyGlideProjectElementsAround();
        slideOutProjectElements();
    }
        
    
    /**
     * We're now ready to display our content -- which 
     * our CSS is hidding on init -- so let's give it some alpha!
     */
    function alphabetizeContent () {
        masterTL.set(projectsContainerElem, {autoAlpha: 1});
    }
    
    function init () {
        
        masterTL = new TimelineMax();
        projectTL = new TimelineMax(projectTLOpts);
        projectsCTATL = new TimelineMax();
        
        currentProjectClass = projectElem.classList.item(1);
        
        alphabetizeContent();
        animateProject();
    }
    
    
    return {
        init: init
    };
    
}(window));


window.addEventListener('DOMContentLoaded', app.init, false);