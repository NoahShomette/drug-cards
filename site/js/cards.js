import { CardIndex, getCards, } from "./cards-core.js";

export async function displayCard() {
    await getCards().then(function (blogs) {
    });
}

export async function displayCardLinks() {
    await getCards().then(function (cards) {
        cards = JSON.parse(cards);
        const cardLinkTemplate = document.querySelector('#card-link-template');
        const drugLinks = document.querySelector('#drug-links');

        for (let i = 0; i < cards.length; i++) {
            console.log(cards.length);

            let drugCard = cards[i];
            const cardLinkClone = cardLinkTemplate.content.firstElementChild.cloneNode(true);
            cardLinkClone.addEventListener("click", showDrugCard);
            cardLinkClone.querySelector('.card-link').innerText = drugCard.name;
            cardLinkClone.dataset.drugName = drugCard.name;
            drugLinks.append(cardLinkClone);
        }
    });
}


export async function showDrugCard(caller) {
    await getCards().then(function (cards) {
        document.querySelectorAll(".active-card").forEach(function (element) {
            element.remove();
        });
        cards = JSON.parse(cards);
        const drugCardTemplate = document.querySelector('#drug-card-template');
        const drugCards = document.querySelector('#drug-cards');
        let drug = cards[CardIndex.get(caller.target.dataset.drugName)];
        console.log(drug);
        const drugCardClone = drugCardTemplate.content.firstElementChild.cloneNode(true);
        drugCardClone.id = "drug-card-" + drug.name;
        drugCardClone.classList.add("active-card");
        drugCardClone.querySelector('#drug-name').innerText = drug.name;
        if (drug.dose.hasOwnProperty("alt_names")) {
            drugCardClone.querySelector('#alt-names').innerText = drug.alt_names;
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
        if (drug.hasOwnProperty("drug")) {
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

    });
}

function createElementFromText(text) {
    let newDiv = document.createElement("div");
    newDiv.innerText = text;
    return newDiv
}
