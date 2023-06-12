class TopScorer {
    #data = [
        {
            username: "Evan Lathi",
            avatar: "images/assets/evan-lahti.jpg",
            occupation: "PC Gamer",
            comment: "One of my gaming highlights of the year.",
            createdAt: "June 18, 2021"
        },
        {
            username: "Jada Griffin",
            avatar: "images/assets/jada-griffin.jpg",
            occupation: "Nerdreactor",
            comment: "The next big thing in the world of streaming and survival games.",
            createdAt: "July 10, 2021"
        },
        {
            username: "Aaron Williams",
            avatar: "images/assets/aaron-williams.jpg",
            occupation: "Uproxx",
            comment: "Snoop Dogg Playing The Wildly Enternaining 'SOS' Is Ridiculous.",
            createdAt: "December 24, 2018"
        }
    ]


    getTopScorers() {
        return this.#data 
    }

}


const topScorer = new TopScorer()
module.exports = { topScorer }
