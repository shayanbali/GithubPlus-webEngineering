let onCache = true
let detailed = false
let radio = document.querySelectorAll('input[name="search"]')

async function searchButton() {
    event.preventDefault()
    
    let message = ""
    let id = document.getElementById('name').value 
    if (id == "") {
        message =     "<fieldset class='fieldset'> <legend> Status </legend> <p>" + "Please fill the input field" + "</p></fieldset>" 

        return message

    }

    

    let request = await JSON.parse(window.localStorage.getItem(id))
    let obj = null

    
    

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

    

    message =  
    "<input type='image' width='100px' height='100px'  src=" + obj.avatar_url + ">" +
    "<fieldset class='fieldset'> <legend> Status </legend> <p>" + "status : 200 OK" + "</p></fieldset>" +
    "<fieldset class='fieldset'> <legend> Name </legend> <p>" + obj.name + "</p></fieldset>" +
    "<fieldset class='fieldset'> <legend> Blog </legend> <p>" + obj.blog + "</p></fieldset>" +
    "<fieldset class='fieldset'> <legend> Location </legend> <p>" + obj.location + "</p></fieldset>" +
    "<fieldset class = 'fieldset'> <legend> Bio </legend> <span style='white-space: pre-wrap'> " + obj.bio + "</span> </fieldset>";

    if (detailed) {
        message = message + await detailedSearch(id)

    }

    console.log(message)

    return message



    




    
    // fetch('api/sdjflsd').then(res => res.json()).then(res => {

    // }).catch(err => {

    // })
    
}



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


async function clickSearchButton() {
    let result = document.getElementById("result-container")
    result.innerHTML = await searchButton()
}