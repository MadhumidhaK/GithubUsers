const user = JSON.parse(localStorage.getItem("user-result"));
const main = $('.main');
let userName;
if(user.name == null || user.name == undefined  || user.name == ""){
    userName = user.login;
}
else{
    userName = user.name
}
document.title =  "Followers - " + userName;
const perPage = 6;
const followersCount = user.followers;

$(document).ready(async function(){
    displayHeading();

    const followers = await getFollowers(1);
    displayFollowers(followers);

})


function displayHeading(){
    const heading = $('.heading');
    heading.text(userName);
}

async function displayFollowers(followers){
    
    main.html("");
    const length = followers.length;
    let rows = parseInt(length/3);
    if(length % 3 != 0) rows++;
    
    let follower = 1;
    for(let row = 0; row < rows; row++){
        const rowDiv = $("<div class='row fol-row'></div>");
        follower--;
        let i = 0;
        while(i < 3 && follower < length){
            const followerCol = $(`<div class='col-md-4'></div>`);
            const followerDiv = $(`<div class='col-md-12'></div>`);
            const userResult = await getUser(followers[follower]);   
            console.log(userResult)       
            const userCol = await createUserCol(userResult);
            followerDiv.append(userCol)
            const descCol = await createDescCol(userResult);
            followerDiv.append(descCol);
            followerCol.append(followerDiv);
            rowDiv.append(followerCol);
            follower++;
            i++;
        }

        main.append(rowDiv);
        
    }
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
        displayResults(results, currentPage + 1, pagesCount);
        
    }catch(err){
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
        return (totalCount / perPage) + 1;
    }
}


function getUser(userIndex){
    return fetch(userIndex.url)
        .then(res => res.json())
}

async function createUserCol(userResult){
    const userCol = $("<div class='col-md-5 inline-flex'></div>");
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
    const descCol = $("<div class='col-md-7 desc-flex'></div>");

    const updatedDiv = $(`<div class='flex-end'></div>`);
    const lastUpdatedText = $(`<p class='small-text'>Last updated:</p>`);
    const updatedP = $(`<p class='small-text'></p>`);
    const date = new Date(userResult.updated_at);
    const updatedTime = date.toLocaleString();
    updatedP.text(updatedTime);
    updatedDiv.append(lastUpdatedText);
    updatedDiv.append(updatedP);

    descCol.append(updatedDiv);

    const descDiv = $(`<div class='col-flex'></div>`)
    
    const followersDiv = getFollowersDiv(userResult);

    descDiv.append(followersDiv);

    const reposDiv = getReposDiv(userResult);

    descDiv.append(reposDiv);

    descCol.append(descDiv);

    return descCol;
}



function getReposDiv( userResult){
    const reposDiv = $(`<div></div>`);

    const reposIcon = $(`<i class="fa fa-folder"></i>`);
    reposDiv.append(reposIcon);

    const reposLink = $(`<a class='link' href='repos.html'></a>`);
    reposLink.text('Repositories');
    reposLink.on('click', function(){
        return reposPageFunction(userResult);
    });
    reposDiv.append(reposLink);

    const reposCount = userResult.public_repos;
    const reposCountSpan = $(`<span></span>`);
    reposCountSpan.text(reposCount);
    reposDiv.append(reposCountSpan);

    return reposDiv;
}

function getFollowersDiv( userResult){
    const followersDiv = $(`<div></div>`);

    const followersIcon = $(`<i class="fa fa-users"></i>`);
    followersDiv.append(followersIcon);

    const followerLink = $(`<a class='link' href='followers.html'></a>`);
    followerLink.text('Followers');
    followerLink.on('click', function(){
        return followersPageFuntion(userResult);
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
}

function followersPageFuntion(userResult){
    console.log('before: ' + userResult.login);
    setLocalStorage('user-result', JSON.stringify(userResult));
}

function userPageFunction(userResult){
    setLocalStorage('user-result', JSON.stringify(userResult));
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
        console.log('Error Occured');
        console.log(err);
    }
}