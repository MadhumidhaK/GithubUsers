const user = JSON.parse(localStorage.getItem("user-result"));
const main = $('.main');
const perPage = 6;
const followersCount = user.followers;
const reposCount = user.public_repos;

const followersNav = $(`[name="followers"]`);
const reposNav = $('[name="repos"]');
const githubProfile = $('[name="github-link"]');
let userName;
if(user.name == null || user.name == undefined  || user.name == ""){
    userName = user.login;
}
else{
    userName = user.name
}

document.title =  userName;

const toggleButton = $(`.toggle-button-div`);
const backDrop = $(`.backdrop`);
const mobileNav = $(`.mobile-nav`);

toggleButton.on('click', function(){
    backDrop.addClass('open-block');
    mobileNav.addClass('open-block');
    toggleButton.addClass('not-visible');;
})

backDrop.on('click', function(){
    console.log('backdrop Clicked');
    hideMobNav();
});

githubProfile.on('click', function(){
    hideMobNav();
})

function hideMobNav(){
    console.log('Hiding Mobile Nav');
    backDrop.removeClass('open-block');
    mobileNav.removeClass('open-block');
    toggleButton.removeClass('not-visible');
}


$(document).ready(async function(){
    displayHeading();

    const pageContent = localStorage.getItem('tag');
    console.log(pageContent);

    if(pageContent === 'repos'){
        showRepositoriesInit();
    }else if(pageContent === 'followers'){
        showFollowersInit();
    }else{
        showUserContent();
    }

    
    githubProfile.attr('href', user.html_url)
    githubProfile.text('GitHub');
    githubProfile.attr('target', '_blank');
    
    // const followers = await getFollowers(1);
    // displayFollowers(followers, 1);

})

async function showUserContent(){
    main.html("");
    const rowDiv = $(`<div class="row margin-20"></div>`);
    const followersCol = $(`<div class="col-md-6 flex-center"></div>`);
    const repositoriesCol = $(`<div class="col-md-6 flex-center"></div>`);

    const followerDiv = await getUserFollowersDiv(user);
    followersCol.append(followerDiv);
    
    const reposDiv = await getUserReposDiv(user);
    repositoriesCol.append(reposDiv);

    rowDiv.append(followersCol);
    rowDiv.append(repositoriesCol);
    main.append(rowDiv);
}

function getUserReposDiv( userResult){
    const reposDiv = $(`<div></div>`);

    const reposIcon = $(`<i class="fa fa-folder"></i>`);
    reposDiv.append(reposIcon);

    const reposLink = $(`<p class='link'></p>`);
    reposLink.text('Repositories');
    reposLink.on('click', function(){
        setLocalStorage('tag', 'repos');
        return showRepositoriesInit(userResult);
    });
    reposLink.hover(function(){
        reposIcon.addClass('blue');
    });
    reposLink.mouseleave(function(){
        reposIcon.removeClass('blue');
    })

    reposDiv.append(reposLink);

    const reposCount = userResult.public_repos;
    const reposCountSpan = $(`<span></span>`);
    reposCountSpan.text(reposCount);
    reposDiv.append(reposCountSpan);

    return reposDiv;
}

function getUserFollowersDiv( userResult){
    const followersDiv = $(`<div></div>`);

    const followersIcon = $(`<i class="fa fa-users"></i>`);
    followersDiv.append(followersIcon);

    const followerLink = $(`<p class='link'></p>`);
    followerLink.text('Followers');
    followerLink.on('click', function(){
        setLocalStorage('tag', 'followers');
        return showFollowersInit();
    });
    followerLink.hover(function(){
        followersIcon.addClass('blue');
    });
    followerLink.mouseleave(function(){
        followersIcon.removeClass('blue');
    })


    followersDiv.append(followerLink);

    const followersCount = userResult.followers;
    const followersCountSpan = $(`<span></span>`);
    followersCountSpan.text(followersCount);
    followersDiv.append(followersCountSpan);

    return followersDiv;
}

async function showRepositoriesInit(){
    const repos = await getRepositories(1);
    reposNav.addClass('active');
    followersNav.removeClass('active');
    displayRepositories(repos, 1);
}


