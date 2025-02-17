import { CardIndex, getCards, getCardsIndex, safeDrugName } from "./cards-core.js";

export async function displayCardLinks() {
    await getCards().then(async function (cards) {
        await getCardsIndex().then(function (card_index) {

            cards = JSON.parse(cards);
            const cardLinkTemplate = document.querySelector('#card-link-template');
            const drugLinks = document.querySelector('#drug-links');
            let active_cards = getActiveCards();

            for (let i = 0; i < cards.length; i++) {
                let drugCard = cards[i];
                const cardLinkClone = cardLinkTemplate.content.firstElementChild.cloneNode(true);
                if (active_cards.includes(safeDrugName(drugCard.name))) {
                    cardLinkClone.addEventListener("click", hideDrugCard);
                    cardLinkClone.classList.add("active");
                } else {
                    cardLinkClone.addEventListener("click", showDrugCard);

                }
                cardLinkClone.querySelector('.card-link').innerText = drugCard.name;
                cardLinkClone.dataset.drugName = safeDrugName(drugCard.name);
                drugLinks.append(cardLinkClone);
            }
        });
    });
}
export async function showDrugCards() {
    await getCards().then(async function (cards) {
        await getCardsIndex().then(function (card_index) {
            cards = JSON.parse(cards);
            let active_cards = getActiveCards();
            for (let i = 0; i < active_cards.length; i++) {
                let drug_name = active_cards[i];
                console.log(active_cards);
                renderCard(cards[card_index.get(drug_name)]);
            }
            sortRenderedCards();
        });
    })
}

export function hideDrugCard(caller) {
    removeRenderedCard(caller.target.dataset.drugName.toLowerCase());
    caller.srcElement.classList.remove("active");
    caller.srcElement.removeEventListener("click", hideDrugCard);
    caller.srcElement.addEventListener("click", showDrugCard);
    sortRenderedCards();
}

export async function showDrugCard(caller) {
    await getCards().then(function (cards) {
        cards = JSON.parse(cards);
        let drug = cards[CardIndex.get(caller.target.dataset.drugName)];
        caller.srcElement.classList.add("active");
        caller.srcElement.removeEventListener("click", showDrugCard);
        caller.srcElement.addEventListener("click", hideDrugCard);
        renderCard(drug);
        sortRenderedCards();
    });
}

function renderCard(drug) {
    addActiveCard(safeDrugName(drug.name));
    const drugCardTemplate = document.querySelector('#drug-card-template');
    const drugCards = document.querySelector('#drug-cards');
    const drugCardClone = drugCardTemplate.content.firstElementChild.cloneNode(true);
    drugCardClone.dataset.drugCardName = safeDrugName(drug.name);
    drugCardClone.id = "drug-card-" + safeDrugName(drug.name);
    drugCardClone.classList.add("active-card");
    drugCardClone.querySelector('#drug-name').innerText = drug.name;
    if (drug.hasOwnProperty("alt_names")) {
        for (let i = 0; i < drug.alt_names.length; i++) {
            let extra = "";
            if (i < drug.alt_names.length - 1) {
                extra = ","
            }
            drugCardClone.querySelector('#alt-names').append(createElementFromTextWithTemplate((drug.alt_names[i] + extra), "alt-name-template"));
        }
    }
    for (let i = 0; i < drug.class.length; i++) {
        let extra = "";
        if (i < drug.class.length - 1) {
            extra = ","
        }
        drugCardClone.querySelector('#class').append(createElementFromTextWithTemplate((drug.class[i] + extra), "class-template"));
    }
    drugCardClone.querySelector('#indications').append(makeIndicationsLike(drug.indications));
    drugCardClone.querySelector('#contraindications').append(makeIndicationsLike(drug.contraindications));
    drugCardClone.querySelector('#side-effects').append(makeIndicationsLike(drug.side_effects));
    if (drug.routes.length > 0) {
        for (let i = 0; i < drug.routes.length; i++) {
            drugCardClone.querySelector('#routes').append(createElementFromText(drug.routes[i]));
        }
    } else {
        drugCardClone.querySelector('#routes').classList.add("d-none");
    }
    if (drug.hasOwnProperty("interactions")) {
        drugCardClone.querySelector('#interactions').innerText = drug.interactions;
    } else {
        drugCardClone.querySelector('#interactions-holder').classList.add("d-none");
    }
    if (drug.dose.hasOwnProperty("general")) {
        if (drug.dose.general.length > 0) {
            drugCardClone.querySelector('#dose-general').append(makeIndicationsLike(drug.dose.general));
        } else {
            drugCardClone.querySelector('#dose-general-holder').classList.add("d-none");
        }
    } else {
        drugCardClone.querySelector('#dose-general-holder').classList.add("d-none");
    }
    if (drug.dose.hasOwnProperty("pedi")) {
        if (drug.dose.pedi.length > 0) {
            drugCardClone.querySelector('#dose-pedi').append(makeIndicationsLike(drug.dose.pedi));
        } else {
            drugCardClone.querySelector('#dose-pedi-holder').classList.add("d-none");
        }
    } else {
        drugCardClone.querySelector('#dose-pedi-holder').classList.add("d-none");
    }
    if (drug.dose.hasOwnProperty("adult")) {
        if (drug.dose.adult.length > 0) {
            drugCardClone.querySelector('#dose-adult').append(makeIndicationsLike(drug.dose.adult));
        } else {
            drugCardClone.querySelector('#dose-adult-holder').classList.add("d-none");
        }
    } else {
        drugCardClone.querySelector('#dose-adult-holder').classList.add("d-none");
    }

    if (drug.hasOwnProperty("onset")) {
        drugCardClone.querySelector('#onset').innerText = drug.onset;
    } else {
        drugCardClone.querySelector('#onset').classList.add("d-none");
    }

    if (drug.hasOwnProperty("duration")) {
        drugCardClone.querySelector('#duration').innerText = drug.duration;
    } else {
        drugCardClone.querySelector('#duration').classList.add("d-none");
    }

    if (drug.hasOwnProperty("protocols")) {
        if (drug.protocols.length > 0) {
            for (let i = 0; i < drug.protocols.length; i++) {
                drugCardClone.querySelector('#protocols').append(createElementFromText(drug.protocols[i]));
            }
        } else {
            drugCardClone.querySelector('#protocols-holder').classList.add("d-none");
        }
    } else {
        drugCardClone.querySelector('#protocols-holder').classList.add("d-none");
    }

    if (drug.hasOwnProperty("pearls")) {
        if (drug.pearls.length > 0) {

            for (let i = 0; i < drug.pearls.length; i++) {
                drugCardClone.querySelector('#pearls').append(createElementFromText(drug.pearls[i]));
            }
        } else {
            drugCardClone.querySelector('#pearls-holder').classList.add("d-none");
        }
    } else {
        drugCardClone.querySelector('#pearls-holder').classList.add("d-none");
    }

    if (drug.hasOwnProperty("overdose_signs")) {
        drugCardClone.querySelector('#overdose-signs').innerText = drug.overdose_signs;
    } else {
        drugCardClone.querySelector('#overdose-holder').classList.add("d-none");
    }
    drugCards.append(drugCardClone);
}

