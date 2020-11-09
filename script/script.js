function parseData() {
    if (window.dataForCV) {
        window.dataForCV.name = window.dataForCV.firstName + ' ' + window.dataForCV.lastName;
        
        if (window.dataForCV.address) {
            window.dataForCV.fullAddress =
                window.dataForCV.address.street + ' ' +
                window.dataForCV.address.city + ' ' +
                window.dataForCV.address.country;
        }

        if (window.dataForCV.social) {
            for (let network in window.dataForCV.social) {
                const networkUrl = network + 'URL'; // facebookURL
                const networkIcon = networkUrl + 'Icon'; // facebookIcon
                const networkName = window.dataForCV.social[network].name;

                window.dataForLabels[networkUrl] = networkName;
                window.dataForCV[networkUrl] = window.dataForCV.social[network].url;
                window.dataForCV[networkIcon] = window.dataForCV.social[network].icon;
            }
        }
    } 

    return window.dataForCV;
}

function toggle (event) {
    var element = event.currentTarget;
    var toggler = element.getElementsByClassName('toggler');

    if(element.nextElementSibling.classList.contains('slideOutLeft')||element.nextElementSibling.classList.contains('hidden')) {
        if(toggler[0]) {       
        toggler[0].innerHTML = "-";
        }
        element.nextElementSibling.classList.remove('hidden');
        element.nextElementSibling.classList.remove('slideOutLeft');
        element.nextElementSibling.classList.add('slideInLeft');

    }
    else {
        if(toggler[0]) {       
        toggler[0].innerHTML = "+";
        }
        element.nextElementSibling.classList.remove('hidden');
        element.nextElementSibling.classList.remove('slideInLeft');
        element.nextElementSibling.classList.add('slideOutLeft');
    }
}
function getElements(selector) {
    return document.querySelectorAll(selector);
}
function getDynamicLabelElements() {
    var dynamicLabelElementSelector = '[data-label]';
    var dynamicLabelElements = getElements(dynamicLabelElementSelector);
    return dynamicLabelElements;
}
function getDynamicValueElements() {
    var dynamicValueElementSelector = '[data-value]';
    var dynamicValueElements = getElements(dynamicValueElementSelector);

    return dynamicValueElements;
}
function getDynamicSrcElements() {
    var dynamicSrcElementSelector = '[data-src]';
    var dynamicSrcElements = getElements(dynamicSrcElementSelector);

    return dynamicSrcElements;
}
function getDynamicCloneSrcElements() {
    var dynamicCloneSrcElementSelector = '[data-clone-src]';
    var dynamicCloneSrcElements = getElements(dynamicCloneSrcElementSelector);

    return dynamicCloneSrcElements;
}

function getDynamicCloneValueElements () {
    var dynamicCloneSrcElementSelector = '[data-clone-value]';
    var dynamicCloneSrcElements = getElements(dynamicCloneSrcElementSelector);

    return dynamicCloneSrcElements;
}

function getDynamiClassElements() {
    var dynamicClassElementSelector = '[data-class]';
    var dynamicClassElements = getElements(dynamicClassElementSelector);
    return dynamicClassElements;
}
function insertValueIntoElement(element, value) {
    if (element && value) {
        element.innerHTML = value;
    }
}
function checkExistingClass(element, className) {
    if (!element) return;

    return element.classList ?
        element.classList.contains(className) :
        new RegExp('\\b' + className + '\\b').test(element.className);
}
function addClassToElement(element, classes) {
    if (element && classes) {
        var singleClassesArray = classes.split(' ');

        for (var i = 0; i < singleClassesArray.length; i++) {
            var singleClass = singleClassesArray[i];

            if (singleClass) {
                var existingClass = checkExistingClass(element, singleClass);

                if (!existingClass) {
                    if (element.classList) {
                        element.classList.add(singleClass);
                    } else {
                        element.className += ' ' + singleClass;
                    }
                }
            }
        }
    }
}
function changeElementSrc(element, srcValue) {
    if (!element || !srcValue) return;

    element.setAttribute('src', srcValue);

    return element;
}

function insertValuesToElements(elements, attributeName, dataSource) {
    if (elements && elements.length && attributeName) {
        for (var i = 0; i < elements.length; i++) {
            var currentElement = elements[i];
            var attributeValue = currentElement.getAttribute(attributeName);

            if (currentElement && attributeValue) {
                var valueFromData = dataSource[attributeValue];

                if (attributeName === 'data-class') {
                    addClassToElement(currentElement, valueFromData);
                } else if (attributeName === 'data-src') {
                    changeElementSrc(currentElement, valueFromData);                    
                } else {
                    insertValueIntoElement(currentElement, valueFromData);                    
                }
            }
        }
    }
}