async function displayRepositories(repos, currentPage){
    try{
        main.html("");
        const resultsCountRow = $("<div class='row results no-border'></div>");
        const resultsCountCol = $("<div class='col-md-12 p-20'></div>");
        const resultsCount = $(`<p  class="result-count">Total Repositories <span>${reposCount}</span></p>`);
        if(reposCount > 0){
            const dispCount = $(`<p class="result-count">Displaying ${(currentPage * 6) - 5} to ${((currentPage * 6) - 5) + (repos.length -1)}</p>`)
            resultsCountCol.append(resultsCount);
            resultsCountCol.append(dispCount);
        }else{
            resultsCountCol.append(resultsCount);
    
        }
        
        resultsCountRow.append(resultsCountCol);
        main.append(resultsCountRow);
        const length = repos.length;
        const rows = Math.ceil(length/2);
        let rowDiv; 
        repos.forEach(async (repo, index) => {
    
            if(index % 2 == 0){
                rowDiv = $(`<div class="row"></div>`);
                main.append(rowDiv);
            }
            const colDiv12 = $(`<div class="col-md-6 repos-col"></div>`);
            const colDiv = $(`<div class="col-md-12 repo"></div>`);
            const repoDiv = $(`<div></div>`);
    
            const repoLink = $(`<a class="link disp-block" href="${repo.html_url}">${repo.name}</a>`);
            repoDiv.append(repoLink);
    
            const repoDesctext = (repo.description != null && repo.description != undefined && repo.description != "" ) ?
                                        repo.description : "";
            const repoDesc = $(`<p class="small-text rl-p-10">${repoDesctext}</p>`);
            repoDiv.append(repoDesc);
    
            const repoDetails = $(`<div class='flex rl-p-10'></div>`);
    
            const languageDiv = $(`<div class='lang-div'></div>`);
            if(repo.language){
                
                const languageIcon = $(`<i class="fa fa-circle"></i>`);
                languageDiv.append(languageIcon);
                const repoLangLowerCase = repo.language.toLowerCase();
                languageIcon.addClass(repoLangLowerCase);
                if(repoLangLowerCase == 'c#') languageIcon.addClass('c');
                const language = $(`<span class='detail'>${repo.language}</span>`);
                languageDiv.append(language);
               
            }
            repoDetails.append(languageDiv);
    
            const starDiv = $(`<div class='star-div'></div>`);
            const starIcon = $(`<i class="fa fa-star"></i>`);
            starDiv.append(starIcon);
            const starCount = $(`<span class='detail'>${repo.stargazers_count}</span>`);
            starDiv.append(starCount);
            repoDetails.append(starDiv);
    
    
            const updatedDiv = $(`<div class='last-updated'></div>`);
            const date = new Date(repo.updated_at);
            const updatedTime = date.toLocaleDateString();
    
            const updatedText = $(`<span class='small-text'>Last Updated: ${updatedTime}</span>`);
            updatedDiv.append(updatedText);
            repoDetails.append(updatedDiv);
    
            repoDiv.append(repoDetails);
    
            colDiv.append(repoDiv)
            colDiv12.append(colDiv);
            rowDiv.append(colDiv12);
        });
    
        const pagesNav = $('.pages-nav');
        pagesNav.html("");
        const paginationRow = $(`<div class="row"></div>`);
        const pagination = $(`<div class="col-md-12 pagination"></div>`);
        paginationRow.append(pagination);
        pagination.html("");
        const pagesCount = getPagesCount(reposCount);
        const prevNext = getReposPageNaviagation(currentPage, pagesCount);
        pagination.append(prevNext);
        pagesNav.append(paginationRow);
    }catch(err){
        main.html("")
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
        console.log('Error Occured');
        console.log(err);
    }

}


async function repoPrevPageFunction(currentPage){
    try{
        const results = await getRepositories(currentPage - 1);
        console.log(results);
        
       
        displayRepositories(results, currentPage - 1);
        
    }catch(err){
        main.html("")
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
        console.log('Error Occured');
        console.log(err);
    }
}