function removeRenderedCard(drug) {
    document.querySelectorAll("#drug-card-" + safeDrugName(drug)
    ).forEach(function (element) {
        element.remove();
    });
    removeActiveCard(safeDrugName(drug));
}



function createElementFromText(text) {
    let newDiv = document.createElement("div");
    newDiv.innerText = text;
    return newDiv
}
function createElementFromTextWithTemplate(text, template_id) {
    let template = document.querySelector("#" + template_id);
    let templateClone = template.content.firstElementChild.cloneNode(true);
    templateClone.innerText = text;
    return templateClone
}

function createElementFromTextTest(text) {

    var protocolRegex = /\[([^\]]+)\]/g;
    var routeRegex = /\{([^\}]+)\}/g;
    let newElement = document.createElement("div");

    var match;
    while (match = protocolRegex.exec(text)) {
        let newDiv = document.createElement("div");
        let split = splitAt(match.index, text, match[0].length);
        if (split[0].length > 0) {
            newDiv.innerText = split[0];
        }
        newElement.append(newDiv);
        console.log(split);
    }
    return newElement

}

function getActiveCards() {
    let anchor = new URLSearchParams(document.location.search);
    return anchor.getAll("activeCard");
}

function addActiveCard(drug) {
    let currentUrl = new URL(document.location);
    currentUrl.searchParams.delete("activeCard", drug);
    currentUrl.searchParams.append("activeCard", drug);
    window.history.pushState("", "", currentUrl);
}
function removeActiveCard(drug) {
    let currentUrl = new URL(document.location);
    currentUrl.searchParams.delete("activeCard", drug);
    window.history.pushState("", "", currentUrl);
}

function sortRenderedCards() {
    const dataNameElements = document.querySelectorAll("[data-drug-card-name]");
    const namedElements = Array.from(dataNameElements, function (element) {
        return { name: element.dataset.drugCardName.toLowerCase(), element: element };
    });
    const sortedNamedElements = namedElements.sort((a, b) => a.name > b.name)
    console.log(sortedNamedElements);

    sortedNamedElements.forEach((el, index) => el.element.style.order = index)
}

function makeIndicationsLike(stringArray) {
    let newElement = document.createElement("ul");
    for (let i = 0; i < stringArray.length; i++) {
        let newDiv = document.createElement("li");
        newDiv.innerText = stringArray[i];
        newElement.append(newDiv);
    }

    return newElement;
}

const splitAt = (index, string, offset) => [string.slice(0, index), string.slice(index + offset, string.length)]
