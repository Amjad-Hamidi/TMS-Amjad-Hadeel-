
// Function to store a value in localStorage
function storeInLocalStorage(key:string, value:string) {
    // Ensure the value is converted to a string (if it's not already)
    localStorage.setItem(key, JSON.stringify(value));
}


// Function to retrieve a value from localStorage
function getFromLocalStorage(key:string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null ; // Return parsed value or null if not found
}

// Function to remove a value from localStorage
function removeFromLocalStorage(key:string) {
    const value = localStorage.getItem(key);
    
     value ? localStorage.removeItem(key):null 
     // Return parsed value or null if not found
}


const userInfo=getFromLocalStorage('user')?getFromLocalStorage('user'):{id:'',token:'',type:''}


export {
    getFromLocalStorage,
    storeInLocalStorage,
    removeFromLocalStorage,
    userInfo
}