async function repoNextPageFunction(currentPage){
    try{
        const results = await getRepositories(currentPage + 1);
        console.log(results);
        
        displayRepositories(results, currentPage + 1);
        
    }catch(err){
        console.log('Error Occured');
        console.log(err);
    }
}

function getReposPageNaviagation(currentPage, pagesCount){

    const prevNext = $(`<div class="col-md-12 pagination-flex"></div>`)

    const prevCol = $(`<div class="col-md-6 prev"></div>`)

    const prevPageLink =  $(`<button class='btn prev-next'>Previous</button>`);
    if(currentPage > 1){
        prevPageLink.on('click', function(){
            if(currentPage > pagesCount) currentPage = pagesCount;
            return repoPrevPageFunction(currentPage);
        })

        prevCol.append(prevPageLink);
    }

    prevNext.append(prevCol);
    
    const nextCol = $(`<div class="col-md-6 next"></div>`);
    const nextPageLink = $(`<button class='btn prev-next'>Next</button>`);

    if(currentPage < pagesCount && currentPage <= 101){
        
        nextPageLink.on('click', function(){
            if(currentPage < 1) currentPage = pagesCount;
            return repoNextPageFunction(currentPage);
        });

        nextCol.append(nextPageLink);
    }

    prevNext.append(nextCol);

    return prevNext;
}

async function getRepositories(page){
    const repositoriesUrl = user.repos_url+ `?page=${page}&per_page=${perPage}`;

    try{
        const response = await fetch(repositoriesUrl, {method:'GET'});
        const repos = await response.json();
        return repos;
    }catch(err){
        main.html("")
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
        console.log('Error Occured');
        console.log(err);
    }
}

reposNav.on('click', function(){
    hideMobNav();
    showRepositoriesInit();
    setLocalStorage('tag', 'repos');
});


followersNav.on('click', function(){
    hideMobNav();
    showFollowersInit(); 
    setLocalStorage('tag', 'followers');
});


async function showFollowersInit(){
    const followers = await getFollowers(1);
    followersNav.addClass('active');
    reposNav.removeClass('active');
    displayFollowers(followers, 1);
    
}




function displayHeading(){
    
    const headRow = $(`.head-row`);
    const userImageCol = $(`<div class='col-md-4 user-img-col'></div>`);
    const userImage = $(`<img src="${user.avatar_url}" class='user-img'>`);
    userImageCol.append(userImage);
    headRow.append(userImageCol);

    const userCol = $(`<div class="col-md-8 user-col"></div>`);

    const heading = $(`<p class="heading"></p>`);
    heading.text(userName);
    userCol.append(heading);

    const lastUpdated = $(`<p class="small-text"></p>`);
    // lastUpdated.addClass('text-center');
    const date = new Date(user.updated_at);
    const updatedTime = date.toLocaleDateString();
    lastUpdated.text('Last Updated: ' + updatedTime );
    userCol.append(lastUpdated);

    if(user.location){
        const locationDiv = $(`<div><div>`);
        const locIcon = $(`<i class="fa fa-map-marker"></i>`);
        const location = $(`<span class="margin-left-5">${user.location}</span>`)
        locationDiv.append(locIcon);
        locationDiv.append(location);
        userCol.append(locationDiv);
    }

    if(user.company){
        const companyDiv = $(`<div></div>`);
        const compIcon = $(`<i class="fa fa-building"></i>`);
        const company = $(`<span class="margin-left-5" title="Company">${user.company}</span>`)
        companyDiv.append(compIcon);
        companyDiv.append(company);
        userCol.append(companyDiv);
    }

    headRow.append(userCol);
}

