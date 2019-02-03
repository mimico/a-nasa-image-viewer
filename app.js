
/* User Story

1. when user enters a term in the search box and presses
	 search images are returned from the nasa search api
	 (https://images-api.nasa.gov/search)

2. images are displayed on the page in batches of 12

3. if there are more than 12 images returned a link(s) appear in the footer
   allowing the user to paginate through the pictures

Notes: Api call takes the following parameters:
           q=search_term, media_type=image
*/

/*
We need:
1. a listener for form submit
2. a function to get the value of the search Feild
3. a function to get data from the api
4. to extract data we need and create html to render on the page
5. pagination and display images in batches of 12
6. Click listener on pagination links
7. listener to listen for page load and start the appliation
 */
const startPreviewer = () => {
  console.log("Page Loaded");
  // all the code for the program goes here.
  // listener to listen for form submit

  const fetchData = searchTerm => {
      console.log("fetchData: " + searchTerm);
      //use fetch api to get data
      let url = `https://images-api.nasa.gov/` +
                 `search?q=${searchTerm}&media_type=image`;
      return fetch(url); //fetch(url) returns a promise
  }//end fetchData

  var pageNum = 1;
  const form = document.forms['search-form'];

  form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Form button Pressed");
      var searchterm = document.getElementById("searchbox").value;
      console.log ("event listener: " + searchterm);
      /* we need to fetch our data */
      // fetchData(searchterm);
      fetchData(searchterm).then(response => {
        /* we get a Promise, so we need to use a then method to
           manipulate a response from that promise */
        console.log(response);
        if (response.ok) {
            return response.json();
        }
        throw new Error("Api did not respond");
      }).then(response => {
         // process json for data required
         // console.log(response);
         var apiData = response.collection.items //an array of objects
         // apiData[0].links[0].href ==== link to images
         // apiData[0].data[0].title ==== picture title

          // function map can iterate over api data
          let imageData = apiData.map (item => {
              //return {src: "href", title: "title"}
              return {src: item.links[0].href, title: item.data[0].title};
          })

      console.log(imageData);
      const imageContainer = document.getElementById("images");
      const paginate = document.getElementById("seemore");

      imageContainer.innerHTML = "";
      let totalPages = Math.ceil(imageData.length / 12);

      const renderPage = () => {
        let imagesForRender = imageData.slice(pageNum*12-12, pageNum*12);

        imagesForRender.forEach(item => {
          let picDiv = document.createElement('div');
          let img = document.createElement('img');
          let captionDiv = document.createElement('div');
          picDiv.className = "imgHolder";
          img.src = item.src;
          img.alt = item.title;
          captionDiv.textContent = item.title;
          picDiv.appendChild(img);
          picDiv.appendChild(captionDiv);
          imageContainer.appendChild(picDiv);
        }) //end forEach

        if (totalPages > 1) {
          paginate.innerHTML = "";

          const backLink = () => {
            let back = document.createElement('a');
            back.id = 'back';
            back.href = "#";
            back.text = textContent = 'Back';
            return back;
          }

          const forwardLink = () => {
            let forward = document.createElement('a');
            forward.id = 'forward';
            forward.href = "#";
            forward.text = textContent = 'Forward';
            return forward;
          }

          if (pageNum > 1 && pageNum < totalPages) {
            //display back and forward link
            paginate.appendChild(backLink());
            paginate.append(" | ");
            paginate.appendChild(forwardLink());
          } else if (pageNum === 1 ) {
            //Just add a forward link
            paginate.appendChild(forwardLink());
          }
          else if (pageNum === totalPages) {
            paginate.appendChild(backLink());
          }
         }
      }//end renderPage

      renderPage();

        paginate.addEventListener('click', (e) => {
          e.preventDefault();
          if (e.target.tagName === "A") {
            if (e.target.id === 'forward') {
              pageNum += 1;
              renderPage();
            } else if (e.target.id === "back") {
                pageNum -= 1;
                renderPage();
              }
          }
        })
    })
  })
}

window.addEventListener('load', startPreviewer());


