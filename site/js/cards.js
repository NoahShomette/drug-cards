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
        drugCardClone.querySelector('#alt-names').innerText = drug.alt_names;
        drugCardClone.querySelector('#skill-level').innerText = drug.skill_level;
        drugCardClone.querySelector('#class').innerText = drug.class;
        drugCardClone.querySelector('#indications').innerText = drug.indications;
        drugCardClone.querySelector('#contraindications').innerText = drug.contraindications;
        drugCardClone.querySelector('#side-effects').innerText = drug.side_effects;
        drugCardClone.querySelector('#routes').innerText = drug.routes;
        drugCardClone.querySelector('#interactions').innerText = drug.interactions;
        drugCardClone.querySelector('#dose').innerText = drug.dose;
        drugCardClone.querySelector('#onset').innerText = drug.onset;
        drugCardClone.querySelector('#duration').innerText = drug.duration;
        drugCardClone.querySelector('#protocols').innerText = drug.protocols;
        drugCardClone.querySelector('#pearls').innerText = drug.pearls;
        drugCardClone.querySelector('#overdose-signs').innerText = drug.overdose_signs;

        drugCards.append(drugCardClone);

    });
}
