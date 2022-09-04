"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const noImageURL = "http://tinyurl.com/missing-tv";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

//  async function searchTvShows(word) {
//   let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${word}`);
  
//   let tvShows = res.data.map(function(results){
//     let tvShow = results.tvShow;
//     return {
//       id : tvShow.id,
//       name : tvShow.name,
//       summary : tvShow.summary,
//       image : tvShow.image,
//       };
//     });
//   return tvShows;
// }

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  console.log(res)
  let newShows = res.data.map(function(results){
    let newShow = results.show;
    return newShow;
  });
  return newShows;
  console.log(newShows);

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //     }
  //   ]
  }


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image.original}" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);
      $show.on("click", async function (evt) {
        evt.preventDefault();
        let episodes = await getEpisodesOfShow(show.id);
        await populateEpisodes(episodes);

      });

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  console.log(term)
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  
  let epis = res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }))
    return epis;
 }

/** Write a clear docstring for this function... */
// populate list of all episode from a show

function populateEpisodes(episodes) {
const episodeList = $("#episodes-list");
console.log(episodeList)
episodeList.empty();
 episodes.forEach(function(epis){
  console.log(epis)
  let list = (
    `<li>
      ${epis.name}
      (season ${epis.season}, episode ${epis.number})
      </li>
      `);
      episodeList.append(list);
  })
    $episodesArea.show();
}