async function displayFollowers(followers, currentPage){
    
    main.html("");
    try{
        const resultsCountRow = $("<div class='row results no-border'></div>");
        const resultsCountCol = $("<div class='col-md-12 p-20'></div>");
        const resultsCount = $(`<p class="result-count">Total Followers <span>${followersCount}</span></p>`);
        if(followersCount > 0){
            const dispCount = $(`<p class="result-count">Displaying ${(currentPage * 6) - 5} to ${((currentPage * 6) - 5) + (followers.length -1)}</p>`)
            resultsCountCol.append(resultsCount);
            resultsCountCol.append(dispCount);
        }else{
            resultsCountCol.append(resultsCount);

        }
        
        resultsCountRow.append(resultsCountCol);
        main.append(resultsCountRow);
    }catch(err){
        main.html("")
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
    }
    
    try{
        followers.forEach(async follower => {
            const rowDiv = $(`<div class='row results'></div>`);
            const userResult = await getUser(follower);   
            console.log(userResult)       
            const userCol = await createUserCol(userResult);
            rowDiv.append(userCol)
            const descCol = await createDescCol(userResult);
            rowDiv.append(descCol)
            main.append(rowDiv);
        });
    }catch(err){
        main.html("")
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
        console.log("Error Occured");
        console.log(err)
    }
    const pagesNav = $('.pages-nav');
    pagesNav.html("");
    const paginationRow = $(`<div class="row w-80"></div>`);
    const pagination = $(`<div class="col-md-12 pagination"></div>`);
    paginationRow.append(pagination);
    pagination.html("");
    const pagesCount = getPagesCount(followersCount);
    const prevNext = getPageNaviagation(currentPage, pagesCount);
    pagination.append(prevNext);
    pagesNav.append(paginationRow);

}


