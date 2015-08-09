var app = (function (exports) {
    
    var
        SELECTORS = {
            projectsContainer: '.projects',
            project: '.project',
            projectImage: '.project__image',
            projectLoaderSVG: '.project__image-svg-loader circle',
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
        projectElems = projectsContainerElem.querySelectorAll(SELECTORS.project),
        projectButtonContainers = projectsContainerElem.querySelectorAll(SELECTORS.projectButtonContainer),
        
        
        previousProjectClass = '',
        currentProjectClass = '',         
        
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
        
        DURATIONS = {
            projectLoader: 5
        },
                
        projectTLOpts,
        
        masterTLOpts = {
            repeat: -1,
            repeatDelay: 2,
            paused: true
        };
    
    
    
    function createProjectTLs () {
        
        var tl;
        for (var i = 0, l = projectElems.length; i < l; i++) {                                                
            tl = createProjectTL(projectElems[i]);
            masterTL.add(tl);
        }
    }
    
    
    /**
     * For each project, build its timeline using the
     * elements it contains
     * @returns the unique project TL
     */
    function createProjectTL(projectElem) {
        
        var            
            projectImageElem = projectElem.querySelector(SELECTORS.projectImage),
            projectLoaderSVG = projectElem.querySelector(SELECTORS.projectLoaderSVG),
            projectTitleElem = projectElem.querySelector(SELECTORS.projectTitle),    
            projectSubtitleElem = projectElem.querySelector(SELECTORS.projectSubtitle),
            projectButtonContainer = projectElem.querySelector(SELECTORS.projectButtonContainer),
            projectButtonElem = projectButtonContainer.querySelector(SELECTORS.projectButton),
            
            projectButtonAreas =
                projectButtonContainer.querySelectorAll(SELECTORS.projectButtonAreas),
            
            projectButtonText = 
                projectButtonContainer.querySelector(SELECTORS.projectButtonText),

            backgroundImageFloaterContainer =
                projectElem.querySelector(SELECTORS.backgroundImgFloaterContainer),

            backgroundImageFloaters = 
                backgroundImageFloaterContainer.querySelectorAll(SELECTORS.backgroundImgFloaters),


            // GET the CSS rule EXACTLY AS IT's EXPRESSED in our stylesheet
            projectImageBefore = CSSRulePlugin.getRule('.project .project__image:before'),
            projectImageAfter = CSSRulePlugin.getRule('.project .project__image:after'),
                    
            
            projectTL,
            projectLoaderTL,
            projectCTATL;  // project Call-To-Action TL
                

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
                    x: '-=10',
                    scale: 0
                },
                {
                    autoAlpha: 1,
                    x: 0,
                    scale: 1,
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

        /**
         * Glides project image to center and, on completion, pauses the TL temporarily
         * so that the user can interact with the button         
         */
        function glideProjectImage () {
            var tween = TweenMax.to(
                projectImageElem,
                5,
                {
                    xPercent: '0',
                    ease: EASINGS.glidingProjectElements,
                    onComplete: pauseMasterTLWithinProjectTL,
                    onCompleteParams: [currentProjectClass, projectLoaderTL]
                }
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
        
        function fadeOutProjectImageAreas () {
            var tween = TweenMax.to(
                [projectImageBefore, projectImageAfter],
                0.4,
                {cssRule: {opacity: 0}}
            );
            return tween;
        }
        
        function fadeInProjectImageAreas () {
            var tween = TweenMax.to(
                [projectImageBefore, projectImageAfter],
                0.4,
                {cssRule: {opacity: 1}}
            );
            return tween;
        }
        
        function fillLoader () {

            var loaderCircumference = 
                Number(projectLoaderSVG.getAttribute('r')) * 2 * Math.PI;
            
            var tween = TweenMax.fromTo(
                projectLoaderSVG,
                DURATIONS.projectLoader,
                { strokeDasharray: loaderCircumference, strokeDashoffset: loaderCircumference },
                { strokeDasharray: loaderCircumference, strokeDashoffset: 0, ease: Power0.easeNone }
                //{ drawSVG: '0% 100%' },
                //{ drawSVG: '100%' }
            );
            return tween;
        }
        
        function fadeOutLoader () {
            var tween = TweenMax.to(
                projectLoaderSVG,
                0.4,
                { autoAlpha: 0, onComplete: resumeMasterTL }
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
            projectTL.set(projectElem, {autoAlpha: 1});
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
            projectCTATL.set(projectButtonContainer, {autoAlpha: 1});
            projectCTATL.add(removeProjectSubtitle());
            projectCTATL.add(slideDownButtonAreas());
            projectCTATL.add(bringInButtonText(), '-=0.2');
            projectTL.add(projectCTATL, '+=2');
        }


        function slowlyGlideProjectElementsToCenterStop () {
            projectTL.add(glideProjectTitle(), (TL_LABELS.projectTitleIn + '-=0.1') );
            projectTL.add(glideProjectSubtitle(), (TL_LABELS.projectTitleIn + '-=0.2'));
            projectTL.addLabel(TL_LABELS.projectTitleGlideOut);
            projectTL.add(glideProjectImage(), TL_LABELS.projectImageIn);
            projectTL.addLabel(TL_LABELS.projectImageGlideOut);
            projectTL.add(glideBackgroundFloaters(), TL_LABELS.backgroundImgFloatersIn);
        }
        
        function animateLoader () {
            projectLoaderTL.add(fadeOutProjectImageAreas());
            projectLoaderTL.add(fillLoader());
            projectLoaderTL.add(fadeOutLoader());
            projectLoaderTL.add(fadeInProjectImageAreas(), '-=0.4');
        }


        function slideOutProjectElements () {
            projectTL.add(slideOutContentBelowImage(), TL_LABELS.projectImageGlideOut);
            projectTL.add(slideOutProjectImage(), TL_LABELS.projectImageGlideOut);
        }
        
        
        
        function animateProject () { 

            // Dynamically set the current project class on the body to
            // have our project-specific style rules applied
            currentProjectClass = projectElem.classList.item(1);
            
            projectTLOpts = {
                paused: true,
                onStart: setBodyClass,
                onStartParams: [currentProjectClass]
            };
            
            projectTL = new TimelineMax(projectTLOpts);                
            projectCTATL = new TimelineMax();
            projectLoaderTL = new TimelineMax({paused: true});
            
            
            slideInProjectElements();            
            callToAction();
            slowlyGlideProjectElementsToCenterStop();
            
            if (projectLoaderSVG) {
                animateLoader();    
            }
            
            slideOutProjectElements(); 
            
            projectTL.play();
        }
        
        animateProject();
        return projectTL;
    }
    
    
    function wireUpEventListeners () {
//        [].forEach.call(projectButtonElems, function (btnElem) {
//            btnElem.addEventListener('click', resumeMasterTL, false);
//        });
        projectButtonContainers[0].addEventListener('click', handleIntroButtonClick, false);
    }
    
    
    function init () {        
        masterTL = new TimelineMax(masterTLOpts);
        
        wireUpEventListeners();
        alphabetizeContent();
        createProjectTLs();
        masterTL.play();
    }
    
//////////////////////////////////////////////////////
//// Master TL Methods
//////////////////////////////////////////////////////    
    
    /**
     * We're now ready to display our content -- which 
     * our CSS is hidding on init -- so let's give it some alpha!
     */
    function alphabetizeContent () {
        masterTL.set(projectsContainerElem, {autoAlpha: 1});
    }
    
    
    /**
     * pauses the Master TL within an individual project TL and,
     * if the project has a loader, begins playing its timeline
     */
    function pauseMasterTLWithinProjectTL (currentProjectClass, projectLoaderTL) {
        masterTL.pause();
        
        if (currentProjectClass !== 'project-0') {
            projectLoaderTL.seek(0);
            projectLoaderTL.play();
        }
    }
    
    function resumeMasterTL () {
        masterTL.resume();
    }
    
    
    function setBodyClass (cl) {
        if (cl) {
            // If we need to preserve other defaults, track those and include them here
            document.body.className = cl;    
        }                        
    }
    
    /**
     * When the intro button is clicked, resume the rest of the timeline
     */
    function handleIntroButtonClick (ev) {
        
        // prevent the link from opening -- just run the timeline function
        if (ev) {
            ev.preventDefault();
            
        } else {
            ev.returnValue = false;
        }
        resumeMasterTL();
    }
        
        
    

    
    return {
        init: init
    };
    
}(window));


window.addEventListener('DOMContentLoaded', app.init, false);