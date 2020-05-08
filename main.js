// const searchField = document.querySelector("#search-key");
const searchField = $('#search-key');
const searchButton = $('#search-btn');
const main = $('.main');
const pagination = $('.pagination');
const perPage = 5;
var searchKey;

searchButton.on('click', async function(e){
    console.log("Search button is clicked");
    // searchField.prop('disabled', true);
    searchKey = searchField.val();  
    try{
        const results = await search(1);
        console.log(results);
        
        console.log(results.incomplete_results);
        const pagesCount = getPagesCount(results.total_count);
        displayResults(results, 1, pagesCount);
        
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
   
});

async function search(page){
    try{
        const results = await getResults(page);
       return results;
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
}

async function displayResults(results, currentPage, pagesCount){
    main.html("");
    const resultsCountRow = $("<div class='row results no-border'></div>");
    const resultsCountCol = $("<div class='col-md-12 p-20'></div>");
    const resultsCount = $(`<p  class="result-count">Search results <span>${results.total_count}</span></p>`);
    const dispCount = $(`<p class="result-count">Displaying ${(currentPage * 10) - 9} to ${((currentPage * 10) - 9) + (results.items.length -1)}</p>`)
    resultsCountCol.append(resultsCount);
    resultsCountCol.append(dispCount);
    resultsCountRow.append(resultsCountCol);
    main.append(resultsCountRow);
    results.items.forEach(async result => {
        try{
            const user = await getUser(result);
            const rowDiv = $("<div class='row results'></div>");
            const userCol = await createUserCol(user);
            rowDiv.append(userCol)
        
            const descCol = await createDescCol(user);

            
            rowDiv.append(descCol);
            main.append(rowDiv)
        }catch(err){
            console.log('Error Occured');
            console.log(err);
        }
    });

    pagination.html("");
    const prevNext = getPageNaviagation(currentPage, pagesCount);
    pagination.append(prevNext);
}

function getPageNaviagation(currentPage, pagesCount){

    const prevNext = $(`<div class="col-md-12 pagination-flex"></div>`)

    const prevCol = $(`<div class="col-md-4 prev"></div>`)

    const prevPageLink =  $(`<button class='btn prev-next'>Previous</button>`);
    if(currentPage > 1){
        prevPageLink.on('click', function(){
            if(currentPage > pagesCount) currentPage = pagesCount;
            return prevPageFunction(currentPage);
        })

        prevCol.append(prevPageLink);
    }

    prevNext.append(prevCol);

    const goToPageCol = $(`<div class="col-md-4 go-to-page"></div>`);

    const gotoPageInput = $(`<input text="number" class="go-to">`);
    const goToPageBtn = $(`<button class='btn'><i class="fa fa-angle-double-right"></i></button>`);
    
    goToPageBtn.on('click', function(){
        const goToPage = gotoPageInput.val();
        if(goToPage < 1) goToPage = 1;
        if(goToPage > pagesCount) goToPage = pagesCount;
        return goToPageFunction(goToPage);
    })

    if(pagesCount > 1){
        goToPageCol.append(gotoPageInput);
        goToPageCol.append(goToPageBtn);
    }

   

    prevNext.append(goToPageCol);
    
    const nextCol = $(`<div class="col-md-4 next"></div>`);
    const nextPageLink = $(`<button class='btn prev-next'>Next</button>`);

    if(currentPage < pagesCount){
        
        nextPageLink.on('click', function(){
            if(currentPage < 1) currentPage = pagesCount;
            return nextPageFunction(currentPage);
        });

        nextCol.append(nextPageLink);
    }

    prevNext.append(nextCol);

    return prevNext;
}

async function goToPageFunction(goToPage){
    try{

        const results = await search(goToPage);
        console.log(results);
        
        console.log(results.incomplete_results);
        const pagesCount = getPagesCount(results.total_count);
        displayResults(results, goToPage, pagesCount);
        
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
}

async function nextPageFunction(currentPage){
    try{
        const results = await search(currentPage + 1);
        console.log(results);
        
        console.log(results.incomplete_results);
        const pagesCount = getPagesCount(results.total_count);
        displayResults(results, currentPage + 1, pagesCount);
        
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
}

async function prevPageFunction(currentPage){
    try{
        const results = await search(currentPage - 1);
        console.log(results);
        
        console.log(results.incomplete_results);
        const pagesCount = getPagesCount(results.total_count);
        displayResults(results, currentPage - 1, pagesCount);
        
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
}

function getPagesCount(totalCount){
    const rem = totalCount % perPage;
    if(rem == 0){
       return  totalCount / perPage;
    }
    else{
        return Math.floor(totalCount / perPage) + 1;
    }
}

async function createDescCol( user){    
    const descCol = $("<div class='col-sm-7 desc-flex'></div>");

    const updatedDiv = $(`<div class='col-md-6 flex-end'></div>`);
    const lastUpdatedText = $(`<p class='small-text'>${'Last updated: '}</p>`);
    const updatedP = $(`<p class='small-text'></p>`);
    const date = new Date(user.updated_at);
    const updatedTime = date.toLocaleDateString();
    updatedP.text(updatedTime);
    updatedDiv.append(lastUpdatedText);
    updatedDiv.append(updatedP);

    descCol.append(updatedDiv);

    const descDivParent = $(`<div class='col-md-6 flex-center'></div>`);
    const descDiv = $(`<div class='col-flex'></div>`)
    
    const followersDiv = getFollowersDiv(user);

    descDiv.append(followersDiv);

    const reposDiv = getReposDiv(user);

    descDiv.append(reposDiv);

    const gitDiv = getGitDiv(user);
    descDiv.append(gitDiv);
    descDivParent.append(descDiv);
    descCol.append(descDivParent);

    return descCol;
}

function getUser(result){
    return fetch(result.url)
        .then(res => res.json())
}

function getGitDiv(user){
    const gitDiv = $(`<div class="no-wrap"></div>`);

    const gitIcon = $(`<i class="fa fa-github"></i>`);
    gitDiv.append(gitIcon);

    const gitLink = $(`<a class='link' href='${user.html_url}'></a>`);
    gitLink.text('GitHub');
    gitLink.attr('target', '_blank');
    gitLink.hover(function(){
        gitIcon.addClass('blue');
    });
    gitLink.mouseleave(function(){
        gitIcon.removeClass('blue');
    });
    
    gitDiv.append(gitLink);



    return gitDiv;
}

function getReposDiv(user){
    const reposDiv = $(`<div class="no-wrap"></div>`);

    const reposIcon = $(`<i class="fa fa-folder"></i>`);
    reposDiv.append(reposIcon);

    const reposLink = $(`<a class='link' href='user.html'></a>`);
    reposLink.text('Repositories');
    reposLink.on('click', function(){
        return reposPageFunction(user);
    });
    reposLink.hover(function(){
        reposIcon.addClass('blue');
    });
    reposLink.mouseleave(function(){
        reposIcon.removeClass('blue');
    });
    reposDiv.append(reposLink);

    const reposCount = user.public_repos;
    console.log(reposCount);
    const reposCountSpan = $(`<span></span>`);
    reposCountSpan.text(reposCount);
    reposDiv.append(reposCountSpan);

    return reposDiv;
}

function getFollowersDiv(user){
    const followersDiv = $(`<div class="no-wrap"></div>`);

    const followersIcon = $(`<i class="fa fa-users"></i>`);
    followersDiv.append(followersIcon);

    const followerLink = $(`<a class='link' href='user.html'></a>`);
    followerLink.text('Followers');
    followerLink.on('click', function(){
        return followersPageFuntion(user);
    });

    followerLink.hover(function(){
        followersIcon.addClass('blue');
    });
    followerLink.mouseleave(function(){
        followersIcon.removeClass('blue');
    });

    followersDiv.append(followerLink);

    const followersCount = user.followers;
    console.log(followersCount);
    const followersCountSpan = $(`<span></span>`);
    followersCountSpan.text(followersCount);
    followersDiv.append(followersCountSpan);

    return followersDiv;
}

function reposPageFunction(user){
    setLocalStorage('user-result', JSON.stringify(user));
    setLocalStorage('tag', 'repos');
}

function followersPageFuntion(user){
    console.log('before: ' + user.login);
    setLocalStorage('user-result', JSON.stringify(user));
    setLocalStorage('tag', 'followers');
}

async function createUserCol(user){
    const userCol = $("<div class='col-sm-5 inline-flex'></div>");
    const profileImage = $("<img class='profile-img'>");
    profileImage.attr('src',user.avatar_url);
    userCol.append(profileImage);
    const userName = $(`<a class='user-name' href='user.html'></a>`);
    let userNameText;
    if(user.name == null || user.name == undefined || user.name == ""){
        userNameText = user.login;
    }
    else{
        userNameText = user.name
    }
    userName.text(userNameText);
    userName.on('click', function(){
        return userPageFunction(user);
    })

    userCol.append(userName);

    return userCol;
}

function userPageFunction(user){
    setLocalStorage('user-result', JSON.stringify(user));
    setLocalStorage('tag', 'user');
}

async function getResults(page){
    console.log(searchKey);
    const searchUrl = `https://api.github.com/search/users?q=${searchKey}&sort=repositories&page=${page}&per_page=${perPage}`;
    try{
        const response = await fetch(searchUrl, {method:'GET'});
        const results = await response.json();
        return results;
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
    
}

function setLocalStorage(key, value){
    localStorage.setItem(key, value);
}

//https://developer.github.com/v3/search/#search-users
//https://developer.github.com/v3/users/    
// https://developer.github.com/v3/#link-header