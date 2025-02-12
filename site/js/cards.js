import { CardIndex, getCards, getCardsIndex, } from "./cards-core.js";

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
                if (active_cards.includes(drugCard.name.toLowerCase())) {
                    cardLinkClone.addEventListener("click", hideDrugCard);
                    cardLinkClone.classList.add("active");
                } else {
                    cardLinkClone.addEventListener("click", showDrugCard);

                }
                cardLinkClone.querySelector('.card-link').innerText = drugCard.name;
                cardLinkClone.dataset.drugName = drugCard.name.toLowerCase();
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
    addActiveCard(drug.name.toLowerCase());
    const drugCardTemplate = document.querySelector('#drug-card-template');
    const drugCards = document.querySelector('#drug-cards');
    const drugCardClone = drugCardTemplate.content.firstElementChild.cloneNode(true);
    drugCardClone.dataset.drugCardName = drug.name.toLowerCase();
    drugCardClone.id = "drug-card-" + drug.name.toLowerCase();
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
    drugCardClone.querySelector('#skill-level').innerText = drug.skill_level;
    for (let i = 0; i < drug.class.length; i++) {
        drugCardClone.querySelector('#class').append(createElementFromText(drug.class[i]));
    }
    for (let i = 0; i < drug.indications.length; i++) {
        drugCardClone.querySelector('#indications').append(createElementFromText(drug.indications[i]));
    }
    for (let i = 0; i < drug.contraindications.length; i++) {
        drugCardClone.querySelector('#contraindications').append(createElementFromText(drug.contraindications[i]));
    }
    for (let i = 0; i < drug.side_effects.length; i++) {
        drugCardClone.querySelector('#side-effects').append(createElementFromText(drug.side_effects[i]));
    }
    for (let i = 0; i < drug.routes.length; i++) {
        drugCardClone.querySelector('#routes').append(createElementFromText(drug.routes[i]));
    }
    if (drug.hasOwnProperty("interactions")) {
        drugCardClone.querySelector('#interactions').innerText = drug.interactions;
    }
    if (drug.dose.hasOwnProperty("general")) {
        for (let i = 0; i < drug.dose.general.length; i++) {
            drugCardClone.querySelector('#dose-general').append(createElementFromText(drug.dose.general[i]));
        }
    }
    if (drug.dose.hasOwnProperty("pedi")) {
        for (let i = 0; i < drug.dose.pedi.length; i++) {
            drugCardClone.querySelector('#dose-pedi').append(createElementFromText(drug.dose.pedi[i]));
        }
    }
    if (drug.dose.hasOwnProperty("adult")) {
        for (let i = 0; i < drug.dose.adult.length; i++) {
            drugCardClone.querySelector('#dose-adult').append(createElementFromText(drug.dose.adult[i]));
        }
    }
    if (drug.hasOwnProperty("onset")) {
        drugCardClone.querySelector('#onset').innerText = drug.onset;
    }
    if (drug.hasOwnProperty("duration")) {
        drugCardClone.querySelector('#duration').innerText = drug.duration;
    }

    drugCardClone.querySelector('#protocols').innerText = drug.protocols;

    if (drug.hasOwnProperty("pearls")) {
        for (let i = 0; i < drug.pearls.length; i++) {
            drugCardClone.querySelector('#pearls').append(createElementFromText(drug.pearls[i]));
        }
    }
    if (drug.hasOwnProperty("overdose_signs")) {
        drugCardClone.querySelector('#overdose-signs').innerText = drug.overdose_signs;
    }
    drugCards.append(drugCardClone);
}

function removeRenderedCard(drug) {
    document.querySelectorAll("#drug-card-" + drug.toLowerCase()
    ).forEach(function (element) {
        element.remove();
    });
    removeActiveCard(drug.toLowerCase());
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