function cloneAndInsertValuesToElements(elements, attributeName, dataSource) {
    if (elements && elements.length && attributeName) {
        for (var i = 0; i < elements.length; i++) {
            var currentElement = elements[i];
            var attributeValue = currentElement.getAttribute(attributeName);

            if (currentElement && attributeValue) {
                var splitAttributeValue = attributeValue.split('.');
                var parsedAttributedValue = splitAttributeValue[0];
                var collectionFromData = dataSource[parsedAttributedValue];

                for (let index in collectionFromData) {
                    const currentInnerPropertyValue = collectionFromData[index];

                    if (attributeName === 'data-clone-src') {
                        if (typeof currentInnerPropertyValue === 'string') {
                            const clonedElement = cloneElement(currentElement);

                            changeElementSrc(clonedElement, currentInnerPropertyValue);
                        }
                    }
                    if (attributeName === 'data-clone-value') {
                        if (typeof currentInnerPropertyValue === 'string') {

                        }
                        if (typeof currentInnerPropertyValue === 'object') {
                            var partOfAttributeValueAfterDot = splitAttributeValue[1];

                            if (partOfAttributeValueAfterDot) {
                                const dataValue = currentInnerPropertyValue[partOfAttributeValueAfterDot];
                                const clonedElement = cloneElement(currentElement);

                                insertValueIntoElement(clonedElement, dataValue);
                            } else {
                                cloneElementWithParsedChildern(currentElement, currentInnerPropertyValue);
                            }
                        }
                    }
                }

                currentElement.parentNode.removeChild(currentElement);
            }
        }
    }
}

function cloneElementWithParsedChildern(element, objectValue) {
    const clonedElement = cloneElement(element);
    const dynamicValueChildren = clonedElement.querySelectorAll('[child-value]');
    const dynamicClassChildren = clonedElement.querySelectorAll('[child-class]');

    if (dynamicValueChildren && dynamicValueChildren.length) {
        for (let i = 0; i < dynamicValueChildren.length; i++) {
            const currentChild = dynamicValueChildren[i];
            const attributeValue = currentChild.getAttribute('child-value');

            if (attributeValue && objectValue[attributeValue]) {
                insertValueIntoElement(currentChild, objectValue[attributeValue]);
            }
        }
    }

    if (dynamicClassChildren && dynamicClassChildren.length) {
        for (let i = 0; i < dynamicClassChildren.length; i++) {
            const currentChild = dynamicClassChildren[i];
            const attributeValue = currentChild.getAttribute('child-class');

            if (attributeValue && objectValue[attributeValue]) {
                addClassToElement(currentChild, objectValue[attributeValue]);
            }
        }
    }
}

function cloneElement(element) {
    if (!element) return;

    var cloneElement = element.cloneNode(true);
    var parentElement = element.parentNode;

    parentElement.appendChild(cloneElement);

    return cloneElement;
}

function renderElements(data) {
    function replaceElementValues(elements, attributeName, itemData) {
        for (var iterator = 0; iterator < elements.length; iterator++ ) {
            var currentElement = elements[iterator];
            var currentAttributeValue = currentElement.getAttribute(attributeName);
            var itemDataProperty = currentAttributeValue.split('.');
            itemDataProperty = itemDataProperty[itemDataProperty.length - 1];
            if (itemData && itemData[itemDataProperty]) {
                var valueFromItemData = itemData[itemDataProperty];
                currentElement.innerHTML = valueFromItemData;
                currentElement.removeAttribute(attributeName);
            }
        }
    }
    function replaceElementWidth(elements, attributeName, itemData) {
        for (var iterator = 0; iterator < elements.length; iterator++) {
            var currentElement = elements[iterator];
            var currentAttributeValue = currentElement.getAttribute(attributeName);
            var itemDataPropertyArray = currentAttributeValue.split('.');
            var itemDataProperty = itemDataPropertyArray[itemDataPropertyArray.length - 1];

            if (itemData && itemData[itemDataProperty]) {
                var valueFromItemData = itemData[itemDataProperty];

                currentElement.style.width = valueFromItemData + "%";
                currentElement.removeAttribute(attributeName);
            }
        }
    }
    function replaceAttributeValues(elements, attributeName, attributeValue) {
        for (var iterator = 0; iterator < elements.length; iterator++ ) {
            var currentElement = elements[iterator];

            currentElement.removeAttribute(attributeName);

            if (attributeName === 'data-class') {
                attributeValue += 'Icon';
                this.className = '';
            }

            currentElement.setAttribute(attributeName, attributeValue);
        }
    }
    function incrementalFill(elements, data, timeoutValue) {
        setTimeout(function(){
            replaceElementWidth(elements, 'data-fill', data);
        }, timeoutValue);
    }
    function renderSectionElements(sectionId) {
        var elementSelector = window.elementIds[sectionId];
        var element = document.getElementById(elementSelector);
        var sectionProperties = window.sectionProperties[sectionId];

        if (data && sectionProperties) {
            for (var i = 0; i < sectionProperties.length; i++) {
                var currentInfoProperty = sectionProperties[i];
                var checkProperty = currentInfoProperty.checkProperty;
                var attributeValue = currentInfoProperty.attributeValue;

                if (data[checkProperty]) {
                    var cloneElement = element.cloneNode(true);
                    var parentElement = element.parentNode;
                    var dataLabelChildren = cloneElement.querySelectorAll('[data-label]');
                    var dataValueChildren = cloneElement.querySelectorAll('[data-value]');
                    var dataClassChildren = cloneElement.querySelectorAll('[data-class]');

                    cloneElement.removeAttribute('id');

                    replaceAttributeValues(dataLabelChildren, 'data-label', attributeValue);
                    replaceAttributeValues(dataValueChildren, 'data-value', attributeValue);
                    replaceAttributeValues(dataClassChildren, 'data-class', attributeValue);

                    parentElement.appendChild(cloneElement);
                }
            }

            element.parentNode.removeChild(element);
        }
    }
    function renderSectionCollectionElements(sectionId) {
        var elementSelector = window.elementIds[sectionId];
        var element = document.getElementById(elementSelector);
        var sectionProperties = window.sectionProperties[sectionId];

        if (data && sectionProperties && sectionProperties[0]) {
            var checkProperty = sectionProperties[0].checkProperty;
            var sectionItems = data[checkProperty];

            if (sectionItems) {
                // Loop through Section Items (collection of items from main Data)
                for (var i = 0; i < sectionItems.length; i++) {
                    // currentItem variable holds current data from Section Items collection
                    var currentItem = sectionItems[i];
                    var cloneElement = element.cloneNode(true);
                    var parentElement = element.parentNode;
                    var dataLabelChildren = cloneElement.querySelectorAll('[data-label]');
                    var dataValueChildren = cloneElement.querySelectorAll('[data-value]');
                    var dataFillChildren = cloneElement.querySelectorAll('[data-fill]');
                    cloneElement.removeAttribute('id');

                    //replaceElementValues(dataLabelChildren, 'data-label', attributeValue);
                    replaceElementValues(dataValueChildren, 'data-value', currentItem);

                    parentElement.appendChild(cloneElement);
                    incrementalFill(dataFillChildren, currentItem, 300);
                }
                element.parentNode.removeChild(element);
            }
        }
    }

    // Here we loop through HTML templates
    // Goal is to select them and clone for each part of relevant data.
    for (var propertyName in window.elementIds) {
        switch(propertyName) {
            case 'references':
            case 'work':
            case 'education':
            case 'skills':
                renderSectionCollectionElements(propertyName)
                break;
            default:
                renderSectionElements(propertyName);
                break;
        }
    }
}

