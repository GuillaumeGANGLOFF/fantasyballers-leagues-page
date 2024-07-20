/*   STEP 1   */
export const listLeagues = [
      {id: "1101100397374140416", name: "FantasyBallers Best Ball 1", dynasty: false, classification: "BestBall"},
      {id: "1101910746880917504", name: "FantasyBallers Best Ball 2", dynasty: false, classification: "BestBall"},
      {id: "1101911295554723840", name: "FantasyBallers Best Ball 3", dynasty: false, classification: "BestBall"},
      {id: "1101911618952237056", name: "FantasyBallers Best Ball 4", dynasty: false, classification: "BestBall"},
      {id: "1101912074961248256", name: "FantasyBallers Best Ball 5", dynasty: false, classification: "BestBall"},
      {id: "1102011733910106112", name: "FantasyBallers Best Ball 6", dynasty: false, classification: "BestBall"},
      {id: "1102014586301149184", name: "FantasyBallers Best Ball 7", dynasty: false, classification: "BestBall"},
      {id: "1102017452948553728", name: "FantasyBallers Best Ball 8", dynasty: false, classification: "BestBall"},
      {id: "1102018321492348928", name: "FantasyBallers Best Ball 9", dynasty: false, classification: "BestBall"},
      {id: "1102018993260552192", name: "FantasyBallers Best Ball 10", dynasty: false, classification: "BestBall"},
      {id: "1104840258216079360", name: "FantasyBallers Best Ball 11", dynasty: false, classification: "BestBall"},
      {id: "1104840925890625536", name: "FantasyBallers Best Ball 12", dynasty: false, classification: "BestBall"},
      {id: "1104841372173049856", name: "FantasyBallers Best Ball 13", dynasty: false, classification: "BestBall"},
      {id: "1104842496263299072", name: "FantasyBallers Best Ball 14", dynasty: false, classification: "BestBall"}
];
/*export const listLeagues = [
      {id: "1111420488934367232", name: "#LigueFB - Dynasty 9", dynasty: true, classification: "LFB"},
      {id: "1104841798364520448", name: "FantasyBallers Best Ball 14", dynasty: false, classification: "BestBall"},
      {id: "1101100397374140416", name: "FantasyBallers Best Ball 1", dynasty: false, classification: "BestBall"},
      {id: "1101910746880917504", name: "FantasyBallers Best Ball 2", dynasty: false, classification: "BestBall"},
      {id: "1101911295554723840", name: "FantasyBallers Best Ball 3", dynasty: false, classification: "BestBall"},
      {id: "1101911618952237056", name: "FantasyBallers Best Ball 4", dynasty: false, classification: "BestBall"},
      {id: "1101912074961248256", name: "FantasyBallers Best Ball 5", dynasty: false, classification: "BestBall"},
      {id: "1102011733910106112", name: "FantasyBallers Best Ball 6", dynasty: false, classification: "BestBall"},
      {id: "1102014586301149184", name: "FantasyBallers Best Ball 7", dynasty: false, classification: "BestBall"},
      {id: "1102017452948553728", name: "FantasyBallers Best Ball 8", dynasty: false, classification: "BestBall"},
      {id: "1102018321492348928", name: "FantasyBallers Best Ball 9", dynasty: false, classification: "BestBall"},
      {id: "1102018993260552192", name: "FantasyBallers Best Ball 10", dynasty: false, classification: "BestBall"},
      {id: "1104840258216079360", name: "FantasyBallers Best Ball 11", dynasty: false, classification: "BestBall"},
      {id: "1104840925890625536", name: "FantasyBallers Best Ball 12", dynasty: false, classification: "BestBall"},
      {id: "1104841372173049856", name: "FantasyBallers Best Ball 13", dynasty: false, classification: "BestBall"},
      {id: "1104842496263299072", name: "FantasyBallers Best Ball 15", dynasty: false, classification: "BestBall"},
      {id: "1052611890968510464", name: "#LigueFB - Dynasty 1", dynasty: true, classification: "LFB"},
      {id: "1066014137890848768", name: "#LigueFB - Dynasty 3", dynasty: true, classification: "LFB"},
      {id: "1074376261398532096", name: "#LigueFB - Dynasty 4", dynasty: true, classification: "LFB"},
      {id: "1074373208150794240", name: "#LigueFB - Dynasty 5", dynasty: true, classification: "LFB"},
      {id: "1074399539953504256", name: "#LigueFB - Dynasty 6", dynasty: true, classification: "LFB"},
      {id: "1109614390447407104", name: "#LigueFB - Dynasty 7", dynasty: true, classification: "LFB"},
      {id: "1109615528995278848", name: "#LigueFB - Dynasty 8", dynasty: true, classification: "LFB"}
];*/

// your list of league
export const dues = 100; // (optional) used in template constitution page
export const enableBlog = false; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
  <p>Rejoignez la communauté FantasyBallers, le rendez-vous incontournable pour tous les passionnés de fantasy football NFL en France ! FantasyBallers est une plateforme dynamique où les amateurs du football américain peuvent trouver des podcasts passionnants, des discussions en direct et une multitude de contenus interactifs. Actifs sur plusieurs canaux tels que Spotify, Twitch et YouTube, nous offrons des épisodes en live, des mises à jour régulières et des analyses approfondies pour enrichir votre expérience de jeu durant la saison NFL. Que vous soyez débutant ou expert, FantasyBallers est votre communauté pour plonger au cœur de l’action et partager votre passion pour le fantasy football. Venez décrypter les performances, élaborer vos stratégies et célébrer chaque touchdown en bonne compagnie !</p>
`; // (optional) homepage text

export const showPopup = false; // (optional) change to true if you need to show a popup on homepage
export const textPopup = `
    <p>Il est temps de vous réinscrire pour l'année prochaine !</p>
    <br>
    <p><a href="https://google.fr">Cliquez ici</a> pour remplir le formulaire.</p>
    ` // (optional) text to include in the popup. Write it on html format

/*   STEP 3   */
/*
3 managers as an example. Uncomment (remove the //) before each line to make it live code
If you're having trouble, reference the Training Wheels' Manager Section
https://github.com/nmelhado/league-page/blob/master/TRAINING_WHEELS.md#ii-adding-managers-and-changing-the-homepage-text
*/

// To omit an optional field, set it's value to null

export const managers = [
    // {
    //   "roster": 1,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy",
    //   "tradingScale": 10, // 1 - 10
    //   "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    // {
    //   "roster": 2,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy",
    //   "tradingScale": 10, // 1 - 10
    //   "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    // {
    //   "roster": 3,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy",
    //   "tradingScale": 10, // 1 - 10
    //   "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
  ]
  
  
  /*   !!  !!  IMPORTANT  !!  !! */
  /*
  Below is the most up to-date version of a manager. Please leave this commented out
  and don't delete it. This will be updated if any fields are added, removed or changed
  and will allow updates without causing merge conflicts
  */
  
    // {
    //   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "managerID": "12345678",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy", // (optional)
    //   "tradingScale": 10, // 1 - 10 (optional)
    //   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    