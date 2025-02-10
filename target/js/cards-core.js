export let CardIndex = new Map();
export let loadingCards = false;

// Loads the blogs.json file, a repository of meta information on the blogs and then saves it into session storage
async function loadCards() {
    return await fetch("./drug_cards.json").then(function (res) {
        return res.json();
    }).then(function (cards) {
        for (let i = 0; i < cards.cards.length; i++) {
            CardIndex.set(cards.cards[i].name, i);
        }
        sessionStorage.setItem("card_index", JSON.stringify(Array.from(CardIndex.entries())));
        sessionStorage.setItem("cards", JSON.stringify(cards.cards));
        return JSON.stringify(cards.cards);
    });
}

// Gets the blogs.json or loads it if it hasnt already been gotten
export async function getCards() {
    if (!loadingCards) {
        if (sessionStorage.getItem("cards") === null || checkIfReloaded()) {
            loadingCards = true;
            return await loadCards();
        } else {
            CardIndex = new Map(JSON.parse(sessionStorage.getItem("card_index")));
            let cards = sessionStorage.getItem("cards");

            if (!cards) {
                throw Error("Session Storage did not contain 'cards' item")
            } else {
                return cards
            }
        }
    } else {
        return await timeoutToGetCards();
    }
}

let wait = t => new Promise(resolve => setTimeout(resolve, t))

async function timeoutToGetCards() {
    while (sessionStorage.getItem("cards") === null) {
        await wait(50);
    }
    let blogs_item = sessionStorage.getItem("cards");

    if (!blogs_item) {
        throw Error("Session Storage did not contain 'cards' item")
    } else {
        return blogs_item
    }
}

function checkIfReloaded() {
    return (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance
            .getEntriesByType('navigation')
            .map((nav) => nav.type)
            .includes('reload')

}