function getPageNaviagation(currentPage, pagesCount){

    const prevNext = $(`<div class="col-md-12 pagination-flex"></div>`)

    const prevCol = $(`<div class="col-md-6 prev"></div>`)

    const prevPageLink =  $(`<button class='btn prev-next'>Previous</button>`);
    if(currentPage > 1){
        prevPageLink.on('click', function(){
            if(currentPage > pagesCount) currentPage = pagesCount;
            return prevPageFunction(currentPage);
        })

        prevCol.append(prevPageLink);
    }

    prevNext.append(prevCol);

    // const goToPageCol = $(`<div class="col-md-4 go-to-page"></div>`);

    // const gotoPageInput = $(`<input text="number" class="go-to">`);
    // const goToPageBtn = $(`<button class='btn'><i class="fa fa-angle-double-right"></i></button>`);
    
    // goToPageBtn.on('click', function(){
    //     const goToPage = gotoPageInput.val();
    //     if(goToPage < 1) goToPage = 1;
    //     if(goToPage > pagesCount) goToPage = pagesCount;
    //     return goToPageFunction(goToPage);
    // })

    // goToPageCol.append(gotoPageInput);
    // goToPageCol.append(goToPageBtn);

    // prevNext.append(goToPageCol);
    
    const nextCol = $(`<div class="col-md-6 next"></div>`);
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

// async function goToPageFunction(goToPage){
//     try{

//         const results = await search(goToPage);
//         console.log(results);
        
//         console.log(results.incomplete_results);
//         const pagesCount = getPagesCount(results.total_count);
//         displayResults(results, goToPage, pagesCount);
        
//     }catch(err){
//         console.log('Error Occured');
//         console.log(err);
//     }
// }

async function nextPageFunction(currentPage){
    try{
        const results = await getFollowers(currentPage + 1);
        console.log(results);
        
        console.log(followersCount);
        const pagesCount = getPagesCount(followersCount);
        displayFollowers(results, currentPage + 1);
        
    }catch(err){
        main.html("");
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
        console.log('Error Occured');
        console.log(err);
    }
}

async function prevPageFunction(currentPage){
    try{
        const results = await getFollowers(currentPage - 1);
        console.log(results);
        
        console.log(followersCount);
        const pagesCount = getPagesCount(followersCount);
        displayFollowers(results, currentPage - 1);
        
    }catch(err){
        main.html("")
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
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


function getUser(userIndex){
    return fetch(userIndex.url)
        .then(res => res.json())
}

async function createUserCol(userResult){
    const userCol = $("<div class='col-sm-5 inline-flex'></div>");
    const profileImage = $("<img class='profile-img'>");
    profileImage.attr('src',userResult.avatar_url);
    userCol.append(profileImage);
    const userName = $(`<a class='user-name' href='user.html'></a>`);
    let userNameText;
    if(userResult.name == null || userResult.name == undefined || userResult.name == ""){
        userNameText = userResult.login;
    }
    else{
        userNameText = userResult.name
    }
    userName.text(userNameText);
    userName.on('click', function(){
        return userPageFunction(userResult);
    })

    userCol.append(userName);

    return userCol;
}
async function createDescCol( userResult){
    const descCol = $("<div class='col-sm-7 desc-flex'></div>");

    const updatedDiv = $(`<div class='flex-end'></div>`);
    const lastUpdatedText = $(`<p class='small-text'>Last updated:</p>`);
    const updatedP = $(`<p class='small-text'></p>`);
    const date = new Date(userResult.updated_at);
    const updatedTime = date.toLocaleDateString();
    updatedP.text(updatedTime);
    updatedDiv.append(lastUpdatedText);
    updatedDiv.append(updatedP);

    descCol.append(updatedDiv);

    const descDivParent = $(`<div class='col-md-6 flex-center'></div>`);
    const descDiv = $(`<div class='col-flex'></div>`)
    
    const followersDiv = getFollowersDiv(userResult);

    descDiv.append(followersDiv);

    const reposDiv = getReposDiv(userResult);

    descDiv.append(reposDiv);
    const gitDiv = getGitDiv(user);
    descDiv.append(gitDiv);
    descDivParent.append(descDiv);
    descCol.append(descDivParent);

    return descCol;
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



function getReposDiv( userResult){
    const reposDiv = $(`<div class="no-wrap"></div>`);

    const reposIcon = $(`<i class="fa fa-folder"></i>`);
    reposDiv.append(reposIcon);

    const reposLink = $(`<a class='link' href='user.html'></a>`);
    reposLink.text('Repositories');
    reposLink.on('click', function(){
        return reposPageFunction(userResult);
    });
    reposLink.hover(function(){
        reposIcon.addClass('blue');
    });
    reposLink.mouseleave(function(){
        reposIcon.removeClass('blue');
    });
    reposDiv.append(reposLink);

    const reposCount = userResult.public_repos;
    const reposCountSpan = $(`<span></span>`);
    reposCountSpan.text(reposCount);
    reposDiv.append(reposCountSpan);

    return reposDiv;
}

function getFollowersDiv( userResult){
    const followersDiv = $(`<div class="no-wrap"></div>`);

    const followersIcon = $(`<i class="fa fa-users"></i>`);
    followersDiv.append(followersIcon);

    const followerLink = $(`<a class='link' href='user.html'></a>`);
    followerLink.text('Followers');
    followerLink.on('click', function(){
        return followersPageFuntion(userResult);
    });
    followerLink.hover(function(){
        followersIcon.addClass('blue');
    });
    followerLink.mouseleave(function(){
        followersIcon.removeClass('blue');
    });
    followersDiv.append(followerLink);

    const followersCount = userResult.followers;
    const followersCountSpan = $(`<span></span>`);
    followersCountSpan.text(followersCount);
    followersDiv.append(followersCountSpan);

    return followersDiv;
}

function reposPageFunction(userResult){
    setLocalStorage('user-result', JSON.stringify(userResult));
    setLocalStorage('tag', 'repos')
}

function followersPageFuntion(userResult){
    console.log('before: ' + userResult.login);
    setLocalStorage('user-result', JSON.stringify(userResult));
    setLocalStorage('tag', 'followers');
    
}

function userPageFunction(userResult){
    setLocalStorage('user-result', JSON.stringify(userResult));
    setLocalStorage('tag', 'user');
}

function setLocalStorage(key, value){
    localStorage.setItem(key, value);
}

async function getFollowers(page){
    const followersUrl = user.followers_url+ `?page=${page}&per_page=${perPage}`;

    try{
        const response = await fetch(followersUrl, {method:'GET'});
        const followers = await response.json();
        return followers;
    }catch(err){
        main.html("");
        const warningMessage = $(`<p class='text-center'>API Rate Limit Exceeded Please try after an hour</p>`);
        main.append(warningMessage);
        console.log('Error Occured');
        console.log(err);
    }
}