window.elementIds = {
    info: 'info-item',
    social: 'social-item',
    references: 'references-item',
    work: 'work-item',
    education: 'education-item',
    skills: 'skills-item'
};

window.sectionProperties = {
    info: [{
        checkProperty: 'firstName',
        attributeValue: 'name'
    }, {
        checkProperty: 'address',
        attributeValue: 'fullAddress'
    }, {
        checkProperty: 'phone',
        attributeValue: 'phone'
    }, {
        checkProperty: 'email',
        attributeValue: 'email'
    }, {
        checkProperty: 'website',
        attributeValue: 'website'
    }],
    social: [{
        checkProperty: 'facebookURL',
        attributeValue: 'facebookURL',

    },{
        checkProperty: 'facebookURLIcon',
        attributeValue: 'facebookURLIcon',

    },{
        checkProperty: 'twitterURL',
        attributeValue: 'twitterURL'
    }, {
        checkProperty: 'instagramURL',
        attributeValue: 'instagramURL'
    }, {
        checkProperty: 'skypeURL',
        attributeValue: 'skypeURL'
    }, {
        checkProperty: 'githubURL',
        attributeValue: 'githubURL'
    }, {
        checkProperty: 'pintrestURL',
        attributeValue: 'pintrestURL'
    }],
    references: [{
        checkProperty: 'references',
        attributeValue: 'references'
    }],
    work: [{
        checkProperty: 'experience',
        attributeValue: 'experience'
    }],
    education: [{
        checkProperty: 'education',
        attributeValue: 'education'
    }],
    skills: [{
        checkProperty: 'skills',
        attributeValue: 'skills'
    }]
};

document.addEventListener('DOMContentLoaded', function() {
    const parsedData = parseData();
    const labelData = window.dataForLabels;

    if (parsedData && labelData) {
        //renderElements(parsedData);

        //document.getElementById("full-name").innerHTML = dataForCV.name;
        //document.getElementById("job-name").innerHTML = dataForCV.jobTitle;
        
        insertValuesToElements(getDynamicValueElements(), 'data-value', parsedData);
        insertValuesToElements(getDynamicSrcElements(), 'data-src', parsedData);
        insertValuesToElements(getDynamiClassElements(), 'data-class', parsedData);
        insertValuesToElements(getDynamicLabelElements(), 'data-label', window.dataForLabels);
    
        cloneAndInsertValuesToElements(getDynamicCloneValueElements(), 'data-clone-value', parsedData);
    }

    var toggler = document.getElementsByClassName('toggler-wrapper');

    for (i = 0; i < toggler.length; i++ ){
        toggler[i].addEventListener('click', toggle);
    }
});
