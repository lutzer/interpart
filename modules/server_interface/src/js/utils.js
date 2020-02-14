function post(adress, data) {
    return fetch(adress, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
}

function get(address) {
    return fetch(address)
        .then(response => response.json())
}

export { post, get }