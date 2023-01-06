
// flag of onCache (is result retrived from cache or no)
let onCache = true

// a flag for status of search. if this flag is True, we should retrive top lang
let detailed = false

// get radio button element
let radio = document.querySelectorAll('input[name="search"]')

// set functionality of search button
async function searchButton() {
    onCache = true
    detailed = false
    event.preventDefault()
    
    let message = ""
    let id = document.getElementById('name').value 
    if (id == "") {
        message =     "<fieldset class='fieldset'> <legend> Status </legend> <p>" + "Please fill the input field" + "</p></fieldset>" 

        return message

    }

    
    // get id from local storgae
    let request = await JSON.parse(window.localStorage.getItem(id))
    let obj = null

    
    
    // if local storage doesn't have input ID ...
    if (request == null) {
        onCache = false
        
        let response = await fetch(`https://api.github.com/users/${id}`);
        console.log(1111)
        obj = await response.json()
        if (response.status != 200) {
            message ="<fieldset class='fieldset'> <legend> Status </legend> <p>" + "BAD Request" + "</p></fieldset>" 

            return message
        }
        window.localStorage.setItem(id, JSON.stringify(obj));
        
    } else {
        obj = request
    }

    if (radio[1].checked) {
        detailed = true
    }

    
    if (obj.bio == null) {
        obj.bio = "not existed"
    }

    if (obj.location == null) {
        obj.location = "not existed"
    }

    if (obj.blog.length == 0) {
        obj.blog = "not existed"
    }

    if (obj.name == null) {
        obj.name = "not existed"
    }

    // set response message for user
    message =  
    "<input type='image' width='100px' height='100px' id='profilePhoto' src=" + obj.avatar_url + ">" +
    "<fieldset class='fieldset'> <legend> Request Status </legend> <p>" + "status : 200 OK" + "</p></fieldset>" +
    "<fieldset class='fieldset'> <legend> Name </legend> <p>" + obj.name + "</p></fieldset>" +
    "<fieldset class='fieldset'> <legend> Blog </legend> <p>" + obj.blog + "</p></fieldset>" +
    "<fieldset class='fieldset'> <legend> Location </legend> <p>" + obj.location + "</p></fieldset>" +
    "<fieldset class = 'fieldset'> <legend> Bio </legend> <p>" +   obj.bio + "</p> </fieldset>" +
    "<fieldset class = 'fieldset'> <legend> On cache </legend> <p>" +   onCache + "</p> </fieldset>";

    // to retrive top language of user
    if (detailed) {
        message = message + await detailedSearch(id)

    }

    console.log(message)

    message = message.replace("null", "not existed")
    message.replace(null, "not existed")
    document.getElementById('result').style.display = 'block'
    

    return message


    
}


// function to retrive top language of user
async function detailedSearch(id) {
    let repos = await fetch("https://api.github.com/users/"+ id + "/repos?sort=pushed_at")
    repos = await repos.json()
    let lang = {}
    for (let i = 0; i<5; i++) {
        if (repos[i]['language'] != null) {
            if (lang[repos[i]['language']]) {
                lang[repos[i]['language']] = lang[repos[i]['language']] + 1
            } else {
                lang[repos[i]['language']] = 1
            }
            
        }
    }

    const sort_lang = [...Object.keys(lang)].sort((a, b) => lang[b] - lang[a])

    let msg = "<fieldset class = 'fieldset'> <legend> Favorite language </legend> <span style='white-space: pre-wrap'> " + sort_lang[0] + "</span> </fieldset>";
    return msg

}

// On click function for search button
async function clickSearchButton() {
    let result = document.getElementById("result-container")
    result.innerHTML = await searchButton()
}

