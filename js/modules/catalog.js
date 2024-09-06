import {maxArticles} from "../config.js";

class data {
    constructor(dataSet, articleStack) {
        this.dataSet = dataSet;
        this.articleStack = articleStack;
    }

    updateStack(articleStack) {
        this.articleStack = articleStack;
    } 
}

export function initCatalog(dataFile) {
    retrieveData(dataFile)
    .then(dataSet => {
        if (!dataSet) return null;
        console.log("data retrieved:", dataSet);
        let articleStack = fetchArticleStack(dataSet);
        let dataInfo = new data(dataSet, articleStack); 

        loadArticleSet(dataInfo);
    });
}

export async function retrieveData(dataFile) {
    try {
        const response = await fetch(dataFile);

        if (!response.ok) {
            console.log("couldn't fetch dataFile.");
            return null;
        }
        return await response.json();
    } catch (error) {
        console.log("Error while fetching data !:", error);
        return null;
    }
}

function fetchArticleStack(dataSet) {
    let articleStack = [];

    for (let i = 0; i < dataSet.length; i++) {
        articleStack.push(i);
    }
    return articleStack;
}

function loadArticleSet(dataInfo) {
    let catalogElement = document.getElementById("catalog");
    let mid = Math.floor(dataInfo.articleStack.length / 2);

    dataInfo.articleStack.forEach((articleId, i) => {
        let div = generateArticleFromData(dataInfo.dataSet[articleId], i, catalogElement, dataInfo);

        if (Math.abs(mid - i) < Math.floor(maxArticles / 2) + 1) {
            div.style.display = "flex";
            if (i == mid) {
                div.querySelector(".previewDiv").style.display = "none";
                div.querySelector(".selectedDiv").style.display = "flex";
                div.classList.add("selectedArticle");
            } else {
                div.querySelector(".previewDiv").style.display = "flex";
                div.querySelector(".selectedDiv").style.display = "none";
            }
        } else {
            div.style.display = "none";
        }
    });
}

function generateArticleFromData(data, i, catalogElement, dataInfo) {
    let articleDiv = createArticleDiv(data);

    initArticle(data, i, articleDiv, dataInfo);
    catalogElement.append(articleDiv);
    return articleDiv;
}

function createArticleDiv(data) {
    let articleDiv = document.createElement("div");
    let previewDiv = previewPart();
    let selectedDiv = selectedPart(data);

    articleDiv.classList.add("article");
    articleDiv.append(previewDiv);
    articleDiv.append(selectedDiv);
    return articleDiv;
}

function previewPart() {
    let previewDiv = document.createElement("div");
    previewDiv.classList.add("previewDiv");

    return previewDiv;
}

function selectedPart(data) {
    let selectedDiv = document.createElement("div");
    let articleHeader = document.createElement("div");
    let articleMain = document.createElement("div");
    let articleFooter = document.createElement("div");

    let linkButton = document.createElement("button");

    selectedDiv.classList.add("selectedDiv")
    articleHeader.id = "articleHeader";
    articleMain.id = "articleMain";
    articleFooter.id = "articleFooter";
    linkButton.id = "linkButton";

    linkButton.textContent = "Source";
    initLinkButton(data, linkButton);

    selectedDiv.append(articleHeader);
    selectedDiv.append(articleMain);
    selectedDiv.append(articleFooter);
    articleFooter.append(linkButton);
    return selectedDiv;
}

function initLinkButton(data, linkButton) {
    linkButton.addEventListener("click", () => {
        window.location = data["link"];
    });
}

function initArticle(data, i, articleDiv, dataInfo) {
    articleDiv.setAttribute("data-id", i);
    
    initPreview(data, articleDiv);
    initSelected(data, articleDiv);
    initArticleEvent(articleDiv, i, dataInfo);
}

function initPreview(data, articleDiv) {
    loadLogosInDiv(data, articleDiv.querySelector(".previewDiv"));
}

function initSelected(data, articleDiv) {
    let selectedDiv = articleDiv.querySelector(".selectedDiv");
    let articleHeader = selectedDiv.querySelector("#articleHeader");
    let articleMain = selectedDiv.querySelector("#articleMain");
    let articleFooter = selectedDiv.querySelector("#articleFooter");

    loadLogosInDiv(data, articleHeader);
    articleMain.textContent = data["info"];
}

function loadLogosInDiv(data, divToFill) {
    data["lang"].forEach(langElem => {
        let langImg = document.createElement("img");

        langImg.src = `../../assets/img/${langElem}.png`;
        divToFill.append(langImg);
    });
}

function initArticleEvent(articleDiv, i, dataInfo) {
    articleDiv.addEventListener("click", () => {
        let catalog = articleDiv.parentElement;
        const articleArray = Array.from(catalog.querySelectorAll(".article"));

        articleArray.forEach(article => {
            article.classList.remove("selectedArticle");
        });
        centerInStack(dataInfo, i);
        reloadCatalog(catalog, dataInfo, articleArray);
        revealArticle(articleDiv, dataInfo);
        articleDiv.classList.add("selectedArticle");
    });
}

function centerInStack(dataInfo, i) {
    let mid = Math.floor(dataInfo.articleStack.length / 2);

    while (dataInfo.articleStack[mid] != i) {
        let tmp = dataInfo.articleStack.pop();
        dataInfo.articleStack.unshift(tmp);
    }
}

function reloadCatalog(catalog, dataInfo, articleArray) {
    let mid = Math.floor(dataInfo.articleStack.length / 2);

    dataInfo.articleStack.forEach((articleId, i) => {
        articleArray.forEach(article => {
            const currId = article.getAttribute("data-id");
            const previewDiv = article.querySelector(".previewDiv");
            const selectedDiv = article.querySelector(".selectedDiv");

            if (currId == articleId) {
                if (Math.abs(mid - i) < Math.floor(maxArticles / 2) + 1) {
                    catalog.prepend(article);
                    previewDiv.style.display = "flex";
                    selectedDiv.style.display = "none";
                    article.style.display = "flex";
                } else {
                    article.style.display = "none";
                }
            }
        });
    });
}


function revealArticle(articleDiv, dataInfo) {
    let previewDiv = articleDiv.querySelector(".previewDiv");
    let selectedDiv = articleDiv.querySelector(".selectedDiv");

    previewDiv.style.display = "none";
    selectedDiv.style.display = "flex";
}