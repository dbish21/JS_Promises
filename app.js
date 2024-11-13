// Part 1: Number Facts
async function getNumberFact() {
    // 1. Get fact about favorite number (7)
    const favNumRes = await axios.get('http://numbersapi.com/7?json');
    addFactToPage(favNumRes.data.text);

    // 2. Get facts about multiple numbers
    const multiNumRes = await axios.get('http://numbersapi.com/1,2,3,4?json');
    for (let num in multiNumRes.data) {
        addFactToPage(multiNumRes.data[num]);
    }

    // 3. Get 4 facts about favorite number
    const favNumPromises = [];
    for (let i = 0; i < 4; i++) {
        favNumPromises.push(axios.get('http://numbersapi.com/7?json'));
    }
    const favNumFacts = await Promise.all(favNumPromises);
    favNumFacts.forEach(fact => addFactToPage(fact.data.text));
}

function addFactToPage(fact) {
    const factDiv = document.createElement('p');
    factDiv.innerText = fact;
    document.getElementById('number-facts').appendChild(factDiv);
}

// Part 2: Deck of Cards
let deckId = null;

async function singleCard() {
    // 1. Draw single card
    const resp = await axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
    const { suit, value } = resp.data.cards[0];
    console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
}

async function twoCards() {
    // 2. Draw two cards from same deck
    const firstDraw = await axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
    const deckId = firstDraw.data.deck_id;
    const secondDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    
    [firstDraw, secondDraw].forEach(draw => {
        const { suit, value } = draw.data.cards[0];
        console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
    });
}

async function setupDeck() {
    // 3. Setup new deck and draw cards on button click
    const resp = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/');
    deckId = resp.data.deck_id;
    document.getElementById('draw-card').style.display = 'block';
}

async function drawCard() {
    const resp = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const cardImg = document.createElement('img');
    cardImg.src = resp.data.cards[0].image;
    document.getElementById('card-area').appendChild(cardImg);
    
    if (resp.data.remaining === 0) {
        document.getElementById('draw-card').style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    getNumberFact();
    setupDeck();
    document.getElementById('draw-card').addEventListener('click', drawCard);
});